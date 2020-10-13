<template lang='pug'>
.MyAchievement
  //- 查询条件
  .condition.pd2.bg-white
    .btn-group.pdl3
      el-radio-group(v-model='selTimeRange', @change='onRadioChange')
        el-radio-button(
          v-for='(item, index) in timeRange',
          :key='index',
          :label='item'
        )
    .opt-bar
      el-form.ff-rw.mgt2.ai-center(label-width='100px')
        el-form-item(label='部门:' label-width='60px')
          tree-selector.winput(
            :data='myDptList.list',
            :defProps='myDptList.props',
            nodeKey='id',
            clearable,
            @change='onDepartChange'
          )
        el-form-item(label='游戏名称:')
          auto-complete.mgl1(v-model="model.gameName" :data='gameList')
        el-form-item(label='区服:')
          auto-complete.mgl1(v-model="model.areaName" :data='areaList')
        el-form-item.search-btn
          el-button(icon='el-icon-search', type='primary', @click='search') 搜索
          el-button(icon='el-icon-refresh-right', type='primary', @click='reset') 重置

  //- 创角指数
  .data-panel.mgt2.ff-rn
    .pd1.flex-1(v-for='(item,key, idx) in panelList',)
      data-box(
        :data='item',
        :colIdx='idx',
        :toFixed="item.toFixed"
        :key='idx'
    )
  //- 图表
  .mgt3
    .chart(
      :class='halfLayout ? "ff-rn" : "ff-cn"',
      :key='halfLayout ? "half" : "full"'
    )
      .ff-cn.flex-1.bg-white.border-radius(:class='halfLayout ? "mgr2" : ""')
        h3.mg2 推广数据
        v-histogram.charts.flex-1.mgt2(
          :settings='newRoleData.option',
          :data='newRoleData'
        )
      .ff-cn.flex-1.bg-white.border-radius(:class='halfLayout ? "" : "mgt2"')
        h3.mg2 充值总额
        v-line.charts.flex-1.mgt2(:data='rechData')

  el-table.mgy2.bg-white.pd2(:data='dataList')
    el-table-column(prop="xText" label="时间")
    el-table-column(prop="userRoleCount" label="创角数")
    el-table-column(prop="userCount" label="创角用户")
    el-table-column(prop="rechargeUserCount" label="充值人数")
    el-table-column(prop="rechargeCount" label="充值订单")
    el-table-column(prop="sum" label="充值总额(元)")
      template(slot-scope="{ row }") {{row.sum | formatNumber}}

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyAchievement',
  components: {
    VLine: () => import('v-charts/lib/line.common'),
    VHistogram: () => import('v-charts/lib/histogram.common'),
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  data () {
    return {
      model: {
        gameName: '',
        areaName: '',
        departmentId: 0,
        page: 1,
        pageSize: 10,
      },
      timeRange: ['今日', '本周', '本月'],
      selTimeRange: '今日',
      dataSet: {

      },
      rechData: {
        columns: ['日期', '充值总额(元)'],
        rows: [],
      },
      newRoleData: {
        columns: ['日期', '创角数', '创角用户', '充值人数', '充值订单数'],
        rows: [],
      },
      panelList: {
        newRoles: {
          title: '创角数',
          value: 0,
          increase: true,
          rate: 0,
        },
        newUsers: {
          title: '创角用户',
          value: 0,
          increase: false,
          rate: 0,
        },
        rechgUsers: {
          title: '充值人数',
          value: 0,
          increase: false,
          rate: 0,
        },
        rechgOrders: {
          title: '充值订单数',
          value: 0,
          increase: false,
          rate: 0,
        },
        rechgTotal: {
          title: '充值总额(元)',
          value: 0,
          increase: true,
          rate: 0,
          toFixed: true,
        },
      },
      dataList: [],
    }
  },
  computed: {
    halfLayout () {
      // return this.selTimeRange === '本周'
      return true
    },
    ...mapGetters(['areaList', 'gameList', 'myDptList']),
  },
  created () {
    this.search()
  },
  methods: {
    handleData (data, key, range) {
      // 排序
      this.$utils.sort(data, key, false)

      // 插入数据
      const fullList = this.insertData(data, key, range)
      // 把数据转换成图表需要的格式
      this.fillVChartData(fullList)

      // 表格数据
      this.dataList = data
      for (const item of this.dataList) {
        item.xText = this.formatXaxis(item)
      }

      // 计算创角数...
      this.sum()
    },
    insertData (data, key, range) {
      const fullList = []
      // 把xxxKey的值作为数组的索引
      const tmpData = []
      if (range !== 7) {
        for (const item of data) {
          tmpData[item[key]] = item
        }
      } else {
        // 本周数据 dayKey表示的是一个月的号数，不是星期几
        for (const item of data) {
          const date = new Date(item.timeKey)
          const weekNum = date.getDay()
          tmpData[weekNum] = item
        }
      }
      range = key === 'hourKey' ? range : range + 1
      for (let i = (key === 'hourKey' ? 0 : 1); i < range; i++) {
        let item = {}
        if (tmpData[i]) {
          // 如果数据存在就插入后台获取的数据
          item = tmpData[i]
        } else {
          // 后台没有数据，增加dayKey字段，插入默认数据
          item = this.genDataTmpl(key, i)
          if (range === 7) {
            // 需要给星期插入timeKey数据
          }
        }
        // 生成一个统一的key字段，用来生成横坐标文本
        item.index = i
        fullList[i] = item
      }
      return fullList
    },
    // 创建数据结构模板
    genDataTmpl (key, val) {
      const tmpl = {
        timeKey: '', // 时间段
        userCount: 0, // 创角用户
        userRoleCount: 0, // 创角数
        rechargeCount: 0, // 充值订单数
        rechargeUserCount: 0, // 充值用户数量
        sum: 0, // 充值总额
      }
      tmpl[key] = val
      return tmpl
    },
    fillVChartData (data) {
      for (const key in data) {
        const row = data[key]
        // 柱状图
        const roleItem = {
          日期: this.formatXaxis(row),
          创角数: row.userRoleCount,
          创角用户: row.userCount,
          充值人数: row.rechargeUserCount,
          充值订单数: row.rechargeCount,
        }
        this.newRoleData.rows.push(roleItem)

        // 折线图
        const rechItem = {
          日期: this.formatXaxis(row),
          '充值总额(元)': row.sum,
        }
        this.rechData.rows.push(rechItem)
      }
    },
    formatXaxis (item) {
      const index = item.index
      let ret = ''
      switch (this.selTimeRange) {
        case '今日':
          if (index < 10) {
            ret = '0' + index + ':00'
          } else {
            ret = index + ':00'
          }
          break
        case '本周':
          ret = '周' + '一二三四五六日'.charAt(item.index - 1)
          break
        case '本月':
          ret = index + '日'
          break
        case '全年':
          ret = index + '月'
          break
        default:
          return index
      }
      return ret
    },
    sum () {
      for (const key in this.panelList) {
        this.panelList[key].value = 0
      }
      for (const item of this.dataList) {
        this.panelList.newRoles.value += item.userRoleCount
        this.panelList.newUsers.value += item.userCount
        this.panelList.rechgUsers.value += item.rechargeUserCount
        this.panelList.rechgOrders.value += item.rechargeCount
        this.panelList.rechgTotal.value += item.sum
      }
    },
    search () {
      this.onRadioChange(this.selTimeRange)
    },
    reset () {
      this.model.gameName = ''
      this.model.areaName = ''
      this.onRadioChange(this.selTimeRange)
    },
    onRadioChange (val) {
      // 清除原来的数据
      this.newRoleData.rows.splice(0, this.newRoleData.rows.length)
      this.rechData.rows.splice(0, this.rechData.rows.length)
      this.dataList.splice(0, this.dataList.length)
      const params = {
        gameName: this.model.gameName,
        areaName: this.model.areaName,
        departmentId: this.model.departmentId,
      }
      switch (val) {
        case '今日':
          this.$api.getAchiByDay(params).then(data => {
            const tmp1 = []
            for (const item of data.createUser) {
              tmp1[item.hourKey] = item
            }

            const tmp2 = []
            for (const item of data.rechageUser) {
              tmp2[item.hourKey] = item
            }
            const postData = []
            for (let i = 0; i < 24; i++) {
              if (tmp1[i] || tmp2[i]) {
                const item = this.genDataTmpl('hourKey', i)
                if (tmp1[i]) {
                  item.timeKey = tmp1[i].timeKey
                  item.userCount = tmp1[i].userCount
                  item.userRoleCount = tmp1[i].userRoleCount
                }
                if (tmp2[i]) {
                  item.rechargeCount = tmp2[i].rechargeCount
                  item.rechargeUserCount = tmp2[i].rechargeUserCount
                  item.sum = tmp2[i].sum
                }
                postData.push(item)
              }
            }
            this.handleData(postData, 'hourKey', 24)
          })
          break
        case '本周':
          this.$api.getAchiByWeek(params).then(data => {
            this.handleData(data, 'dayKey', 7)
          })
          break
        case '本月':
          this.$api.getAchiByMonth(params).then(data => {
            this.handleData(data, 'dayKey', 30)
          })
          break
        case '全年':
          this.$api.getAchiByYear(params).then(data => {
            this.handleData(data, 'dayKey', 12)
          })
          break
        default:
          break
      }
    },
    onDepartChange (dtpId) {
      this.model.dtpId = dtpId
    },
  },
}
</script>

<style lang="stylus" scoped>
$spc = 44px

.MyAchievement
  .condition
    .btn-group
      border-bottom 1px solid #0487FF
  >>>.el-radio-button:first-child .el-radio-button__inner,
  >>>.el-radio-button:last-child .el-radio-button__inner
    border none !important
    border-radius 0px
  >>>.el-radio-button__inner
    border none !important
  .opt-bar
    .el-form-item
      margin-bottom 0px
    >>>.search-btn .el-form-item__content
      margin-left 10px !important
</style>
