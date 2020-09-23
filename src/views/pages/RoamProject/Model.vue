<template lang='pug'>
.RoamProjectModel.page-content.ff-cn
  TitleBar.flex-auto(:title='$route.meta.title' back)
  el-form.flex-center.flex-1(label-width='100px' :model='model' :rules='rules' ref='form')
    .left
      el-form-item(label='')
        .ai-center
          .ff-cn.ai-center
            el-upload.w150.h150(
              action='placeholder'
              accept='.jpg,.jpeg,.png,.bmp,.gif'
              :fileId.sync='model.logoId'
              :fileUrl.sync='model.logoUrl')
            .label 项目LOGO
          .ff-cn.ai-center.mgl5
            el-upload.w150.h150(
              action='placeholder'
              accept='.jpg,.jpeg,.png,.bmp,.gif'
              :fileId.sync='model.coverId'
              :fileUrl.sync='model.coverUrl')
            .label 项目封面

      el-form-item(label='项目名称:' prop='name')
        el-input(v-model='model.name' placeholder='请输入每次' :maxlength='20' show-word-limit clearable)

      el-form-item(label='项目分类:')
        el-select(v-model='model.mainCategory' placeholder='请选择')
          el-option(:label='item.tagName' :value='item.tagName' v-for="item in projectTagList" :key="item.id")

      el-form-item(label='项目描述:')
        el-input(v-model='model.description' :maxlength='100' show-word-limit clearable
          type='textarea' :autosize='{minRows: 5}' placeholder='请输入描述')

      el-form-item(label='是否公开:')
        el-radio-group(v-model='model.isPublic')
          el-radio-button(:label='true') 公开
          el-radio-button(:label='false') 私密

    .right-form(style='margin-left:50px;')
      .fs-l.mgb5 微信分享
      .flex
        el-form-item.mg0
          .ff-cn.ai-center
            el-upload.w150.h150(
              action='placeholder'
              accept='.jpg,.jpeg,.png,.bmp,.gif'
              :fileId.sync='model.wechatId'
              :fileUrl.sync='model.wechatUrl')
            .label 分享封面(默认为项目封面)
        .text-field.flex-auto.mgl3
          el-form-item
            el-input(v-model='model.wechatTitle' placeholder='分享标题(默认为项目名称)' :maxlength='20' show-word-limit clearable)
          el-form-item
            el-input(v-model='model.wechatDescription' :maxlength='100' show-word-limit clearable
              type='textarea' :autosize='{minRows: 5}' placeholder='分享描述(默认为项目描述)')

      el-button.mgt2(@click='$refs.ModelScaleUpdate.open(model)' type='primary') 调整模型

      .submit(style='margin-top:175px;')
        el-button.w150(@click='submit' type='primary') 保 存
        el-button.w150(@click='$router.go(-1)') 取 消

  ModelScaleUpdate(ref='ModelScaleUpdate')
</template>

<script>
import { EUIRule } from '@/plugins/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'RoamProjectModel',
  components: {
    ModelScaleUpdate: _ => import('./comps/ModelScaleUpdate'),
  },
  data () {
    return {
      rules: {
        name: [EUIRule('required', '项目名称')],
      },
      model: {
        coverId: '',
        coverUrl: '',
      },
    }
  },
  computed: {
    ...mapGetters(['projectTagList']),
  },
  created () {
    this.$store.dispatch('getProjectTagList')
    this.getRoamProjectDetail()
  },
  methods: {
    getRoamProjectDetail () {
      this.$api.getRoamProjectDetail(this.$route.query.id).then(data => {
        this.model = Object.assign({}, this.model, data)
      })
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.roamProjectModel(this.model).then(data => {
            this.$vgo.tip('操作成功!', 'success')
            this.$router.go(-1)
          })
        }
      })
    },
  },
}
</script>

<style lang="stylus" >
.RoamProjectModel
  .right-form
    .el-form-item__content
      margin-left 0!important
</style>
