import axios from 'axios';
import io from 'socket.io-client';
import config from '../config';
import { getTokenFromLocalStorage } from './tokenManagement';

export const socket = io.connect('ws://localhost:8080');

export const SocketEvents = {
  jobsFresh: 'jobs+fresh',
};

const HOST = config.backend_url;

const getConfig = (header) => {
  const token = getTokenFromLocalStorage();
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
