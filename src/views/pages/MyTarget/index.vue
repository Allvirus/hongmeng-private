<template lang='pug'>
.target
  .condition.pd2.bg-white
    el-form.ff-rw.mgt2.ai-center(label-width='100px')
      el-form-item(
        label='部门:',
        :class='OS.isPc ? "" : "mgl1"',
        v-if='userInfo.isLeader',
        :label-width='OS.isPc ? "60px" : "100px"'
      )
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(
        label='员工:',
        :class='OS.isPc ? "" : "mgl1"',
        :label-width='OS.isPc ? "60px" : "100px"',
        v-if='userInfo.isLeader'
      )
        el-select.winput(
          v-model='model.UserId',
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
        auto-complete.mgl1(v-model='model.gameName', :data='gameList')
      el-form-item(label='区服:', :label-width='OS.isPc ? "60px" : "100px"')
        auto-complete.mgl1(v-model='model.areaName', :data='areaList')
      el-form-item.search-btn.mgb1(:class='OS.isPc ? "" : "jc-center full"')
        el-button(icon='el-icon-search', type='primary', @click='search') 搜索
        el-button.mgr2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置
        el-checkbox.mgt1(
          :class='OS.isPc ? "" : "mgb3"',
          v-model='searchMyData',
          v-if='userInfo.isLeader'
        ) 搜索我的数据
  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='xText', label='时间')
    el-table-column(prop='userRoleCount', label='创角数')
    el-table-column(prop='userCount', label='创角用户')
    el-table-column(prop='rechargeUserCount', label='充值人数')
    el-table-column(prop='rechargeCount', label='充值订单')
    el-table-column(prop='sum', label='充值总额(元)')
      template(slot-scope='{ row }') {{ row.sum | toFixed }}
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'MyTarget',
  components: {
    VLine: () => import('v-charts/lib/line.common'),
    VHistogram: () => import('v-charts/lib/histogram.common'),
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptRoleInfos',
      dtpApi: 'getDptRoleInfos',
      myApi: 'getRoleInfos',
      model: {
        gameName: '',
        areaName: '',
        dtpId: '',
        UserId: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo', 'OS']),
  },
}
</script>
<style lang='stylus' scoped>
.target
  .el-form-item
    margin-bottom 0px
</style>
