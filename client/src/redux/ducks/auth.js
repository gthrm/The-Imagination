/* eslint-disable camelcase */
import {
  put,
  call,
  all,
  takeLatest
} from 'redux-saga/effects';
import { Record } from 'immutable';
import { name } from '../../../package.json';
import apiService from '../../utils/API';
import {
  removeTokenFromLocalStorage, setTokenToLocalStorage
} from '../../utils/tokenManagement';
import {
  setItemToLocalStorage,
  getItemFromLocalStorage
} from '../../utils/localStorangeManagement';
import { errorSaga } from './error';
import {
  GAME_RESTORED_REQUEST,
  JOIN_GAME_REQUEST,
  FETCH_PLAYER_REQUEST
} from './game';


/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${name}/${moduleName}`;

export const SIGN_IN_REQUEST = `${prefix}/SIGN_IN_REQUEST`;
export const SIGN_IN_START = `${prefix}/SIGN_IN_START`;
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`;

export const LOG_IN_REQUEST = `${prefix}/LOG_IN_REQUEST`;
export const LOG_IN_START = `${prefix}/LOG_IN_START`;
export const LOG_IN_SUCCESS = `${prefix}/LOG_IN_SUCCESS`;
export const LOG_IN_ERROR = `${prefix}/LOG_IN_ERROR`;

export const LOG_OUT_REQUEST = `${prefix}/LOG_OUT_REQUEST`;
export const LOG_OUT_START = `${prefix}/LOG_OUT_START`;
export const LOG_OUT_SUCCESS = `${prefix}/LOG_OUT_SUCCESS`;
export const LOG_OUT_ERROR = `${prefix}/LOG_OUT_ERROR`;

export const ENTER_REQUEST = `${prefix}/ENTER_REQUEST`;
export const ENTER_START = `${prefix}/ENTER_START`;
export const ENTER_SUCCESS = `${prefix}/ENTER_SUCCESS`;
export const ENTER_ERROR = `${prefix}/ENTER_ERROR`;

/**
 * Reducer
 * */
export const ReducerRecord = Record({
  auth: null,
  loading: true,
  enterMessage: null,
  error: null,
  enter: false,
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case ENTER_START:
      return state
        .set('loading', true)
        .set('error', null);

    case LOG_OUT_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null);

    case SIGN_IN_START:
    case LOG_IN_START:
      return state
        .set('error', null)
        .set('loading', true);

    case SIGN_IN_SUCCESS:
    case LOG_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('auth', payload.auth)
        .set('error', null);

    case SIGN_IN_ERROR:
    case LOG_IN_ERROR:
      return state
        .set('loading', false)
        .set('error', null);

    case ENTER_SUCCESS:
      return state
        .set('enterMessage', payload.enterMessage)
        .set('enter', true)
        .set('loading', false)
        .set('error', null);

    case ENTER_ERROR:
      return state
        .set('enter', false)
        .set('error', error);

    default:
      return state;
  }
}

/**
 * Selectors
 * */
export const authSelector = (state) => state[moduleName].auth;
export const loadingSelector = (state) => state[moduleName].loading;
export const enterSelector = (state) => state[moduleName].enter;
export const enterMessageSelector = (state) => state[moduleName].enterMessage;
export const errorSelector = (state) => state[moduleName].error;

/**
 * Action Creators
 * */
export const signIn = () => ({
  type: SIGN_IN_REQUEST
});

export const logIn = ({ credentials, next }) => ({
  type: LOG_IN_REQUEST,
  payload: { credentials, next }
});

export const logOut = () => ({
  type: LOG_OUT_REQUEST
});

/**
 * Sagas
 */
export const logOutSaga = function* () {
  yield put({
    type: LOG_OUT_START
  });
  const logOutData = {}; // объект с датой, если требуется в доке
  try {
    yield call(apiService.post, '/logout', logOutData);
    yield put({
      type: LOG_OUT_SUCCESS
    });
    yield call(removeTokenFromLocalStorage);
  } catch (error) {
    yield put({
      type: LOG_OUT_ERROR,
      payload: { saga: logOutSaga, sagaPayload: null },
      error
    });
  }
};

export const logInSaga = function* ({ payload }) {
  yield put({
    type: LOG_IN_START
  });
  if (!payload.credentials) {
    yield put({
      type: LOG_IN_ERROR
    });
    return;
  }
  try {
    const auth = yield call(apiService.auth, payload.credentials);
    if (auth) {
      yield call(setItemToLocalStorage, 'auth', auth);
      yield call(setTokenToLocalStorage, auth.token);
    }
    yield put({
      type: LOG_IN_SUCCESS,
      payload: { auth }
    });
    if (payload.next) {
      console.log('next', payload.next);

      yield call(payload.next);
    }
  } catch (error) {
    yield put({
      type: LOG_IN_ERROR,
      payload: { saga: logInSaga, sagaPayload: payload },
      error
    });
  }
};

export const singInSaga = function* () {
  yield put({
    type: SIGN_IN_START
  });

  const auth = yield call(getItemFromLocalStorage, 'auth');
  const restoredGame = yield call(getItemFromLocalStorage, 'game');
  const you = yield call(getItemFromLocalStorage, 'you');

  if (!auth) {
    yield put({
      type: SIGN_IN_ERROR
    });
    return;
  }
  yield call(setTokenToLocalStorage, auth.token);
  yield put({
    type: SIGN_IN_SUCCESS,
    payload: {
      auth
    }
  });
  if (restoredGame) {
    yield put({
      type: GAME_RESTORED_REQUEST,
      payload: { game: restoredGame }
    });
  }
  if (you) {
    const { playerName, gameId } = you;
    yield put({
      type: FETCH_PLAYER_REQUEST,
      payload: { playerName, gameId }
    });

    yield put({
      type: JOIN_GAME_REQUEST,
      payload: { playerName, gameId }
    });
  }
};

export const enterSaga = function* () {
  yield put({
    type: ENTER_START
  });
  const enterData = {}; // объект с датой, который требуется в доке
  try {
    const enterMessage = yield call(apiService.post, '/enter', enterData);
    yield put({
      type: ENTER_SUCCESS,
      payload: { enterMessage }
    });
  } catch (error) {
    yield put({
      type: ENTER_ERROR,
      payload: { saga: enterSaga, sagaPayload: null },
      error
    });
  }
};

export function* saga() {
  yield all([
    takeLatest(ENTER_ERROR, errorSaga),
    takeLatest(SIGN_IN_ERROR, errorSaga),
    takeLatest(LOG_OUT_REQUEST, logOutSaga),
    takeLatest(SIGN_IN_REQUEST, singInSaga),
    takeLatest(LOG_IN_REQUEST, logInSaga)
  ]);
}
