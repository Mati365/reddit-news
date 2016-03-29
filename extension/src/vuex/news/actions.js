import store from 'store2';
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

  // Set API
  let promise = null
    , listings = ['hot', 'new', 'top', 'controversial'];
  if(subreddit === 'general') {
    promise = client.front(listing);
    listings = [...listings, 'rising', 'gilded'];
  } else
    promise = client.api(`/r/${subreddit}/${listing}`);

  // Download list
  promise
    .then((res) => {
      // Update cache
      let cached = store.get('cached_clicked') || {}
        , time = Date.now();

      // Remove older that 2 days
      cached = _.omitBy(cached, (cachedTime) => {
        return time - cachedTime >= 172800000;
      });
      store.set('cached_clicked', cached);

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
          , 'clicked'
        ]);

        // Fill additional fields
        if(!picked.title)
          picked.title = data['body'];
        if(!picked.clicked)
          picked.clicked = !!cached[picked.id];

        return _.assign(picked, {
            'commentsCount': data['num_comments']
          , 'redditURL': 'https://reddit.com' + data['permalink']
        });
      });

      // Set store value
      dispatch(types.FETCH_NEWS_SUCCESS, {
          list
        , listings
      });
    })
    .catch(() => dispatch(types.FETCH_NEWS_FAIL));
};