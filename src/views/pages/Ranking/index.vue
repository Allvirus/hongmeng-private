<template lang='pug'>
.Ranking
  .condition
    .bg-white.pd2
      .tab-toolbar(:class='OS.isPc ? "tab-toolbar-pc" : "tab-toolbar-mobile"')
        .toolbar-item.scope-tabs.layer-block.layer-one
          .layer-tag 第一层
          el-tabs(v-model='model.scope', @tab-click='getRank')
            el-tab-pane(label='个人', name='person')
            el-tab-pane(label='部门', name='department')
        .toolbar-item.metric-tabs.layer-block.layer-two
          .layer-tag 第二层
          el-tabs.rank-metric(v-model='model.metric', @tab-click='getRank')
            el-tab-pane(label='充值', name='recharge')
            el-tab-pane(label='新增', name='newRecharge')
            el-tab-pane(label='换包', name='device')
        .toolbar-item.quick-tabs
          .btn-group
            el-radio-group(
              v-model='activeQuickRange',
              @change='handleQuickRangeChange'
            )
              el-radio-button(
                v-for='item in quickRanges',
                :key='item.value',
                :label='item.value'
              ) {{ item.label }}
    el-form.ff-rw.mgt2.ai-center(:label-width='OS.isPc ? "80px" : "100px"')
      el-form-item(label='区服:')
        auto-complete(
          v-model='model.areaName',
          :data='areaList',
          placeholder='请输入区服',
          @change='handleFilterChange',
          @clear='handleFilterChange'
        )
      el-form-item(label='时间区间:')
        common-date-picker.winput(
          :start.sync='model.startDate',
          :end.sync='model.endDate',
          @change='handleDateChange'
        )
      el-form-item(label='返回条数:')
        el-select.winput(
          v-model='model.topN',
          placeholder='请选择返回条数',
          @change='getRank'
        )
          el-option(
            v-for='item in topNOptions',
            :key='item',
            :label='String(item)',
            :value='item'
          )
    .rank.mgt1
      .rank-card(v-for='item in rankCards', :key='item.job')
        ranking-list(
          :data='item.data',
          :mainTitle='item.title',
          :subTitle='subTitle',
          :theme='item.theme',
          :toFixed='isAmountMetric',
          rankingKey='value'
        )
</template>
<script>
import { mapGetters } from 'vuex'
import RankingList from './comps/RankingList'

const rankThemes = {
  A: 'orange',
  B: 'green',
  C: 'blue',
}

const jobs = ['A', 'B', 'C']

const quickRanges = [
  {
    label: '今日',
    value: 'today',
  },
  {
    label: '昨日',
    value: 'yesterday',
  },
  {
    label: '本周',
    value: 'thisWeek',
  },
  {
    label: '上周',
    value: 'lastWeek',
  },
  {
    label: '本月',
    value: 'thisMonth',
  },
  {
    label: '上月',
    value: 'lastMonth',
  },
]

const padDateNum = value => String(value).padStart(2, '0')

const formatDate = date => {
  return [
    date.getFullYear(),
    padDateNum(date.getMonth() + 1),
    padDateNum(date.getDate()),
  ].join('-')
}

const getDateOnly = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const getWeekStart = date => {
  const current = getDateOnly(date)
  const weekDay = current.getDay() || 7
  return addDays(current, 1 - weekDay)
}

// 快捷按钮只负责回填日期区间，实际查询统一走 /api/rank/query。
const getQuickRange = key => {
  const today = getDateOnly()
  const currentWeekStart = getWeekStart(today)
  switch (key) {
    case 'yesterday': {
      const yesterday = addDays(today, -1)
      return {
        startDate: formatDate(yesterday),
        endDate: formatDate(yesterday),
      }
    }
    case 'thisWeek':
      return {
        startDate: formatDate(currentWeekStart),
        endDate: formatDate(today),
      }
    case 'lastWeek': {
      const lastWeekEnd = addDays(currentWeekStart, -1)
      return {
        startDate: formatDate(getWeekStart(lastWeekEnd)),
        endDate: formatDate(lastWeekEnd),
      }
    }
    case 'thisMonth':
      return {
        startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        endDate: formatDate(today),
      }
    case 'lastMonth':
      return {
        startDate: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        endDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 0)),
      }
    case 'today':
    default:
      return {
        startDate: formatDate(today),
        endDate: formatDate(today),
      }
  }
}

const createDefaultModel = () => {
  const { startDate, endDate } = getQuickRange('today')
  return {
    scope: 'person',
    metric: 'recharge',
    job: 'all',
    startDate,
    endDate,
    areaName: '',
    topN: 10,
  }
}

