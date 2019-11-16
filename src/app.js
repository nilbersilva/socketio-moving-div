import 'dotenv/config';
import express from 'express';
import path from 'path';
import 'express-async-errors';
import socketio from 'socket.io';
import http from 'http';
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.socket();
    this.middlewares();
    this.routes();
  }

  socket() {
    this.connectedUsers = {};
    this.io = socketio(this.server);

    const players = {};
    this.io.on('connection', socket => {
      socket.on('new player', () => {
        players[socket.id] = {
          x: 300,
          y: 300,
          t: 0,
        };
        this.io.sockets.to(socket.id).emit('state', players);
        this.io.sockets.emit('movement', {
          id: socket.id,
          player: players[socket.id],
        });
      });

      socket.on('disconnect', () => {
        this.io.sockets.emit('leave', socket.id);
        delete players[socket.id];
      });

      socket.on('movement', data => {
        const player = players[socket.id] || {};
        let t = 0;
        if (data.left) {
          player.x -= 5;
          t = -135;
        }
        if (data.up) {
          player.y -= 5;
          t = -45;
        }
        if (data.right) {
          player.x += 5;
          t = 45;
        }
        if (data.down) {
          player.y += 5;
          t = 135;
        }
        if (player.x < 10) player.x = 10;
        if (player.y < 10) player.y = 10;
        if (player.x > 752) player.x = 752;
        if (player.y > 562) player.y = 562;
        if (data.left && data.up) {
          t = -90;
        }
        if (data.right && data.up) {
          t = 0;
        }
        if (data.left && data.down) {
          t = 180;
        }
        if (data.right && data.down) {
          t = 90;
        }
        player.t = t;
        this.io.sockets.emit('playerchange', { id: socket.id, player });
      });
    });
  }

  middlewares() {
    this.app.set('port', process.env.PORT || 3333);
    this.app.use('/static', express.static(path.resolve(__dirname, 'static')));
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;
