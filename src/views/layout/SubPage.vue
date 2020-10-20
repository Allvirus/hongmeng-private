<template lang="pug">
.sub-layout.jc-between
  .sub-layout-left(v-if="OS.isPc")
    SubMenu
  .sub-layout-center.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view.sub-view
  .sub-layout-right.w250.bg-white(v-if="OS.isPc")
    my-games()
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SubPage',
  components: {
    SubMenu: () => import('./SubMenu.vue'),
    MyGames: () => import('@/views/pages/Home/comps/MyGames'),
    MyContacts: () => import('@/views/pages/Home/comps/MyContacts'),
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['OS']),
  },
  methods: {
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.sub-layout.jc-between
  .sub-layout-center
    padding 0 10px
  .sub-layout-right
    border 1px solid rgba(#ccc, 0.1)
</style>
