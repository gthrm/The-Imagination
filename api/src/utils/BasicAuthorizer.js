import * as bcrypt from 'bcrypt';
import * as db from './DataBaseUtils';

/**
 * Функция авторизации пользователя из базы
 * @param {string} username - имя пользователя
 * @param {string} password - пароль
 * @param {string} cb - callback
 */
export default async function myAsyncAuthorizer(username, password, cb) {
  try {
    const users = await db.getUserByUserName(username);
    const usersList = users.map(async (item) => ({
      ...item,
      valid: await bcrypt.compare(password, item.password),
    }));
    return Promise.all(usersList)
        .then(
            (completed) => {
              const itemOkList = completed.find((item) => item.valid === true && item._doc.name === username);
              if (cb) {
                if (itemOkList) {
                  return cb(null, true);
                }
                return cb(null, false);
              }
              if (itemOkList) {
                return true;
              }
              return false;
            });
  } catch (error) {
    (err) => console.error(err);
    return cb(null, false);
  }
}
