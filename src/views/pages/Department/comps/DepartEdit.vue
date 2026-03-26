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
          el-select(
            v-model='departInfo.managerUserIds',
            placeholder='请选择',
            filterable,
            multiple,
            collapse-tags,
            clearable
          )
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
      el-button.mgl3(
        v-permission='isEdit ? \'department.dept.edit\' : \'department.dept.add\'',
        type='primary',
        @click='submmit'
      ) 提交
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
        managerUserIds: [],
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
        this.departInfo = {
          ...newValue,
          managerUserIds: Array.isArray(newValue.managerUserIds)
            ? [...newValue.managerUserIds]
            : (newValue.userId ? [newValue.userId] : []),
        }
        if (this.departInfo.name) {
          const regexp = /(\([^)]*\))/
          if (regexp.test(this.departInfo.name)) {
            this.departInfo.name = this.departInfo.name.replace(regexp, '')
          }
        }
      } else {
        this.resetDepartInfo()
      }
    },
    immediate: true,
  },
  methods: {
    getManagedDepartmentIds () {
      if (Array.isArray(this.userInfo.resDepartmentIds) && this.userInfo.resDepartmentIds.length) {
        return this.userInfo.resDepartmentIds.filter(id => id !== 0)
      }
      if (this.userInfo.resDepartmentId && this.userInfo.resDepartmentId !== 0) {
        return [this.userInfo.resDepartmentId]
      }
      return []
    },
    resetDepartInfo () {
      this.departInfo = {
        name: '',
        managerUserIds: [],
        superiorDepartmentId: '',
        isAjobDepartment: true,
      }
    },
    getSelectorList () {
      this.departList = []
      this.$api.getAllUser().then(res => {
        this.userList = res
      })

      const departmentIds = this.getManagedDepartmentIds()
      if (!departmentIds.length) {
        return
      }
      Promise.all(departmentIds.map(departmentId => this.$api.getDepartById(departmentId))).then(resList => {
        for (const res of resList) {
          this.departList.push({
            id: res.id,
            name: res.name,
          })
          this.processDptData(res)
        }
      })
    },
    cancel () {
      this.resetDepartInfo()
      this.departList = []
      this.$emit('cancel')
    },
    submmit () {
      const params = {
        name: this.departInfo.name,
        managerUserIds: this.departInfo.managerUserIds,
        superiorDepartmentId: this.departInfo.superiorDepartmentId,
        isAjobDepartment: this.departInfo.isAjobDepartment,
      }
      if (this.isEdit) {
        params.departmentId = this.departInfo.id
      }
      for (const key in params) {
        if (key !== 'managerUserIds' && params[key] === '') {
          this.$vgo.tip('请完善表单数据!', 'warning')
          return
        }
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
