import _ from 'lodash';
import types from '../mutations';

const state = {
    list: []
  , error: false
};

const mutations = {
  [types.FETCH_NEWS_REQUEST](state) {
    _.assign(state, {
        list: []
      , error: false
    });
  }
  , [types.FETCH_NEWS_SUCCESS](state, info) {
    _.assign(state, info);
  }
  , [types.FETCH_NEWS_FAIL](state) {
    state.error = true;
  }
};

export default {
    state
  , mutations
};