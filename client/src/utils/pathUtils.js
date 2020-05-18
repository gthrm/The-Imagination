/* eslint-disable no-undef */
import config from '../config';

const dev = process.env.NODE_ENV !== 'production';
const url = `${dev ? 'http' : 'https'}://${config.backend_url}`;

const getPath = (path) => {
  if (path) {
    let pathUrl;
    if (path.match(/http/gi)) {
      pathUrl = path;
    } else {
      path[0] === '/' ? pathUrl = `${url}${path}` : pathUrl = `${path}`;
    }
    return pathUrl;
  }
  return null;
};

export default getPath;
