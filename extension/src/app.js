import localforage from 'localforage';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAsyncData from 'vue-async-data';

import App from './components/App.vue';
import NewsView from './components/NewsView.vue';
import InfoView from './components/InfoView.vue';

import './directives';

/**
 * Configure router and bootstrap Vue.JS app,
 * please do not insert here any components
 */
(() => {
  Vue
    .use(VueRouter)
    .use(VueAsyncData);

  // Configure router
  let router = new VueRouter;
  router
    .map({
        '/news/:subreddit/:sort': {component: NewsView}
      , '/info': {component: InfoView}
    })
    .alias({
      '/news/:subreddit': '/news/:subreddit/hot'
    });

  // Load cached route
  localforage
    .getItem('cachedListing')
    .then((data) => {
      if(!data)
        data = {subreddit: 'general', listing: 'hot'};

      // Go to route
      router.go(`/news/${data.subreddit}/${data.listing}`);
    });

  router.start(App, '#vue-mount');
})();
