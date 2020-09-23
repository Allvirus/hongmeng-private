<template lang="pug">
i.card-icon--base.round.flex-center(:style='getStyle' v-bind="$attrs" v-on="$listeners")
</template>
<script>
// Tip(placement='top' :popover='{content: "非https加密链接只能新窗口打开"}')

export default {
  name: 'CardIcon',
  props: {
    position: {
      type: String,
      default: '',
    },
    pd: { // 间距
      type: String,
      default: '10px',
    },
  },
  computed: {
    getStyle () {
      let str = this.position ? 'position: absolute;' : ''
      if (this.position.includes('r')) str += `right: ${this.pd};`
      if (this.position.includes('l')) str += `left: ${this.pd};`
      if (this.position.includes('b')) str += `bottom: ${this.pd};`
      if (this.position.includes('t')) str += `top: ${this.pd};`
      return str
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.card-icon--base
  background-color rgba(#000, 0.5)
  cursor pointer
  font-size 16px
  user-select none
  color #aaa
  width 26px
  height 26px
  &:hover
    filter saturate(300%)

</style>
