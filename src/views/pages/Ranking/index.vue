<template lang='pug'>
.Ranking
  .condition.pd2.bg-white
    .btn-group
      el-radio-group(v-model='selLabel' @change='getRank')
        el-radio-button(
          v-for='(item, index) in timeRange',
          :key='index',
          :value="index"
          :label='item.label'
        )
    .ff-rn.jc-around.mgt3
      ranking-list
      ranking-list.mgl3
      ranking-list.mgl3
      ranking-list.mgl3
</template>
<script>
import RankingList from './comps/RankingList'
export default {
  name: '',
  components: {
    RankingList,
  },
  data () {
    return {
      timeRange: {
        今日: {
          label: '今日',
          method: 'getRankToday',
        },
        昨日: {
          label: '昨日',
          method: 'getRankYesterday',
        },
        本周: {
          label: '本周',
          method: 'getRankWeek',
        },
        上周: {
          label: '上周',
          method: 'getRankLastweek',
        },
        本月: {
          label: '本月',
          method: 'getRankMonth',
        },
        上月: {
          label: '上月',
          method: 'getRankLastMonth',
        },
      },
      selLabel: '今日',
      rankList: [],
    }
  },
  computed: {
  },
  created: function () {
    this.getRank()
  },
  methods: {
    getRank () {
      this.$api[this.timeRange[this.selLabel].method]().then(data => {
        this.rankList = data
        console.log(this.timeRange[this.selLabel].method, data)
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.Ranking
  .btn-group
    border-bottom 1px solid #0487FF
  >>>.el-radio-button:first-child .el-radio-button__inner, >>>.el-radio-button:last-child .el-radio-button__inner
    border none !important
    border-radius 0px
  >>>.el-radio-button__inner
    border none !important
</style>
