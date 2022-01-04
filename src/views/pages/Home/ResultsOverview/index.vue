<template lang="pug">
  .ResultsOv
    el-form.ff-rn.bg-white.pdt2.pdx2(label-width='70px')
      el-form-item(label='部门:' v-if='userInfo.isLeader')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      //- el-form-item(label='部门:' v-if='userInfo.isLeader')
      //-   el-select.winput(
      //-     v-model='model.resDepId',
      //-     placeholder='请选择',
      //-     @change="changeDep"
      //-     filterable
      //-   )
      //-     el-option(
      //-       v-for='item in allDepID',
      //-       :key='item.id',
      //-       :label='item.name',
      //-       :value='item.id'
      //-     )
      el-form-item.mgl3(label='选择时间:' label-width='80px')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(
          icon='el-icon-search',
          type='primary',
          @click="search"
        ) 搜索
    .chart.mgt2.bg-white
      el-radio-group.mg2(v-model="radio" size="small")
        el-radio-button(:label="item.value" v-for="item in SFArr" :key="item.id") {{ item.name }}
      v-ring.mgt2(
        :data='pieChartData',
        :settings='settings',
        :height='settings.height'
      )
    .showbox.bg-white.mgt2.pd2
      //- el-button(
      //-   @click="goBack"
      //- ) 返回上级
      el-table.mgy2(
        :data='configList',
        show-summary
        :summary-method="getSummaries"
      )
        el-table-column(:prop='isleaf ? "realName" : "departmentName"',
        :label='isleaf ? "姓名" : "公司名称"')
          template(slot-scope="{ row }")
            span(@click="checkDetails(row)" :class="isleaf ? '' : 'company'") {{ isleaf ? row.realName : row.departmentName }}
        el-table-column(prop='inCount', label='在职人数/离职人数' width="80px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" :content="leaveThatText" placement="top-start")
              span 在职人数/离职人数
          template(slot-scope="{ row }")
            span {{ row.inCount }} / {{ row.outCount }}
        el-table-column(prop='registerCount', label='注册数' width="70px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="注册数：注册玩家数，独立ip注册：每个公司内ip当天不重复的注册玩家数" placement="top-start")
              span 注册数
        el-table-column(prop='registerIPCount', label='独立IP注册数' width="100px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="注册数：注册玩家数，独立ip注册：每个公司内ip当天不重复的注册玩家数" placement="top-start")
              span 独立IP注册数
        el-table-column(prop='totalDeviceCount', label='换包数' width="70px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="个人历史设备号不重复且ip当天不重复计算为一个换包数" placement="top-start")
              span 换包数
          template(slot-scope="{ row }")
            span(@click="getPsdn(row)" class="psdn") {{ row.totalDeviceCount }}
        el-table-column(prop='showSnsRegisterCount', label='总登记数/转化率' width="80px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="总登记数：玩家社交账号登记总数，转化率=总换包数/总登记数" placement="top-start")
              span 总登记数/转化率
        el-table-column(prop='snsRegisterCount', label='总登记数')
        el-table-column(prop='snsBlockCount', label='总拉黑数')
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="玩家社交账号拉黑总数" placement="top-start")
              span 总拉黑数
        el-table-column(prop='gameCount', label='产品数')
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="有推广的产品个数，点击个数的时产品按充值从高到低排序展示" placement="top-start")
              span 产品数
        el-table-column(prop='payUserCount', label='充值玩家数')
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="有充值的玩家数量" placement="top-start")
              span 充值玩家数
        el-table-column(prop='totalAllPrice', label='总充值金额' width="100px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" :content="amounttext" placement="top-start")
              span 总充值金额
            i.toLoadMore(:class="isShow ? 'el-icon-minus' : 'el-icon-plus'" @click="toLoadMore")
        el-table-column(prop='inTotalPrice', label='在职充值金额' width="100px" v-if="isShow")
        el-table-column(prop='aPostOutTotalPrice', label='离职充值金额' width="100px" v-if="isShow")
        el-table-column(prop='aPostOutTwoMonthTotalPrice', label='离职超两个月充值金额' v-if="isShow")
        el-table-column(prop='ltv', label='ltv' width="60px")
          template(slot="header" slot-scope="scope")
            el-tooltip(effect="dark" content="LTV值=流水/换包数，换包数是指走链接进来的换包数" placement="top-start")
              span ltv
          template(slot-scope='{ row }') {{ row.ltv | toFixed }}
    el-pagination.margin-spacing(
      v-if="isleaf"
      :total='count',
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 20]"
      :page-size.sync='model.PageSize',
      :current-page.sync='model.Page',
    )

    el-dialog(title="换包数" :visible.sync="dialogTableVisible")
      el-table(:data="psdnData")
        el-table-column(prop='account', label='推广员账户')
        el-table-column(prop='ajob', label='员工')
        el-table-column(prop='userAccount', label='玩家账户')
        el-table-column(prop='createDate', label='注册时间' width="150px")
          template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
        el-table-column(prop='osType', label='手机系统')
          template(slot-scope='{ row }')
            span {{ row.osType === "2" ? "安卓" : "ios" }}
        el-table-column(prop='deviceNo', label='注册设备号' width="130px")
        el-table-column(prop='createIp', label='注册IP')
        el-table-column(prop='isRepeatReg', label='是否重复注册')
          template(slot-scope='{ row }')
            span {{ row.isRepeatReg ? '是' : '否'}}
      el-pagination.margin-spacing(
        :total='psdnCount',
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size.sync='model.psdnPageSize',
        :current-page.sync='model.psdnPage',
      )
