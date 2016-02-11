import OAuth from './api/oauth';

OAuth
  .createClient('reddit', 'XRZp1Svht5HGyQ', ['identity', 'read', 'vote'])
  .api('api/v1/me')
  .then(d => console.log(d));