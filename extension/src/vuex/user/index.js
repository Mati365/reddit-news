import _ from 'lodash';
import types from '../mutations';

const state = {
    subs: []
  , nick: ''
  , messages: 0
  , error: false
};

const mutations = {
  [types.FETCH_USER_REQUEST](state) {
    _.assign(state, {
        subs: []
      , nick: ''
      , messages: 0
      , error: false
    });
  }
  , [types.FETCH_USER_MESSAGES](state, messages) {
    state.messages = messages;
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