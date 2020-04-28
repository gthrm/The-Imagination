import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/private-route';
import HomeScreen from './screens/HomeScreen';
import Auth from './screens/Auth';
import Other from './screens/Other';
import NotFound from './screens/404';

const App = () => (
  <Router>
    <Switch>
      <Route path="/auth">
        <Auth />
      </Route>
      <PrivateRoute path="/">
        <HomeScreen />
      </PrivateRoute>
      <PrivateRoute path="/other">
        <Other />
      </PrivateRoute>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  </Router>
);

export default App;
