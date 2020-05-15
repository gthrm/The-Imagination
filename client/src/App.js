import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactNotification from 'react-notifications-component';
import PrivateRoute from './components/private-route';
import useActions from './hooks/useActions';
import useComponentDidMount from './hooks/useComponentDidMount';
import Home from './screens/Home';
import Auth from './screens/Auth';
import GamePlayer from './screens/GamePlayer';
import GameHost from './screens/GameHost';
import Rules from './screens/Rules';
import NotFound from './screens/404';
import { signIn, loadingSelector } from './redux/ducks/auth';

import Preloader from './components/preloader';
import 'react-notifications-component/dist/theme.css';
import '../public/favicon.ico';

const App = () => {
  const loading = useSelector(loadingSelector);
  const [signInApi] = useActions([signIn]);
  useComponentDidMount(() => signInApi());
  if (loading) return <Preloader />;
  return (
    <>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <PrivateRoute path="/game">
          <GamePlayer />
        </PrivateRoute>
        <PrivateRoute path="/gamehost">
          <GameHost />
        </PrivateRoute>
        <PrivateRoute path="/rules">
          <Rules />
        </PrivateRoute>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <ReactNotification />
    </>
  );
};

export default App;
