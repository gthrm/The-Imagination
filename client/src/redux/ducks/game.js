import {
  all, put, call, take, fork, takeLatest, select
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Record } from 'immutable';
import { push } from 'connected-react-router';
import showMessage from '../../utils/notificationUtils';
import { name } from '../../../package.json';
import {
  setItemToLocalStorage,
  clearStorageWithoutToken
} from '../../utils/localStorangeManagement';
import apiService, { SocketEvents, socket } from '../../utils/API';
import { errorSaga } from './error';
import { getAlert } from '../../utils/erorAlert';
import refreshPage from '../../utils/refreshPage';

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

export const SET_RIDDLE_REQUEST = `${prefix}/SET_RIDDLE_REQUEST`;
export const SET_RIDDLE_START = `${prefix}/SET_RIDDLE_START`;
export const SET_RIDDLE_SUCCESS = `${prefix}/SET_RIDDLE_SUCCESS`;
export const SET_RIDDLE_ERROR = `${prefix}/SET_RIDDLE_ERROR`;

export const THROW_CARD_REQUEST = `${prefix}/THROW_CARD_REQUEST`;
export const THROW_CARD_START = `${prefix}/THROW_CARD_START`;
export const THROW_CARD_SUCCESS = `${prefix}/THROW_CARD_SUCCESS`;
export const THROW_CARD_ERROR = `${prefix}/THROW_CARD_ERROR`;

export const VOTE_FOR_CARD_REQUEST = `${prefix}/VOTE_FOR_CARD_REQUEST`;
export const VOTE_FOR_CARD_START = `${prefix}/VOTE_FOR_CARD_START`;
export const VOTE_FOR_CARD_SUCCESS = `${prefix}/VOTE_FOR_CARD_SUCCESS`;
export const VOTE_FOR_CARD_ERROR = `${prefix}/VOTE_FOR_CARD_ERROR`;

export const START_NEXT_ROUND_REQUEST = `${prefix}/START_NEXT_ROUND_REQUEST`;
export const START_NEXT_ROUND_START = `${prefix}/START_NEXT_ROUND_START`;
export const START_NEXT_ROUND_SUCCESS = `${prefix}/START_NEXT_ROUND_SUCCESS`;
export const START_NEXT_ROUND_ERROR = `${prefix}/START_NEXT_ROUND_ERROR`;

export const GAME_UPDATED = `${prefix}/GAME_UPDATED`;
export const GAME_RESTORED = `${prefix}/GAME_RESTORED`;

export const SELECT_CARD = `${prefix}/SELECT_CARD`;
export const SELECT_NUMBER = `${prefix}/SELECT_NUMBER`;

export const REALTIME_GAME_STATUS_UPDATED = `${prefix}/REALTIME_GAME_STATUS_UPDATED`;
export const REALTIME_TURN_CHANGED = `${prefix}/REALTIME_TURN_CHANGED`;
export const REALTIME_SHOW_MESSAGE = `${prefix}/REALTIME_SHOW_MESSAGE`;
export const REALTIME_SET_GAME_STATE = `${prefix}/REALTIME_SET_GAME_STATE`;

export const FETCH_CARD_SUCCESS = `${prefix}/FETCH_CARD_SUCCESS`;


/**
   * Reducer
   * */
