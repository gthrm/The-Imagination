/* eslint-disable no-console */
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './saga';

export default () => {
  const sagaMiddleware = createSagaMiddleware();

  const enhancer = applyMiddleware(sagaMiddleware);
  const enhancers = [enhancer];

  if (process.env.NODE_ENV === 'development') {
    console.log('====================================');
    console.log('NODE_ENV ', process.env.NODE_ENV);
    console.log('====================================');
    const logerEnhancer = applyMiddleware(logger);
    enhancers.push(logerEnhancer);
    // eslint-disable-next-line no-undef
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }
  const store = createStore(rootReducer, compose(...enhancers));

  sagaMiddleware.run(rootSaga);

  return store;
};
