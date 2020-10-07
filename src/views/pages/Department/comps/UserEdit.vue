<template lang='pug'>
.user-edit
  el-dialog(
    title='新增人员',
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
        el-form-item(label='工号:')
          el-input(v-model='userInfo.jobNumber', placeholder='请输入工号')
        el-form-item(label='手机号:')
          el-input(
            v-model='userInfo.phoneNumber',
            placeholder='请输入手机号',
            type='tel'
          )
        el-form-item(label='部门:', required)
          el-select.mgl1(v-model='userInfo.departmentId', placeholder='请选择')
            el-option(
              v-for='(item, index) in departList',
              :key='item.id',
              :label='item.name',
              :value='item.id'
            )
        el-form-item(label='岗位:', required)
          el-select.mgl1(v-model='userInfo.job', placeholder='请选择')
            el-option(
              v-for='(item, index) in jobs',
              :key='index',
              :label='item',
              :value='index'
            )
        el-form-item(label='推广员账户:', required)
          el-input(v-model='userInfo.account', placeholder='请输入推广员账户')
        //- el-form-item(label='角色:', required)
        //-   el-input(v-model='userInfo.roleId', placeholder='请输入账户')
        el-form-item(label='入职日期:', required)
          CommonDatePicker(type='date', v-model='userInfo.hiredate')
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
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: null,
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
      },
      jobs: ['A岗', 'B岗', 'C岗', '管理'],
      departList: [],
      isShow: false,
    }
  },
  watch: {
    show (newValue, oldValue) {
      this.isShow = newValue
    },
    data (newValue, oldValue) {
      console.log('member info change', newValue, oldValue)
      if (newValue !== null) {
        this.userInfo.phoneNumber = newValue.phoneNumber
        this.userInfo.realName = newValue.realName
        this.userInfo.phoneNumber = newValue.phoneNumber
        this.userInfo.phoneNumber = newValue.phoneNumber
      }
    },
    immediate: true,
  },
  created: function () {
    // 获取部门列表数据
    this.$api.getAllDeparts().then(res => {
      this.departList = res
    })
  },
  methods: {
    cancel () {
      for (const key in this.userInfo) {
        this.userInfo[key] = ''
      }
      this.$emit('cancel')
    },
    submmit () {
      this.userInfo.roleId = 1
      this.userInfo.manageDepartmentId = 0

      if (!this.checkParams()) {
        return
      }
      this.$api.addUser(this.userInfo).then(data => {
        this.$vgo.tip('添加成功', 'success')
        this.cancel()
      })
    },
    checkParams () {
      for (const key in this.userInfo) {
        if (key !== 'remark' &&
            key !== 'phoneNumber' &&
            key !== 'jobNumber' &&
            this.userInfo[key] === '') {
          this.$vgo.tip('请完善表单内容！', 'warning')
          return false
        }
      }
      return true
    },
  },
}
</script>
<style lang='stylus' scoped></style>
