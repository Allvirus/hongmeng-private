<template lang='pug'>
.BizConfig
  .ff-rn.fs-m.bg-white.pd2.opt-bar
    el-form.ff-rn(label-width='80px')
      el-form-item(label='部门:')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:')
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
      el-form-item.mgl3(label='定岗日期:')
        el-date-picker.winput(
          v-model='model.startTime',
          type='date',
          value-format='yyyy-MM-dd',
          placeholder='请选择定岗日期',
          clearable
        )
      el-form-item.mgl3(label='绑定时间:')
        CommonDatePicker.w300(
          :start.sync='model.bindStartTime',
          :end.sync='model.bindEndTime',
          all
        )
      el-form-item.mgl3
        el-button.mgl3(
          v-permission='\'bizconf.query\'',
          icon='el-icon-search',
          type='primary',
          @click='searchCfg'
          v-text='"搜索"'
        )
        el-button.mgl2(
          v-permission='\'bizconf.query\'',
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
          v-text='"重置"'
        )
    .flex-1.jc-end
      el-button(
        v-permission='\'bizconf.add\'',
        icon='el-icon-plus',
        type='primary',
        @click='showEditDlg(false, null)'
        v-text='"新增配置"'
      )

  el-table.mgy2.bg-white.pd2(
    :data='configList',
    :row-class-name='({ row }) => (row.is_payout ? "danger" : "")'
  )
    el-table-column(prop='aUserName', label='A岗', width='130')
    el-table-column(prop='bUserName', label='B岗', width='130')
    el-table-column(prop='cUserName', label='C岗', width='130')
    el-table-column(prop='startTime', label='开始时间', width='170')
      template(slot-scope='{ row }') {{ row.startTime | dateFormat }}
    el-table-column(prop='endTime', label='结束时间', width='170')
      template(slot-scope='{ row }') {{ row.endTime | dateFormat }}
    el-table-column(prop='endTime', label='绑定时间', width='170')
      template(slot-scope='{ row }') {{ row.bindTime | dateFormat }}
    el-table-column(prop='operate', label='操作')
      template(slot-scope='{ row }')
        el-button.mgl2(
          v-permission='\'bizconf.edit\'',
          type='text',
          :disabled='backfillBusy || isFutureConfigRow(row)',
          @click='openBackfill(row)',
          v-text='"回写"'
        )
        el-button.mgl2(
          v-permission='\'bizconf.edit\'',
          icon='el-icon-edit-outline',
          type='text',
          @click='showEditDlg(true, row)'
          v-text='"编辑"'
        )
        el-button.mgl2.danger(
          v-permission='\'bizconf.delete\'',
          icon='el-icon-delete',
          type='text',
          @click='deleteCfg(row)'
          v-text='"删除"'
        )

  el-pagination.margin-spacing(
    :total='count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getCfgList'
  )

  //- 每日定岗新增/编辑弹窗
  el-dialog(
    :title='cfgInfo.isEdit ? "编辑" : "新增"',
    @close='cancelEdit',
    :visible.sync='editDlgVisiable',
    width='600px'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='A岗', required)
          el-select.mgl1(
            v-model='cfgInfo.row.aUserId',
            filterable,
            :disabled='cfgInfo.isEdit',
            :multiple='!cfgInfo.isEdit',
            @change='onAJobChange',
            placeholder='请选择'
          )
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='B岗', required)
          el-select.mgl1(
            v-model='cfgInfo.row.bUserId',
            filterable,
            @change='onBJobChange',
            placeholder='请选择'
          )
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='C岗', required)
          el-select.mgl1(
            v-model='cfgInfo.row.cUserId',
            filterable,
            @change='onCJobChange',
            placeholder='请选择'
          )
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='时间', required, v-if='!cfgInfo.isEdit')
          CommonDatePicker.mgl1(
            :start.sync='cfgInfo.row.startTime',
            :end.sync='cfgInfo.row.endTime',
            type='datetimerange',
            all
          )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancelEdit', v-text='"取消"')
      el-button.mgl3(
        v-permission='cfgInfo.isEdit ? \'bizconf.edit\' : \'bizconf.add\'',
        type='primary',
        @click='submmitEdit'
        v-text='"提交"'
      )
