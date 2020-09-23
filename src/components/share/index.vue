<template lang="pug">
el-dialog(:title='`分享 ${name}`' :visible.sync='dialogVisible' width='740px')
  .dialog-content.jc-between.ai-center(v-if="url")
    .QR-code
      img.w200.h200(:src="qrcodeUrl")
    .right
      el-form(label-width='90px')
        el-form-item(label='作品地址')
          el-input(size="small" :value="url")
            el-button(slot="append" icon="el-icon-document" @click='$utils.copyText(url)')
        el-form-item(label='嵌入到网站')
          el-input(size="small" :value='iframeCode')
            el-button(slot="append" icon="el-icon-document" @click='$utils.copyText(iframeCode)')
        el-form-item
          p.danger 如嵌入后显示异常，请在html页面的head里加入以下代码：
          el-input(size="small" :value='code')
            el-button(slot="append" icon="el-icon-document" @click='$utils.copyText(code)')

</template>

<script>

export default {
  name: 'Share',
  data () {
    return {
      dialogVisible: false,
      name: '',
      url: '',
      qrcodeUrl: '',
      iframeCode: '',
      code: '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">',
    }
  },
  methods: {
    async openDialog  (url, name) {
      this.url = url
      this.name = name
      this.iframeCode = `<iframe src="${url}" frameborder ="no" border="0" style="width: 100%;height: 600px;"></iframe>`
      this.dialogVisible = true
      this.qrcodeUrl = await this.$utils.getQrcodeUrl(url)
    },
  },

}
</script>

<style lang="stylus">
// .share-dailog

</style>
