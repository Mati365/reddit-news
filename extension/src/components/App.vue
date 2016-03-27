<template lang="jade">
  div
    aside#hamburger-menu(v-bind:class='{in: showMenu}')
      nav.text-bold Subreddits:
      .container
        .item #poland
        .item #technology
        .item #4chan
        .item #cpp0x
        .item #java
        .item #javascript
        .item #stupidmeme

    #page-content
      nav.text-center
        .col-1
          .fa.fa-lg.fa-fw.fa-bars(v-on:click='toggleMenu')

        .col-10
          .subtitle Reddit
          strong.title #poland

        .col-1
          .fa.fa-lg.fa-fw.fa-sign-out

</template>

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

    .item {
      @extend .no-select;
      margin: 5px 0;
      &:hover {
        font-weight: bold;
      }
    }
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

  nav {
    @extend .row;
    height: 28px;
    #page-content > & {
      border-bottom: 1px solid #efefef;
      .fa {
        color: gray;
        &:hover { color: black; }
      }
      .subtitle {
        font-size: 9px;
        color: gray;
      }
    }
    #hamburger-menu.in + #page-content & .fa-bars {
      color: black;
    }
  }

  .text-bold {
    font-weight: bold;
  }
</style>

<script>
  const App = {
    data() {
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