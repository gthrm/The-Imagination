import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import io from 'socket.io';
import 'log-timestamp';

// Разкомментировать в продакшене для подключения SSL сертификата
// import https from 'https';
// import path from 'path';

import http from 'http';

// Разкомментировать в продакшене для подключения SSL сертификата
// import fs from 'fs';

import myAsyncAuthorizer from './utils/AsyncAuthorizer';
import * as db from './utils/DataBaseUtils';
import {serverPort} from '../etc/config.json';
import Game from './utils/game';

const port = process.env.PORT || serverPort;
const game = new Game();
// Разкомментировать в продакшене для подключения SSL сертификата
// const options = {
//     key: fs.readFileSync(path.join(__dirname, '../../../etc/letsencrypt/live/site.ru', 'privkey.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../../../etc/letsencrypt/live/site.ru', 'fullchain.pem'))
// }

const app = express();

db.setUpConnection();

app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(helmet());
app.use(
    basicAuth({
      authorizer: myAsyncAuthorizer,
      authorizeAsync: true,
    }),
);

// const server = https.createServer(options, app);
const server = http.createServer(app);

const socketio = io(server);

app.post('/auth', (req, res) => {
  db.getUserByUserName(req.body.login).then((data) => res.send(data)).catch((err) => res.send(err));
});

app.get('/users', (req, res) => {
  db.listUsers(req.query.page).then((data) => res.send(data)).catch((err) => res.send(err));
});

app.post('/user', (req, res) => {
  db.createUser(req.body)
      .then((data) => {
        console.log('post user ', data);
        if (data.error) {
          res.status(data.error.code || 500);
        }
        res.send(data);
      })
      .catch((err) => res.send(err));
});

app.get('/game/:gameId', (req, res) => {
  const findGame = game.findGame(req.params.gameId);
  res.send(findGame);
});

app.post('/game', (req, res) => {
  // const game = createGame();
  res.send(game.createGame());
});

app.put('/game/:gameId', (req, res) => {
  const startgame = game.startGame(req.params.gameId, socketio);
  res.send(startgame);
});

app.post('/test/:gameId', (req, res) => {
  const startgame = game.test(req.params.gameId, socketio);
  res.send(startgame);
});

app.post('/player/:playerName/:gameId', (req, res) => {
  const message = game.playerJoins(req.params.playerName, req.params.gameId, socketio);
  res.send(message);
});

app.get('/items', (req, res) =>
  db.listItems(req.query.page, req.query.expiried)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.get('/items/:id', (req, res) =>
  db.getItems(req.params.id)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.post('/items', (req, res) =>
  db.createItems(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.patch('/items/:id', (req, res) =>
  db.updateItems(req.params.id, req.body)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

socketio.toHost = (gameId) => socketio.to(`${gameId.toLowerCase()}-host`);
socketio.toPlayers = (gameId) => socketio.to(`${gameId.toLowerCase()}-players`);

socketio.on('connection', (socket) => {
  // socket.emit('request', 'test'); // отправить событие в этот сокет
  // io.emit('broadcast', 'test'); // отправить событие на все подключенные сокеты
  console.log('a user connected');

  socket.on('join-game-host', (gameId) => {
    socket.join(`${gameId.toLowerCase()}-host`);
    console.log('host joined game ' + gameId);
  });

  socket.on('join-game-player', (gameId) => {
    socket.join(`${gameId.toLowerCase()}-players`);
    console.log('player joined game ' + gameId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, function() {
  console.log(`Express server listening on port ${port}`);
});
