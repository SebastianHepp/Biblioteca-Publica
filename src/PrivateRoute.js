import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ element, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          element
        ) : (
          <Navigate
            to={{
              pathname: '/login',
              state: { from: rest.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;