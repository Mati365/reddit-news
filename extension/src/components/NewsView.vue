<template lang="jade">
  // Navbar
  nav.text-center
    .container.tiny
      .subtitle Reddit
      strong.title /r/{{$route.params.subreddit}}
    ul.nav.listings
      li(v-for='type in listings' v-link-active)
        a.no-decoration(
          v-link="{path:'/news/' + $route.params.subreddit + '/' + type, params: $route.params, activeClass: 'active'}"
        ) {{ type }}
      li
        a.no-decoration(href='javascript:;')
          i.fa.fa-share-alt &nbsp;
          | Share url

  // List
  .news-container.row
    .row(v-if='loading') Loading...
    .row.link(v-for='link in news' v-bind:class='{visited: link.clicked}')
      .score
        div {{ link.score }}
        div.fa.fa-star-o.fa-fw

      .description(v-bind:class='{shared: link.thumbnail.length}')
        a.no-decoration(
          href='javascript:;'
          v-on:click='openLink(link)'
        ) {{ link.title }}
        div.subtitle
          span
            i.fa.fa-comment-o &nbsp;
            | {{ link.commentsCount }}
          span
            a.text-bold.no-decoration(href='javascript:;' v-on:click='openLink(link, true)')
              i.fa.fa-link &nbsp;
              | Link
          span submitted {{ link.time }} by {{ link.author }}

      .thumbnail(v-if='link.thumbnail.length')
        img(v-bind:src='link.thumbnail' v-placeholder-if-broken)

</template>

<script type="text/ecmascript-6">
  import store from 'store2';

  import Platform from '../api/platform';
  import {fetchNews} from '../vuex/news/actions';

  export default {
      name: 'NewsView'
    , vuex: {
        getters: {
            news: ({news}) => news.list
          , listings: ({news}) => news.listings
          , loading: ({news}) => !news.error && !news.list.length
        }
        , actions: {
          fetchNews
        }
    }

    // On route change
    , route: {
      data ({ to }) {
        // Cache route because chrome is reloading popup every time
        store.set('cached_route', to.params);

        // Load news
        this.fetchNews(
              to.params.subreddit
            , to.params.sort
        );
      }
    }

    // Methods
    , methods: {
      /**
       * Open new tab with link
       * @param link      Link object
       * @param redirect  Redirect to link attachment
       */
      openLink(link, redirect) {
        // There is a problem with clicked property in reddit api
        let cached = store.get('cached_clicked') || {};
        store.set('cached_clicked', _.assign(cached, {
          [link.id]: Date.now()
        }));

        // Open tab
        Platform.openTab(redirect ? link.url : link.redditURL);
      }
    }
  }
</script>

<style lang="sass" rel="stylesheet/scss">
  @import 'sass/const.scss';

  ul.listings {
    margin-top: 5px;
    width: 100%;

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
      &:last-child {
        margin-left: 10px;
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

    &:not(:last-child) {
      border-bottom: 1px dotted $separator-color;
    }
    &.visited * {
      color: gray;
      -webkit-filter: grayscale(100%);
    }
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
      word-wrap: break-word;
      &.shared {
        width: 65%;
      }
    }
    .subtitle {
      margin-top: 5px;
      & > span {
        margin-right: 6px;
      }
    }
    .thumbnail {
      max-width: 20%;
      max-height: 64px;
      padding-left: 5px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>