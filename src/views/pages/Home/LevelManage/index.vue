<template lang='pug'>
.LevelManage
  .ff-rn.fs-m.bg-white.pd2.opt-bar
    .flex-1.jc-end
      el-button(
        v-permission='\'level.add\'',
        icon='el-icon-plus',
        type='primary',
        @click='showEditDlg(false, null)'
      ) 新增等级

  el-table.mgy2.bg-white.pd2(:data='levelList')
    el-table-column(prop='level', label='等级名称')
      template(slot-scope='{ row }') {{ row.level | formatLevel }}
    el-table-column(prop='experience', label='经验值')
    el-table-column(prop='basicSalary', label='底薪')
    el-table-column(prop='commission', label='提成')
    el-table-column(prop='ajobAndroidExp', label='A岗Android经验值')
    el-table-column(prop='ajobIOSExp', label='A岗IOS经验值')
    el-table-column(prop='bjobAndroidExp', label='B岗Android经验值')
    el-table-column(prop='bjobIOSExp', label='B岗IOS经验值')
    el-table-column(prop='ajobRechargeExp', label='A岗充值比经验(新服)')
    el-table-column(prop='ajobRechargeExpAfter', label='A岗充值比经验(后续)')
    el-table-column(prop='bjobRechargeExp', label='B岗充值比经验(新服)')
    el-table-column(prop='bjobRechargeExpAfter', label='B岗充值比经验(后续)')
    el-table-column(prop='cjobRechargeExp', label='C岗充值比经验(新服)')
    el-table-column(prop='cjobRechargeExpAfter', label='C岗充值比经验(后续)')
    el-table-column(prop='operate', label='操作', width='150')
      template(slot-scope='{ row }')
        .ff-rn
          el-button(
            v-permission='\'level.edit\'',
            icon='el-icon-edit-outline',
            type='text',
            @click='showEditDlg(true, row)'
          ) 编辑
          el-button.danger(
            v-permission='\'level.delete\'',
            icon='el-icon-delete',
            type='text',
            @click='deleteLevel(row)'
          ) 删除

  //- 编辑、新增对话框
  el-dialog(
    :title='model.isEdit ? "编辑" : "新增"',
    @close='cancelEdit',
    :visible.sync='editDlgVisiable',
    width='900px'
  )
    .flex-center
      el-form.full(label-width='200px')
        .ff-rn
          el-form-item(label='等级名称:', required)
            el-select(v-model='model.level', filterable, placeholder='请选择')
              el-option(
                v-for='item in levelOptions',
                :key='item.value',
                :label='item.label',
                :value='item.value'
              )
          el-form-item(label='经验值:', required)
            el-input-number(v-model='model.experience')
        .ff-rn
          el-form-item(label='底薪:', required)
            el-input-number(v-model='model.basicSalary')
          el-form-item(label='提成:', required)
            el-input-number(v-model='model.commission')
        .ff-rn
          el-form-item(label='A岗Android经验值:', required)
            el-input-number(v-model='model.ajobAndroidExp')
          el-form-item(label='A岗IOS经验值:', required)
            el-input-number(v-model='model.ajobIOSExp')
        .ff-rn
          el-form-item(label='B岗Android经验值:', required)
            el-input-number(v-model='model.bjobAndroidExp')
          el-form-item(label='B岗IOS经验值:', required)
            el-input-number(v-model='model.bjobIOSExp')
        .ff-rn.w200.jc-end.pdr2
          label A岗充值比经验值:
        .ff-rn.mgt2
          el-form-item(label='新服:', required)
            el-input-number(v-model='model.ajobRechargeExp')
          el-form-item(label='后续:', required)
            el-input-number(v-model='model.ajobRechargeExpAfter')
        .ff-rn.w200.jc-end.pdr2
          label B岗充值比经验值:
        .ff-rn.mgt2
          el-form-item(label='新服:', required)
            el-input-number(v-model='model.bjobRechargeExp')
          el-form-item(label='后续:', required)
            el-input-number(v-model='model.bjobRechargeExpAfter')
        .ff-rn.w200.jc-end.pdr2
          label C岗充值比经验值:
        .ff-rn.mgt2
          el-form-item(label='新服:', required)
            el-input-number(v-model='model.cjobRechargeExp')
          el-form-item(label='后续:', required)
            el-input-number(v-model='model.cjobRechargeExpAfter')
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancelEdit') 取消
      el-button.mgl3(
        v-permission='model.isEdit ? \'level.edit\' : \'level.add\'',
        type='primary',
        @click='submmitEdit'
      ) 提交
