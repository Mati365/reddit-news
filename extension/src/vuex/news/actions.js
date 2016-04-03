import localforage from 'localforage';
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

    // If thumbnail is relative path to reddit
    if(!/^https?/i.test(picked.thumbnail))
      picked.thumbnail = (picked.thumbnail === 'nsfw' ? 'https://www.reddit.com/static/nsfw2.png' : '');

    return _.assign(picked, {
        'commentsCount': data['num_comments']
      , 'redditURL': 'https://reddit.com' + data['permalink']
    });
  });
}

/**
 * Set link clicked
 * @param id  Link id
 */
export const setLinkClicked = ({dispatch}, id) => {
  dispatch(types.SET_LINK_CLICKED, id);

  // Write to cache
  localforage.getItem('cachedClicked').then((data) => {
    data[id] = Date.now();
    localforage.setItem('cachedClicked', data);
  });
};

/**
 * Fetch list of news
 * @param groupName Name of names group
 * @param name      List of names
 * @param listing   Listing
 */
export const fetchNews = ({dispatch}, groupName, name, listing) => {
  let time = Date.now();

  dispatch(types.FETCH_NEWS_REQUEST);
  return localforage
    .getItem('cachedListing')
    // Validate cache
    .then((cache) => {
      if(!cache
          || cache.type !== (groupName ? 'multi' : 'subreddit')
          || cache.subreddit !== (groupName || name)
          || cache.listing !== listing
          || cache.exp <= Date.now())
        cache = {};
      return cache;
    })

    // Detect menu
    .then((cache) => {
      let promise = !_.isEmpty(cache) && cache.data.length
        ? Promise.resolve(cache.data)
        : null;

      // Detect menu
      let listings = ['hot', 'new', 'controversial', 'top'];
      if(name === 'general') {
        listings = [...listings, 'rising', 'gilded'];
        promise = promise || client.front(listing);

      } else if(!promise)
        promise = client.api(`r/${groupName ? name.join('+') : name}/${listing}`);

      // Return promise
      return promise.then((data) => [data, listings]);
    })

    // Parse response
    .then(([data, listings]) => {
      // If it's from cache
      if(!_.isArray(data)) {
        // Add 5min cache
        data = parseListing(data);

        // Update cache
        localforage.setItem('cachedScroll');
        localforage.setItem('cachedListing', {
            exp: time + 300000
          , subreddit: groupName || name
          , type: groupName ? 'multi': 'subreddit'

          , listing
          , data
        });
      }

      // Fetch clicked
      return localforage
        .getItem('cachedClicked')
        .then((clicked) => [data, listings, clicked || {}]);
    })

    // Mark as clicked and finish
    .then(([data, listings, clicked]) => {
      // Check clicked expired
      clicked = _.omitBy(clicked, (cachedTime) => {
        return time - cachedTime >= 86400000;
      });
      return localforage
        .setItem('cachedClicked', clicked)
        .then(() => {
          // Remove from list array
          _.each(data, (link) => { link.clicked = link.id in clicked; });

          // Set store value
          dispatch(types.FETCH_NEWS_SUCCESS, {
              'list': data
            , listings
          });
        });
    })

    // Catch errors
    .catch(() => dispatch(types.FETCH_NEWS_FAIL));
};