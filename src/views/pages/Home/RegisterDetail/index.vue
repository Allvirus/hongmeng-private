<template lang='pug'>
  .MyRegister.pd3
    .ff-rn.fs-m.ai-center.mgt2
      label 玩家代码 :
      el-select.mgl1(v-model="tdTyp" placeholder="请选择")
        el-option(v-for="item in tdTypLst"
        :key="item.value"
        :label="item.label"
        :value="item.value")
      label.mgl2 员工 :
      el-select.mgl1(v-model="tdTyp" placeholder="请选择")
        el-option(v-for="item in tdTypLst"
        :key="item.value"
        :label="item.label"
        :value="item.value")
      label.mgl3 注册时间:
      CommonDatePicker.mgl1(:start.sync='startdate' :end.sync='enddate' @change='search()')
      el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索
      el-button.mgl2(icon="el-icon-refresh-right" type="primary" @click="reset") 重置

    el-table.mgy2(:data='listMixin.list' :row-class-name="({ row }) => row.is_payout ? 'danger' : ''")
                el-table-column(prop="created" label="玩家账号")
                el-table-column(prop="amount" label="玩家代码")
                el-table-column(prop="type_text" label="手机号码")
                el-table-column(prop="remark" label="设备号")
                el-table-column(prop="balance" label="注册时间")
                el-table-column(prop="balance" label="注册IP")
                el-table-column(prop="balance" label="A岗")
                el-table-column(prop="balance" label="B岗")
                el-table-column(prop="balance" label="C岗")
                el-table-column(prop="balance" label="操作")
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
      model: {
        page: 1,
        pageSize: 10,
      },
      startdate: '',
      enddate: '',
    }
  },
  methods: {
    search () {
      this.$vgo.tip('开始搜索 ', 'success')
    },
    reset () {
      this.tdTyp = ''
      this.startdate = ''
      this.enddate = ''
      this.$vgo.tip('已重置', 'success')
      this.search()
    },
  },
}
</script>
<style lang='stylus' scoped>
</style>
