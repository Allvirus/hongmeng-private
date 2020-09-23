<template lang="pug">
.list-card-item.flex.border-radius.hand.pr(:style='getStyle' v-on="$listeners" :class='{lock}')
  i.card--icon.flex-center.border-radius.fs-xxl(:class='icon' :style='`color: ${iconColor};background-color:${iconBg};`')
  .mgl2.jc-around.ff-cn
    span.fs-b.fc-b1 {{title}}
    span(v-if="desc") {{desc}}
  i.iconfont.iconwuquanxian(v-if="lock")
</template>
<script>
export default {
  name: 'ListCardItem',
  props: {
    icon: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '#fff',
    },
    iconBg: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    lock: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Number,
      default: 3,
    },
    margin: {
      type: Number,
      default: 0.7,
    },
  },
  computed: {
    getStyle () {
      return `flex: 0 0 ${100 / this.column - this.margin * 2}%;margin: ${this.margin}%;`
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.list-card-item
  border 1.5px solid #f2f2f2
  padding 10px
  &.lock
    background-color #f2f2f2
  &:hover
    box-shadow 2px 2px 20px rgba(#000, 0.06)
    transform scale(1.01)
  i.card--icon
    font-size 45px
    height 64px
    flex 0 0 @height
    color #fff

  i.iconwuquanxian
    position absolute
    font-size 20px
    right 10px
    top 10px
</style>
