<template lang="pug">
  .ResultsOv
    el-form.ff-rn.bg-white.pdt2.pdx2(label-width='70px')
      el-form-item(label='部门:', required)
        el-select(v-model="model.depId" placeholder="请选择部门")
          el-option(
            v-for="item in depData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            )
      el-form-item.mgl3(label='选择时间:' label-width='80px')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(
          icon='el-icon-search',
          type='primary',
        ) 搜索
    .showbox.bg-white.mgt2.pd2
      el-radio-group.mgb2(v-model="radio3" size="small")
        el-radio-button(:label="item.id" v-for="item in SFArr" :key="item.id") {{ item.name }}
      el-table.mgy2(
        :data='configList',
      )
        el-table-column(prop='aUserName', label='小组名称')
        el-table-column(prop='bUserName', label='业务人员/在职人数/离职人数' width="180px")
        el-table-column(prop='cUserName', label='注册数/独立IP注册')
        el-table-column(prop='startTime', label='换包数' width="60px")
        el-table-column(prop='startTime', label='共享换包数')
        el-table-column(prop='startTime', label='总登记数/重复登记数/转化率' width="180px")
        el-table-column(prop='startTime', label='总拉黑数' width="70px")
        el-table-column(prop='startTime', label='玩家充值数' width="80px")
        el-table-column(prop='startTime', label='总充值金额')
        el-table-column(prop='startTime', label='客服岗共享充值')
        el-table-column(prop='startTime', label='后勤岗位')
</template>
<script>
export default {
  data () {
    return {
      depData: [],
      model: {
        depId: '',
        startTime: '',
        endTime: '',
      },
      configList: [],
      radio3: 1,
      SFArr: [
        {
          name: '充值金额',
          id: 1,
        },
        {
          name: '客服岗共享充值',
          id: 2,
        },
        {
          name: '后勤岗共享充值',
          id: 3,
        },
        {
          name: '总登记数',
          id: 4,
        },
        {
          name: '换包数',
          id: 5,
        },
        {
          name: '共享换包数',
          id: 6,
        },
      ],
    }
  },
  mounted () {
    this.getdefData()
  },
  methods: {
    getdefData () {
      this.$api.getAllDeparts().then(res => {
        this.depData = res
      })
    },
  },
}
</script>
<style lang="stylus" scoped>

</style>
