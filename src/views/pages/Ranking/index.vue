<template lang='pug'>
.RoamProjectManage.page-content
  TitleBar.jc-between(:title='$route.meta.title')
    el-form(inline, @keyup.enter.native='getListMixin(1)')
      el-form-item.mg0(label='名称')
        el-input.w200(
          v-model='model.searchQuery',
          placeholder='请输入名称',
          :maxlength='50',
          show-word-limit,
          clearable
        )
      el-form-item.mg0
        el-button.mgl2(@click='getListMixin(1)', type='primary') 查询
        el-button.mgl2(@click='resetPageMixin') 重置
        el-button(@click='$refs.OfflineList.open()', type='success') 离线任务列表
  .list-table
    el-table(:data='listMixin.list', style='width: 100%', align='center')
      el-table-column(label='封面', width='180px')
        img.w100.h100.hand(
          slot-scope='{ row }',
          @click='$WD.open(row.previewUrl)',
          :src='row.coverUrl',
          :key='row.id'
        )

      el-table-column(prop='', label='项目名称')
        a(:href='row.previewUrl', target='_blank', slot-scope='{ row }') {{ row.name }}
      el-table-column(prop='mainCategory', label='项目行业分类')
      el-table-column(label='是否公开')
        span(
          :class='row.isPublic ? "success" : "danger"',
          slot-scope='{ row }'
        ) {{ row.isPublic ? "是" : "否 " }}
      el-table-column(prop='ceateTime', label='创建时间')
        template(slot-scope='{ row }') {{ row.ceateTime | dateFormat }}

      el-table-column(label='操作', width='320px')
        template(slot-scope='{ row }')
          el-button(
            @click='$router.push({ name: "RoamProjectModel", query: { id: row.id } })',
            type='primary',
            plain
          ) 编辑
          el-button(
            @click='$refs.Share.openDialog(row.previewUrl, row.name)',
            type='success',
            plain
          ) 分享
          el-button(
            @click='generateOfflinePackage(row)',
            type='warning',
            plain
          ) 下载
          el-button(@click='delRoamProject(row)', type='danger', plain) 删除

  .page-content.pd2.tac
    el-pagination(
      :total='listMixin.count',
      :page-size.sync='model.pageSize',
      :current-page.sync='model.page',
      @current-change='getListMixin'
    )
</template>

<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyCurrency',
  components: {
  },
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getRoamProjectList',
      model: {
        page: 1,
        pageSize: 10,
        searchQuery: '', // String 否
        mainCategory: '', // Int32 否 素材分类
      },
    }
  },
  created () {
    this.$store.dispatch('getProjectTagList')
  },
  methods: {
    delRoamProject (item) {
      this.$vgo.open(() => {
        this.$api.delRoamProject(item.id).then(data => {
          this.afterModifyGetListMixin(1, 1)
        })
      }, `您确定要删除<${item.name}>吗?`)
    },
    generateOfflinePackage (item, reBuild) {
      this.$api.generateOfflinePackage(item.id, reBuild).then(data => {
        if (!data.states) {
          this.$vgo.tip('操作成功, 正在生成离线包', 'success')
        } else {
          this.$vgo.open(() => {
            this.generateOfflinePackage(item, true)
          }, `${item.name} 离线包已存在是否重新生成?`)
        }
      })
    },
  },
}
</script>

<style lang="stylus">
$spc = 44px

.RoamProjectManage
  .section-wrap
    padding 0 $spc
</style>
