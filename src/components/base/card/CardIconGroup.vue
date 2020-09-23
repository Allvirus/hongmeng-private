<template lang="pug">
.card-icon-gruop--base.ai-center(:style='getStyle')
  slot
</template>
<script>
export default {
  name: 'CardIconGroup',
  props: {
    position: {
      type: String,
      default: 'rt',
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
.card-icon-gruop--base
  position absolute
  border-radius 20px
  background-color rgba(#000, 0.5)
  padding 0 5px
  overflow hidden
  .card-icon--base
    background none
    border-radius 0
    &~.card-icon--base
      border-left 1px dotted rgba(#eee, 0.2)
</style>
