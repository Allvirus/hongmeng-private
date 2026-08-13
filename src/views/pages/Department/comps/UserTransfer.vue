<template lang='pug'>
.user-transfer
  el-dialog(
    title='员工转岗',
    :visible.sync='isShow',
    width='760px',
    :close-on-click-modal='false',
    @close='cancel'
  )
    .transfer-summary
      span.employee-name {{ user ? user.realName : '' }}
      span.current-assignment {{ currentDepartmentName }} / {{ jobName(user ? user.job : null) }}
      i.el-icon-right
      span.target-assignment {{ targetAssignment }}
    el-form.mgt2(label-width='110px')
      el-form-item(label='员工:')
        el-input(:value='user ? user.realName : ""', disabled)
      el-form-item(label='目标部门:', required)
        el-select.w-full(
          v-model='model.toDepartmentId',
          placeholder='请选择目标部门',
          filterable
        )
          el-option(
            v-for='item in departments',
            :key='item.id',
            :label='item.name',
            :value='item.id'
          )
      el-form-item(label='目标岗位:', required)
        el-select.w-full(v-model='model.toJob', placeholder='请选择目标岗位')
          el-option(
            v-for='item in jobs',
            :key='item.value',
            :label='item.label',
            :value='item.value'
          )
      el-form-item(label='生效时间:', required)
        el-date-picker.w-full(
          v-model='model.effectiveTime',
          type='datetime',
          value-format='yyyy-MM-dd HH:mm:ss',
          placeholder='请选择生效时间',
          :picker-options='pickerOptions'
        )
      template(v-if='model.toJob === 2')
        el-form-item(label='iFun GS账号:', required)
          el-input(
            v-model.trim='model.ifunGsAccount',
            placeholder='请输入GS邮箱账号',
            clearable
          )
        el-form-item(label='历史订单回补:')
          el-switch(v-model='model.reconcileGsOrders')
          span.reconcile-note 将从生效时间起修复GS订单归属，并标记受影响工资月份
    el-divider
    .history-title
      span 最近转岗记录
      el-button(
        type='text',
        icon='el-icon-refresh',
        @click='loadHistory'
      ) 刷新
    el-table(:data='history', max-height='220', size='mini')
      el-table-column(prop='effectiveTime', label='生效时间', width='155')
        template(slot-scope='{ row }') {{ row.effectiveTime | dateFormat }}
      el-table-column(prop='fromDepartmentName', label='原部门')
      el-table-column(label='原岗位', width='75')
        template(slot-scope='{ row }') {{ jobName(row.fromJob) }}
      el-table-column(prop='toDepartmentName', label='新部门')
      el-table-column(label='新岗位', width='75')
        template(slot-scope='{ row }') {{ jobName(row.toJob) }}
      el-table-column(prop='createdByUserName', label='操作人', width='90')
    .empty-history(v-if='history.length === 0') 暂无转岗记录
    span.dialog-footer(slot='footer')
      el-button(@click='cancel') 取消
      el-button(
        v-permission='\'department.user.edit\'',
        type='primary',
        :loading='submitting',
        @click='submit'
      ) 确认转岗
</template>
<script>
export default {
  name: 'UserTransfer',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      isShow: false,
      submitting: false,
      departments: [],
      history: [],
      jobs: [
        { label: 'A岗', value: 0 },
        { label: 'B岗', value: 1 },
        { label: 'C岗', value: 2 },
        { label: '后勤管理', value: 3 },
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
      },
      model: this.emptyModel(),
    }
  },
  computed: {
    currentDepartmentName () {
      return this.user ? (this.user.dptName || '') : ''
    },
    targetAssignment () {
      const department = this.departments.find(item => item.id === this.model.toDepartmentId)
      const departmentName = department ? department.name : '待选择部门'
      return departmentName + ' / ' + this.jobName(this.model.toJob)
    },
  },
  watch: {
    show (value) {
      this.isShow = value
      if (value && this.user) {
        this.model = {
          userId: this.user.id,
          toDepartmentId: this.user.departmentId,
          toJob: this.user.job,
          effectiveTime: this.formatNow(),
          ifunGsAccount: '',
          reconcileGsOrders: true,
        }
        this.loadOptions()
        this.loadHistory()
      }
    },
  },
  methods: {
    emptyModel () {
      return {
        userId: 0,
        toDepartmentId: '',
        toJob: '',
        effectiveTime: '',
        ifunGsAccount: '',
        reconcileGsOrders: true,
      }
    },
    formatNow () {
      const date = new Date()
      const pad = value => String(value).padStart(2, '0')
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
    },
    jobName (job) {
      const option = this.jobs.find(item => item.value === job)
      return option ? option.label : '待选择岗位'
    },
    loadOptions () {
      this.$api.getEmployeeTransferOptions().then(data => {
        this.departments = data.departments || []
      })
    },
    loadHistory () {
      if (!this.user) return
      this.$api.getEmployeeTransfers({
        userId: this.user.id,
        page: 1,
        pageSize: 10,
      }).then(data => {
        this.history = data.list || []
      })
    },
    cancel () {
      this.model = this.emptyModel()
      this.history = []
      this.$emit('cancel')
    },
    validate () {
      if (!this.model.toDepartmentId || this.model.toJob === '' || !this.model.effectiveTime) {
        this.$vgo.tip('请完善转岗信息', 'warning')
        return false
      }
      if (new Date(this.model.effectiveTime).getTime() > Date.now() + 5 * 60 * 1000) {
        this.$vgo.tip('暂不支持未来生效，请在实际转岗时操作', 'warning')
        return false
      }
      if (this.model.toDepartmentId === this.user.departmentId && this.model.toJob === this.user.job) {
        this.$vgo.tip('目标部门和岗位未发生变化', 'warning')
        return false
      }
      if (this.model.toJob === 2 && !this.model.ifunGsAccount) {
        this.$vgo.tip('转为C岗时必须填写iFun GS账号', 'warning')
        return false
      }
      return true
    },
    submit () {
      if (!this.validate()) return
      const tip = '确认将 ' + this.user.realName + ' 转至 ' + this.targetAssignment + '？系统会同步关闭原每日定岗配置。'
      this.$vgo.open(() => {
        this.submitting = true
        this.$api.transferEmployee(this.model).then(data => {
          const transfer = data.transfer || {}
          const orderText = transfer.reconciledOrderCount
            ? '，回补' + transfer.reconciledOrderCount + '笔订单'
            : ''
          this.$vgo.tip('转岗完成，关闭' + (transfer.closedBusinessConfigCount || 0) + '条原定岗配置' + orderText, 'success')
          this.$emit('success')
        }).finally(() => {
          this.submitting = false
        })
      }, tip)
    },
  },
}
</script>
<style lang='stylus' scoped>
.transfer-summary {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-left: 3px solid #0c8f74;
  background: #f4f8f7;

  .employee-name {
    color: #303133;
    font-weight: 600;
    margin-right: 16px;
  }

  .current-assignment {
    color: #606266;
  }

  i {
    color: #909399;
    margin: 0 12px;
  }

  .target-assignment {
    color: #0c8f74;
    font-weight: 600;
  }
}

.w-full {
  width: 100%;
}

.reconcile-note {
  color: #909399;
  font-size: 12px;
  margin-left: 10px;
}

.history-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #303133;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-history {
  color: #909399;
  font-size: 12px;
  padding-top: 8px;
  text-align: center;
}
</style>
