<template lang="pug">
.vgo-sort-field.ai-center(@click='sort' :class='"sort" + current')
  span
    slot
  span.caret-wrapper
    i.sort-caret.ascending
    i.sort-caret.descending

</template>
<script>
export default {
  name: 'SortIcon',
  props: {
    value: {
      type: String,
      default: '',
    },
    field: {
      type: String,
      default: '',
    },
    asc: {
      type: String,
      default: '_ASC',
    },
    desc: {
      type: String,
      default: '_DESC',
    },
  },
  data () {
    return {
      current: 0,
    }
  },
  watch: {
    value (nval, oval) {
      if (!nval) this.current = 0
    },
  },
  methods: {
    sort () {
      let val = ''
      if (this.current === 0) {
        val = this.field + this.asc
        this.current++
      } else if (this.current === 1) {
        val = this.field + this.desc
        this.current++
      } else this.current = 0
      this.$emit('update:value', val)
      this.$emit('change')
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.vgo-sort-field
  cursor pointer
  color $fc-b2
  display inline-block
  user-select none
  .caret-wrapper
    display inline-flex
    flex-direction column
    align-items center
    height 34px
    width 24px
    vertical-align middle
    cursor pointer
    overflow initial
    position relative
    .sort-caret
      width 0
      height 0
      border 5px solid transparent
      position absolute
      left 7px
    .ascending
      border-bottom-color #C0C4CC
      top 5px
    .descending
      border-top-color #C0C4CC
      bottom 7px
  &.sort1 .ascending
    border-bottom-color $theme
  &.sort2 .descending
    border-top-color $theme
</style>
