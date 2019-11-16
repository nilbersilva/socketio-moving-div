# socketio-moving-div
Simple use o Socket IO for a Multiplayer Rocket Moving Div.
Server receives messages via SocketIO and sends the positions of the Rockets to all players, 
so that all Rockets SVG move to the same position on all players.

Inside /src/static/game.js 
Change const socket = io('http://YOUR IP ADDRES:3333/');
So that everybody can join you and move their rockets around!
