<template lang="jade">
  nav.text-center
    .container.tiny
      .subtitle Reddit
      strong.title /r/{{$route.params.subreddit}}
    ul.nav.listings
      li.active hot
      li new
      li random
      li top
      li controversial
</template>

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
     }
    }
  }
</style>