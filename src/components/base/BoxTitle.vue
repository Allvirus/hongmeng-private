<template lang="pug">
.vgo-box-title.jc-between.ai-center.fc-b1(:class='sub ? "vgo-box-subtitle pdy1" : "pdy2"')
  .vgo-box-title--content(:class='{omit: "omit"}' :title='omit ? $slots.default[0].text : ""')
    span.mgr1.title--line(v-if="line")
    i.prepend--icon.fs-l.pdx1(v-if="icon" :class='icon')
    slot
    Tip(:placement='$attrs.placement' :popover='$attrs.popover')
  span.fr.hover.fc-b3(@click='goPage' v-if='to || url') {{rightText}}
</template>
<script>
export default {
  name: 'BoxTitle',
  components: {
    Tip: _ => import('./Tip'),
  },
  props: {
    // 是否子标题
    sub: {
      type: Boolean,
      default: false,
    },
    // 溢出隐藏
    omit: {
      type: Boolean,
      default: false,
    },
    // 前缀icon
    icon: {
      type: String,
      default: '',
    },
    // 前缀竖线
    line: {
      type: Boolean,
      default: false,
    },
    // 路由地址router.push(to)
    to: {
      type: [String, Object],
      default: '',
    },
    // 路由地址是否 router.replace(to)
    replace: {
      type: Boolean,
      default: false,
    },
    // a link
    url: {
      type: String,
      default: '',
    },
    // 是否显示 右侧 链接 rightText || 更多
    rightText: {
      type: String,
      default: '更多',
    },
  },
  methods: {
    goPage () {
      this.to && this.$router[this.replace ? 'replace' : 'push'](this.to)
      this.url && (window.location.href = this.url)
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.el-card__header
  // padding 18px 10px!important
  .vgo-box-title
    padding 0
.vgo-box-title
  line-height initial
  .vgo-box-title--content
    font-size 16px
    font-weight 600
    .title--line
      padding 1px
      background-color $theme
    i.prepend--icon
      font-weight 600
  &.vgo-box-subtitle
    .vgo-box-title--content
      font-size $fs-m

</style>
