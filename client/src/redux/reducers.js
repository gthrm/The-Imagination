import { combineReducers } from 'redux';
import authReducer, { moduleName as authModuleName } from './ducks/auth';
import gameReducer, { moduleName as gameModuleName } from './ducks/game';
import errorReducer, { moduleName as errorModuleName } from './ducks/error';

export default combineReducers({
  [authModuleName]: authReducer,
  [gameModuleName]: gameReducer,
  [errorModuleName]: errorReducer,

});
