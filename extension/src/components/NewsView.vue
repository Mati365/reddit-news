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

      .description(v-bind:class='{ shared: link.thumbnail.length }')
        a.no-decoration(href='javascript:;' v-on:click='openLink(link.redditURL)') {{ link.title }}
        div.subtitle
          span.link
            a.text-bold.no-decoration(href='javascript:;' v-on:click='openLink(link.url)')
              i.fa.fa-link &nbsp;
              | Link
          span submitted {{ link.time }} by {{ link.author }}
          span.pull-right {{ link.commentsCount }} #[i.fa.fa-comment-o]

      .thumbnail(v-if='link.thumbnail.length')
        img(v-bind:src='link.thumbnail')

</template>

<script type="text/ecmascript-6">
  import Platform from '../api/platform';
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

    // Methods
    , methods: {
      // Bind to platform method
      openLink(url) {
        Platform.openTab(url);
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
    .link {
      margin-right: 5px;
    }
    .score {
      width: 15%;
      text-align: center;
      font-weight: bold;
    }
    .description {
      width: 85%;
      &.shared {
        width: 65%;
      }
    }
    .thumbnail {
      width: 20%;
      height: auto;
      padding-left: 5px;
      & > img {
        width: 100%;
      }
    }
  }
</style>