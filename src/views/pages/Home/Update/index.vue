<template lang='pug'>
  .update
    .ff-rn.fs-m.bg-white.pdt2.opt-bar
      el-form.ff-rn(label-width="100px")
        el-form-item(label="部门名称:" required)
            tree-selector.mgl1(
              ref='dtptree',
              :data='myDptList.list',
              :defProps='myDptList.props',
              :deflabel='myDptList.list[0].name',
              nodeKey='id',
              clearable,
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
        el-form-item(label="注册时间:")
          CommonDatePicker.w300(:start.sync='model.startTime' :end.sync='model.endTime' all)
          el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索

    el-table.mgy2.bg-white.pd2(:data='listMixin.list')
      el-table-column(prop="deparmentName" label="部门")
      el-table-column(prop="levelName" label="等级")
      el-table-column(prop="cUserName" label="C岗")
      el-table-column(prop="memberName" label="推广员")
      el-table-column(prop="upgradeDate" label="升级时间")
        template(slot-scope="{ row }") {{row.upgradeDate | dateFormat}}

    el-pagination.margin-spacing(
      :total="listMixin.count"
      :page-size.sync='model.pageSize'
      :current-page.sync='model.page'
      @current-change="getListMixin")
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
      listApiForMixin: 'getUpdateList',
      dtpApi: 'getUpdateList',
      model: {
        userId: '',
        resDepId: '1',
        page: 1,
        pageSize: 10,
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
  },
}
</script>
<style lang='stylus'>
</style>
