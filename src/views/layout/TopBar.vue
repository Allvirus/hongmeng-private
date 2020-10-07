<template lang="pug">
.top-bar
  .banner.jc-between.pr
    .user-info.ff-rn.ai-center.pdl2
      img.avatar.mg3(:src="userInfo.avtarUrl")
      .ff-cn.mgl2
        .ff-rn.ai-center.fs-b
          span {{userInfo.username}}
          img.mgl2.fit-contain.flex-center(:src="userInfo.level | formatBadge")
          span.mgl1 {{userInfo.level | formatLevel}}

        .ff-rn.ai-center.mgt2.fs-m
          img(:src="require('@/assets/img/ic_job.png')" fit="contain")
          span.mgl1 {{userInfo.job | formatJob}}
          span.mgl1 经验 {{userInfo.experiences}}
    .swiper.pa.omit
        scroll-notice(:data="noticeList" :rows="3")
    .logo.mgr3.ai-center
      img.mgr3(:src="require('@/assets/img/logo_zl.png')")
  .menu-list.jc-between.bg-white
    el-tabs(v-model="activeTab" @tab-click='(cmp) => $router.replace({ name: cmp.name })')
      el-tab-pane(label='首页', name='HomeMyAchievement')
      el-tab-pane(label='排行', name='Ranking')
    .notice.ai-center.omit.w400
      scroll-notice(:data="noticeList" :rows="1")
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopBar',
  data () {
    return {
      activeTab: 'HomeMyAchievement',
      noticeList: [],
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
    this.testNotice()
  },
  methods: {
    testNotice () {
      let count = 0
      while (count++ < 5) {
        const notice = {
          id: count,
          msg: '恭喜全力以赴战队黄子韬单笔消费' + count * 1000 + '元',
        }
        this.noticeList.push(notice)
      }
    },
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
  .swiper
    width 50%
    height 100%
    top 0%
    left 50%
    transform translateX(-30%)
  .menu-list
    height 50px
    padding 0 70px
    .el-tabs__item
      font-size 18px
</style>
