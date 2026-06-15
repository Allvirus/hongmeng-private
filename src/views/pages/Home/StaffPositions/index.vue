<template lang="pug">
.staffPositions
  el-form.ff-rn.bg-white.pdt2.pdx2(label-width='70px')
    el-form-item(label='部门:', v-if='userInfo.isLeader')
      tree-selector.winput(
        ref='dtptree',
        :data='myDptList.list',
        :defProps='myDptList.props',
        nodeKey='id',
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
    el-form-item.mgl3(label='选择时间:', label-width='80px')
      CommonDatePicker.w300(
        :start.sync='model.startTime',
        :end.sync='model.endTime',
        all
      )
      el-button.mgl3(
        icon='el-icon-search',
        type='primary',
        @click='search(getStaffJobsData)'
      ) 搜索
  .showbox.bg-white.mgt2.pd2
    el-table.my-table(
      :data='listMixin.list',
      :span-method='SpanMethod',
      border
    )
      el-table-column(prop='realName', label='推广员')
      el-table-column(prop='workStatus', label='员工状态')
        template(slot-scope='{ row }') {{ row.workStatus === 1 ? '在职' : '离职' }}
      el-table-column(prop='job', label='岗位')
        template(slot-scope='{ row }')
          span {{ jobArr[row.job] }}
      el-table-column(prop='postMonthPrice', label='新增流水')
      el-table-column(prop='thisMonthNewPrice', label='本月新增')
      //- el-table-column(prop='startTime', label='共享换包数')
      el-table-column(prop='postSubsequentAmount', label='后续流水')
      el-table-column(prop='postDeviceCount', label='换包数')
      el-table-column(prop='days', label='天数')
      el-table-column(prop='aPostCount', label='绑定客流岗人数')
      //- el-table-column(prop='startTime', label='共享人')
    el-pagination.margin-spacing(
      :total='listMixin.count',
      :page-size.sync='model.PageSize',
      :current-page.sync='model.Page',
      @current-change='getListMixin'
    )
    el-divider
    .Total
      p.fs-b.strong 总计：
      p.mgt1(v-for='item in totalList')
        span {{ jobArr[item.job] }}岗 (
        span 新增流水： {{ item.postMonthPrice }} ，
        span 本月新增： {{ item.thisMonthNewPrice }} ，
        span 后续流水：{{ item.postSubsequentAmount }}，
        span 换包数： {{ item.postDeviceCount }} )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getStatisticsJob',
      dtpApi: 'getStatisticsJob',
      model: {
        startTime: this.GetDateStr(0, 'start'),
        endTime: this.GetDateStr(0, 'end'),
        userId: '',
        PageSize: 10,
        Page: 1,
      },
      jobArr: ['客流', '引导', 'GS'],
      totalList: [],
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
  },
  mounted () {
    this.getStaffJobsData()
  },
  methods: {
    SpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 3 === 0) {
          return [3, 1]
        } else {
          return [0, 0]
        }
      }
    },
    getStaffJobsData () {
      this.$api.getStaffJobsData(this.model).then(res => {
        this.totalList = res.list
      })
    },
    GetDateStr (AddDayCount, ST) {
      const dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount) // 获取 AddDayCount 天后的日期
      const y = dd.getFullYear()
      const m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)
      const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
      if (ST === 'end') {
        return y + '-' + m + '-' + d + ' ' + '23:59:59'
      } else {
        return y + '-' + m + '-' + d + ' ' + '00:00:00'
      }
    },
  },
}
</script>
<style lang="stylus">
.my-table {
  .el-table__row:nth-child(2n) {
    background: none !important;
  }
}
</style>
