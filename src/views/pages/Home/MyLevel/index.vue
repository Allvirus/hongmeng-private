<template lang='pug'>
.MyLevel
  h3 我的等级
  .mgt2
    .bg-white.pd2
      .ff-rn.ai-center
        p.fs-b 累计经验值 {{ displayCurrentExperience }}
      .ff-rn.mgt2.ai-center(:class='OS.isPc ? "" : "jc-center"')
        p {{ displayCurrentLevelName }}
        .pr
          el-progress.mgx2(
            :class='OS.isPc ? "w300" : "w200"',
            :text-inside='true',
            :show-text='false',
            :stroke-width='OS.isPc ? 20 : 15',
            :percentage='expPercent'
          )
          p.flex-center.pac(:style='{ color: "#000000" }') {{ displayCurrentExperience }}/{{ displayNextLevelNeedExperience }}
        p {{ displayNextLevelName }}
  .tables
    .tab(:class='OS.isPc ? "ff-rn" : "ff-cn"')
      .flex-1.pd1
        h3.mgt2 等级权益说明
        el-table.mgy2(:data='levelInfo')
          el-table-column(prop='levelName', label='等级名称')
          el-table-column(prop='experience', label='经验')
          el-table-column(prop='commission', label='提成')
          el-table-column(prop='basicSalary', label='等级工资')

    h3.mgt2 岗位提成起点与系数
      el-table.mgy2(:data='[1]')
        el-table-column(
          prop='',
          :label='item.configType',
          v-for='(item, index) in commission',
          :key='item',
          v-if='labelList[item.configType]'
        )
          template(slot-scop='{ row }') {{ item.context }}

    h3.mgt2 经验值获取
    el-table.mgy2(:data='levelInfo')
      el-table-column(prop='levelName', label='等级名称', width='80')
      el-table-column(prop='ajobAndroidExp', label='A岗Android换包经验')
      el-table-column(prop='ajobIOSExp', label='A岗iOS换包经验')
      el-table-column(prop='bjobAndroidExp', label='B岗Android换包经验')
      el-table-column(prop='bjobIOSExp', label='B岗iOS换包经验')
      el-table-column(prop='ajobRechargeExp', label='A岗充值比例经验(新服)')
      el-table-column(prop='ajobRechargeExpAfter', label='A岗充值比例经验(后续)')
      el-table-column(prop='bjobRechargeExp', label='B岗充值比例经验(新服)')
      el-table-column(prop='bjobRechargeExpAfter', label='B岗充值比例经验(后续)')
      el-table-column(prop='cjobRechargeExp', label='C岗充值比例经验(新服)')
      el-table-column(prop='cjobRechargeExpAfter', label='C岗充值比例经验(后续)')

  .tips
    h3.mgt3 {{ ruleText.configType }}
    p.mgt2(v-html='ruleText.context')
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MyLevel',
  data () {
    return {
      commission: [],
      levelInfo: [
        {
          levelName: '',
          experience: 0,
        },
        {
          levelName: '',
          experience: 0,
        },
      ],
      levelProgress: {
        currentLevelName: '',
        currentExperience: 0,
        nextLevelName: '',
        nextLevelNeedExperience: 0,
      },
      expPercent: 0,
      ruleText: {},
      labelList: {
        'A岗等级(客流岗流水)': true,
        'B岗等级(引导岗流水)': true,
        'C岗等级(陪玩岗流水)': true,
        'A岗(客流岗提成系数)': true,
        'B岗(引导岗提成系数)': true,
        'C岗(陪玩岗提成系数)': true,
        A岗Android经验值: true,
        A岗IOS经验值: true,
        B岗Android经验值: true,
        B岗IOS经验值: true,
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'OS']),
    displayCurrentExperience () {
      return this.levelProgress.currentExperience || this.userInfo.experiences || 0
    },
    displayCurrentLevelName () {
      return this.levelProgress.currentLevelName || (this.levelInfo[0] && this.levelInfo[0].levelName) || ''
    },
    displayNextLevelName () {
      return this.levelProgress.nextLevelName || (this.levelInfo[1] && this.levelInfo[1].levelName) || ''
    },
    displayNextLevelNeedExperience () {
      return this.levelProgress.nextLevelNeedExperience || (this.levelInfo[1] && this.levelInfo[1].experience) || 0
    },
  },
  created: function () {
    this.getMyLevel()
  },
  methods: {
    getMyLevel () {
      this.$api.getMyLevel().then(res => {
        this.levelInfo = Array.isArray(res) ? res : this.levelInfo
        this.syncLevelProgressFromLegacy()
        this.calcPercent()
      })

      this.$api.getMyLevelDetail().then(res => {
        this.levelProgress = this.normalizeLevelProgress(res)
        this.calcPercent()
      }).catch(() => {
        this.syncLevelProgressFromLegacy()
        this.calcPercent()
      })

      this.$api.getMyLevInfo().then(data => {
        data.map((item) => {
          if (item.configType === '等级(经验值规则)') {
            this.ruleText = item
          }
        })
        this.commission = data
      })
    },
    normalizeLevelProgress (data = {}) {
      return {
        currentLevelName: data.currentLevelName || '',
        currentExperience: data.currentExperience || this.userInfo.experiences || 0,
        nextLevelName: data.nextLevelName || '',
        nextLevelNeedExperience: data.nextLevelNeedExperience || 0,
      }
    },
    syncLevelProgressFromLegacy () {
      this.levelProgress = {
        currentLevelName: (this.levelInfo[0] && this.levelInfo[0].levelName) || '',
        currentExperience: this.userInfo.experiences || 0,
        nextLevelName: (this.levelInfo[1] && this.levelInfo[1].levelName) || '',
        nextLevelNeedExperience: (this.levelInfo[1] && this.levelInfo[1].experience) || 0,
      }
    },
    calcPercent () {
      const curExp = Number(this.displayCurrentExperience || 0)
      const curLevMaxExp = Number((this.levelInfo[0] && this.levelInfo[0].experience) || 0)
      const nexLevMaxExp = Number(this.displayNextLevelNeedExperience || 0)

      if (!nexLevMaxExp || nexLevMaxExp <= curLevMaxExp) {
        this.expPercent = 0
        return
      }

      const percent = ((curExp - curLevMaxExp) / (nexLevMaxExp - curLevMaxExp)) * 100
      this.expPercent = Math.max(0, Math.min(100, percent))
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyLevel {
  >>>.exp-table .cell {
    width: 150px !important;
    white-space: nowrap;
  }

  .exp-box {
    width: 200px;
    height: 100px;
  }

  .tips p {
    line-height: 25px;
  }
}
</style>
