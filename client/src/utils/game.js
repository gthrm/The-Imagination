import { randomInteger } from './utils';

export default class Game {
  constructor() {
    this.turnCells = [];
    this.players = [];
    this.colors = [];
  }

  createTurnCells() {
    console.log('createTurnCells');

    if (this.turnCells.length === 0) {
      this.turnCells = Array(40).fill({}).map((_item, index) => ({ id: `${index}`, number: index, players: [] }));
    }
  }

  createPlayer(id, name) {
    if (id && name) {
      let player = this.players.find((item) => item.id === id);
      if (!player && this.players.length < 5) {
        player = { id, name, color: this.getColor() };
        this.players.push(player);
      }
      console.log('player', player);

      return player;
    }
    return 'err, id or name not found';
  }

  createColors() {
    this.colors = ['#E72A8C', '#C63016', '#E9E130', '#50CB1A', '#3019DC'];
  }

  getColor() {
    if (this.colors.length > 0) {
      const randomInt = randomInteger(0, this.colors.length);
      const color = this.colors.splice(randomInt, 1);
      return color;
    }
    return null;
  }

  getPlayers() {
    return this.players;
  }

  createGame() {
    this.createTurnCells();
    this.createColors();
    return {
      turnCells: this.turnCells,
      players: this.players
    };
  }
}
