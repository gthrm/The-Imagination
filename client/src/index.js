/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { TypographyStyle, GoogleFont } from 'react-typography';
import './utils/reset.css';
import typography from './utils/typography';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <TypographyStyle typography={typography} />
    <GoogleFont typography={typography} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
