<template lang="pug">
el-drawer.AddHotspotDialog(
  :title='`${model.id ? "编辑" : "添加"}${HOTSPOT[model.type_id].text}热点`',
  :visible.sync='dialogVisible',
  append-to-body,
  :modal='false',
  size='100%',
  :wrapperClosable='false',
  direction='rtl'
)
  .drawer-content.scroll-y.flex-1
    el-form(label-width='100px', label-position='top')
      el-form-item(label='热点名称')
        el-input(
          v-model='model.name',
          placeholder='请输入热点名称',
          :maxlength='100',
          show-word-limit,
          clearable
        )

      el-form-item(label='名称排版')
        el-radio-group(v-model='model.options.is_vertical_text')
          el-radio-button(:label='true') 文字竖排
          el-radio-button(:label='false') 文字横排

      el-form-item(label='名称背景色')
        el-color-picker(v-model="model.options.background_color")

      el-form-item(label='热点图标')
        img.page-bg2.w50.h50.fit-contain.border-radius(
          :src='model.hotspoticon.thumb_url',
          v-if='model.hotspoticon.thumb_url'
        )
        el-button.mgl2(
          @click='selectHotspotIcon',
          icon='el-icon-plus',
          type='primary'
        ) 选择热点图标

      //- 漫游 1
      el-form-item(label='链接场景')
        span {{model.options.title}}
        el-button.mgl2(@click='selectScene' icon='el-icon-plus' type='primary') 选择场景

      //- 链接 2
      el-form-item(label='链接打开方式')
        template(slot="label")
          span 链接打开方式
          Tip(placement='top' :popover='{content: "非https加密链接只能新窗口打开"}')
        el-radio-group(v-model='model.options.is_open_window')
          el-radio-button(:label='true') 内部打开
          el-radio-button(:label='false') 新窗口打开

      el-form-item(label='热点链接')
        el-input(
          v-model='model.options.url',
          placeholder='请输入以https|http开头的链接',
          :maxlength='100',
          show-word-limit,
          clearable
        )

      //- 链接 2

  .drawer-footer.jc-center
    el-button.w100(@click='dialogVisible = false') 取消
    el-button.w100(@click='', type='primary') 确定
</template>

<script>
import { HOTSPOT } from '@/config'
import options from './options'
export default {
  name: 'AddHotspot',
  data () {
    this.HOTSPOT = HOTSPOT
    return {
      dialogVisible: false,
      model: {
        name: '', // '场景漫游', // 热点名称长度不能超过100个字符串
        type_id: 1, // 1, // 类型参考如上（对应的（type_id））
        icon_id: '', // 1, // 除场景标注、内嵌文字、内嵌图片、视频影音之外必须传，若添加AR热点则"icon_id"必须为：AR动画 = 9的基础热点
        hotspoticon: {},
        ath: '', // 38.42, // 横坐标 const { hlookat, vlookat } = this.$krp.getView()
        atv: '', // 5.29, // 纵坐标
        is_polygon: false, // false, // 是否是多边形添加热点（目前暂不实现多边形热点，传false）
        options: {}, // "{'title':'os2v.jpg','scene_id':10002,'is_vertical_text':false,'background_color':'rgba(232, 16, 16, 0.8)'}",
      },
    }
  },
  methods: {
    open ({ type_id }) {
      this.model.type_id = type_id
      this.model.options = Object.assign({}, options[type_id])
      this.dialogVisible = true
    },
    selectHotspotIcon () {
      this.$vgo.getInstance('dialogs/HotspotIconSelector/').open(([item]) => {
        console.log(item)
        this.model.hotspoticon = item
      })
    },
    selectScene () {
      this.$vgo.getInstance('dialogs/SceneSelector/').open(([item]) => {
        console.log(item)
        this.model.options.title = item.name
        this.model.options.scene_id = item.id
        // this.model.options.thumb_url = item.thumb_url
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.AddHotspotDialog
  width 300px
  left auto
  top 50px

>>>.el-drawer
  outline none
  *
    outline none
  .el-drawer__header
    font-size 16px
    margin-bottom 0px
    padding 12px
    border-bottom 1px solid #ebeef5
    box-shadow 0 0 4px 0 rgba(200, 200, 200, 0.4)
  .el-drawer__body
    display flex
    flex-direction column
  .el-form
    padding 10px

.drawer-footer
  border-top 1px solid #ebeef5
  box-shadow 0 0 4px 0 rgba(200, 200, 200, 0.4)
  padding 12px
</style>
