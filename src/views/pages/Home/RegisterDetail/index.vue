<template lang='pug'>
  .MyRegister.pd3
    el-form.ff-rn.bg-white.pd2(label-width="100px")
      el-form-item(label="玩家账号:")
        el-input.w200(v-model="model.userAccount")
      el-form-item(label="玩家代码:")
        el-input.w200(v-model="model.userCode")
      el-form-item(label="注册时间:")
        CommonDatePicker.mgl1(:start.sync='model.startTime' :end.sync='model.endTime')
        el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
        el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

    el-table.mgy2.bg-white.pd2(:data='listMixin.list')
      el-table-column(prop="userAccount" label="玩家账号")
      el-table-column(prop="userCode" label="玩家代码")
      el-table-column(prop="deviceNo" label="设备号")
      el-table-column(prop="createDate" label="注册时间")
        template(slot-scope="{ row }") {{row.createDate | dateFormat}}
      el-table-column(prop="createIp" label="注册IP")
      el-table-column(prop="ajob" label="A岗")
      el-table-column(prop="bjob" label="B岗")
      el-table-column(prop="cjob" label="C岗")
      el-table-column(prop="" label="操作")
        template(slot-scope="{ row }")
          el-button(type="text" @click="showRole(row)") 查看角色

    el-pagination.margin-spacing(
      :total="listMixin.count"
      :page-size.sync='model.pageSize'
      :current-page.sync='model.page'
      @current-change="getListMixin")
</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'MyRegister',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getPlayerList',
      model: {
        startTime: '',
        endTime: '',
        userAccount: '',
        account: '',
        userCode: '',
        OSType: '',
        page: 1,
        pageSize: 10,
      },
    }
  },
  methods: {
    search () {
      this.getListMixin()
    },
    reset () {
      this.model = {
        startTime: '',
        endTime: '',
        UserAccount: '',
        Account: '',
        UserCode: '',
        OSType: '',
        page: 1,
        pageSize: 10,
      }
      this.getListMixin()
    },
    showRole () {

    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
