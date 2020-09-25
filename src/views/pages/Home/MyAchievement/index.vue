<template lang='pug'>
.MyAchievement
  //- 查询条件
  .condition.pd2
    .btn-group.pdl3
      el-radio-group(v-model="time")
        el-radio-button(v-for="(item,index) in timeRange" :key="index" :label="item")
    .ff-rn.fs-m.ai-center.mgt2
      label.strong 游戏名称:
      el-select.mgl3(v-model="selGame" placeholder="请选择")
        el-option(v-for="item in gameOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value")
      label.strong.mgl3 区服名称:
      el-select.mgl3(v-model="selServ" placeholder="请选择")
        el-option(v-for="item in servOpts"
        :key="item.value"
        :label="item.label"
        :value="item.value")
      el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
      el-button(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

  //- 创角指数
  .data-panel.mgt2.ff-rn
    data-box.mgl2(:data="item" :colIdx="idx" v-for="(item,idx) in dbList" :key="idx")
  //- 图表
  .mgt3
    .ff-rn
      v-line.charts.flex-1.mgr2.border-radius(:data="lineChart" :settings="lineChart.option")
      v-histogram.charts.flex-1.mgl2.border-radius(:data="histogramData")
</template>

<script>
// import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyAchievement',
  components: {
    VLine: () => import('v-charts/lib/line.common'),
    VHistogram: () => import('v-charts/lib/histogram.common'),
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  // mixins: [fetchListMixin],
  data () {
    return {
      timeRange: ['今日', '本周', '本月', '全年'],
      time: '今日',
      selGame: '',
      histogramData: {
        columns: ['日期', '充值总额'],
        rows: [
          { 日期: '1/1', 充值总额: 1393 },
          { 日期: '1/2', 充值总额: 3530 },
          { 日期: '1/3', 充值总额: 2923 },
          { 日期: '1/4', 充值总额: 1723 },
          { 日期: '1/5', 充值总额: 3792 },
        ],
      },
      lineChart: {
        columns: ['日期', '新创角设备', '旧创角设备'],
        rows: [
          { 日期: '1/1', 新创角设备: 1393, 旧创角设备: 1093 },
          { 日期: '1/2', 新创角设备: 3530, 旧创角设备: 3230 },
          { 日期: '1/3', 新创角设备: 2923, 旧创角设备: 2623 },
          { 日期: '1/4', 新创角设备: 1723, 旧创角设备: 1423 },
          { 日期: '1/5', 新创角设备: 3792, 旧创角设备: 3492 },
          { 日期: '1/6', 新创角设备: 4593, 旧创角设备: 4293 },
        ],
      },
      gameOpts: [
        {
          value: 'game1',
          label: '王者荣耀',
        },
        {
          value: 'game2',
          label: '绝地求生',
        },
      ],
      selServ: '',
      servOpts: [
        {
          value: 'gx',
          label: '广西',
        },
        {
          value: 'hn',
          label: '湖南',
        },
      ],
      dbList: [
        {
          title: '创角数',
          value: 12600,
          increase: false,
          rate: 35,
        },
        {
          title: '收益',
          value: 65550,
          increase: true,
          rate: 48,
        },
      ],
    }
  },
  created () {
  },
  methods: {
    search () {
      this.$vgo.tip('开始搜索 ' + this.time, 'success')
    },
    reset () {
      this.$vgo.tip('已重置', 'success')
    },
  },
}
</script>

<style lang="stylus" scoped>
$spc = 44px
.MyAchievement
  .condition
    background-color #fff
    .btn-group
      border-bottom 1px solid #0487FF
  .charts
    background-color #fff
</style>
