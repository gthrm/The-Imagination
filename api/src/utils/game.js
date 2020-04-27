import dockerNames from 'docker-names';
import {randomInteger} from './otherUtils';

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
      players: [],
      round: 0,
      winner: '',
      started: false,
      createdOn: new Date(),
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
      return {error: 'Game does not exist'};
    }
    return game;
  }

  /**
  * Старт игры
  * @param {string} gameId - gameId
  * @param {object} socketio - socketio
  * @return {object}
  */
  startGame(gameId, socketio) {
    const game = this.games.find((g) => g.gameId === gameId.toLowerCase());
    if (!game) {
      return {error: 'This game does not exist.'};
    }
    if (game.gameOver) {
      return {error: 'This game is done, you must create a new one.'};
    }
    if (game.players.length < 2) {
      return {error: 'A game needs at least two players.'};
    }
    if (game.roundStarted) {
      return {error: 'This round has already started.'};
    }
    if (game.round > 0) {
      // clearGameBoard(game);
    }

    game.started = true;
    game.round++;
    game.roundStarted = true;
    const playersTurn = game.round % game.players.length;
    game.players[playersTurn].myTurn = true;
    // assignPacks(game);
    // dealCards(game);
    socketio.toPlayers(gameId).emit('game-started');
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
    socketio.toPlayers(gameId).emit('game-started');
    socketio.toPlayers(gameId).emit('turn-change');
    return {message: 'game-started'};
  }


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
      return {error: 'This game does not exist.'};
    }

    const playerExists = game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (playerExists) {
      return {message: 'Player joined'};
    }

    if (game.started) {
      return {error: 'This game has already started, please join a different game.'};
    }
    if (game.players.length === 6) {
      return {error: 'This game has too many players, please join a different game.'};
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

    socketio.toHost(gameId).emit('show-message', `${playerName} has joined the game.`);
    socketio.toHost(gameId).emit('game-state', game);
    return {message: 'Player joined'};
  }
}
