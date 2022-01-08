<template lang='pug'>
.switch-bind
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='100px')
      el-form-item(label='玩家代码:')
        el-input.winput(
          v-model='model.UserCode',
          placeholder='请输入玩家代码',
          clearable
        )
      el-form-item(label-width='20px')
        el-button(type='warning', @click='swBindDlg = true') 玩家换绑
        el-button.mgl3(
          icon='el-icon-search',
          type='primary',
          @click='getListMixin'
        ) 搜索
        el-button.mgl2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='resetPageMixin'
        ) 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    //- el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='userCode', label='玩家代码')
    el-table-column(prop='aJob', label='A岗(换绑前)')
    el-table-column(prop='bJob', label='B岗(换绑前)')
    el-table-column(prop='cJob', label='C岗(换绑前)')
    el-table-column(prop='aJobAfter', label='A岗(换绑后)')
    el-table-column(prop='bJobAfter', label='B岗(换绑后)')
    el-table-column(prop='cJobAfter', label='C岗(换绑后)')
    el-table-column(prop='switchTime', label='创建时间' width="150px")
      template(slot-scope='{ row }') {{ row.switchTime | dateFormat }}
    el-table-column(prop='targetTime', label='换绑时间' width="160px")
      template(slot-scope='{ row }') {{ row.targetTime | dateFormat }}
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.PageSize',
    :current-page.sync='model.Page',
    @current-change='getListMixin'
  )

  el-dialog(
    title='玩家换绑',
    @close='cancelBind',
    :visible.sync='swBindDlg',
    width='600px'
  )
    el-form(label-width='100px')
      el-form-item(label='玩家代码:', required)
        el-input(
          v-model='swBindParams.userCode',
          @change='onUserAccountChange',
          placeholder='请输入玩家账号',
          clearable
        )
      el-form-item(label='A岗(当前):', required)
        p {{ swBindParams.aJob }}
      el-form-item(label='B岗(当前):')
        p {{ swBindParams.bJob }}
      el-form-item(label='C岗(当前):')
        p {{ swBindParams.cJob }}
      el-form-item(label='A岗(新):', required)
        el-select(
          v-model='swBindParams.aJobIdAfter',
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
      el-form-item(label='B岗(新):', required)
        el-select(
          v-model='swBindParams.bJobIdAfter',
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
      el-form-item(label='C岗(新):', required)
        el-select(
          v-model='swBindParams.cJobIdAfter',
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
      el-form-item(label='换绑时间', required)
        el-date-picker(type="datetime" placeholder="选择日期时间" :end-placeholde="swBindParams.targetTime"  v-model="swBindParams.targetTime" :picker-options="pickerOptions")
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancelBind') 取消
      el-button.mgl3(type='primary', @click='commitSwBind') 提交
</template>

<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'SwitchBind',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getBindChangeList',
      model: {
        UserCode: '',
        Page: 1,
        PageSize: 10,
      },
      swBindParams: {
        userCode: '',
        aJobId: '',
        aJob: '',
        bJobId: '',
        bJob: '',
        cJobId: '',
        cJob: '',
        aJobIdAfter: '',
        bJobIdAfter: '',
        cJobIdAfter: '',
        targetTime: '',
      },
      userList: [],
      swBindDlg: false,
      originBind: {},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        },
      },
    }
  },
  created () {
    this.$api.getDepartMembers(1).then(data => {
      this.userList = data
    })
  },
  methods: {
    delRecord (row) {
      this.$vgo.open(() => {
        this.$api.delBindRec(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.getListMixin()
        })
      })
    },
    cancelBind () {
      this.swBindDlg = false
      for (const key in this.swBindParams) {
        this.swBindParams[key] = ''
      }
    },
    commitSwBind () {
      for (const key in this.swBindParams) {
        if (this.swBindParams[key] === '') {
          this.$vgo.tip('请完善表单数据!', 'warning')
          return
        }
      }
      this.$api.switchBind(this.swBindParams).then(data => {
        this.$vgo.tip('换绑成功!', 'success')
        this.cancelBind()
        this.getListMixin()
      })
    },
    onUserAccountChange (value) {
      if (value) {
        this.$api.getOriginBind(value).then(data => {
          this.swBindParams.userCode = data.userCode
          this.swBindParams.aJob = data.aJob
          this.swBindParams.aJobId = data.aJobId

          this.swBindParams.bJob = data.bJob
          this.swBindParams.bJobId = data.bJobId

          this.swBindParams.cJob = data.cJob
          this.swBindParams.cJobId = data.cJobId

          this.swBindParams.targetTime = new Date()
        })
      }
    },
  },
}
</script>
<style lang='stylus'>
.el-picker-panel__body
  .el-date-picker__editor-wrap
      width 140px !important
      .el-input--small
        width 140px !important
</style>
