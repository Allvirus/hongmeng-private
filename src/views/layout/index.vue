<template lang="pug">
.layout.ff-cn.flex-1(v-if='userInfo.id')
  TopBar
  .layout-bottom.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view
    .copyright.lh3.jc-center.mgt3(
      v-html='$WD.$globalconfig.COPYRIGHT'
    )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    TopBar: () => import('./TopBar.vue'),
  },
  computed: {
    ...mapGetters(['userInfo']),
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
  .top-bar
    z-index 2
</style>
