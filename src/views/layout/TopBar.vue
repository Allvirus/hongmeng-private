<template lang="pug">
.top-bar
  .banner.jc-between
    .user-info.ff-rn.ai-center.pdl2
      el-image.avatar.mg3(:src="userInfo.avtarUrl")
      .ff-cn.mgl2.strong
        .ff-rn.ai-center.fs-l
          span {{userInfo.username}}
          img.mgl2.fit-contain.flex-center(:src="userInfo.level | formatBadge")
          span.mgl1 {{userInfo.level | formatLevel}}

        .ff-rn.ai-center.mgt2.fs-b
          img(:src="require('@/assets/img/ic_job.png')" fit="contain")
          span.mgl1 {{userInfo.job | formatJob}}
          span.mgl1.info 经验 {{userInfo.experiences}}

    .swiper.fs-l.ai-center.strong
      img.mgl2.flex-center(:src="require('@/assets/img/ic_notice.png')" fit="contain")
      span 恭喜全力以赴站队黄子韬在03:08 22:18:15玩家单笔消费
      span.danger {{1000}}
      span 元
    .logo.mgr3.ai-center
      img.mgr3(:src="require('@/assets/img/logo_zl.png')")
  .menu-list.jc-between.bg-white
    el-tabs(v-model="activeTab" @tab-click='(cmp) => $router.push({ name: cmp.name })')
      el-tab-pane(label='首页', name='HomeMyAchievement')
      el-tab-pane(label='排行', name='Ranking')
    .notice.ai-center.strong
      img.mgl2.flex-center(:src="require('@/assets/img/ic_notice.png')" fit="contain")
      span 公告：关于业绩考核通知，需各部门严格执行。
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopBar',
  data () {
    return {
      activeTab: 'HomeMyAchievement',
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created: function () {
    if (this.$route.name.slice(0, 4) === 'Home') {
      this.activeTab = 'HomeMyAchievement'
    } else {
      this.activeTab = this.$route.name
    }
  },
  methods: {
    exit () {
      this.$utils.setCookie($globalconfig.COOKIE_NAME, '', { exHours: -1, domain: $globalconfig.COOKIE_DOMAIN })
      $globalconfig.LOGIN()
    },
    handleClick (e) {
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
    background-image url('../../assets/img/topbar-bg.jpg')
    .avatar
      width 60px
      height 60px
      border-radius 50%
  .menu-list
    height 50px
    padding 0 70px
    .el-tabs__item
      font-size 18px
</style>
