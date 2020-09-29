<template lang='pug'>
  .ranking-list.w400.pd2
    .title
      h2.fc-w3 云梦总公司
      h2 客流岗业绩排行榜
    .sub-title.jc-center.mgt3
      h3.fc-w3 客流岗678人
    .my-ranking.ff-cn.h70.mgt3
      .ff-rn.jc-between.pdx3.title
        p.pd1.flex-center.border-radius.pd2 我的排名
        p.pd1.flex-center.border-radius.pd2 累计充值金额(元)
      .ff-rn.ai-center.pr
        h3.fs-l.mgl4 236
        p.fs-l.mgl2 何元生
        h3.fs-m.pa.warning(:style="{ right: '40px' }") 688.00
    .ranking.mgt3.overflow-auto.ff-cn.pr
      .item.ff-rn(v-for="(item,idx) in dataList" :key="idx")
        .ai-center
          h3.fs-l.mgl4.w30.warning {{idx + 1}}
          p.fs-l.mgl2 {{item.name}}
          h3.fs-m.pa.warning(:style="{ right: '40px' }") {{item.totalPrice | formatNumber}}
</template>
<script>
export default {
  name: '',
  props: {
  },
  data () {
    return {
      dataList: [],
    }
  },
  computed: {
  },
  created: function () {
    const item = {
      name: '王磊',
      totalPrice: '666699.55',
    }
    let count = 20
    while (count-- > 0) {
      this.dataList.push(item)
    }
  },
  methods: {
  },
}
</script>
<style lang='stylus' scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.ranking-list
  background-color gold
  border-radius 14px
  .my-ranking
    background-color #f0f0f0
    border-radius 14px
    .title p
      height 25px
      background-color orange
      color white
      border-radius 16px
      transform translateY(-@height/2)
  .ranking
    height 400px
    background-color #FDF5E6
    border-radius 14px
    .item
      height 40px
</style>
