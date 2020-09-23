<template lang="pug">
el-dialog.SceneSelector-dialog.pd0(
  title='场景选择',
  :visible.sync='dialogVisible',
  width='900px'
)
  .dialog-content
    el-tabs(@tab-click='ref => groupIdx = ref.name', type='card')
      el-tab-pane(v-for="(item, idx) in panoInfo.group_scene_list" :key="item.id" :name='String(idx)', :label='item.name')

    .icon-list
      CardWrap.icon-item(
        v-for='item in panoInfo.group_scene_list[groupIdx].scene_list',
        @click='selectItem(item)',
        :class='{ selected: selectedList[item.id] }',
        :key='item.id'
      )
        img(:src='item.thumb_url')
        .bottom-bar.tac {{item.name}}
        //- CardIcon.el-icon-delete.danger(position='rt' pd='0' v-if="!model.is_system")
      //- Null.margin-xauto(v-if='!iconList.length')

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
import { mapGetters } from 'vuex'
export default {
  name: 'SceneSelector',
  props: {
    multiple: { // 多选
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      dialogVisible: false,
      selectedList: {},
      iconList: [],
      groupIdx: 0,
    }
  },
  computed: {
    ...mapGetters(['panoInfo']),
  },
  methods: {
    open (cb) {
      this.dialogVisible = true
      this.cb = cb
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
.SceneSelector-dialog
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
        flex 0 0 13.285% // 1/7
        margin 0.5%
        border-radius 5px
        overflow hidden
        &.selected
          // box-shadow 0 0 0 2px $theme
          outline 2px solid $theme
        &:hover
          img
            transform scale(1.2)
        img
          object-fit contain
          transition all 0.3s
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
