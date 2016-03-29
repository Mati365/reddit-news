import Vue from 'vue';
import _ from 'lodash';

import Platform from './api/platform';

/**
 * Some thumbnails on reddit cannot be loaded so
 * directive replace them with placeholder
 */
Vue.directive('placeholder-if-broken', function() {
  this.el.onerror = function() {
    this.src = 'https://www.raceentry.com/img/Race-Registration-Image-Not-Found.png';
  };
});

/**
 * Open new link in tab, it uses platform api
 */
Vue.directive('tab-link', {
  bind() {
    _.assign(this.el, {
      onclick: (e) => {
        Platform.openTab(this.expression);
        e.preventDefault();
      }
    });
  }
});