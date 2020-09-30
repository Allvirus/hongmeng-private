<template lang="pug">
.sub-menu.ff-cn
  .userInfo.pr
    .avatar-bg.pa
      img.fit-contain.w200.h200(:src='userInfo.avtarUrl')
    .jc-center.mgt3.overflow-hidden
      el-image.avatar.mgt1(:src='userInfo.avtarUrl')
    .ff-rn.jc-center.mgt3.pd1
      span.black.fs-l.w100.omit 136129912sdfsd
      img.mgl1.fit-contain(:src="userInfo.level | formatBadge")
      span.black.mgl1.fs-m {{ userInfo.level | formatLevel }}
    .ff-rn.jc-center.mgb3.mgt1
      img.fit-contain(:src='require("@/assets/img/ic_job.png")')
      span.black.mgl1 {{ userInfo.job | formatJob }}

  .menu-list
    el-menu.el-menu-vertical.flex-auto(
      :default-active='$route.name',
      background-color='#fff',
      text-color='#222222',
      :router='true',
      active-text-color='#fff'
    )
      .item(v-for='(item, index) in getMenu[0]', :key='index')
        router-link(:to='{ name: item.name }')
          .el-menu-item.ff-rn.ai-center(
            :class='{ "router-link-active": $route.name === item.name }'
          )
            img.fit-contain.w20.h20(
              :src='$route.name === item.name ? item.meta.icsel : item.meta.icdef'
            )
            span.mgl2 {{ item.meta.title }}
</template>
<script>
import routes from '@/router/routes'
import { mapGetters } from 'vuex'
export default {
  name: 'SubMenu',
  data () {
    return {
      activeName: '',
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    getMenu () {
      const secRoutes = routes[0].children.filter(item => item.name === this.$route.matched[1].name)[0]
      const groupObj = {}
      secRoutes.children.map(item => {
        // if (this.handleGetGroup(item)) return
        if (item.meta.hideMenu) return
        groupObj[item.meta.group] = groupObj[item.meta.group] || []
        groupObj[item.meta.group].push(item)
      })
      return Object.values(groupObj)
    },
  },
  created: function () {
  },
  methods: {
    handleGetGroup (item) {
      // 子账号没有子账号模块
      if (item.name === 'SubuserManage') {
        return this.userInfo.primary_id // id > 0 为子账号
      }
    },
  },
}
</script>
<style lang="stylus">
$width = 180px
$avatarSize = 60px

.sub-menu
  width $width
  overflow hidden
  background-color #fff
  .userInfo
    width $width
    height $width
    .avatar-bg
      width $width
      height $width
      filter blur(30px)
    .avatar
      width $avatarSize
      height $avatarSize
      border-radius 50%
  img, span
    z-index 100
    object-fit contain
  .menu-list
    i
      font-size 20px
  .router-link-active
    color #0487FF
</style>
