<template lang='pug'>
.RechargePlayer
  .fs-m.ai-center.bg-white.pd2
    el-form.ff-rw.mgt2.ai-center(label-width='100px')
      el-form-item(label='部门:' label-width='60px')
        tree-selector.winput(
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          @change='onDepartChange'
        )
      el-form-item(label='充值玩家:' label-width='90px')
        el-input.winput(v-model='model.userAccount')
      el-form-item(label='游戏角色:' label-width='90px')
        el-input.winput(v-model='model.roleName')
      el-form-item(label='游戏名称:' label-width='90px')
        auto-complete(v-model='model.gameName', :data='gameList')
      el-form-item(label='区服:' label-width='60px')
        auto-complete(v-model='model.areaName', :data='areaList')
      el-form-item(label='时间:' label-width='60px')
        CommonDatePicker.winput(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          @change='search()',
          all
        )
      el-form-item(label-width='0px')
        el-button.mgl3(
          icon='el-icon-search',
          type='primary',
          @click='getPlRchgRecord'
        ) 搜索
        el-button.mgl2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置

  el-table.mgy2.bg-white(:data='playerList')
    el-table-column(prop='userCode', label='玩家ID')
    el-table-column(prop='gameOrderID', label='消费订单号')
    el-table-column(prop='totalPrice', label='支付金额(元)')
      template(slot-scope='{ row }') {{ row.totalPrice | toFixed }}
    el-table-column(prop='gameName', label='游戏名称')
    el-table-column(prop='areaName', label='区服')
    el-table-column(prop='roleName', label='游戏角色')
    el-table-column(prop='payDate', label='支付时间')
      template(slot-scope='{ row }') {{ row.payDate | dateFormat }}
  el-pagination.margin-spacing(
    :total='playerList.length',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getPlRchgRecord'
  )
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RechargePlayer',
  data () {
    return {
      model: {
        roleName: '',
        gameName: '',
        areaName: '',
        startTime: '',
        endTime: '',
        userAccount: '',
        page: 1,
        pageSize: 10,
      },
      playerList: [],
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList']),
  },
  methods: {
    getPlRchgRecord () {
      if (this.model.userAccount === '') {
        this.$vgo.tip('请选择玩家', 'warning')
        return
      }
      this.$utils.autoFillDateTime(this.model)
      const params = JSON.parse(JSON.stringify(this.model))
      this.$utils.filterNull(params)
      this.$api.getPlRchgRecord(params).then(res => {
        this.playerList = res.list
      })
    },
    reset () {
      for (const key in this.model) {
        if (key !== 'userAccount') {
          this.model[key] = ''
        }
      }
      this.model.page = 1
      this.model.pageSize = 10
      this.getPlRchgRecord()
    },
    onDepartChange (dtpId) {
      this.$vgo.tip('部门ID是' + dtpId, 'success')
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
