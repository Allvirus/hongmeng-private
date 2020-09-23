<template lang="pug">
.quill-editor(:class='{"quill-editor--disabled": disabled}')
  .quill-editor-content(ref='quillEditor' :id='id')
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

const SizeStyle = Quill.import('attributors/style/size')
SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px', '22px']
Quill.register(SizeStyle, true)

const FontStyle = Quill.import('attributors/style/font')
const font = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
FontStyle.whitelist = font
Quill.register(FontStyle, true)

const AlignStyle = Quill.import('attributors/style/align')
const align = ['right', 'center', 'justify']
AlignStyle.whitelist = align
Quill.register(AlignStyle, true)

export default {
  name: 'RichText',
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: 'cloud.richeditor.image',
    },
  },
  data () {
    this.isCreated = this.$utils.getPromise()
    this.options = {
      modules: {
        imageResize: {},
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          // ['blockquote'],
          [{ header: 1 }, { header: 2 }],
          [{ color: [] }, { background: [] }],
          [{ align }],
          // [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }],
          [{ size: [false, ...SizeStyle.whitelist.slice(1)] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          // [{ indent: '+1' }, { indent: '-1' }],
          [{ font }],
          ['link', 'image', 'video'],
        ],
      },
      placeholder: !this.disabled ? '请输入...' : '未填写',
      theme: 'snow',
    }
    this.tempIndex = 1
    return {
      quill: null,
      id: 'quill-editor' + (Math.random() * 999999).toFixed(0),
    }
  },
  watch: {
    disabled: {
      async handler (val) {
        await this.isCreated.promise
        this.quill.enable(!val)
      },
      immediate: true,
    },
    value: {
      async handler (val) {
        await this.isCreated.promise
        if (this.$_content !== val) {
          this.quill.pasteHTML(val)
        }
      },
      immediate: true,
    },
  },
  mounted () {
    this.quill = new Quill('#' + this.id, this.options)
    this.isCreated.resolve()
    this.quill.on('editor-change', (delta, oldDelta, source) => this.updateHtml())
    this.quill.getModule('toolbar').addHandler('image', this.uploadImageHandler)
  },
  beforeDestroy () {
    this.quill = null
    delete this.quill
  },
  methods: {
    updateHtml () {
      this.format(this.$refs.quillEditor.children[0].children)

      let html = this.$refs.quillEditor.children[0].innerHTML
      const text = this.quill.getText()
      if (html === '<p><br></p>') html = ''
      this.$_content = html
      this.$emit('input', html)
      this.$emit('change', { html, text, quill: this.quill })
    },
    uploadImageHandler () {
      if (!this.upload) {
        this.upload = document.createElement('input')
        this.upload.setAttribute('type', 'file')
        this.upload.setAttribute('accept', 'image/*')
        this.upload.onchange = event => {
          const file = event.path[0].files[0]
          if (!file) return
          // 获取光标位置
          const range = this.quill.getSelection()
          // 上传统一elementui 格式
          const fileWrap = { raw: file, uid: Date.now() + this.tempIndex++ }
          // 上传文件
          this.$api.uploadApi(fileWrap, this.action).then(data => {
            // 插入img
            this.quill.insertEmbed(range.index, 'image', data[0].file_url)
          })
          this.upload.value = ''
        }
      }
      this.upload.click()
    },
    format (children) {
      let idx = children.length
      while (idx--) {
        const item = children[idx]
        // 设置图片最大宽度
        if (item.tagName.toLowerCase() === 'img') {
          item.style['max-width'] = '100%'
        }
        // 设置视频iframe宽度
        if (item.tagName.toLowerCase() === 'iframe') {
          item.style.width = '100%'
          item.style.height = '400px'
        }
        item.children.length && this.format(item.children)
      }
    },
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.ql-tooltip
  left 50%!important
  transform translateX(-50%)!important
.quill-editor--disabled .ql-toolbar
  height 0
  overflow hidden
  padding 0
.quill-editor,.ql-toolbar
  background-color #fff
  .ql-editor
    min-height 300px
  .quill-editor-content
    div[style*='top: -12px']
      display none
    // max-height 600px
    // overflow-y auto
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before
  content: '12px'
  font-size: 12px
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before
  content: '14px'
  font-size: 14px
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before
  content: '16px'
  font-size: 16px
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before
  content: '18px'
  font-size: 18px
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before
  content: '20px'
  font-size: 20px
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='22px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='22px']::before
  content: '22px'
  font-size: 22px

//默认的样式
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before
  content: '12px'
  font-size: 12px
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimSun]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimSun]::before
  content: "宋体"
  font-family: "SimSun"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before
  content: "黑体"
  font-family: "SimHei"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before
  content: "微软雅黑"
  font-family: "Microsoft YaHei"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=KaiTi]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=KaiTi]::before
  content: "楷体"
  font-family: "KaiTi"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=FangSong]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=FangSong]::before
  content: "仿宋"
  font-family: "FangSong"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before
  content: "Arial"
  font-family: "Arial"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Times-New-Roman]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Times-New-Roman]::before
  content: "Times New Roman"
  font-family: "Times New Roman"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before
  content: "sans-serif"
  font-family: "sans-serif"

</style>
