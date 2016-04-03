import _ from 'lodash';

import client from '../../api';
import types from '../mutations';

/**
 * Fetch basic user info, subreddits list and nick
 */
export const fetchUserInfo = ({dispatch}) => {
  dispatch(types.FETCH_USER_REQUEST);
  return Promise
    .all([
        client.api('api/v1/me')
      , client.api('subreddits/mine/subscriber')
      , client.api('api/multi/mine')
    ])

    // On fetch done
    .then(([user, subreddits, multis]) => {
      multis = _.map(multis, ({data}) => {
        return {
            name: data['display_name']
          , color: data['key_color']
          , icon: data['icon_url']
          , subreddits: _.map(data['subreddits'], (child) => child['name'])
        };
      });
      dispatch(types.FETCH_USER_SUCCESS, {
          nick: user.name
        , subs: {
            subreddits: _.map(subreddits.data.children, (child) => child.data['display_name'])
          , multis
        }
      });
    })

    // On fetch fail
    .catch(() => dispatch(types.FETCH_USER_FAIL));
};

/**
 * Set menu visible
 * @param visible True if visible
 */
export const setMenuVisible = ({dispatch}, visible) => {
  dispatch(types.SET_MENU_VISIBLE, visible);
};

/**
 * Reload message list
 */
export const fetchUserMessages = ({dispatch}) => {
  return client
    .api('/message/unread')
    .then((d) => dispatch(types.FETCH_USER_MESSAGES, d.data.children.length));
};