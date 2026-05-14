<template lang='pug'>
.MyOrders
  .fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw(:label-width='OS.isPc ? "90px" : "60px"')
      el-form-item(label='IfunId:')
        el-input.winput(
          v-model='model.IfunId',
          placeholder='请输入IfunId',
          clearable
        )
      el-form-item(label='账号ID:')
        el-input.winput(
          v-model='model.UserCode',
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
      el-form-item(label='游戏名称:')
        auto-complete(
          v-model='model.GameName',
          :data='gameList',
          placeholder='请输入游戏名称',
          clearable
        )
      el-form-item(label='游戏角色:')
        el-input.winput(
          v-model='model.RoleName',
          placeholder='请输入游戏角色',
          clearable
        )
      el-form-item(label='订单号:')
        el-input.winput(
          v-model='model.GameOrderID',
          placeholder='请输入订单号',
          clearable
        )
      el-form-item(label='推广员账户:')
        el-input.winput(
          v-model='model.Account',
          placeholder='请输入推广员账户',
          clearable
        )
      el-form-item(label='区服:')
        auto-complete(
          v-model='model.AreaName',
          :data='areaList',
          placeholder='请输入区服',
          clearable
        )
      el-form-item(label='支付时间:', v-if='OS.isPc')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
      el-form-item(label='平台:', v-if='OS.isPc')
        el-radio-group(v-model='model.platform')
          el-radio(label='0') Ifun
          el-radio(label='1') 木勺

      el-button.mgl3.h30(
        icon='el-icon-search',
        type='primary',
        @click='search'
      ) 搜索
      el-button.mgl2.h30.mgr2(
        icon='el-icon-refresh-right',
        type='primary',
        @click='reset'
      ) 重置
      el-checkbox.mgt1(
        :class='OS.isPc ? "" : "mgb3"',
        v-model='searchMyData',
        v-if='userInfo.isLeader'
      ) 搜索我的数据
      el-checkbox.mgt1(v-model='model.isInApp') 仅查看内购订单
  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='ifunId', label='ID')
    el-table-column(prop='userCode', label='账号ID')
    el-table-column(prop='roleCode', label='角色ID')
    el-table-column(prop='roleName', label='游戏角色')
    el-table-column(prop='areaName', label='区服名称')
    el-table-column(prop='totalPrice', label='支付金额(元)')
      template(slot-scope='{ row }') {{ row.totalPrice | toFixed }}
    el-table-column(prop='ajob', label='A岗')
    el-table-column(prop='bjob', label='B岗')
    el-table-column(prop='cjob', label='C岗')
    el-table-column(prop='account', label='推广员账号')
    el-table-column(prop='platform', label='平台', width='80px')
      template(slot-scope='{ row }') {{ row.platform === 0 ? 'Ifun' : '木勺' }}
    el-table-column(prop='gameName', label='游戏名称')
    el-table-column(prop='osType', label='平台')
      template(slot-scope='{ row }') {{ row.osType | formatOSType }}
    el-table-column(prop='payDate', label='支付时间', width='150px')
      template(slot-scope='{ row }') {{ row.payDate | dateFormat }}
    el-table-column(prop='gameOrderID', label='订单号', width='200px')
  el-pagination(
    :total='listMixin.count',
    :page-sizes='[10, 20, 30, 50]',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin',
    :class='OS.isPc ? "margin-spacing" : ""',
    :base='!OS.isPc',
    :small='!OS.isPc'
  )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'MyOrders',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptGameOrders',
      dtpApi: 'getDptGameOrders',
      myApi: 'getGameOrders',
      model: {
        startTime: '',
        endTime: '',
        IfunId: '',
        UserAccount: '',
        UserCode: '',
        GameOrderID: '',
        Account: '',
        GameName: '',
        RoleName: '',
        AreaName: '',
        TotalPrice: '',
        userId: '',
        resDepId: '',
        OSType: '',
        platform: '0',
        isInApp: false,
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item {
  margin-bottom: 10px;
}

>>>.el-table .cell {
  padding: 0px 4px !important;
}
</style>
