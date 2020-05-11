/* eslint-disable new-cap */
import dockerNames from 'docker-names';
import {
  randomInteger,
  readDir,
  CARD_LENGTH,
  STARTING_HAND,
  MIN_PLAYERS,
  SocketEvents,
  shuffle,
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
      // console.log('player', player);

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
  async createGame() {
    // this.createTurnCells();
    this.createColors();
    const newGameId = this.getName();
    const gameState = {
      gameId: newGameId,
      userImages: [],
      roundStarted: false,
      gameOver: false,
      drawPile: [],
      discardPile: [],
      cards: [],
      players: [],
      round: 0,
      winner: '',
      winningScore: 0,
      riddle: null,
      voting: false,
      started: false,
      createdAt: new Date(),
    };
    await this.assignPlayerPic(gameState);
    this.games.push(gameState);

    return {gameState};
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
    return {game};
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
    if (game.players.length < MIN_PLAYERS) {
      return {error: {message: 'A game needs at least two players.', code: 400}};
    }
    if (game.roundStarted) {
      return {error: {message: 'This round has already started.', code: 400}};
    }
    if (game.round > 0) {
      this.clearGameBoard(game);
    }
    await this.assignPacks(game);
    if (!Array.isArray(game.cards) || game.cards.length < CARD_LENGTH(game.players.length)) {
      return {error: {message: 'not enough cards in the card folder.', code: 400}};
    }
    game.started = true;
    game.round++;
    game.roundStarted = true;
    const playersTurn = game.round % game.players.length;
    game.players[playersTurn].myTurn = true;

    this.dealCards(game);

    socketio.toPlayers(gameId).emit(SocketEvents.gameStarted, 'game-started');
    socketio.toPlayers(gameId).emit(SocketEvents.turnChange, game.players[playersTurn].name);

    return {game};
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
        player.cards.push(newCard);
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
      player.hasVoting = false;
      player.hasThrowCard = false;
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
      return {error: {message: 'This game does not exist.', code: 404}};
    }

    const playerExists = game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (playerExists) {
      return {message: {status: 'Player joined', playerName, gameId}};
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
      hasThrowCard: false,
      hasVoting: false,
      image: null,
    };
    const randomIndex = Math.floor(Math.random() * game.userImages);
    const chosenImage = game.userImages.splice(randomIndex, 1);
    player.image = chosenImage;
    game.players.push(player);

    socketio.toHost(gameId).emit(SocketEvents.showMessage, `${playerName} has joined the game.`);
    socketio.toHost(gameId).emit(SocketEvents.gameState, game);
    return {message: {status: 'Player joined', playerName, gameId}};
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
      return {error};
    }
  }

  /**
  * Создает картинки игроков
  * @param {object} game - game
  */
  async assignPlayerPic(game) {
    try {
      const userImages = await readDir('../../assets/images', 'playerpic');
      game.userImages = userImages;
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
    return {hand};
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
    return {player};
  }

  /**
  * Ход
  * @param {string} playerName - gameId
  * @param {string} gameId - playerName
  * @param {object} body - body
  * @param {object} socketio - socketio
  * @return {object}
  */
  turn(playerName, gameId, body = {}, socketio) {
    const {game, player, error} = this.getGameAndPlayer(gameId, playerName);
    const {riddle} = body; // TODO
    if (error) {
      return error;
    }
    if (game.gameOver) {
      return {error: {message: `game is over.`, code: 400}};
    }
    if (!game.started) {
      return {error: {message: `game does not started.`, code: 400}};
    }
    if (!game.roundStarted) {
      return {error: {message: `round does not started.`, code: 400}};
    }
    if (!player.myTurn) {
      return {error: {message: `this is not your turn.`, code: 400}};
    }
    // if (!cadrFromPlayer) {
    //   return {error: {message: `field cadrFromPlayer required.`, code: 400}};
    // }
    if (!riddle) {
      return {error: {message: `field riddle required.`, code: 400}};
    }

    player.hasThrowCard = true;
    const throwcardData = this.throwcard(playerName, gameId, body, null, true);
    console.log('--- throwcardData', throwcardData);

    // const indexOfchosenCard = player.cards.findIndex((card) => card.fileName === cadrFromPlayer.fileName);
    // if (indexOfchosenCard === -1) {
    //   return {error: {message: 'card not found', code: 400}};
    // }
    // const selectedCard = player.cards.splice(indexOfchosenCard, 1);
    // game.drawPile = [...game.drawPile, {...selectedCard, hidden: true}]; // TODO

    // const newPlayersState = game.players.map((player) =>
    //   player.name === playerName ?
    //     {...player, hasThrowCard: false} :
    //     {...player, hasThrowCard: true},
    // );

    // game.players = newPlayersState;
    if (throwcardData.error) {
      return throwcardData;
    }
    player.myTurn = false;
    console.log('--- player', player);

    game.riddle = riddle;

    const newPlayersState = game.players.map((player) =>
      player.name === playerName ?
        {...player, hasThrowCard: false} :
        {...player, hasThrowCard: true},
    );
    game.players = newPlayersState;

    socketio.toHost(gameId).emit(SocketEvents.showMessage, `${playerName} сделал ход.`);
    socketio.toHost(gameId).emit(SocketEvents.gameState, game);
    socketio.toPlayers(gameId).emit(SocketEvents.playerState, 'update');
    socketio.toHost(gameId).emit(SocketEvents.showMessage, 'Добавьте карту на стол!');
    return {message: 'turn is done'};
  }

  /**
  * throwcard
  * @param {string} playerName - gameId
  * @param {string} gameId - playerName
  * @param {object} body - body
  * @param {object} socketio - socketio
  * @param {boolean} isTurn - isTurn
  * @return {object}
  */
  throwcard(playerName, gameId, body = {}, socketio, isTurn = false) {
    const {game, player, error} = this.getGameAndPlayer(gameId, playerName);
    const {cadrFromPlayer} = body; // TODO
    if (error) {
      return error;
    }
    if (game.gameOver) {
      return {error: {message: `game is over.`, code: 400}};
    }
    if (!game.started) {
      return {error: {message: `game does not started.`, code: 400}};
    }
    if (!game.roundStarted) {
      return {error: {message: `round does not started.`, code: 400}};
    }
    if (!player.hasThrowCard) {
      return {error: {message: `you cannot trow card`, code: 400}};
    }
    if (!cadrFromPlayer) {
      return {error: {message: `field cadrFromPlayer required.`, code: 400}};
    }
    const indexOfchosenCard = player.cards.findIndex((card) => card.fileName === cadrFromPlayer.fileName);
    console.log('---- indexOfchosenCard', indexOfchosenCard);

    if (indexOfchosenCard === -1) {
      return {error: {message: 'card not found', code: 404}};
    }
    const selectedCard = player.cards.splice(indexOfchosenCard, 1);
    console.log('--- selectedCard', selectedCard[0]);


    game.drawPile = [...game.drawPile, {...selectedCard[0], hidden: true, playerName, isTurn, votedPlayers: [], id: game.drawPile.length}];
    player.hasThrowCard = false;


    if (!isTurn && game.drawPile.length === game.players.length) {
      const {playerName, error} = this.getLastPlayer(game);
      if (error) return error;

      const openCards = game.drawPile.map((card) => ({...card, hidden: false}));

      game.drawPile = shuffle(openCards);
      const newPlayersState = game.players.map(
          (player) => player.name === playerName ?
          {...player, hasVoting: false} :
          {...player, hasVoting: true, cardForVoting: game.drawPile.map(({fileName, path, id}) => ({fileName, path, id}))},
      );
      console.log('--- newPlayersState', newPlayersState, '---openCards', openCards);
      game.players = newPlayersState;
      game.voting = true;
      if (socketio) {
        socketio.toPlayers(gameId).emit(SocketEvents.showMessage, 'Голосование началось');
      }
    }

    if (socketio) {
      socketio.toHost(gameId).emit(SocketEvents.showMessage, `${playerName} добавил карту.`);
      socketio.toHost(gameId).emit(SocketEvents.gameState, game);
      socketio.toPlayers(gameId).emit(SocketEvents.playerState, 'update');
    }
    return {message: 'throw card is done'};
  }

  /**
* getLastPlayer
* @param {object} game - game
* @return {string}
*/
  getLastPlayer(game) {
    const lastPlayerCard = game.drawPile.find((card) => card.isTurn);
    if (!lastPlayerCard) {
      return {error: {message: 'lastPlayerCard not found', code: 404}};
    }
    const {playerName} = lastPlayerCard;
    console.log('--- getLastPlayer', playerName);
    return {playerName};
  }

  /**
* getNextTurn
* @param {object} game - game
* @return {object}
*/
  getNextTurnPlayer(game) {
    const {playerName, error} = this.getLastPlayer(game);
    if (error) {
      return error;
    }

    const lastPlayerIndex = game.players.findIndex((player) => player.name === playerName);
    console.log('--- lastPlayerIndex', lastPlayerIndex);

    if (lastPlayerIndex === -1) {
      return {error: {message: 'lastPlayerIndex not found', code: 404}};
    }
    let nextTurnPlayer;
    if (lastPlayerIndex === game.players.length - 1) {
      nextTurnPlayer = game.players[0];
      console.log('--- nextTurnPlayer 1', nextTurnPlayer);
      return {nextTurnPlayer};
    };
    console.log('--- nextTurnPlayer 2', nextTurnPlayer);
    nextTurnPlayer = game.players[lastPlayerIndex + 1];
    return {nextTurnPlayer};
  }

  /**
* voting
* @param {string} playerName - gameId
* @param {string} gameId - playerName
* @param {object} body - body
* @param {object} socketio - socketio
* @return {object}
*/
  voting(playerName, gameId, body = {}, socketio) {
    const {game, player, error} = this.getGameAndPlayer(gameId, playerName);
    const {voting} = body; // TODO
    if (error) {
      return error;
    }
    if (game.gameOver) {
      return {error: {message: `game is over.`, code: 400}};
    }
    if (!game.started) {
      return {error: {message: `game does not started.`, code: 400}};
    }
    if (!game.roundStarted) {
      return {error: {message: `round does not started.`, code: 400}};
    }
    if (!player.hasVoting) {
      return {error: {message: `you don't have voting`, code: 400}};
    }
    if (!voting) {
      return {error: {message: 'field voting required.', code: 412}};
    }
    const votingCardindex = game.drawPile.findIndex((card) => card.fileName === voting);
    if (votingCardindex === -1) {
      return {error: {message: `card not found.`, code: 400}};
    }
    game.drawPile[votingCardindex].votedPlayers = [...game.drawPile[votingCardindex].votedPlayers, playerName];
    player.hasVoting = false;

    const allPlayersVoted = !game.players.some((player) => player.hasVoting);

    console.log('drawPile', game.drawPile, 'allPlayersVoted', allPlayersVoted);

    if (allPlayersVoted) {
      const {newPlayersState, error} = this.getPoints(game);
      console.log('--- newPlayersState', newPlayersState, 'error', error);

      if (error) {
        return error;
      }
      game.players = newPlayersState;
      game.voting = false;
      game.roundStarted = false;

      socketio.toHost(gameId).emit(SocketEvents.showMessage, 'Голосование завершилось');
      socketio.toHost(gameId).emit(SocketEvents.gameState, game);
      socketio.toPlayers(gameId).emit(SocketEvents.playerState, 'update');
      return {message: 'voting is end'};
    }
    socketio.toHost(gameId).emit(SocketEvents.showMessage, `${playerName} проголосовал`);
    socketio.toPlayers(gameId).emit(SocketEvents.playerState, 'update');
    return {message: 'voting success'};
  }

  /**
* nextTurn
* @param {string} gameId - gameId
* @param {object} socketio - socketio
* @return {object}
*/
  nextTurn(gameId, socketio) {
    // если голосование завершилось
    const {game, error} = this.findGame(gameId);
    if (error) {
      return error;
    }
    if (game.gameOver) {
      return {error: {message: `game is over.`, code: 400}};
    }
    if (!game.started) {
      return {error: {message: `game does not started.`, code: 400}};
    }
    if (game.roundStarted) {
      return {error: {message: `round is started`, code: 400}};
    }
    if (game.voting) {
      return {error: {message: `voting is started.`, code: 400}};
    }
    const onPlayerCardsLength = game.players.some((player) => player.cards.length === 0);

    if (game.cards.length === 0 && onPlayerCardsLength) {
      const winer = game.players.sort((a, b) => b.points - a.points)[0];
      console.log('--- winer', winer);

      game.gameOver = true;
      game.winner = winer;

      socketio.toHost(gameId).emit(SocketEvents.showMessage, `Игра закончена, победил ${winer.name}`);
      socketio.toPlayers(gameId).emit(SocketEvents.gameOver, winer.name);


      return {error: {message: `game is over.`, code: 400}};
    }
    const {nextTurnPlayer, error: errorGetNextTurnPlayer} = this.getNextTurnPlayer(game);
    console.log('nextTurnPlayer', nextTurnPlayer);

    if (errorGetNextTurnPlayer) {
      return errorGetNextTurnPlayer;
    };
    nextTurnPlayer.myTurn = true;
    game.discardPile = [...game.discardPile, ...game.drawPile];
    game.drawPile = [];

    for (let index = game.players.length; index > 0; index--) {
      if (game.cards.length > 0) {
        const newCard = this.drawCard(game.cards);
        console.log('--- newCard', newCard);
        game.players[index - 1].cards.push(newCard);
      }
    }
    game.round++;
    game.roundStarted = true;
    socketio.toHost(gameId).emit(SocketEvents.gameState, game);
    socketio.toPlayers(gameId).emit(SocketEvents.playerState, 'update');
    socketio.toPlayers(gameId).emit(SocketEvents.turnChange, nextTurnPlayer.name);
    return {message: 'next turn started'};
  }

  /**
* getPoints
* @param {object} game - game
* @return {object}
*/
  getPoints(game) {
    const {drawPile} = game;
    const turnCard = drawPile.find((card) => card.isTurn);
    console.log('turnCard', turnCard);

    if (!turnCard) {
      return {error: {message: `card not found.`, code: 404}};
    }

    if (turnCard.votedPlayers.length === game.players.length - 1) {
      const newPlayersState = game.players.map((player) => ({...player, points: player.points - 3 > 0 ? player.points - 3 : player.points}));
      console.log('--- 1 newPlayersState', newPlayersState);
      // return {newPlayersState};
    }

    if (turnCard.votedPlayers.length === 0) {
      const newPlayersState = game.players.map((player) => player.name === turnCard.playerName ?
        ({...player, points: player.points - 3 > 0 ? player.points - 3 : player.points}) :
        ({...player}));
      console.log('--- 2 newPlayersState', newPlayersState);
      return {newPlayersState};
    }

    const newPlayersState = game.players.map((player) => ({
      ...player,
      points: turnCard.votedPlayers.some((p) => p === player.name) || turnCard.playerName === player.name ? player.points + 1 : player.points,
    }));
    console.log('--- 3 newPlayersState', newPlayersState);
    return {newPlayersState};
  }
}
