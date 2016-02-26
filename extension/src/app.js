import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAsyncData from 'vue-async-data';

import OAuth from './api/oauth';

/**
 * Core app module
 */
(() => {
  // Loade modules
  Vue
    .use(VueRouter)
    .use(VueAsyncData);

  // Create client
  let client = OAuth.createClient(
      'reddit'
    , 'XRZp1Svht5HGyQ'
    , ['identity', 'read', 'vote', 'mysubreddits']
  );

  // Create app
  let app = Vue.extend({
    // Data template
      data: () => ({
          nick: ''
        , list: []
      })

    // Download data from API
    , asyncData: function() {
      return Promise
        .all([
            client.api('api/v1/me')
          , client.api('subreddits/mine/subscriber')
        ])
        .then(([user, list]) => {
          return {
              nick: user.name
            , list: _.map(list.data.children, child => child.data.display_name)
          }
        });
    }
  });

  // Subreddit component
  let subreddit = Vue.extend({
      template: '#subreddit-route'

    // Data template
    , data: () => ({ news: [] })
    , route: {
      data(data) { this.fetchList(data.to.params.name); }
    }

    // Methods
    , methods: {
      // Fetch thumbnail list
      fetchList() {
        client.api(`/r/${this.$route.params.name}/new`).then(data => {
          let news =  _.map(data.data.children, news => {
            if(!news.data.thumbnail || !news.data.thumbnail.length)
              news.data.thumbnail = '../data/placeholder.png';
            return news.data;
          });
          this.$set('news', news);
        });
      }
    }
    , ready(){ this.fetchList(); }
  });

  // Configure router
  let router = new VueRouter;
  router.map({
    '/subreddit/:name': {
        name: 'subreddit'
      , component: subreddit
    }
  });
  router.start(app, '#app-screen');
})();