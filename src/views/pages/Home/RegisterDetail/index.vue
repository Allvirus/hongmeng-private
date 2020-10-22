<template lang='pug'>
.MyRegister
  el-form.ff-rw.bg-white.pdx2.pdt2.ai-center(label-width='100px')
    el-form-item(label='部门:', v-if='userInfo.isLeader')
      tree-selector.winput(
        ref='dtptree',
        :data='myDptList.list',
        :defProps='myDptList.props',
        nodeKey='id',
        clearable,
        :deflabel='myDptList.list[0].name',
        @change='onDepartChange'
      )
    el-form-item(label='员工:' v-if='userInfo.isLeader')
      el-select.winput(v-model='model.userId', placeholder='请选择', clearable filterable)
        el-option(
          v-for='item in userList',
          :key='item.id',
          :label='item.realName',
          :value='item.id'
        )
    el-form-item(label='玩家账号:')
      el-input.winput(v-model='model.UserAccount')
    el-form-item(label='设备号:')
      el-input.winput(v-model='model.DeviceNo')
    el-form-item(label='注册IP:')
      el-input.winput(v-model='model.CreateIp')
    el-form-item(label='注册时间:')
      CommonDatePicker.w300(
        :start.sync='model.startTime',
        :end.sync='model.endTime',
        all
      )
    el-button.mgl3.mgb2(icon='el-icon-search', type='primary', @click='search') 搜索
    el-button.mgl2.mgr2.mgb2(
      icon='el-icon-refresh-right',
      type='primary',
      @click='reset'
    ) 重置
    el-checkbox.flex-center.mgb2(v-model="searchMyData" v-if="userInfo.isLeader") 搜索我的数据

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
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'MyRegister',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptRegisterInfo',
      dtpApi: 'getDptRegisterInfo',
      myApi: 'getPlayerList',
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        Account: '',
        CreateIp: '',
        DeviceNo: '',
        userId: '',
        resDepId: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
