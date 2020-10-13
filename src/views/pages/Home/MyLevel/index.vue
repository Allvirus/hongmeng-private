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
      .level-rights
        h3.mgt3 等级权益说明
        el-table.mgy2(:data='levelInfo')
          el-table-column(prop="levelName" label="等级名称")
          el-table-column(prop="experience" label="经验")
          el-table-column(prop="commission" label="提成")
          el-table-column(prop="remabasicSalaryrk" label="等级工资")

      .level-rights
        h3.mgt3 提成起点
        el-table.mgy2(:data='commission')
          el-table-column(prop="job" label="岗位")
          el-table-column(prop="custom" label="客流岗")
          el-table-column(prop="guide" label="引导岗")
          el-table-column(prop="accompany" label="陪玩岗")

      .level-rights
        h3.mgt3 换包经验值获取
        el-table.mgy2(:data='levelInfo')
          el-table-column(prop="levelName" label="等级名称")
          el-table-column(prop="ajobAndroidExp" label="A岗Android换包经验")
          el-table-column(prop="ajobIOSExp" label="A岗iOS换包经验")
          el-table-column(prop="bjobAndroidExp" label="B岗Android换包经验")
          el-table-column(prop="bjobIOSExp" label="B岗iOS换包经验")

      .level-rights
        h3.mgt3 流水经验值获取
        el-table.mgy2(:data='experience')
          el-table-column(prop="job" label="岗位")
          el-table-column(prop="custom" label="客流岗")
          el-table-column(prop="guide" label="引导岗")
          el-table-column(prop="accompany" label="陪玩岗")
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
          custom: '当月总流水≥15000',
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
  .exp-box
    width 200px
    height 100px
</style>
