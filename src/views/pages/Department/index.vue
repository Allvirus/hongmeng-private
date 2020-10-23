<template lang='pug'>
.Depart
  .ff-rn
    .org-tree.bg-white.pd3
      el-tree(
        :data='Tree.departTree',
        @node-contextmenu='rightClick',
        node-key='id',
        default-expand-all,
        highlight-current,
        :expand-on-click-node='false',
        :props='props',
        ref='tree',
        @node-click='handleNodeClick'
      )
    #perTreeMenu.tree_menu(
      v-if='Tree.ctxMnuShow',
      :style='{ ...Tree.rightMenu }'
    )
      ul.border-radius
        li.hand(@click='showDptEditDlg(true)') 编辑
        li.hand(@click='showDelDepart') 删除

    .user-list.mgl2.pd2
      .ff-rn.fs-m.bg-white.pd2.opt-bar
        .flex-1.ai-center.mgl1
          el-breadcrumb(separator-class="el-icon-arrow-right")
            el-breadcrumb-item(v-for="(item,index) in Tree.path") {{item}}
        .flex-1.jc-end.ai-center
          span.mgr2.omit 是否包含离职人员?
          el-switch.mgr2(v-model="User.isIncludeNoJob" @change="onSwitcherChange")
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

      el-table.mgt2(:data='User.userList.filter(data => !search || data.realName.toLowerCase().includes(search.toLowerCase()))'
        max-height="600")
        el-table-column(prop='realName', label='姓名')
          template(slot-scope='{ row }')
            span(:class="{ 'danger': isLeader(row) }") {{row.realName}}
        el-table-column(prop='dptName', label='所属部门')
        el-table-column(prop='phoneNumber', label='手机号')
        el-table-column(prop='level', label='等级')
          template(slot-scope='{ row }') {{ row.level | formatLevel }}
        el-table-column(prop='job', label='岗位')
          template(slot-scope='{ row }') {{ row.job | formatJob }}
        el-table-column(prop='experiences', label='经验值')
        el-table-column(prop='workingStatus', label='在职状态')
          template(slot-scope='{ row }')
            .ff-rn.danger(v-if='!row.workingStatus')
              span 已离职
            .ff-rn(v-else)
              span 在职
        el-table-column(prop='userStatus', label='锁定状态')
          template(slot-scope='{ row }')
            .ff-rn.danger(v-if='!row.lockoutEnabled')
              span 已锁定
            .ff-rn(v-else)
              span 正常
        el-table-column(prop='operate', label='操作' width="200")
          template(slot="header" slot-scope="scope")
            el-input(v-model="search" placeholder="输入姓名搜索" size="mini")
          template(slot-scope='{ row }')
            el-button(
              icon='el-icon-edit-outline',
              type='text',
              @click='showMbEditDlg(row, true)'
            ) 编辑
            el-button(
              icon='el-icon-lock',
              type='text',
              v-if='row.lockoutEnabled',
              @click='lockUser(row)'
            ) 锁定
            el-button(
              icon='el-icon-unlock',
              type='text',
              v-else,
              @click='unlockUser(row)'
            ) 解锁

    user-edit(
      :treeData='Tree.departTree',
      :userId='User.userId',
      :show='User.newUserDlg',
      @cancel='cancelMbEdit',
      @editchange='setCurrSelecNode'
    )
    depart-edit(
      :data='Dpt.editDptInfo',
      :show='Dpt.newDepartDlg',
      @cancel='Dpt.newDepartDlg = false',
      @success='newDptSuccess'
    )
