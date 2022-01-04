<template lang='pug'>
.TotalKpi
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='60px')
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
      el-form-item(
        label='员工状态:',
        v-if='userInfo.isLeader',
        label-width='100px'
      )
        el-select.winput(
          v-model='model.WorkStatus',
          placeholder='请选择',
          clearable,
          filterable
        )
          el-option(
            v-for='item in UserStatus',
            :key='item.value',
            :label='item.status',
            :value='item.value'
          )
      el-form-item(label='选择时间:', v-if='OS.isPc', label-width='100px')
        el-date-picker(
          v-model='model.Month',
          type='month',
          placeholder='选择月',
          value-format='yyyyMM'
        )
      el-button.mgl3.mgb3(
        :class='OS.isPc ? "" : "mgb2"',
        icon='el-icon-search',
        type='primary',
        @click='search'
      ) 搜索
      el-button.mgl2.mgb3(
        :class='OS.isPc ? "" : "mgb2"',
        icon='el-icon-refresh-right',
        type='primary',
        @click='reset'
      ) 重置
      el-button.mgl2.mgb3(
        :class='OS.isPc ? "" : "mgb2"',
        type='success',
        @click='dialogVisible = true'
      ) 新增

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(label='月份')
      template(slot-scope='{ row }') {{ row.month }}
    el-table-column(prop='userName', label='员工')
    el-table-column(label='在职状态')
      template(slot-scope='{ row }') {{ row.status == 1 ? "在职" : "离职" }}
    el-table-column(label='月定岗' )
      template(slot-scope='{ row }')
        span(v-if='row.monthJob === 0') A岗
        span(v-else-if='row.monthJob === 1') B岗
        span(v-else='row.monthJob === 2') C岗
    el-table-column(prop='totalExp', label='总经验值')
      template(slot="header" slot-scope="scope")
        span 总充值金额
        i.toLoadMore(:class="isShowExp ? 'el-icon-minus' : 'el-icon-plus'" @click="isShowExp = !isShowExp")
    el-table-column(prop='aPostExp', label='销售岗经验值' v-if="isShowExp")
    el-table-column(prop='bPostExp', label='客服岗经验值' v-if="isShowExp")
    el-table-column(prop='cPostExp', label='后勤岗经验值' v-if="isShowExp")
    el-table-column(prop='totalSalary', label='核算工资流水' :width="isShowSalary ? '120px' : ''")
      template(slot="header" slot-scope="scope")
        span 核算工资流水
        i.toLoadMore(:class="isShowSalary ? 'el-icon-minus' : 'el-icon-plus'" @click="isShowSalary = !isShowSalary")
    el-table-column(prop='aPostSalary', label='销售岗流水' v-if="isShowSalary")
    el-table-column(prop='bPostSalary', label='客服岗流水' v-if="isShowSalary")
    el-table-column(prop='cPostSalary', label='后勤岗流水' v-if="isShowSalary")
    el-table-column(prop='levelName', label='等级')
    el-table-column(prop='commission', label='提成点')
      template(slot-scope='{ row }') {{ row.commission + "%" }}
    el-table-column(prop='percentAmount', label='提成金额')
    el-table-column(label='创建时间', width='190')
      template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin',
    :class='OS.isPc ? "margin-spacing" : ""',
    :base='!OS.isPc',
    :small='!OS.isPc'
  )
  el-dialog(title='创建工资记录', :visible.sync='dialogVisible', width='30%')
    .box
      span.mgr3 请选择月份：
      el-date-picker(
        v-model='createWage.Month',
        type='month',
        value-format='yyyy-MM',
        placeholder='选择月'
      )
    span.dialog-footer(span, slot='footer')
      el-button(@click='cancelChange') 取消
      el-button(type='primary', @click='confirmChange') 确定
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'TotalKpi',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getSalaryData',
      dtpApi: 'getSalaryData',
      myApi: 'getRoleInfos',
      model: {
        Month: '',
        WorkStatus: 0,
        userId: '',
        resDepId: '0',
        page: 1,
        pageSize: 10,
      },
      createWage: {
        Month: '',
      },
      UserStatus: [
        {
          value: 0,
          status: '全部职员',
        },
        {
          value: 1,
          status: '在职',
        },
        {
          value: 2,
          status: '离职',
        },
      ],
      dialogVisible: false,
      isShowExp: false,
      isShowSalary: false,
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
  },
  created () {
    this.getLastMonth()
    this.search()
  },
  methods: {
    cancelChange () {
      this.dialogVisible = false
    },
    confirmChange () {
      if (!this.createWage.Month) {
        this.$vgo.tip('请输入日期', 'error')
        return false
      }

      this.$api.createPayrollRecords(this.createWage).then(res => {
        if (res.code === 200) {
          this.$vgo.tip('添加成功', 'success')
          this.dialogVisible = false
          this.createWage.Month = ''
        } else {
          this.$vgo.tip('添加失败', 'error')
        }
      })
    },
    getLastMonth () {
      const date = new Date()
      const LastMonth = date.getMonth()
      const Y = date.getFullYear()
      this.model.Month = Y + '-' + LastMonth
    },
  },
}
</script>
<style lang='stylus' scoped>
.toLoadMore
  cursor pointer
  margin-left 5px
  display inline-block
  border 1px solid #000
  color #000
</style>
