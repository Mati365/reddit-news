import _ from 'lodash';
import types from '../mutations';

const state = {
    subs: []
  , nick: ''
  , error: false
};

const mutations = {
  [types.FETCH_USER_REQUEST](state) {
    _.assign(state, {
        subs: []
      , nick: ''
      , error: false
    });
  }
  , [types.FETCH_USER_SUCCESS](state, info) {
    _.assign(state, info);
  }
  , [types.FETCH_USER_FAIL](state) {
    state.error = true;
  }
};

export default {
    state
  , mutations
};