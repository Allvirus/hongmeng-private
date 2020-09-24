<template lang="pug">
.sub-menu.ff-cn.select-none
  .userInfo
    el-image.avatar(:src="userInfo.avtarUrl")
  .menu-list
    el-menu.el-menu-vertical.flex-auto(
    :default-active='$route.name'
    background-color='#fff'
    text-color='#222222'
    :router="true"
    active-text-color='#fff')
      .item(v-for="(item,index) in getMenu[0]" :key="index")
        router-link(:to="{name:item.name}"
          :class='{ "router-link-active": $route.name === item.name }')
          .el-menu-item()
              i.ai-center(:class="item.meta.icon")
              span.mgl2 {{item.meta.title}}
</template>
<script>
import routes from '@/router/routes'
import { mapGetters } from 'vuex'
export default {
  name: 'SubMenu',
  data () {
    return {
      activeName: '',
      userInfo: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    getMenu () {
      const secRoutes = routes[0].children.filter(item => item.name === this.$route.matched[1].name)[0]
      const groupObj = {}
      secRoutes.children.map(item => {
        // if (this.handleGetGroup(item)) return
        if (item.meta.hideMenu) return
        groupObj[item.meta.group] = groupObj[item.meta.group] || []
        groupObj[item.meta.group].push(item)
      })
      console.log('getMenu', Object.values(groupObj))
      return Object.values(groupObj)
    },
  },
  created: function () {
    this.createTestData()
  },
  methods: {
    handleGetGroup (item) {
      // 子账号没有子账号模块
      if (item.name === 'SubuserManage') {
        return this.userInfo.primary_id // id > 0 为子账号
      }
    },
    createTestData () {
      this.userInfo = {
        avtarUrl: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=180920816,2890274133&fm=26&gp=0.jpg',
        username: '唐文斌',
        realName: null,
        phoneNumber: '15677097705',
        job: 0,
        level: 0,
        experiences: 599,
      }
    },
  },
}
</script>
<style lang="stylus">
$width = 180px
$avatarSize = 60
.sub-menu
  width $width
  height calc(100vh - 200px)
  overflow hidden
  background-color #fff
  .userInfo
    width $width
    height $width
    .avatar
      width $avatarSize
      height $avatarSize
  .menu-list
    i
      font-size 20px

  .router-link-active
    color #0487FF
</style>
