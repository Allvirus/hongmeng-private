<template lang='pug'>
  .MyOrders
    .fs-m.ai-center.bg-white.pd2
      el-form.ff-rw(label-width="100px")
        el-form-item(label="玩家账号:")
          el-input.w200(v-model="model.UserAccount")
        el-form-item(label="游戏名称:")
          el-input.w200(v-model="model.GameName")
        el-form-item(label="游戏角色:")
          el-input.w200(v-model="model.RoleName")
        el-form-item(label="订单号:")
          el-input.w200(v-model="model.GameOrderID")
        el-form-item(label="推广员账户:")
          el-input.w200(v-model="model.Account")
        el-form-item(label="区服:")
          el-input.w200(v-model="model.AreaName")
        el-form-item(label="支付时间:")
          CommonDatePicker.w300(:start.sync='model.startTime' :end.sync='model.endTime' )
          el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
          el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

    el-table.mgy2.bg-white.pd2(:data='listMixin.list')
      el-table-column(prop="userAccount" label="玩家账号")
      el-table-column(prop="account" label="推广员账号")
      el-table-column(prop="gameName" label="游戏名称")
      el-table-column(prop="areaName" label="区服")
      el-table-column(prop="roleName" label="游戏角色")
      el-table-column(prop="gameOrderID" label="消费订单号" width="160px")
      el-table-column(prop="totalPrice" label="支付金额")
        template(slot-scope='{ row }') {{row.totalPrice | toFixed}}
      el-table-column(prop="payDate" label="支付时间" width="150px")
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
      this.getListMixin()
    },
    reset () {
      this.model = {
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
      }
      this.getListMixin()
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
