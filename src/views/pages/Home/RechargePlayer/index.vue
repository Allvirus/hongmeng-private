<template lang='pug'>
  .RechargePlayer.ff-rn
    .player-list.w300
      .ff-rn.bg-white.pd2
        el-input(v-model="model.userAccount" placeholder='请输入搜索内容')
        el-button.mgl1(icon="el-icon-search" type="primary" @click="searchPlayer") 搜索
      el-table.mgy2(:data='listMixin.list' @row-click="onRowClick"
        :row-class-name="({ row }) => row.key===rechargParam.userAccount ? 'bg-select' : ''")
        el-table-column(prop="key" label="玩家名称")
      el-pagination.margin-spacing(
        base
        :pager-count="5"
        :total="listMixin.count"
        :page-size.sync='model.pageSize'
        :current-page.sync='model.page'
        @current-change="getListMixin")
    .ff-cn.mgl2.flex-1
      .ff-rn.fs-m.ai-center.bg-white.pd2
        label 游戏名称:
        el-input.mgl2.w150(v-model="rechargParam.gameName")
        label.mgl2 区服:
        el-input.mgl2.w150(v-model="rechargParam.areaName")
        label.mgl2 时间:
        CommonDatePicker.mgl1.w300(:start.sync='rechargParam.startTime'
         :end.sync='rechargParam.endTime' @change='search()')
        el-button.mgl3(icon="el-icon-search" type="primary" @click="getPlRchgRecord") 搜索
        el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

      el-table.mgy2.bg-white(:data='rechargRecord.list')
        el-table-column(prop="userCode" label="玩家ID")
        el-table-column(prop="gameOrderID" label="消费订单号")
        el-table-column(prop="totalPrice" label="支付金额")
        el-table-column(prop="gameName" label="游戏名称")
        el-table-column(prop="areaName" label="区服")
        el-table-column(prop="roleName" label="游戏角色")
        el-table-column(prop="payDate" label="支付时间")
          template(slot-scope="{ row }") {{row.payDate | dateFormat}}
      el-pagination.margin-spacing(
        :total="rechargRecord.count"
        :page-size.sync='rechargParam.pageSize'
        :current-page.sync='rechargParam.page'
        @current-change="getPlRchgRecord")
</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'RechargePlayer',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getRechPlayer',
      model: {
        page: 1,
        pageSize: 13,
        userAccount: '',
      },
      rechargRecord: {},
      rechargParam: {
        userAccount: '',
        gameName: '',
        areaName: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  created: function () {

  },
  methods: {
    onRowClick (row) {
      console.log('onRowClick', row)
      this.clearQueryParams()
      this.rechargParam.userAccount = row.key
      this.getPlRchgRecord()
    },
    searchPlayer () {
      this.getListMixin()
    },
    getPlRchgRecord () {
      if (this.rechargParam.userAccount === '') {
        this.$vgo.tip('请选择玩家', 'warning')
        return
      }
      const params = JSON.parse(JSON.stringify(this.rechargParam))
      this.$utils.filterNull(params)
      this.$api.getPlRchgRecord(params).then(res => {
        console.log(res)
        this.rechargRecord = res
      })
    },
    clearQueryParams () {
      const p = {
        userAccount: this.rechargParam.userAccount,
        gameName: '',
        areaName: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
      }
      this.rechargParam = p
    },
    reset () {
      this.clearQueryParams()
      this.getPlRchgRecord()
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
