<template lang='pug'>
  .LevelManage
    .ff-rn.fs-m.bg-white.pd2.opt-bar
      .flex-1.jc-end
        el-button(icon="el-icon-plus" type="primary" @click="showEditDlg(false,null)") 新增等级

    el-table.mgy2.bg-white.pd2(:data='levelList')
      el-table-column(prop="level" label="等级名称")
        template(slot-scope='{ row }') {{row.level | formatLevel}}
      el-table-column(prop="experience" label="经验值")
      el-table-column(prop="basicSalary" label="底薪")
      el-table-column(prop="commission" label="提成")
      el-table-column(prop="ajobAndroidExp" label="A岗Android经验")
      el-table-column(prop="ajobIOSExp" label="A岗IOS经验")
      el-table-column(prop="bjobAndroidExp" label="B岗Android经验")
      el-table-column(prop="bjobIOSExp" label="B岗IOS经验")
      el-table-column(prop="ajobRechargeExp" label="A岗充值经验")
      el-table-column(prop="bjobRechargeExp" label="B岗充值经验")
      el-table-column(prop="cjobRechargeExp" label="C岗充值经验")
      el-table-column(prop="operate" label="操作" width="150")
        template(slot-scope="{ row }")
          .ff-rn
            el-button(icon="el-icon-edit-outline" type="text" @click="showEditDlg(true,row)") 编辑
            el-button.danger(icon="el-icon-delete" type="text" @click="deleteLevel(row)") 删除

    //- 编辑、新增对话框
    el-dialog(:title="model.isEdit?'编辑':'新增'"
      @close="cancelEdit"
      :visible.sync="editDlgVisiable" width="45%")
      .flex-center
        el-form.full(label-width="200px")
          .ff-rn
            el-form-item(label="等级名称:" required)
              el-select(v-model="model.level"
              placeholder="请选择")
                el-option(v-for="(item,idx) in levelOptions"
                :key="idx"
                :label="item"
                :value="idx")
            el-form-item(label="经验值:" required)
              el-input-number(v-model="model.experience")
          .ff-rn
            el-form-item(label="底薪:" required)
              el-input-number(v-model="model.basicSalary")
            el-form-item(label="提成:" required)
              el-input-number(v-model="model.commission")
          .ff-rn
            el-form-item(label="A岗Android经验:" required)
              el-input-number(v-model="model.ajobAndroidExp")
            el-form-item(label="A岗IOS经验:" required)
              el-input-number(v-model="model.ajobIOSExp")
          .ff-rn
            el-form-item(label="B岗Android经验:" required)
              el-input-number(v-model="model.bjobAndroidExp")
            el-form-item(label="B岗IOS经验:" required)
              el-input-number(v-model="model.bjobIOSExp")
          .ff-rn
            el-form-item(label="A岗充值经验:" required)
              el-input-number(v-model="model.ajobRechargeExp")
            el-form-item(label="B岗充值经验:" required)
              el-input-number(v-model="model.bjobRechargeExp")
          .ff-rn
            el-form-item(label="C岗充值经验:" required)
              el-input-number(v-model="model.cjobRechargeExp")
      span.dialog-footer(slot="footer")
        el-button.mgl3(type="warning" @click="cancelEdit") 取消
        el-button.mgl3(type="primary" @click="submmitEdit") 提交

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
        commission: 0,
        experience: 0,
        level: 0,
      },
      levelOptions: [
        '青铜五',
        '青铜四',
        '青铜三',
        '青铜二',
        '青铜一',
        '白银五',
        '白银四',
        '白银三',
        '白银二',
        '白银一',
        '黄金五',
        '黄金四',
        '黄金三',
        '黄金二',
        '黄金一',
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
.LevelManage
  >>>.el-input
    width 180px !important
  .el-input-number--small
    width 180px
</style>
