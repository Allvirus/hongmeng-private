<template lang="pug">
.layout.ff-cn.flex-1
  TopBar
  .layout-bottom.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view
    .copyright.lh3.flex-center(
      v-if='$route.matched.length < 3',
      v-html='$WD.$globalconfig.COPYRIGHT'
    )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    // SideBar: () => import('./SideBar.vue'),
    TopBar: () => import('./TopBar.vue'),
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created () {
    // this.$store.dispatch('getUserInfo')
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
