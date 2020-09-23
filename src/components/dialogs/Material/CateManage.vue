<template lang="pug">
el-dialog.cate-manage-dialog(
  title='分类管理',
  :visible.sync='dialogVisible',
  append-to-body,
  width='550px'
)
  .dialog-content
    transition-group(name='fade-transition', tag='div')
      .item.inline-block.mgr2.mgb2(v-for='(tag, index) in list', :key='tag.id')
        el-input.w150(
          v-if='curId === tag.id',
          v-model.trim='model.name',
          ref='updateTagInput',
          @keyup.enter.native='updateCate(tag)',
          @blur='updateCate(tag)',
          :maxlength='25',
          show-word-limit
        )
          //- @dragend='onDragend(index, tag)',
          //- @dragover='$event.preventDefault()',
          //- @drop='toIdx = index',
          //- draggable='true'
        div(
          v-else,
        )
          el-tag(
            :closable='!!tag.id',
            size='medium',
            @close='handleClose(tag, index)',
            :disable-transitions='true'
          )
            span {{ tag.name }}
            i.el-icon-edit.hover-bg-theme.round(
              v-if='!!tag.id',
              @click='showItemUpdateInput(tag)'
            )
      .inline-block(:key='-1',)
        el-input.w200(
          v-if='inputVisible',
          v-model.trim='model.name',
          ref='saveTagInput',
          @keyup.enter.native='addCate',
          @blur='addCate',
          :maxlength='25',
          show-word-limit
        )
        el-button(v-else, size='small', @click='showInput' icon='el-icon-plus')
</template>
<script>
export default {
  name: 'CateManage',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    type_id: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
      toIdx: -99,
      curId: -1,
      dialogVisible: false,
      inputVisible: false,
      typeId: null,
      model: {
        name: '',
        type_id: '',
      },
    }
  },
  watch: {
    type_id: {
      handler (val) {
        this.model.type_id = val
        this.typeId = val
      },
      immediate: true,
    },
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    showItemUpdateInput (item) {
      this.curId = item.id
      this.$nextTick(_ => {
        this.$refs.updateTagInput[0].$refs.input.focus()
      })
      this.model = JSON.parse(JSON.stringify(item))
    },
    // 删除分类
    handleClose (tag, idx) {
      this.$vgo.open(() => {
        this.$api.delMaterialCate(tag.id).then(res => {
          this.$vgo.tip('操作成功!', 'success')
          this.list.splice(idx, 1)
        })
      }, `您确定要删除分类<${tag.name}>吗?`)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 更新分类
    updateCate (tag) {
      if (this.model.name === tag.name) {
        this.reset()
        return
      }
      if (this.list.filter(item => item.name === this.model.name && item.id !== this.model.id).length) {
        this.$vgo.tip('分类已存在!', 'warning')
        return
      }
      if (this.model.name) {
        this.$api.addOrUpdatePanoMaterialCate(this.model).then(data => {
          tag.name = this.model.name
          this.$vgo.tip('操作成功!', 'success')
          this.reset()
        })
      } else {
        this.reset()
      }
    },
    // 添加分类
    addCate () {
      if (this.list.filter(item => item.name === this.model.name).length) {
        this.$vgo.tip('分类已存在!', 'warning')
        return
      }
      if (this.model.name) {
        this.$api.addOrUpdatePanoMaterialCate(this.model).then(data => {
          this.list.push({
            id: data.id,
            name: this.model.name,
          })
          this.$vgo.tip('操作成功!', 'success')
          this.reset()
        })
      } else this.reset()
    },
    // 重置数据
    reset () {
      this.curId = -1
      this.model = {}
      this.model.type_id = this.typeId
      this.inputVisible = false
    },
    onDragend (curIdx, img) {
      if (this.toIdx > -1) {
        this.list.splice(curIdx, 1)
        this.list.splice(this.toIdx, 0, img)
        this.toIdx = -99
      }
    },
    delItem (idx) {
      this.list.splice(idx, 1)
    },
  },
}
</script>
<style lang="stylus">
.cate-manage-dialog
  .dialog-content
    min-height 300px
  .item
    transition all 0.5s
  .el-tag
    vertical-align middle
    i.el-icon-close
      font-size 16px
    .el-icon-edit
      margin-left 5px
      padding 2px
  .fade-transition-enter, .fade-transition-leave-to
    opacity 0
    transform translateY(30px)
  .fade-transition-leave-active
    position absolute
</style>