</template>
<script>
import { mapGetters } from 'vuex'
import { http } from '@/api/http'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'BizConfig',
  mixins: [fetchListMixin, dptListMixin],
  data () {
    return {
      listApiForMixin: 'getBusinessConfiguration',
      dtpApi: 'getBusinessConfiguration',
      model: {
        page: 1,
        pageSize: 10,
        startTime: '',
        bindStartTime: '',
        bindEndTime: '',
        departmentId: 0,
        userId: '',
      },
      delDlgVisiable: false,
      editDlgVisiable: false,
      delId: 0,
      cfgInfo: {
        isEdit: false,
        title: '',
        row: {
          startTime: '',
          endTime: '',
          aUserId: [],
          aUserName: '',
          bUserId: '',
          bUserName: '',
          cUserId: '',
          cUserName: '',
        },
        departList: [],
        AUserList: [],
        BUserList: [],
        CUserList: [],
      },
      configList: [],
      count: 0,
      backfillBusy: false,
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
  created: function () {
    // this.loadOptions()
    this.getCfgList()
  },
  methods: {
    getCfgList () {
      this.$api.getBusinessConfiguration(this.model).then(data => {
        this.count = data.count
        this.configList = data.list
      })
    },
    searchCfg () {
      this.getCfgList()
    },
    reset () {
      this.model.startTime = ''
      this.model.bindStartTime = ''
      this.model.bindEndTime = ''
      this.model.userId = ''
      this.getCfgList()
    },
    loadOptions () {
      // 加载在岗用户列表，供弹窗下拉选择
      this.$api.getWorking().then(res => {
        this.cfgInfo.AUserList = res
        this.cfgInfo.BUserList = res
        this.cfgInfo.CUserList = res
      })
    },
    showEditDlg (isEdit, row) {
      if (isEdit) {
        this.cfgInfo.row = JSON.parse(JSON.stringify(row))
      }
      this.cfgInfo.isEdit = isEdit
      this.editDlgVisiable = true
    },
    deleteCfg (row) {
      this.$vgo.open(() => {
        this.$api.deleteBusinessionsById(row.id).then(res => {
          this.$vgo.tip('删除成功!', 'success')
          this.getCfgList()
        })
      })
    },
    openBackfill (row) {
      if (this.isFutureConfigRow(row)) {
        this.$vgo.tip('未来时间的配置不允许回写', 'info')
        return
      }
      this.maybePromptBackfill([this.buildBackfillTarget(row)], true)
    },
    cancelEdit () {
      this.editDlgVisiable = false
      for (const key in this.cfgInfo.row) {
        this.cfgInfo.row[key] = ''
      }
    },
    onAJobChange (value) {
      if (this.cfgInfo.isEdit) {
        for (const item of this.cfgInfo.AUserList) {
          if (item.id === value) {
            this.cfgInfo.row.aUserName = item.realName
          }
        }
      }
    },
    onBJobChange (value) {
      for (const item of this.cfgInfo.BUserList) {
        if (item.id === value) {
          this.cfgInfo.row.bUserName = item.realName
        }
      }
    },
    onCJobChange (value) {
      for (const item of this.cfgInfo.CUserList) {
        if (item.id === value) {
          this.cfgInfo.row.cUserName = item.realName
        }
      }
    },
    checkFormData (row) {
      let msg = ''
      if (row.aUserId === '') {
        msg = '请选择A岗'
      } else if (row.bUserId === '') {
        msg = '请选择B岗'
      } else if (row.cUserId === '') {
        msg = '请选择C岗'
      } else if (row.startTime === '' || row.endTime === '') {
        msg = '请选择时间'
      }
      if (msg !== '') {
        this.$vgo.tip(msg, 'warning')
        return false
      }
      return true
    },
    async submmitEdit () {
      const params = this.cfgInfo.row
      if (!this.checkFormData(this.cfgInfo.row)) {
        return false
      }

      if (this.cfgInfo.isEdit) {
        // 编辑单条配置后，按需提示回写
        params.id = this.cfgInfo.row.id
        const backfillTargets = [this.buildBackfillTarget(params)]
        await this.$api.modifiedBusinessById(params)
          this.$vgo.tip('更新成功', 'success')
          this.cancelEdit()
          this.getCfgList()
        await this.maybePromptBackfill(backfillTargets, false)
      } else {
        // 批量新增配置后，按需提示回写
        const createdRows = this.normalizeConfigArray(await this.$api.batchToCreateBusiness(params))
          this.$vgo.tip('提交成功', 'success')
          this.cancelEdit()
        this.getCfgList()
        await this.maybePromptBackfill(createdRows, false)
      }
    },
    normalizeConfigArray (res) {
      return Array.isArray(res) ? res.map(item => this.buildBackfillTarget(item)).filter(item => item.id) : []
    },
    buildBackfillTarget (row) {
      if (!row) return { id: '', startTime: '', endTime: '' }
      return {
        id: row.id || row.Id || '',
        startTime: row.startTime || row.StartTime || row.bindStartTime || '',
        endTime: row.endTime || row.EndTime || row.bindEndTime || '',
      }
    },
    parseTimeValue (value) {
      if (!value) return Number.NaN
      if (value instanceof Date) return value.getTime()
      return new Date(String(value).replace('T', ' ').replace(/-/g, '/')).getTime()
    },
    isFutureBackfillTarget (target) {
      const startTime = this.parseTimeValue(target && target.startTime)
      return Number.isFinite(startTime) && startTime > Date.now()
    },
    isFutureConfigRow (row) {
      return this.isFutureBackfillTarget(this.buildBackfillTarget(row))
    },
    previewBusinessBackfill (bizId) {
      return http('post', `/api/bizconf/${bizId}/backfill-preview`, {
        data: {},
      })
    },
    backfillBusinessById (bizId, model = {}) {
      return http('post', `/api/bizconf/${bizId}/backfill`, {
        data: {
          skipSwitchConflicts: model.skipSwitchConflicts !== false,
        },
      })
    },
    createBackfillSummary () {
      return {
        hasHistoricalData: false,
        infoWillUpdateCount: 0,
        roleWillUpdateCount: 0,
        orderWillUpdateCount: 0,
        infoAlreadyMatchedCount: 0,
        roleAlreadyMatchedCount: 0,
        orderAlreadyMatchedCount: 0,
        infoSwitchConflictCount: 0,
        roleSwitchConflictCount: 0,
        orderSwitchConflictCount: 0,
        infoUpdatedCount: 0,
        roleUpdatedCount: 0,
        orderUpdatedCount: 0,
      }
    },
    readBackfillValue (source, keys) {
      for (const key of keys) {
        if (source && source[key] !== undefined && source[key] !== null) {
          return source[key]
        }
      }
      return undefined
    },
    normalizeBackfillSummary (res) {
      const data = res || {}
      return {
        hasHistoricalData: Boolean(this.readBackfillValue(data, ['hasHistoricalData', 'HasHistoricalData'])),
        infoWillUpdateCount: Number(this.readBackfillValue(data, ['infoWillUpdateCount', 'InfoWillUpdateCount', 'infoUpdatedCount', 'InfoUpdatedCount']) || 0),
        roleWillUpdateCount: Number(this.readBackfillValue(data, ['roleWillUpdateCount', 'RoleWillUpdateCount', 'roleUpdatedCount', 'RoleUpdatedCount']) || 0),
        orderWillUpdateCount: Number(this.readBackfillValue(data, ['orderWillUpdateCount', 'OrderWillUpdateCount', 'orderUpdatedCount', 'OrderUpdatedCount']) || 0),
        infoAlreadyMatchedCount: Number(this.readBackfillValue(data, ['infoAlreadyMatchedCount', 'InfoAlreadyMatchedCount']) || 0),
        roleAlreadyMatchedCount: Number(this.readBackfillValue(data, ['roleAlreadyMatchedCount', 'RoleAlreadyMatchedCount']) || 0),
        orderAlreadyMatchedCount: Number(this.readBackfillValue(data, ['orderAlreadyMatchedCount', 'OrderAlreadyMatchedCount']) || 0),
        infoSwitchConflictCount: Number(this.readBackfillValue(data, ['infoSwitchConflictCount', 'InfoSwitchConflictCount']) || 0),
        roleSwitchConflictCount: Number(this.readBackfillValue(data, ['roleSwitchConflictCount', 'RoleSwitchConflictCount']) || 0),
        orderSwitchConflictCount: Number(this.readBackfillValue(data, ['orderSwitchConflictCount', 'OrderSwitchConflictCount']) || 0),
        infoUpdatedCount: Number(this.readBackfillValue(data, ['infoUpdatedCount', 'InfoUpdatedCount']) || 0),
        roleUpdatedCount: Number(this.readBackfillValue(data, ['roleUpdatedCount', 'RoleUpdatedCount']) || 0),
        orderUpdatedCount: Number(this.readBackfillValue(data, ['orderUpdatedCount', 'OrderUpdatedCount']) || 0),
      }
    },
    async buildBackfillPreview (targets) {
      const result = this.createBackfillSummary()
      for (const item of targets) {
        const current = this.normalizeBackfillSummary(await this.previewBusinessBackfill(item.id))
        result.hasHistoricalData = result.hasHistoricalData || current.hasHistoricalData
        result.infoWillUpdateCount += current.infoWillUpdateCount
        result.roleWillUpdateCount += current.roleWillUpdateCount
        result.orderWillUpdateCount += current.orderWillUpdateCount
        result.infoAlreadyMatchedCount += current.infoAlreadyMatchedCount
        result.roleAlreadyMatchedCount += current.roleAlreadyMatchedCount
        result.orderAlreadyMatchedCount += current.orderAlreadyMatchedCount
        result.infoSwitchConflictCount += current.infoSwitchConflictCount
        result.roleSwitchConflictCount += current.roleSwitchConflictCount
        result.orderSwitchConflictCount += current.orderSwitchConflictCount
      }
      return result
    },
    buildBackfillMessage (summary, manual) {
      const lines = []
      lines.push(manual ? '确认对这条配置执行历史回写？' : '已保存，发现可回写的历史数据。')
      lines.push(`注册回写：${summary.infoWillUpdateCount}`)
      lines.push(`角色回写：${summary.roleWillUpdateCount}`)
      lines.push(`订单回写：${summary.orderWillUpdateCount}`)
      if (summary.infoAlreadyMatchedCount || summary.roleAlreadyMatchedCount || summary.orderAlreadyMatchedCount) {
        lines.push(`已匹配无需回写：注册 ${summary.infoAlreadyMatchedCount}，角色 ${summary.roleAlreadyMatchedCount}，订单 ${summary.orderAlreadyMatchedCount}`)
      }
      if (summary.infoSwitchConflictCount || summary.roleSwitchConflictCount || summary.orderSwitchConflictCount) {
        lines.push(`换绑冲突已跳过：注册 ${summary.infoSwitchConflictCount}，角色 ${summary.roleSwitchConflictCount}，订单 ${summary.orderSwitchConflictCount}`)
      }
      lines.push('是否立即回写？')
      return lines.join(' ; ')
    },
    async runBackfill (targets) {
      const result = this.createBackfillSummary()
      for (const item of targets) {
        const current = this.normalizeBackfillSummary(await this.backfillBusinessById(item.id, { skipSwitchConflicts: true }))
        result.infoUpdatedCount += current.infoUpdatedCount
        result.roleUpdatedCount += current.roleUpdatedCount
        result.orderUpdatedCount += current.orderUpdatedCount
      }
      return result
    },
    async maybePromptBackfill (configRows, manual) {
      const targets = (configRows || []).map(item => this.buildBackfillTarget(item)).filter(item => item.id)
      const runnableTargets = targets.filter(item => !this.isFutureBackfillTarget(item))
      if (!runnableTargets.length) {
        if (manual) this.$vgo.tip(targets.length ? '未来时间的配置不允许回写' : '未找到可回写的配置', 'info')
        return
      }

      this.backfillBusy = true
      try {
        const preview = await this.buildBackfillPreview(runnableTargets)
        const hasWritableRows = preview.infoWillUpdateCount > 0 || preview.roleWillUpdateCount > 0 || preview.orderWillUpdateCount > 0
        const hasHistoricalHints = preview.hasHistoricalData || hasWritableRows || preview.infoSwitchConflictCount > 0 || preview.roleSwitchConflictCount > 0 || preview.orderSwitchConflictCount > 0

        if (!hasHistoricalHints) {
          if (manual) this.$vgo.tip('当前配置未匹配到可回写的历史数据', 'info')
          return
        }

        await new Promise(resolve => {
          this.$vgo.open(() => {
            ;(async () => {
              try {
                const result = await this.runBackfill(runnableTargets)
                this.$vgo.tip(`回写完成。注册 ${result.infoUpdatedCount}，角色 ${result.roleUpdatedCount}，订单 ${result.orderUpdatedCount}。`, 'success')
                this.getCfgList()
              } finally {
                resolve()
              }
            })().catch(() => {})
          }, this.buildBackfillMessage(preview, manual), {
            title: '回写',
            confirmText: '立即回写',
            cancelText: manual ? '取消' : '稍后',
            cancelCb: () => {
              if (!manual) this.$vgo.tip('已保存，可在列表中稍后手动回写', 'info')
              resolve()
            },
          })
        })
      } finally {
        this.backfillBusy = false
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.opt-bar {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
