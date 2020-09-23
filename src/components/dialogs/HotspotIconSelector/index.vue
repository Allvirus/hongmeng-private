<template lang="pug">
el-dialog.HotspotIconSelector-dialog.pd0(
  title='热点图标',
  :visible.sync='dialogVisible',
  width='900px'
)
  .dialog-content
    el-tabs(@tab-click='switchTab', type='card')
      el-tab-pane(name='0', label='系统热点')
        el-radio-group.mg2(
          v-model='model.cate_id',
          @change='getHotspotIconList'
        )
          el-radio-button(
            v-for='item in typeList',
            :label='item.id',
            :key='item.id'
          ) {{ item.text }}

      el-tab-pane(name='1', label='我的热点')

    .icon-list
      .icon-item(
        v-for='item in iconList',
        @click='selectItem(item)',
        :class='{ selected: selectedList[item.id] }',
        :key='item.id'
      )
        img(:src='item.thumb_url')
        .title.pa(v-if='item.type_id === 102') GIF
        CardIcon.el-icon-delete.danger(position='rt' pd='0' v-if="!model.is_system")
      Null.margin-xauto(v-if='!iconList.length')

  .jc-end(slot='footer')
    el-button(@click='dialogVisible = false') 取消
    el-badge.mgl1(:value='Object.keys(selectedList).length')
      el-button(
        type='primary',
        :disabled='!Object.keys(selectedList).length',
        @click='submit'
      ) 确定
</template>
<script>
export default {
  name: 'HotspotIconSelector',
  props: {
    multiple: { // 多选
      type: Boolean,
      default: false,
    },
  },
  data () {
    this.typeList = [
      { text: '常用', id: 0 },
      { text: '商务', id: 1 },
      { text: '花草', id: 2 },
      { text: '水果', id: 3 },
      { text: 'Party', id: 4 },
      { text: '天气', id: 5 },
      { text: '插件', id: 6 },
      { text: 'AR动画', id: 7 },
    ]
    return {
      dialogVisible: false,
      selectedList: {},
      iconList: [],
      model: {
        cate_id: 0, // 常用 = 0, 商务 = 1, 花草 = 2, 水果 = 3, Party = 4, 天气 = 5, 插件 = 6, AR动画 = 7
        is_system: true,
      },
    }
  },
  methods: {
    open (cb) {
      this.getHotspotIconList()
      this.dialogVisible = true
      this.cb = cb
    },
    getHotspotIconList () {
      const model = Object.assign({}, this.model)
      model.cate_id = model.is_system ? model.cate_id : 0
      this.$api.getHotspotIconList(model).then(data => {
        this.iconList = data
      })
    },
    switchTab (ref) {
      this.model.is_system = ref.name === '0'
      this.getHotspotIconList()
    },
    submit () {
      this.$vgo.tip('操作成功!', 'success')
      this.dialogVisible = false
      this.cb(Object.values(this.selectedList))
      this.selectedList = {}
    },
    selectItem (item) {
      if (!this.multiple) {
        for (const key in this.selectedList) {
          this.$delete(this.selectedList, key)
        }
      }
      if (this.selectedList[item.id]) {
        this.$delete(this.selectedList, item.id)
      } else {
        this.$set(this.selectedList, item.id, item)
      }
    },
  },
}
</script>
<style lang="stylus">
.HotspotIconSelector-dialog
  .el-dialog__body
    display flex
    flex-direction column
  .dialog-content
    user-select none
    display flex
    flex-direction column
    flex 1 1 0%
    overflow hidden
    .el-tabs__header
      margin 0
    .icon-list
      flex 1 1 0%
      overflow-y auto
      min-height 350px
      align-content flex-start
      display flex
      flex-wrap wrap
      padding 5px 10px
      .icon-item
        padding 8px
        flex 0 0 9%
        margin 0.5%
        border-radius 5px
        text-align center
        background-color #eee
        cursor pointer
        position relative
        &.selected
          box-shadow 0 0 0 2px $theme
        &:hover
          background-color #ddd
        img
          object-fit contain
          height 100%
          width 100%
        .title
          position absolute
          top 0
          right 0
          width 26px
          height 16px
          line-height 16px
          border-radius 5px
          background-color $danger
          color #fff
          font-size 12px
</style>
