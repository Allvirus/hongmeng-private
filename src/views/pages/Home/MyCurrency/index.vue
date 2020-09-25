<template lang='pug'>
  .MyCurrency.pd3
    .currency.bg-white.pd3.pr
      h2 我的货币
      h1.danger.mg3.pd2 {{money | formatNumber}}元
      p.mgt3 最低提现额度{{minCashOut}}
      el-button.pac(type="primary" @click="cashOut") 提现
    .trade-detail.mgt2.bg-white.pd2
      h3 货币交易记录
      .ff-rn.fs-m.ai-center.mgt2
        label 交易类型 :
        el-select.mgl1(v-model="tdTyp" placeholder="请选择")
          el-option(v-for="item in tdTypLst"
          :key="item.value"
          :label="item.label"
          :value="item.value")
        label.mgl3 交易时间:
        CommonDatePicker.mgl1(:start.sync='startdate' :end.sync='enddate' @change='search()')
        el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
        el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

      el-table.mgy2(:data='listMixin.list' :row-class-name="({ row }) => row.is_payout ? 'danger' : ''")
                  el-table-column(prop="created" label="订单号")
                  el-table-column(prop="amount" label="交易数量")
                  el-table-column(prop="type_text" label="交易时间")
                  el-table-column(prop="remark" label="交易对象")
                  el-table-column(prop="balance" label="交易类型")
                  el-table-column(prop="balance" label="交易状态")
      el-pagination.margin-spacing(
        :total="listMixin.count"
        :page-size.sync='model.pageSize'
        :current-page.sync='model.page'
        @current-change="getListMixin")
</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: '',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: '',
      model: {
        page: 1,
        pageSize: 10,
      },
      money: 499999,
      minCashOut: 100,
      tdTyp: '',
      tdTypLst: [
        {
          value: 'recharge',
          label: '充值',
        },
        {
          value: 'buy',
          label: '购买装备',
        },
      ],
      startdate: '',
      enddate: '',
    }
  },
  computed: {
  },
  created: function () {
  },
  methods: {
    search () {
      this.$vgo.tip('开始搜索 ', 'success')
    },
    reset () {
      this.tdTyp = ''
      this.startdate = ''
      this.enddate = ''
      this.$vgo.tip('已重置', 'success')
      this.search()
    },
    cashOut () {
      this.$vgo.tip('开始提现', 'success')
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyCurrency
  .currency
    height 200px
</style>
