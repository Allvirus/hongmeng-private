<template lang='pug'>
.games
  .selector.border.border-radius.bg-white.ff-cn
    .border-bottom-dash(v-if='OS.isPc')
      ChannelFilter(
        :data='paramsList.operators',
        :selName.sync='model.Operator',
        @onChange='getListMixin',
        title='运营商',
        propKey='operatorName'
      )
    .item
      ChannelFilter(
        :data='paramsList.gameTypes',
        :selName.sync='model.GameType',
        @onChange='getListMixin',
        title='游戏类型',
        propKey='gameTypeName'
      )
  .bg-white.mgy2.pd2
    .ff-rn.jc-between.ai-center
      p 同类游戏列表
      .ff-rn.ai-center
        el-button.btn.btn-primary.el-icon-plus(
          v-if='userInfo.menu.gameChannel',
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
      el-table-column(prop='gameName', label='游戏名称', width='180')
        template(slot-scope='{ row }')
          .ff-rn.ai-center
            img.w50.h50.border-radius(:src='getLogoUrl(row)', alt='alt')
            span.mgl2 {{ row.gameName }}
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
      el-table-column(prop='joinPeople', label='上传时间', width='150')
        template(slot-scope='{ row }')
          span {{ row.uploadTime | dateFormat }}
      el-table-column(prop='joinPeople', label='更新时间', width='150')
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
              v-if='userInfo.menu.gameChannel',
              icon='el-icon-edit-outline',
              type='text',
              @click='showEditDlg(row)'
            ) 编辑
            el-button.mgl3.danger(
              v-if='userInfo.menu.gameChannel',
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
    :width='OS.isPc ? "600px" : "300px"'
  )
    .flex-center
      el-form(
        :label-width='OS.isPc ? "120px" : "0"',
        ref='form',
        :model='gameInfo',
        :rules='rules'
      )
        el-form-item(:label='OS.isPc ? "游戏名称:" : ""', prop='gameName')
          el-input.winput(
            v-model='gameInfo.gameName',
            placeholder='请输入游戏名称',
            clearable
          )
        el-form-item(:label='OS.isPc ? "设备类型:" : ""', prop='equipmentType')
          el-radio-group.winput(v-model='gameInfo.equipmentType')
            el-radio(:label='1') 安卓
            el-radio(:label='2') 苹果
        el-form-item(:label='OS.isPc ? "运营商:" : ""', prop='operator')
          el-select.winput(
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
        el-form-item(:label='OS.isPc ? "游戏类型:" : ""', prop='gameType')
          el-select.winput(
            v-model='gameInfo.gameType',
            placeholder='请选择游戏类型',
            clearable,
            filterable
          )
            el-option(
              v-for='item in paramsList.gameTypes',
              :key='item.id',
              :label='item.gameTypeName',
              :value='item.gameTypeName'
            )
        el-form-item(:label='OS.isPc ? "游戏描述:" : ""', prop='remark')
          el-input.winput(
            v-model='gameInfo.remark',
            type='textarea',
            placeholder='请输入游戏描述',
            :rows='2',
            clearable
          )
        el-form-item(:label='OS.isPc ? "apk:" : ""')
          el-input.winput(
            placeholder='上传apk',
            v-model='gameInfo.downloadUrl',
            clearable
          )
            template(slot='append')
              el-upload(
                displayType='button',
                :isPicture='false',
                :onChange='onApkChanged'
              )
                el-button
                  i.el-icon-folder-opened
        el-form-item(:label='OS.isPc ? "游戏图标:" : ""', prop='gamePicUrl')
          el-upload(
            action='true',
            accept='.jpg,.jpeg,.png,.bmp,.gif',
            :crop='true',
            :avatar.sync='previewLogo',
            @avatarUrl='onLogoUploaded'
          )
        .border-bottom
        p.mgy2 自定义信息
        el-form-item(:label='OS.isPc ? "帮聊等级:" : ""', prop='juntoChatLevel')
          el-input.winput(
            v-model='gameInfo.juntoChatLevel',
            placeholder='请输入帮聊等级',
            clearable
          )
        el-form-item(:label='OS.isPc ? "私聊等级:" : ""', prop='privateChatLevel')
          el-input.winput(
            v-model='gameInfo.privateChatLevel',
            placeholder='请输入私聊等级',
            clearable
          )
        el-form-item(:label='OS.isPc ? "世界聊等级:" : ""', prop='worldChatLevel')
          el-input.winput(
            v-model='gameInfo.worldChatLevel',
            placeholder='请输入世界聊等级',
            clearable
          )
        el-form-item(:label='OS.isPc ? "建帮等级:" : ""', prop='ceateJuntoLevel')
          el-input.winput(
            v-model='gameInfo.ceateJuntoLevel',
            placeholder='请输入建帮等级',
            clearable
          )
        el-form-item(:label='OS.isPc ? "建帮金额(元):" : ""', prop='ceateJuntoCost')
          el-input.winput(
            v-model='gameInfo.ceateJuntoCost',
            placeholder='请输入建帮金额(元)',
            clearable
          )
        el-form-item(:label='OS.isPc ? "是否可邀帮:" : ""', prop='isInviteJunto')
          el-checkbox(v-model='gameInfo.isInviteJunto') 是否可邀帮
        el-form-item(
          :label='OS.isPc ? "是否可职位邀帮:" : ""',
          prop='isPostInviteJunto'
        )
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
        apkName: '',
      },
      rules: {
        gameName: [EUIRule('required', '游戏名称')],
        operator: [EUIRule('required', '运营商')],
        gameType: [EUIRule('required', '游戏类型')],
        gamePicUrl: [EUIRule('required', '游戏图标')],
        downloadUrl: [EUIRule('required', '下载地址')],
      },
    }
  },
  computed: {
    ...mapGetters(['OS', 'userInfo']),
  },
  created () {
    this.init()
    this.gameInfoBak = JSON.parse(JSON.stringify(this.gameInfo))
  },
  methods: {
    init () {
      this.$api.getOperators().then(data => {
        data.map((item) => {
          item.isCheck = false
        })
        this.paramsList.operators = data
      })

      this.$api.getGameType().then(data => {
        data.map((item) => {
          item.isCheck = false
        })
        this.paramsList.gameTypes = data
      })
    },
    getLogoUrl (row) {
      return $globalconfig.API + row.gamePicUrl
    },
    onApkChanged (file) {
      this.$api.uploadApi(file, '', { url: 'api/common/file/apk', key: 'file' }).then(data => {
        this.$vgo.tip('apk上传成功!', 'success')
        this.gameInfo.apkName = file.name
        console.log('gameInfo.apkName', this.gameInfo.apkName, file)
        this.gameInfo.downloadUrl = $globalconfig.API + data.fileName
      })
    },
    onLogoUploaded (fileUrl) {
      this.previewLogo = $globalconfig.API + fileUrl
      this.gameInfo.gamePicUrl = fileUrl
    },
    downLoad (row) {
      if (row.downloadUrl) {
        window.open(row.downloadUrl)
      } else {
        this.$vgo.tip('apk地址无效!', 'warning')
      }
    },
    showEditDlg (row) {
      if (row) {
        Object.assign(this.gameInfo, row)
        this.previewLogo = $globalconfig.API + row.gamePicUrl
        console.log(row)
      } else {
        this.gameInfo = JSON.parse(JSON.stringify(this.gameInfoBak))
        this.previewLogo = ''
        this.gameInfo.apkName = ''
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
