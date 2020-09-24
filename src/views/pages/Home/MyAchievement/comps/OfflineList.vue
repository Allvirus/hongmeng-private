<template lang='pug'>
el-dialog(title='离线任务列表' :visible.sync='dialogVisible' width='900px')
  .dialog-content
    el-table(:data='list')
      el-table-column(label='项目名称' prop='projectName')
      el-table-column(label='状态'  )
        span(:class="row.isDone ? 'success' : 'danger'" slot-scope='{ row }') {{row.isDone ? '生成成功' : '正在生成'}}
      el-table-column(label='创建时间' )
        template(slot-scope='{ row }') {{row.createTime | dateFormat}}
      el-table-column(label='操作' width='100px')
        template(slot-scope='{ row }')
          el-button(@click='$WD.open(row.zipUrl)' v-if="row.isDone" type='success' icon='el-icon-download') 下载

  .dialog-footer(slot='footer')
    //- el-button(@click='dialogVisible = false') 取 消
    el-button(type='primary' @click='dialogVisible = false') 确 定
</template>
<script>
export default {
  name: 'OfflineList',
  data () {
    return {
      list: null,
      dialogVisible: false,
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.getOfflineTaskList()
    },
    getOfflineTaskList () {
      this.$api.getOfflineTaskList().then(data => {
        this.list = data
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
