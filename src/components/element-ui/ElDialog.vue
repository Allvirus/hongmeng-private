<template lang="pug">
ele-dialog(v-bind="$attrs" v-on="$listeners" ref='dialog' :fullscreen='isFull' :close-on-click-modal="closeOnClickModal")
  template(slot="title")
    .el-dialog__title(@dblclick='isFull = !isFull') {{title}}
    .el-dialog-custom--options
      i.el-icon-full-screen.hover(title='切换全屏/小窗' @click='isFull = !isFull')
  slot
  slot(name='footer' slot='footer')
</template>
<script>
import { Dialog } from 'element-ui'
export default {
  name: 'ElDialog',
  components: {
    EleDialog: Dialog,
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isFull: this.fullscreen,
    }
  },
}
</script>
<style lang="stylus">
.el-dialog
  transition all 0.3s
  &.pd0
    .el-dialog__body
      padding 0
  .el-dialog__header
    padding 0
    .el-dialog__title
      padding 20px 20px 10px
  .el-dialog-custom--options
    position absolute
    right 50px
    top 20px

</style>
