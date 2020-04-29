import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/private-route';
import useActions from './hooks/useActions';
import useComponentDidMount from './hooks/useComponentDidMount';
import HomeScreen from './screens/HomeScreen';
import Auth from './screens/Auth';
import JoinGame from './screens/JoinGame';
import NotFound from './screens/404';
import { signIn, loadingSelector } from './redux/ducks/auth';
import Preloader from './components/preloader';

const App = () => {
  const loading = useSelector(loadingSelector);
  const [signInApi] = useActions([signIn]);
  useComponentDidMount(() => signInApi());
  if (loading) return <Preloader />;
  return (
    <Router>
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <PrivateRoute path="/joingame">
          <JoinGame />
        </PrivateRoute>
        <PrivateRoute exact path="/">
          <HomeScreen />
        </PrivateRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
