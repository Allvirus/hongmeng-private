<template lang='pug'>
el-dialog(title='模型调整' :visible.sync='dialogVisible' width='900px')
  iframe.w100p.h100p(:src='model.previewUrl' style='min-height: 500px;' ref='iframe' v-if="dialogVisible")
  .dialog-footer(slot='footer')
    //- el-button(@click='dialogVisible = false') 取 消
    span 设置模型缩放比例:
    el-input-number.mgl1(v-model="scale" @change='handleChangeScale' :precision="2" :step="0.05" :max="10" :min="1")
    el-button.mgl2(@click='dialogVisible = false') 取 消
    el-button.mgl2(type='primary' @click='submit') 确 定
</template>
<script>
export default {
  name: 'OfflineList',
  data () {
    return {
      model: {},
      scale: 0,
      dialogVisible: false,
    }
  },
  methods: {
    open (model) {
      this.dialogVisible = true
      this.model = model
      this.scale = model.scenes[0].scale
    },
    handleChangeScale () {
      this.$refs.iframe.contentWindow.postMessage({ type: 'setScale', scale: this.scale }, '*')
    },
    submit () {
      this.$api.updateAllModelScale(this.model.id, this.scale).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.dialogVisible = false
        this.model.scenes[0].scale = this.scale
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
