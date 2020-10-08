<template lang='pug'>
.Depart
  .ff-rn
    .org-tree.bg-white.pd3
      el-tree(
        :data='departTree',
        @node-contextmenu='rightClick',
        node_key='id',
        default-expand-all,
        :props='props',
        @node-click='handleNodeClick'
      )
    #perTreeMenu.tree_menu(v-if='ctxMnuShow', :style='{ ...rightMenu }')
      ul.border-radius
        li.hand(@click='showEditDepart') 编辑
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
            @click='newDepartDlg = true'
          ) 新增部门

      el-table.mgt2(:data='dptMbLst')
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

    user-edit(:data='editMbInfo', :show='newUserDlg', @cancel='cancelMbEdit')
    depart-edit(
      :show='newDepartDlg',
      @cancel='newDepartDlg = false',
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
      newDepartDlg: false, // 部门编辑对话框是否可见
      newUserDlg: false, // 人员编辑对话框是否可见
      departTree: [], // 部门树
      dptMbLst: [], // 部门人员列表
      editMbInfo: null, // 编辑的人员信息
      editDptInfo: null, // 编辑部门信息
      rightMenu: '',
      ctxMnuShow: false,
      optDepartData: {},
    }
  },
  created: function () {
    this.getDepartTree()
  },
  methods: {
    getDepartTree () {
      this.departTree.splice(0, this.departTree.length)
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
    newDptSuccess () {
      this.newDepartDlg = false
      this.getDepartTree()
    },
    showEditDepart () {
      this.$vgo.tip('编辑部门!', 'success')
    },
    showDelDepart () {
      if (!this.optDepartData.id) {
        return
      }
      let tipMsg = ''
      if (this.optDepartData.departments.length > 0) {
        tipMsg = '您确定要删除"' + this.optDepartData.name + '"以及所有子部门?'
      } else {
        tipMsg = '您确定要删除"' + this.optDepartData.name + '"?'
      }

      this.$vgo.open(() => {
        this.$api.delDepart(this.optDepartData.id).then(data => {
          this.$vgo.tip('已删除!', 'success')
          this.getDepartTree()
        })
      }, tipMsg)
    },
    rightClick (e, data, node, comp) {
      console.log('rigclick', data)
      this.optDepartData = data
      this.rightMenu = { top: e.pageY + 'px', left: e.pageX + 'px' }
      this.ctxMnuShow = true
      document.onclick = (ev) => {
        if (ev.target !== document.getElementById('perTreeMenu')) {
          this.ctxMnuShow = false
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
