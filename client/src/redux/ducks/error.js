import {
  call,
  put,
  all,
  takeLatest
} from 'redux-saga/effects';
import { Record } from 'immutable';
import { name } from '../../../package.json';
import {
  getRefreshTokenFromLocalStorage,
  setTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  removeTokenFromLocalStorage
} from '../../utils/tokenManagement';

import { clearStorage, clearStorageWithoutToken } from '../../utils/localStorangeManagement';
import refreshPage from '../../utils/refreshPage';
import erorAlert, { getAlert } from '../../utils/erorAlert';
import apiService from '../../utils/API';

export const moduleName = 'error';
const prefix = `${name}/${moduleName}`;

/**
 * Constants
 * */
export const ERROR_REQUEST = `${prefix}/ERROR_REQUEST`;
export const ERROR_START = `${prefix}/ERROR_START`;
export const ERROR_SUCCESS = `${prefix}/ERROR_SUCCESS`;
export const ERROR_ERROR = `${prefix}/ERROR_ERROR`;

export const REFRESH_TOKEN_REQUEST = `${prefix}/REFRESH_TOKEN_REQUEST`;
export const REFRESH_TOKEN_START = `${prefix}/REFRESH_TOKEN_START`;
export const REFRESH_TOKEN_SUCCESS = `${prefix}/REFRESH_TOKEN_SUCCESS`;
export const REFRESH_TOKEN_ERROR = `${prefix}/REFRESH_TOKEN_ERROR`;

/**
 * Reducer
 * */
export const ReducerRecord = Record({
  accessToken: null,
  loading: true,
  error: null
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case REFRESH_TOKEN_START:
      return state
        .set('loading', true)
        .set('error', null);

    case REFRESH_TOKEN_SUCCESS:
      return state
        .set('loading', false)
        .set('accessToken', payload.accessToken)
        .set('error', null);

    case REFRESH_TOKEN_ERROR:
      return state
        .set('error', error)
        .set('loading', false);

    default:
      return state;
  }
}

/**
 * Selectors
 * */
export const loadingSelector = (state) => state[moduleName].loading;
export const errorSelector = (state) => state[moduleName].error;
export const activatedSelector = (state) => state[moduleName].activated;

/**
 * Sagas
 */
export const refreshTokenSaga = function* ({ payload }) {
  yield put({
    type: REFRESH_TOKEN_START
  });
  try {
    const refreshToken = yield call(getRefreshTokenFromLocalStorage);
    const newTokens = yield call(apiService.post, '/refresh', refreshToken);
    yield call(setTokenToLocalStorage, newTokens.access_token);
    yield call(setRefreshTokenToLocalStorage, newTokens.refresh_token);
    yield put({
      type: REFRESH_TOKEN_SUCCESS,
      payload: { newTokens }
    });
    if (payload?.saga) {
      yield call(payload.saga, { payload: payload.sagaPayload });
    }
  } catch (error) {
    yield put({
      type: REFRESH_TOKEN_ERROR,
      error
    });
    yield call(removeTokenFromLocalStorage);
  }
};

// eslint-disable-next-line no-unused-vars
export const errorSaga = function* ({ error, payload }) {
  yield put({
    type: ERROR_START
  });
  if (error?.response?.status) {
    switch (true) {
      case (error.response.status === 401 && error.response.data.message === 'Token is not valid') || (error.response.status === 401 && error.response.data.message === 'Auth token is not supplied'):
        yield call(getAlert, 'Ваш токен истек', 'Войдите в систему заново', refreshPage);
        yield call(clearStorage);
        // yield put({
        //   type: REFRESH_TOKEN_REQUEST,
        //   payload
        // });
        break;

      case (error.response.status === 401 && error.response.data.msg === 'Token has been revoked') || (error.response.status === 404 && error.response.data.message === 'User not found') || (error.response.status === 401 && error.response.data.message === 'Account not found'):
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        yield call(removeTokenFromLocalStorage);
        break;

      case error.response.status === 404 && error.response.data.message === 'Game does not exist':
      case error.response.status === 404 && error.response.data.message === 'This game does not exist.':
        yield call(getAlert, 'Игра не существует или уже завершилась', 'Создайте новую игру', refreshPage);
        yield call(clearStorageWithoutToken);
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'This game has too many players, please join a different game.':
        yield call(getAlert, 'В игре максимальное количество человек, присоеденитесь к другой игре', 'Присоеденитесь к другой игре');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'This playerName already exist.':
        yield call(getAlert, 'Игрок с таким имененм уже существует', 'Задайте другое имя');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'not enough cards in the card folder.':
        yield call(getAlert, 'Не достаточно карт для игры', 'Добавьте карты в папку с картами');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'This round has already started.':
        yield call(getAlert, 'Этот раунд уже начат', 'Присоеденитесь к другой игре');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'A game needs at least two players.':
        yield call(getAlert, 'В игре не достаточно игроков', 'Необходимо минимум трое');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 404 && error.response.data.message === 'player does not exist in this game.':
      case error.response.status === 404 && error.response.data.message === 'game does not exist.':
        yield call(getAlert, 'Игра или игрок с таким именем не найден', '', refreshPage);
        yield call(clearStorageWithoutToken);
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 404:
      case error.response.status === 400:
        yield call(getAlert, error?.response?.data?.message || 'Что-то пошло не так', '');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      default:
        yield call(erorAlert, error);
        // yield call(clearStorage);
        // yield call(refreshPage);

        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;
    }
  } else {
    yield call(erorAlert, error);
    yield put({
      type: ERROR_SUCCESS,
      error
    });
  }
};

export function* saga() {
  yield all([
    takeLatest(REFRESH_TOKEN_REQUEST, refreshTokenSaga),
    takeLatest(ERROR_REQUEST, errorSaga)
  ]);
}
