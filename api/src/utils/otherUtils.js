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
  login(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    // For the given username fetch user from DB
    const mockedUsername = 'admin';
    const mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        const token = jwt.sign({username: username},
            config.secret,
            {
              expiresIn: '24h', // expires in 24 hours
            },
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token,
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password',
        });
      }
    } else {
      res.send(400).json({
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
    res.json({
      success: true,
      message: 'Index page',
    });
  }
}
