/* eslint-disable no-undef */
import { name } from '../../package.json';

export const setTokenToLocalStorage = (token) => localStorage.setItem(`${name}-token`, token);

export const setRefreshTokenToLocalStorage = (token) => localStorage.setItem(`${name}-refresh-token`, token);

export const removeTokenFromLocalStorage = () => localStorage.removeItem(`${name}-token`);

export const getTokenFromLocalStorage = () => localStorage.getItem(`${name}-token`);

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem(`${name}-refresh-token`);

export const isTokenExist = () => {
  const token = getTokenFromLocalStorage();
  return token && token !== 'null';
};
