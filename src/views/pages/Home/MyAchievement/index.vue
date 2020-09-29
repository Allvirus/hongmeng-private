<template lang='pug'>
.MyAchievement
  //- 查询条件
  .condition.pd2.bg-white
    .btn-group.pdl3
      el-radio-group(v-model='selTimeRange', @change='onRadioChange')
        el-radio-button(
          v-for='(item, index) in timeRange',
          :key='index',
          :label='item'
        )
    .ff-rn.fs-m.ai-center.mgt2
      label 游戏名称:
      el-select.mgl1(v-model='selGame', placeholder='请选择')
        el-option(
          v-for='item in gameOpts',
          :key='item.value',
          :label='item.label',
          :value='item.value'
        )
      label.mgl3 区服名称:
      el-select.mgl1(v-model='selServ', placeholder='请选择')
        el-option(
          v-for='item in servOpts',
          :key='item.value',
          :label='item.label',
          :value='item.value'
        )
      el-button.mgl3(icon='el-icon-search', type='primary', @click='search') 搜索
      el-button(icon='el-icon-refresh-right', type='primary', @click='reset') 重置

  //- 创角指数
  .data-panel.mgt2.ff-rn
    data-box.mgl2(
      :data='item',
      :colIdx='idx',
      v-for='(item, idx) in dbList',
      :key='idx'
    )
  //- 图表
  .mgt3
    .chart(
      :class='halfLayout ? "ff-rn" : "ff-cn"',
      :key='halfLayout ? "half" : "full"'
    )
      .ff-cn.flex-1(:class='halfLayout ? "mgr2" : ""')
        h2 推广数据
        v-histogram.charts.bg-white.border-radius.flex-1.mgt2(
          :settings='newRoleData.option',
          :data='newRoleData'
        )
      .ff-cn.flex-1(:class='halfLayout ? "" : "mgt2"')
        h2 充值总额
        v-line.charts.bg-white.border-radius.flex-1.mgt2(:data='rechData')

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop="userAccount" label="用户账号")
    el-table-column(prop="userCode" label="玩家代码")
    el-table-column(prop="gameName" label="游戏名称")
    el-table-column(prop="areaName" label="区服")
    el-table-column(prop="roleName" label="游戏角色")
    el-table-column(prop="payDate" label="支付时间")
      template(slot-scope="{ row }") {{row.payDate | dateFormat}}
    el-table-column(prop="totalPrice" label="充值总额")
  el-pagination.margin-spacing(
    :total="listMixin.count"
    :page-size.sync='model.pageSize'
    :current-page.sync='model.page'
    @current-change="getListMixin")

</template>

<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyAchievement',
  components: {
    VLine: () => import('v-charts/lib/line.common'),
    VHistogram: () => import('v-charts/lib/histogram.common'),
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getAchiData',
      model: {
        page: 1,
        pageSize: 10,
      },
      timeRange: ['今日', '本周', '本月', '全年'],
      selTimeRange: '今日',
      selGame: '',
      rechData: {
        columns: ['日期', '充值总额'],
        rows: [
          { 日期: '1/1', 充值总额: 1393 },
          { 日期: '1/2', 充值总额: 3530 },
          { 日期: '1/3', 充值总额: 2923 },
          { 日期: '1/4', 充值总额: 1723 },
          { 日期: '1/5', 充值总额: 3792 },
        ],
      },
      newRoleData: {
        option: {
          title: {
            text: 'Main Title',
            subtext: 'Sub Title',
            left: 'center',
            top: 'center',
            textStyle: {
              fontSize: 30,
            },
            subtextStyle: {
              fontSize: 20,
            },
            show: true,
          },
        },
        columns: ['日期', '创角数', '创角用户'],
        rows: [
          { 日期: '1/1', 创角数: 1393, 创角用户: 1093 },
          { 日期: '1/2', 创角数: 3530, 创角用户: 3230 },
          { 日期: '1/3', 创角数: 2923, 创角用户: 2623 },
          { 日期: '1/4', 创角数: 1723, 创角用户: 1423 },
          { 日期: '1/5', 创角数: 3792, 创角用户: 3492 },
          { 日期: '1/6', 创角数: 4593, 创角用户: 4293 },
          { 日期: '1/1', 创角数: 1393, 创角用户: 1093 },
        ],
      },
      gameOpts: [
        {
          value: 'game1',
          label: '王者荣耀',
        },
        {
          value: 'game2',
          label: '绝地求生',
        },
      ],
      selServ: '',
      servOpts: [
        {
          value: 'gx',
          label: '广西',
        },
        {
          value: 'hn',
          label: '湖南',
        },
      ],
      dbList: [
        {
          title: '创角数',
          value: 12600,
          increase: false,
          rate: 35,
        },
        {
          title: '收益',
          value: 65550,
          increase: true,
          rate: 48,
        },
      ],
    }
  },
  computed: {
    halfLayout () {
      return this.selTimeRange === '本周'
    },
  },
  created () {
  },
  methods: {
    search () {
      this.$vgo.tip('开始搜索 ' + this.time, 'success')
    },
    reset () {
      this.$vgo.tip('已重置', 'success')
    },
    onRadioChange (val) {
      console.log('onRaidoChange', val, this.selTimeRange)
    },
  },
}
</script>

<style lang="stylus" scoped>
$spc = 44px

.MyAchievement
  .condition
    .btn-group
      border-bottom 1px solid #0487FF
</style>
