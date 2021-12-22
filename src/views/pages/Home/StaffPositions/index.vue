<template lang="pug">
  .staffPositions
    el-form.ff-rn.bg-white.pdt2.pdx2(label-width='70px')
      el-form-item(label='部门:', v-if='userInfo.isLeader')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:', v-if='userInfo.isLeader')
        el-select.winput(
          v-model='model.userId',
          placeholder='请选择',
          clearable,
          filterable
        )
          el-option(
            v-for='item in userList',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
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
      el-table(
        :data='configList'
      )
        el-table-column(prop='aUserName', label='推广员')
        el-table-column(prop='bUserName', label='员工状态')
        el-table-column(prop='cUserName', label='岗位')
        el-table-column(prop='startTime', label='新增流水')
        el-table-column(prop='startTime', label='共享换包数')
        el-table-column(prop='startTime', label='后续流水')
        el-table-column(prop='startTime', label='换包数')
        el-table-column(prop='startTime', label='天数')
        el-table-column(prop='startTime', label='绑定销售岗人数')
        el-table-column(prop='startTime', label='共享人')
      el-pagination.margin-spacing(
        :total='10',
        :page-size.sync='model.pageSize',
        :current-page.sync='model.page',
        @current-change='getListMixin'
      )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      depData: [],
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        UserCode: '',
        FromAccount: '',
        ToAccount: '',
        Type: '',
        PageSize: 10,
        Page: 1,
      },
      configList: [],
      radio3: 1,
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
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
