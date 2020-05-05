import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import io from 'socket.io';
import 'log-timestamp';

// Разкомментировать в продакшене для подключения SSL сертификата
// import https from 'https';
import path from 'path';

import http from 'http';

// Разкомментировать в продакшене для подключения SSL сертификата
// import fs from 'fs';
import {HandlerGenerator} from './utils/otherUtils';
import {checkToken} from './utils/JWTAuthorizer';
import * as db from './utils/DataBaseUtils';
import {serverPort} from '../etc/config.json';
import Game from './utils/game';

const port = process.env.PORT || serverPort;
const game = new Game();
const handlers = new HandlerGenerator();

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

// const server = https.createServer(options, app);
const server = http.createServer(app);

const socketio = io(server);

app.post('/auth', handlers.login);

app.get('/upload/:id', (req, res) => {
  // console.log(req.params.id);
  res.sendFile(path.join(__dirname, `../assets/cards/${req.params.id}`));
});

app.get('/users', (req, res) => {
  db.listUsers(req.query.page).then((data) => res.send(data)).catch((err) => res.send(err));
});

app.post('/user', checkToken, (req, res) => {
  db.createUser(req.body)
      .then((data) => {
        // console.log('post user ', data);
        if (data.error) {
          res.status(data.error.code || 500);
        }
        res.send(data);
      })
      .catch((err) => res.send(err));
});

app.get('/game/:gameId', checkToken, (req, res) => {
  const findGame = game.findGame(req.params.gameId);
  if (findGame.error) {
    res.status(findGame.error.code || 500);
  }
  res.send(findGame);
});

app.post('/game', checkToken, (req, res) => {
  const gameData = game.createGame();
  if (gameData.error) {
    res.status(gameData.error.code || 500);
  }
  res.send(gameData);
});

app.put('/game/:gameId', checkToken, async (req, res) => {
  const startgame = await game.startGame(req.params.gameId, socketio);
  if (startgame.error) {
    res.status(startgame.error.code || 500);
  }
  res.send(startgame);
});

app.post('/test/:gameId', checkToken, checkToken, async (req, res) => {
  const cards = await game.assignPacks(req.params.gameId);
  // console.log('--- cards', cards);

  // const startgame = game.test(req.params.gameId, socketio);
  res.send(cards);
});

app.get('/player/:playerName/:gameId', checkToken, (req, res) => {
  const player = game.getPlayer(req.params.gameId, req.params.playerName);
  if (player.error) {
    res.status(player.error.code || 500);
  }
  res.send(player);
});

app.post('/player/:playerName/:gameId', checkToken, (req, res) => {
  const message = game.playerJoins(req.params.playerName, req.params.gameId, socketio);
  if (message.error) {
    res.status(message.error.code || 500);
  }
  res.send(message);
});

app.get('/cards/:playerName/:gameId', (req, res) => {
  const cards = game.getPlayerCards(req.params.playerName, req.params.gameId);
  if (cards.error) {
    res.status(cards.error.code || 500);
  }
  res.send(cards);
});

app.post('/turn/:playerName/:gameId', checkToken, (req, res) => {
  const message = game.turn(req.params.playerName, req.params.gameId, req.body, socketio);
  if (message.error) {
    res.status(message.error.code || 500);
  }
  res.send(message);
});

app.post('/throwcard/:playerName/:gameId', checkToken, (req, res) => {
  const message = game.throwcard(req.params.playerName, req.params.gameId, req.body, socketio);
  if (message.error) {
    res.status(message.error.code || 500);
  }
  res.send(message);
});

app.get('/items', checkToken, (req, res) =>
  db.listItems(req.query.page, req.query.expiried)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.get('/items/:id', checkToken, (req, res) =>
  db.getItems(req.params.id)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.post('/items', checkToken, (req, res) =>
  db.createItems(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.send(err)));

app.patch('/items/:id', checkToken, (req, res) =>
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
  console.log(`Express server listening on port ${port}, open`, 'chrome://inspect', 'to debug');
});
