import myAsyncAuthorizer from './BasicAuthorizer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import FileType from 'file-type';
import {secret} from '../../etc/config.json';

export const CARD_LENGTH = (playersLength) => playersLength * STARTING_HAND;
export const STARTING_HAND = 6;

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

/**
 * Читает карты из папки с картами
 * @param {string} dirnameExportImg - path
 * @return {object}
 */
export async function readDir(dirnameExportImg = '../../assets/cards') {
  const pathcards = path.join(__dirname, dirnameExportImg);
  const files = await fs.readdirSync(pathcards);
  const filesList = files.map(async (file) => ({
    file,
    type: await getFileType(file, pathcards),
  }));
  const imgFiles = await Promise.all(filesList);

  const cardsData = imgFiles.filter((file)=>file.type.isImg).map(
      (file) => ({fileName: file.file, path: `/upload/${file.file}`}),
  );
  return shuffle(cardsData);
}

/**
* Создает колоду карт
* @param {object}deck - deck
* @return {object}
*/
export function shuffle(deck) {
  const shuffleDeck = deck;
  if (Array.isArray(deck) && deck.length > 0) {
    for (let i = 0; i < randomInteger(1000, 3000); i++) {
      const location1 = Math.floor((Math.random() * deck.length));
      const location2 = Math.floor((Math.random() * deck.length));
      const tmp = deck[location1];
      deck[location1] = deck[location2];
      deck[location2] = tmp;
    }
  }
  return shuffleDeck;
}

/**
* Определить тип файла
* @param {string} file - file
* @param {string} pathcards - pathcards
* @return {object}
*/
export async function getFileType(file, pathcards) {
  if (file) {
    try {
      const pathToFile = pathcards + '/' + file;
      const fileType = await FileType.fromFile(pathToFile);
      const fileTypeData = {...fileType, isImg: !!fileType.mime.includes('image')};
      return fileTypeData;
    } catch (error) {
      // console.log('error', error);
      return {};
    }
  }
  return {};
}

export const SocketEvents = {
  joinGamePlayer: 'join-game-player',
  joinGameHost: 'join-game-host',
  gameStarted: 'game-started',
  turnChange: 'turn-change',
  showMessage: 'show-message',
  gameState: 'game-state',
  playerState: 'player-state',
  newTurn: 'new-turn',
};
