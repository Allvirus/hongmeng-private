<template lang='pug'>
.vgo-title-bar.h50.ai-center.bd-b.pr
  i.el-icon-arrow-left.vgo-back.pa.hover.flex-center(v-if="back" @click='$router.go(-1)')
  .vgo-title
    span.fs-l {{title}}
  slot
</template>
<script>
export default {
  name: 'TitleBar',
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang='stylus'>
.vgo-title-bar
  padding 0 44px
  .vgo-back
    left 0px
    height 100%
    width 40px
    font-size 20px
    cursor pointer

  // font-size
</style>
