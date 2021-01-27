<template lang="pug">
ele-upload.lh1.custom--el-upload(
  action='',
  ref='upload',
  :on-change='onElChangeUpload',
  :auto-upload='false',
  :show-file-list='false',
  v-bind='$attrs',
  v-on='$listeners',
  :class='displayType + "--type"',
  :drag='displayType !== "button"'
)
  .upload-tips.h100p(v-if='displayType !== "button"')
    i.fs-xl.pac(:class='icon', v-if='!fileUrl && !avatar')
    slot
  slot(v-else)
  img.pac(
    :src='thumbUrl || fileUrl || avatar',
    v-if='isPicture && (thumbUrl || fileUrl || avatar)'
  )

  VueCropper(
    ref='VueCropper',
    v-if='crop',
    :width='cropConfig.width',
    :height='cropConfig.height'
  )

//- 图片类型自动上传 使用
//- el-upload(
//-   action='cloudapp.vrliveroom.cover'
//-   accept='.jpg,.jpeg,.png,.bmp,.gif'
//-   :fileId.sync='model.cover_image_id'
//-   :fileUrl.sync='model.cover_image_url')
</template>
<script>
import { Upload } from 'element-ui'
export default {
  name: 'ElUpload',
  components: {
    EleUpload: Upload,
    VueCropper: () => import('@/components/vue-cropper/'),
  },
  props: {
    icon: {
      type: String,
      default: 'el-icon-plus',
    },
    avatar: {
      type: String,
      default: '',
    },
    // 上传框风格 默认avatar,  button avatar
    displayType: {
      type: String,
      default: 'avatar',
    },
    onChange: {
      type: Function,
      default: () => { },
    },
    // 后端上传判断字段 'action.common.image'
    action: { // 传入字段 自动上传
      type: String,
      default: '',
    },
    // 上传类型是否图片
    isPicture: {
      type: Boolean,
      default: true,
    },
    // 文件id
    fileId: {
      type: String,
      default: '',
    },
    // 文件url
    fileUrl: {
      type: String,
      default: '',
    },
    // 文件ids
    fileIds: {
      type: Array,
      default: () => [],
    },
    // 文件urls
    fileUrls: {
      type: Array,
      default: () => [],
    },
    // 文件thumbUrl
    thumbUrl: {
      type: String,
      default: '',
    },
    // 文件最大大小 kb
    maxSize: {
      type: Number,
      default: 0,
    },
    // 图片是否裁剪
    crop: {
      type: Boolean,
      default: false,
    },
    // 裁剪配置
    cropConfig: {
      type: Object,
      default: () => ({ width: 200, height: 200 }),
    },
    // 设置多个上传 限制上传数量 -1 不限制, 0 不走多个上传(配合fileIds限制上传)
    limitNum: {
      type: Number,
      default: 0,
    },
  },
  data () {
    this.fileList = []
    this.uploadReturnData = []
    return { }
  },
  methods: {
    async onElChangeUpload (file) {
      if (this.maxSize && file.size > this.maxSize * 1024) {
        this.$vgo.tip(`文件大小超过${this.maxSize / 1024}Mb!`, 'warning')
        return
      }
      if (!this.validatetType(file.raw.type)) {
        this.$vgo.tip('选择文件类型不正确!', 'warning')
        return
      }
      file.url = window.URL.createObjectURL(file.raw)
      file.maxName = file.name.slice(0, file.name.lastIndexOf('.')).slice(0, 50)
      this.onChange(file)
      if (this.limitNum) return this.multipleUpload(file)
      // 是否裁剪
      if (this.crop) file.raw = await this.handleCropper(file)
      // 是否自动上传
      if (this.action) {
        console.log('action', this.action)
        this.$api.uploadApi(file, this.action, { isPicture: this.isPicture }).then(data => {
          this.$emit('update:fileId', data[0].file_id)
          this.fileIds.push(data[0].file_id)
          this.$emit('update:fileUrl', data[0].file_url)
          this.fileUrls.push(data[0].file_url)
          this.$emit('update:thumbUrl', data[0].thumb_url)
          this.$emit('avatarUrl', data[0].fileName)
          this.$vgo.tip('上传成功!', 'success')
        })
      }
      // 清空
      this.$el.querySelector('input').value = ''
    },
    multipleUpload (file) {
      clearTimeout(this.timer)
      this.fileList.push(file)
      this.timer = setTimeout(() => {
        if (this.limitNum !== -1) this.fileList = this.fileList.slice(0, this.limitNum - this.fileIds.length)
        this.loopUpload(this.fileList)
      }, 200)
    },
    // 上传全景
    async loopUpload (list) {
      if (list.length) {
        const data = await this.$api.uploadApi(list.slice(0, 10), this.action, { isPicture: this.isPicture })
        this.$vgo.tip(`成功上传${data.length}张`, 'success')
        this.uploadReturnData.push(...data)
        list.splice(0, 10)
      }
      if (list.length) {
        this.loopUpload(list)
      } else {
        this.uploadReturnData.map(item => {
          this.fileIds.push(item.file_id)
          this.fileUrls.push(item.file_url)
        })
        this.fileList = []
        this.uploadReturnData = []
      }
    },
    // 裁剪
    handleCropper (file) {
      return new Promise((resolve, reject) => {
        this.$refs.VueCropper.open(file.url, (fileRaw) => resolve(fileRaw))
      })
    },
    // 选择文件
    selectFile () {
      this.$el.querySelector('input').click()
    },
    // 文件类型验证
    validatetType (type) {
      const typeArr = type.split('/') // image/png
      if (this.$attrs.accept) {
        if (this.$attrs.accept.includes('*')) { // image/*
          return typeArr[0] === this.$attrs.accept.split('/')[0]
        } else { // '.jpg,.png' ? .png
          return this.$attrs.accept.split(',').includes('.' + typeArr[1])
        }
      }
      return true
    },
  },
}
</script>

<style lang="stylus">
.custom--el-upload
  display inline-block

.avatar--type
  width 120px
  height 120px
  .el-upload
    position relative
    width 100%
    height @width
    .el-upload-dragger
      width 100%
      height 100%
      img
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        max-width 100%
        max-height 100%
</style>
