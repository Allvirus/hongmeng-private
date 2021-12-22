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
      el-form-item(label-width="20px")
        el-select(v-model="typeId" placeholder="请选择数据")
          el-option(
            v-for="item in listData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            )
      el-form-item(:class='OS.isPc ? "" : "jc-center full"')
        el-button.mgl2(icon='el-icon-search', type='primary', @click='getRank') 搜索
    .rank(:class='OS.isPc ? "ff-rn jc-around mgt1" : ""')
      ranking-list(
        :data='typeId === 1 ? rankList.ajobMoneyRank : rankList.ajobRegRank',
        :mainTitle='typeId === 1 ? "A岗充值排行榜" : "A岗共享换包排行"',
        :subTitle='typeId === 1 ? "充值金额(元)" : "换包数"',
        theme='orange',
        :toFixed='true',
        :rankingKey='typeId === 1 ? "totlaMoney" : "count"'
      )
      //- ranking-list(
      //-   :data='rankList.ajobRegRank',
      //-   mainTitle='A岗注册创角排行榜',
      //-   subTitle='注册人数',
      //-   theme='orange',
      //-   rankingKey='count'
      //- )
      ranking-list(
        :data='typeId === 1 ? rankList.bjobMoneyRank : rankList.bjobRegRank',
        :mainTitle='typeId === 1 ? "B岗充值排行榜" : "B岗共享换包排行"',
        :subTitle='typeId === 1 ? "充值金额(元)" : "换包数"',
        theme='green',
        :rankingKey='typeId === 1 ? "totlaMoney" : "count"'
      )
      ranking-list(
        v-show="typeId === 1"
        :data='rankList.cjobMoneyRank',
        :mainTitle='typeId === 1 ? "C岗充值排行榜" : "C岗共享换包排行"',
        :subTitle='typeId === 1 ? "充值金额(元)" : "换包数"',
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
      listData: [
        {
          name: '总业绩',
          id: 1,
        },
        {
          name: '换包数',
          id: 2,
        },
      ],
      model: {
        areaName: '',
      },
      typeId: 1,
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
