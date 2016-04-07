<template lang="jade">
  // Navbar
  nav
    .container.tiny.text-center
      span
        span.subtitle {{ title }} &nbsp;
        span.text-bold.title /r/{{ subreddit }}
      span.messages
        a.no-decoration(v-tab-link='https://www.reddit.com/message/unread/')
          i.fa.fa-envelope-o &nbsp;
          | {{ messages }}

    ul.nav.listings
      li(v-for='sort in listings' v-link-active)
        a.no-decoration(
          v-link="{name: 'news', params: {type: type, name: subreddit, sort: sort}, activeClass: 'active'}"
        ) {{ sort }}
      li
        a.no-decoration(href='javascript:;' v-on:click='shareURL')
          i.fa.fa-share-alt &nbsp;
          | Share url

  // List
  .full-size(v-el:list)
    .row(v-if='loading') Loading...
    .row.link(v-for='link in news' v-bind:class='{visited: link.clicked}')
      .score
        div {{ link.score }}
        div.fa.fa-star-o.fa-fw

      img.thumbnail(
        v-if='link.thumbnail.length'
        v-bind:src='link.thumbnail'
        v-placeholder-if-broken
        v-expand-click
      )

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
          , loading: ({news}) => !news.error && !news.list.length

          , messages: ({user}) => user.messages
          , multis: ({user}) => user.subs.multis
        }
        , actions: {
            fetchNews
          , fetchUserMessages
          , setLinkClicked
          , setMenuVisible
        }
    }

    // Fetch messages
    , created() {
      this.fetchUserMessages();
    }

    // Computed fields
    , computed: {
        subreddit() { return this.$route.params.name; }
      , type() { return this.$route.params.type; }
      , title() { return _.upperFirst(this.type); }
    }

    // On route change
    , route: {
      data ({ to }) {
        let multi = to.params.type === 'multi'
          , namePromise = multi
            ? localforage.getItem('cachedListing').then((data) => data.subreddits)
            : Promise.resolve();

        // Fetch data after login
        const loadData = (subreddits) => {
          let {name, sort} = to.params;

          // Check multi list
          this.fetchNews(
                multi && name
              , multi ? (subreddits || _.find(this.multis, {name}).subreddits) : name
              , sort
          );
        };

        // Fetch multi cache after login
        if(multi)
          namePromise.then(loadData);
        else
          loadData();

        // Hide menu
        this.setMenuVisible(false);
      }
    }

    , watch: {
      news() {
        localforage
            .getItem('cachedScroll')
            .then((val) => {
              val && this.$nextTick(() => this.$els.list.scrollTop = val);
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

    &:nth-child(even) {
      background: rgba(128, 128, 128, 0.03);
    }
    &:not(:last-child) {
      border-bottom: 1px dotted $separator-color;
    }
    &.visited * {
      color: gray;
      -webkit-filter: grayscale(100%);
    }
    .score {
      width: $score_width;
      text-align: center;
      font-weight: bold;
    }
    .description {
      word-wrap: break-word;
      padding: 0 6px;

      width: $description_width;
    }
    .score + .description {
      width: $description_full_width;
    }
    .subtitle {
      color: gray;
      margin-top: 5px;
      & > span {
        margin-right: 6px;
      }
    }
    img.thumbnail {
      width: $thumbnail_width;
      max-height: 64px;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>