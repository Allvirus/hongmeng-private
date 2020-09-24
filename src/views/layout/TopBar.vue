<template lang="pug">
.top-bar
  .banner.jc-between
    .user-info 头像 名称 等级
    .swiper 轮播图
    .logo logo
  .menu-list.jc-between
    el-tabs(@tab-click='(cmp) => $router.push({ name: cmp.name })')
      el-tab-pane(label='首页', name='HomeMyAchievement')
      el-tab-pane(label='排行', name='Ranking')
    .notice 公告
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopBar',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    exit () {
      this.$utils.setCookie($globalconfig.COOKIE_NAME, '', { exHours: -1, domain: $globalconfig.COOKIE_DOMAIN })
      $globalconfig.LOGIN()
    },
    handleClick (e) {
      console.log(e)
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
