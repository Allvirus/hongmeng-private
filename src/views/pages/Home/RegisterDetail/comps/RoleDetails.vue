<template lang='pug'>
.role-detail
  el-dialog(
    v-bind='$attrs',
    v-on='$listeners',
    title='角色明细',
    width='1600px',
    @close='$emit("cancel")'
  )
    .ff-rn.fs-m.ai-center.bg-white.pdx2.pdt2
      el-form.ff-rw.ai-center(label-width='100px')
        el-form-item(label='IfunId:')
          el-input.winput(
            v-model='model.IfunId',
            placeholder='请输入IfunId',
            clearable
          )
        el-form-item(label='游戏角色:')
          el-input.winput(
            v-model='model.RoleName',
            placeholder='请输入游戏角色',
            clearable
          )
        el-form-item(label='游戏名称:')
          auto-complete(
            v-model='model.GameName',
            :data='gameList',
            placeholder='请输入游戏名称'
          )
        el-form-item(label='区服:')
          auto-complete(
            v-model='model.AreaName',
            :data='areaList',
            placeholder='请输入区服'
          )
        el-form-item(label='创建时间:', v-if='OS.isPc')
          CommonDatePicker.w300(
            :start.sync='model.startTime',
            :end.sync='model.endTime',
            all
          )
        el-button.mgl3.mgb2(
          :class='OS.isPc ? "" : "mgb2"',
          icon='el-icon-search',
          type='primary',
          @click='getRoles'
        ) 搜索
        el-button.mgl2.mgr2.mgb2(
          :class='OS.isPc ? "" : "mgb2"',
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置

    el-table.mgy2.bg-white.pd2(:data='roleList.list')
      el-table-column(prop='ifunAccountId', label='ID')
      el-table-column(prop='userCode', label='账号ID')
      el-table-column(prop='roleCode', label='角色代码')
      el-table-column(label='角色等级/城堡等级', width='120px')
        template(slot-scope='{ row }') {{ formatLevel(row) }}
      el-table-column(prop='country', label='国家')
      el-table-column(prop='account', label='推广员账户')
      el-table-column(prop='platform', label='平台', width='80px')
        template(slot-scope='{ row }') {{ row.platform === 0 ? 'Ifun' : '木勺' }}
      el-table-column(prop='gameName', label='游戏名称')
      el-table-column(prop='areaCode', label='区服')
      el-table-column(prop='roleName', label='游戏角色')
      el-table-column(prop='accountCreateDate', label='账号注册时间', width='130px')
        template(slot-scope='{ row }') {{ row.accountCreateDate | dateFormat }}
      el-table-column(prop='createIp', label='IP', width='130px')
      el-table-column(prop='deviceNo', label='设备ID', min-width='180px')
      el-table-column(prop='osType', label='平台', width='70px')
        template(slot-scope='{ row }') {{ row.osType | formatOSType }}
      el-table-column(prop='createDate', label='创建时间', width='130px')
        template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
      el-table-column(prop='ajob', label='A岗')
      el-table-column(prop='bjob', label='B岗')
      el-table-column(prop='cjob', label='C岗')
    el-pagination.margin-spacing(
      :total='roleList.count',
      :page-sizes='[10, 20, 30, 50]',
      :page-size.sync='model.pageSize',
      :current-page.sync='model.page',
      @current-change='getRoles',
      :class='OS.isPc ? "margin-spacing" : ""',
      :base='!OS.isPc',
      :small='!OS.isPc'
    )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='$emit("cancel")') 取消
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyRoles',
  props: {
    UserAccount: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      model: {
        startTime: '',
        endTime: '',
        UserAccount: 'ms411567789',
        IfunId: '',
        GameName: '',
        RoleName: '',
        AreaName: '',
        platform: '0',
        page: 1,
        pageSize: 10,
      },
      roleList: [],
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'OS', 'userInfo']),
  },
  watch: {
    UserAccount (newVal, oldVal) {
      if (newVal !== '') {
        this.model.UserAccount = newVal
        this.getRoles()
      }
    },
  },
  methods: {
    formatLevel (row) {
      const castle = row.castle !== undefined && row.castle !== null && row.castle !== ''
        ? row.castle
        : row.castleLevel
      return [row.roleLevel, castle]
        .filter(item => item !== undefined && item !== null && item !== '')
        .join('/')
    },
    getRoles () {
      const method = this.userInfo.isLeader ? 'getDptRoleInfos' : 'getRoleInfos'
      this.$api[method](this.model).then(data => {
        this.roleList = data
      })
    },
    reset () {
      const tmpUser = this.model.UserAccount
      this.model = {
        startTime: '',
        endTime: '',
        UserAccount: tmpUser,
        IfunId: '',
        GameName: '',
        RoleName: '',
        AreaName: '',
        platform: '0',
        page: 1,
        pageSize: 10,
      }
      this.getRoles()
    },
  },
}
</script>
<style lang='stylus' scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
