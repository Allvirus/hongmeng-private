<template lang='pug'>
.RoleList
  el-button(v-permission='\'role.add\'', type='primary', @click='addRole') 添加角色
  el-table.mgt2(:data='roleList')
    el-table-column(prop='name', label='角色名称')
    el-table-column(prop='operate', label='操作')
      template(slot-scope='{ row }')
        el-button(
          v-permission='\'role.edit\'',
          icon='el-icon-edit-outline',
          type='text',
          @click='showEditDlg(row)'
        ) 编辑
        el-button.danger(
          v-permission='\'role.delete\'',
          icon='el-icon-delete',
          type='text',
          @click='deleteRole(row)'
        ) 删除

  el-dialog(
    :title='title',
    :visible.sync='dialogVisible',
    :before-close='handleClose',
    width='800px'
  )
    .role-box
      .namebox
        span 角色名字：
        el-input.mgl1(
          v-model='RoleObj.name',
          :disabled='isModify',
          clearable,
          placeholder='请输入名称'
        )
      .role-content.mgt3
        .menu-col
          .col-label 菜单列表：
          el-tree(
            ref='tree',
            node-key='id',
            :props='defProps',
            :data='MenuList',
            show-checkbox,
            @check-change='handleCheckChange'
          )
        .perm-col
          .col-label 按钮权限：
          .perm-empty(v-if='!selectedMenuPermGroups.length') 先勾选左侧菜单，再配置该菜单下的按钮权限
          .perm-modules(v-else)
            .perm-module(
              v-for='mod in selectedMenuPermGroups',
              :key='mod.module'
            )
              .mod-header
                el-checkbox(
                  :indeterminate='isModIndeterminate(mod.module)',
                  :value='isModAllChecked(mod.module)',
                  @change='(val) => handleCheckAllChange(mod.module, val)'
                ) {{ mod.menuTitle }}
                span.mod-subtitle {{ mod.moduleName }}
              el-checkbox-group.perm-items(v-model='RoleObj.permissionList')
                el-checkbox(
                  v-for='perm in mod.permissions',
                  :key='perm.code',
                  :label='perm.code'
                ) {{ perm.name }}
    span.dialog-footer(slot='footer')
      el-button(@click='handleClose') 取消
      el-button(
        v-permission='isModify ? \'role.edit\' : \'role.add\'',
        type='primary',
        @click='determine'
      ) 确定
</template>
<script>
import permDict from '@/doc/权限点字典.json'

const menuPermissionMap = new Map([
  ['部门人员管理', 'department'],
  ['等级管理', 'level'],
  ['每日定岗', 'bizconf'],
  ['业务配置', 'bizconf'],
  ['角色管理', 'role'],
  ['经验明细', 'experience'],
  ['账号关联', 'userbind'],
  ['玩家换绑', 'playerswitch'],
  ['游戏渠道', 'channel'],
  ['薪酬统计', 'salary'],
  ['工资记录', 'salary'],
])
// createRole
export default {
  name: 'RoleList',
  data () {
    return {
      roleList: [],
      MenuList: [],
      permModules: permDict.modules,
      search: '',
      dptName: '',
      dialogVisible: false,
      title: '修改角色',
      isModify: false,
      RoleObj: {
        menusList: [],
        permissionList: [],
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
    selectedMenuPermGroups () {
      const menuIds = new Set(this.RoleObj.menusList)
      const menuNodes = []

      const walk = nodes => {
        nodes.forEach(node => {
          if (menuIds.has(node.id)) {
            menuNodes.push(node)
          }
          if (node.children && node.children.length) {
            walk(node.children)
          }
        })
      }

      walk(this.MenuList)

      const seenModules = new Set()
      return menuNodes.reduce((groups, node) => {
        const moduleKey = menuPermissionMap.get(node.title)
        if (!moduleKey || seenModules.has(moduleKey)) {
          return groups
        }

        const mod = this.permModules.find(item => item.module === moduleKey)
        if (!mod) {
          return groups
        }

        seenModules.add(moduleKey)
        groups.push({
          menuId: node.id,
          menuTitle: node.title,
          module: mod.module,
          moduleName: mod.moduleName,
          permissions: mod.permissions,
        })
        return groups
      }, [])
    },
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
        permissionList: [],
      }
    },
    showEditDlg (row) {
      this.$api.getRoleMenuPower(row.id).then(res => {
        if (res.menusList) {
          this.menusList = res.menusList
          this.RoleObj = {
            name: row.name,
            id: row.id,
            menusList: res.menusList,
            permissionList: res.permissionList || [],
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
              permissionList: [],
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
            permissionList: [],
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
        permissionList: [],
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
      this.syncPermissionByMenus()
    },
    syncPermissionByMenus () {
      const visibleCodes = this.selectedMenuPermGroups.reduce((arr, group) => {
        return arr.concat(group.permissions.map(item => item.code))
      }, [])
      const defaultQueryCodes = this.selectedMenuPermGroups
        .map(group => group.permissions.find(item => item.type === 'query'))
        .filter(Boolean)
        .map(item => item.code)
      this.$set(
        this.RoleObj,
        'permissionList',
        [...new Set([
          ...this.RoleObj.permissionList.filter(code => visibleCodes.includes(code)),
          ...defaultQueryCodes,
        ])]
      )
    },
    getModuleCodes (moduleKey) {
      const mod = this.permModules.find(m => m.module === moduleKey)
      return mod ? mod.permissions.map(p => p.code) : []
    },
    isModAllChecked (moduleKey) {
      const codes = this.getModuleCodes(moduleKey)
      return codes.length > 0 && codes.every(c => this.RoleObj.permissionList.includes(c))
    },
    isModIndeterminate (moduleKey) {
      const codes = this.getModuleCodes(moduleKey)
      const checked = codes.filter(c => this.RoleObj.permissionList.includes(c))
      return checked.length > 0 && checked.length < codes.length
    },
    handleCheckAllChange (moduleKey, val) {
      const codes = this.getModuleCodes(moduleKey)
      if (val) {
        const newList = [...new Set([...this.RoleObj.permissionList, ...codes])]
        this.$set(this.RoleObj, 'permissionList', newList)
      } else {
        this.$set(this.RoleObj, 'permissionList', this.RoleObj.permissionList.filter(c => !codes.includes(c)))
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.role-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.menu-col {
  flex: 0 0 220px;
  min-width: 180px;
}

.perm-col {
  flex: 1;
  max-height: 420px;
  overflow-y: auto;
}

.col-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.perm-empty {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
}

.perm-modules {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 4px 0;
}

.perm-module {
  padding: 8px 12px;
  border-bottom: 1px solid #f5f7fa;

  &:last-child {
    border-bottom: none;
  }
}

.mod-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-weight: 600;
}

.mod-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
}

.perm-items {
  padding-left: 22px;
  display: flex;
  flex-wrap: wrap;
}

.perm-items .el-checkbox {
  width: 48%;
  margin-right: 0;
  margin-bottom: 4px;
  line-height: 1.5;
}
</style>
