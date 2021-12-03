<template lang='pug'>
.RoleList
  el-button(type="primary" @click="addRole") 添加角色
  el-table.mgt2(
    :data='roleList',
  )
    el-table-column(prop='name', label='角色名称')
    el-table-column(prop='operate', label='操作')
      template(slot-scope='{ row }')
        el-button(
          icon='el-icon-edit-outline',
          type='text',
          @click='showEditDlg(row)'
        ) 编辑
        el-button.danger(
          icon='el-icon-delete',
          type='text',
          @click='deleteRole(row)'
        ) 删除

  el-dialog(
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="30%")
    .role-box
      .namebox
        span 角色名字：
        el-input.mgl1(v-model="RoleObj.name" :disabled="isModify" clearable placeholder="请输入名称")
      .menubox.mgt3
        span 菜单列表：
        el-tree(
          ref="tree"
          node-key="id"
          :props="defProps"
          :data="MenuList"
          show-checkbox
          @check-change="handleCheckChange")
    span(span slot="footer" class="dialog-footer")
      el-button(@click="handleClose") 取消
      el-button(type="primary" @click="determine") 确定
</template>
<script>
// createRole
export default {
  name: 'RoleList',
  data () {
    return {
      roleList: [],
      MenuList: [],
      search: '',
      dptName: '',
      dialogVisible: false,
      title: '修改角色',
      isModify: false,
      RoleObj: {
        menusList: [],
        name: '',
        id: '',
      },
      defProps: {
        children: 'children',
        label: 'title',
        valKey: 'id',
      },
    }
  },
  computed: {
  },
  created () {
    this.getRoleControllerList()
    this.getRoleMenuList()
  },
  methods: {
    getRoleControllerList () {
      this.$api.getRoleController().then(res => {
        this.roleList = res
      })
    },
    getRoleMenuList () {
      this.$api.getRoleMenu().then(res => {
        this.MenuList = res
      })
    },
    addRole () {
      this.isModify = false
      this.title = '添加角色'
      this.dialogVisible = true
      this.RoleObj = {
        name: '',
        id: '',
        menusList: [],
      }
    },
    showEditDlg (row) {
      this.$api.getRoleMenuPower(row.id).then(res => {
        if (res.menusList) {
          this.menusList = res.menusList
          this.RoleObj = {
            name: row.name,
            id: row.id,
          }
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.menusList, true)
          })

          this.isModify = true
          this.dialogVisible = true
          this.title = '修改角色'
        }
      })
    },
    determine () {
      if (!this.RoleObj.name || this.RoleObj.menusList.length === 0) {
        this.$vgo.tip('请输入完整信息', 'error')
        return false
      }
      if (this.isModify) {
        // 修改
        this.$api.updateRole(this.RoleObj).then(res => {
          if (res.code === 200) {
            this.$vgo.tip('修改角色成功', 'success')
            this.RoleObj = {
              name: '',
              menusList: [],
              id: '',
            }
            this.$refs.tree.setCheckedNodes([])
            this.getRoleControllerList()
            this.dialogVisible = false
          } else {
            this.$vgo.tip('更新角色失败，请重试', 'error')
          }
        })
      } else {
        // 创建
        this.$api.createRole(this.RoleObj).then(res => {
          this.$vgo.tip('创建角色成功', 'success')
          this.RoleObj = {
            name: '',
            menusList: [],
            id: '',
          }
          this.$refs.tree.setCheckedNodes([])
          this.getRoleControllerList()
          this.dialogVisible = false
        })
      }
    },
    deleteRole (row) {
      this.$vgo.open(() => {
        this.$api.deleteRole(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.getRoleControllerList()
        })
      })
    },
    handleClose () {
      this.RoleObj = {
        name: '',
        menusList: [],
        id: '',
      }
      this.$refs.tree.setCheckedNodes([])
      this.dialogVisible = false
    },
    handleCheckChange (item) {
      const nodes = this.$refs.tree.getCheckedNodes()
      const ckArr = []
      nodes.forEach(item => {
        ckArr.push(item.id)
      })
      this.RoleObj.menusList = ckArr
    },
  },
}
</script>
<style lang='stylus' scoped>
  .el-tree
    margin-left 50px
</style>
