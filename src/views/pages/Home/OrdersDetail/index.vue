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
      el-form-item(:label='"\u89d2\u8272ID:"')
        el-input.winput(
          v-model='model.RoleCode',
          :placeholder='"\u8bf7\u8f93\u5165\u89d2\u8272ID"',
          clearable
        )
      el-form-item(label='游戏角色:')
        el-input.winput(
          v-model='model.RoleName',
          placeholder='请输入游戏角色',
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
  el-table.mgy2.bg-white.pd2(
    ref='ordersTable',
    :data='listMixin.list',
    :show-summary='hasOrderStatistics',
    :summary-method='getOrderSummaries'
  )
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
    el-table-column(prop='gameOrderID', label='订单号', min-width='260px')
      template(slot-scope='{ row }')
        span.order-number {{ row.gameOrderID }}
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
        RoleCode: '',
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
    orderStatistics () {
      const statistics = this.listMixin.statistics || {}
      return {
        rechargeCount: statistics.rechargeCount || statistics.RechargeCount || 0,
        totalPriceAll: statistics.totalPriceAll || statistics.TotalPriceAll || 0,
      }
    },
    hasOrderStatistics () {
      const statistics = this.listMixin.statistics || {}
      return Object.keys(statistics).length > 0
    },
  },
  watch: {
    'listMixin.list' () {
      this.$nextTick(this.mergeOrderSummaryCells)
    },
    'listMixin.statistics': {
      handler () {
        this.$nextTick(this.mergeOrderSummaryCells)
      },
      deep: true,
    },
  },
  methods: {
    getOrderSummaries ({ columns }) {
      return columns.map((column, index) => {
        if (index === 0) return '合计'
        if (column.property === 'userCode') return `充值总数：${this.formatInteger(this.orderStatistics.rechargeCount)}`
        if (column.property === 'totalPrice') return `充值总额：${this.formatMoney(this.orderStatistics.totalPriceAll)}`
        return ''
      })
    },
    mergeOrderSummaryCells () {
      const table = this.$refs.ordersTable && this.$refs.ordersTable.$el
      const cells = table && table.querySelectorAll('.el-table__footer-wrapper tbody tr td')
      if (!cells || !cells.length) return

      cells.forEach(cell => {
        cell.removeAttribute('colspan')
        cell.style.display = ''
        cell.classList.remove('order-summary-cell')
      })

      this.mergeSummaryCell(cells, 1, 4)
      this.mergeSummaryCell(cells, 5, 4)
    },
    mergeSummaryCell (cells, startIndex, span) {
      const cell = cells[startIndex]
      if (!cell) return

      cell.setAttribute('colspan', span)
      cell.classList.add('order-summary-cell')
      for (let index = startIndex + 1; index < startIndex + span && index < cells.length; index += 1) {
        cells[index].style.display = 'none'
      }
    },
    formatInteger (value) {
      const number = Number(value)
      return Number.isFinite(number) ? String(Math.trunc(number)) : '0'
    },
    formatMoney (value) {
      const number = Number(value)
      return Number.isFinite(number) ? number.toFixed(2) : '0.00'
    },
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

>>>.order-summary-cell .cell {
  text-align: left;
  font-weight: 600;
}

.order-number {
  white-space: normal;
  word-break: break-all;
}
</style>
