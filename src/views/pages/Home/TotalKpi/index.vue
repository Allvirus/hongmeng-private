<template lang='pug'>
.TotalKpi
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='60px')
      el-form-item(label='部门:')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:')
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
        v-permission='\'salary.query\'',
        :class='OS.isPc ? "" : "mgb2"',
        icon='el-icon-search',
        type='primary',
        @click='getSalaryList'
      ) 搜索
      el-button.mgl2.mgb3(
        v-permission='\'salary.add\'',
        :class='OS.isPc ? "" : "mgb2"',
        type='success',
        @click='dialogVisible = true'
      ) 新增
      el-button.mgb3(
        v-permission='\'salary.export\'',
        type='warning',
        @click='exportWages'
      ) 导出工资

  el-table.mgy2.bg-white.pd2(:data='salaryList')
    el-table-column(label='月份')
      template(slot-scope='{ row }') {{ row.month }}
    el-table-column(prop='userName', label='员工')
    el-table-column(label='在职状态')
      template(slot-scope='{ row }') {{ workStatus[row.status].status }}
    el-table-column(label='月定岗')
      template(slot-scope='{ row }')
        span(v-if='row.monthJob === 0') A岗
        span(v-else-if='row.monthJob === 1') B岗
        span(v-else='row.monthJob === 2') C岗
    el-table-column(prop='totalExp', label='总经验值')
      template(slot='header', slot-scope='scope')
        span 总经验值
        i.toLoadMore(
          :class='isShowExp ? "el-icon-minus" : "el-icon-plus"',
          @click='isShowExp = !isShowExp'
        )
    el-table-column(prop='aPostExp', label='客流岗经验值', v-if='isShowExp')
    el-table-column(prop='bPostExp', label='引导岗经验值', v-if='isShowExp')
    el-table-column(prop='cPostExp', label='GS岗经验值', v-if='isShowExp')
    el-table-column(
      prop='totalSalary',
      label='核算工资流水',
      :width='isShowSalary ? "120px" : ""'
    )
      template(slot='header', slot-scope='scope')
        span 核算工资流水
        i.toLoadMore(
          :class='isShowSalary ? "el-icon-minus" : "el-icon-plus"',
          @click='isShowSalary = !isShowSalary'
        )
    el-table-column(prop='aPostSalary', label='客流岗流水', v-if='isShowSalary')
    el-table-column(prop='bPostSalary', label='引导岗流水', v-if='isShowSalary')
    el-table-column(prop='cPostSalary', label='GS岗流水', v-if='isShowSalary')
    el-table-column(prop='levelName', label='等级')
    el-table-column(prop='commission', label='提成点')
      template(slot-scope='{ row }') {{ row.commission + '%' }}
    el-table-column(prop='percentAmount', label='提成金额')
    el-table-column(prop='basicSalary', label='底薪')
    el-table-column(label='创建时间', width='190')
      template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
  el-pagination.margin-spacing(
    :total='count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getSalaryList',
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
      el-button(
        v-permission='\'salary.add\'',
        type='primary',
        @click='confirmChange'
      ) 确定
</template>
<script>
import { mapGetters } from 'vuex'
import dptListMixin from '@/mixins/dptListMixin'
import axios from 'axios'
import utils from '@/plugins/utils'
export default {
  name: 'TotalKpi',
  mixins: [dptListMixin],
  data () {
    return {
      workStatus: [
        {
          status: '未知',
          class: '',
        },
        {
          status: '在职',
          class: '',
        },
        {
          status: '离职',
          class: 'danger',
        },
        {
          status: '离职超3个月',
          class: 'danger',
        },
      ],
      model: {
        Month: this.getLastMonth(),
        WorkStatus: 0,
        userId: '',
        resDepId: 1,
        page: 1,
        pageSize: 10,
      },
      count: 0,
      salaryList: [],
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
      myDpt: {
        list: [],
      },
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
  },
  created () {
    this.$store.dispatch('getMyDptList', 1)
    this.getSalaryList()
  },
  mounted () {
    this.onDepartChange({ id: 1 })
  },
  methods: {
    getSalaryList () {
      this.$api.getSalaryData(this.model).then(res => {
        this.count = res.count
        this.salaryList = res.list
      })
    },
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
      let LastMonth = date.getMonth()
      let Y = date.getFullYear()
      if (LastMonth === 0) {
        LastMonth = 12
        Y = Y - 1
      }
      LastMonth = '00' + (LastMonth)
      return Y + '-' + LastMonth.substr(-2)
    },
    exportWages () {
      if (this.salaryList.length < 1) {
        this.$vgo.tip('无数据', 'error')
        return false
      }
      axios.get('/api/salary/excel', {
        responseType: 'blob',
        params: utils.filterNull(this.model),
        baseURL: $globalconfig.API,
        timeout: 0,
        headers: { Authorization: utils.getToken() },
      }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.$route.meta.title + '.xlsx')

        document.body.appendChild(link)

        link.click()
      }).catch(err => {
        this.$vgo.tip('下载失败', 'error')
        console.log(err)
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.toLoadMore {
  cursor: pointer;
  margin-left: 5px;
  display: inline-block;
  border: 1px solid #000;
  color: #000;
}
</style>
