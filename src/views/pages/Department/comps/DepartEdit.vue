<template lang='pug'>
.add-dlg
  el-dialog(title='新增部门', :visible.sync='isShow', width='35%')
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='部门名称:', required)
          el-input(
            v-model='departInfo.name',
            placeholder='请输入部门名称',
            :maxlength='20',
            show-word-limit
          )
        el-form-item(label='负责人:', required)
          el-select.mgl1(v-model='departInfo.userId', placeholder='请选择')
            el-option(
              v-for='item in departInfo.userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='上级部门:', required)
          el-select.mgl1(
            v-model='departInfo.superiorDepartmentId',
            placeholder='请选择'
          )
            el-option(
              v-for='item in departInfo.departList',
              :key='item.id',
              :label='item.name',
              :value='item.id'
            )
        el-form-item.omit(label='是否A岗部门:', required)
          el-switch(
            v-model='departInfo.IsAjobDepartment',
            active-text='是',
            inactive-text='否'
          )
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
  },
  data () {
    return {
      isShow: false,
      userList: [],
      departList: [],
      departInfo: {
        name: '',
        userId: '',
        superiorDepartmentId: '',
        IsAjobDepartment: true,
      },
    }
  },
  watch: {
    show (newValue, oldValue) {
      this.isShow = newValue
    },
    immediate: true,
  },
  created: function () {
    this.getSelectorList()
  },
  methods: {
    getSelectorList () {
      this.$api.getAllUser().then(res => {
        console.log('getAllUser', res)
        this.userList = res
      })

      this.$api.getAllDeparts().then(res => {
        console.log('getAllDepart', res)
        this.departList = res
      })
    },
    cancel () {
      for (const key in this.departInfo) {
        this.departInfo[key] = ''
      }
      this.$emit('cancel')
    },
    submmit () {
      const params = {
        name: this.departInfo.name,
        userId: this.departInfo.userId,
        superiorDepartmentId: this.departInfo.superiorDepartmentId,
        IsAjobDepartment: this.departInfo.IsAjobDepartment,
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
<style lang='stylus' scoped></style>
