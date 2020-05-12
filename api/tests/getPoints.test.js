const chai = require('chai');
const Game = require('../build/utils/game').default;
const afterVoting = require('./constants');

const {afterVotingAll, afterVoting50, afterVotingNone} = afterVoting;
const expect = chai.expect;

describe('foo', function() {
  const game = new Game();
  const getPoints = game.getPoints;
  it('should be a function', function() {
    expect(getPoints).to.be.a('function');
  });

  it('should return the error message', function() {
    const errorMessage = getPoints(null);
    console.log('errorMessage', errorMessage);

    expect(errorMessage).to.deep.include({error: {message: `game not found.`, code: 404}});
  });

  it('should be an object', function() {
    const message = getPoints(afterVotingAll);
    console.log('message', message);
    expect(message).to.be.a('Object');
  });

  it('should return message with players (0 points)', function() {
    const message = getPoints(afterVotingAll);
    console.log('message', message);
    expect(message).to.have.deep.nested.property('newPlayersState[0].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[1].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[2].points', 0);
  });

  it('should return message with players (0 0 0)', function() {
    const message = getPoints(afterVotingAll);
    console.log('message', message);
    expect(message).to.have.deep.nested.property('newPlayersState[0].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[1].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[2].points', 0);
  });

  it('should return message with players (3 3 0)', function() {
    const message = getPoints(afterVoting50);
    console.log('message', message);
    expect(message).to.have.deep.nested.property('newPlayersState[0].points', 3);
    expect(message).to.have.deep.nested.property('newPlayersState[1].points', 3);
    expect(message).to.have.deep.nested.property('newPlayersState[2].points', 0);
  });

  it('should return message with players (0 0 6)', function() {
    const message = getPoints(afterVotingNone);
    console.log('message', message);
    expect(message).to.have.deep.nested.property('newPlayersState[0].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[1].points', 0);
    expect(message).to.have.deep.nested.property('newPlayersState[2].points', 6);
  });
  
});
