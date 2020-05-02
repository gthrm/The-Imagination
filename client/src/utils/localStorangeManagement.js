/* eslint-disable no-undef */
import { name } from '../../package.json';

export const setItemToLocalStorage = (itemName, value) => localStorage.setItem(`${name}-${itemName}`, JSON.stringify(value));

export const removeItemFromLocalStorage = (itemName) => localStorage.removeItem(`${name}-${itemName}`);

export const getItemFromLocalStorage = (itemName) => isJsonString(localStorage.getItem(`${name}-${itemName}`));

export const clearStorage = () => localStorage.clear();


export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return JSON.parse(str);
};
