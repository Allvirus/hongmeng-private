<template lang='pug'>
.Ranking
  .condition
    .bg-white.pd2
      .btn-group
        el-radio-group(v-model='activeLabel', @change='getRank')
          el-radio-button(
            v-for='(item, index) in timeRange',
            :key='index',
            :value='index',
            :label='item.label'
          )
    el-form.ff-rw.mgt2.ai-center
      el-form-item(label='区服:', :label-width='OS.isPc ? "60px" : "100px"')
        auto-complete.mgl1(
          v-model='model.areaName',
          :data='areaList',
          placeholder='请输入区服'
        )
      el-form-item(:class='OS.isPc ? "" : "jc-center full"')
        el-button.mgl2(icon='el-icon-search', type='primary', @click='getRank') 搜索
    .rank(:class='OS.isPc ? "ff-rn jc-around mgt1" : ""')
      ranking-list(
        :data='rankList.ajobMoneyRank',
        mainTitle='A岗充值排行榜',
        subTitle='充值金额(元)',
        theme='orange',
        :toFixed='true',
        rankingKey='totlaMoney'
      )
      ranking-list(
        :data='rankList.ajobRegRank',
        mainTitle='A岗注册排行榜',
        subTitle='注册人数',
        theme='orange',
        rankingKey='count'
      )
      ranking-list(
        :data='rankList.bjobRegRank',
        mainTitle='B岗注册排行榜',
        subTitle='注册人数',
        theme='green',
        rankingKey='count'
      )
      ranking-list(
        :data='rankList.cjobMoneyRank',
        mainTitle='C岗充值排行榜',
        subTitle='充值金额(元)',
        theme='blue',
        :toFixed='true',
        rankingKey='totlaMoney'
      )
</template>
<script>
import { mapGetters } from 'vuex'
import RankingList from './comps/RankingList'
export default {
  name: '',
  components: {
    RankingList,
  },
  data () {
    return {
      model: {
        areaName: '',
      },
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
      activeLabel: '今日',
      rankList: [],
    }
  },
  computed: {
    ...mapGetters(['OS', 'areaList']),
  },
  created: function () {
    this.getRank()
  },
  methods: {
    getRank () {
      this.$api[this.timeRange[this.activeLabel].method](this.model).then(data => {
        this.rankList = data
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
