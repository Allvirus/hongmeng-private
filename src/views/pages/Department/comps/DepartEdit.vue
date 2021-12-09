<template lang='pug'>
.add-dlg
  el-dialog(
    :title='isEdit ? "编辑" : "新增"',
    :visible.sync='isShow',
    width='600px',
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
          el-select(v-model='departInfo.userId', placeholder='请选择', filterable)
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='上级部门:', required)
          el-select(
            filterable,
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
import { mapGetters } from 'vuex'
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
      reslist: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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

      this.$api.getDepartById(this.userInfo.resDepartmentId).then(res => {
        // 将父级的部门添加
        this.departList.push({
          id: res.id,
          name: res.name,
        })
        // 将子部门递归处理
        this.processDptData(res)
      })
    },
    cancel () {
      for (const key in this.departInfo) {
        this.departInfo[key] = ''
      }
      this.departInfo.isAjobDepartment = true
      this.departList = []
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
          this.$vgo.tip('请完善表单数据!', 'warning')
          return
        }
      }
      if (params.userId === '') {
        params.userId = 0
      }
      if (this.isEdit) {
        this.$api.updateDepart(params).then(data => {
          this.$vgo.tip('更新成功', 'success')
          this.$emit('success', data)
          this.cancel()
        })
      } else {
        this.$api.addDepart(params).then(data => {
          this.$vgo.tip('创建成功', 'success')
          this.$emit('success', data)
          this.cancel()
        })
      }
    },
    processDptData (data) {
      if (!data.departments || data.departments.length === 0) {
        return false
      } else {
        this.departList.push(...data.departments)
        for (let i = 0; i < data.departments.length; i++) {
          this.processDptData(data.departments[i])
        }
      }
    },
  },
}
</script>
<style lang='stylus' scoped></style>
