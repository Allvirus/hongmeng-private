<template lang='pug'>
  .MyLevel.pd3
    h3 我的等级
    .info
      .ff-rn.pd2.bg-white.mgt2
        span 青铜五
        el-progress(:text-inside="true" :stroke-width="26" :percentage="70")
        span 青铜四
      .ff-rn.mgt2
        .exp-box.bg-white.pd3
          .jc-between
            span 累计经验值
            a.hand 经验值明细
          h2.mgt3.jc-center.warning 88888
        .exp-box.bg-white.pd3.mgl2
          .jc-between
            span 今日经验值
            span 较昨日89
          h2.mgt3.jc-center.warning 360
    .tables
      .level-rights
        h3.mgt3 等级权益说明
        el-table.mgy2(:data='rightsInfo')
                  el-table-column(prop="created" label="等级")
                  el-table-column(prop="amount" label="所需经验")
                  el-table-column(prop="type_text" label="提成")
                  el-table-column(prop="remark" label="等级工资")

      .level-rights
        h3.mgt3 提成起点
        el-table.mgy2(:data='rightsInfo')
                  el-table-column(prop="created" label="岗位")
                  el-table-column(prop="amount" label="岗位客流")
                  el-table-column(prop="type_text" label="引导岗")
                  el-table-column(prop="remark" label="陪玩岗")

      .level-rights
        h3.mgt3 换包经验值获取
        el-table.mgy2(:data='rightsInfo')
                  el-table-column(prop="created" label="等级")
                  el-table-column(prop="amount" label="A岗Android换包经验")
                  el-table-column(prop="type_text" label="A岗iOS换包经验")
                  el-table-column(prop="remark" label="B岗Android换包经验")
                  el-table-column(prop="type_text" label="B岗iOS换包经验")

      .level-rights
        h3.mgt3 流水经验值获取
        el-table.mgy2(:data='rightsInfo')
                  el-table-column(prop="created" label="岗位")
                  el-table-column(prop="amount" label="岗位客流")
                  el-table-column(prop="type_text" label="引导岗")
                  el-table-column(prop="remark" label="陪玩岗")
</template>
<script>
export default {
  name: 'MyLevel',
  data () {
    return {
      rightsInfo: [],
    }
  },
}
</script>
<style lang='stylus' scoped>

.MyLevel
  .exp-box
    width 200px
    height 100px
</style>
