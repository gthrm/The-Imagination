/* eslint-disable no-undef */
const url = process.env.NODE_ENV === 'development' ? 'http://192.168.31.219:8080' : window.location.origin;

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
