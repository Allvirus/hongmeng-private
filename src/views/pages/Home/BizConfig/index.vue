<template lang='pug'>
  .BizConfig
    .ff-rn.fs-m.bg-white.pd2.opt-bar
      el-form.ff-rn(label-width="100px")
        el-form-item(label="注册时间:")
          CommonDatePicker.w300(:start.sync='model.startTime' :end.sync='model.endTime' )
          el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
          el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置
      .flex-1.jc-end
        el-button(icon="el-icon-plus" type="primary" @click="showEditDlg(false,null)") 新增配置

    el-table.mgy2.bg-white.pd2(:data='listMixin.list' :row-class-name="({ row }) => row.is_payout ? 'danger' : ''")
      el-table-column(prop="departmentName" label="部门")
      el-table-column(prop="bUserName" label="B岗")
      el-table-column(prop="cUserName" label="C岗")
      el-table-column(prop="startTime" label="开始时间")
        template(slot-scope="{ row }") {{row.startTime | dateFormat}}
      el-table-column(prop="endTime" label="结束时间")
        template(slot-scope="{ row }") {{row.endTime | dateFormat}}
      el-table-column(prop="operate" label="操作")
        template(slot-scope="{ row }")
          .ff-rn
            el-button.mgl3(icon="el-icon-edit-outline" type="text" @click="showEditDlg(true,row)") 编辑
            el-button.mgl3.danger(icon="el-icon-delete" type="text" @click="deleteCfg(row)") 删除

    el-pagination.margin-spacing(
      :total="listMixin.count"
      :page-size.sync='model.pageSize'
      :current-page.sync='model.page'
      @current-change="getListMixin")

    //- 编辑、新增对话框
    el-dialog(:title="cfgInfo.isEdit?'编辑':'新增'"
      @close="cancelEdit"
      :visible.sync="editDlgVisiable" width="35%")
      .flex-center
        el-form(label-width="100px")
          el-form-item(label="部门名称:" required)
            el-select.mgl1(v-model="cfgInfo.row.departmentId"
              @change="onDepartChange"
              placeholder="请选择")
              el-option(v-for="item in cfgInfo.departList"
              :key="item.id"
              :label="item.name"
              :value="item.id")
          el-form-item(label="B岗:" required)
            el-select.mgl1(v-model="cfgInfo.row.bUserId"
              @change="onBJobChange"
              placeholder="请选择")
              el-option(v-for="item in cfgInfo.BUserList"
              :key="item.id"
              :label="item.realName"
              :value="item.id")
          el-form-item(label="C岗:" required)
            el-select.mgl1(v-model="cfgInfo.row.cUserId"
              @change="onCJobChange"
              placeholder="请选择")
              el-option(v-for="item in cfgInfo.CUserList"
              :key="item.id"
              :label="item.realName"
              :value="item.id")
          el-form-item(label="时间:" required)
            CommonDatePicker(:start.sync='cfgInfo.row.startTime'
              :end.sync='cfgInfo.row.endTime' type='datetimerange' future)
      span.dialog-footer(slot="footer")
        el-button.mgl3(type="warning" @click="cancelEdit") 取消
        el-button.mgl3(type="primary" @click="submmitEdit") 提交

</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'BizConfig',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getBizConfig',
      model: {
        page: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        departmentId: 0,
        bUserId: 0,
        cUserId: 0,
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
          departmentId: '',
          departmentName: '',
          bUserId: '',
          bUserName: '',
          cUserId: '',
          cUserName: '',
        },
        departList: [],
        BUserList: [],
        CUserList: [],
      },
    }
  },
  created: function () {
    this.loadOptions()
  },
  methods: {
    search () {
      this.getListMixin()
    },
    reset () {
      this.model.startTime = ''
      this.model.endTime = ''
      this.getListMixin()
    },
    loadOptions () {
      // 获取部门列表数据
      this.$api.getAJobs().then(res => {
        this.cfgInfo.departList = res
      })

      this.$api.getBJobs().then(res => {
        console.log('getBJobs', res)
        this.cfgInfo.BUserList = res
      })

      this.$api.getCJobs().then(res => {
        this.cfgInfo.CUserList = res
      })
    },
    editItem (row) {
      console.log('editeItem', row)
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
        this.$api.delBizCfg(row.id).then(res => {
          this.afterModifyGetListMixin(1, 1)
          this.getListMixin()
        })
      })
    },
    cancelEdit () {
      this.editDlgVisiable = false
      this.cfgInfo.row = {
        startTime: '',
        endTime: '',
        departmentId: '',
        departmentName: '',
        bUserId: '',
        bUserName: '',
        cUserId: '',
        cUserName: '',
      }
    },
    onDepartChange (value) {
      for (const item of this.cfgInfo.departList) {
        if (item.id === value) {
          this.cfgInfo.row.departmentName = item.name
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
    getLabel (value, list) {
      for (const item of list) {
        if (item.id === value) {

        }
      }
    },
    checkFormData (row) {
      let msg = ''
      if (row.departmentId === '') {
        msg = '请选择部门'
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
        return
      }

      if (this.cfgInfo.isEdit) {
        // 更新
        params.id = this.cfgInfo.row.id
        this.$api.updateCfgByIf(params).then(res => {
          this.$vgo.tip('更新成功', 'success')
          this.cancelEdit()
          this.getListMixin()
        })
      } else {
        // 新增
        this.$api.addBizCfg(params).then(res => {
          this.$vgo.tip('提交成功', 'success')
          this.cancelEdit()
          this.getListMixin()
        })
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.opt-bar
  .el-form-item
    margin-bottom 0px
</style>
