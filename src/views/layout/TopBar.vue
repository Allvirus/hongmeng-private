<template lang="pug">
.top-bar
  .banner.jc-between
    .user-info 头像 名称 等级
    .swiper 轮播图
    .logo logo
  .menu-list.jc-between
    el-tabs(@tab-click='handleClick')
      el-tab-pane(label='首页', name='0')
      el-tab-pane(label='排行', name='1')
    .notice 公告
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopBar',
  data () {
    return {
      drawer: false,
      userMeun: [
        // { name: '会员中心', route: 'Overview', icon: 'el-icon-user' },
        // { name: '作品管理', route: 'PanoManage', icon: 'el-icon-folder-opened' },
        // { name: '实名认证', route: 'Certification', icon: 'el-icon-message' }
      ],
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created () {
    // this.$store.dispatch('getUnreadMsgCount')
  },
  methods: {
    exit () {
      this.$utils.setCookie($globalconfig.COOKIE_NAME, '', { exHours: -1, domain: $globalconfig.COOKIE_DOMAIN })
      $globalconfig.LOGIN()
    },
    handleClick () {

    },
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
$H = 120px

.top-bar
  .banner
    height $H
    background-color #c90
  .menu-list
    height 50px
    padding 0 70px
    background-color #fff
</style>
