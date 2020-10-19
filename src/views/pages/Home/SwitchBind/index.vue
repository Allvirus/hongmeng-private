<template lang='pug'>
.switch-bind
  .ff-rn.fs-m.ai-center.mgt2.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='100px')
      el-form-item(label='玩家账号:')
        el-input.winput(v-model='model.UserAccount')
      el-form-item
        el-button(icon="el-icon-plus" type="primary" @click="swBindDlg = true") 玩家换绑
        el-button.mgl3(icon="el-icon-search" type="primary" @click="getListMixin") 搜索
        el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="resetPageMixin") 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='aJob', label='A岗(换绑前)')
    el-table-column(prop='bJob', label='B岗(换绑前)')
    el-table-column(prop='cJob', label='C岗(换绑前)')
    el-table-column(prop='aJobAfter', label='A岗(换绑后)')
    el-table-column(prop='bJobAfter', label='B岗(换绑后)')
    el-table-column(prop='cJobAfter', label='C岗(换绑后)')
    el-table-column(prop='switchTime', label='换绑时间')
      template(slot-scope='{ row }') {{ row.switchTime | dateFormat }}
    el-table-column(prop="operate" label="操作")
      template(slot-scope="{ row }")
        el-button.mgl3.danger(icon="el-icon-delete" type="text" @click="delRecord(row)") 删除
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.PageSize',
    :current-page.sync='model.Page',
    @current-change='getListMixin'
  )

  el-dialog(title="玩家换绑"
      @close="cancelBind"
      :visible.sync="swBindDlg" width="600px")

    span.dialog-footer(slot="footer")
      el-button.mgl3(type="warning" @click="cancelBind") 取消
      el-button.mgl3(type="primary" @click="commitSwBind") 提交
</template>

<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'SwitchBind',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getBindChangeList',
      model: {
        UserAccount: '',
        Page: 1,
        PageSize: 10,
      },
      swBindParams: {
        userAccount: '',
        aJobId: '',
        aJob: '',
        bJobId: '',
        bJob: '',
        cJobId: '',
        cJob: '',
        aJobIdAfter: '',
        bJobIdAfter: '',
        cJobIdAfter: '',
      },
      swBindDlg: false,
    }
  },
  methods: {
    delRecord (row) {
      this.$vgo.open(() => {
        this.$api.delBindRec(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.getListMixin()
        })
      })
    },
    cancelBind () {
      this.swBindDlg = false
    },
    commitSwBind () {

    },
  },
}
</script>
<style lang='stylus' scoped></style>
