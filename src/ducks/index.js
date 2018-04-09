/* eslint-disable global-require */
import { combineReducers } from 'redux';

export default combineReducers({
  app: require('./modules/app').default,
});
