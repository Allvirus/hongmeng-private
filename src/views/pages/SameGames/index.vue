<template lang='pug'>
.games
  .selector.border.border-radius.bg-white.ff-cn
    .item(
      v-for='(item, index) in conditList',
      :class='index < conditList.length - 1 ? "border-bottom-dot" : ""',
      :key='index'
    )
      TypeFilter(:data.sync='item')
  .bg-white.mgy2.pd2
    .ff-rn.jc-between.ai-center
      p 同类游戏列表
      .ff-rn.ai-center
        el-input.w200(
          placeholder='请输入搜索内容',
          v-model='model.keywords',
          clearable
        )
          el-button(slot='append', icon='el-icon-search', @click='startSearch')
        el-button.btn.btn-primary.mgl2(
          type='primary',
          @click='showEditDlg(null)'
        ) 添加
    el-table.mgt2(:data='listMixin.list')
      el-table-column(prop='realName', label='姓名')
      el-table-column(prop='joinPeople', label='收到微信人数')
      el-table-column(
        prop='createTime',
        label='时间',
        :width='OS.isPc ? 0 : 200'
      )
        template(slot-scope='{ row }') {{ row.createTime | dateFormat }}
      el-table-column(prop='opt', label='操作', :width='OS.isPc ? 0 : 150')
        template(slot-scope='{ row }')
          .ff-rn.jc-start
            el-button.mgl3(
              icon='el-icon-edit-outline',
              type='text',
              @click='showEditDlg(row)'
            ) 编辑
            el-button.mgl3.danger(
              icon='el-icon-delete',
              type='text',
              @click='deleteGame(row)'
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
    :title='gameInfo.isEdit ? "编辑" : "新增"',
    @close='gameInfo.isShow = false',
    :visible.sync='gameInfo.isShow',
    width='600px'
  )
    .flex-center
      el-form(label-width='100px', label-position='left')
        el-form-item(label='游戏名称:', required)
          el-input(v-model='gameInfo.gameName', placeholder='请输入游戏', clearable)
        el-form-item(label='设备类型:', required)
          el-checkbox-group(v-model='gameInfo.typeList')
            el-checkbox(label='安卓')
            el-checkbox(label='苹果')
        el-form-item(label='建帮金额(元):', required)
          el-checkbox-group(v-model='gameInfo.typeList')
            el-checkbox(label='免费')
            el-checkbox(label='10~50')
        el-form-item(label='游戏描述:', required)
          el-input(
            v-model='gameInfo.desc',
            type='textarea',
            :rows='2',
            clearable
          )
        el-form-item(label='宣传图:', required)
          el-upload(
            action='true',
            accept='.jpg,.jpeg,.png,.bmp,.gif',
            :crop='true',
            :isPicture='true',
            :cropConfig='{ width: 256, height: 256 }',
            @avatarUrl='onUploaded'
          )
        .border-bottom
        p.mgy2 自定义信息
        el-form-item(label='帮聊等级:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入帮聊等级',
            clearable
          )
        el-form-item(label='私聊等级:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入私聊等级',
            clearable
          )
        el-form-item(label='世界聊等级:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入世界聊等级',
            clearable
          )
        el-form-item(label='建帮等级:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入建帮等级',
            clearable
          )
        el-form-item(label='建帮金额(元):')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入建帮金额(元)',
            clearable
          )
        el-form-item(label='是否可邀帮:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入是否可邀帮',
            clearable
          )
        el-form-item(label='是否可职位邀帮:')
          el-input(
            v-model='gameInfo.gameName',
            placeholder='请输入是否可职位邀帮',
            clearable
          )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='gameInfo.isShow = false') 取消
      el-button.mgl3(type='primary', @click='submmit') 提交
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
export default {
  name: '',
  components: {
    TypeFilter: () => import('@/components/TypeFilter'),
  },
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getAllWxAchievedList',
      checkedItem: [],
      conditList: [],
      model: {
        Page: 1,
        PageSize: 10,
        keywords: '',
        userId: '',
        startTime: '',
        endTime: '',
      },
      gameInfo: {
        isShow: false,
        isEdit: false,
        gameName: '',
        desc: '',
        typeList: [],
      },
    }
  },
  computed: {
    ...mapGetters(['OS']),
  },
  created () {
    this.initFake()
  },
  methods: {
    onUploaded (fileUrl) {
      // this.$api.updateAvatar(fileUrl).then(data => {
      // })
    },
    startSearch () {
      console.log('search ', this.model.keywords)
    },
    showEditDlg (row) {
      this.gameInfo.isEdit = row !== null
      if (row) {
        Object.assign(this.gameInfo, row)
      }
      this.gameInfo.isShow = true
    },
    submmit () {
      this.gameInfo.isShow = false
    },
    deleteGame (row) {
      this.$vgo.open(() => {

      })
    },
    handleCheckedChange () {

    },
    initFake () {
      let count = 4
      while (count-- > 0) {
        const item = {
          title: '设备类型' + count,
          list: [],
        }
        let i = 30
        while (i-- > 0) {
          item.list.push({
            id: i,
            isCheck: false,
            name: '安卓' + i,
          })
        }
        this.conditList.push(item)
      }
    },
  },
}
</script>
<style lang='stylus' scoped></style>
