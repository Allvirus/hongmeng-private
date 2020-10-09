<template lang='pug'>
.user-edit
  el-dialog(
    :title='userId !== 0 ? "编辑" : "新增"',
    :visible.sync='isShow',
    width='35%',
    @close='cancel'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='姓名:', required)
          el-input(
            v-model='userInfo.realName',
            placeholder='请输入姓名',
            :maxlength='20',
            show-word-limit
          )
        el-form-item(label='入职日期:', required)
          CommonDatePicker(type='date', v-model='userInfo.hiredate' all)
        el-form-item(label='部门:', required)
          tree-selector(
            ref='treesel',
            :data='treeData',
            :defProps='defProps',
            nodeKey='id',
            :deflabel='userInfo.dptName',
            @change='onDepartChange'
          )
        el-form-item(label='岗位:', required)
          el-select(v-model='userInfo.job', placeholder='请选择')
            el-option(
              v-for='(item, index) in jobs',
              :key='index',
              :label='item',
              :value='index'
            )
        el-form-item(label='角色:', required)
          el-select(v-model='userInfo.roleId', placeholder='请选择')
            el-option(
              v-for='item in roles',
              :key='item.id',
              :label='item.name',
              :value='item.id'
            )
        el-form-item(label='推广员账户:', required)
          el-input(v-model='userInfo.account', placeholder='请输入推广员账户')
        el-form-item(label='工号:')
          el-input(v-model='userInfo.jobNumber', placeholder='请输入工号')
        el-form-item(label='手机号:')
          el-input(
            v-model='userInfo.phoneNumber',
            placeholder='请输入手机号',
            type='tel'
          )
        el-form-item(label='备注:')
          el-input(v-model='userInfo.remark')
        //- el-form-item(label='manageDepartmentId:', required)
        //-   el-input(v-model='userInfo.manageDepartmentId', placeholder='请输入账户' type='tel')
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancel') 取消
      el-button.mgl3(type='primary', @click='submmit') 提交
</template>
<script>
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Number,
      default: 0,
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data () {
    return {
      userInfo: {
        realName: '',
        phoneNumber: '',
        account: '',
        departmentId: '',
        job: '',
        roleId: '',
        hiredate: '',
        remark: '',
        jobNumber: '',
        manageDepartmentId: '',
        dptName: '',
      },
      jobs: ['A岗', 'B岗', 'C岗', '管理'],
      roles: [],
      isShow: false,
      defProps: {
        children: 'departments',
        label: 'name',
        valKey: 'id',
      },
    }
  },
  watch: {
    show (newValue, oldValue) {
      this.isShow = newValue
      // 获取部门树
      if (this.userId !== 0) {
        // 编辑
        this.$api.getUserInfoById(this.userId).then(data => {
          console.log('edituser', data)
          this.userInfo = data
          this.userInfo.id = this.userId
          this.userInfo.dptName = this.findDptName(this.userInfo.departmentId, this.treeData)
        })
      } else {
        // 新建
        this.userInfo.dptName = ''
      }
    },
    immediate: true,
  },
  created () {
    this.getRoles()
  },
  methods: {
    getRoles () {
      this.$api.getRoles().then(data => {
        this.roles = data
      })
    },
    findDptName (id, data) {
      for (const key in data) {
        if (data[key].departments.length > 0) {
          const dptName = this.findDptName(id, data[key].departments)
          if (dptName !== '') {
            return dptName
          }
        }
        if (id === data[key].id) {
          return data[key].name
        }
      }
      return ''
    },
    onDepartChange (newVal) {
      this.userInfo.departmentId = newVal
    },
    cancel () {
      for (const key in this.userInfo) {
        this.userInfo[key] = ''
      }
      this.$refs.treesel.reset()
      this.$emit('cancel')
    },
    submmit () {
      this.userInfo.manageDepartmentId = 0

      if (!this.checkParams()) {
        return
      }

      if (this.userId !== 0) {
        this.$api.updateUser(this.userInfo).then(data => {
          this.$vgo.tip('更新成功', 'success')
          this.cancel()
          this.$emit('editchange')
        })
      } else {
        this.$api.addUser(this.userInfo).then(data => {
          this.$vgo.tip('添加成功', 'success')
          this.cancel()
        })
      }
    },
    checkParams () {
      let isOK = true
      const params = this.userInfo
      if (params.realName === '' ||
          params.departmentId === '' ||
          params.job === '' ||
          params.hiredate === '' ||
          params.roleId === '' ||
          params.account === '') {
        isOK = false
        this.$vgo.tip('请完善表单数据!', 'warning')
      }
      return isOK
    },
  },
}
</script>
<style lang='stylus' scoped></style>
