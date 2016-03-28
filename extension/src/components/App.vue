<template lang="jade">
  div
    aside#hamburger-menu(v-bind:class='{in: showMenu}')
      sidebar

    #page-content
      nav.text-center
        .col-1
          .fa.fa-lg.fa-fw.fa-bars(v-on:click='toggleMenu')

        .col-11
          div
            .subtitle Reddit
            strong.title /r/poland
          ul.nav.listings
            li.active hot
            li new
            li random
            li top
            li controversial
</template>


<script>
  import Sidebar from './Sidebar.vue';

  const App = {
    components: {
      Sidebar
    }
    , data() {
      return {
        showMenu: false
      };
    }
    , methods: {
      toggleMenu() { this.showMenu = !this.showMenu; }
    }
  };
  export default App;
</script>

<style lang="sass">
  @import "../../../node_modules/font-awesome/scss/font-awesome.scss";

  @import "sass/ui.scss";
  @import "sass/const.scss";

  html {
    width: 300px;
    height: 400px;
  }
  body {
    margin: 0;
    height: 100%;
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
    width: 100%;
    margin-left: 0;
    transition: margin-left .5s ease;

    #hamburger-menu.in + & {
      margin-left: $menu-width;
    }
  }

  ul.listings {
    margin-top: 5px;
    li {
      border: 1px solid $separator-color;
      background: darken(white, 1%);

      position: relative;
      top: 1px;

      padding: 2px 4px;
      z-index: 999;

      &.active {
        background: white;
        border-bottom: 1px solid white;
      }
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

      .fa {
        color: gray;
        &:hover { color: black; }
      }
      .listings {
        text-align: left;
      }
    }

    #hamburger-menu.in + #page-content & .fa-bars {
      color: black;
    }
  }
</style>