</template>
<script>
import { mapGetters } from 'vuex'
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
        isIncludeNoJob: false, // 是否在职
      },
      Dpt: {
        newDepartDlg: false, // 部门编辑对话框是否可见
        editDptInfo: null, // 编辑部门信息
        dptNameList: [], // 部门名称信息，用来显示人员所属部门
      },
      Tree: {
        departTree: [], // 部门树
        rightMenu: '',
        ctxMnuShow: false,
        curNode: {},
        curTreeNode: null, // 当前选择显示的部门人员
        curDptId: '',
        path: [],
      },
      search: '',
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    this.getDepartTree()
    this.getDptNameList()
  },
  methods: {
    getDptNameList () {
      this.$api.getAllDeparts().then(data => {
        for (const item of data) {
          this.Dpt.dptNameList[item.id] = item
        }
      })
    },
    getDepartTree () {
      this.Tree.departTree.splice(0, this.Tree.departTree.length)
      this.$api.getDepartById(this.userInfo.resDepartmentId).then(res => {
        this.Tree.departTree.push(res)
        this.$nextTick(function () {
          // DOM 更新了
          this.setCurrSelecNode(this.Tree.curDptId === '' ? this.userInfo.resDepartmentId : this.Tree.curDptId)
          this.updatePath()
        })
      })
    },
    setCurrSelecNode (departMentId) {
      this.Tree.curDptId = departMentId
      this.$refs.tree.setCurrentKey(departMentId)
      this.$api.getDepartMembers(departMentId, !this.User.isIncludeNoJob).then(data => {
        // 增加部门字段
        for (const item of data) {
          item.dptName = this.Dpt.dptNameList[item.departmentId].name
        }
        this.User.userList = data
      })
    },
    handleNodeClick (data) {
      this.Tree.curTreeNode = data
      this.Tree.curDptId = data.id
      this.$api.getDepartMembers(data.id, !this.User.isIncludeNoJob).then(data => {
        // 增加部门字段
        for (const item of data) {
          item.dptName = this.Dpt.dptNameList[item.departmentId].name
        }
        this.User.userList = data
      })
      this.Tree.ctxMnuShow = false
      this.updatePath()
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
      this.Dpt.editDptInfo = isEdit ? this.Tree.curTreeNode : null
      this.Dpt.newDepartDlg = true
    },
    // 创建部门成功
    newDptSuccess (data) {
      this.Dpt.newDepartDlg = false
      this.Tree.curDptId = data.id
      this.getDepartTree()
    },
    // 删除部门
    showDelDepart () {
      if (!this.Tree.curTreeNode.id) {
        return
      }
      let tipMsg = ''
      if (this.Tree.curTreeNode.departments.length > 0) {
        tipMsg = '您确定要删除"' + this.Tree.curTreeNode.name + '"以及所有子部门?'
      } else {
        tipMsg = '您确定要删除"' + this.Tree.curTreeNode.name + '"?'
      }

      this.$vgo.open(() => {
        this.$api.delDepart(this.Tree.curTreeNode.id).then(data => {
          this.$vgo.tip('已删除!', 'success')
          this.Tree.curDptId = this.userInfo.resDepartmentId
          this.getDepartTree()
        })
      }, tipMsg)
    },
    // 右击公司部门树
    rightClick (e, data, node, comp) {
      this.Tree.curTreeNode = JSON.parse(JSON.stringify(data))
      this.Tree.rightMenu = { top: e.pageY + 'px', left: e.pageX + 'px' }
      this.Tree.ctxMnuShow = true
      document.onclick = (ev) => {
        if (ev.target !== document.getElementById('perTreeMenu')) {
          this.Tree.ctxMnuShow = false
        }
      }
    },
    lockUser (row) {
      this.$vgo.open(() => {
        this.$api.lockUser(row.id).then(data => {
          this.$vgo.tip('锁定成功!', 'success')
          this.setCurrSelecNode(this.Tree.curDptId)
        })
      }, '您确定要锁定该用户吗?')
    },
    unlockUser (row) {
      this.$vgo.open(() => {
        this.$api.unlockUser(row.id).then(data => {
          this.$vgo.tip('解锁成功!', 'success')
          this.setCurrSelecNode(this.Tree.curDptId)
        })
      }, '您确定要解锁该用户吗?')
    },
    isLeader (row) {
      for (const key in this.Dpt.dptNameList) {
        if (this.Dpt.dptNameList[key].userName === row.realName) {
          return true
        }
      }
      return false
    },
    updatePath () {
      this.Tree.path.splice(0, this.Tree.path.length)
      this.getNodePath(this.Tree.departTree[0])
      this.Tree.path.reverse()
    },
    onSwitcherChange () {
      this.setCurrSelecNode(this.Tree.curDptId)
    },
    getNodePath (node) {
      if (node.id === Number(this.Tree.curDptId)) {
        this.Tree.path.push(node.name)
        return true
      } else {
        if (node.departments.length > 0) {
          for (const child of node.departments) {
            const found = this.getNodePath(child)
            if (found) {
              this.Tree.path.push(node.name)
              return found
            }
          }
        }
      }
      return false
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
    background-color #fff
    transform translateX(15px)
    box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  ul li
    padding 8px 15px
  ul li:hover
    background-color #ebeef5
</style>
