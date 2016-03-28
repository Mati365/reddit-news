<template lang="jade">
  div
    aside#hamburger-menu(v-bind:class='{in: showMenu}')
      sidebar

    #page-content
      .toggle-menu.fa.fa-lg.fa-fw.fa-bars(v-on:click='toggleMenu')
      router-view(transition transition-mode='out-in')
</template>

<script type="text/ecmascript-6">
  import Sidebar from './Sidebar.vue';
  import store from '../vuex/store';

  export default {
      components: {Sidebar}
    , store
    , data() {
      return {
        showMenu: false
      };
    }
    , methods: {
      toggleMenu() { this.showMenu = !this.showMenu; }
    }
  };
</script>

<style lang="sass" rel="stylesheet/scss">
  @import "../../../node_modules/font-awesome/scss/font-awesome.scss";

  @import "sass/ui.scss";
  @import "sass/const.scss";

  html, body {
    width: 400px;
    height: 400px;
  }
  body {
    margin: 0;
  }
  #vue-mount {
    height: inherit;

    & > * {
      height: inherit;
      float: left;
    }
  }
  #hamburger-menu {
    position: fixed;
    width: $menu-width;
    left: -$menu-width;
    transition: left .5s ease;
    background: #f9f9f9;

    &.in {
      left: 0;
    }
  }

  #page-content {
    position: relative;
    width: 100%;
    margin-left: 0;
    transition: margin-left .5s ease;
    overflow: hidden;

    #hamburger-menu.in + & {
      margin-left: $menu-width;
    }
  }

  nav {
    @extend .row;
    height: 28px;
    z-index: 99;

    #page-content > & {
      height: auto;
      border-bottom: 1px solid $separator-color;
      padding-bottom: 0;

      .listings {
        text-align: left;
      }
    }
  }

  .toggle-menu {
    position: absolute;
    left: $padding;
    top: $padding;
    color: gray;

    &:hover {
      cursor: pointer;
    }
    #hamburger-menu.in + #page-content > & {
      color: black;
    }
  }
</style>