<template lang="pug">
.associat
  .ff-rn.fs-m.bg-white.pdt2.opt-bar
    el-form.ff-rn(label-width='100px')
      el-form-item(label='部门:')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:')
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
      el-form-item(label='平台:')
        el-select.winput(
          v-model='model.platform',
          placeholder='请选择',
          clearable
        )
          el-option(label='Ifun', :value='0')
          el-option(label='木勺', :value='1')
      el-form-item.mgl4(label='平台推广账号:')
        el-input(v-model='model.account', clearable)
        el-button.mgl3(icon='el-icon-search', type='primary', @click='search') 搜索
        el-button.mgl3(type='primary', @click='dialogVisible = true') 新增

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='departmentName', label='所属组织')
    el-table-column(prop='userName', label='员工')
    el-table-column(prop='account', label='平台推广账户')
    el-table-column(prop='platform', label='平台')
      template(slot-scope='{ row }') {{ row.platform === 0 ? 'Ifun' : '木勺' }}
    el-table-column(prop='creatTime', label='创建时间')
      template(slot-scope='{ row }') {{ row.creatTime | dateFormat }}
    el-table-column(prop='operate', label='操作', width='150')
      template(slot-scope='{ row }')
        el-button.danger(
          icon='el-icon-delete',
          type='text',
          @click='deleteLevel(row)'
        ) 删除

  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )

  el-dialog(title='新增', :visible.sync='dialogVisible', width='30%')
    .content
      el-form(label-width='90px')
        el-form-item(label='部门:', required)
          tree-selector.winput(
            ref='dtptree',
            :data='myDptList.list',
            :defProps='myDptList.props',
            nodeKey='id',
            clearable,
            :deflabel='myDptList.list[0].name',
            @change='onDepartChange'
          )
        el-form-item(label='员工:', required)
          el-select.winput(
            v-model='addModel.userId',
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
        el-form-item(label='平台:', required)
          el-select.winput(
            v-model='addModel.platform',
            placeholder='请选择',
            clearable
          )
            el-option(label='Ifun', :value='0')
            el-option(label='木勺', :value='1')
        el-form-item(label='推广账号:', required)
          el-input(v-model='addModel.account', clearable)
    span.dialog-footer(span, slot='footer')
      el-button(@click='cancelChange') 取消
      el-button(type='primary', @click='confirmAdd') 确定
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'Update',
  mixins: [fetchListMixin, dptListMixin],
  data () {
    return {
      dialogVisible: false,
      listApiForMixin: 'getAccountAssociatData',
      dtpApi: 'getAccountAssociatData',
      model: {
        userId: '',
        account: '',
        platform: '',
        page: 1,
        pageSize: 10,
      },
      addModel: {
        userId: '',
        account: '',
        platform: '',
      },
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo']),
  },
  created () {
  },
  methods: {
    searchCfg () {
      this.getListMixin()
    },
    deleteLevel (info) {
      this.$vgo.open(() => {
        this.$api.byIDDeleteAccountAssociat(info.id).then(res => {
          this.$vgo.tip('删除成功', 'success')
          this.model = {
            userId: '',
            account: '',
            platform: '',
            page: 1,
            pageSize: 10,
          }
          this.getListMixin()
        }).catch(err => {
          console.log(err)
          this.$vgo.tip('删除失败', 'error')
        })
      })
    },
    cancelChange () {
      this.dialogVisible = false
      this.addModel = {
        userId: '',
        account: '',
        platform: '',
      }
    },
    confirmAdd () {
      if (!this.addModel.userId || !this.addModel.account || this.addModel.platform === '') {
        this.$vgo.tip('请输入完整信息', 'error')
        return false
      }
      this.$api.createAssociatedUser(this.addModel).then(res => {
        this.addModel.userId = ''
        this.addModel.account = ''
        this.addModel.platform = ''
        this.getListMixin()
        this.dialogVisible = false
      })
    },
  },
}
</script>
<style lang="stylus" scoped></style>