</template>
<script>
export default {
  name: 'LevelManage',
  data () {
    return {
      levelList: [],
      editDlgVisiable: false,
      model: {
        isEdit: false,
        ajobAndroidExp: 0,
        ajobIOSExp: 0,
        basicSalary: 0,
        bjobAndroidExp: 0,
        bjobIOSExp: 0,
        ajobRechargeExp: 0,
        bjobRechargeExp: 0,
        cjobRechargeExp: 0,
        ajobRechargeExpAfter: 0,
        bjobRechargeExpAfter: 0,
        cjobRechargeExpAfter: 0,
        commission: 0,
        experience: 0,
        level: '',
      },
      levelOptions: [
        { value: 1, label: '倔强青铜3' },
        { value: 2, label: '倔强青铜2' },
        { value: 3, label: '倔强青铜1' },
        { value: 4, label: '秩序白银3' },
        { value: 5, label: '秩序白银2' },
        { value: 6, label: '秩序白银1' },
        { value: 7, label: '荣耀黄金3' },
        { value: 8, label: '荣耀黄金2' },
        { value: 9, label: '荣耀黄金1' },
        { value: 10, label: '尊贵铂金4' },
        { value: 11, label: '尊贵铂金3' },
        { value: 12, label: '尊贵铂金2' },
        { value: 13, label: '尊贵铂金1' },
        { value: 14, label: '永恒钻石5' },
        { value: 15, label: '永恒钻石4' },
        { value: 16, label: '永恒钻石3' },
        { value: 17, label: '永恒钻石2' },
        { value: 18, label: '永恒钻石1' },
        { value: 19, label: '至尊星耀5' },
        { value: 20, label: '至尊星耀4' },
        { value: 21, label: '至尊星耀3' },
        { value: 22, label: '至尊星耀2' },
        { value: 23, label: '至尊星耀1' },
        { value: 24, label: '超凡大师' },
        { value: 25, label: '傲世宗师' },
        { value: 26, label: '荣耀王者' },
        { value: 27, label: '最强王者' },
        { value: 28, label: '天选之子' },
        { value: 29, label: '殿堂传奇' },
        { value: 30, label: '九五至尊' },
      ],
    }
  },
  computed: {
  },
  created: function () {
    this.getLevelList()
  },
  methods: {
    getLevelList () {
      this.$api.getAllLevel().then(res => {
        this.levelList = res
      })
    },
    deleteLevel (row) {
      this.$vgo.open(() => {
        this.$api.delLevelById(row.id).then(res => {
          this.getLevelList()
        })
      })
    },
    showEditDlg (isEdit, row) {
      if (isEdit) {
        this.model = JSON.parse(JSON.stringify(row))
      } else {
        for (const key in this.model) {
          this.model[key] = ''
        }
      }
      this.model.isEdit = isEdit
      this.editDlgVisiable = true
    },
    cancelEdit () {
      this.editDlgVisiable = false
    },
    submmitEdit () {
      if (this.model.isEdit) {
        this.$api.updateLevById(this.model).then(res => {
          this.$vgo.tip('更新成功', 'success')
          this.cancelEdit()
          this.getLevelList()
        })
      } else {
        if (this.model.level === '') {
          this.$vgo.tip('请选择等级名称', 'warning')
          return
        }
        this.$api.addLevel(this.model).then(res => {
          this.$vgo.tip('创建成功', 'success')
          this.cancelEdit()
          this.getLevelList()
        })
      }
    },
  },
}
</script>
<style lang='stylus' scoped>
.LevelManage {
  >>>.el-input {
    width: 180px !important;
  }

  .el-input-number--small {
    width: 180px;
  }
}
</style>
