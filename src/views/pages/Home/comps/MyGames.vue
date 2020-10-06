<template lang='pug'>
.MyGames.pd2
  .jc-end
    el-button.mgb2(
      icon='el-icon-plus',
      type='primary',
      @click='dlgVisiable = true'
    ) 添加游戏
  //- .search.ff-rn.mgb2.mgt2
    //- el-input(suffix-icon="el-icon-search" placeholder="请输入内容" v-model="keyword")
    //- el-button.mgl1.flex-center(type="primary" @click="search") 搜索
  .h600.overflow-auto
    .item.ff-rn.mgb3.ai-center(v-for='(item, idx) in gameList', :key='idx')
      img.game-icon(:src='item.linkUrl')
      .name.mgl2.ai-center.ff-cn
        p {{ item.gameName }}
        .ff-rn.ai-center
          //- img.mgt1.mgr1(:src="require('@/assets/img/ic_user.png')" fit="contain")
          span.mtl1 {{ item.areaName }}
      .ff-cn.flex-1.ai-end.mgr2
        el-button.flex-center.mgl4(
          type='primary',
          round,
          @click='copyLink(item)'
        ) 复制链接
        el-button.flex-center.mgl4.mgt1(
          type='danger',
          round,
          @click='delGame(item)'
        ) 删除
  el-dialog(
    title='添加游戏\'',
    @close='cancel',
    :visible.sync='dlgVisiable',
    width='45%'
  )
    .flex-center
      el-form(label-width='150px')
        el-form-item(label='游戏名称:', required)
          el-input(v-model='gameInfo.gameName')
        el-form-item(label='区服名称:', required)
          el-input(v-model='gameInfo.areaName')
        el-form-item(label='区服代码:', required)
          el-input(v-model='gameInfo.areaCode')
        el-form-item(label='B岗ID:', required)
          el-input(v-model='gameInfo.bJobId')
        el-form-item(label='C岗ID:', required)
          el-input(v-model='gameInfo.cJobId')
        el-form-item(label='推广链接:', required)
          el-input(v-model='gameInfo.linkUrl')
    span.dialog-footer(slot='footer')
      el-button.mgl3(type='warning', @click='cancel') 取消
      el-button.mgl3(type='primary', @click='submmit') 提交
</template>
<script>
export default {
  name: '',
  data () {
    return {
      gameList: [],
      keyword: '',
      dlgVisiable: false,
      gameInfo: {
        gameName: '', // 游戏名称
        areaName: '', // 区服名称
        areaCode: '', // 区服代码
        linkUrl: '', // 推广链接
        bJobId: '', // B岗ID
        cJobId: '', // C岗ID
      },
    }
  },
  computed: {

  },
  created: function () {
    // this.createTestData()
    this.getGames()
  },
  methods: {
    createTestData () {
      let count = 20
      while (count-- > 0) {
        const item = {
          name: '何元生',
          gameName: '龙骑传说',
          url: 'www.baidu.com',
          icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601013394289&di=2617de609a98a57aa9565b97769b66f4&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F019da535b4d6dd883943935329cef2c6c4c8c8c2d648-s6hdda_fw658',
        }
        this.gameList.push(item)
      }
    },
    getGames () {
      this.$api.getGames().then(data => {
        console.log('getGame', data)
        this.gameList = data
      })
    },
    copyLink (item) {
      this.$utils.copyText(item.linkUrl)
    },
    search () {

    },
    submmit () {
      // 必填参数校验

      this.$api.addGame(this.gameInfo).then(data => {
        this.cancel()
        this.$vgo.tip('添加成功!', 'success')
        this.getGames()
      })
    },
    cancel () {
      this.dlgVisiable = false
      for (const key in this.gameInfo) {
        this.gameInfo[key] = ''
      }
    },
    delGame (item) {
      console.log('delGame', item.id)
      this.$vgo.open(() => {
        this.$api.delGameById(item.id).then(data => {
          this.$vgo.tip('删除成功！', 'success')
          this.getGames()
        })
      })
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
