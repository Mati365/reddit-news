import OAuth from './oauth';

// Create base API client
export default OAuth.createClient(
    'reddit'
  , 'XRZp1Svht5HGyQ'
  , ['identity', 'read', 'mysubreddits', 'privatemessages']
);