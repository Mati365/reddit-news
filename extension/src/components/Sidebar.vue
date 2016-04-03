<template lang="jade">
  nav.text-bold Choose source

  .text-bold(v-if='loading') Loading...
  ul.sidebar
    li(v-show='!loading')
      .text-bold Multis:
      ul
        li(v-for='multi in multis' v-link-active)
          a.no-decoration(
            v-link="{path: '/news/multi/' + multi.name, activeClass: 'text-bold'}"
          ) {{ multi.name }}

    li(v-show='!loading')
      .text-bold Sub-reddits:
      ul
        li(v-for='subreddit in subreddits' v-link-active)
          a.no-decoration(
            v-link="{path: '/news/subreddit/' + subreddit, activeClass: 'text-bold'}"
          ) {{ subreddit }}

  footer.container
    a.fa.fa-lg.fa-fw.fa-plus(v-tab-link='https://www.reddit.com/subreddits/')
    a.fa.fa-lg.fa-fw.fa-info(v-link="{path: '/info'}")
    a.fa.fa-lg.fa-fw.fa-github-alt(v-tab-link='https://github.com/Mati365/reddit-news')
    span.right
      i.fa.fa-lg.fa-fw.fa-sign-out(v-on:click='logout')
</template>

<script type="text/ecmascript-6">
  import localforage from 'localforage';

  import client from '../api';
  import {fetchUserInfo} from '../vuex/user/actions';

  export default {
      name: 'Sidebar'
    , vuex: {
      getters: {
          subreddits: ({user}) => ['general', ...user.subs.subreddits]
        , multis: ({user}) => user.subs.multis
        , loading: ({user}) => !user.subs.subreddits.length && !user.error
      }
      , actions: {
        fetchUserInfo
      }
    }
    , methods: {
      // Logout user
      logout() {
        // Clear cache
        client.logout();
        localforage.clear();

        // Close browser
        window.close();
      }
    }
    , created() {
      this.fetchUserInfo();
    }
  }
</script>

<style lang="sass" rel="stylesheet/scss">
  @import 'sass/const.scss';

  #hamburger-menu > div {
    padding: $padding;
  }

  ul {
    padding: $padding;
    padding-top: 0;
  }
  ul.sidebar {
    margin-top: 0;
    max-height: 87%;
    overflow-y: auto;

    > li:first-of-type a::before {
      content: '+';
    }
    > li:not(:first-of-type) a::before {
      content: '#';
    }

    li {
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 5px 0;
    }
  }

  footer {
    position: absolute;
    bottom: 0;
    color: lightgray;

    & > .right {
      float: right;
    }
    a.fa {
      color: lightgray;
      text-decoration: none;
      &:hover {
        color: black;
      }
    }
  }
</style>