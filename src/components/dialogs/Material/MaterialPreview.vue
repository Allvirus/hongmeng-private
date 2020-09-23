<template lang="pug">
.material-preview
  el-dialog(title='素材预览' :visible.sync='dialogVisible'  width='860px' :before-close='close' append-to-body)
    .dialog-content
      h3.tac {{previewData.name}}
      .tac.mgt2
        video.h400(controls :src='previewData.url' v-show="type === 3")
        audio.w600.mgy5(controls ref='audio' :src='previewData.url' loop v-show="type === 2")
      div.description(v-html="previewData.content" v-if="type === 4")
    .flex-center(slot='footer')
      el-button(@click='close') 关 闭

  el-image(ref='imgPreview' :src="previewData.url")
</template>

<script>
export default {
  name: 'MaterialPreview',
  data () {
    return {
      previewData: { url: '', content: '', name: '' },
      isPlay: false,
      type: 0,
      dialogVisible: false,
    }
  },

  methods: {
    open (type, data) {
      this.previewData = Object.assign({}, data)
      this.type = type
      if (type === 1) {
        this.$refs.imgPreview.$children[0].showViewer = true
      }
      if (type === 2 || type === 3 || type === 4) {
        this.dialogVisible = true
      }
    },
    close () {
      this.previewData = { content: '', url: '', name: '' }
      this.srcList = []
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="stylus">
.material-preview
  .description
    min-height 400px
  .el-image
    height 0
    width 0
</style>
