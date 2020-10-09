<template lang='pug'>
.Depart
  .ff-rn
    .org-tree.bg-white.pd3
      el-tree(
        :data='Tree.departTree',
        @node-contextmenu='rightClick',
        node_key='id',
        default-expand-all,
        :props='props',
        @node-click='handleNodeClick'
      )
    #perTreeMenu.tree_menu(v-if='Tree.ctxMnuShow', :style='{ ...Tree.rightMenu }')
      ul.border-radius
        li.hand(@click='showDptEditDlg(true)') 编辑
        li.hand(@click='showDelDepart') 删除

    .user-list.mgl2.pd2
      .ff-rn.fs-m.bg-white.pd2.opt-bar
        .flex-1.jc-end
          el-button(
            icon='el-icon-plus',
            type='primary',
            @click='showMbEditDlg(null, false)'
          ) 新增人员
          el-button(
            icon='el-icon-plus',
            type='primary',
            @click='showDptEditDlg(false)'
          ) 新增部门

      el-table.mgt2(:data='User.userList')
        el-table-column(prop='realName', label='姓名')
        el-table-column(prop='phoneNumber', label='手机号')
        el-table-column(prop='level', label='等级')
          template(slot-scope='{ row }') {{ row.level | formatLevel }}
        el-table-column(prop='job', label='岗位')
          template(slot-scope='{ row }') {{ row.job | formatJob }}
        el-table-column(prop='experiences', label='经验值')
        el-table-column(prop='jobStatus', label='在职状态')
        el-table-column(prop='timeRange', label='在职时间')
        el-table-column(prop='operate', label='操作')
          template(slot-scope='{ row }')
            el-button(
              icon='el-icon-edit-outline',
              type='text',
              @click='showMbEditDlg(row, true)'
            ) 编辑

    user-edit(
      :treeData="Tree.departTree"
      :userId='User.userId',
      :show='User.newUserDlg',
      @cancel='cancelMbEdit',
      @editchange='handleNodeClick(Dpt.curClickDpt)'
    )
    depart-edit(
      :data='Dpt.editDptInfo',
      :show='Dpt.newDepartDlg',
      @cancel='Dpt.newDepartDlg = false',
      @success='newDptSuccess'
    )
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
      User: {
        newUserDlg: false, // 人员编辑对话框是否可见
        userId: 0, // 编辑的人员信息
        userList: [], // 部门人员列表
      },
      Dpt: {
        newDepartDlg: false, // 部门编辑对话框是否可见
        editDptInfo: null, // 编辑部门信息
        curClickDpt: null, // 当前选择显示的部门人员
      },
      Tree: {
        departTree: [], // 部门树
        rightMenu: '',
        ctxMnuShow: false,
      },
    }
  },
  created: function () {
    this.getDepartTree()
  },
  methods: {
    getDepartTree () {
      this.Tree.departTree.splice(0, this.Tree.departTree.length)
      const id = 1
      this.$api.getDepartById(id).then(res => {
        this.Tree.departTree.push(res)
      })
    },
    handleNodeClick (data) {
      this.Dpt.curClickDpt = data
      if (data && data.departments.length === 0) {
        this.$api.getDepartMembers(data.id).then(data => {
          this.User.userList = data
        })
      }
    },
    // 取消人员编辑框
    cancelMbEdit () {
      this.User.newUserDlg = false
      this.User.userId = 0
    },
    // 显示编辑人员对话框
    showMbEditDlg (row, isEdit) {
      this.User.userId = isEdit ? row.id : 0
      this.User.newUserDlg = true
    },
    // 编辑部门
    showDptEditDlg (isEdit) {
      this.Dpt.editDptInfo = isEdit ? this.Dpt.curClickDpt : null
      this.Dpt.newDepartDlg = true
    },
    // 创建部门成功
    newDptSuccess () {
      this.Dpt.newDepartDlg = false
      this.getDepartTree()
    },
    // 删除部门
    showDelDepart () {
      if (!this.Dpt.curClickDpt.id) {
        return
      }
      let tipMsg = ''
      if (this.Dpt.curClickDpt.departments.length > 0) {
        tipMsg = '您确定要删除"' + this.Dpt.curClickDpt.name + '"以及所有子部门?'
      } else {
        tipMsg = '您确定要删除"' + this.Dpt.curClickDpt.name + '"?'
      }

      this.$vgo.open(() => {
        this.$api.delDepart(this.Dpt.curClickDpt.id).then(data => {
          this.$vgo.tip('已删除!', 'success')
          this.getDepartTree()
        })
      }, tipMsg)
    },
    // 右击公司部门树
    rightClick (e, data, node, comp) {
      this.Dpt.curClickDpt = JSON.parse(JSON.stringify(data))
      this.Tree.rightMenu = { top: e.pageY + 'px', left: e.pageX + 'px' }
      this.Tree.ctxMnuShow = true
      document.onclick = (ev) => {
        if (ev.target !== document.getElementById('perTreeMenu')) {
          this.Tree.ctxMnuShow = false
        }
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
  .tree_menu
    position fixed
    display block
    z-index 20000
    background-color #fff
    transform translateX(15px)
    box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  ul li
    padding 8px 15px
  ul li:hover
    background-color #ebeef5
</style>
