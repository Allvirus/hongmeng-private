<template lang='pug'>
  .MyLevel
    h3 我的等级
    .info.mgt2
      .bg-white.pd2
        .ff-rn.ai-center
          span 累计经验值 {{userInfo.experiences}}
          //- el-button.mgl3.fs-m(type="text" @click="showDetailExp") 经验值明细
        .ff-rn.mgt2
          span {{levelInfo[0].levelName}}
          .pr
            el-progress.mgx2.w300(:text-inside="true" :show-text="false" :stroke-width="20" :percentage="expPercent")
            p.flex-center.pac(:style="{ color: '#000000' }") {{userInfo.experiences}}/{{levelInfo[1].experience}}
          span {{levelInfo[1].levelName}}
    .tables
      .ff-rn
        .flex-1.pd1
          h3.mgt3 等级权益说明
          el-table.mgy2(:data='levelInfo')
            el-table-column(prop="levelName" label="等级名称")
            el-table-column(prop="experience" label="经验")
            el-table-column(prop="commission" label="提成")
            el-table-column(prop="basicSalary" label="等级工资")

        .flex-1.pd1.exp-table
          h3.mgt3 换包经验值获取
          el-table.mgy2(:data='levelInfo')
            el-table-column(prop="levelName" label="等级名称" width="80")
            el-table-column(prop="ajobAndroidExp" label="A岗Android换包经验")
            el-table-column(prop="ajobIOSExp" label="A岗iOS换包经验" )
            el-table-column(prop="bjobAndroidExp" label="B岗Android换包经验")
            el-table-column(prop="bjobIOSExp" label="B岗iOS换包经验")
      .ff-rn
        .flex-1.pd1
          h3.mgt1 提成起点
          el-table.mgy2(:data='commission')
            el-table-column(prop="job" label="岗位")
            el-table-column(prop="custom" label="客流岗")
            el-table-column(prop="guide" label="引导岗")
            el-table-column(prop="accompany" label="陪玩岗")

        .flex-1.pd1
          h3.mgt1 流水经验值获取
          el-table.mgy2(:data='experience')
            el-table-column(prop="job" label="岗位")
            el-table-column(prop="custom" label="客流岗")
            el-table-column(prop="guide" label="引导岗")
            el-table-column(prop="accompany" label="陪玩岗")
    .tips
      p 一、经验值规则
      p 1、玩家充值是增加经验值的主要来源，暂定为1元等于1点经验值（当天新服），后续第天以后的充值为2元等于1点经验值（具体按等级制度计算）。
      p 2、新创角玩家（注册新设备，新IP）暂定为增加1个ISO等于50点经验值，安卓等于30点经验值（具体按等级制度计算）。
      p 3、培训新员工期间，新员工产生的经验值算师父的，新员工试用期满足条件后单独开后台，新员工转正后师父增加经验值500点。
      p 4、有对公司做出特殊贡献，上级确认后可增加经验值。
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyLevel',
  data () {
    return {
      commission: [
        {
          job: '提成起点',
          custom: '当月总流水≥10000',
          guide: '当月总流水≥40000',
          accompany: '当月总流水≥40000',
        },
      ],
      experience: [
        {
          job: '流水经验值折算系数',
          custom: '1',
          guide: '0.5',
          accompany: '0.7',
        },
      ],
      levelInfo: [
        {
          levelName: '',
        },
        {
          levelName: '',
          experience: '',
        },
      ],
      expPercent: 0,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    this.getMyLevel()
    console.log('create', this.userInfo)
  },
  methods: {
    getMyLevel () {
      this.$api.getMyLevel().then(res => {
        this.levelInfo = res
        this.calcPercent()
      })

      this.$api.getMyLevInfo().then(data => {
      })
    },
    calcPercent () {
      const curExp = this.userInfo.experiences
      const curLevMaxExp = this.levelInfo[0].experience
      const nexLevMaxExp = this.levelInfo[1].experience
      this.expPercent = ((curExp - curLevMaxExp) / (nexLevMaxExp - curLevMaxExp)) * 100
    },
    showDetailExp () {
      this.$vgo.tip('待实现!', 'success')
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyLevel
  >>>.exp-table .cell
    width 150px !important
    white-space nowrap
  .exp-box
    width 200px
    height 100px
  .tips p
    line-height 25px
</style>
