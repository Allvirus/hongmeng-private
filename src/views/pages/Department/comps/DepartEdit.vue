<template lang='pug'>
.add-dlg
  el-dialog(
    :title='isEdit ? "编辑" : "新增"',
    :visible.sync='isShow',
    width='35%',
    @close='cancel'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='部门名称:', required)
          el-input(
            v-model='departInfo.name',
            placeholder='请输入部门名称',
            :maxlength='20',
            show-word-limit
          )
        el-form-item(label='负责人:')
          el-select(v-model='departInfo.userId', placeholder='请选择')
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='上级部门:', required)
          el-select(
            v-model='departInfo.superiorDepartmentId',
            placeholder='请选择'
          )
            el-option(
              v-for='item in departList',
              :key='item.id',
              :label='item.name',
              :value='item.id'
            )
        el-form-item.omit(label='是否A岗部门:', required)
          el-switch(
            v-model='departInfo.isAjobDepartment',
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
    data: {
      type: Object,
      default: null,
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
        isAjobDepartment: true,
      },
      isEdit: false,
    }
  },
  watch: {
    show (newValue, oldValue) {
      this.isShow = newValue
      if (this.isShow) {
        this.getSelectorList()
      }
    },
    data (newValue, oldValue) {
      this.isEdit = newValue !== null
      if (newValue !== null) {
        this.departInfo = newValue
        if (this.departInfo.userId === 0) {
          this.departInfo.userId = ''
        }
      }
    },
    immediate: true,
  },
  methods: {
    getSelectorList () {
      this.$api.getAllUser().then(res => {
        this.userList = res
      })

      this.$api.getAllDeparts().then(res => {
        this.departList = res
      })
    },
    cancel () {
      for (const key in this.departInfo) {
        this.departInfo[key] = ''
      }
      this.departInfo.isAjobDepartment = true
      this.$emit('cancel')
    },
    submmit () {
      const params = {
        name: this.departInfo.name,
        userId: this.departInfo.userId,
        superiorDepartmentId: this.departInfo.superiorDepartmentId,
        isAjobDepartment: this.departInfo.isAjobDepartment,
      }
      if (this.isEdit) {
        params.departmentId = this.departInfo.id
      }
      for (const key in params) {
        if (key !== 'userId' && params[key] === '') {
          this.$vgo.tip('请完善表单数据!' + key, 'warning')
          return
        }
      }
      if (params.userId === '') {
        params.userId = 0
      }
      if (this.isEdit) {
        this.$api.updateDepart(params).then(data => {
          this.$vgo.tip('更新成功', 'success')
          this.$emit('success')
          this.cancel()
        })
      } else {
        this.$api.addDepart(params).then(res => {
          this.$vgo.tip('创建成功', 'success')
          this.$emit('success')
          this.cancel()
        })
      }
    },
  },
}
</script>
<style lang='stylus' scoped></style>
