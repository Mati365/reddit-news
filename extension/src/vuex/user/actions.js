import _ from 'lodash';

import client from '../../api';
import types from '../mutations';

/**
 * Fetch basic user info, subreddits list and nick
 */
export const fetchUserInfo = ({dispatch}) => {
  dispatch(types.FETCH_USER_REQUEST);
  Promise
    .all([
        client.api('api/v1/me')
      , client.api('subreddits/mine/subscriber')
    ])

    // On fetch done
    .then(([user, list]) => {
      dispatch(types.FETCH_USER_SUCCESS, {
          nick: user.name
        , subs: _.map(list.data.children, (child) => child.data.display_name)
      });
    })

    // On fetch fail
    .catch(() => dispatch(types.FETCH_USER_FAIL));
};