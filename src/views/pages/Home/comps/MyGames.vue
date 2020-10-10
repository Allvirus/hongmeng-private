<template lang='pug'>
.MyGames
  .jc-between.ai-center.h50
    p.fs-l.mgl4.flex-1 我的游戏
    .mgr3
      el-button(
        icon='el-icon-plus',
        type='primary',
        @click='dlgVisiable = true'
        v-if="userInfo.menu.myGameAuthority"
      ) 添加
  .dtp-tree.jc-center
    tree-selector(
      ref='treesel',
      :data='treeData',
      :defProps='defProps',
      nodeKey='id',
      clearable
      @change='onDepartChange'
    )
  .h600.overflow-auto.mgt2
    .item.ff-rn.mgb3.ai-center(v-for='(item, idx) in myGameList', :key='idx')
      img.game-icon.mgl2(:src='conbineUrl(item)')
      .name.mgl2.ff-cn
        p.mgb1 {{ item.gameContent.name }}
        span {{ item.userName }}
      .ff-cn.flex-1.ai-end.mgr2
        el-button.flex-center.mgl4(
          type='primary',
          round,
          @click='copyLink(item)'
        ) 复制链接
        el-button.flex-center.mgl4.mgt1(
          type='danger',
          round,
          v-if="userInfo.menu.myGameAuthority"
          @click='delGame(item)'
        ) 删除
    span.jc-center.mgt2(v-if="myGameList.length === 0") 暂无游戏
  el-dialog(
    title='添加游戏',
    @close='cancel',
    :visible.sync='dlgVisiable',
    width='30%'
  )
    .flex-center
      el-form(label-width='100px')
        el-form-item(label='游戏名称:', required)
          el-select(v-model="gameInfo.gameContentId"
            placeholder="请选择")
            el-option(v-for="item in gameCtxList"
            :key="item.id"
            :label="item.name"
            :value="item.id")
        el-form-item(label='推广人员:', required)
          el-select(v-model="gameInfo.userId"
            placeholder="请选择")
            el-option(v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id")
        el-form-item(label='推广链接:', required)
          el-input(v-model='gameInfo.linkUrl')
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
      myGameList: [],
      keyword: '',
      dlgVisiable: false,
      gameInfo: {
        gameContentId: '', // 游戏名称
        userId: '', // 推广人员ID
        linkUrl: '', // 推广链接
      },
      treeData: [],
      defProps: {
        children: 'departments',
        label: 'name',
        valKey: 'id',
      },
      userList: [],
      gameCtxList: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    this.getMyGames()
    this.getDepartTree()
    this.getAllUser()
    this.getGameCtxList()
  },
  methods: {
    getGameCtxList () {
      this.$api.getGameCtx().then(data => {
        this.gameCtxList = data
      })
    },
    getAllUser () {
      this.$api.getAllUser().then(res => {
        this.userList = res
      })
    },
    getDepartTree () {
      this.treeData.splice(0, this.treeData.length)
      const id = 1
      this.$api.getDepartById(id).then(res => {
        this.treeData.push(res)
      })
    },
    getMyGames () {
      this.$api.getMyGames().then(data => {
        this.myGameList = data
      })
    },
    copyLink (item) {
      this.$utils.copyText(item.linkUrl)
    },
    search () {

    },
    submmit () {
      // 必填参数校验
      if (!this.checkParams()) {
        return
      }
      this.$api.addGame(this.gameInfo).then(data => {
        this.cancel()
        this.$vgo.tip('添加成功!', 'success')
        this.getMyGames()
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
          this.getMyGames()
        })
      })
    },
    onDepartChange (dptId) {
      if (dptId === '') {
        this.getMyGames()
      } else {
        this.$api.getGameByDptId(dptId).then(data => {
          this.myGameList = data
        })
      }
    },
    conbineUrl (item) {
      return $globalconfig.API + item.gameContent.gameImg
    },
  },
}
</script>
<style lang='stylus' scoped>
.MyGames
  .item
    .game-icon
      width 50px
      height 50px
      border-radius 17px
    button
      width 60px
      height 20px
</style>
