<template lang='pug'>
.games
  .selector.border.border-radius.bg-white.ff-cn
    .border-bottom-dash
      ChannelFilter(
        :data='paramsList.operators',
        title='运营商',
        propKey='operatorName'
      )
    .item
      ChannelFilter(
        :data='paramsList.gameTypes',
        title='游戏类型',
        propKey='gameTypeName'
      )
  .bg-white.mgy2.pd2
    .ff-rn.jc-between.ai-center
      p 同类游戏列表
      .ff-rn.ai-center
        el-button.btn.btn-primary.el-icon-plus(
          type='primary',
          @click='showEditDlg(null)'
        ) 添加
        el-input.w200.mgl2(
          placeholder='请输入游戏名称',
          v-model='model.GameName',
          clearable,
          @clear='getListMixin'
        )
          el-button(
            slot='append',
            icon='el-icon-search',
            @click='getListMixin'
          )
    el-table.mgt2(:data='listMixin.list')
      el-table-column(prop='gameName', label='游戏名称', width='150')
        template(slot-scope='{ row }')
          .ff-rn.ai-center
            img.w50.h50.border-radius(:src='getLogoUrl(row)', alt='alt')
            span.mgl2.omit {{ row.gameName }}
      el-table-column(prop='operator', label='运营商')
      el-table-column(prop='gameType', label='游戏类型')
      el-table-column(prop='equipmentType', label='设备类型')
        template(slot-scope='{ row }')
          span {{ row.equipmentType === 1 ? "安卓" : "苹果" }}
      el-table-column(prop='juntoChatLevel', label='帮聊等级')
      el-table-column(prop='privateChatLevel', label='私聊等级')
      el-table-column(prop='worldChatLevel', label='世界等级')
      el-table-column(prop='ceateJuntoLevel', label='建帮等级')
      el-table-column(prop='ceateJuntoCost', label='建帮金额(元)')
        template(slot-scope='{ row }') {{ row.ceateJuntoCost | toFixed }}
      el-table-column(prop='isInviteJunto', label='是否可邀帮')
        template(slot-scope='{ row }')
          span {{ row.isInviteJunto ? "是" : "否" }}
      el-table-column(prop='isPostInviteJunto', label='是否可职位邀帮')
        template(slot-scope='{ row }')
          span {{ row.isPostInviteJunto ? "是" : "否" }}
      el-table-column(prop='remark', label='游戏描述', width='100')
      el-table-column(prop='joinPeople', label='上传时间', width='130')
        template(slot-scope='{ row }')
          span {{ row.uploadTime | dateFormat }}
      el-table-column(prop='joinPeople', label='更新时间', width='130')
        template(slot-scope='{ row }')
          span {{ row.updateTime | dateFormat }}
      el-table-column(prop='opt', label='操作', :width='OS.isPc ? 250 : 150')
        template(slot-scope='{ row }')
          .ff-rn.jc-start
            el-button.mgl3(
              icon='el-icon-download',
              type='text',
              @click='downLoad(row)'
            ) 下载
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
      el-form(
        label-width='100px',
        label-position='left',
        ref='form',
        :model='gameInfo',
        :rules='rules'
      )
        el-form-item(label='游戏名称:', prop='gameName')
          el-input(v-model='gameInfo.gameName', placeholder='请输入游戏', clearable)
        el-form-item(label='设备类型:', prop='equipmentType')
          el-radio-group(v-model='gameInfo.equipmentType')
            el-radio(:label='1') 安卓
            el-radio(:label='2') 苹果
        el-form-item(label='运营商:', prop='operator')
          el-select(
            v-model='gameInfo.operator',
            placeholder='请选择运营商',
            clearable,
            filterable
          )
            el-option(
              v-for='item in paramsList.operators',
              :key='item.id',
              :label='item.operatorName',
              :value='item.operatorName'
            )
        el-form-item(label='游戏类型:', prop='gameType')
          el-select(
            v-model='gameInfo.gameType',
            placeholder='请选择运营商',
            clearable,
            filterable
          )
            el-option(
              v-for='item in paramsList.gameTypes',
              :key='item.id',
              :label='item.gameTypeName',
              :value='item.gameTypeName'
            )
        el-form-item(label='建帮金额(元):', prop='equipmentType')
          el-checkbox-group(v-model='gameInfo.ceateJuntoCost')
            el-checkbox(label='免费')
            el-checkbox(label='10~50')
        el-form-item(label='游戏描述:', prop='remark')
          el-input(
            v-model='gameInfo.remark',
            type='textarea',
            :rows='2',
            clearable
          )
        el-form-item(label='apk:', prop='gamePicUrl')
          el-upload(
            displayType='button',
            action='true',
            accept='.apk',
            :crop='true'
          )
            el-button.btn.btn-default(type='submit') 上传
        el-form-item(label='游戏图标:', prop='gamePicUrl')
          el-upload(
            action='true',
            accept='.jpg,.jpeg,.png,.bmp,.gif',
            :crop='true',
            :avatar.sync='previewLogo',
            @avatarUrl='onLogoUploaded'
          )
        .border-bottom
        p.mgy2 自定义信息
        el-form-item(label='帮聊等级:', prop='juntoChatLevel')
          el-input(
            v-model='gameInfo.juntoChatLevel',
            placeholder='请输入帮聊等级',
            clearable
          )
        el-form-item(label='私聊等级:', prop='privateChatLevel')
          el-input(
            v-model='gameInfo.privateChatLevel',
            placeholder='请输入私聊等级',
            clearable
          )
        el-form-item(label='世界聊等级:', prop='worldChatLevel')
          el-input(
            v-model='gameInfo.worldChatLevel',
            placeholder='请输入世界聊等级',
            clearable
          )
        el-form-item(label='建帮等级:', prop='ceateJuntoLevel')
          el-input(
            v-model='gameInfo.ceateJuntoLevel',
            placeholder='请输入建帮等级',
            clearable
          )
        el-form-item(label='建帮金额(元):', prop='ceateJuntoCost')
          el-input(
            v-model='gameInfo.ceateJuntoCost',
            placeholder='请输入建帮金额(元)',
            clearable
          )
        el-form-item(label='是否可邀帮:', prop='isInviteJunto')
          el-checkbox(v-model='gameInfo.isInviteJunto') 是否可邀帮
        el-form-item(label='是否可职位邀帮:', prop='isPostInviteJunto')
          el-checkbox(v-model='gameInfo.isPostInviteJunto') 是否可职位邀帮
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='gameInfo.isShow = false') 取消
      el-button.mgl3(type='primary', @click='submmit') 提交
