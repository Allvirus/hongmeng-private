<template lang="pug">
transition-group.drag-img--list(name='fade-transition' tag='div' v-if="list && list.length")
  .drag--img(v-for="(item, idx) in list" :key="item[feild]"
    @dragend="onDragend(idx, item)"
    @dragover="$event.preventDefault()"
    @drop="toIdx = idx"
    draggable="true")
    .imgwrap
      img(:src='item[feild]')
      i.el-icon-delete(@click='delItem(idx)')

</template>

<script>
export default {
  props: {
    list: {
      type: Array,
    },
    feild: {
      type: String,
      default: 'file_url',
    },
  },
  data () {
    return {
      toIdx: -99,
    }
  },
  methods: {
    // 排序
    onDragend (curIdx, img) {
      if (this.toIdx > -1) {
        this.list.splice(curIdx, 1)
        this.list.splice(this.toIdx, 0, img)
        this.toIdx = -99
      }
    },
    delItem (idx) {
      this.list.splice(idx, 1)
    },
  },
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.drag-img--list
  .drag--img
    display inline-block
    transition all 0.5s
    vertical-align top
    margin-right 10px
    margin-top 10px
    cursor move
    border-radius 10px
    overflow hidden
    border 1px dashed #ddd
    .imgwrap
      position relative
      height 100px
      width 120px
      img
        width 100%
        height 100%
      i
        position absolute
        right 5px
        top 5px
        border-radius 50%
        background-color rgba(#000, 0.3)
        height 26px
        width @height
        display flex
        align-items center
        justify-content center
        font-size 16px
        color $danger
        cursor pointer

  .fade-transition-enter,.fade-transition-leave-to
    opacity: 0
    transform: translateY(30px)

  .fade-transition-leave-active
    position: absolute
</style>
