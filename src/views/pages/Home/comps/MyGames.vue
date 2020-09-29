<template lang='pug'>
  .MyGames.pdx2.pdb2
    .item.ff-rn.mgt3.ai-center(v-for="(item,idx) in gameList" :key="idx")
      img.game-icon(:src="item.icon")
      .name.mgl2.ai-center.ff-cn
        p {{item.gameName}}
        .ff-rn.ai-center
          img.mgt1.mgr1(:src="require('@/assets/img/ic_user.png')" fit="contain")
          span.mtl1 {{item.name}}
      el-button.flex-center.mgl4(type="primary" round @click="copyLink") 复制链接
</template>
<script>
export default {
  name: '',
  data () {
    return {
      gameList: [],
    }
  },
  computed: {

  },
  created: function () {
    this.createTestData()
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
    copyLink () {
      this.copy('xinglong')
    },
    copy (data) {
      const url = data
      const oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$vgo.tip('复制链接成功', 'success')
      oInput.remove()
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
