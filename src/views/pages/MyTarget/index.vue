<template lang='pug'>
.target.pdx2
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
            v-for='item in AJobUserList',
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
      .flex-1.jc-end(v-if='OS.isPc')
        el-button.mgr3(
          type='primary',
          v-if='userInfo.menu.wechatAuthority',
          @click='showEdit(null, false)'
        ) 登记
    .flex-1.jc-end
      el-button.mgr3.fr(
        type='primary',
        v-if='userInfo.menu.wechatAuthority && !OS.isPc',
        @click='showEdit(null, false)'
      ) 登记
  //- .bg-white
  //-   v-histogram.charts.flex-1.mgt2(:data='chartData')
  .ff-rn.mgt2(v-if='OS.isPc')
    data-box.flex-1.mgx1(
      :data='{ title: "加入微信群数", value: listMixin.totalJoinPeople }',
      :colIdx='1'
    )
    data-box.flex-1.mgx1(
      :data='{ title: "收到微信人数", value: listMixin.totalReceivedPeople }',
      :colIdx='1'
    )
    data-box.flex-1.mgx1(
      :data='{ title: "加入微信群目标数", value: achievTarget[0].context }',
      :colIdx='2'
    )
    data-box.flex-1.mgx1(
      :data='{ title: "收到微信人目标数", value: achievTarget[1].context }',
      :colIdx='2'
    )
  .ff-rn.mgt2(v-else)
    .ff-cn.bg-white.flex-1
      p.mgt2.jc-center 入微信群数
      h3.jc-center.mgy2.warning {{ listMixin.totalJoinPeople }}
    .ff-cn.bg-white.flex-1
      p.mgt2.jc-center 收到微信人数
      h3.jc-center.mgy2.warning {{ listMixin.totalReceivedPeople }}
    .ff-cn.bg-white.flex-1
      p.mgt2.jc-center 入微信群目标
      h3.jc-center.mgy2.success {{ achievTarget[0].context }}
    .ff-cn.bg-white.flex-1
      p.mgt2.jc-center 收到微信目标
      h3.jc-center.mgy2.success {{ achievTarget[1].context }}

  el-table.mgy2.bg-white.pd2(:data='listMixin.list')
    el-table-column(prop='realName', label='姓名')
    el-table-column(prop='joinPeople', label='加入微信群数')
      template(slot-scope='{ row }')
        span(
          :class='Number(row.joinPeople) > Number(achievTarget[0].context) ? "success" : "danger"'
        ) {{ row.joinPeople }}
    el-table-column(prop='receivedPeople', label='收到微信人数')
      template(slot-scope='{ row }')
        span(
          :class='Number(row.receivedPeople) > Number(achievTarget[1].context) ? "success" : "danger"'
        ) {{ row.receivedPeople }}
    el-table-column(prop='createTime', label='时间', :width='OS.isPc ? 0 : 200')
      template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
    el-table-column(
      prop='opt',
      label='操作',
      v-if='userInfo.menu.wechatAuthority',
      :width='OS.isPc ? 0 : 150'
    )
      template(slot-scope='{ row }')
        .ff-rn.jc-start
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
    @current-change='getListMixin',
    :class='OS.isPc ? "margin-spacing" : ""',
    :base='!OS.isPc',
    :small='!OS.isPc'
  )

  el-dialog(
    :title='editInfo.isEdit ? "编辑" : "新增"',
    @close='editInfo.isShow = false',
    :visible.sync='editInfo.isShow',
    :width='OS.isPc ? "600px" : "300px"'
  )
    .flex-center
      el-form(
        :label-width='OS.isPc ? "120px" : "0px"',
        :model='editInfo',
        ref='form',
        :rules='rules'
      )
        el-form-item(label='日期:', v-if='!editInfo.isEdit', prop='userId')
          sapn {{ editInfo.date }}

        el-form-item.mgt3(
          :label='OS.isPc ? "员工:" : ""',
          v-if='!editInfo.isEdit',
          prop='userId'
        )
          el-select.winput(
            v-model='editInfo.userId',
            placeholder='请选择',
            clearable,
            filterable
          )
            el-option(
              v-for='item in AJobUserList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item.mgt3(:label='OS.isPc ? "加入微信群数:" : ""', prop='joinPeople')
          el-input.winput(
            placeholder='请输入加入微信群数',
            clearable,
            v-model='editInfo.joinPeople'
          )
        el-form-item.mgt3(
          :label='OS.isPc ? "收到微信人数:" : ""',
          prop='receivedPeople'
        )
          el-input.winput(
            placeholder='请输入收到微信人数',
            clearable,
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
    DataBox: () => import('@/views/pages/Home/MyAchievement/comps/DataBox'),
  },
  mixins: [dptListMixin, fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getAllWxAchievedList',
      dtpApi: 'getAllWxAchievedList',
      myApi: 'getMyWxAchievedList',
      model: {
        userId: '',
        startTime: new Date().toLocaleDateString().split('/').join('-'),
        endTime: new Date().toLocaleDateString().split('/').join('-'),
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
        date: '',
        userId: '',
        receivedPeople: '',
        joinPeople: '',
      },
      rules: {
        userId: [EUIRule('required', '员工')],
        receivedPeople: [EUIRule('required', '收到微信人数')],
        joinPeople: [EUIRule('required', '加入微信群数')],
      },
      isMyTarget: true, // 主要是用于混合代码的逻辑判断处理
      AJobUserList: [], // A岗用户列表
      achievTarget: [
        { context: '' },
        { context: '' },
      ],
    }
  },
  computed: {
    ...mapGetters(['myDptList', 'userInfo', 'OS']),
  },
  created () {
    if (!this.userInfo.menu.wechatAuthority) {
      this.listApiForMixin = this.myApi
    }
    this.$api.getAJobsUserList().then(data => {
      this.AJobUserList = data
    })

    this.$api.getAchievTarget().then(data => {
      this.achievTarget = data
      console.log(this.achievTarget)
    })
  },
  methods: {
    showEdit (row, isEdit) {
      this.$utils.setObject(this.editInfo, '')
      if (row !== null) {
        Object.assign(this.editInfo, row)
      } else {
        // 获取今天的日期
        this.editInfo.date = new Date().toLocaleDateString().split('/').join('-')
      }
      this.editInfo.isEdit = row !== null
      this.editInfo.isShow = true
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
