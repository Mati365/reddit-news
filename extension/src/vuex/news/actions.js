import store from 'store2';
import _ from 'lodash';

import client from '../../api';
import types from '../mutations';

/**
 * Parse listing from reddit
 * @param res  array of childrens from reddit listing response
 */
function parseListing(res) {
  // Parse fetch data
  return _.map(res.data.children, ({data}) => {
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

    return _.assign(picked, {
        'commentsCount': data['num_comments']
      , 'redditURL': 'https://reddit.com' + data['permalink']
    });
  });
}

/**
 * Fetch list of news
 * @param subreddit Subreddit name
 * @param listing   Listing
 */
export const fetchNews = ({dispatch}, subreddit, listing) => {
  dispatch(types.FETCH_NEWS_REQUEST);

  // Find in cache
  let cache = store.get('cached_listing') || {}
    , time = Date.now();

  // Remove cache if expired
  if(cache.subreddit !== subreddit
      || cache.listing !== listing
      || cache.exp <= Date.now())
    cache = {};

  // Set API
  let promise = !_.isEmpty(cache) && Promise.resolve(cache.data)
    , listings = ['hot', 'new', 'controversial', 'top'];

  if(subreddit === 'general') {
    promise = promise || client.front(listing);
    listings = [...listings, 'rising', 'gilded'];
  } else if(!promise)
    promise = client.api(`/r/${subreddit}/${listing}`);

  // Download list
  promise
    .then((res) => {
      // If it's array the list is already parsed
      let list = res;
      if(!_.isArray(res)) {
        list = parseListing(res);
        // Add 5min cache
        store.set('cached_listing', {
            exp: time + 300000
          , data: list
          , listing
          , subreddit
        });
      }

      // Remove older that 2 days
      let cachedClicked = store.get('cached_clicked') || {};
      cachedClicked = _.omitBy(cachedClicked, (cachedTime) => {
        return time - cachedTime >= 172800000;
      });
      store.set('cached_clicked', cachedClicked);

      // Remove from list array
      _.map(list, (link) => link.clicked = !!cachedClicked[link.id]);

      // Set store value
      dispatch(types.FETCH_NEWS_SUCCESS, {
          listings
        , list
      });
    })
    .catch(() => dispatch(types.FETCH_NEWS_FAIL));
};