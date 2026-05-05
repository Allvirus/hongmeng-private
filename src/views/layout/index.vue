<template lang="pug">
.layout.ff-cn.flex-1(v-if='userInfo.id && myDptList.ready')
  TopBar
  .layout-bottom.flex-1.clearfix
    transition(name='fade-scale', mode='out-in')
      router-view
    .copyright.lh3.jc-center.mgt2.pdx2(v-html='$WD.$globalconfig.COPYRIGHT')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    TopBar: () => import('./TopBar.vue'),
  },
  computed: {
    ...mapGetters(['userInfo', 'myDptList', 'OS']),
  },
  watch: {
    userInfo (newValue, oldValue) {
      this.$store.dispatch('getMyDptList')
    },
  },
  created () {
    this.$store.dispatch('getUserInfo')
    this.$store.dispatch('getLevelNameMap')
    this.$store.dispatch('getAreaList')
    this.$store.dispatch('getGameList')
    this.$store.dispatch('checkOS')
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.pc-mode
  .layout
    background-color $page-bg
    .layout-bottom
      height 0
      padding 20px 30px

.mobile-mode
  .layout
    background-color $page-bg
    .layout-bottom
      height 0
      padding 20px 0px
      padding-bottom 60px
  .copyright
    text-align center
    width 100%
    color #999
    font-size 6px
</style>
