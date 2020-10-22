<template lang='pug'>
.MyExp
  .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
    el-form.ff-rw(label-width='100px')
      el-form-item(label='部门:', v-show="false")
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          :deflabel='myDptList.list[0].name',
          @change='onDepartChange'
        )
      el-form-item(label='员工:' v-if='userInfo.isLeader')
        el-select.winput(v-model='model.UserId', placeholder='请选择', clearable filterable)
          el-option(
            v-for='item in userList',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
          )
      el-form-item(label='经验来源:')
        el-input.winput(v-model='model.Origin')
      el-form-item(label='经验值:')
        el-input.winput(v-model='model.ExpChange')
      el-form-item(label='创建时间:')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
      el-button.mgl3.mgb2(icon='el-icon-search', type='primary', @click='search') 搜索
      el-button.mgl2.mgb2(
        icon='el-icon-refresh-right',
        type='primary',
        @click='reset'
      ) 重置
      el-button.mgb2.mgr2(icon="el-icon-plus" type="warning" @click="newExpDlg = true" v-if="userInfo.isLeader") 新增经验
      el-checkbox.flex-center(v-model="searchMyData" v-if="userInfo.isLeader") 搜索我的数据

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userRealName', label='用户名称')
    el-table-column(prop='origin', label='经验来源')
    el-table-column(prop='expChange', label='经验值')
      template(slot-scope='{ row }')
        span.danger {{Number(row.expChange) >0 ?'+':''}}
        span.danger {{ row.expChange }}
    el-table-column(prop='createTime', label='创建时间')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(prop='effectiveDate', label='有效期')
      template(slot-scope='{ row }') {{ row.effectiveDate | dateFormat }}
    el-table-column(prop='remark', label='备注')
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )

  el-dialog(title="新增经验"
    @close="cancel"
    :visible.sync="newExpDlg" width="600px")
    .flex-center
      el-form(label-width="100px")
        el-form-item(label="用户:" required)
          el-select.mgl1(v-model="newExpInfo.userId" filterable
              placeholder="请选择")
              el-option(v-for="item in userList"
              :key="item.id"
              :label="item.realName"
              :value="item.id")
        el-form-item(label="经验值:" required)
          el-input(v-model='newExpInfo.expChange', placeholder='请输入经验值')
        el-form-item(label="备注:" )
          el-input(v-model='newExpInfo.remark', placeholder='')
    span.dialog-footer(slot="footer")
      el-button.mgl3(type="warning" @click="cancel") 取消
      el-button.mgl3(type="primary" @click="submmit") 提交
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
export default {
  name: 'ExpDetail',
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getDptExpList',
      dtpApi: 'getDptExpList',
      myApi: 'getMyExp',
      model: {
        startTime: '',
        endTime: '',
        UserId: '',
        Origin: '',
        ExpChange: '',
        resDepId: '',
        page: 1,
        pageSize: 10,
      },
      newExpInfo: {
        userId: '',
        expChange: '',
        remark: '',
      },
      newExpDlg: false,
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo']),
  },
  methods: {
    deleteExp (row) {
      this.$vgo.open(() => {
        this.$api.delExpById(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.search()
        })
      })
    },
    cancel () {
      this.newExpDlg = false
      for (const key in this.newExpInfo) {
        this.newExpInfo[key] = ''
      }
    },
    submmit () {
      for (const key in this.newExpInfo) {
        if (this.newExpInfo[key] === '' && key !== 'remark') {
          this.$vgo.tip('请完善表单数据！', 'warning')
          return
        }
      }
      this.$api.createExp(this.newExpInfo).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.search()
        this.cancel()
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
