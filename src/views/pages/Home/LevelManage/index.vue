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
    el-table-column(prop='levelName', label='等级名称')
      template(slot-scope='{ row }') {{ row.levelName || getDefaultLevelName(row.level) }}
    el-table-column(prop='experience', label='经验值')
    el-table-column(prop='basicSalary', label='底薪')
    el-table-column(prop='commission', label='提成')
    el-table-column(prop='ajobAndroidExp', label='A岗Android经验值')
    el-table-column(prop='ajobIOSExp', label='A岗iOS经验值')
    el-table-column(prop='bjobAndroidExp', label='B岗Android经验值')
    el-table-column(prop='bjobIOSExp', label='B岗iOS经验值')
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

  el-dialog(
    :title='model.isEdit ? "编辑等级" : "新增等级"',
    @close='cancelEdit',
    :visible.sync='editDlgVisiable',
    width='900px'
  )
    .flex-center
      el-form.full(label-width='180px')
        .ff-rn
          el-form-item(label='等级段位:', required)
            el-select(v-model='model.level', filterable, placeholder='请选择等级段位')
              el-option(
                v-for='item in levelOptions',
                :key='item.value',
                :label='item.label',
                :value='item.value'
              )
          el-form-item(label='展示名称:', required)
            el-input(v-model.trim='model.levelName', maxlength='50', placeholder='请输入展示名称')
        .ff-rn
          el-form-item(label='经验值:', required)
            el-input-number(v-model='model.experience')
          el-form-item(label='底薪:', required)
            el-input-number(v-model='model.basicSalary')
        .ff-rn
          el-form-item(label='提成:', required)
            el-input-number(v-model='model.commission')
          el-form-item(label='A岗Android经验值:', required)
            el-input-number(v-model='model.ajobAndroidExp')
        .ff-rn
          el-form-item(label='A岗iOS经验值:', required)
            el-input-number(v-model='model.ajobIOSExp')
          el-form-item(label='B岗Android经验值:', required)
            el-input-number(v-model='model.bjobAndroidExp')
        .ff-rn
          el-form-item(label='B岗iOS经验值:', required)
            el-input-number(v-model='model.bjobIOSExp')
        .ff-rn.w200.jc-end.pdr2
          label A岗充值比经验值
        .ff-rn.mgt2
          el-form-item(label='新服:', required)
            el-input-number(v-model='model.ajobRechargeExp')
          el-form-item(label='后续:', required)
            el-input-number(v-model='model.ajobRechargeExpAfter')
        .ff-rn.w200.jc-end.pdr2
          label B岗充值比经验值
        .ff-rn.mgt2
          el-form-item(label='新服:', required)
            el-input-number(v-model='model.bjobRechargeExp')
          el-form-item(label='后续:', required)
            el-input-number(v-model='model.bjobRechargeExpAfter')
        .ff-rn.w200.jc-end.pdr2
          label C岗充值比经验值
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
const LEVEL_OPTIONS = [
  { value: 1, label: '倔强青铜3' },
  { value: 2, label: '倔强青铜2' },
  { value: 3, label: '倔强青铜1' },
  { value: 4, label: '秩序白银3' },
  { value: 5, label: '秩序白银2' },
  { value: 6, label: '秩序白银1' },
  { value: 7, label: '荣耀黄金4' },
  { value: 8, label: '荣耀黄金3' },
  { value: 9, label: '荣耀黄金2' },
  { value: 10, label: '荣耀黄金1' },
  { value: 11, label: '尊贵铂金4' },
  { value: 12, label: '尊贵铂金3' },
  { value: 13, label: '尊贵铂金2' },
  { value: 14, label: '尊贵铂金1' },
  { value: 15, label: '永恒钻石5' },
  { value: 16, label: '永恒钻石4' },
  { value: 17, label: '永恒钻石3' },
  { value: 18, label: '永恒钻石2' },
  { value: 19, label: '永恒钻石1' },
  { value: 20, label: '至尊星耀5' },
  { value: 21, label: '至尊星耀4' },
  { value: 22, label: '至尊星耀3' },
  { value: 23, label: '至尊星耀2' },
  { value: 24, label: '至尊星耀1' },
  { value: 25, label: '超凡大师' },
  { value: 26, label: '傲世宗师' },
  { value: 27, label: '荣耀王者' },
  { value: 28, label: '最强王者' },
  { value: 29, label: '天选之子' },
  { value: 30, label: '殿堂传奇' },
  { value: 31, label: '九五至尊' },
]

const getEmptyModel = () => ({
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
  levelName: '',
})

