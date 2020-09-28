<template lang='pug'>
  .RechargePlayer.ff-rn
    .player-list.w200
      .ff-rn.bg-white.pd2
        el-input(v-model="model.userAccount" placeholder='请输入搜索内容')
        el-button.mgl1(icon="el-icon-search" type="primary" @click="searchPlayer") 搜索
      el-table.mgy2(:data='listMixin.list' @row-click="onRowClick")
        el-table-column(prop="key" label="充值玩家")
      el-pagination.margin-spacing(
        :total="listMixin.count"
        :page-size.sync='model.pageSize'
        :current-page.sync='model.page'
        @current-change="getListMixin")
    .ff-cn.mgl2.flex-1
      .ff-rn.fs-m.ai-center.bg-white.pd2
        label 游戏名称 :
        label.mgl2 员工 :
        label.mgl3 支付时间:
        //- CommonDatePicker.mgl1.w150(:start.sync='startdate' :end.sync='enddate' @change='search()')
        el-button.mgl3(icon="el-icon-search" type="primary" @click="getPlRchgRecord") 搜索
        el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

      el-table.mgy2.bg-white(:data='rechargRecord.list')
        el-table-column(prop="userAccount" label="玩家账号")
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
        pageSize: 10,
        userAccount: '',
      },
      rechargRecord: {},
      rechargParam: {
        userAccount: '',
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
      const params = {
        userAccount: this.rechargParam.userAccount,
      }
      this.$api.getPlRchgRecord(params).then(res => {
        console.log(res)
        this.rechargRecord = res
      })
    },
    reset () {
      this.getPlRchgRecord()
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
