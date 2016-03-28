<template lang="jade">
  nav.text-center
    .container.tiny
      .subtitle Reddit
      strong.title /r/{{$route.params.subreddit}}
    ul.nav.listings
      li(v-for="type in listings" v-link-active)
        a.no-decoration(
          v-link="{ path:'/news/' + $route.params.subreddit + '/' + type, params: $route.params, activeClass: 'active' }"
        ) {{ type }}
</template>

<script>
  import {fetchUserInfo} from '../vuex/user/actions';

  export default {
      name: 'NewsView'
    , data() {
      return {
        listings: ['hot', 'new', 'random', 'top', 'controversial']
      };
    }
  }
</script>

<style lang="sass">
  @import 'sass/const.scss';

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
        font-weight: bold;
      }
    }
  }
</style>