</template>
<script>
import { mapGetters } from 'vuex'
import { Pagination } from 'element-ui'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  components: {
    VRing: () => import('v-charts/lib/ring.common'),
    ElPagination: Pagination,
  },
  mixins: [dptListMixin],
  data () {
    return {
      model: {
        resDepId: '',
        psdnDepId: '',
        startTime: this.GetDateStr(0, 'start'),
        endTime: this.GetDateStr(0, 'end'),
        superiorId: '',
        PageSize: 10,
        Page: 1,
        psdnPageSize: 10,
        psdnPage: 1,
      },
      leaveThatText: '在职人数：统计时间范围内，在职的人数（公式：入职日期在搜索截止时间点之前减去离职日期在搜索截止时间之前的员工数量）；离职人数：统计时间范围内，离职的人数（公式：离职时间在搜索时间范围内的员工数量）',
      amounttext: '总充值金额=在职充值流水+离职充值流水+离职超2月流水。在职充值流水为推广离职日期之前(含离职日期)的数据属于在职充值金额,离职日期之后到次月底前的数据属于离职充值金额.举例:如张三2019.2.7号离职，那么2019.2.1-2019.2.7的数据属于在职充值金额，2019.2.8-2019.3.31的数据属于离职充值金额',
      count: 0,
      psdnCount: 0,
      configList: [],
      psdnData: [],
      radio: 'totalAllPrice',
      pieChartData: {
        columns: ['key', 'value'],
        rows: [],
      },
      // 饼图图表设置
      settings: {
        radius: [58, 75],
        height: '230px',
        labelLine: {
          length: 5,
        },
        hoverAnimation: true,
        offsetY: 130,
      },
      SFArr: [
        {
          name: '充值金额',
          id: 0,
          value: 'totalAllPrice',
        },
        {
          name: '总登记数',
          id: 1,
          value: 'snsRegisterCount',
        },
        {
          name: '换包数',
          id: 2,
          value: 'totalDeviceCount',
        },
      ],
      allDepID: [],
      isleaf: false,
      superiorDepId: null,
      dialogTableVisible: false,
      isShow: false,
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
  watch: {
    radio () {
      this.setPieData()
    },
    'model.resDepId' () {
      this.getSuperiorID()
    },
  },
  created () {
    this.$api.getAllDeparts().then(res => {
      this.allDepID = res
    })
  },
  mounted () {
    this.getStatisticsData()
  },
  methods: {
    getPsdn (row) {
      if (row.userId) {
        const userId = row.userId
        this.model.userId = userId
        this.getStatisticsEmployeeDevice()
        this.dialogTableVisible = true
      } else {
        const DepId = row.departmentId
        this.model.psdnDepId = DepId
        this.getStatisticsDevice()
        this.dialogTableVisible = true
      }
    },
    changeDep (item) {
      this.getSuperiorID()
    },
    search () {
      if (this.superiorDepId !== null && this.superiorDepId > 3) {
        this.getStatisticsEmployee()
        this.isleaf = true
      } else {
        this.getStatisticsData()
        this.isleaf = false
      }
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
    // 查询总数据
    getStatisticsData () {
      this.$api.getStatisticsData(this.model).then(res => {
        this.configList = res.list
        this.count = res.count

        this.setPieData()
      })
    },
    // 查询某个部门下的员工数据
    getStatisticsEmployee () {
      this.$api.getStatisticsEmployee(this.model).then(res => {
        this.configList = res.list
        this.count = res.count

        this.setPieData()
      })
    },
    // 查询某部门的换包数
    getStatisticsDevice () {
      this.$api.getStatisticsDevice(this.model).then(res => {
        this.psdnData = res.list
        this.psdnCount = res.count
      })
    },
    // 查询单个单个员工的换包记录
    getStatisticsEmployeeDevice () {
      this.$api.getStatisticsEmployeeDevice(this.model).then(res => {
        this.psdnData = res.list
        this.psdnCount = res.count
      })
    },
    setPieData () {
      this.pieChartData.rows = []
      // 处理饼图数据
      for (const item of this.configList) {
        for (const key in item) {
          if (key === this.radio) {
            const obj = {}
            if (item.departmentName) {
              obj.key = item.departmentName
            } else {
              obj.key = item.realName
            }
            if (item[key] !== 0) {
              obj.value = item[key]
            }
            this.pieChartData.rows.push(obj)
          }
        }
      }
    },
    checkDetails (row) {
      if (row.userId) return false
      const depInfo = {}
      depInfo.name = row.departmentName
      depInfo.id = row.departmentId
      this.$refs.dtptree.label = row.departmentName
      this.onDepartChange(depInfo)
      // 获取部门ID
      const depId = row.departmentId
      this.model.resDepId = depId
      this.getSuperiorID()
      this.search()
    },
    // 根据当前部门id获取上级部门id
    getSuperiorID () {
      const depID = this.model.resDepId
      for (const item of this.allDepID) {
        if (item.id === depID) {
          this.superiorDepId = item.superiorDepartmentId
        }
      }
    },
    toLoadMore () {
      this.isShow = !this.isShow
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return false
        }
        if (index === 1 && column.label === '在职人数/离职人数') {
          let inCountSum = 0
          let inOutCountSum = 0
          for (let i = 0; i < data.length; i++) {
            inCountSum += data[i].inCount
            inOutCountSum += data[i].outCount
          }
          const numberTotal = inCountSum + ' / ' + inOutCountSum
          sums[index] = numberTotal
        } else if (index === 5 && column.label === '总登记数/转化率') {
          // 总登记数
          let total = 0
          // 转化率
          let cvr = 0
          for (let i = 0; i < data.length; i++) {
            if (!data[i].showSnsRegisterCount) return false
            const Count = data[i].showSnsRegisterCount.slice(0, data[i].showSnsRegisterCount.length - 1)
            const CountArr = Count.split('/')
            total += Math.ceil(CountArr[0])
            cvr += Math.ceil(CountArr[1])
          }
          sums[index] = total + '/' + cvr + '%'
        } else {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = Math.floor(sums[index])
          } else {
            sums[index] = 'N/A'
          }
        }
      })

      return sums
    },
    handleSizeChange (pageSize) {
      if (this.dialogTableVisible) {
        this.model.psdnPageSize = pageSize
        this.getStatisticsDevice()
      } else {
        this.model.PageSize = pageSize
        this.search()
      }
    },
    handleCurrentChange (page) {
      if (this.dialogTableVisible) {
        this.model.psdnPage = page
        this.getStatisticsDevice()
      } else {
        this.model.Page = page
        this.search()
      }
    },
    // 返回上级
    // goBack () {
    //   console.log(this.superiorDepId)
    //   this.model.resDepId = this.superiorDepId
    //   this.search()
    // },
  },
}
</script>
<style lang="stylus" scoped>
.chart
  height 330px
.company
  cursor pointer
  color #ff7875
.psdn
  cursor pointer
  color #ff7a45
.toLoadMore
  cursor pointer
  margin-left 5px
  display inline-block
  border 1px solid #000
  color #000
</style>
