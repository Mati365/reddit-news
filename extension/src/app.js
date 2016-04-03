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
        '/news/:type/:name/:sort': {
            name: 'news'
          , component: NewsView
        }
      , '/info': {component: InfoView}
    })
    .alias({
      '/news/:type/:name': '/news/:type/:name/hot'
    });

  // Load cached route
  localforage
    .getItem('cachedListing')
    .then((params) => {
      if(!params) {
        params = {
            type: 'subreddit'
          , name: 'general'
          , sort: 'hot'
        };
      }

      // Go to route
      router.go({
          name: 'news'
        , params
      });
    });

  router.start(App, '#vue-mount');
})();
