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
        li.hand(
          v-permission='\'department.dept.edit\'',
          @click='showDptEditDlg(true)'
        ) 编辑
        li.hand(
          v-permission='\'department.dept.delete\'',
          @click='showDelDepart'
        ) 删除

    .user-list.mgl2.pd2
      .ff-rn.fs-m.bg-white.pd2.opt-bar
        .flex-1.ai-center.mgl1
          el-breadcrumb(separator-class='el-icon-arrow-right')
            el-breadcrumb-item(v-for='(item, index) in Tree.path') {{ item }}
        .flex-1.jc-end.ai-center
          span.mgr2.omit 是否包含离职人员?
          el-switch.mgr2(
            v-model='User.isIncludeNoJob',
            @change='onSwitcherChange'
          )
          el-button(
            v-permission='\'department.user.add\'',
            icon='el-icon-plus',
            type='primary',
            @click='showMbEditDlg(null, false)'
          ) 新增人员
          el-button(
            v-permission='\'department.dept.add\'',
            icon='el-icon-plus',
            type='primary',
            @click='showDptEditDlg(false)'
          ) 新增部门

      el-table.mgt2(
        :data='User.userList.filter((data) => !search || data.realName.toLowerCase().includes(search.toLowerCase()))',
        max-height='600'
      )
        el-table-column(prop='realName', label='姓名')
          template(slot-scope='{ row }')
            span(:class='{ danger: isLeader(row) }') {{ row.realName }}
        el-table-column(prop='dptName', label='所属部门', sortable, width='150px')
        el-table-column(prop='phoneNumber', label='手机号', width='120px')
        el-table-column(prop='level', label='等级', sortable)
          template(slot-scope='{ row }') {{ row.level | formatLevel }}
        el-table-column(prop='job', label='岗位', sortable)
          template(slot-scope='{ row }') {{ row.job | formatJob }}
        el-table-column(prop='experiences', label='经验值')
        el-table-column(prop='workingStatus', label='在职状态')
          template(slot-scope='{ row }')
            span(:class='workStatus[row.workingStatus].class') {{ workStatus[row.workingStatus].status }}
        el-table-column(prop='userStatus', label='锁定状态')
          template(slot-scope='{ row }')
            .ff-rn.danger(v-if='!row.lockoutEnabled')
              span 已锁定
            .ff-rn(v-else)
              span 正常
        el-table-column(prop='operate', label='操作', width='200')
          template(slot='header', slot-scope='scope')
            el-input(
              v-model='search',
              placeholder='输入姓名搜索',
              size='mini',
              clearable
            )
          template(slot-scope='{ row }')
            el-button(
              v-permission='\'department.user.edit\'',
              icon='el-icon-edit-outline',
              type='text',
              @click='showMbEditDlg(row, true)'
            ) 编辑
            el-button(
              v-permission='\'department.user.lock\'',
              icon='el-icon-lock',
              type='text',
              v-if='row.lockoutEnabled',
              @click='lockUser(row)'
            ) 锁定
            el-button(
              v-permission='\'department.user.unlock\'',
              icon='el-icon-unlock',
              type='text',
              v-else,
              @click='unlockUser(row)'
            ) 解锁
            el-button(
              v-permission='\'department.user.resetPwd\'',
              type='text',
              @click='resetPad(row)'
            ) 重置密码

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
      workStatus: [
        {
          status: '未知',
          class: '',
        },
        {
          status: '在职',
          class: '',
        },
        {
          status: '离职',
          class: 'danger',
        },
        {
          status: '离职超3个月',
          class: 'danger',
        },
      ],
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
      hasCalCount: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    this.getDepartTree()
  },
  methods: {
    buildDepartmentTree (departments = []) {
      if (departments.some(item => Array.isArray(item.departments) && item.departments.length > 0)) {
        return departments
      }

      const nodes = departments.map(item => ({
        ...item,
        departments: [],
      }))
      const byId = new Map(nodes.map(item => [item.id, item]))
      const roots = []

      nodes.forEach(item => {
        const parentId = item.superiorDepartmentId !== undefined
          ? item.superiorDepartmentId
          : item.SuperiorDepartmentId
        if (parentId && byId.has(parentId)) {
          byId.get(parentId).departments.push(item)
        } else {
          roots.push(item)
        }
      })

      return roots
    },
    getManagedDepartmentIds () {
      if (Array.isArray(this.userInfo.resDepartmentIds) && this.userInfo.resDepartmentIds.length) {
        return this.userInfo.resDepartmentIds.filter(id => id !== 0)
      }
      if (this.userInfo.resDepartmentId && this.userInfo.resDepartmentId !== 0) {
        return [this.userInfo.resDepartmentId]
      }
      return []
    },
    getDefaultDepartmentId () {
      const departmentIds = this.getManagedDepartmentIds()
      return departmentIds[0] || ''
    },
    getDptNameList (departments = this.Tree.departTree) {
      this.Dpt.dptNameList = []
      const walk = (list = []) => {
        for (const item of list) {
          this.Dpt.dptNameList[item.id] = item
          if (item.departments && item.departments.length > 0) {
            walk(item.departments)
          }
        }
      }
      walk(departments)
    },
    getDepartTree () {
      this.Tree.departTree.splice(0, this.Tree.departTree.length)
      this.getDptNameList([])
      const departmentIds = this.getManagedDepartmentIds()
      const loadDepartments = this.userInfo.isAdmin
        ? this.$api.getAllDeparts()
        : (!departmentIds.length
          ? Promise.resolve([])
          : Promise.all(departmentIds.map(departmentId => this.$api.getDepartById(departmentId))))
      loadDepartments.then(res => {
        const departments = Array.isArray(res) ? res : (res ? [res] : [])
        const treeDepartments = this.userInfo.isAdmin
          ? this.buildDepartmentTree(departments)
          : departments
        this.Tree.departTree.push(...treeDepartments)
        this.getDptNameList(this.Tree.departTree)
        this.$nextTick(function () {
          // DOM 更新了
          const defaultDepartmentId = this.Tree.curDptId === ''
            ? (this.getDefaultDepartmentId() || (this.Tree.departTree[0] && this.Tree.departTree[0].id))
            : this.Tree.curDptId
          this.setCurrSelecNode(defaultDepartmentId)
        })
      })
    },
    setCurrSelecNode (departMentId) {
      if (!departMentId) {
        return
      }
      this.Tree.curDptId = departMentId
      this.$refs.tree.setCurrentKey(departMentId)
      this.$api.getDepartMembers(departMentId, !this.User.isIncludeNoJob).then(data => {
        // 增加部门字段
        for (const item of data) {
          item.dptName = this.Dpt.dptNameList[item.departmentId]
            ? this.Dpt.dptNameList[item.departmentId].name
            : ''
        }
        this.User.userList = data

        // 计算部门人数
        this.caclDptUserCnt()
        this.updatePath()
      })
    },
    caclDptUserCnt () {
      // 先计算出每个部门id有多少人
      const dptMemberCntMap = new Map()
      for (const user of this.User.userList) {
        if (dptMemberCntMap.get(user.departmentId)) {
          const count = dptMemberCntMap.get(user.departmentId)
          dptMemberCntMap.set(user.departmentId, (count + 1))
        } else {
          dptMemberCntMap.set(user.departmentId, 1)
        }
      }
      // 遍历部门树，给部门名称增加人数字符串
      // 如果有子部门，那么这个部门人数是本节点人数+所有子节点人数
      for (const root of this.Tree.departTree) {
        this.calcChildDptUserCnt(root, dptMemberCntMap)
      }
    },
    calcChildDptUserCnt (node, map) {
      if (map.get(node.id)) {
        node.userCount = map.get(node.id)
      } else {
        node.userCount = 0
      }
      if (node.departments && node.departments.length > 0) {
        for (const child of node.departments) {
          this.calcChildDptUserCnt(child, map)
          node.userCount += child.userCount
        }
      }
      const regex = /([0-9])/
      if (regex.test(node.name)) {
        node.name = node.name.split('(')[0]
      }
      node.pathname = JSON.parse(JSON.stringify(node.name))
      node.name += `(${node.userCount}人)`
      // console.log(node.name)
    },
    handleNodeClick (data) {
      this.Tree.curTreeNode = data
      this.Tree.curDptId = data.id
      this.$api.getDepartMembers(data.id, !this.User.isIncludeNoJob).then(data => {
        // 增加部门字段
        for (const item of data) {
          item.dptName = this.Dpt.dptNameList[item.departmentId]
            ? this.Dpt.dptNameList[item.departmentId].name
            : ''
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
          this.Tree.curDptId = this.getDefaultDepartmentId()
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
        const department = this.Dpt.dptNameList[key]
        if (Array.isArray(department.managerUserIds) && department.managerUserIds.includes(row.id)) {
          return true
        }
        if (!department.managerUserIds && department.userId === row.id) {
          return true
        }
      }
      return false
    },
    updatePath () {
      this.Tree.path.splice(0, this.Tree.path.length)
      for (const root of this.Tree.departTree) {
        if (this.getNodePath(root)) {
          break
        }
      }
      this.Tree.path.reverse()
    },
    onSwitcherChange () {
      this.setCurrSelecNode(this.Tree.curDptId)
    },
    getNodePath (node) {
      if (node.id === Number(this.Tree.curDptId)) {
        this.Tree.path.push(node.pathname)
        return true
      } else {
        if (node.departments && node.departments.length > 0) {
          for (const child of node.departments) {
            const found = this.getNodePath(child)
            if (found) {
              this.Tree.path.push(node.pathname)
              return found
            }
          }
        }
      }
      return false
    },
    // 清除人数
    clearUserCount (node) {
      if (node.departments && node.departments.length > 0) {
        for (const child of node.departments) {
          this.clearUserCount(child)
          node.userCount = 0
        }
      }
      node.pathname = JSON.parse(JSON.stringify(node.name))
      node.name += `(${node.userCount}人)`
    },
    resetPad (user) {
      this.$vgo.open(() => {
        this.$api.resetPassword(user.username).then(res => {
          this.$vgo.tip(res, 'success')
        })
      }, `是否确认重置 { ${user.realName} } 密码`)
    },
  },
}
</script>
<style lang='stylus' scoped>
.Depart {
  .org-tree {
    width: 20%;

    >>>.el-tree-node__label {
      font-size: 14px !important;
    }
  }

  .user-list {
    width: 80%;
  }

  .tree_menu {
    position: fixed;
    display: block;
    background-color: #fff;
    transform: translateX(15px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  ul li {
    padding: 8px 15px;
  }

  ul li:hover {
    background-color: #ebeef5;
  }
}
</style>
