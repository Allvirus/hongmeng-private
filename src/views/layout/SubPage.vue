<template lang="pug">
.sub-layout.jc-between
  .sub-layout-left(v-if='OS.isPc')
    SubMenu
  .sub-layout-center.flex-1
    transition(name='fade-scale', mode='out-in')
      router-view.sub-view
  .sub-layout-right-wrap.pr(v-if='OS.isPc')
    .sub-layout-toggle.flex-center(@click='rightCollapsed = !rightCollapsed')
      i(:class='rightCollapsed ? "el-icon-arrow-left" : "el-icon-arrow-right"')
    transition(name='fade')
      .sub-layout-right.w250.h700.pr(v-show='!rightCollapsed')
        el-tabs(type='border-card', :stretch='true')
          el-tab-pane(label='推广游戏')
            my-games
          //- el-tab-pane(label='通讯录')
          //-   my-contacts
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
      rightCollapsed: true,
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
@import '~@/assets/style/var';

.sub-layout.jc-between {
  .sub-layout-center {
    padding: 0 10px;
    min-width: 0;
  }

  .sub-layout-right-wrap {
    position: relative;
    display: flex;
    align-items: flex-start;
  }

  .sub-layout-right {
    border: 1px solid rgba(#ccc, 0.1);
    background: #fff;
  }

  .sub-layout-toggle {
    width: 24px;
    height: 72px;
    margin-top: 12px;
    border: 1px solid rgba(#ccc, 0.3);
    border-right: 0;
    border-radius: 6px 0 0 6px;
    background: #fff;
    cursor: pointer;
    color: #666;
  }
}
</style>
