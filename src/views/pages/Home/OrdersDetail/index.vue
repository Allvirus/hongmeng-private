<template lang='pug'>
  .MyOrders.pd3
    .ff-rn.fs-m.ai-center.mgt2
      //- label 游戏名称 :
      //- el-select.mgl1(v-model="tdTyp" placeholder="请选择")
      //-   el-option(v-for="item in tdTypLst"
      //-   :key="item.value"
      //-   :label="item.label"
      //-   :value="item.value")
      //- label.mgl2 员工 :
      //- el-select.mgl1(v-model="tdTyp" placeholder="请选择")
      //-   el-option(v-for="item in tdTypLst"
      //-   :key="item.value"
      //-   :label="item.label"
      //-   :value="item.value")
      label.mgl3 支付时间:
      CommonDatePicker.mgl1(:start.sync='model.startTime' :end.sync='model.endTime' @change='search()')
      el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
      el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

    el-table.mgy2(:data='listMixin.list' :row-class-name="({ row }) => row.is_payout ? 'danger' : ''")
                el-table-column(prop="userAccount" label="玩家账号")
                el-table-column(prop="userCode" label="玩家代码")
                el-table-column(prop="gameOrderID" label="消费订单号")
                el-table-column(prop="totalPrice" label="支付金额")
                el-table-column(prop="gameName" label="游戏名称")
                el-table-column(prop="areaName" label="区服")
                el-table-column(prop="roleName" label="游戏角色")
                el-table-column(prop="payDate" label="支付时间")
                el-table-column(prop="ajob" label="A岗")
                el-table-column(prop="bjob" label="B岗")
                el-table-column(prop="cjob" label="C岗")
    el-pagination.margin-spacing(
      :total="listMixin.count"
      :page-size.sync='model.pageSize'
      :current-page.sync='model.page'
      @current-change="getListMixin")
</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyOrders',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getGameOrders',
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        GameOrderID: '',
        Account: '',
        UserCode: '',
        GameName: '',
        RoleName: '',
        RoleCode: '',
        AreaName: '',
        AreaCode: '',
        TotalPrice: '',
        OSType: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  methods: {
    search () {
      this.$vgo.tip('开始搜索 ', 'success')
    },
    reset () {
      this.$vgo.tip('已重置', 'success')
      this.search()
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
