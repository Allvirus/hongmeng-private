<template lang='pug'>
  .Depart
    .ff-rn
      .org-tree.bg-white.pd3
        el-tree(:data="departTree" node_key="id" default-expand-all :props="props" @node-click="handleNodeClick")
      .user-list.mgl2.pd2
        .ff-rn.fs-m.bg-white.pd2.opt-bar
          .flex-1.jc-end
            el-button(icon="el-icon-plus" type="primary" @click="showMbEditDlg(null,false)") 新增人员
            el-button(icon="el-icon-plus" type="primary" @click="newDepartDlg = true") 新增部门

        el-table.mgt2(:data='dptMbLst')
          el-table-column(prop="realName" label="姓名")
          el-table-column(prop="phoneNumber" label="手机号")
          el-table-column(prop="level" label="等级")
            template(slot-scope='{ row }') {{row.level | formatLevel}}
          el-table-column(prop="job" label="岗位")
            template(slot-scope='{ row }') {{row.job | formatJob}}
          el-table-column(prop="experiences" label="经验值")
          el-table-column(prop="jobStatus" label="在职状态")
          el-table-column(prop="timeRange" label="在职时间")
          el-table-column(prop="operate" label="操作")
            template(slot-scope="{ row }")
              el-button(icon="el-icon-edit-outline" type="text" @click="showMbEditDlg(row,true)") 编辑

      user-edit(:data="editMbInfo" :show="newUserDlg" @cancel="cancelMbEdit" )
      depart-edit(:show="newDepartDlg" @cancel="newDepartDlg = false")
</template>
<script>
export default {
  name: '',
  components: {
    UserEdit: () => import('@/views/pages/Department/comps/UserEdit'),
    DepartEdit: () => import('@/views/pages/Department/comps/DepartEdit'),
  },
  data () {
    return {
      props: {
        children: 'departments',
        label: 'name',
      },
      newDepartDlg: false, // 部门编辑对话框是否可见
      newUserDlg: false, // 人员编辑对话框是否可见
      departTree: [], // 部门树
      dptMbLst: [], // 部门人员列表
      editMbInfo: null, // 编辑的人员信息
      editDptInfo: null, // 编辑部门信息
    }
  },
  created: function () {
    this.getDepartTree()
  },
  methods: {
    getDepartTree () {
      const dpList = this.departTree
      dpList.splice(0, dpList.length)
      const id = 1
      this.$api.getDepartById(id).then(res => {
        console.log('getAllDeparts', res)
        this.departTree.push(res)
      })
    },
    handleNodeClick (data) {
      if (data && data.departments.length === 0) {
        this.$api.getDepartMembers(data.id).then(data => {
          console.log('handleNodeClick', data)
          this.dptMbLst = data
        })
      }
    },
    cancelMbEdit () {
      this.newUserDlg = false
      this.editMbInfo = null
    },
    showMbEditDlg (row, isEdit) {
      this.newUserDlg = true
      this.editMbInfo = null
      if (isEdit) {
        this.editMbInfo = row
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.Depart
  .org-tree
    width 20%
    >>>.el-tree-node__label
      font-size 14px !important

  .user-list
    width 80%
</style>
