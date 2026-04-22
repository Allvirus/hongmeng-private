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
      el-form.ff-rw.mgt2.ai-center(label-width='60px')
        el-form-item(
          label='部门:',
          :class='OS.isPc ? "" : "mgl1"',
          v-if='userInfo.isLeader'
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
        el-form-item(label='游戏名称:', :label-width='OS.isPc ? "90px" : "60px"')
          auto-complete.mgl1(
            v-model='model.gameName',
            :data='gameList',
            placeholder='请输入游戏名称'
          )
        el-form-item(label='区服:')
          auto-complete.mgl1(
            v-model='model.areaName',
            :data='areaList',
            placeholder='请输入区服'
          )
        el-form-item(
          v-if='selTimeRange === "时间区间"',
          label='时间范围:',
          :label-width='OS.isPc ? "90px" : "75px"'
        )
          CommonDatePicker.w300(
            :start.sync='model.startTime',
            :end.sync='model.endTime',
            all
          )
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

  //- 创角指数
  .data-panel.mgt2.ff-rn(v-if='OS.isPc')
    .pd1.flex-1(v-for='(item, key, idx) in panelList')
      data-box(
        :data='item',
        :colIdx='idx',
        :toFixed='item.toFixed',
        :key='idx'
      )

  .ff-rn.mgt2.w100p.jc-around.bg-white.dataOverview(v-if='!OS.isPc')
    .ff-cn(v-for='(item, key, idx) in panelList')
      p.mgt2.jc-center.omit {{ item.title }}
      h3.jc-center.mgy2.warning {{ item.value }}

  //- 图表
  .mgt2
    .chart(
      :class='halfLayout ? "ff-rn" : "ff-cn"',
      :key='halfLayout ? "half" : "full"'
    )
      .ff-cn.flex-1.bg-white.border-radius(:class='halfLayout ? "mgr2" : ""')
        h3.mg2 推广数据
        v-histogram.charts.flex-1.mgt2(
          :settings='newRoleData.option',
          :data='newRoleData',
          :events='chartEvents'
        )
      .ff-cn.flex-1.bg-white.border-radius(:class='halfLayout ? "" : "mgt2"')
        h3.mg2 充值总额
        v-line.charts.flex-1.mgt2(:data='rechData')

  el-table.mgy2.bg-white.pd2(
    :data='reversedDataList',
    :cell-class-name='getCellClassName',
    @cell-click='onTableCellClick'
  )
    el-table-column(prop='xText', label='时间')
    el-table-column(prop='userRoleCount', label='创角数')
    el-table-column(prop='userCount', label='换包')
    el-table-column(prop='rechargeUserCount', label='充值人数')
    el-table-column(prop='rechargeCount', label='充值订单')
    el-table-column(prop='sum', label='充值总额(元)')
      template(slot-scope='{ row }') {{ row.sum | toFixed }}

  el-dialog(:title='detailDialog.title', :visible.sync='detailDialog.visible', width='1280px')
    .mgb2
      span.mgr3 当前时间: {{ detailDialog.timeText || '--' }}
      span.mgr3 创角数: {{ detailDialog.userRoleCount }}
      span.mgr3 换包数: {{ detailDialog.userCount }}
    .detail-table-wrap
      .detail-loading-mask(v-if='detailLoading') 加载中...
      el-table(:data='detailRows', max-height='420')
        el-table-column(type='index', label='序号', width='70')
        el-table-column(prop='accountId', label='账号ID', min-width='180')
        el-table-column(prop='roleCode', label='角色ID(角色代码)', min-width='160')
        el-table-column(prop='deviceNo', label='设备ID', min-width='240')
        el-table-column(prop='createIp', label='IP', min-width='140')
        el-table-column(prop='accountCreateDate', label='账号注册时间', width='180')
          template(slot-scope='{ row }') {{ row.accountCreateDate | dateFormat }}
        el-table-column(prop='rebindResult', label='换包', min-width='140')
    .pd4.tc(v-if='!detailLoading && !detailRows.length') 暂无明细数据
</template>

<script>
import { mapGetters } from 'vuex'

const padDateNum = num => (num < 10 ? '0' + num : '' + num)

const getTodayDateRange = () => {
  const now = new Date()
  const dateText = [
    now.getFullYear(),
    padDateNum(now.getMonth() + 1),
    padDateNum(now.getDate()),
  ].join('-')
  return {
    startTime: dateText + ' 00:00:00',
    endTime: dateText + ' 23:59:59',
  }
}

const createAchievementQueryModel = () => ({
  gameName: '',
  areaName: '',
  dtpId: '',
  UserId: '',
  ...getTodayDateRange(),
  page: 1,
  pageSize: 10,
})

export default {
  name: 'MyAchievement',
  components: {
    VLine: () => import('v-charts/lib/line.common'),
    VHistogram: () => import('v-charts/lib/histogram.common'),
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  data () {
    return {
      model: createAchievementQueryModel(),
      timeRange: ['今日', '昨日', '本周', '本月', '上月', '全年', '去年', '时间区间'],
      selTimeRange: '今日',
      dataSet: {

      },
      rechData: {
        columns: ['日期', '充值总额(元)'],
        rows: [],
      },
      newRoleData: {
        columns: ['日期', '创角数', '换包', '充值人数', '充值订单数'],
        rows: [],
      },
      panelList: {
        registerCount: {
          title: '注册数',
          value: 0,
          increase: true,
          rate: 0,
        },
        newRoles: {
          title: '创角数',
          value: 0,
          increase: true,
          rate: 0,
        },
        newUsers: {
          title: '换包',
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
          title: '充值订单',
          value: 0,
          increase: false,
          rate: 0,
        },
        rechgTotal: {
          title: '充值总额',
          value: 0,
          increase: true,
          rate: 0,
          toFixed: true,
        },
      },
      dataList: [],
      userList: [],
      defaultUserList: [],
      searchMyData: false,
      detailDialog: {
        visible: false,
        title: '创角明细',
        timeText: '',
        userRoleCount: 0,
        userCount: 0,
      },
      detailRows: [],
      detailLoading: false,
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
    halfLayout () {
      return this.OS.isPc
    },
    chartEvents () {
      return {
        click: this.onChartClick,
      }
    },
    reversedDataList () {
      return [...this.dataList].reverse()
    },
  },
  created () {
    if (this.userInfo.isLeader) {
      this.model.dtpId = this.myDptList.list[0].id
      this.$api.getDepartMembers(this.model.dtpId).then(data => {
        this.userList = data
        this.defaultUserList = [...data]
      })
    }
    this.search()
  },
  methods: {
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
        userCount: 0, // 换包
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
          换包: row.userCount,
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
        case '时间区间':
          ret = item.timeKey ? item.timeKey.substr(0, 10) : index
          break
        default:
          return index
      }
      return ret
    },
    formatDate (date) {
      return [
        date.getFullYear(),
        padDateNum(date.getMonth() + 1),
        padDateNum(date.getDate()),
      ].join('-')
    },
    formatDateTime (date) {
      return [
        this.formatDate(date),
        [padDateNum(date.getHours()), padDateNum(date.getMinutes()), padDateNum(date.getSeconds())].join(':'),
      ].join(' ')
    },
    parseDateValue (value) {
      if (!value) {
        return null
      }

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value.getTime())
      }

      if (typeof value !== 'string') {
        return null
      }

      const text = value.trim()
      if (!text) {
        return null
      }

      const directDate = new Date(text)
      if (!Number.isNaN(directDate.getTime())) {
        return directDate
      }

      const normalized = text.replace('T', ' ').replace(/\.\d+$/, '')
      const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
      if (!match) {
        return null
      }

      const [, year, month, day, hour = '0', minute = '0', second = '0'] = match
      const parsedDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      )

      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
    },
    isSelectedRange (...indexes) {
      return indexes.some(index => this.selTimeRange === this.timeRange[index])
    },
    getRangeDates () {
      this.$utils.autoFillDateTime(this.model)
      return {
        startDate: new Date(this.model.startTime.replace(/-/g, '/')),
        endDate: new Date(this.model.endTime.replace(/-/g, '/')),
      }
    },
    getRangeFullList (data) {
      const { startDate, endDate } = this.getRangeDates()
      const dateMap = {}
      for (const item of data) {
        dateMap[item.timeKey.substr(0, 10)] = item
      }
      const fullList = []
      const oneDay = 24 * 60 * 60 * 1000
      for (let time = startDate.getTime(); time <= endDate.getTime(); time += oneDay) {
        const current = new Date(time)
        const dateText = this.formatDate(current)
        const source = dateMap[dateText]
        const item = source ? { ...source } : this.genDataTmpl('dayKey', current.getDate())
        item.timeKey = item.timeKey || (dateText + 'T00:00:00')
        item.index = dateText
        fullList.push(item)
      }
      return fullList
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
    resolveDetailRange (row) {
      const dateFromTimeKey = row ? this.parseDateValue(row.timeKey) : null
      let start = null
      let end = null

      if (this.isSelectedRange(0, 1)) {
        if (!dateFromTimeKey) {
          return null
        }
        start = new Date(dateFromTimeKey)
        start.setMinutes(0, 0, 0)
        end = new Date(start.getTime() + 60 * 60 * 1000 - 1000)
      } else if (this.isSelectedRange(5, 6)) {
        if (!row || !row.monthKey) {
          return null
        }
        const year = this.isSelectedRange(5) ? new Date().getFullYear() : new Date().getFullYear() - 1
        start = new Date(year, row.monthKey - 1, 1, 0, 0, 0)
        end = new Date(year, row.monthKey, 0, 23, 59, 59)
      } else {
        if (dateFromTimeKey) {
          start = new Date(dateFromTimeKey)
          start.setHours(0, 0, 0, 0)
          end = new Date(start)
          end.setHours(23, 59, 59, 0)
        } else if (this.isSelectedRange(3) && row && row.dayKey) {
          const now = new Date()
          start = new Date(now.getFullYear(), now.getMonth(), row.dayKey, 0, 0, 0)
          end = new Date(now.getFullYear(), now.getMonth(), row.dayKey, 23, 59, 59)
        } else if (this.isSelectedRange(4) && row && row.dayKey) {
          const now = new Date()
          start = new Date(now.getFullYear(), now.getMonth() - 1, row.dayKey, 0, 0, 0)
          end = new Date(now.getFullYear(), now.getMonth() - 1, row.dayKey, 23, 59, 59)
        } else if (this.isSelectedRange(7)) {
          const rangeDate = this.parseDateValue(row && (row.index || row.xText))
          if (!rangeDate) {
            return null
          }
          start = new Date(rangeDate)
          start.setHours(0, 0, 0, 0)
          end = new Date(start)
          end.setHours(23, 59, 59, 0)
        } else {
          return null
        }
      }

      return {
        startTime: this.formatDateTime(start),
        endTime: this.formatDateTime(end),
      }
    },
    openCreateUserDialog (row) {
      if (!row || !row.userRoleCount) {
        return
      }

      this.detailDialog = {
        visible: true,
        title: '创角明细',
        timeText: row.xText || this.formatXaxis(row),
        userRoleCount: row.userRoleCount || 0,
        userCount: row.userCount || 0,
      }
      this.detailRows = []
      this.detailLoading = true

      const method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiCreateRoleDetail' : 'getDptAchiCreateRoleDetail'
      const detailRange = this.resolveDetailRange(row)
      if (!detailRange) {
        this.detailDialog.visible = false
        this.detailLoading = false
        this.$vgo.tip('时间范围解析失败', 'warning')
        return
      }

      const { startTime, endTime } = detailRange
      const params = {
        gameName: this.model.gameName,
        areaName: this.model.areaName,
        dtpId: this.model.dtpId,
        startTime,
        endTime,
      }

      if (this.model.UserId !== '') {
        params.UserId = Number(this.model.UserId)
      }

      this.$api[method](params).then(data => {
        this.detailRows = Array.isArray(data) ? data : []
      }).finally(() => {
        this.detailLoading = false
      })
    },
    onChartClick (params) {
      const createRoleSeriesName = this.newRoleData.columns[1]
      if (params.seriesName !== createRoleSeriesName) {
        return
      }

      const row = this.dataList.find(item => item.xText === params.name)
      if (!row || !row.userRoleCount) {
        return
      }

      this.openCreateUserDialog(row)
    },
    getCellClassName ({ row, column }) {
      if (column.property === 'userRoleCount' && row.userRoleCount > 0) {
        return 'achievement-link-cell'
      }
      return ''
    },
    onTableCellClick (row, column) {
      if (!column || column.property !== 'userRoleCount' || !row.userRoleCount) {
        return
      }
      this.openCreateUserDialog(row)
    },
    search () {
      this.onRadioChange(this.selTimeRange)
    },
    reset () {
      this.model = createAchievementQueryModel()
      this.searchMyData = false
      if (this.userInfo.isLeader) {
        this.model.dtpId = this.myDptList.list[0].id
        this.model.UserId = ''
        this.userList = [...this.defaultUserList]
        this.$refs.dtptree.reset(this.myDptList.list[0].name)
      }
      this.onRadioChange(this.selTimeRange)
    },
    onRadioChange (val) {
      if (this.userInfo.isLeader && this.model.dtpId === '' && !this.searchMyData) {
        this.$vgo.tip('请选择部门!', 'warning')
        return
      }

      // 清除原来的数据
      this.newRoleData.rows.splice(0, this.newRoleData.rows.length)
      this.rechData.rows.splice(0, this.rechData.rows.length)
      this.dataList.splice(0, this.dataList.length)
      this.detailDialog.visible = false
      this.detailRows = []
      this.detailLoading = false
      const params = {
        gameName: this.model.gameName,
        areaName: this.model.areaName,
        dtpId: this.model.dtpId,
      }
      if (this.model.UserId !== '') {
        params.UserId = Number(this.model.UserId)
      }

      var method = ''
      switch (val) {
        case '今日':
        case '昨日':
          if (val === '今日') {
            method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiByDay' : 'getDptAchiByDay'
          } else {
            method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiYesterday' : 'getDptAchiYesterday'
          }
          this.$api[method](params).then(data => {
            const tmp1 = []
            for (const item of data.data.createUser) {
              tmp1[item.hourKey] = item
            }

            const tmp2 = []
            for (const item of data.data.rechageUser) {
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
            const obj = {
              data: postData,
              registerCount: data.registerCount,
            }
            this.handleData(obj, 'hourKey', 24)
          })
          break
        case '本周':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiByWeek' : 'getDptAchiByWeek'
          this.$api[method](params).then(data => {
            this.handleData(data, 'dayKey', 7)
          })
          break
        case '上月':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiLastMonth' : 'getDptAchiLastMonth'
          this.$api[method](params).then(data => {
            this.handleData(data, 'dayKey', 30)
          })
          break
        case '本月':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiByMonth' : 'getDptAchiByMonth'
          this.$api[method](params).then(data => {
            this.handleData(data, 'dayKey', 30)
          })
          break
        case '全年':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiByYear' : 'getDptAchiByYear'
          this.$api[method](params).then(data => {
            this.handleData(data, 'monthKey', 12)
          })
          break
        case '去年':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiLastYear' : 'getDptAchiLastYear'
          this.$api[method](params).then(data => {
            this.handleData(data, 'monthKey', 12)
          })
          break
        case '时间区间':
          method = (this.searchMyData || !this.userInfo.isLeader) ? 'getAchiByRange' : 'getDptAchiByRange'
          this.$utils.autoFillDateTime(this.model)
          this.$api[method]({
            ...params,
            startTime: this.model.startTime,
            endTime: this.model.endTime,
          }).then(data => {
            this.handleRangeData(data)
          })
          break
        default:
          break
      }
    },
    handleData (res, key, range) {
      const data = res.data
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

      // 计算汇总数据...
      this.sum()
      this.panelList.registerCount.value = res.registerCount
    },
    handleRangeData (res) {
      const data = [...res.data]
      data.sort((a, b) => new Date(a.timeKey) - new Date(b.timeKey))

      const fullList = this.getRangeFullList(data)
      this.fillVChartData(fullList)

      this.dataList = data
      for (const item of this.dataList) {
        item.index = item.timeKey.substr(0, 10)
        item.xText = this.formatXaxis(item)
      }

      this.sum()
      this.panelList.registerCount.value = res.registerCount
    },
    onDepartChange (dptInfo) {
      this.model.dtpId = dptInfo.id
      this.model.UserId = ''
      this.$api.getDepartMembers(this.model.dtpId).then(data => {
        this.userList = data
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
$spc = 44px;

.MyAchievement {
  .condition {
    .btn-group {
      border-bottom: 1px solid #0487FF;
    }
  }

  .detail-table-wrap {
    position: relative;
  }

  .detail-loading-mask {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
    padding: 6px 12px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.92);
    color: #606266;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  >>>.achievement-link-cell .cell {
    color: #409EFF;
    cursor: pointer;
    text-decoration: underline;
  }

  >>>.el-radio-button:first-child .el-radio-button__inner, >>>.el-radio-button:last-child .el-radio-button__inner {
    border: none !important;
    border-radius: 0px;
  }

  >>>.el-radio-button__inner {
    border: none !important;
  }
}

.pc-mode {
  .opt-bar {
    .el-form-item {
      margin-bottom: 0px;
    }

    >>>.search-btn .el-form-item__content {
      margin-left: 10px !important;
    }
  }
}

.mobile-mode {
  .opt-bar {
    .el-form-item {
      margin-bottom: 10px;
    }

    >>>.search-btn .el-form-item__content {
      margin-left: 10px !important;
    }
  }

  .dataOverview {
    font-size: 11px !important;
  }
}
</style>
