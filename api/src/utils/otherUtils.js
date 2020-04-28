import myAsyncAuthorizer from './BasicAuthorizer';
import jwt from 'jsonwebtoken';
import {secret} from '../../etc/config.json';
/**
 * Возвращает случайное число от min до max
 * @param {number} min - max
 * @param {number} max - max
 * @return {number}
 */
export function randomInteger(min, max) {
  // случайное число от min до (max+1)
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

/**
 * HandlerGenerator
 */
export class HandlerGenerator {
  /**
   * login
   * @param {object} req - max
   * @param {object} res - max
   */
  async login(req, res) {
    const login = req.body.login;
    const password = req.body.password;

    if (login && password) {
      const accessGranted = await myAsyncAuthorizer(login, password);
      console.log('accessGranted', accessGranted);

      if (accessGranted) {
        const token = jwt.sign(
            {login},
            secret,
            {
              expiresIn: '24h', // expires in 24 hours
            },
        );
        // return the JWT token for the future API calls
        res.send({
          success: true,
          message: 'Authentication successful!',
          token: token,
        });
      } else {
        res.status(403);
        res.send({
          success: false,
          message: 'Incorrect login or password',
        });
      }
    } else {
      res.status(400);
      res.send({
        success: false,
        message: 'Authentication failed! Please check the request',
      });
    }
  }

  /**
 * index
 * @param {object} req - max
 * @param {object} res - max
 */
  index(req, res) {
    res.send({
      success: true,
      message: 'Index page',
    });
  }
}
