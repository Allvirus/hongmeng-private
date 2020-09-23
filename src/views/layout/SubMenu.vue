<template lang="pug">
.sub-menu.ff-cn.select-none
  .sub-menu
    div 头像
    div 菜单列表
      //- el-menu.el-menu-vertical.flex-auto(
    //-   :default-active='$route.name'
    //-   background-color='#171b1f'
    //-   text-color='#fff'
    //-   active-text-color='#fff')
    //-   el-submenu(v-for="(group, gidx) in getMenu" :index='String(gidx)' :key="gidx")
    //-     template(slot='title')
    //-       i(:class='group[0].meta.groupIcon')
    //-       span {{group[0].meta.group}}
    //-     router-link(tag="div" v-for="(item, idx) in group"
    //-       :to="{name: item.name}" :key="item.name"
    //-       :class='{ "router-link-active": $route.meta.activeName === item.name }')
    //-       el-menu-item(:index='item.name') {{item.meta.title}}

    //- //- .group(v-for="(group, gidx) in getMenu" :key="gidx")
    //- //-   .group-title.fs-b.pd2.ai-center.fc-w2 {{group[0].meta.group}}
    //- //-   .group-menu.ff-cn.pdb1
    //- //-     router-link.menu-item.pr.pdl4(
    //- //-       :to="{name: item.name}"
    //- //-       :class='{ "router-link-active": $route.meta.activeName === item.name }'
    //- //-       v-for="item in group"
    //- //-       :key="item.path")
    //- //-       //- i.mgr1(:class='item.meta.icon')
    //- //-       span {{item.meta.title}}
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
// actciveShow()
// content ''
// width 0
// height 100%
// position absolute
// left 0
// top 0
// border-left 3px solid $theme
$width = 180px

.sub-menu
  width $width
  overflow hidden
  background-color #fff
  // a
  // color #fff
  // .sub-menu-scroll
  // width $width + 20px
  // .el-menu-vertical
  // width $width
  // overflow hidden
  // border-right 0px solid #000
  // .el-submenu__icon-arrow
  // color #fff
  // .el-menu-item.is-active
  // background-color rgba(#fff, 0.2) !important
  // .group
  // width $width
  // .group-title
  // padding-left 15px
  // .menu-item
  // padding 10px 10px 10px 6px
  // margin 2px 0
  // cursor pointer
</style>
