import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAsyncData from 'vue-async-data';

import App from './components/App.vue';
import NewsView from './components/NewsView.vue';

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
      '/news/:subreddit/:sort': {
        component: NewsView
      }
    })
    .alias({
      '/news/:subreddit': '/news/:subreddit/hot'
    })
    .redirect({
      '*': '/news/programming'
    });
  router.start(App, '#vue-mount');
})();