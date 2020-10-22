<template lang='pug'>
.MyRoles
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='100px')
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
      el-form-item(label='游戏名称:')
        auto-complete(v-model='model.GameName', :data='gameList')
      el-form-item(label='游戏角色:')
        el-input.winput(v-model='model.RoleName')
      el-form-item(label='区服:')
        auto-complete(v-model='model.AreaName', :data='areaList')
      el-form-item(label='创建时间:')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
      el-button.mgl3(icon='el-icon-search', type='primary', @click='search') 搜索
      el-button.mgl2.mgr2(
        icon='el-icon-refresh-right',
        type='primary',
        @click='reset'
      ) 重置
      el-checkbox.flex-center(v-model="searchMyData" v-if="userInfo.isLeader") 搜索我的数据

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='gameName', label='游戏名称')
    el-table-column(prop='areaName', label='区服')
    el-table-column(prop='roleName', label='游戏角色')
    el-table-column(prop='rechargeCount', label='充值订单数')
    el-table-column(prop='totalMoney', label='充值总额(元)')
      template(slot-scope='{ row }') {{ row.totalMoney | toFixed }}
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
  name: 'RechargePlayer',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptRechInfo',
      dtpApi: 'getDptRechInfo',
      myApi: 'getRechInfo',
      model: {
        UserAccount: '',
        startTime: '',
        endTime: '',
        Account: '',
        GameName: '',
        RoleName: '',
        AreaName: '',
        AreaCode: '',
        TotalPrice: '',
        userId: '',
        resDepId: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo']),
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
