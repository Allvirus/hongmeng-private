<template lang="pug">
.vgo-bg-wrap.page-dark.border-radius(:class='{"padding-spacing": spacing}')
  slot

</template>
<script>
export default {
  name: 'BGWrap',
  props: {
    spacing: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.vgo-bg-wrap
  overflow hidden
</style>
