import axios from 'axios';
import io from 'socket.io-client';
import config from '../config';
import { getTokenFromLocalStorage } from './tokenManagement';

const dev = process.env.NODE_ENV !== 'production';
const HOST = `${dev ? 'http' : 'https'}://${config.backend_url}`;
const WS = `${dev ? 'ws' : 'wss'}://${config.backend_url}`;
export const socket = io.connect(WS);

export const SocketEvents = {
  joinGamePlayer: 'join-game-player',
  joinGameHost: 'join-game-host',
  gameStarted: 'game-started',
  turnChange: 'turn-change',
  showMessage: 'show-message',
  gameState: 'game-state',
  playerState: 'player-state',
  newTurn: 'new-turn',
  gameOver: 'game-over',
};

const getConfig = (header) => {
  const token = getTokenFromLocalStorage();
  // console.log('--- token', token);
  if (!token) return {};
  const headers = { Authorization: `Bearer ${token}` };
  return header === 'auth' ? { headers } : { headers: { ...headers, 'Content-Type': 'application/json' } };
};

const API = {
  auth: (credentials) => axios.post(`${HOST}/auth`, credentials, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.data)
    .catch((error) => { throw error; }),

  post: ({ url, body, header }) => axios.post(`${HOST}${url}`, body, getConfig(header))
    .then((response) => response.data)
    .catch((error) => { throw error; }),

  put: ({ url, body, header }) => axios.put(`${HOST}${url}`, body, getConfig(header))
    .then((response) => response.data)
    .catch((error) => { throw error; }),

  get: (url) => axios.get(`${HOST}${url}`, getConfig('auth'))
    .then((response) => response.data)
    .catch((error) => { throw error; }),
};

export default API;
