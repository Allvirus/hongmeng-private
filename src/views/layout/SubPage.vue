<template lang="pug">
.sub-layout.jc-between
  .sub-layout-left
    SubMenu
  .sub-layout-center.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view.sub-view
  .sub-layout-right.w250.bg-white
    my-games()
</template>

<script>
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
  methods: {
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
.sub-layout.jc-between
  .sub-layout-center
    padding 0 20px
  .sub-layout-right
    border 1px solid rgba(#ccc, 0.1)
</style>
