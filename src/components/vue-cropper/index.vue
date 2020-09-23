<template lang="pug">
el-dialog.vue-cropper-dialog(
  title="裁剪图片"
  :visible.sync="dialogVisible"
  append-to-body
  width="550px")
  .dialog-content
    .vue-cropper-wrap.margin-auto(:style='{height: `${height*1.25}px`, width: `${width*1.25}px`}')
      VueCropper(
      ref="cropper"
      :img="option.img"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :canMoveBox="option.canMoveBox"
      :info="option.info"
      :canScale="option.canScale"
      :autoCrop="option.autoCrop"
      :autoCropWidth='width'
      :autoCropHeight='height'
      :fixedBox="option.fixedBox")
  .dialog-footer.jc-center(slot="footer")
    el-button(@click='dialogVisible = false') 取消
    el-button(@click='finish' type='primary') 确定

</template>
<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'Cropper',
  components: {
    VueCropper,
  },
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  data () {
    return {
      dialogVisible: false,
      option: {
        img: '',
        canMoveBox: false,
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定裁剪框
        // fixedNumber: [1, 1] // 截图框的宽高比例
      },
    }
  },
  methods: {
    open (img, cb) {
      this.option.img = img
      this.dialogVisible = true
      this.cb = cb
    },
    finish () {
      this.$refs.cropper.getCropBlob((data) => {
        const file = new File([data], 'avatar.png', { type: 'image/png', lastModified: Date.now() })
        this.cb(file, URL.createObjectURL(data))
        this.dialogVisible = false
      })
    },
  },
}
</script>
<style lang="stylus">

</style>
