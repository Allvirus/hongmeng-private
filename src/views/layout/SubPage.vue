<template lang="pug">
.sub-layout.jc-between
  .sub-layout-left
    SubMenu
  .sub-layout-center.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view.sub-view
  .sub-layout-right
    .tab.jc-between.fs-b
      .tab-item.hand(
        :class='{ active: tag === "mygame" }',
        @click='switchTab("mygame")',
        key='mygame'
      ) 我的游戏
      .tab-item.hand(
        :class='{ active: tag === "contacts" }',
        @click='switchTab("contacts")',
        key='contacts'
      ) 通讯录
    .content.overflow-hidden
      my-games(v-show='tag === "mygame"')
      my-contacts(v-show='tag === "contacts"')
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
      tag: 'mygame',
    }
  },
  methods: {
    switchTab (tag) {
      this.tag = tag
    },
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
.sub-layout.jc-between
  .sub-layout-center
    padding 0 20px
  .sub-layout-right
    width 275px
    height 766px
    border 1px solid rgba(#ccc, 0.1)
    background-color #fff
    .tab-item
      width 50%
      height 50px
      text-align center
      line-height 50px
      background-color #F5F8FC
      &.active
        background-color #fff
</style>
