import _ from 'lodash';
import types from '../mutations';

const state = {
    list: []
  , listings: []
  , error: false
};

const mutations = {
  [types.FETCH_NEWS_REQUEST](state) {
    _.assign(state, {
        list: []
      , error: false
    });
  }
  , [types.SET_LINK_CLICKED](state, id) {
    _.find(state.list, {id}).clicked = true;
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