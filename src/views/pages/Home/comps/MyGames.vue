<template lang='pug'>
.MyGames.ff-cn
  .h80
    .flex-1.jc-end
      el-button(
        icon='el-icon-plus',
        type='primary',
        @click='dlgVisiable = true'
      ) 添加
    .dtp-tree.mgt2
      tree-selector(
        ref='dtptree',
        :data='treeData',
        :defProps='myDptList.props',
        nodeKey='id',
        clearable,
        :deflabel='defLable',
        @change='onDepartChange'
      )
  .flex-1
    .item.ff-rn.mgb1.ai-center.h70(
      v-for='(item, idx) in (myGameList.list ? myGameList.list : myGameList)',
      :key='idx'
    )
      img.game-icon.mgl2(:src='conbineUrl(item)')
      .name.mgl2.ff-cn
        p.mgb1(:title='item.gameContent.name') {{ item.gameContent.name }}
        span(:title='item.userName') {{ item.userName }}
      .ff-cn.flex-1.ai-end.mgr2
        el-popover(placement='left', width='200', trigger='hover')
          template
            .ff-cn.ai-center.jc-center
              p {{ item.gameContent.name }}
              img.w150.h150.mgt1(:src='$utils.getQrcodeUrl(item.linkUrl)')
          el-button.flex-center.mgl4(
            slot='reference',
            type='primary',
            round,
            @click='copyLink(item)'
          ) 复制链接
        el-button.flex-center.mgl4.mgt1(
          type='danger',
          round,
          @click='delGame(item)'
        ) 删除
    span.jc-center.mgt2(v-if='myGameList.list && myGameList.list.length === 0') 暂无游戏

    //- 个人没有分页，个人模式下隐藏分页
  .flex-center.pagination.h30(
    v-if='!(!userInfo.isLeader && userInfo.job === 0 && model.departmentId === "")'
  )
    el-pagination(
      :total='myGameList.count',
      :page-size.sync='model.pageSize',
      :current-page.sync='model.page',
      @current-change='updateGameList',
      :base='true',
      :small='true'
    )

  el-dialog(
    title='添加游戏',
    @close='cancel',
    :visible.sync='dlgVisiable',
    width='600px'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='游戏名称:', required)
          el-select(
            v-model='gameInfo.gameContentId',
            filterable,
            placeholder='请选择'
          )
            el-option(
              v-for='item in gameCtxList',
              :key='item.id',
              :label='item.name',
              :value='item.id'
            )
        el-form-item(label='推广人员:', required)
          el-select(v-model='gameInfo.userId', filterable, placeholder='请选择')
            el-option(
              v-for='item in userList',
              :key='item.id',
              :label='item.realName',
              :value='item.id'
            )
        el-form-item(label='推广链接:', required)
          el-input(
            v-model='gameInfo.linkUrl',
            placeholder='请输入推广链接',
            clearable
          )
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancel') 取消
      el-button.mgl3(type='primary', @click='submmit') 提交
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  data () {
    return {
      myGameList: {},
      keyword: '',
      dlgVisiable: false,
      gameInfo: {
        gameContentId: '', // 游戏名称
        userId: '', // 推广人员ID
        linkUrl: '', // 推广链接
      },
      defProps: {
        children: 'departments',
        label: 'name',
        valKey: 'id',
      },
      userList: [],
      gameCtxList: [],
      model: {
        departmentId: '',
        page: 1,
        pageSize: 7,
      },
      treeData: [],
      dptNameList: [],
      defLable: '',
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'myDptList']),
  },
  created: function () {
    this.geAllDptList()
    this.getDepartTree()
    if (this.userInfo.isLeader) {
      this.$api.getAllUser().then(res => {
        this.userList = res
      })
      this.$api.getGameCtx().then(data => {
        this.gameCtxList = data
      })
    }
  },
  methods: {
    initDefDptIdAndLabel () {
      if (this.userInfo.job === 2) {
        // C岗
        this.model.departmentId = 1
      } else if (this.userInfo.job === 1) {
        // B岗
        this.model.departmentId = this.userInfo.departmentId
      } else if (this.userInfo.job === 0 && !this.userInfo.isLeader) {
        // A岗普通员工
        this.model.departmentId = ''
      } else {
        // 管理者
        this.model.departmentId = this.userInfo.resDepartmentId
      }
      if (this.model.departmentId !== '') {
        if (!this.dptNameList[this.model.departmentId]) {
          this.defLable = this.dptNameList[this.model.departmentId + 1].name
        } else {
          this.defLable = this.dptNameList[this.model.departmentId].name
        }
      } else {
        this.defLable = ''
      }
      this.updateGameList()
    },
    geAllDptList () {
      this.$api.getAllDeparts().then(data => {
        for (const item of data) {
          this.dptNameList[item.id] = item
        }
        this.initDefDptIdAndLabel()
      })
    },
    getDepartTree () {
      this.treeData.splice(0, this.treeData.length)
      const id = 1
      this.$api.getDepartById(id).then(res => {
        this.treeData.push(res)
      })
    },
    updateGameList () {
      if (this.model.departmentId !== '') {
        this.$api.getGameByDptId(this.model).then(data => {
          this.myGameList = data
        })
      } else {
        this.$api.getMyGames().then(data => {
          this.myGameList = data
        })
      }
    },
    copyLink (item) {
      this.$utils.copyText(item.linkUrl)
    },
    submmit () {
      // 必填参数校验
      if (!this.checkParams()) {
        return
      }
      this.$api.addGame(this.gameInfo).then(data => {
        this.cancel()
        this.$vgo.tip('添加成功!', 'success')
        this.updateGameList()
      })
    },
    checkParams () {
      for (const key in this.gameInfo) {
        if (key === 'bJobId' || key === 'cJobId') {
          const reg = /\D/
          if (reg.test(this.gameInfo.bJobId) || reg.test(this.gameInfo.cJobId)) {
            this.$vgo.tip('B/C岗ID只能包含数字', 'warning')
            return false
          }
        } else if (this.gameInfo[key] === '') {
          this.$vgo.tip('请完善表单信息', 'warning')
          return false
        }
      }
      return true
    },
    cancel () {
      this.dlgVisiable = false
      for (const key in this.gameInfo) {
        this.gameInfo[key] = ''
      }
    },
    delGame (item) {
      this.$vgo.open(() => {
        this.$api.delGameById(item.id).then(data => {
          this.$vgo.tip('删除成功！', 'success')
          this.updateGameList()
        })
      })
    },
    onDepartChange (dptInfo) {
      this.model.departmentId = dptInfo.id
      this.updateGameList()
    },
    conbineUrl (item) {
      return $globalconfig.API + item.gameContent.gameImg
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyGames
  height 650px
  .item
    .name
      width 65px
      p, span
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .game-icon
      width 50px
      height 50px
      border-radius 17px
    button
      width 60px
      height 24px
      padding 2px 6px !important
  .pagination
    height 50px
</style>
