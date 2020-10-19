<template lang='pug'>
.MyExp
  .ff-rn.fs-m.ai-center.mgt2.bg-white.pdx2.pdt2
    el-form.ff-rw(label-width='100px')
      el-form-item(label='部门:', v-show="false")
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:' v-if='userInfo.isLeader')
        el-select.winput(v-model='model.UserId', placeholder='请选择', clearable)
          el-option(
            v-for='item in userList',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
          )
      el-form-item(label='经验来源:')
        el-input.winput(v-model='model.Origin')
      el-form-item(label='经验值:')
        el-input.winput(v-model='model.ExpChange' type="number")
      el-form-item(label='创建时间:')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(icon='el-icon-search', type='primary', @click='searchExp') 搜索
        el-button.mgl2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userRealName', label='用户名称')
    el-table-column(prop='origin', label='经验来源')
    el-table-column(prop='expChange', label='经验值')
      template(slot-scope='{ row }')
        span.danger +{{ row.expChange }}
    el-table-column(prop='createTime', label='创建时间')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(prop='effectiveDate', label='有效期')
      template(slot-scope='{ row }') {{ row.effectiveDate | dateFormat }}
    el-table-column(prop='remark', label='备注')
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'ExpDetail',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptExpList',
      dtpApi: 'getDptExpList',
      myApi: 'getMyExp',
      model: {
        startTime: '',
        endTime: '',
        UserId: '',
        Origin: '',
        ExpChange: '',
        resDepId: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo']),
  },
  created () {
    this.$api.getMyExp(this.model).then(data => {
      console.log('myexp =', data)
    })
  },
  methods: {
    reset () {
      this.listApiForMixin = this.dtpApi
      this.model = JSON.parse(JSON.stringify(this.modelCopyMixin))
      this.model.resDepId = this.myDptList.list[0].id
      this.getListMixin()
    },
    searchExp () {
      this.listApiForMixin = (this.model.UserId === '') ? this.myApi : this.dtpApi
      this.$utils.autoFillDateTime(this.model)
      this.getListMixin()
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
