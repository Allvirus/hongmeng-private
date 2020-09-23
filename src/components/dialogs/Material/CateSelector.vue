<template lang="pug">
el-dialog(
  title='移动的分类',
  append-to-body,
  :visible.sync='dialogVisible',
  width='400px'
)
  .dialog-content.tac
    el-select.w300(v-model='cateId', placeholder='请选择')
      el-option(
        :label='tag.name',
        :value='tag.id',
        :disabled='+curId === +tag.id',
        v-for='tag in list',
        :key='tag.id'
      )
  .dialog-footer(slot='footer')
    el-button(@click='dialogVisible = false') 取 消
    el-button(type='primary', @click='submit') 确 定
</template>
<script>
export default {
  name: 'CateSelector',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    curId: {
      type: [Number, String],
      default: 1,
    },
  },
  data () {
    return {
      dialogVisible: false,
      cateId: '',
    }
  },
  methods: {
    open (cb) {
      this.cateId = ''
      this.dialogVisible = true
      this.cb = cb
    },
    submit () {
      if (this.cateId === '') {
        this.$vgo.tip('请选择分类!', 'warning')
        return
      }
      this.cb(this.cateId)
      this.dialogVisible = false
    },
  },
}
</script>
<style lang="stylus">
.cate-manage-dialog
  .dialog-content
    min-height 300px
  .item
    transition all 0.5s
  .el-tag
    vertical-align middle
    i.el-icon-close
      font-size 16px
    .el-icon-edit
      margin-left 5px
      padding 2px
  .fade-transition-enter, .fade-transition-leave-to
    opacity 0
    transform translateY(30px)
  .fade-transition-leave-active
    position absolute
</style>
