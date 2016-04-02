<template lang="jade">
  div
    aside#hamburger-menu(v-bind:class='{in: showMenu}')
      sidebar

    #page-content
      .toggle-menu.fa.fa-lg.fa-fw.fa-bars(v-on:click='toggleMenu')
      div(v-on:click='hideIfToggled()')
        router-view(keep-alive)
</template>

<script type="text/ecmascript-6">
  import Sidebar from './Sidebar.vue';
  import store from '../vuex/store';
  import {setMenuVisible} from '../vuex/user/actions';

  export default {
      components: {Sidebar}
    , store
    , vuex: {
      getters: {
        showMenu: ({user}) => user.ui.menu
      }
      , actions: {
        setMenuVisible
      }
    }
    , methods: {
      toggleMenu() {
        this.setMenuVisible(!this.showMenu);
      }
      , hideIfToggled() {
        this.showMenu && this.setMenuVisible(true);
      }
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
    /* For firefox with broken fonts */
    font-family: Ubuntu, Arial, sans-serif;
    font-size: 12px;
    overflow: hidden
  }
  #vue-mount {
    height: inherit;

    & > * {
      height: inherit;
      float: left;
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
    & > div {
      height: inherit;
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

  nav {
    @extend .row;
    height: 28px;
    z-index: 99;

    #page-content > div > & {
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
