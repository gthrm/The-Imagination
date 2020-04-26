import React from 'react';
import Layout from './components/layout';
import TableView from './components/table-view';
import Game from './utils/game';

function App() {
  const thisgame = new Game();
  const gameData = thisgame.createGame();
  console.log('gameData', gameData);

  const createNewPlayer = (id, name) => {
    thisgame.createPlayer(id, name);
  };

  return (
    <Layout>
      <TableView gameData={gameData} createNewPlayer={createNewPlayer} />
    </Layout>
  );
}

export default App;
