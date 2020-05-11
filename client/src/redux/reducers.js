import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import authReducer, { moduleName as authModuleName } from './ducks/auth';
import gameReducer, { moduleName as gameModuleName } from './ducks/game';
import errorReducer, { moduleName as errorModuleName } from './ducks/error';
import history from '../history';

export default combineReducers({
  router: connectRouter(history),
  [authModuleName]: authReducer,
  [gameModuleName]: gameReducer,
  [errorModuleName]: errorReducer,

});
