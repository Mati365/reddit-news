<template lang="jade">
  nav.text-bold Sub-reddits:
  ul.sidebar
    li /r/poland
    li /r/technology
    li /r/4chan
    li /r/cpp0x
    li /r/java
    li /r/javascript
    li /r/stupidmeme

  footer.container
    i.fa.fa-lg.fa-fw.fa-info
    i.fa.fa-lg.fa-fw.fa-github-alt
    span.right
      i.fa.fa-lg.fa-fw.fa-graduation-cap
      i.fa.fa-lg.fa-fw.fa-sign-out
</template>

<style lang="sass">
  @import 'sass/const.scss';

  ul.sidebar {
    padding: $padding;
    li {
      margin: 5px 0;
      &:hover {
        font-weight: bold;
      }
    }
  }

  footer {
    position: absolute;
    bottom: 0;
    & > .right {
      float: right;
      color: gray;
    }
  }
</style>

<script>
  export default {
    name: 'Sidebar'
  };
</script>