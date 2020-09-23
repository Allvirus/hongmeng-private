<template lang="pug">
.sub-layout.jc-between
  .sub-layout-left
    SubMenu
  .sub-layout-center.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view.sub-view
  .sub-layout-right
    .tab.jc-between
      .tab-item.active 我的游戏
      .tab-item 通讯录
</template>

<script>
export default {
  name: 'SubPage',
  components: {
    SubMenu: () => import('./SubMenu.vue'),
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

.sub-layout.jc-between
  // .sub-layout-left
  .sub-layout-center
    padding 0 20px
  .sub-layout-right
    width 275px
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
