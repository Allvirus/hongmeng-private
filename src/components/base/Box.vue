<template lang="pug">
.padding-spacing
  .vgo-box.padding-spacing.box-shadow.border-radius.flex(
    :style='{"background-color": bgc}')
    .flex-1.content--box(:class='layoutClass')
      slot
    i.el-icon-close.vgo-box--close(
      v-if='closeable'
      @click='close')
</template>
<script>
export default {
  name: 'Box',
  props: {
    // 盒子背景
    bgc: {
      type: String,
      required: false,
      default: '',
    },
    // slot 布局类名
    layoutClass: {
      type: String,
      default: '',
    },
    // 盒子是否可关闭
    closeable: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 盒子标题
    title: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 盒子关闭回调
    onClose: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  data () {
    return {
      isShow: true,
    }
  },
  methods: {
    close () {
      this.$emit('on-close')
    },
  },

}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
.vgo-box
  background-color #fff
  .content--box
    overflow hidden
  .vgo-box--close
    width 20px
    height 20px
    line-height 20px
    text-align center
    cursor pointer
    font-size $fs-m
    border-radius 3px
    color $fc-b3
    hover($danger, rgba(#000, 0.1))
</style>
