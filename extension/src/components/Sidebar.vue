<template lang="jade">
  nav.text-bold Sub-reddits:
  div(v-if='loading') Loading...
  ul.sidebar
    li(v-for='subreddit in subs' v-link-active)
      a.no-decoration(v-link="{path: '/news/' + subreddit, activeClass: 'text-bold'}") {{ subreddit }}

  footer.container
    a.fa.fa-lg.fa-fw.fa-info(v-link="{path: '/info'}")
    a.fa.fa-lg.fa-fw.fa-github-alt(v-tab-link='https://github.com/Mati365/reddit-news')
    span.right
      i.fa.fa-lg.fa-fw.fa-sign-out(v-on:click='logout')
</template>

<script type="text/ecmascript-6">
  import store from 'store2';
  import {fetchUserInfo} from '../vuex/user/actions';

  export default {
      name: 'Sidebar'
    , vuex: {
        getters: {
            subs: ({user}) => ['general', ...user.subs]
          , loading: ({user}) => !user.subs.length && !user.error
        }
      , actions: {
        fetchUserInfo
      }
    }
    , methods: {
      // Logout user
      logout() {
        store.clear();
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

  ul.sidebar {
    padding: $padding;
    padding-top: 0;
    margin-top: 0;
    max-height: 87%;
    overflow-y: auto;

    li {
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 5px 0;
      &:first-child {
        margin-bottom: 15px;
      }
      &:not(:first-child) a::before {
        content: '#';
      }
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
    }
  }
</style>