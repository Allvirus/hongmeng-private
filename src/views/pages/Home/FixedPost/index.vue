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
      el-form-item.mgl3(label='注册时间:')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(
          v-permission='\'bizconf.query\'',
          icon='el-icon-search',
          type='primary',
          @click='searchCfg'
        ) 搜索
        el-button.mgl2(
          v-permission='\'bizconf.query\'',
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置
    .flex-1.jc-end
      el-button(
        v-permission='\'bizconf.add\'',
        icon='el-icon-plus',
        type='primary',
        @click='showEditDlg(false, null)'
      ) 新增配置

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
          icon='el-icon-edit-outline',
          type='text',
          @click='showEditDlg(true, row)'
        ) 编辑
        el-button.mgl2.danger(
          v-permission='\'bizconf.delete\'',
          icon='el-icon-delete',
          type='text',
          @click='deleteCfg(row)'
        ) 删除

  el-pagination.margin-spacing(
    :total='count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getCfgList'
  )

  //- 编辑、新增对话框
  el-dialog(
    :title='cfgInfo.isEdit ? "编辑" : "新增"',
    @close='cancelEdit',
    :visible.sync='editDlgVisiable',
    width='600px'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='A岗:', required)
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
        el-form-item(label='B岗:', required)
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
        el-form-item(label='C岗:', required)
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
        el-form-item(label='时间:', required, v-if='!cfgInfo.isEdit')
          CommonDatePicker.mgl1(
            :start.sync='cfgInfo.row.startTime',
            :end.sync='cfgInfo.row.endTime',
            type='datetimerange',
            all
          )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancelEdit') 取消
      el-button.mgl3(
        v-permission='cfgInfo.isEdit ? \'bizconf.edit\' : \'bizconf.add\'',
        type='primary',
        @click='submmitEdit'
      ) 提交
</template>
<script>
import { mapGetters } from 'vuex'
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
        endTime: '',
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
      this.$utils.autoFillDateTime(this.model)
      this.getCfgList()
    },
    reset () {
      this.model.startTime = ''
      this.model.endTime = ''
      this.model.userId = ''
      this.getCfgList()
    },
    loadOptions () {
      // 获取部门列表数据
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
    submmitEdit () {
      const params = this.cfgInfo.row
      if (!this.checkFormData(this.cfgInfo.row)) {
        return false
      }

      if (this.cfgInfo.isEdit) {
        // 更新
        params.id = this.cfgInfo.row.id
        this.$api.modifiedBusinessById(params).then(res => {
          this.$vgo.tip('更新成功', 'success')
          this.cancelEdit()
          this.getCfgList()
        })
      } else {
        // 新增
        this.$api.batchToCreateBusiness(params).then(res => {
          this.$vgo.tip('提交成功', 'success')
          this.cancelEdit()
          this.getCfgList()
        })
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
