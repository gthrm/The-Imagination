import jwt from 'jsonwebtoken';
import config from '../../etc/config.json';

/**
 * Проверка токена
 * @param {object} req - req
 * @param {object} res - res
 * @param {object} next - next
 * @return {object}
 */
const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401);
        return res.json({
          success: false,
          message: 'Token is not valid',
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401);
    return res.json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
