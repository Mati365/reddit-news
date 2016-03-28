import _ from 'lodash';

import client from '../../api';
import types from '../mutations';

/**
 * Fetch list of news
 * @param subreddit Subreddit name
 * @param listing   Listing
 */
export const fetchNews = ({dispatch}, subreddit, listing) => {
  dispatch(types.FETCH_NEWS_REQUEST);
  client
    .api(`/r/${subreddit}/${listing}`)
    .then((res) => {
      // Parse fetch data
      let list = _.map(res.data.children, ({data}) => {
        return _.pick(data, [
            'author'
          , 'created'
          , 'clicked'
          , 'id'
          , 'score'
          , 'title'
          , 'url'
          , 'thumbnail'
        ]);
      });

      // Set store value
      dispatch(types.FETCH_NEWS_SUCCESS, {
        list
      });
    })
    .catch(() => dispatch(types.FETCH_NEWS_FAIL));
};