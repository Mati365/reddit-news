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
        let picked = _.pick(data, [
            'author'
          , 'created'
          , 'clicked'
          , 'id'
          , 'score'
          , 'title'
          , 'url'
          , 'thumbnail'
        ]);
        return _.assign(picked, {
            'commentsCount': data['num_comments']
          , 'redditURL': 'https://reddit.com' + data['permalink']
        });
      });

      // Set store value
      dispatch(types.FETCH_NEWS_SUCCESS, {
        list
      });
    })
    .catch(() => dispatch(types.FETCH_NEWS_FAIL));
};