import axios from 'axios';
import config from '../config';
import { getTokenFromLocalStorage } from './tokenManagement';

const HOST = config.backend_url;

const getConfig = (header = 'auth') => {
  const token = getTokenFromLocalStorage();
  if (!token) return {};

  const headers = { Authorization: `Bearer ${token}` };
  return header === 'auth' ? { headers } : { headers: { ...headers, 'Content-Type': 'application/json' } };
};

const API = {
  auth: (credentials) => axios.post(`${HOST}/auth`, credentials, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.data),

  post: ({ url, body, header }) => axios.post(`${HOST}${url}`, body, getConfig(header))
    .then((response) => response.data),

  get: (url) => axios.get(`${HOST}${url}`, getConfig())
    .then((response) => response.data)
};

export default API;
