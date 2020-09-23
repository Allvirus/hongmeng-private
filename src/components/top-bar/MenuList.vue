<template lang='pug'>
.editor-menu-list.flex
  template(v-for='(item, idx) in menuList')
    el-dropdown(
      v-if='item.list',
      :key='item.icon',
      :show-timeout='100',
      :hide-timeout='100',
      placement='bottom'
    )
      .menu-item.ff-cn.ai-center.jc-center.h100p
        i(:class='item.icon')
        span {{ item.title }}
      el-dropdown-menu.sub-menu(slot='dropdown')
        .sub-menu-box.ai-stretch(
          v-for='(subitem, idx) in item.list',
          :key='idx'
        )
          .left-title.flex-center
            div {{ subitem.title }}
          .right-sub-menu-list.ai-center
            .sub-menu-item.ff-cn.ai-center(
              v-for='menuItem in subitem.list',
              :key='menuItem.text',
              @click='menuItem.action && menuItem.action()'
            )
              i(:class='menuItem.icon')
              span {{ menuItem.text }}

    .menu-item.ff-cn.ai-center.jc-center.h100p(v-else :key='item.icon')
      i(:class='item.icon')
      span {{ item.title }}

</template>
<script>
import { HOTSPOT, materialtype } from '@/config'
export default {
  name: 'MenuList',
  data () {
    const { getInstance } = this.$vgo
    this.menuList = [
      {
        type: 'hotspot',
        title: '热点',
        icon: 'iconfont icon-redian',
        list: [
          {
            type: 'builtIn',
            title: '内嵌热点',
            list: [
              {
                text: '内嵌文字',
                action: () => {
                  getInstance('dialogs/AddHotspot/').open({ type_id: HOTSPOT.TEXT_IN_ID })
                },
                id: HOTSPOT.TEXT_IN_ID,
                icon: 'iconfont icon-text',
              },
              { text: '内嵌图片', id: HOTSPOT.IMAGE_IN_ID, icon: 'iconfont icon-image' },
              { text: '内嵌视频', id: HOTSPOT.VIDEO_IN_ID, icon: 'iconfont icon-shipin' },
              { text: 'AR动画', id: HOTSPOT.AR_ID, icon: 'iconfont icon-AR' },
            ],
          },
          {
            type: 'normal',
            title: '基础热点',
            list: [
              { text: '场景漫游', icon: 'iconfont icon-icon-test', id: HOTSPOT.ROAM_ID },
              { text: '超链接', icon: 'iconfont icon-Url', id: HOTSPOT.LINK_ID },
              { text: '物品3D', icon: 'iconfont icon-cube1', id: HOTSPOT.THREE_ID },
              { text: '图文信息', icon: 'iconfont icon-text', id: HOTSPOT.ARTICLE_ID },
              { text: '音频语音', icon: 'iconfont icon-yuyin ', id: HOTSPOT.AUDIO_ID },
              { text: '视频影音', icon: 'iconfont icon-shipin2', id: HOTSPOT.VIDEO_ID },
              { text: '幻灯片', icon: 'iconfont icon-image', id: HOTSPOT.IMAGE_ID },
              { text: '场景标注', icon: 'iconfont icon-anfaredian', id: HOTSPOT.MARK_ID },
            ],
          },
        ],
      },
      {
        type: 'menu',
        title: '菜单',
        icon: 'iconfont icon-squares',
        list: [
          {
            type: 'menuCommon',
            title: '常用菜单',
            list: [
              { text: '链接', icon: 'iconfont icon-icon-test' },
              { text: '图文', icon: 'iconfont icon-icon-test' },
              { text: '地图', icon: 'iconfont icon-icon-test' },
              { text: '电话', icon: 'iconfont icon-icon-test' },
              { text: '音频', icon: 'iconfont icon-icon-test' },
              { text: '幻灯片', icon: 'iconfont icon-icon-test' },
              { text: '视频', icon: 'iconfont icon-icon-test' },
            ],
          },
        ],
      },
      {
        type: 'effect',
        title: '特效',
        icon: 'iconfont icon-xiaoguozonglan',
        list: [
          {
            type: 'sunEffect',
            title: '阳光特效',
            list: [
              { text: '光效一', icon: 'iconfont icon-icon-test', type: 'blinkstyle1' },
              { text: '光效二', icon: 'iconfont icon-icon-test', type: 'blinkstyle2' },
              { text: '光效三', icon: 'iconfont icon-icon-test', type: 'blinkstyle3' },
              { text: '光效四', icon: 'iconfont icon-icon-test', type: 'blinkstyle4' },
              { text: '光效五', icon: 'iconfont icon-icon-test', type: 'blinkstyle5' },
              { text: '光效六', icon: 'iconfont icon-icon-test', type: 'blinkstyle6' },
              { text: '光效七', icon: 'iconfont icon-icon-test', type: 'blinkstyle7' },
              { text: '光效八', icon: 'iconfont icon-icon-test', type: 'blinkstyle8' },
              { text: '光效九', icon: 'iconfont icon-icon-test', type: 'blinkstyle9' },
            ],
          },
          {
            type: 'sceneEffect',
            title: '场景特效',
            list: [
              { text: '无效果', icon: 'iconfont icon-icon-test' },
              { text: '小雪', icon: 'iconfont icon-icon-test' },
              { text: '雪球', icon: 'iconfont icon-icon-test' },
              { text: '雪花', icon: 'iconfont icon-icon-test' },
              { text: '银星星', icon: 'iconfont icon-icon-test' },
              { text: '金星星', icon: 'iconfont icon-icon-test' },
              { text: '爱心', icon: 'iconfont icon-icon-test' },
              { text: '笑脸', icon: 'iconfont icon-icon-test' },
              { text: '人民币', icon: 'iconfont icon-icon-test' },
              { text: '小雨', icon: 'iconfont icon-icon-test' },
              { text: '大雨', icon: 'iconfont icon-icon-test' },
            ],
          },
        ],
      },
      {
        type: 'guideMap',
        icon: 'iconfont icon-daohangditu-',
        title: '导览图',
      },
      {
        type: 'material',
        title: '素材库',
        icon: 'iconfont icon-sucaiku',
        list: [
          {
            type: 'materialCommon',
            title: '常用素材',
            list: [
              {
                text: '图片',
                action: () => {
                  getInstance('dialogs/Material/Selector.vue').open({ type_id: materialtype.img })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '图文',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.article })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '视频',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.video })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '音频',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.audio })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '3D物品',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.three })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '全景',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.pano })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: 'AR图标',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.TEXT_IN_ID })
                },
                icon: 'iconfont icon-icon-test',
              },
              {
                text: '热点图标',
                action: () => {
                  getInstance('dialogs/Material/Selector').open({ type_id: materialtype.TEXT_IN_ID })
                },
                icon: 'iconfont icon-icon-test',
              },
            ],
          },
        ],
      },
    ]
    return {
    }
  },
}
</script>
<style lang='stylus' scoped>
.editor-menu-list
  .menu-item
    color #fff
    min-width 50px
    padding 0 8px
    transition all 0.5s
    cursor pointer
    outline none
    &:hover
      padding 0 20px
      background-color rgba($theme, 0.9)

.sub-menu
  padding 6px
  .sub-menu-box
    &~.sub-menu-box
      border-top 1px solid #eee
      margin-top 4px
      padding-top 4px
  .left-title
    flex 0 0 60px
    border-radius 6px
    padding 8px
    background-color rgba(#eee, 1)
    div
      width 2em
  .right-sub-menu-list
    margin-left 8px
    width 540px
    flex-wrap wrap
    .sub-menu-item
      flex 0 0 12.5%
      height 55px
      display flex
      flex-direction column
      align-items center
      justify-content center
      border-radius 6px
      cursor pointer
      &:hover
        background-color rgba(#eee, 0.5)
        color $theme
      span
        margin-top 3px
        font-size 13px
</style>
