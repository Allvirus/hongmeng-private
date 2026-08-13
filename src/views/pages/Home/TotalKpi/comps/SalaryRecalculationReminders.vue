<template lang='pug'>
.salary-reminders
  el-badge(:value='reminders.length', :hidden='reminders.length === 0', :max='99')
    el-button(
      v-permission='\'salary.add\'',
      icon='el-icon-warning-outline',
      :type='reminders.length > 0 ? "danger" : "info"',
      plain,
      @click='visible = true'
    ) 待重算月份
  el-dialog(
    title='工资待重算提醒',
    :visible.sync='visible',
    width='760px',
    append-to-body
  )
    .reminder-summary
      span 因GS订单归属修复，以下月份的工资数据需要重新生成。
      strong {{ reminders.length }} 个月待处理
    el-table.mgt2(:data='reminders', max-height='420')
      el-table-column(label='月份', width='90')
        template(slot-scope='{ row }') {{ formatMonth(row.month) }}
      el-table-column(prop='affectedOrderCount', label='影响订单', width='90')
      el-table-column(prop='affectedAmount', label='影响流水', width='110')
      el-table-column(prop='reason', label='原因', min-width='220', show-overflow-tooltip)
      el-table-column(label='最后标记时间', width='160')
        template(slot-scope='{ row }') {{ row.lastMarkedTime | dateFormat }}
      el-table-column(label='操作', width='105', fixed='right')
        template(slot-scope='{ row }')
          el-button(
            type='text',
            :loading='processingMonth === row.month',
            @click='regenerate(row)'
          ) 重新生成
    .empty-reminders(v-if='reminders.length === 0')
      i.el-icon-circle-check
      span 当前没有待重算月份
</template>
<script>
export default {
  name: 'SalaryRecalculationReminders',
  data () {
    return {
      visible: false,
      reminders: [],
      processingMonth: null,
    }
  },
  created () {
    this.load()
  },
  methods: {
    formatMonth (month) {
      const value = String(month || '')
      return value.length === 6 ? value.slice(0, 4) + '-' + value.slice(4) : value
    },
    load () {
      return this.$api.getSalaryRecalculationReminders().then(data => {
        this.reminders = Array.isArray(data) ? data : []
      })
    },
    regenerate (row) {
      const month = this.formatMonth(row.month)
      this.$vgo.open(() => {
        this.processingMonth = row.month
        this.$api.createPayrollRecords({ Month: month }).then(() => {
          this.$vgo.tip(month + ' 工资已重新生成', 'success')
          this.$emit('resolved')
          return this.load()
        }).finally(() => {
          this.processingMonth = null
        })
      }, '确认重新生成 ' + month + ' 工资？已有该月工资记录会按当前订单归属重新计算。')
    },
  },
}
</script>
<style lang='stylus' scoped>
.salary-reminders {
  display: inline-block;
}

.reminder-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0 14px;
  border-left: 3px solid #d97706;
  background: #fff8eb;
  color: #606266;

  strong {
    color: #b45309;
  }
}

.empty-reminders {
  color: #0c8f74;
  padding: 28px 0 10px;
  text-align: center;

  i {
    font-size: 18px;
    margin-right: 8px;
  }
}
</style>
