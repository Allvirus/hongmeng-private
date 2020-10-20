<template lang="pug">
  .layout.flex-1(v-if='userInfo.id && myDptList.ready')
    .ff-cn(v-if="OS.isPc")
      TopBar
      .layout-bottom.flex-1
        transition(name='fade-scale', mode='out-in')
          router-view
        .copyright.lh3.jc-center.mgt3(v-html='$WD.$globalconfig.COPYRIGHT')
    .full(v-else)
      PhoneLayout
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    TopBar: () => import('./TopBar.vue'),
    PhoneLayout: () => import('./PhoneLayout.vue'),
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
    this.$store.dispatch('getAreaList')
    this.$store.dispatch('getGameList')
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.layout
  background-color $page-bg
  .layout-bottom
    height 0
    padding 20px 30px
</style>
