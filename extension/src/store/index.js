import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

/**
 * Create root store
 * @param state Initial state of store
 * @returns Store
 */
const store = createStore(
    rootReducer
  , {}
  , applyMiddleware(thunk)
);
export default store;