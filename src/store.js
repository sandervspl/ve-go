import { createStore } from 'redux';
import reducers from './ducks';

// Connect our store to the reducers
export default createStore(reducers);
