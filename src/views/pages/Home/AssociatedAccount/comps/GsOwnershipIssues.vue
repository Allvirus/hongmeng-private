<template lang='pug'>
.gs-ownership-issues
  el-badge(:value='count', :hidden='count === 0', :max='99')
    el-button(
      v-permission='\'userbind.query\'',
      icon='el-icon-warning-outline',
      type='warning',
      plain,
      @click='open'
    ) GS归属异常
  el-dialog(
    title='iFun GS订单归属异常',
    :visible.sync='visible',
    width='920px',
    append-to-body,
    @close='close'
  )
    .issue-toolbar
      .issue-summary
        span 当前有
        strong {{ count }}
        span 个GS账号存在未绑定或归属不一致
      .issue-actions
        el-button(
          icon='el-icon-refresh',
          :loading='auditing',
          @click='audit'
        ) 重新检查
        el-button(icon='el-icon-search', type='primary', @click='loadIssues') 刷新清单
    el-table.mgt2(:data='issues', max-height='440')
      el-table-column(prop='gsEmail', label='GS账号', min-width='180')
      el-table-column(prop='gsName', label='GS名称', width='110')
      el-table-column(label='问题', width='100')
        template(slot-scope='{ row }')
          el-tag(:type='row.issueType === "Unbound" ? "danger" : "warning"', size='mini') {{ issueName(row.issueType) }}
      el-table-column(label='应归属员工', width='110')
        template(slot-scope='{ row }') {{ row.expectedUserName || '未绑定' }}
      el-table-column(prop='orderCount', label='订单数', width='75')
      el-table-column(prop='totalAmount', label='流水', width='95')
      el-table-column(label='订单时间', min-width='170')
        template(slot-scope='{ row }')
          span {{ row.firstPayDate | dateFormat }}
          br
          span {{ row.lastPayDate | dateFormat }}
      el-table-column(label='操作', width='120', fixed='right')
        template(slot-scope='{ row }')
          el-button(
            v-if='row.expectedUserId > 0',
            type='text',
            @click='reconcile(row)'
          ) 回补订单
          el-button(
            v-else,
            type='text',
            @click='showBinding(row)'
          ) 绑定并回补
    el-pagination.margin-spacing(
      :total='count',
      :page-size.sync='query.pageSize',
      :current-page.sync='query.page',
      @current-change='loadIssues'
    )
  el-dialog(
    title='绑定GS账号并回补',
    :visible.sync='bindingVisible',
    width='520px',
    append-to-body
  )
    el-form(label-width='105px')
      el-form-item(label='GS账号:')
        el-input(:value='binding.gsEmail', disabled)
      el-form-item(label='归属员工:', required)
        el-select.w-full(
          v-model='binding.userId',
          filterable,
          placeholder='请选择员工'
        )
          el-option(
            v-for='item in users',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
          )
      el-form-item(label='归属开始时间:', required)
        el-date-picker.w-full(
          v-model='binding.effectiveTime',
          type='datetime',
          value-format='yyyy-MM-dd HH:mm:ss',
          placeholder='请选择开始时间'
        )
    span.dialog-footer(slot='footer')
      el-button(@click='bindingVisible = false') 取消
      el-button(type='primary', :loading='bindingSaving', @click='bindAndReconcile') 确认绑定并回补
</template>
<script>
export default {
  name: 'GsOwnershipIssues',
  data () {
    return {
      visible: false,
      bindingVisible: false,
      auditing: false,
      bindingSaving: false,
      count: 0,
      issues: [],
      users: [],
      query: {
        status: 'Open',
        page: 1,
        pageSize: 20,
      },
      binding: {
        userId: '',
        gsEmail: '',
        effectiveTime: '',
      },
    }
  },
  created () {
    this.loadIssues()
  },
  methods: {
    open () {
      this.visible = true
      this.loadIssues()
    },
    close () {
      this.visible = false
    },
    issueName (type) {
      return type === 'Unbound' ? '未绑定' : '归属不一致'
    },
    formatDateTime (value) {
      if (!value) return ''
      const date = new Date(value)
      const pad = number => String(number).padStart(2, '0')
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
        pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
    },
    loadIssues () {
      return this.$api.getIfunGsOwnershipIssues(this.query).then(data => {
        this.issues = data.list || []
        this.count = data.count || 0
      })
    },
    audit () {
      this.auditing = true
      this.$api.auditIfunGsOwnership().then(data => {
        this.$vgo.tip('检查完成：' + (data.openIssueCount || 0) + '个异常账号，影响' + (data.affectedOrderCount || 0) + '笔订单', 'success')
        this.query.page = 1
        return this.loadIssues()
      }).finally(() => {
        this.auditing = false
      })
    },
    reconcile (row) {
      this.$vgo.open(() => {
        this.$api.reconcileIfunGsIssue({
          id: row.id,
          effectiveTime: this.formatDateTime(row.firstPayDate),
        }).then(data => {
          const months = (data.salaryMonthsMarked || []).join('、') || '无'
          this.$vgo.tip('已回补' + (data.updatedOrderCount || 0) + '笔订单，影响工资月份' + months, 'success')
          this.loadIssues()
        })
      }, '确认按 ' + row.expectedUserName + ' 回补 ' + row.gsEmail + ' 的历史订单归属？')
    },
    showBinding (row) {
      this.binding = {
        userId: '',
        gsEmail: row.gsEmail,
        effectiveTime: this.formatDateTime(row.firstPayDate),
      }
      this.bindingVisible = true
      if (this.users.length === 0) {
        this.$api.getEmployeeTransferOptions().then(data => {
          this.users = data.users || []
        })
      }
    },
    bindAndReconcile () {
      if (!this.binding.userId || !this.binding.effectiveTime) {
        this.$vgo.tip('请选择归属员工和开始时间', 'warning')
        return
      }
      this.bindingSaving = true
      this.$api.bindAndReconcileIfunGs(this.binding).then(data => {
        this.$vgo.tip('绑定完成，已回补' + (data.updatedOrderCount || 0) + '笔订单', 'success')
        this.bindingVisible = false
        this.loadIssues()
      }).finally(() => {
        this.bindingSaving = false
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.gs-ownership-issues {
  display: inline-block;
}

.issue-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;

  .issue-summary {
    color: #606266;

    strong {
      color: #d97706;
      font-size: 18px;
      margin: 0 5px;
    }
  }
}

.w-full {
  width: 100%;
}
</style>
