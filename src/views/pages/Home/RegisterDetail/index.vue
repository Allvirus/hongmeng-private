<template lang='pug'>
.MyRegister
  el-form.ff-rw.bg-white.pdx2.pdt2.ai-center(label-width='100px')
    el-form-item(label='IfunId:')
      el-input.winput(
        v-model='model.IfunId',
        placeholder='请输入IfunId',
        clearable
      )
    el-form-item(label='账号ID:')
      el-input.winput(
        v-model='model.UserAccount',
        placeholder='请输入账号ID',
        clearable
      )
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
    el-form-item(label='员工:', v-if='userInfo.isLeader')
      el-select.winput(
        v-model='model.userId',
        placeholder='请选择',
        clearable,
        filterable
      )
        el-option(
          v-for='item in userList',
          :key='item.id',
          :label='item.realName',
          :value='item.id'
        )
    el-form-item(label='设备号:')
      el-input.winput(
        v-model='model.DeviceNo',
        placeholder='请输入设备号',
        clearable
      )
    el-form-item(label='注册IP:')
      el-input.winput(
        v-model='model.CreateIp',
        placeholder='请输入注册IP',
        clearable
      )
    el-form-item(label='注册时间:')
      CommonDatePicker.w300(
        :start.sync='model.startTime',
        :end.sync='model.endTime',
        all
      )
    el-form-item(label='平台:')
      el-radio-group(v-model='model.platform')
        el-radio(label='0') Ifun
        el-radio(label='1') 木勺
    el-button.mgl3.mgb2(icon='el-icon-search', type='primary', @click='search') 搜索
    el-button.mgl2.mgr2.mgb2(
      icon='el-icon-refresh-right',
      type='primary',
      @click='reset'
    ) 重置
    el-checkbox.flex-center.mgb2(
      v-model='searchMyData',
      v-if='userInfo.isLeader'
    ) 搜索我的数据

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='ifunAccountId', label='ID', width='100')
    el-table-column(prop='userCode', label='账号ID', width='100')
    el-table-column(prop='account', label='推广员账户', width='100px')
    el-table-column(prop='platform', label='平台', width='80px')
      template(slot-scope='{ row }') {{ row.platform === 0 ? 'Ifun' : '木勺' }}
    el-table-column(prop='deviceNo', label='设备号', width='200px')
    el-table-column(prop='osType', label='平台', width='100px')
      template(slot-scope='{ row }') {{ row.osType | formatOSType }}
    el-table-column(prop='createDate', label='注册时间', width='150px')
      template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
    el-table-column(prop='createIp', label='注册IP', width='120px')
    el-table-column(prop='isRepeatReg', label='有效换包')
      template(slot-scope='{ row }') {{ row.isRepeatReg ? '否' : '是' }}
    el-table-column(prop='ajob', label='A岗')
    el-table-column(prop='bjob', label='B岗')
    el-table-column(prop='cjob', label='C岗')
    el-table-column(prop='opt', label='操作', width='100px')
      template(slot-scope='{ row }')
        el-button(type='text', @click='showRoleDetail(row)') 查看角色

  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-sizes='[10, 20, 30, 50]',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )

  RoleDetails(
    :visible.sync='showRoleDlg',
    @cancel='cancelDlg',
    :UserAccount='selUser'
  )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'MyRegister',
  components: {
    RoleDetails: () => import('@/views/pages/Home/RegisterDetail/comps/RoleDetails'),
  },
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptRegisterInfo',
      dtpApi: 'getDptRegisterInfo',
      myApi: 'getPlayerList',
      model: {
        startTime: '',
        endTime: '',
        IfunId: '',
        UserAccount: '',
        Account: '',
        CreateIp: '',
        DeviceNo: '',
        userId: '',
        resDepId: '',
        platform: '0',
        page: 1,
        pageSize: 10,
      },
      showRoleDlg: false,
      selUser: '',
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
  methods: {
    showRoleDetail (row) {
      this.showRoleDlg = true
      this.selUser = row.userAccount
    },
    cancelDlg () {
      this.showRoleDlg = false
      this.selUser = ''
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
