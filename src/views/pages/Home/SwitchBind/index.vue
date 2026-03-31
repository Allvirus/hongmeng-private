<template lang='pug'>
.switch-bind
  .switch-bind-search.bg-white.pdx2.pdt2
    .switch-bind-form
      .switch-bind-form__group.switch-bind-form__platform
        .switch-bind-form__label 平台:
        el-radio-group(v-model='model.Platform')
          el-radio(label='0') Ifun
          el-radio(label='1') 木勺
      .switch-bind-form__group.switch-bind-form__query
        .switch-bind-form__label {{ queryIdentifierLabel }}
        el-input.winput(
          :value='queryIdentifierValue',
          @input='onQueryIdentifierInput',
          :placeholder='queryIdentifierPlaceholder',
          clearable
        )
      .switch-bind-form__actions
        el-button(
          v-permission='\'playerswitch.switch\'',
          type='warning',
          @click='swBindDlg = true'
        ) 玩家换绑
        el-button.mgl3(
          v-permission='\'playerswitch.query\'',
          icon='el-icon-search',
          type='primary',
          @click='getListMixin'
        ) 搜索
        el-button.mgl2(
          v-permission='\'playerswitch.query\'',
          icon='el-icon-refresh-right',
          type='primary',
          @click='resetPageMixin'
        ) 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='platform', label='平台', width='80px')
      template(slot-scope='{ row }') {{ row.platform === 0 ? 'Ifun' : '木勺' }}
    el-table-column(prop='ifunId', label='IfunId')
    el-table-column(prop='userCode', label='玩家代码')
    el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='aJob', label='A岗(换绑前)')
    el-table-column(prop='bJob', label='B岗(换绑前)')
    el-table-column(prop='cJob', label='C岗(换绑前)')
    el-table-column(prop='aJobAfter', label='A岗(换绑后)')
    el-table-column(prop='bJobAfter', label='B岗(换绑后)')
    el-table-column(prop='cJobAfter', label='C岗(换绑后)')
    el-table-column(prop='switchTime', label='创建时间', width='150px')
      template(slot-scope='{ row }') {{ row.switchTime | dateFormat }}
    el-table-column(prop='targetTime', label='换绑时间', width='160px')
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
      el-form-item(label='平台:', required)
        el-radio-group(v-model='swBindParams.platform')
          el-radio(label='0') Ifun
          el-radio(label='1') 木勺
      el-form-item(:label='bindIdentifierLabel', required)
        el-input(
          :value='bindIdentifierValue',
          @input='onIdentifierInput',
          @change='onUserAccountChange',
          :placeholder='bindIdentifierPlaceholder',
          clearable
        )
      el-form-item(label='玩家账号:')
        p {{ swBindParams.userCode }}
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
        el-date-picker(
          type='datetime',
          placeholder='选择日期时间',
          :end-placeholde='swBindParams.targetTime',
          v-model='swBindParams.targetTime',
          :picker-options='pickerOptions'
        )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancelBind') 取消
      el-button.mgl3(
        v-permission='\'playerswitch.switch\'',
        type='primary',
        @click='commitSwBind'
      ) 提交
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
        Platform: '0',
        IfunId: '',
        UserCode: '',
        Page: 1,
        PageSize: 10,
      },
      swBindParams: {
        platform: '0',
        ifunId: '',
        userAccount: '',
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
  computed: {
    isIfunPlatform () {
      return this.model.Platform === '0'
    },
    isIfunBindPlatform () {
      return this.swBindParams.platform === '0'
    },
    queryIdentifierLabel () {
      return 'IfunId/玩家代码:'
    },
    queryIdentifierPlaceholder () {
      return this.isIfunPlatform ? '请输入IfunId' : '请输入玩家代码'
    },
    queryIdentifierValue () {
      return this.isIfunPlatform ? this.model.IfunId : this.model.UserCode
    },
    bindIdentifierLabel () {
      return 'IfunId/玩家代码:'
    },
    bindIdentifierPlaceholder () {
      return this.isIfunBindPlatform ? '请输入IfunId' : '请输入玩家代码'
    },
    bindIdentifierValue () {
      return this.isIfunBindPlatform ? this.swBindParams.ifunId : this.swBindParams.userCode
    },
  },
  watch: {
    'model.Platform' (val) {
      if (val === '0') this.model.UserCode = ''
      else this.model.IfunId = ''
    },
    'swBindParams.platform' (val) {
      this.swBindParams.userAccount = ''
      this.swBindParams.aJob = ''
      this.swBindParams.aJobId = ''
      this.swBindParams.bJob = ''
      this.swBindParams.bJobId = ''
      this.swBindParams.cJob = ''
      this.swBindParams.cJobId = ''
      if (val === '0') this.swBindParams.userCode = ''
      else this.swBindParams.ifunId = ''
    },
  },
  created () {
    this.$api.getDepartMembers(1).then(data => {
      this.userList = data
    })
  },
  methods: {
    onQueryIdentifierInput (value) {
      if (this.isIfunPlatform) this.model.IfunId = value
      else this.model.UserCode = value
    },
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
      this.swBindParams.platform = '0'
    },
    commitSwBind () {
      if (this.isIfunBindPlatform && !this.swBindParams.ifunId) {
        this.$vgo.tip('ifun平台请填写IfunId!', 'warning')
        return
      }
      if (!this.isIfunBindPlatform && !this.swBindParams.userCode) {
        this.$vgo.tip('木勺平台请填写玩家代码!', 'warning')
        return
      }
      if (!this.swBindParams.aJobIdAfter || !this.swBindParams.bJobIdAfter || !this.swBindParams.cJobIdAfter || !this.swBindParams.targetTime) {
        this.$vgo.tip('请完善表单数据!', 'warning')
        return
      }
      this.$api.switchBind(this.swBindParams).then(data => {
        this.$vgo.tip('换绑成功!', 'success')
        this.cancelBind()
        this.getListMixin()
      })
    },
    onIdentifierInput (value) {
      if (this.isIfunBindPlatform) this.swBindParams.ifunId = value
      else this.swBindParams.userCode = value
    },
    onUserAccountChange (value) {
      if (value) {
        const requestValue = this.isIfunBindPlatform ? this.swBindParams.ifunId : this.swBindParams.userCode
        this.$api.getOriginBind(requestValue, +this.swBindParams.platform).then(data => {
          this.swBindParams.platform = String(data.platform)
          this.swBindParams.userAccount = data.userAccount
          this.swBindParams.userCode = data.userCode
          this.swBindParams.ifunId = data.ifunId
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
.switch-bind-search {
  padding-bottom: 10px;

  .switch-bind-form {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .switch-bind-form__group {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  }

  .switch-bind-form__platform {
    min-width: 210px;
  }

  .switch-bind-form__query {
    min-width: 430px;

    .el-input {
      width: 200px;
    }
  }

  .switch-bind-form__label {
    width: 120px;
    text-align: right;
    color: #606266;
    padding-right: 12px;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .switch-bind-form__platform .switch-bind-form__label {
    width: 60px;
  }

  .switch-bind-form__actions {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    justify-content: flex-end;
    min-width: 280px;
  }
}

@media (max-width: 1400px) {
  .switch-bind-search {
    .switch-bind-form {
      align-items: stretch;
    }

    .switch-bind-form__group, .switch-bind-form__actions {
      width: 100%;
    }

    .switch-bind-form__actions {
      justify-content: flex-start;
    }
  }
}

.el-picker-panel__body {
  .el-date-picker__editor-wrap {
    width: 140px !important;

    .el-input--small {
      width: 140px !important;
    }
  }
}
</style>
