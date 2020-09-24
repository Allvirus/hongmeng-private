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
            path: 'MyRegister',
            name: 'HomeMyRegister',
            meta: { title: '注册明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyRegister'),
          },
          {
            path: 'MyRoles',
            name: 'HomeMyRoles',
            meta: { title: '角色明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyRoles'),
          },
          {
            path: 'MyOrders',
            name: 'HomeMyOrders',
            meta: { title: '订单明细', icon: 'el-icon-data-analysis' },
            component: () => import('@/views/pages/Home/MyOrders'),
          },
        ],
      },
      {
        path: 'Ranking',
        name: 'Ranking',
        meta: { title: '排行' },
        component: () => import('@/views/pages/Ranking/'),
      },
    ],
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/pages/Auth/'),
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('../views/pages/Auth/'),
  },
]
