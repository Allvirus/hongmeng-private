<template lang="pug">
.register
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw.ai-center(label-width='60px')
      el-form-item(label='部门:', v-if='userInfo.isLeader')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:', v-if='userInfo.isLeader')
        el-select.winput(
          v-model='model.userId',
          placeholder='请选择',
          clearable,
          filterable
        )
          el-option(
            v-for='item in userList',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
          )
      el-form-item(label='玩家社交账号:', label-width='120px')
        el-input.winput(
          v-model.trim='model.playAccount',
          placeholder='请输入玩家社交账号',
          clearable
        )
      el-form-item(label='注册时间:', label-width='90px')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
      el-button.mgl3.mgb2(
        icon='el-icon-search',
        type='primary',
        @click='search'
      ) 搜索
      el-button.mgl2.mgb2(
        icon='el-icon-search',
        type='primary',
        @click='addUser'
      ) 添加账号
      el-button.mgl3.mgr2.mgb2(
        icon='el-icon-close',
        type='danger',
        @click='shieldingUsers'
      ) 拉黑
      el-checkbox.mgt1.mgb3(v-model='model.Isblock') 只看已拉黑玩家

  el-table.mgy2.bg-white.pd2(
    :data='listMixin.list',
    :default-sort='{ prop: "regCount", order: "descending" }'
  )
    el-table-column(label='玩家账号', prop='playerAccount')
    el-table-column(label='登记人员', prop='createUser')
    el-table-column(label='平台分类')
      template(slot-scope='{ row }') {{ row.socialType ? "QQ" : "微信" }}
    el-table-column(label='时间')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(label='是否拉黑')
      template(slot-scope='{ row }')
        span.danger(v-if='row.isblock') 是
        span(v-else) 否
    el-table-column(label='重复登记次数', prop='regCount', sortable)
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.PageSize',
    :current-page.sync='model.Page',
    @current-change='getListMixin'
  )

  el-dialog(
    :title='this.addModel.isblock ? "拉黑账户" : "添加账户"',
    :visible.sync='dialogVisible',
    :before-close='cancel',
    width='30%'
  )
    .notice
      el-form.ff-rw.ai-center(label-width='100px')
        el-form-item.mgl3(label='玩家社交账号:')
          el-input.winput(
            v-model.trim='addModel.playerAccount',
            placeholder='请输入玩家社交账号',
            clearable,
            @blur='queryBlacklist'
          )
        el-form-item.mgl3.mgt2.mgb2(label='社交账号类型:')
          el-radio-group(v-model='addModel.socialType')
            el-radio(label='0') 微信
            el-radio(label='1') QQ
        el-form-item.mgl3.mgt2.mgb2(label='平台分类:')
          el-radio-group(v-model='platformType')
            el-radio(label='手游') 手游
    .list.tac(v-for='item in shieldingRecord', :key='item.id')
      p.mgt2(v-if='item.isblock === addModel.isblock') 该玩家账号于 {{ item.createTime | dateFormat }} 由 {{ item.createUser }} {{ item.regCount === 0 ? "首" : "第" + item.regCount }}次 {{ item.isblock ? "拉黑" : "登记" }}
    span.dialog-footer(span, slot='footer')
      el-button(@click='cancel') 取消
      el-button(type='primary', @click='registeredUsers') 确定
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'Register',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getManageRegistrationList',
      dtpApi: 'getManageRegistrationList',
      myApi: 'getRegistrationList',
      platformType: '手游',
      dialogVisible: false,
      model: {
        Isblock: false,
        userId: '',
        resDepId: '',
        playAccount: '',
        Page: 1,
        PageSize: 10,
        startTime: '',
        endTime: '',
      },
      addModel: {
        playerAccount: '',
        socialType: '0',
        isblock: false,
      },
      shieldingRecord: [],
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
  watch: {
    'model.Isblock' () {
      this.getListMixin()
    },
    'addModel.playerAccount' () {
      if (this.addModel.playerAccount === '') {
        this.shieldingRecord = []
        return false
      }
    },
  },
  methods: {
    registeredUsers () {
      if (this.addModel.playerAccount === '') return this.$vgo.tip('请输入玩家账号!', 'warning')
      this.$api.accountRegistration(this.addModel).then(res => {
        if (res.code === 400) {
          this.$vgo.tip(res.data, 'warning')
        } else {
          this.$vgo.tip(this.addModel.isblock ? '拉黑成功!' : '添加成功', 'success')
          this.dialogVisible = false
          this.addModel = {
            playerAccount: '',
            socialType: '0',
            isblock: false,
          }
          this.shieldingRecord = []
          this.getListMixin()
        }
      })
    },
    getQueryRegister () {
      this.$api.queryRegister(this.addModel.playerAccount).then(res => {
        this.shieldingRecord = res
      })
    },
    addUser () {
      this.addModel.isblock = false
      this.dialogVisible = true
    },
    shieldingUsers () {
      this.addModel.isblock = true
      this.dialogVisible = true
    },
    cancel () {
      this.addModel = {
        playerAccount: '',
        socialType: '0',
        isblock: false,
      }
      this.shieldingRecord = []
      this.dialogVisible = false
    },
    queryBlacklist () {
      if (this.addModel.playerAccount === '') {
        this.shieldingRecord = []
        return false
      }
      this.getQueryRegister()
    },
  },
}
</script>
<style lang="stylus" scoped>
.el-form-item
  margin-bottom 10px
</style>
