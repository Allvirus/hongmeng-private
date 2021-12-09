import Layout from '@/views/layout/index.vue'
const SubPage = () => import('@/views/layout/SubPage')
/**
 * meta: {
 *  title: 侧菜单标题
 *  hideMenu: true, 隐藏在顶部栏/显示的菜单, true 隐藏
 *  fnId: 功能id, 权限
 *  group: 侧菜单分组, 分组名称相同则为一组
 *  activeName: activeName === $route.name 会高亮 用于列表进入详情页时 列表路由高亮
 * }
 */
export default [
  {
    path: '/',
    component: Layout,
    meta: { title: '员工管理后台' },
    redirect: { name: 'Home' },
    name: 'ZhuLangUser',
    children: [
      {
        path: 'Home',
        name: 'Home',
        meta: { title: '首页' },
        redirect: { name: 'HomeMyAchievement' },
        component: SubPage,
        children: [
          {
            path: 'MyAchievement',
            name: 'HomeMyAchievement',
            meta: {
              title: '我的业绩',
              fnId: 1,
              icsel: require('@/assets/img/ic_my_achiv_sel.png'),
              icdef: require('@/assets/img/ic_my_achiv_def.png'),
              onlyPcMode: false,
            },
            component: () => import('@/views/pages/Home/MyAchievement'),
          },
          {
            path: 'MyLevel',
            name: 'HomeMyLevel',
            meta: {
              title: '我的等级',
              fnId: 2,
              icsel: require('@/assets/img/ic_level_sel.png'),
              icdef: require('@/assets/img/ic_level_def.png'),
              onlyPcMode: false,
            },
            component: () => import('@/views/pages/Home/MyLevel'),
          },
          {
            path: 'RegisterDetail',
            name: 'HomeRegisterDetail',
            meta: {
              title: '注册明细',
              fnId: 3,
              icsel: require('@/assets/img/ic_reg_sel.png'),
              icdef: require('@/assets/img/ic_reg_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/RegisterDetail'),
          },
          {
            path: 'RolesDetail',
            name: 'HomeRolesDetail',
            meta: {
              title: '角色明细',
              fnId: 4,
              icsel: require('@/assets/img/ic_role_sel.png'),
              icdef: require('@/assets/img/ic_role_def.png'),
              onlyPcMode: false,
            },
            component: () => import('@/views/pages/Home/RolesDetail'),
          },
          {
            path: 'OrdersDetail',
            name: 'HomeOrdersDetail',
            meta: {
              title: '订单明细',
              fnId: 5,
              icsel: require('@/assets/img/ic_order_sel.png'),
              icdef: require('@/assets/img/ic_order_def.png'),
              onlyPcMode: false,
            },
            component: () => import('@/views/pages/Home/OrdersDetail'),
          },
          {
            path: 'ExpDetail',
            name: 'HomeExpDetail',
            meta: {
              title: '经验明细',
              fnId: 6,
              icsel: require('@/assets/img/ic_exp_sel.png'),
              icdef: require('@/assets/img/ic_exp_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/ExpDetail'),
          },
          {
            path: 'RechargePlayer',
            name: 'HomeRechargePlayer',
            meta: {
              title: '充值排行榜',
              fnId: 7,
              icsel: require('@/assets/img/ic_rech_sel.png'),
              icdef: require('@/assets/img/ic_rech_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/RechargePlayer'),
          },
          {
            path: 'Register',
            name: 'HomeRegister',
            meta: {
              title: '社交账号登记',
              fnId: 8,
              icsel: require('@/assets/img/ic_register_sel.png'),
              icdef: require('@/assets/img/ic_register_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/Register'),
          },
          // {
          //   path: 'BizConfig',
          //   name: 'HomeBizConfig',
          //   meta: {
          //     title: '业务配置',
          //     icsel: require('@/assets/img/ic_setting_sel.png'),
          //     icdef: require('@/assets/img/ic_setting_def.png'),
          //     onlyPcMode: true,
          //   },
          //   component: () => import('@/views/pages/Home/BizConfig'),
          // },
          {
            path: 'FixedPost',
            name: 'HomeFixedPost',
            meta: {
              title: '每日定岗',
              fnId: 9,
              icsel: require('@/assets/img/ic_setting_sel.png'),
              icdef: require('@/assets/img/ic_setting_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/FixedPost'),
          },
          {
            path: 'SwitchBind',
            name: 'HomeSwitchBind',
            meta: {
              title: '玩家换绑',
              fnId: 10,
              icsel: require('@/assets/img/ic_setting_sel.png'),
              icdef: require('@/assets/img/ic_setting_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/SwitchBind'),
          },
          {
            path: 'LevelManage',
            name: 'HomeLevelManage',
            meta: {
              title: '等级管理',
              fnId: 11,
              icsel: require('@/assets/img/ic_lev_manage_sel.png'),
              icdef: require('@/assets/img/ic_lev_manage_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/LevelManage'),
          },
          {
            path: 'Update',
            name: 'HomeUpdate',
            meta: {
              title: '升级记录',
              fnId: 12,
              icsel: require('@/assets/img/ic_update_sel.png'),
              icdef: require('@/assets/img/ic_update_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/Update'),
          },
          {
            path: 'AssociatedAccount',
            name: 'HomeAssociatedAccount',
            meta: {
              title: '账号关联',
              fnId: 13,
              icsel: require('@/assets/img/ic_associat_sel.png'),
              icdef: require('@/assets/img/ic_associat_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/AssociatedAccount'),
          },
          {
            path: 'Department',
            name: 'HomeDepartment',
            meta: {
              title: '部门人员管理',
              fnId: 14,
              icsel: require('@/assets/img/ic_depart_sel.png'),
              icdef: require('@/assets/img/ic_depart_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Department'),
          },
          {
            path: 'TotalKpi',
            name: 'HomeTotalKpi',
            meta: {
              title: '薪酬统计',
              fnId: 15,
              icsel: require('@/assets/img/ic_total_kpi_sel.png'),
              icdef: require('@/assets/img/ic_total_kpi_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/TotalKpi'),
          },
          {
            path: 'RoleList',
            name: 'HomeRoleList',
            meta: {
              title: '角色管理',
              fnId: 16,
              icsel: require('@/assets/img/ic_rolelist_sel.png'),
              icdef: require('@/assets/img/ic_rolelist_def.png'),
              onlyPcMode: true,
            },
            component: () => import('@/views/pages/Home/RoleList'),
          },
        ],
      },
      {
        path: 'Ranking',
        name: 'Ranking',
        meta: { title: '排行' },
        component: () => import('@/views/pages/Ranking/'),
      },
      // {
      //   path: 'MyTarget',
      //   name: 'MyTarget',
      //   meta: { title: '数据指标' },
      //   component: () => import('@/views/pages/MyTarget/'),
      // },
      {
        path: 'GameChannel',
        name: 'GameChannel',
        meta: { title: '游戏渠道' },
        component: () => import('@/views/pages/GameChannel/'),
      },
      {
        path: 'Department',
        name: 'Department',
        meta: { title: '部门管理' },
        component: () => import('@/views/pages/Department/'),
      },
    ],
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/pages/Auth/'),
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('@/views/pages/Auth/'),
  },
]
