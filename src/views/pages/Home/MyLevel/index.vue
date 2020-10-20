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
          h3.mgt3 流水经验值获取
          el-table.mgy2(:data='experience' v-if="levData.length > 0")
            el-table-column(prop="job" label="岗位")
            el-table-column(prop="custom" label="客流岗流水经验")
            el-table-column(prop="guide" label="引导岗流水经验")
            el-table-column(prop="accompany" label="陪玩岗流水经验")

      h3.mgt3 换包经验值获取
      el-table.mgy2(:data='levelInfo')
        el-table-column(prop="levelName" label="等级名称" width="80")
        el-table-column(prop="ajobAndroidExp" label="A岗Android换包经验")
        el-table-column(prop="ajobIOSExp" label="A岗iOS换包经验" )
        el-table-column(prop="bjobAndroidExp" label="B岗Android换包经验")
        el-table-column(prop="bjobIOSExp" label="B岗iOS换包经验")
        el-table-column(prop="ajobRechargeExp" label="A岗充值比经验(新服)")
        el-table-column(prop="ajobRechargeExpAfter" label="A岗充值比经验(后续)")
        el-table-column(prop="bjobRechargeExp" label="B岗充值比经验(新服)")
        el-table-column(prop="bjobRechargeExpAfter" label="B岗充值比经验(后续)")
        el-table-column(prop="cjobRechargeExp" label="C岗充值比经验(新服)")
        el-table-column(prop="cjobRechargeExpAfter" label="C岗充值比经验(后续)")

      h3.mgt1 提成起点
      el-table.mgy2(:data='commission' v-if="levData.length > 0")
        el-table-column(prop="job" label="岗位")
        el-table-column(prop="custom" label="客流岗流水经验")
        el-table-column(prop="guide" label="引导岗流水经验")
        el-table-column(prop="accompany" label="陪玩岗流水经验")

    .tips(v-if="levData.length > 0")
      h3.mgt3 {{levData[6].configType}}
      p.mgt2(v-html="levData[6].context")

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
          custom: '',
          guide: '',
          accompany: '',
        },
      ],
      experience: [
        {
          job: '流水经验值折算系数',
          custom: '',
          guide: '',
          accompany: '',
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
      levData: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    this.getMyLevel()
  },
  methods: {
    getMyLevel () {
      this.$api.getMyLevel().then(res => {
        this.levelInfo = res
        this.calcPercent()
      })

      this.$api.getMyLevInfo().then(data => {
        this.commission[0].custom = data[0].context
        this.commission[0].guide = data[1].context
        this.commission[0].accompany = data[2].context

        this.experience[0].custom = data[3].context
        this.experience[0].guide = data[4].context
        this.experience[0].accompany = data[5].context

        this.levData = data
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
