import {
  all, put, call, take, fork, takeLatest, select
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Record } from 'immutable';
import { name } from '../../../package.json';
import apiService, { SocketEvents, socket } from '../../utils/API';
import { errorSaga } from './error';

/**
   * Constants
   * */
export const moduleName = 'game';
const prefix = `${name}/${moduleName}`;

export const CREATE_GAME_REQUEST = `${prefix}/CREATE_GAME_REQUEST`;
export const CREATE_GAME_START = `${prefix}/CREATE_GAME_START`;
export const CREATE_GAME_SUCCESS = `${prefix}/CREATE_GAME_SUCCESS`;
export const CREATE_GAME_ERROR = `${prefix}/CREATE_GAME_ERROR`;

export const START_GAME_REQUEST = `${prefix}/START_GAME_REQUEST`;
export const START_GAME_START = `${prefix}/START_GAME_START`;
export const START_GAME_SUCCESS = `${prefix}/START_GAME_SUCCESS`;
export const START_GAME_ERROR = `${prefix}/START_GAME_ERROR`;

export const GAME_UPDATED = `${prefix}/GAME_UPDATED`;


/**
   * Reducer
   * */
export const ReducerRecord = Record({
  game: null,
  loading: true,
  loaded: false
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case CREATE_GAME_START:
    case START_GAME_START:
      return state.set('error', null);

    case CREATE_GAME_SUCCESS:
    case START_GAME_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('game', payload.game);

    case CREATE_GAME_ERROR:
    case START_GAME_ERROR:
      return state
        .set('error', error);

    default:
      return state;
  }
}

/**
   * Selectors
   * */
export const gameSelector = (state) => state[moduleName].game;
export const loadingSelector = (state) => state[moduleName].loading;


/**
   * Action Creators
   * */
export const createGame = () => ({
  type: CREATE_GAME_REQUEST
});

export const startGame = () => ({
  type: START_GAME_REQUEST
});

/**
   * Sagas
   * */
export const createGameSaga = function* ({ payload }) {
  yield put({
    type: CREATE_GAME_START
  });

  try {
    const newGame = yield call(apiService.post, { url: '/game', body: null, header: null });
    yield put({
      type: CREATE_GAME_SUCCESS,
      payload: { game: newGame }
    });
  } catch (error) {
    yield put({
      type: CREATE_GAME_ERROR,
      payload: { saga: createGameSaga, sagaPayload: payload },
      error
    });
  }
};

export const startGameSaga = function* ({ payload }) {
  yield put({
    type: START_GAME_START
  });
  const thisGame = yield select(gameSelector);
  if (thisGame) {
    const { gameId } = thisGame;
    try {
      const startedGame = yield call(apiService.put, { url: `/game/${gameId}`, body: null, header: null });

      yield put({
        type: START_GAME_SUCCESS,
        payload: { game: startedGame?.error ? { ...thisGame, error: startedGame?.error } : startedGame }
      });
    } catch (error) {
      yield put({
        type: START_GAME_ERROR,
        payload: { saga: createGameSaga, sagaPayload: payload },
        error
      });
    }
  }
};

const createEventChannel = () => eventChannel((emitter) => {
  socket.on(SocketEvents.jobsFresh, emitter);
  return () => socket.removeListener(SocketEvents.jobsFresh, emitter);
});

export const realtimeSyncSaga = function* () {
  const chanel = yield call(createEventChannel);
  while (true) {
    const gameUpdates = yield take(chanel);
    yield put({
      type: GAME_UPDATED,
      payload: { gameUpdates }
    });
  }
};

export function* saga() {
  yield all([
    takeLatest(START_GAME_ERROR, errorSaga),
    takeLatest(CREATE_GAME_ERROR, errorSaga),
    takeLatest(START_GAME_REQUEST, startGameSaga),
    takeLatest(CREATE_GAME_REQUEST, createGameSaga),
  ]);
  yield fork(realtimeSyncSaga);
}
