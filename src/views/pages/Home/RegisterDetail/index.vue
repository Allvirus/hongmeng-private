<template lang='pug'>
.MyRegister
  el-form.ff-rw.bg-white.pd2.ai-center(label-width='100px')
    el-form-item(label='部门:')
      tree-selector.winput(
        :data='myDptList.list',
        :defProps='myDptList.props',
        nodeKey='id',
        clearable,
        @change='onDepartChange'
      )
    el-form-item(label='玩家账号:')
      el-input.winput(v-model='model.UserAccount')
    el-form-item(label='设备号:')
      el-input.winput(v-model='model.DeviceNo')
    el-form-item(label='推广员账户:')
      el-input.winput(v-model='model.Account')
    el-form-item(label='注册IP:')
      el-input.winput(v-model='model.CreateIp')
    el-form-item(label='注册时间:')
      CommonDatePicker.w300(
        :start.sync='model.startTime',
        :end.sync='model.endTime',
        all
      )
      el-button.mgl3(icon='el-icon-search', type='primary', @click='search') 搜索
      el-button.mgl2(
        icon='el-icon-refresh-right',
        type='primary',
        @click='reset'
      ) 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='account', label='推广员账户')
    el-table-column(prop='deviceNo', label='设备号')
    el-table-column(prop='osType', label='平台')
      template(slot-scope='{ row }') {{ row.osType | formatOSType }}
    el-table-column(prop='createDate', label='注册时间')
      template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
    el-table-column(prop='createIp', label='注册IP')
    el-table-column(prop='ajob', label='A岗')
    el-table-column(prop='bjob', label='B岗')
    el-table-column(prop='cjob', label='C岗')

  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyRegister',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getPlayerList',
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        Account: '',
        CreateIp: '',
        DeviceNo: '',
        departmentId: 0,
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['myDptList']),
  },
  methods: {
    search () {
      this.$utils.autoFillDateTime(this.model)
      this.getListMixin()
    },
    reset () {
      for (const key in this.model) {
        this.model[key] = ''
      }
      this.model.page = 1
      this.model.pageSize = 10
      this.getListMixin()
    },
    onDepartChange (dtpId) {
      this.model.departmentId = dtpId
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
