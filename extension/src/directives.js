import Vue from 'vue';
import _ from 'lodash';

import Platform from './api/platform';

/**
 * Some thumbnails on reddit cannot be loaded so
 * directive replace them with placeholder
 */
Vue.directive('placeholder-if-broken', function() {
  this.el.onerror = function(e) {
    this.src = 'https://www.raceentry.com/img/Race-Registration-Image-Not-Found.png';
    e.preventDefault();
  };
});

/**
 * Open new link in tab, it uses platform api
 */
Vue.directive('tab-link', {
  bind() {
    _.assign(this.el, {
        href: 'javascript:;'
      , onclick: (e) => {
        Platform.openTab(this.expression);
        e.preventDefault();
      }
    });
  }
});

/**
 * Expand image on click
 */
Vue.directive('expand-click', {
  bind() {
    this.el.onclick = (e) => {
      console.log(e);
      e.preventDefault();
    };
  }
});