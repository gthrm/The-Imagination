/* eslint-disable new-cap */
import dockerNames from 'docker-names';
import {
  randomInteger,
  readDir,
  CARD_LENGTH,
  STARTING_HAND,
  SocketEvents,
} from './otherUtils';
/**
 * Класс Game
 */
export default class Game {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this.games = [];
    this.turnCells = [];
    this.players = [];
    this.colors = [];
  }

  /**
   * Создание игрового поля
   */
  createTurnCells() {
    if (this.turnCells.length === 0) {
      this.turnCells = Array(40).fill({}).map((_item, index) => ({id: `${index}`, number: index, players: []}));
    }
  }

  /**
  * Создание игрока
  * @param {string} id - id
  * @param {string} name - name
  * @return {object}
  */
  createPlayer(id, name) {
    if (id && name) {
      let player = this.players.find((item) => item.id === id);
      if (!player && this.players.length < 5) {
        player = {id, name, color: this.getColor()};
        this.players.push(player);
      }
      console.log('player', player);

      return player;
    }
    return {error: 'id or name not found'};
  }

  /**
  * Создание цветов
  */
  createColors() {
    this.colors = ['#E72A8C', '#C63016', '#E9E130', '#50CB1A', '#3019DC'];
  }


  /**
  * Получение цветов
  * @return {string}
  */
  getColor() {
    if (this.colors.length > 0) {
      const randomInt = randomInteger(0, this.colors.length);
      const color = this.colors.splice(randomInt, 1);
      return color;
    }
    return null;
  }

  /**
  * Получение игроков
  * @return {Array}
  */
  getPlayers() {
    return this.players;
  }

  /**
  * Получение name
  * @return {Array}
  */
  getName() {
    let name = dockerNames.getRandomName();
    name = name.replace('_', '-').toLowerCase();
    const game = this.games.find((g) => g.gameId === name);
    if (game) {
      this.getName();
    }
    return name;
  };

  /**
  * Создание игры
  * @return {object}
  */
  createGame() {
    this.createTurnCells();
    this.createColors();
    const newGameId = this.getName();
    const gameState = {
      gameId: newGameId,
      turnCells: this.turnCells,
      roundStarted: false,
      gameOver: false,
      drawPile: [],
      discardPile: [],
      cards: [],
      players: [],
      round: 0,
      winner: '',
      winningScore: 0,
      started: false,
      createdAt: new Date(),
    };
    this.games.push(gameState);
    return gameState;
  }

  /**
  * Поиск игры
  * @param {string} gameId - gameId
  * @return {object}
  */
  findGame(gameId) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: {message: 'Game does not exist', code: 404}};
    }
    return game;
  }

  /**
  * Старт игры
  * @param {string} gameId - gameId
  * @param {object} socketio - socketio
  * @return {object}
  */
  async startGame(gameId, socketio) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: {message: 'This game does not exist.', code: 404}};
    }
    if (game.gameOver) {
      return {error: {message: 'This game is done, you must create a new one.', code: 400}};
    }
    if (game.players.length < 2) {
      return {error: {message: 'A game needs at least two players.', code: 400}};
    }
    if (game.roundStarted) {
      return {error: {message: 'This round has already started.', code: 400}};
    }
    if (game.round > 0) {
      this.clearGameBoard(game);
    }

    game.started = true;
    game.round++;
    game.roundStarted = true;
    const playersTurn = game.round % game.players.length;
    game.players[playersTurn].myTurn = true;
    await this.assignPacks(game);

    if (!Array.isArray(game.cards) || game.cards.length < CARD_LENGTH(game.players.length)) {
      return {error: 'Не достаточно карт в папке с картами.'};
    }

    this.dealCards(game);
    socketio.toPlayers(gameId).emit('game-started', 'game-started');
    socketio.toPlayers(gameId).emit('turn-change', game.players[playersTurn].name);

    return game;
  };

  /**
  * Старт игры
  * @param {string} gameId - gameId
  * @param {object} socketio - socketio
  * @return {object}
  */
  test(gameId, socketio) {
    socketio.emit('game-started');
    socketio.toPlayers(gameId).emit('game-started', 'game-started-test');
    socketio.toPlayers(gameId).emit('turn-change', 'test');
    return {message: 'game-started'};
  }

  /**
  * Раздать игрокам карты
  * @param {object} game - game
  */
  dealCards(game) {
    for (let i = 0; i < STARTING_HAND; i++) {
      for (const player of game.players) {
        const newCard = this.drawCard(game.cards);
        if (newCard.value === '3' && newCard.colour === 'red') {
          player.redThrees.push(newCard);
          player.extraFirstTurn++;
        } else {
          player.cards.push(newCard);
        }
      }
    }
  }

  /**
  * Выдать карту
  * @param {object} cards - cards
  * @return {object}
  */
  drawCard(cards) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const chosenCard = cards.splice(randomIndex, 1);
    return chosenCard[0];
  };

  /**
  * Очистить GameBoard
  * @param {object} game - game
  */
  clearGameBoard(game) {
    game.card = [];
    game.discardPile = [];
    for (const player of game.players) {
      player.cards = [];
      player.meld = {};
      player.myTurn = false;
      player.hasDrawn = false;
    }
  };

  /**
  * Присоединение игрока
  * @param {string} playerName - playerName
  * @param {string} gameId - gameId
  * @param {object} socketio - socketio
  * @return {object}
  */
  playerJoins(playerName, gameId, socketio) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: {message: 'This game does not exist.', code: 400}};
    }

    const playerExists = game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (playerExists) {
      return {message: 'Player joined'};
    }

    if (game.started) {
      return {error: {message: 'This game has already started, please join a different game.', code: 400}};
    }
    if (game.players.length === 6) {
      return {error: {message: 'This game has too many players, please join a different game.', code: 400}};
    }

    const player = {
      name: playerName,
      cards: [],
      points: 0,
      myTurn: false,
      hasDrawn: false,
      extraFirstTurn: 0,
    };
    game.players.push(player);

    socketio.toHost(gameId).emit(SocketEvents.showMessage, `${playerName} has joined the game.`);
    socketio.toHost(gameId).emit(SocketEvents.gameState, game);
    return {message: 'Player joined'};
  }

  /**
  * Создает колоду карт
  * @param {object} game - game
  */
  async assignPacks(game) {
    try {
      const cards = await readDir();
      game.cards = cards;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Выдать данные по игроку
   * @param {string} playerName - playerName
   * @param {string} gameId - gameId
   * @return {object}
   */
  getPlayerCards(playerName, gameId) {
    const {game, player, error} = this.getGameAndPlayer(gameId, playerName);
    if (error) {
      return {error};
    }
    if (!game.started || !game.roundStarted) {
      return {waiting: true};
    }

    const hand = player.cards;
    return hand;
  };

  /**
  * Выдать данные по игроку и игре
  * @param {string} gameId - gameId
  * @param {string} playerName - playerName
  * @return {object}
  */
  getGameAndPlayer(gameId, playerName) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: {message: `game does not exist.`, code: 404}};
    }
    const player = game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (!player) {
      return {error: {message: `player does not exist in this game.`, code: 404}};
    }

    return {game, player};
  }

  /**
   * Выдать данные по игроку
   * @param {string} gameId - gameId
   * @param {string} playerName - playerName
   * @return {object}
   */
  getPlayer(gameId, playerName) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: {message: `game does not exist.`, code: 404}};
    }
    const player = game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (!player) {
      return {error: {message: `player does not exist in this game.`, code: 404}};
    }
    return player;
  }
}
