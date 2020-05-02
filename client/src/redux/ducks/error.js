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

export const errorSaga = function* ({ error, payload }) {
  yield put({
    type: ERROR_START
  });
  if (error?.response?.status) {
    switch (true) {
      case (error.response.status === 401 && error.response.data.msg === 'Token has expired') || (error.response.status === 401 && error.response.data.message === 'Token has expired'):
        yield put({
          type: REFRESH_TOKEN_REQUEST,
          payload
        });
        break;

      case (error.response.status === 401 && error.response.data.msg === 'Token has been revoked') || (error.response.status === 404 && error.response.data.message === 'User not found') || (error.response.status === 401 && error.response.data.message === 'Account not found'):
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        yield call(removeTokenFromLocalStorage);
        break;

      case error.response.status === 400 && error.response.data.message === 'Date range is being overflowed by existing booking':
        yield call(getAlert, 'Ошибка', 'Выбранное вами время уже занято');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 404 && error.response.data.error.message === 'Game does not exist':
        yield call(getAlert, 'Ошибка', 'Игра не существует или уже завершилась, создайте новую игру');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.error.message === 'This game has too many players, please join a different game.':
        yield call(getAlert, 'Ошибка', 'В игре максимальное количество человек, присоеденитесь к другой игре');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 400 && error.response.data.message === 'No suitable tables found':
        yield call(getAlert, 'Ошибка', 'Нет свободных мест на выбранную вами дату и время');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 403 && error.response.data.message === 'Email is not confirmed':
        // eslint-disable-next-line no-useless-escape
        yield call(getAlert, 'Ошибка', 'Ваш аккаунт не подтвержден.');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      case error.response.status === 403 && error.response.data.message === "Can't create booking in the past":
        // eslint-disable-next-line no-useless-escape
        yield call(getAlert, 'Ошибка', 'Нельзя забронировать в прошлом ¯\_(ツ)_/¯');
        yield put({
          type: ERROR_SUCCESS,
          error
        });
        break;

      default:
        yield call(erorAlert, error);
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
