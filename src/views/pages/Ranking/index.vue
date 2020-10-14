<template lang='pug'>
.Ranking
  .condition
    .bg-white.pd2
      .btn-group
        el-radio-group(v-model='selLabel', @change='getRank')
          el-radio-button(
            v-for='(item, index) in timeRange',
            :key='index',
            :value='index',
            :label='item.label'
          )
    .ff-rn.jc-around.mgt3
      ranking-list(
        :data='rankList.downloadRank',
        mainTitle='下载排行榜',
        subTitle='下载量'
        theme="blue"
        rankingKey="count"
      )
      ranking-list(
        :data='rankList.registerRank',
        mainTitle='注册排行榜',
        subTitle='注册数量'
        theme="green"
        rankingKey="count"
      )
      ranking-list(
        :data='rankList.moneyRank',
        mainTitle='充值排行榜',
        subTitle='充值金额(元)'
        theme="orange"
        rankingKey="totlaMoney"
      )

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
      })
    },
    fillFakeData () {
      let count = 10
      while (count-- > 0) {
        const item = {
          account: 'lgy0808',
          count: count * 10,
          avatarUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602244834651&di=8a64567985c8b88137bbf1a63b5caba6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180313%2Fab29d548f2a54e2c81663261d4a11af0.jpeg',
        }
        this.rankList.downloadRank.push(item)
        this.rankList.moneyRank.push(item)
        this.rankList.registerRank.push(item)
      }
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
