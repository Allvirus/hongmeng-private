<template lang='pug'>
.MyRoles
  .ff-rn.fs-m.ai-center.mgt2.bg-white.pd2
    el-form.ff-rw.bg-white.pd2.ai-center(label-width='100px')
      el-form-item(label='部门:', v-if='userInfo.isLeader')
        tree-selector.winput(
          ref='dtptree',
          :data='myDptList.list',
          :defProps='myDptList.props',
          nodeKey='id',
          clearable,
          @change='onDepartChange'
        )
      el-form-item(label='员工:' v-if='userInfo.isLeader')
        el-select.winput(v-model='model.userId', placeholder='请选择', clearable)
          el-option(
            v-for='item in userList',
            :key='item.id',
            :label='item.realName',
            :value='item.id'
          )
      el-form-item(label='玩家账号:')
        el-input.winput(v-model='model.UserAccount')
      el-form-item(label='游戏名称:')
        auto-complete(v-model='model.GameName', :data='gameList')
      el-form-item(label='游戏角色:')
        el-input.winput(v-model='model.RoleName')
      el-form-item(label='区服:')
        auto-complete(v-model='model.AreaName', :data='areaList')
      el-form-item(label='创建时间:')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(icon='el-icon-search', type='primary', @click='search') 搜索
        el-button.mgl2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='resetPageMixin'
        ) 重置

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='userAccount', label='玩家账号')
    el-table-column(prop='account', label='推广员账户')
    el-table-column(prop='gameName', label='游戏名称')
    el-table-column(prop='areaName', label='区服')
    el-table-column(prop='roleName', label='游戏角色')
    el-table-column(prop='osType', label='平台')
      template(slot-scope='{ row }') {{ row.osType | formatOSType }}
    el-table-column(prop='createDate', label='创建时间')
      template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
    el-table-column(prop='ajob', label='A岗')
    el-table-column(prop='bjob', label='B岗')
    el-table-column(prop='cjob', label='C岗')
  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.pageSize',
    :current-page.sync='model.page',
    @current-change='getListMixin'
  )
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyRoles',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getRoleInfos',
      dtpApi: 'getDptRoleInfos',
      myApi: 'getRoleInfos',
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        Account: '',
        UserCode: '',
        GameName: '',
        RoleName: '',
        AreaName: '',
        userId: '',
        resDepId: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo']),
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item
  margin-bottom 10px
</style>
