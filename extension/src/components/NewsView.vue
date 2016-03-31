<template lang="jade">
  // Navbar
  nav
    .container.tiny.text-center
      span
        .subtitle Reddit
        .text-bold.title /r/{{ subreddit }}
      span.messages
        a.no-decoration(v-tab-link='https://www.reddit.com/message/unread/')
          i.fa.fa-envelope-o &nbsp;
          | {{ messages }}

    ul.nav.listings
      li(v-for='type in listings' v-link-active)
        a.no-decoration(
          v-link="{path:'/news/' + $route.params.subreddit + '/' + type, params: $route.params, activeClass: 'active'}"
        ) {{ type }}
      li
        a.no-decoration(href='javascript:;' v-on:click='shareURL')
          i.fa.fa-share-alt &nbsp;
          | Share url

  // List
  .row(v-el:list)
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
  import localforage from 'localforage';

  import Platform from '../api/platform';
  import {fetchNews, setLinkClicked} from '../vuex/news/actions';
  import {fetchUserMessages, setMenuVisible} from '../vuex/user/actions';

  export default {
      name: 'NewsView'
    , vuex: {
        getters: {
            news: ({news}) => news.list
          , listings: ({news}) => news.listings
          , messages: ({user}) => user.messages
          , loading: ({news}) => !news.error && !news.list.length
        }
        , actions: {
            fetchNews
          , fetchUserMessages
          , setLinkClicked
          , setMenuVisible
        }
    }

    // Computed fields
    , computed: {
      subreddit() { return this.$route.params.subreddit; }
    }

    // On route change
    , route: {
      data ({ to }) {
        // Load news
        this.fetchNews(
              to.params.subreddit
            , to.params.sort
        );
        this.setMenuVisible(false);
      }
    }

    // Initialize timer after create
    , created() {
      this.fetchUserMessages();
    }

    , watch: {
      news() {
        localforage
            .getItem('cachedScroll')
            .then((val) => {
              if(val) {
                // todo: fix this shit, it should be mounted after rendered
                setTimeout(() => this.$els.list.scrollTop = val, 200);
                localforage.removeItem('cachedScroll');
              }
            });
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
        this.setLinkClicked(link.id);

        // Cache scroll position and open new tab
        localforage
            .setItem('cachedScroll', this.$els.list.scrollTop)
            .then(() => Platform.openTab(redirect ? link.url : link.redditURL));
      }

      /**
       * Share actual navigated page URL
       */
      , shareURL() {
        let fillForm = (data) => {
          Platform.fillTab('https://www.reddit.com/submit.compact', {
            'newlink': _.extend(data, {
              'sr': this.subreddit
            })
          });
        };
        Platform
          .getTabInfo()
          .then(fillForm);
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
  .messages {
    position: absolute;
    right: $padding;
    top: $padding;
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