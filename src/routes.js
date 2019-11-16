import { Router } from 'express';
import path from 'path';

const routes = new Router();

routes.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

export default routes;
