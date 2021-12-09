<template lang='pug'>
.sub-menu
  .drawer(v-if='derection === "right"')
    i.fs-xl.el-icon-menu(@click='drawer = !drawer')
    el-drawer(:visible.sync='drawer')
      .menu
        el-menu.flex-auto(
          :default-active='$route.name',
          background-color='#fff',
          text-color='#222222',
          :router='true',
          active-text-color='#fff'
        )
          .item(
            v-for='(item, index) in getMenu[0]',
            :key='index',
            @click='drawer = false'
          )
            router-link(:to='{ name: item.name }')
              .el-menu-item.ff-rn.ai-center.jc-center(
                :class='{ "router-link-active": $route.name === item.name }'
              )
                img.fit-contain.w20.h20(
                  :src='$route.name === item.name ? item.meta.icsel : item.meta.icdef'
                )
                span.mgl2 {{ item.meta.title }}
  .tabbar.box-shadow(v-if='derection === "bottom"')
    el-menu.ff-rn(
      :default-active='$route.name',
      background-color='#fff',
      text-color='#222222',
      mode='horizontal',
      :router='true',
      active-text-color='#fff'
    )
      .item.flex-1(v-for='(item, index) in getMenu[0]', :key='index')
        router-link.full.flex-center(:to='{ name: item.name }')
          .ff-cn(:class='{ "router-link-active": $route.name === item.name }')
            p {{ item.meta.title }}
</template>
<script>
import routes from '@/router/routes'
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: {
    derection: {
      type: String,
      default: 'bottom', // bottom, right
    },
  },
  data () {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'OS']),
    getMenu () {
      const secRoutes = routes[0].children.filter(item => item.name === this.$route.matched[1].name)[0]
      const groupObj = {}
      if (secRoutes.children) {
        secRoutes.children.map(item => {
          if (item.meta.hideMenu || item.meta.onlyPcMode) return
          // if ((item.name === 'HomeBizConfig' && !this.userInfo.menu.bizConfigAuthority) ||
          //     (item.name === 'HomeLevelManage' && !this.userInfo.menu.levelAuthority) ||
          //     (item.name === 'HomeDepartment' && !this.userInfo.menu.departmentAuthority)) {
          //   return
          // }

          groupObj[item.meta.group] = groupObj[item.meta.group] || []
          groupObj[item.meta.group].push(item)
        })
      }
      return Object.values(groupObj)
    },
  },
  methods: {
  },
}
</script>
<style lang='stylus' scoped>
>>>header
  display none !important

.mobile-mode
  .sub-menu
    .menu
      i
        font-size 20px
    .router-link-active
      color #0487FF
  .el-menu-item
    padding 0px 10px !important

.mobile-mode
  .tabbar
    width 100%
    height 57px
    position fixed
    bottom 0px
    left 0px
    z-index 1000
    .el-menu
      background-color #fff !important
      .item
        height 57px
</style>
