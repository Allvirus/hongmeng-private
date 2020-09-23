<template lang='pug'>
el-dialog.MaterialSelector.pd0(
  title='素材选择',
  :visible.sync='dialogVisible',
  width='900px'
)
  .dialog-content
    el-tabs(@tab-click='switchTab', type='card')
      el-tab-pane(
        v-for='item in cateList',
        :key='item.id',
        :name='String(item.id)',
        :label='item.name'
      )
      .jc-between.mgt2.mgx2
        .options
          el-input.w200(
            v-model='model.keyword',
            placeholder='请输入名称',
            :maxlength='20',
            show-word-limit,
            clearable
          )
          el-button.mgl1(
            @click='getListMixin(1)',
            icon='el-icon-search',
            type='primary'
          ) 搜索
          el-button(@click='resetPageMixin', type='') 重置

        .flex
          el-upload(
            action='cloudapp.panorama.material.image'
            accept='.jpg,.jpeg,.png,.bmp,.gif'
            :fileId.sync='model.logo_image_id'
            :fileUrl.sync='model.logo_image_url')
            el-button(@click='' icon='el-icon-upload' type='primary') 上传

          el-button(@click='setMoveMode', v-if='!isMoveCate', type='danger') 移到分类

          .mgr1(v-else)
            el-badge.mgx1(:value='Object.keys(selectedList).length')
              el-button(
                @click='moveToCate',
                :disabled='!Object.keys(selectedList).length',
                type='success'
              ) 移到分类
            el-button(@click='reset') 取消

          el-button(
            @click='$refs.CateManage.open()',
            icon='el-icon-folder-opened',
            type='success'
          ) 分组管理

    .material-list
      Null.margin-xauto(v-if='!listMixin.count')
      CardWrap.material-base-item(
        v-for='item in listMixin.list',
        :key='item.id',
        :selected='!!selectedList[item.id]'
      )
        CardIconGroup(position='rt', pd='5px')
          CardIcon.el-icon-view.theme(@click='previewItem(item)')
          CardIcon.el-icon-delete.danger(@click='delItem(item)')

        .full-cover.flex-center.hand(@click='selectItem(item)')
          img.w100p.h100p(
            v-if='item.type_id === 1 || item.type_id === 5',
            :src='item.file_thumb_url || item.file_url'
          )
          i.theme(
            v-else,
            style='font-size: 60px;',
            :class='materialtype[item.type_id].icon'
          )

        .bottom-bar.omit.pdx1.tac {{ item.name }}

  .dialog-footer.jc-between(slot='footer')
    .left
      el-pagination(
        base,
        :total='listMixin.count',
        :page-size.sync='model.pageSize',
        :current-page.sync='model.page',
        @current-change='getListMixin'
      )
    .right(v-show='!isMoveCate')
      el-button(@click='dialogVisible = false') 取消
      el-badge.mgl1(:value='Object.keys(selectedList).length')
        el-button(
          type='primary',
          :disabled='!Object.keys(selectedList).length',
          @click='submit'
        ) 确定

  CateManage(ref='CateManage', :list='cateList')
  MaterialPreview(ref='MaterialPreview')
  CateSelector(ref='CateSelector', :curId='model.cate_id', :list='cateList')
</template>
<script>
import { materialtype } from '@/config'
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MaterialSelector',
  components: {
    CateSelector: _ => import('./CateSelector'),
    MaterialPreview: _ => import('./MaterialPreview'),
    CateManage: _ => import('./CateManage'),
  },
  mixins: [fetchListMixin],
  data () {
    this.materialtype = materialtype
    // this.materialType = {
    //   1: { text: '图片', id: 1 },
    //   2: { text: '音频', id: 2 },
    //   3: { text: '视频', id: 3 },
    //   4: { text: '图文', id: 4 },
    //   5: { text: '环物360', id: 5 },
    //   6: { text: '全景素材图片', id: 6 },
    // }
    this.multiple = false
    return {
      customExeListApiForMixin: 'getMaterialList',
      dialogVisible: false,
      isMoveCate: false,
      selectedList: {},
      cateList: [],
      model: {
        page: 1,
        pageSize: 21,
        type_id: 1, // | Int32 | 否 | 分类类型，详见：【概览】
        cate_id: 0, // | Int32 | 否 | 素材分类， 默认=0
        keyword: '', // | String | 否 | 关键字素材名称
        is_system: false, // | String | 否 | 是否系统素材
        orderBy: '', // | String | 否 |
      },
    }
  },
  methods: {
    open ({ type_id }) {
      this.reset()
      this.model.type_id = type_id
      // materialtype[type]
      this.dialogVisible = true
      this.getMaterialCateList()
      this.getListMixin(1)
    },
    reset () {
      this.isMoveCate = false
      this.selectedList = Object.assign({})
    },
    getMaterialCateList () {
      this.$api.getMaterialCateList(this.model.type_id).then(data => {
        this.cateList = data
        data.unshift({ id: 0, name: '默认' })
      })
    },
    switchTab (ref) {
      this.model.cate_id = ref.name
      this.getListMixin()
    },
    submit () {
      this.$vgo.tip('操作成功!', 'success')
      this.dialogVisible = false
      this.cb(Object.values(this.selectedList))
      this.selectedList = {}
    },
    selectItem (item) {
      if (!this.multiple) {
        this.selectedList = Object.assign({})
      }
      if (this.selectedList[item.id]) {
        this.$delete(this.selectedList, item.id)
      } else {
        this.$set(this.selectedList, item.id, item)
      }
    },
    previewItem (item) {
      console.log(item)
      this.$refs.MaterialPreview.open(
        item.type_id,
        { url: item.file_url }
      )
    },
    delItem ({ id, name }) {
      this.$vgo.open(() => {
        this.$api.deleteMaterial(id).then(data => {
          this.afterModifyGetListMixin(1, 1)
        })
      }, `您确定要删除<${name}>吗?`)
    },
    setMoveMode () {
      this.multiple = true
      this.isMoveCate = true
    },
    moveToCate () {
      this.$refs.CateSelector.open(cateId => {
        const ids = Object.values(this.selectedList).map(it => it.id)
        this.$api.materialMoveToCate(cateId, ids).then(data => {
          this.afterModifyGetListMixin(1, ids.length)
          this.selectedList = Object.assign({})
        })
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>.el-dialog__body
  display flex
  flex-direction column

.dialog-content
  user-select none
  display flex
  flex-direction column
  flex 1 1 0%
  overflow hidden
  >>>.el-tabs__header
    margin 0
  .material-list
    flex 1 1 0%
    overflow-y auto
    min-height 350px
    align-content flex-start
    display flex
    flex-wrap wrap
    padding 5px 10px
  .material-base-item
    flex 0 0 13.285%
    margin 0.5%
</style>
