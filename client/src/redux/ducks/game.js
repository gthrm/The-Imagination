import {
  all, put, call, take, fork, takeLatest, select
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Record } from 'immutable';
import showMessage from '../../utils/notificationUtils';
import { name } from '../../../package.json';
import {
  setItemToLocalStorage
} from '../../utils/localStorangeManagement';
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

export const JOIN_GAME_REQUEST = `${prefix}/JOIN_GAME_REQUEST`;
export const JOIN_GAME_START = `${prefix}/JOIN_GAME_START`;
export const JOIN_GAME_SUCCESS = `${prefix}/JOIN_GAME_SUCCESS`;
export const JOIN_GAME_ERROR = `${prefix}/JOIN_GAME_ERROR`;

export const GAME_RESTORED_REQUEST = `${prefix}/GAME_RESTORED_REQUEST`;
export const GAME_RESTORED_START = `${prefix}/GAME_RESTORED_START`;
export const GAME_RESTORED_SUCCESS = `${prefix}/GAME_RESTORED_SUCCESS`;
export const GAME_RESTORED_ERROR = `${prefix}/GAME_RESTORED_ERROR`;

export const FETCH_PLAYER_REQUEST = `${prefix}/FETCH_PLAYER_REQUEST`;
export const FETCH_PLAYER_START = `${prefix}/FETCH_PLAYER_START`;
export const FETCH_PLAYER_SUCCESS = `${prefix}/FETCH_PLAYER_SUCCESS`;
export const FETCH_PLAYER_ERROR = `${prefix}/FETCH_PLAYER_ERROR`;

export const GAME_UPDATED = `${prefix}/GAME_UPDATED`;
export const GAME_RESTORED = `${prefix}/GAME_RESTORED`;

export const REALTIME_GAME_STATUS_UPDATED = `${prefix}/REALTIME_GAME_STATUS_UPDATED`;
export const REALTIME_TURN_CHANGED = `${prefix}/REALTIME_TURN_CHANGED`;
export const REALTIME_SHOW_MESSAGE = `${prefix}/REALTIME_SHOW_MESSAGE`;

export const FETCH_CARD_SUCCESS = `${prefix}/FETCH_CARD_SUCCESS`;


/**
   * Reducer
   * */
export const ReducerRecord = Record({
  game: null,
  you: null,
  player: null,
  yourCards: [],
  turn: null,
  gameStatusMessage: null,
  showMessage: null,
  joinData: null,
  loading: true
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case CREATE_GAME_START:
    case START_GAME_START:
    case JOIN_GAME_START:
    case FETCH_PLAYER_START:
      return state.set('error', null);

    case CREATE_GAME_SUCCESS:
    case START_GAME_SUCCESS:
    case GAME_RESTORED_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('game', payload.game);

    case JOIN_GAME_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('you', payload.you)
        .set('joinData', payload.joinData);

    case FETCH_PLAYER_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('player', payload.player);

    case REALTIME_GAME_STATUS_UPDATED:
      return state
        .set('gameStatusMessage', payload.gameStatusMessage)
        .set('error', null);

    case REALTIME_TURN_CHANGED:
      return state
        .set('turn', payload.turn)
        .set('error', null);

    case REALTIME_SHOW_MESSAGE:
      return state
        .set('showMessage', payload.showMessage)
        .set('error', null);

    case FETCH_CARD_SUCCESS:
      return state
        .set('yourCards', payload.yourCards)
        .set('error', null);

    case CREATE_GAME_ERROR:
    case START_GAME_ERROR:
    case JOIN_GAME_ERROR:
    case FETCH_PLAYER_ERROR:
      return state
        .set('loading', false)
        .set('error', error);

    default:
      return state;
  }
}

/**
   * Selectors
   * */
export const gameSelector = (state) => state[moduleName].game;
export const playerSelector = (state) => state[moduleName].player;
export const turnSelector = (state) => state[moduleName].turn;
export const youSelector = (state) => state[moduleName].you;
export const gameStatusMessageSelector = (state) => state[moduleName].gameStatusMessage;
export const joinDataSelector = (state) => state[moduleName].joinData;
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

