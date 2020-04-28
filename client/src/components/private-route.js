import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/ducks/auth';

export default function PrivateRoute({ children, ...rest }) {
  const isAuthenticated = useSelector(authSelector);
  console.log('isAuthenticated', isAuthenticated);

  return (
    <Route
      {...rest}
      render={({ location }) => (isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/auth',
            state: { from: location }
          }}
        />
      ))}
    />
  );
}
