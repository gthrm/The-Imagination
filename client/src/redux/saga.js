import { all } from 'redux-saga/effects';
import { saga as authSaga } from './ducks/auth';
import { saga as errorSaga } from './ducks/error';

export default function* rootSaga() {
  yield all([
    authSaga(),
    errorSaga()
  ]);
}
