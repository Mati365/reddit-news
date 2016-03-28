<template lang="jade">
  nav.text-bold Sub-reddits:
  ul.sidebar
    li(v-if='loading') Loading...
    li(v-for='subreddit in subs' v-link-active)
      a.no-decoration(v-link="{ path: '/news/' + subreddit, activeClass: 'text-bold' }") {{ '#' + subreddit }}

  footer.container
    i.fa.fa-lg.fa-fw.fa-info
    i.fa.fa-lg.fa-fw.fa-github-alt
    span.right
      i.fa.fa-lg.fa-fw.fa-sign-out
</template>

<script type="text/ecmascript-6">
  import {fetchUserInfo} from '../vuex/user/actions';

  export default {
      name: 'Sidebar'
    , vuex: {
        getters: {
            subs: ({user}) => user.subs
          , loading: ({user}) => !user.subs.length && !user.error
        }
      , actions: {
        fetchUserInfo
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
      &:hover {
        font-weight: bold;
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
  }
</style>