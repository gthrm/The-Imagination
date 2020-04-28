import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './redux';
import App from './App';

import 'moment/locale/ru.js';
import './assets/css/reset.css';
import './assets/css/global.css';


ReactDOM.render(
  <Provider store={createStore()}>
    <App />
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);
