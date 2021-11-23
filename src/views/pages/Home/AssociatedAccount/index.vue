<template lang="pug">
  .associat
    .ff-rn.fs-m.bg-white.pdt2.opt-bar
      el-form.ff-rn(label-width="100px")
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
        el-form-item.mgl4(label='平台推广账号:', v-if='userInfo.isLeader')
          el-input(v-model="model.account")
          el-button.mgl3(type="primary" @click="addAccount") 新增
          el-button.mgl3(icon="el-icon-search" type="primary" @click="search") 搜索

    el-table.mgy2.bg-white.pd2(:data='listMixin.list')
      el-table-column(prop="departmentName" label="所属组织")
      el-table-column(prop="userName" label="员工")
      el-table-column(prop="account" label="平台推广账户")
      el-table-column(prop="creatTime" label="创建时间")
        template(slot-scope='{ row }') {{ row.creatTime | dateFormat }}
      el-table-column(prop="operate" label="操作" width="150")
        template(slot-scope="{ row }")
            el-button.danger(icon="el-icon-delete" type="text" @click="deleteLevel(row)") 删除

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
      listApiForMixin: 'getAccountAssociatData',
      dtpApi: 'getAccountAssociatData',
      model: {
        userId: '',
        account: '',
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
    addAccount () {
      if (this.model.userId === '' || this.model.account === '') {
        this.$vgo.tip('请填写完整账户信息', 'warning')
      } else {
        const module = {
          userId: this.model.userId,
          account: this.model.account,
        }
        this.$api.createAssociatedUser(module).then(res => {
          this.model.userId = ''
          this.model.account = ''
          this.getListMixin()
        })
      }
    },
    deleteLevel (info) {
      console.log(info)
      this.$vgo.open(() => {
        this.$api.byIDDeleteAccountAssociat(info.id).then(res => {
          this.$vgo.tip('删除成功', 'success')
          this.getListMixin()
        }).catch(err => {
          console.log(err)
          this.$vgo.tip('删除失败', 'error')
        })
      })
    },
  },
}
</script>
<style lang="stylus" scoped>

</style>