export default {
  name: 'RankingPage',
  components: {
    RankingList,
  },
  data () {
    return {
      quickRanges,
      topNOptions: [10, 20, 50, 100, 200],
      model: createDefaultModel(),
      activeQuickRange: 'today',
      rankGroups: {
        A: [],
        B: [],
        C: [],
      },
    }
  },
  computed: {
    ...mapGetters(['OS', 'areaList']),
    isAmountMetric () {
      return this.model.metric === 'recharge' || this.model.metric === 'newRecharge'
    },
    subTitle () {
      if (this.model.metric === 'recharge') return '充值金额(元)'
      if (this.model.metric === 'newRecharge') return '新增充值金额(元)'
      return '换包数'
    },
    scopeLabel () {
      return this.model.scope === 'department' ? '部门' : '个人'
    },
    metricLabel () {
      if (this.model.metric === 'recharge') return '充值'
      if (this.model.metric === 'newRecharge') return '新增充值'
      return '换包'
    },
    rankCards () {
      return jobs.map(job => {
        return {
          job,
          title: `${job}岗${this.scopeLabel}${this.metricLabel}排行榜`,
          theme: rankThemes[job],
          data: this.rankGroups[job] || [],
        }
      })
    },
  },
  created () {
    this.getRank()
  },
  methods: {
    handleQuickRangeChange (value) {
      this.applyQuickRange(value)
      this.getRank()
    },
    handleFilterChange () {
      this.getRank()
    },
    handleDateChange () {
      this.activeQuickRange = ''
      this.getRank()
    },
    applyQuickRange (value) {
      const { startDate, endDate } = getQuickRange(value)
      this.model.startDate = startDate
      this.model.endDate = endDate
    },
    normalizeRankGroups (data) {
      const rankGroups = {
        A: [],
        B: [],
        C: [],
      }

      if (Array.isArray(data.groups)) {
        data.groups.forEach(group => {
          const job = String(group.job || '').toUpperCase()
          if (job in rankGroups) {
            rankGroups[job] = Array.isArray(group.items) ? group.items : []
          }
        })
        return rankGroups
      }

      if (Array.isArray(data.items)) {
        rankGroups.A = data.items
      }

      return rankGroups
    },
    getRank () {
      const requestId = (this.$_rankRequestId || 0) + 1
      this.$_rankRequestId = requestId
      // 后端已支持 job=all，页面直接消费 groups 渲染三岗榜单。
      this.$api.getRankQuery({
        ...this.model,
        loading: true,
      }).then(data => {
        if (requestId !== this.$_rankRequestId) return
        this.rankGroups = this.normalizeRankGroups(data)
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.Ranking {
  .condition {
    .bg-white {
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(4, 135, 255, 0.08);
    }
  }

  .tab-toolbar {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .tab-toolbar-pc {
    flex-wrap: nowrap;
  }

  .tab-toolbar-mobile {
    flex-wrap: wrap;
  }

  .toolbar-item {
    min-width: 0;
  }

  .layer-block {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 12px;
  }

  .scope-tabs {
    width: 188px;
    flex-shrink: 0;
  }

  .metric-tabs {
    width: 256px;
    flex-shrink: 0;
  }

  .layer-one {
    background: linear-gradient(135deg, rgba(243, 152, 0, 0.16), rgba(243, 152, 0, 0.04));
    border: 1px solid rgba(243, 152, 0, 0.28);
  }

  .layer-two {
    background: linear-gradient(135deg, rgba(0, 160, 233, 0.16), rgba(0, 160, 233, 0.04));
    border: 1px solid rgba(0, 160, 233, 0.28);
  }

  .layer-tag {
    flex-shrink: 0;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  .layer-one .layer-tag {
    color: #B96D00;
    background: rgba(255, 255, 255, 0.78);
  }

  .layer-two .layer-tag {
    color: #006EA1;
    background: rgba(255, 255, 255, 0.78);
  }

  .quick-tabs {
    flex: 1;
  }

  .rank-metric {
    margin-top: 0;
  }

  .btn-group {
    border-bottom: none;
    padding-top: 0;
  }

  .rank {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 16px;
    align-items: start;
  }

  .rank-card {
    min-width: 0;
  }

  >>>.el-form {
    gap: 8px 12px;
  }

  >>>.el-tabs__header {
    margin: 0;
  }

  >>>.el-tabs__content {
    display: none;
  }

  >>>.el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  >>>.el-tabs__item {
    height: 40px;
    line-height: 40px;
  }

  .quick-tabs >>>.el-radio-group {
    display: flex;
    flex-wrap: wrap;
  }

  >>>.el-radio-button:first-child .el-radio-button__inner, >>>.el-radio-button:last-child .el-radio-button__inner {
    border: none !important;
    border-radius: 0px;
  }

  >>>.el-radio-button__inner {
    border: none !important;
  }
}
</style>