export default {
  name: 'LevelManage',
  data () {
    return {
      levelList: [],
      editDlgVisiable: false,
      prevLevel: '',
      model: getEmptyModel(),
      levelOptions: LEVEL_OPTIONS,
    }
  },
  watch: {
    'model.level' (level) {
      const prevDefaultName = this.getDefaultLevelName(this.prevLevel)
      if (!this.model.levelName || this.model.levelName === prevDefaultName) {
        this.model.levelName = this.getDefaultLevelName(level)
      }
      this.prevLevel = level
    }
  },
  created: function () {
    this.getLevelList()
  },
  methods: {
    normalizeLevelRow (row = {}) {
      return {
        ...row,
        id: row.id !== undefined ? row.id : row.Id,
        level: row.level !== undefined ? row.level : row.Level,
        levelName: row.levelName !== undefined ? row.levelName : row.LevelName,
        experience: row.experience !== undefined ? row.experience : row.Experience,
        basicSalary: row.basicSalary !== undefined ? row.basicSalary : row.BasicSalary,
        commission: row.commission !== undefined ? row.commission : row.Commission,
        ajobAndroidExp: row.ajobAndroidExp !== undefined ? row.ajobAndroidExp : row.AjobAndroidExp,
        ajobIOSExp: row.ajobIOSExp !== undefined ? row.ajobIOSExp : row.AjobIOSExp,
        bjobAndroidExp: row.bjobAndroidExp !== undefined ? row.bjobAndroidExp : row.BjobAndroidExp,
        bjobIOSExp: row.bjobIOSExp !== undefined ? row.bjobIOSExp : row.BjobIOSExp,
        ajobRechargeExp: row.ajobRechargeExp !== undefined ? row.ajobRechargeExp : row.AjobRechargeExp,
        bjobRechargeExp: row.bjobRechargeExp !== undefined ? row.bjobRechargeExp : row.BjobRechargeExp,
        cjobRechargeExp: row.cjobRechargeExp !== undefined ? row.cjobRechargeExp : row.CjobRechargeExp,
        ajobRechargeExpAfter: row.ajobRechargeExpAfter !== undefined ? row.ajobRechargeExpAfter : row.AjobRechargeExpAfter,
        bjobRechargeExpAfter: row.bjobRechargeExpAfter !== undefined ? row.bjobRechargeExpAfter : row.BjobRechargeExpAfter,
        cjobRechargeExpAfter: row.cjobRechargeExpAfter !== undefined ? row.cjobRechargeExpAfter : row.CjobRechargeExpAfter,
      }
    },
    getDefaultLevelName (level) {
      const target = this.levelOptions.find(item => item.value === level)
      return target ? target.label : ''
    },
    getLevelList () {
      this.$api.getAllLevel().then(res => {
        this.levelList = res.map(item => {
          const normalized = this.normalizeLevelRow(item)
          return {
            ...normalized,
            levelName: normalized.levelName || this.getDefaultLevelName(normalized.level)
          }
        })
      })
    },
    deleteLevel (row) {
      this.$vgo.open(() => {
        this.$api.delLevelById(row.id).then(() => {
          this.getLevelList()
        })
      })
    },
    showEditDlg (isEdit, row) {
      if (isEdit) {
        this.model = this.normalizeLevelRow(JSON.parse(JSON.stringify(row)))
        this.model.levelName = this.model.levelName || this.getDefaultLevelName(this.model.level)
      } else {
        this.model = getEmptyModel()
      }
      this.prevLevel = this.model.level
      this.model.isEdit = isEdit
      this.editDlgVisiable = true
    },
    cancelEdit () {
      this.editDlgVisiable = false
    },
    submmitEdit () {
      if (this.model.level === '') {
        this.$vgo.tip('请选择等级段位', 'warning')
        return
      }

      if (!this.model.levelName) {
        this.$vgo.tip('请输入展示名称', 'warning')
        return
      }

      if (this.model.isEdit) {
        if (!this.model.id) {
          this.$vgo.tip('未获取到等级ID，请刷新后重试', 'warning')
          return
        }
        this.$api.updateLevById(this.model)
          .then(() => {
            this.$vgo.tip('更新成功', 'success')
            this.cancelEdit()
            this.getLevelList()
          })
          .catch(err => {
            const msg = err?.msg || err?.message || '更新失败'
            this.$vgo.tip(msg, 'warning')
          })
      } else {
        this.$api.addLevel(this.model)
          .then(() => {
            this.$vgo.tip('创建成功', 'success')
            this.cancelEdit()
            this.getLevelList()
          })
          .catch(err => {
            const msg = err?.msg || err?.message || '创建失败'
            this.$vgo.tip(msg, 'warning')
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
