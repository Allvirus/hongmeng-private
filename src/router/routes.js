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
            meta: { title: '我的业绩', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyAchievement'),
          },
          {
            path: 'MyCurrency',
            name: 'HomeMyCurrency',
            meta: { title: '我的货币', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyCurrency'),
          },
          {
            path: 'MyLevel',
            name: 'HomeMyLevel',
            meta: { title: '我的等级', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyLevel'),
          },
          {
            path: 'RegisterDetail',
            name: 'HomeRegisterDetail',
            meta: { title: '注册明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/RegisterDetail'),
          },
          {
            path: 'RolesDetail',
            name: 'HomeRolesDetail',
            meta: { title: '角色明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/RolesDetail'),
          },
          {
            path: 'OrdersDetail',
            name: 'HomeOrdersDetail',
            meta: { title: '订单明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/OrdersDetail'),
          },
          {
            path: 'RechargePlayer',
            name: 'HomeRechargePlayer',
            meta: { title: '充值玩家', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/RechargePlayer'),
          },
          {
            path: 'BizConfig',
            name: 'HomeBizConfig',
            meta: { title: '业务配置', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/BizConfig'),
          },
          {
            path: 'Department',
            name: 'HomeDepartment',
            meta: { title: '部门人员管理', icon: 'el-icon-data-analysis' },
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
