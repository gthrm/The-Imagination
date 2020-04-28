import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/ducks/auth';

export default function PrivateRoute({ children, ...rest }) {
  const authData = useSelector(authSelector);
  // console.log('isAuthenticated', authData);

  return (
    <Route
      {...rest}
      render={({ location }) => (authData && authData.success ? (
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
