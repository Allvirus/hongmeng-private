<template lang='pug'>
.target
  .condition.pd2.bg-white
    el-form.ff-rw.ai-center(label-width='100px')
      el-form-item(
        label='员工:',
        :class='OS.isPc ? "" : "mgl1"',
        :label-width='OS.isPc ? "60px" : "100px"',
        v-if='userInfo.menu.wechatAuthority'
      )
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
      el-form-item(label='时间:', label-width='60px', v-if='OS.isPc')
        CommonDatePicker.w300(
          :start.sync='model.startTime',
          :end.sync='model.endTime',
          all
        )
      el-form-item.search-btn.mgb1(
        :class='OS.isPc ? "" : "jc-center full"',
        label-width='20px'
      )
        el-button(icon='el-icon-search', type='primary', @click='search') 搜索
        el-button.mgr2(
          icon='el-icon-refresh-right',
          type='primary',
          @click='reset'
        ) 重置
        el-checkbox.mgt1(
          :class='OS.isPc ? "" : "mgb3"',
          v-model='searchMyData',
          v-if='userInfo.menu.wechatAuthority'
        ) 搜索我的数据
      .flex-1.jc-end
        el-button.mgr3(
          type='primary',
          v-if='userInfo.menu.wechatAuthority',
          @click='showEdit(null, false)'
        ) 登记
  .bg-white
    v-histogram.charts.flex-1.mgt2(:data='chartData')

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='realName', label='姓名')
    el-table-column(prop='joinPeople', label='加入微信群数')
    el-table-column(prop='receivedPeople', label='收到微信人数')
    el-table-column(prop='createTime', label='时间')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(
      prop='opt',
      label='操作',
      v-if='userInfo.menu.wechatAuthority'
    )
      template(slot-scope='{ row }')
        .ff-rn
          el-button.mgl3(
            icon='el-icon-edit-outline',
            type='text',
            @click='showEdit(row, true)'
          ) 编辑
          el-button.mgl3.danger(
            icon='el-icon-delete',
            type='text',
            @click='deleteRec(row)'
          ) 删除

  el-pagination.margin-spacing(
    :total='listMixin.count',
    :page-size.sync='model.PageSize',
    :current-page.sync='model.Page',
    @current-change='getListMixin'
  )

  el-dialog(
    :title='editInfo.isEdit ? "编辑" : "新增"',
    @close='editInfo.isShow = false',
    :visible.sync='editInfo.isShow',
    width='600px'
  )
    .flex-center
      el-form(
        label-width='120px',
        :model='editInfo',
        ref='form',
        :rules='rules'
      )
        el-form-item(label='员工:', v-if='!editInfo.isEdit', prop='userId')
          el-select.winput(
            v-model='editInfo.userId',
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
        el-form-item.mgt2(label='加入微信群数:', , prop='joinPeople')
          el-input.winput(
            placeholder='请输入加入微信群数',
            v-model='editInfo.joinPeople'
          )
        el-form-item.mgt2(label='收到微信人数:', , prop='receivedPeople')
          el-input.winput(
            placeholder='请输入收到微信人数',
            v-model='editInfo.receivedPeople'
          )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='editInfo.isShow = false') 取消
      el-button.mgl3(type='primary', @click='submmitEdit') 提交
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import dptListMixin from '@/mixins/dptListMixin'
import { EUIRule } from '@/plugins/utils'
export default {
  name: 'MyTarget',
  components: {
    VHistogram: () => import('v-charts/lib/histogram.common'),
  },
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getAllWxAchievedList',
      dtpApi: 'getAllWxAchievedList',
      myApi: 'getMyWxAchievedList',
      model: {
        userId: '',
        startTime: '',
        endTime: '',
        Page: 1,
        PageSize: 10,
      },
      chartData: {
        columns: ['员工', '加入微信群数', '收到微信人数'],
        rows: [],
      },
      editInfo: {
        isShow: false,
        isEdit: false,
        userId: '',
        receivedPeople: '',
        joinPeople: '',
      },
      rules: {
        userId: [EUIRule('required', '员工')],
        receivedPeople: [EUIRule('required', '收到微信人数')],
        joinPeople: [EUIRule('required', '加入微信群数')],
      },
      isMyTarget: true,
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo', 'OS']),
  },
  created () {
    console.log('page...', this.userInfo)
    if (!this.userInfo.menu.wechatAuthority) {
      this.listApiForMixin = this.myApi
    }
  },
  methods: {
    showEdit (row, isEdit) {
      this.$utils.setObject(this.editInfo, '')
      if (row !== null) {
        Object.assign(this.editInfo, row)
      }
      this.editInfo.isEdit = row !== null
      this.editInfo.isShow = true
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    deleteRec (row) {
      this.$vgo.open(() => {
        this.$api.deleteWxAchievRec(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.getListMixin()
        })
      })
    },
    submmitEdit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.editInfo.isEdit) {
            this.$api.updateWxAchievRec(this.editInfo).then(data => {
              this.$vgo.tip('更新成功!', 'success')
              this.getListMixin()
              this.editInfo.isShow = false
            })
          } else {
            this.$api.createWxAchievRec(this.editInfo).then(data => {
              this.$vgo.tip('登记成功!', 'success')
              this.getListMixin()
              this.editInfo.isShow = false
            })
          }
        }
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.target
  .el-form-item
    margin-bottom 0px
</style>
