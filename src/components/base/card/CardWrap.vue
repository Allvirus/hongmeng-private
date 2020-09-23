<template lang="pug">
.card-warp--base.card-wrap.hover-scale.border-radius.border(
  :class='{ dragable, selected }',
  @dragover='$event.preventDefault()',
  v-on='$listeners',
  v-bind='$attrs',
  :dragable='dragable'
)
  .pr.w100p(:style='height ? `height: ${height};` : ""')
    slot
  slot(name='bottom')
</template>
<script>
export default {
  name: 'CardWrap',
  props: {
    dragable: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.card-warp--base
  overflow hidden
  &:hover
    box-shadow 1px 1px 5px 2px $info
  &.selected
    box-shadow 0 0 1px 3px $success
  .full-cover
    width 100%
    height 100%
  .bottom-bar
    position absolute
    bottom 0
    left 0
    color #fff
    width 100%
    background-image linear-gradient(0deg, rgba(#000, 0.8) 0%, rgba(#000, 0) 100%)
  &.dragable
    cursor move
</style>