export const joinGame = ({ playerName, gameId }) => ({
  type: JOIN_GAME_REQUEST,
  payload: { playerName, gameId }
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
    yield call(setItemToLocalStorage, 'game', newGame);
    socket.emit(SocketEvents.joinGameHost, newGame.gameId);
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
      const gameFata = startedGame?.error ? { ...thisGame, error: startedGame?.error } : startedGame;
      yield call(setItemToLocalStorage, 'game', gameFata);

      yield put({
        type: START_GAME_SUCCESS,
        payload: { game: gameFata }
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

export const joinGameSaga = function* ({ payload }) {
  yield put({
    type: JOIN_GAME_START
  });
  if (payload.playerName && payload.gameId) {
    try {
      const joinData = yield call(apiService.post, { url: `/player/${payload.playerName}/${payload.gameId}`, body: null, header: null });
      yield call(setItemToLocalStorage, 'you', {
        playerName: payload.playerName,
        gameId: payload.gameId
      });
      yield put({
        type: JOIN_GAME_SUCCESS,
        payload: {
          joinData,
          you: {
            playerName: payload.playerName,
            gameId: payload.gameId
          }
        }
      });
      socket.emit(SocketEvents.joinGamePlayer, payload.gameId);
      // const you = yield select(youSelector);
      // if (you) {
      //   const { playerName, gameId } = you;
      //   yield put({
      //     type: FETCH_PLAYER_REQUEST,
      //     payload: { playerName, gameId }
      //   });
      // }
    } catch (error) {
      yield put({
        type: JOIN_GAME_ERROR,
        payload: { saga: joinGameSaga, sagaPayload: payload },
        error
      });
    }
  }
};

export const fetchPlayerSaga = function* ({ payload }) {
  yield put({
    type: FETCH_PLAYER_START
  });
  if (payload.playerName && payload.gameId) {
    try {
      const player = yield call(apiService.get, `/player/${payload.playerName}/${payload.gameId}`);

      yield put({
        type: FETCH_PLAYER_SUCCESS,
        payload: { player }
      });
    } catch (error) {
      yield put({
        type: FETCH_PLAYER_ERROR,
        payload: { saga: fetchPlayerSaga, sagaPayload: payload },
        error
      });
    }
  }
};

export const restoredGameSaga = function* ({ payload }) {
  yield put({
    type: GAME_RESTORED_START
  });
  if (payload.game) {
    const { gameId } = payload.game;
    try {
      const restoredGame = yield call(apiService.get, `/game/${gameId}`);
      console.log('restoredGame', restoredGame);

      yield put({
        type: GAME_RESTORED_SUCCESS,
        payload: { game: restoredGame }
      });
      socket.emit(SocketEvents.joinGameHost, gameId);
    } catch (error) {
      yield put({
        type: GAME_RESTORED_ERROR,
        payload: { saga: restoredGameSaga, sagaPayload: payload },
        error
      });
    }
  }
};

const createGameStartedEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.gameStarted, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.gameStarted, emitter);
  };
  return eventChannel(subscribe);
};

export const gameStartedRealtimeSyncSaga = function* () {
  const chanel = yield call(createGameStartedEventChannel);

  while (true) {
    const gameStatusMessage = yield take(chanel);
    const player = yield select(youSelector);
    const yourCards = yield call(apiService.get, `/cards/${player.playerName}/${player.gameId}`);
    if (yourCards.waiting) {
      showMessage({ message: 'Игра скоро начнётся 🎮', type: 'info' });
    } else {
      yield put({
        type: FETCH_CARD_SUCCESS,
        payload: { yourCards }
      });
    }
    yield put({
      type: REALTIME_GAME_STATUS_UPDATED,
      payload: { gameStatusMessage }
    });
    showMessage({ message: 'Игра началась 🎮', type: 'info' });
  }
};

const turnChangeEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.turnChange, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.turnChange, emitter);
  };
  return eventChannel(subscribe);
};

export const turnChangeRealtimeSyncSaga = function* () {
  const chanel = yield call(turnChangeEventChannel);
  while (true) {
    const turn = yield take(chanel);
    const you = yield select(youSelector);
    if (you) {
      const { playerName, gameId } = you;
      yield put({
        type: FETCH_PLAYER_REQUEST,
        payload: { playerName, gameId }
      });
    }

    yield put({
      type: REALTIME_TURN_CHANGED,
      payload: { turn }
    });
  }
};

const showMessageEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.showMessage, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.showMessage, emitter);
  };
  return eventChannel(subscribe);
};

export const showMessageRealtimeSyncSaga = function* () {
  const chanel = yield call(showMessageEventChannel);
  while (true) {
    const newShowMessage = yield take(chanel);
    yield put({
      type: REALTIME_SHOW_MESSAGE,
      payload: { showMessage: newShowMessage }
    });
    showMessage({
      message: newShowMessage.data
    });
  }
};

export function* saga() {
  yield all([
    takeLatest(START_GAME_ERROR, errorSaga),
    takeLatest(CREATE_GAME_ERROR, errorSaga),
    takeLatest(JOIN_GAME_ERROR, errorSaga),
    takeLatest(GAME_RESTORED_ERROR, errorSaga),
    takeLatest(FETCH_PLAYER_ERROR, errorSaga),
    takeLatest(START_GAME_REQUEST, startGameSaga),
    takeLatest(FETCH_PLAYER_REQUEST, fetchPlayerSaga),
    takeLatest(GAME_RESTORED_REQUEST, restoredGameSaga),
    takeLatest(CREATE_GAME_REQUEST, createGameSaga),
    takeLatest(JOIN_GAME_REQUEST, joinGameSaga)
  ]);
  yield fork(gameStartedRealtimeSyncSaga);
  yield fork(turnChangeRealtimeSyncSaga);
  yield fork(showMessageRealtimeSyncSaga);
}