</template>
<script>
import { mapGetters } from 'vuex'
import fetchListMixin from '@/mixins/fetchListMixin'
import { EUIRule } from '@/plugins/utils'
export default {
  name: '',
  components: {
    ChannelFilter: () => import('@/components/ChannelFilter'),
  },
  mixins: [fetchListMixin],
  data () {
    return {
      listApiForMixin: 'getGameChannel',
      previewLogo: '',
      paramsList: {
        operators: [],
        gameTypes: [],
      },
      model: {
        GameName: '', // | string | 否 | 游戏名称 |
        Operator: '', // | string | 否 | 运营商 |
        GameType: '', // | string | 否 | 游戏类型 |
        Page: 1, // | string | 否 | 页码默认为1 |
        PageSize: 10, // | string | 否 | 页数大小默认为5最大为20 |
      },
      gameInfo: {
        isShow: false,
        isEdit: false,
        gameName: '', // "string",
        equipmentType: 1, // 0,
        operator: '', // "string",
        gameType: '', // "string",
        downloadUrl: '', // "string",
        gamePicUrl: '', // "string",
        remark: '', // "string",
        juntoChatLevel: '', // "string",
        privateChatLevel: '', // "string",
        worldChatLevel: '', // "string",
        ceateJuntoLevel: '', // "string",
        ceateJuntoCost: '', // "string",
        isInviteJunto: true, // true,
        isPostInviteJunto: true, // true
      },
      rules: {
        gameName: [EUIRule('required', '游戏名称')],
        operator: [EUIRule('required', '运营商')],
        gameType: [EUIRule('required', '游戏类型')],
        gamePicUrl: [EUIRule('required', '游戏图标')],
        downloadUrl: [EUIRule('required', 'apk地址')],
      },
    }
  },
  computed: {
    ...mapGetters(['OS']),
  },
  created () {
    this.init()
    this.gameInfoBak = JSON.parse(JSON.stringify(this.gameInfo))
  },
  methods: {
    init () {
      this.$api.getOperators().then(data => {
        this.paramsList.operators = data
      })

      this.$api.getGameType().then(data => {
        this.paramsList.gameTypes = data
      })
    },
    getLogoUrl (row) {
      return $globalconfig.API + row.gamePicUrl
    },
    onLogoUploaded (fileUrl) {
      this.previewLogo = $globalconfig.API + fileUrl
      this.gameInfo.gamePicUrl = fileUrl
    },
    downLoad (row) {

    },
    showEditDlg (row) {
      if (row) {
        Object.assign(this.gameInfo, row)
        this.previewLogo = $globalconfig.API + row.gamePicUrl
      } else {
        this.gameInfo = JSON.parse(JSON.stringify(this.gameInfoBak))
        this.previewLogo = ''
      }
      this.gameInfo.isEdit = row !== null
      this.gameInfo.isShow = true
    },
    submmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.gameInfo.isEdit) {
            this.$api.updateChannel(this.gameInfo).then(data => {
              this.$vgo.tip('更新成功!', 'success')
              this.getListMixin()
            })
          } else {
            this.$api.createChannel(this.gameInfo).then(data => {
              this.$vgo.tip('添加成功!', 'success')
              this.getListMixin()
            })
          }
          this.gameInfo.isShow = false
        }
      })
    },
    deleteGame (row) {
      this.$vgo.open(() => {
        this.$api.deleteChannel(row.id).then(data => {
          this.$vgo.tip('删除成功!', 'success')
          this.getListMixin()
        })
      })
    },
    handleCheckedChange () {

    },
  },
}
</script>
<style lang='stylus' scoped></style>
