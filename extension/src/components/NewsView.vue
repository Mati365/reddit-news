<template lang="jade">
  // Navbar
  nav.text-center
    .container.tiny
      .subtitle Reddit
      strong.title /r/{{$route.params.subreddit}}
    ul.nav.listings
      li(v-for='type in listings' v-link-active)
        a.no-decoration(
          v-link="{ path:'/news/' + $route.params.subreddit + '/' + type, params: $route.params, activeClass: 'active' }"
        ) {{ type }}

  // List
  .news-container.row
    .row.link(v-for='link in news')
      .score
        div {{ link.score }}
        div.fa.fa-star-o.fa-fw

      .description
        div {{ link.title }}
        div
          span.subtitle submitted {{ link.time }} by {{ link.author }}

</template>

<script type="text/ecmascript-6">
  import {fetchNews} from '../vuex/news/actions';

  export default {
      name: 'NewsView'
    , vuex: {
        getters: {
          news: ({news}) => news.list
        }
        , actions: {
          fetchNews
        }
    }

    // On route change
    , route: {
      data ({ to }) {
        this.fetchNews(
              to.params.subreddit
            , to.params.sort
        );
      }
    }

    // Constants
    , data() {
      return {
        // todo: random
        listings: ['hot', 'new', 'top', 'controversial']
      };
    }
  }
</script>

<style lang="sass" rel="stylesheet/scss">
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

  .news-container {
    overflow-y: auto;
    height: calc(100vh - 60px);
  }

  .link {
    padding-left: 0;
    padding-right: 0;

    & > div {
      float: left;
    }
    .score {
      width: 15%;
      text-align: center;
      font-weight: bold;
    }
    .description {
      width: 85%;
    }
  }
</style>