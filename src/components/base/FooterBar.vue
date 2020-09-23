<template lang="pug">
.vgo-footer-bar.border-radius.pd2
  slot

</template>
<script>
export default {
  name: 'FooterBar',
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.vgo-footer-bar
  position fixed
  left 200px
  right 26px
  z-index 1002
  bottom 0
  background-color #fff
  box-shadow $box-shadow
</style>
