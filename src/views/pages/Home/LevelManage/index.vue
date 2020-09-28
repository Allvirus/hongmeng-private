<template lang='pug'>
  .LevelManage
    .ff-rn.fs-m.ai-center.mgt2
      el-form.ff-rn(label-width="100px")
          el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
          el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

    el-table.mgy2(:data='listMixin.list')
      el-table-column(prop="userAccount" label="玩家账号")
      el-table-column(prop="userCode" label="玩家代码")
      el-table-column(prop="gameName" label="游戏名称")
      el-table-column(prop="areaName" label="区服")
      el-table-column(prop="roleName" label="游戏角色")
      el-table-column(prop="createDate" label="创建时间")
</template>
<script>
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: 'LevelManage',
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getAllLevel',
      model: {
      },
    }
  },
  computed: {
  },
  created: function () {
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
        GameName: '',
        RoleName: '',
        page: 1,
        pageSize: 10,
      }
      this.getListMixin()
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
