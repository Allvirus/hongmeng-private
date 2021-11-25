<template lang="pug">
.register
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='100px')
      el-form-item(label='玩家社交账号:')
        el-input.winput(
          v-model.trim ='searchStr',
          placeholder='请输入玩家社交账号',
          clearable
        )
      el-form-item(label="注册时间:")
          CommonDatePicker.w300(:start.sync='pagination.startTime' :end.sync='pagination.endTime' all)
      el-button.mgl5.mgb2(
        icon='el-icon-search',
        type='primary',
        @click='search'
        ) 搜索
      el-button.mgl4.mgb2(
        icon='el-icon-search',
        type='primary',
        @click='dialogVisible = true'
        ) 添加账号
      el-button.mgl4.mgr2.mgb2(
        icon='el-icon-close',
        type='danger',
        @click='shieldingUsers'
        ) 拉黑
      el-checkbox.mgt1.mgb3(
        v-model='pagination.Isblock',
        ) 只看已拉黑玩家

  el-table.mgy2.bg-white.pd2(:data='RegistrationList')
    el-table-column(label='玩家账号', prop='playerAccount')
    el-table-column(label='登记人员', prop='createUser')
    el-table-column(label='平台分类')
      template(slot-scope='{ row }') {{ row.socialType ? 'QQ' : '微信' }}
    el-table-column(label='时间')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(label='是否拉黑')
      template(slot-scope='{ row }')
        span(v-if='row.isblock' class="danger") 是
        span(v-else) 否
  el-pagination.margin-spacing(
    :total='count',
    :page-size.sync='pagination.pageSize',
    :current-page.sync='pagination.page',
    @current-change='getList',
    @size-change="handleSizeChange"
  )

  el-dialog(
    :title="this.model.isblock ? '拉黑账户' : '添加账户'"
    :visible.sync="dialogVisible"
    width="30%")
    .notice
      el-form.ff-rw.ai-center(label-width='100px')
        el-form-item.mgl3(label='玩家社交账号:')
          el-input.winput(
            v-model.trim ='model.playerAccount',
            placeholder='请输入玩家社交账号',
            clearable
          )
        el-form-item.mgl3.mgt2.mgb2(label='社交账号类型:')
          el-radio-group(v-model='model.socialType')
            el-radio(label='0') 微信
            el-radio(label='1') QQ
        el-form-item.mgl3.mgt2.mgb2(label='平台分类:')
          el-radio-group(v-model='platformType')
            el-radio(label='手游') 手游
    span(span slot="footer" class="dialog-footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary" @click="registeredUsers") 确定
</template>
<script>
export default {
  data () {
    return {
      platformType: '手游',
      searchStr: '',
      RegistrationList: [],
      dialogVisible: false,
      model: {
        playerAccount: '',
        socialType: '0',
        isblock: false,
      },
      pagination: {
        startTime: '',
        endTime: '',
        Page: 1,
        PageSize: 10,
        Isblock: false,
      },
      count: 0,
    }
  },
  watch: {
    'pagination.Isblock' () {
      this.getRegisterList()
    },
    'searchStr' () {
      this.getRegisterList()
    },
    'pagination.startTime' () {
      this.getRegisterList()
    },
    'pagination.endTime' () {
      this.getRegisterList()
    },
  },
  created () {
    this.getRegisterList()
  },
  methods: {
    registeredUsers () {
      if (this.model.playerAccount === '') return this.$vgo.tip('请输入玩家账号!', 'warning')
      this.$api.accountRegistration(this.model).then(res => {
        this.$vgo.tip(this.model.isblock ? '拉黑成功!' : '添加成功', 'success')
        this.dialogVisible = false
        this.model = {
          playerAccount: '',
          socialType: '0',
          isblock: false,
        }
        this.getRegisterList()
      })
    },
    shieldingUsers () {
      this.model.isblock = true
      this.dialogVisible = true
    },
    getRegisterList () {
      this.$api.getRegistrationList(this.pagination).then(res => {
        this.RegistrationList = res.list
        this.count = res.count
      })
    },
    getList (size) {
      this.pagination.Page = size
      this.getRegisterList()
    },
    handleSizeChange (pagesize) {
      this.pagination.PageSize = pagesize
      this.getRegisterList()
    },
    search () {
      this.RegistrationList = this.RegistrationList.filter(item => {
        if (item.playerAccount.includes(this.searchStr)) {
          return item
        }
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.el-form-item
  margin-bottom 10px
</style>
