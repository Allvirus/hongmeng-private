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
    meta: { title: '逐浪-用户后台' },
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
              icsel: require('@/assets/img/ic_my_achiv_sel.png'),
              icdef: require('@/assets/img/ic_my_achiv_def.png'),
            },
            component: () => import('@/views/pages/Home/MyAchievement'),
          },
          {
            path: 'MyLevel',
            name: 'HomeMyLevel',
            meta: {
              title: '我的等级',
              icsel: require('@/assets/img/ic_level_sel.png'),
              icdef: require('@/assets/img/ic_level_def.png'),
            },
            component: () => import('@/views/pages/Home/MyLevel'),
          },
          {
            path: 'RegisterDetail',
            name: 'HomeRegisterDetail',
            meta: {
              title: '注册明细',
              icsel: require('@/assets/img/ic_reg_sel.png'),
              icdef: require('@/assets/img/ic_reg_def.png'),
            },
            component: () => import('@/views/pages/Home/RegisterDetail'),
          },
          {
            path: 'RolesDetail',
            name: 'HomeRolesDetail',
            meta: {
              title: '角色明细',
              icsel: require('@/assets/img/ic_role_sel.png'),
              icdef: require('@/assets/img/ic_role_def.png'),
            },
            component: () => import('@/views/pages/Home/RolesDetail'),
          },
          {
            path: 'OrdersDetail',
            name: 'HomeOrdersDetail',
            meta: {
              title: '订单明细',
              icsel: require('@/assets/img/ic_order_sel.png'),
              icdef: require('@/assets/img/ic_order_def.png'),
            },
            component: () => import('@/views/pages/Home/OrdersDetail'),
          },
          {
            path: 'ExpDetail',
            name: 'HomeExpDetail',
            meta: {
              title: '经验值明细',
              icsel: require('@/assets/img/ic_exp_sel.png'),
              icdef: require('@/assets/img/ic_exp_def.png'),
            },
            component: () => import('@/views/pages/Home/ExpDetail'),
          },
          {
            path: 'RechargePlayer',
            name: 'HomeRechargePlayer',
            meta: {
              title: '充值玩家',
              icsel: require('@/assets/img/ic_rech_sel.png'),
              icdef: require('@/assets/img/ic_rech_def.png'),
            },
            component: () => import('@/views/pages/Home/RechargePlayer'),
          },
          {
            path: 'BizConfig',
            name: 'HomeBizConfig',
            meta: {
              title: '业务配置',
              icsel: require('@/assets/img/ic_setting_sel.png'),
              icdef: require('@/assets/img/ic_setting_def.png'),
            },
            component: () => import('@/views/pages/Home/BizConfig'),
          },
          {
            path: 'SwitchBind',
            name: 'HomeSwitchBind',
            meta: {
              title: '玩家换绑',
              icsel: require('@/assets/img/ic_setting_sel.png'),
              icdef: require('@/assets/img/ic_setting_def.png'),
            },
            component: () => import('@/views/pages/Home/SwitchBind'),
          },
          {
            path: 'LevelManage',
            name: 'HomeLevelManage',
            meta: {
              title: '等级管理',
              icsel: require('@/assets/img/ic_lev_manage_sel.png'),
              icdef: require('@/assets/img/ic_lev_manage_def.png'),
            },
            component: () => import('@/views/pages/Home/LevelManage'),
          },
          {
            path: 'Department',
            name: 'HomeDepartment',
            meta: {
              title: '部门人员管理',
              icsel: require('@/assets/img/ic_depart_sel.png'),
              icdef: require('@/assets/img/ic_depart_def.png'),
            },
            component: () => import('@/views/pages/Department'),
          },
        ],
      },
      {
        path: 'Ranking',
        name: 'Ranking',
        meta: { title: '排行' },
        component: () => import('@/views/pages/Ranking/'),
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
