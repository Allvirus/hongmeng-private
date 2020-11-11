<template lang='pug'>
.user-edit
  el-dialog(
    :title='userId !== 0 ? "编辑" : "新增"',
    :visible.sync='isShow',
    width='600px',
    @close='cancel'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='姓名:', required)
          el-input(
            v-model='model.realName',
            placeholder='请输入姓名',
            :maxlength='20',
            show-word-limit,
            clearable
          )
        el-form-item(label='入职日期:', required)
          CommonDatePicker(
            type='date',
            v-model='model.hiredate',
            all,
            placeholder='请选择日期'
          )
        el-form-item(label='部门:', required)
          tree-selector(
            ref='treesel',
            :data='treeData',
            :defProps='defProps',
            nodeKey='id',
            :deflabel='model.dptName',
            @change='onDepartChange'
          )
        el-form-item(label='岗位:', required)
          el-select(v-model='model.job', placeholder='请选择', filterable)
            el-option(
              v-for='(item, index) in jobs',
              :key='index',
              :label='item',
              :value='index'
            )
        el-form-item(label='角色:', required)
          el-select(
            v-model='model.userRoles',
            placeholder='请选择',
            :multiple='true',
            filterable
          )
            el-option(
              v-for='item in roles',
              :key='item.id',
              :label='item.name',
              :value='item.name'
            )
        el-form-item(label='推广员账户:', required)
          el-input(v-model='model.account', placeholder='请输入推广员账户', clearable)
        el-form-item(label='在职状态:', required)
          el-switch.jc-end(
            v-model='model.workingStatus',
            :active-text='model.workingStatus ? "在职" : "离职"'
          )
        el-form-item(label='工号:')
          el-input(v-model='model.jobNumber', placeholder='请输入工号', clearable)
        el-form-item(label='手机号:')
          el-input(
            v-model='model.phoneNumber',
            placeholder='请输入手机号',
            clearable,
            type='tel'
          )
        el-form-item(label='备注:')
          el-input(v-model='model.remark', placeholder='请输入备注', clearable)
        //- el-form-item(label='manageDepartmentId:', required)
        //-   el-input(v-model='model.manageDepartmentId', placeholder='请输入账户' type='tel')
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
      model: {
        realName: '',
        phoneNumber: '',
        account: '',
        departmentId: '',
        job: '',
        userRoles: '',
        hiredate: '',
        remark: '',
        jobNumber: '',
        manageDepartmentId: '',
        dptName: '',
        workingStatus: true,
        photo: '',
      },
      jobs: ['A岗', 'B岗', 'C岗', '后勤'],
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
      if (this.isShow) {
        // 获取部门树
        if (this.userId !== 0) {
          // 编辑
          this.$api.getUserInfoById(this.userId).then(data => {
            this.model = data
            this.model.id = this.userId
            this.model.dptName = this.findDptName(this.model.departmentId, this.treeData)
          })
        } else {
          // 新建
          this.model.dptName = ''
        }
        this.getRoles()
      }
    },
    immediate: true,
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
    onDepartChange (dptInfo) {
      this.model.departmentId = dptInfo.id
    },
    cancel () {
      for (const key in this.model) {
        this.model[key] = ''
      }
      this.model.workingStatus = true
      this.$refs.treesel.reset()
      this.$emit('cancel')
    },
    submmit () {
      this.model.manageDepartmentId = 0

      if (!this.checkParams()) {
        return
      }
      if (this.userId !== 0) {
        this.$api.updateUser(this.model).then(data => {
          this.$vgo.tip('更新成功', 'success')
          this.$emit('editchange', this.model.departmentId)
          this.cancel()
        })
      } else {
        this.$api.addUser(this.model).then(data => {
          this.$vgo.tip('添加成功', 'success')
          this.$emit('editchange', this.model.departmentId)
          this.cancel()
        })
      }
    },
    checkParams () {
      let isOK = true
      const params = this.model
      if (params.realName === '' ||
          params.departmentId === '' ||
          params.job === '' ||
          params.hiredate === '' ||
          params.userRoles.length === 0 ||
          params.account === '') {
        isOK = false
        this.$vgo.tip('请完善表单数据!', 'warning')
      }
      return isOK
    },
  },
}
</script>
<style lang='stylus' scoped>
>>>.el-dialog__body
  padding 20px !important
</style>