export const ReducerRecord = Record({
  game: null,
  player: null,
  yourCards: [],
  turn: null,
  gameStatusMessage: null,
  showMessage: null,
  joinData: null,
  loading: false
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
    case REALTIME_SET_GAME_STATE:
      return state
        .set('loading', false)
        .set('error', null)
        .set('game', payload.game);

    case JOIN_GAME_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
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

    case SELECT_CARD:
      return state
        .set('player', {
          ...state.player,
          cards: [
            ...state.player?.cards?.map(
              (card) => (card?.fileName === payload?.card?.fileName
                ? { ...card, selected: !payload?.card?.selected }
                : { ...card, selected: false }))
          ]
        })
        .set('error', null);

    case SELECT_NUMBER:
      return state
        .set('player', {
          ...state.player,
          cardForVoting: [
            ...state.player?.cardForVoting?.map(
              (card) => (card?.fileName === payload?.card?.fileName
                ? { ...card, selected: !payload?.card?.selected }
                : { ...card, selected: false }))
          ]
        })
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

export const setRiddle = ({ riddle }) => ({
  type: SET_RIDDLE_REQUEST,
  payload: { riddle }
});

export const selectCard = ({ card }) => ({
  type: SELECT_CARD,
  payload: { card }
});

export const throwCard = () => ({
  type: THROW_CARD_REQUEST
});

export const voteForCard = () => ({
  type: VOTE_FOR_CARD_REQUEST
});

export const selectNumber = ({ card }) => ({
  type: SELECT_NUMBER,
  payload: { card }
});

export const startNextRound = () => ({
  type: START_NEXT_ROUND_REQUEST
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
    yield put(push('/gamehost'));
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

  try {
    const joinData = yield call(apiService.post, { url: `/player/${payload.playerName}/${payload.gameId}`, body: null, header: null });
    console.log('--- joinData', joinData);

    yield call(setItemToLocalStorage, 'joinData', joinData);
    yield put({
      type: JOIN_GAME_SUCCESS,
      payload: {
        joinData
      }
    });
    yield put({
      type: FETCH_PLAYER_REQUEST,
      payload: { playerName: payload.playerName, gameId: payload.gameId }
    });
    socket.emit(SocketEvents.joinGamePlayer, payload.gameId);
  } catch (error) {
    yield put({
      type: JOIN_GAME_ERROR,
      payload: { saga: joinGameSaga, sagaPayload: payload },
      error
    });
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

export const setRiddleSaga = function* ({ payload }) {
  yield put({
    type: SET_RIDDLE_START
  });
  const player = yield select(playerSelector);
  const joinData = yield select(joinDataSelector);

  const selectedCard = player.cards.filter((card) => card.selected)[0];
  const playerName = player.name;
  const { gameId } = joinData;
  if (selectedCard && payload.riddle) {
    try {
      const gameStatusMessage = yield call(apiService.post, {
        url: `/turn/${playerName}/${gameId}`,
        body: {
          cadrFromPlayer: selectedCard,
          riddle: payload.riddle
        },
        header: null
      });
      console.log('gameStatusMessage', gameStatusMessage);

      yield put({
        type: SET_RIDDLE_SUCCESS,
        payload: { gameStatusMessage }
      });
    } catch (error) {
      yield put({
        type: SET_RIDDLE_ERROR,
        payload: { saga: setRiddleSaga, sagaPayload: payload },
        error
      });
    }
  } else {
    console.log('Нужно выбрать карту');
    yield put({
      type: SET_RIDDLE_ERROR,
      payload: { saga: setRiddleSaga, sagaPayload: payload },
      error: { response: { status: 400, data: { message: 'Нужно выбрать карту' } } }
    });
  }
};

export const throwCardSaga = function* ({ payload }) {
  yield put({
    type: THROW_CARD_START
  });
  const player = yield select(playerSelector);
  const joinData = yield select(joinDataSelector);

  const selectedCard = player.cards.filter((card) => card.selected)[0];
  const playerName = player.name;
  const { gameId } = joinData;
  if (selectedCard) {
    try {
      const gameStatusMessage = yield call(apiService.post, {
        url: `/throwcard/${playerName}/${gameId}`,
        body: {
          cadrFromPlayer: selectedCard
        },
        header: null
      });
      console.log('gameStatusMessage', gameStatusMessage);

      yield put({
        type: THROW_CARD_SUCCESS,
        payload: { gameStatusMessage }
      });
    } catch (error) {
      yield put({
        type: THROW_CARD_ERROR,
        payload: { saga: throwCardSaga, sagaPayload: payload },
        error
      });
    }
  } else {
    console.log('Нужно выбрать карту');
    yield put({
      type: THROW_CARD_ERROR,
      payload: { saga: throwCardSaga, sagaPayload: payload },
      error: { response: { status: 400, data: { message: 'Нужно выбрать карту' } } }
    });
  }
};

export const voteForCardSaga = function* ({ payload }) {
  yield put({
    type: VOTE_FOR_CARD_START
  });
  const player = yield select(playerSelector);
  const joinData = yield select(joinDataSelector);

  const selectedCard = player.cardForVoting.filter((card) => card.selected)[0];
  const playerName = player.name;
  const { gameId } = joinData;
  if (selectedCard) {
    try {
      const gameStatusMessage = yield call(apiService.post, {
        url: `/voting/${playerName}/${gameId}`,
        body: {
          voting: selectedCard.fileName
        },
        header: null
      });
      console.log('gameStatusMessage', gameStatusMessage);

      yield put({
        type: VOTE_FOR_CARD_SUCCESS,
        payload: { gameStatusMessage }
      });
    } catch (error) {
      yield put({
        type: VOTE_FOR_CARD_ERROR,
        payload: { saga: voteForCardSaga, sagaPayload: payload },
        error
      });
    }
  } else {
    console.log('Нужно выбрать карту');
    yield put({
      type: VOTE_FOR_CARD_ERROR,
      payload: { saga: voteForCardSaga, sagaPayload: payload },
      error: { response: { status: 400, data: { message: 'Нужно выбрать карту' } } }
    });
  }
};

export const startNextRoundSaga = function* ({ payload }) {
  yield put({
    type: START_NEXT_ROUND_START
  });

  const game = yield select(gameSelector);
  const { gameId } = game;
  console.log('gameId', gameId);

  try {
    const gameStatusMessage = yield call(apiService.post, {
      url: `/nextTurn/${gameId}`,
      body: null,
      header: null
    });
    console.log('gameStatusMessage', gameStatusMessage, gameId);

    yield put({
      type: START_NEXT_ROUND_SUCCESS,
      payload: { gameStatusMessage }
    });
  } catch (error) {
    yield put({
      type: START_NEXT_ROUND_ERROR,
      payload: { saga: startNextRoundSaga, sagaPayload: payload },
      error
    });
  }
};

/**
   * Realtime Sagas
   * */

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
    const joinData = yield select(joinDataSelector);
    const yourCards = yield call(apiService.get, `/cards/${joinData.playerName}/${joinData.gameId}`);
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
    const joinData = yield select(joinDataSelector);
    if (joinData) {
      const { playerName, gameId } = joinData;
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

const updatePlayerStateEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.playerState, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.playerState, emitter);
  };
  return eventChannel(subscribe);
};

export const updatePlayerStateRealtimeSyncSaga = function* () {
  const chanel = yield call(updatePlayerStateEventChannel);
  while (true) {
    const playerState = yield take(chanel);
    if (playerState) {
      const joinData = yield select(joinDataSelector);
      if (joinData) {
        const { playerName, gameId } = joinData;
        yield put({
          type: FETCH_PLAYER_REQUEST,
          payload: { playerName, gameId }
        });
      }
    }
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

const setGameStateEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.gameState, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.gameState, emitter);
  };
  return eventChannel(subscribe);
};

export const setGameStateRealtimeSyncSaga = function* () {
  const chanel = yield call(setGameStateEventChannel);
  while (true) {
    const newGameState = yield take(chanel);
    yield put({
      type: REALTIME_SET_GAME_STATE,
      payload: { game: newGameState?.data }
    });
  }
};

const gameOverEventChannel = () => {
  const subscribe = (emitter) => {
    socket.on(SocketEvents.gameOver, (data) => emitter({ data }));
    return () => socket.removeListener(SocketEvents.gameOver, emitter);
  };
  return eventChannel(subscribe);
};

export const gameOverRealtimeSyncSaga = function* () {
  const chanel = yield call(gameOverEventChannel);
  while (true) {
    const gameOverState = yield take(chanel);
    yield call(getAlert, `Игра закончена, победил ${gameOverState.data}`, '', refreshPage);
    yield call(clearStorageWithoutToken);
  }
};

export function* saga() {
  yield all([
    takeLatest(START_GAME_ERROR, errorSaga),
    takeLatest(CREATE_GAME_ERROR, errorSaga),
    takeLatest(JOIN_GAME_ERROR, errorSaga),
    takeLatest(GAME_RESTORED_ERROR, errorSaga),
    takeLatest(FETCH_PLAYER_ERROR, errorSaga),
    takeLatest(SET_RIDDLE_ERROR, errorSaga),
    takeLatest(THROW_CARD_ERROR, errorSaga),
    takeLatest(VOTE_FOR_CARD_ERROR, errorSaga),
    takeLatest(START_NEXT_ROUND_ERROR, errorSaga),
    takeLatest(START_GAME_REQUEST, startGameSaga),
    takeLatest(START_NEXT_ROUND_REQUEST, startNextRoundSaga),
    takeLatest(FETCH_PLAYER_REQUEST, fetchPlayerSaga),
    takeLatest(GAME_RESTORED_REQUEST, restoredGameSaga),
    takeLatest(CREATE_GAME_REQUEST, createGameSaga),
    takeLatest(SET_RIDDLE_REQUEST, setRiddleSaga),
    takeLatest(THROW_CARD_REQUEST, throwCardSaga),
    takeLatest(VOTE_FOR_CARD_REQUEST, voteForCardSaga),
    takeLatest(JOIN_GAME_REQUEST, joinGameSaga)
  ]);
  yield fork(gameStartedRealtimeSyncSaga);
  yield fork(turnChangeRealtimeSyncSaga);
  yield fork(showMessageRealtimeSyncSaga);
  yield fork(setGameStateRealtimeSyncSaga);
  yield fork(updatePlayerStateRealtimeSyncSaga);
  yield fork(gameOverRealtimeSyncSaga);
}
