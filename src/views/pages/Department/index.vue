<template lang='pug'>
  .Depart
    .ff-rn
      .org-tree.bg-white.pd3
        el-tree(:data="model.departsList" node_key="id" :default-expanded-keys="[1,2]" :props="props" @node-click="handleNodeClick")
      .user-list.mgl2.pd2
        .ff-rn.fs-m.bg-white.pd2.opt-bar
          .flex-1.jc-end
            el-button(icon="el-icon-plus" type="primary" @click="newUserDlg = true") 新增人员
            el-button(icon="el-icon-plus" type="primary" @click="showAddDepDlg") 新增部门

        el-table.mgt2(:data='model.userList')
            el-table-column(prop="created" label="姓名")
            el-table-column(prop="amount" label="部门")
            el-table-column(prop="type_text" label="岗位")
            el-table-column(prop="remark" label="工龄")
            el-table-column(prop="remark" label="手机号")
            el-table-column(prop="balance" label="住址")
      user-edit(:visiable="newUserDlg" @cancel="newUserDlg = false" @success="")
      .add-dlg
        el-dialog(title="新增部门" :visible.sync="newDepartDlg" width="35%")
          .flex-center
            el-form(label-width="100px")
              el-form-item(label="部门名称:" required)
                el-input(v-model="model.newDepart.name" placeholder='请输入部门名称' :maxlength='20' show-word-limit)
              el-form-item(label="负责人:" required)
                el-select.mgl1(v-model="model.newDepart.userId" placeholder="请选择")
                  el-option(v-for="item in model.newDepart.userList"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id")
              el-form-item(label="上级部门:" required)
                el-select.mgl1(v-model="model.newDepart.superiorDepartmentId" placeholder="请选择")
                  el-option(v-for="item in model.newDepart.departList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id")
              el-form-item.omit(label="是否A岗部门:" required)
                el-switch( v-model="model.newDepart.IsAjobDepartment" active-text="是" inactive-text="否")
          span.dialog-footer(slot="footer")
            el-button.mgl3(type="warning" @click="cancelAdd") 取消
            el-button.mgl3(type="primary" @click="submmitAddDepart") 提交

</template>
<script>
export default {
  name: '',
  components: {
    UserEdit: () => import('@/views/pages/Department/comps/UserEdit'),
  },
  data () {
    return {
      props: {
        children: 'departments',
        label: 'name',
      },
      model: {
        userList: [],
        departsList: [],
        newDepart: {
          name: '',
          userId: '',
          userList: [],
          superiorDepartmentId: '',
          departList: [],
          IsAjobDepartment: true,
        },
      },
      newDepartDlg: false,
      newUserDlg: false,
    }
  },
  computed: {
  },
  created: function () {
    this.initData()
  },
  methods: {
    initData () {
      this.getDepartTree()
    },
    showAddDepDlg () {
      this.newDepartDlg = true
      this.$api.getAllUser().then(res => {
        console.log('getAllUser', res)
        this.model.newDepart.userList = res
      })

      this.$api.getAllDeparts().then(res => {
        console.log('getAllDepart', res)
        this.model.newDepart.departList = res
      })
    },
    getDepartTree () {
      const dpList = this.model.departsList
      dpList.splice(0, dpList.length)
      const id = 1
      this.$api.getDepartById(id).then(res => {
        console.log('getAllDeparts', res)
        this.model.departsList.push(res)
      })
    },
    handleNodeClick (data) {
    },
    resetFormData () {

    },
    cancelAdd () {
      this.newDepartDlg = false
      this.resetFormData()
    },
    submmitAddDepart () {
      const params = {
        name: this.model.newDepart.name,
        userId: this.model.newDepart.userId,
        superiorDepartmentId: this.model.newDepart.superiorDepartmentId,
        IsAjobDepartment: this.model.newDepart.IsAjobDepartment,
      }
      this.$api.addDepart(params).then(res => {
        console.log('addDepart', res)
        this.$vgo.tip('提交成功', 'success')
        this.newDepartDlg = false
        this.resetFormData()
        this.getDepartTree()
      })
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
