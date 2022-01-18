<template lang="pug">
  .PlayersBind
    el-form.ff-rw.ai-center.bg-white.pdt2.pdx2(label-width='70px')
      el-form-item(label='玩家账户:' label-width='80px')
        el-input(v-model="model.UserAccount")
      el-form-item(label='玩家代码:' label-width='100px')
        el-input(v-model="model.UserCode")
      el-form-item(label='原推广:' label-width='80px')
        el-input(v-model="model.FromAccount")
      el-form-item(label='现推广:' label-width='80px')
        el-input(v-model="model.ToAccount")
      el-form-item(label='换绑类型:' label-width='80px')
        el-select.winput(
          v-model='model.Type',
          placeholder='请选择',
          clearable,
          filterable
        )
          el-option(
            v-for='item in TypeList',
            :key='item.name',
            :label='item.name',
            :value='item.value'
          )
      el-form-item.mgl3(label='选择时间:' label-width='80px')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
        el-button.mgl3(
          icon='el-icon-search',
          type='primary',
          @click="search"
        ) 搜索
        el-button.mgl2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置
    .showbox.bg-white.mgt2.pd2
      el-table(
        :data='listMixin.list',
      )
        el-table-column(prop='userAccount', label='玩家账户')
        el-table-column(prop='fromAccount', label='原归属推广')
        el-table-column(prop='toAccount', label='换绑归属推广')
        el-table-column(prop='createDate', label='订单起始时间')
          template(slot-scope='{ row }') {{ row.createDate | dateFormat }}
        el-table-column(prop='rebindTime', label='换绑时间')
          template(slot-scope='{ row }') {{ row.rebindTime | dateFormat }}
        el-table-column(prop='type', label='换绑类型')
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
import dptListMixin from '@/mixins/dptListMixin'
export default {
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getPlayerData',
      dtpApi: 'getPlayerData',
      myApi: 'getPlayerData',
      TypeList: [
        {
          name: 'In',
          value: 'In',
        },
        {
          name: 'Out',
          value: 'Out',
        },
        {
          name: 'Inside',
          value: 'Inside',
        },
        {
          name: '全部',
          value: '',
        },
      ],
      model: {
        startTime: '',
        endTime: '',
        UserAccount: '',
        UserCode: '',
        FromAccount: '',
        ToAccount: '',
        Type: '',
        pageSize: 10,
        page: 1,
      },
      configList: [],
      radio3: 1,
    }
  },
  computed: {
    ...mapGetters(['areaList', 'gameList', 'myDptList', 'userInfo', 'OS']),
  },
  mounted () {
  },
  methods: {
    reset () {
      for (const key in this.model) {
        if (key === 'pageSize') {
          this.model[key] = 10
        } else if (key === 'page') {
          this.model[key] = 1
        } else {
          this.model[key] = ''
        }
      }
    },
  },
}
</script>
<style lang="stylus" scoped>

</style>
