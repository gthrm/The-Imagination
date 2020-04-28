import { combineReducers } from 'redux';
import authReducer, { moduleName as authModuleName } from './ducks/auth';
import errorReducer, { moduleName as errorModuleName } from './ducks/error';

export default combineReducers({
  [authModuleName]: authReducer,
  [errorModuleName]: errorReducer,

});
