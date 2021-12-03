<template lang="pug">
.sub-menu.ff-cn
  .userInfo.pr(v-if='OS.isPc')
    .avatar-bg.pa
      img.fit-contain(
        :src='userInfo.photo !== null ? userInfo.photo : require("@/assets/img/ic_def_avatar.png")'
      )
    .jc-center.mgt3.overflow-hidden
      img.avatar.mgt1(
        :src='userInfo.photo !== null ? userInfo.photo : require("@/assets/img/ic_def_avatar.png")'
      )
    .jc-center.mgt3
      span.mgx3.black.fs-b.omit {{ userInfo.realName }}
    .ff-rn.jc-center.mgb3.mgt1
      img.mgl1.fit-contain(:src='userInfo.level | formatBadge')
      span.black.mgl1.fs-m {{ userInfo.level | formatLevel }}
      img.mgl1.fit-contain(:src='require("@/assets/img/ic_job.png")')
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
    ...mapGetters(['userInfo', 'OS']),
    getMenu () {
      const secRoutes = routes[0].children.filter(item => item.name === this.$route.matched[1].name)[0]
      const userMenuList = this.userInfo.menuList
      const groupObj = {}
      secRoutes.children.map(item => {
        if (item.meta.hideMenu) return
        if ((item.name === 'HomeBizConfig' && !this.userInfo.menu.bizConfigAuthority) ||
            (item.name === 'HomeLevelManage' && !this.userInfo.menu.levelAuthority) ||
            (item.name === 'HomeSwitchBind' && !this.userInfo.menu.playSwitch) ||
            (item.name === 'HomeDepartment' && !this.userInfo.menu.departmentAuthority)) {
          return
        }
        for (let i = 0; i < userMenuList.length; i++) {
          if (item.meta.fnId === userMenuList[i]) {
            groupObj[item.meta.group] = groupObj[item.meta.group] || []
            groupObj[item.meta.group].push(item)
          }
        }
      })
      return Object.values(groupObj)
    },
  },
  created: function () {
    console.log('userInfo', this.userInfo)
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
    .avatar-bg img
      width $width
      height $width
      filter blur(30px)
    .avatar
      width $avatarSize
      height $avatarSize
      border-radius 50%
  img, span
    z-index 0
    object-fit contain
  .menu-list
    i
      font-size 20px
  .router-link-active
    color #0487FF
  .el-menu-item
    height 48px !important
</style>
