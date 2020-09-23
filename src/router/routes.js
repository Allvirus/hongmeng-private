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
    meta: { title: '漫游用户后台' },
    redirect: { name: 'RoamProjectManage' },
    name: 'RoamUser',
    children: [
      {
        path: 'RoamProject',
        name: 'RoamProject',
        meta: { title: '漫游项目' },
        component: SubPage,
        children: [
          {
            path: 'Manage',
            name: 'RoamProjectManage',
            meta: { title: '项目管理', group: '我的项目', groupIcon: 'el-icon-menu' },
            component: () => import('@/views/pages/RoamProject/Manage'),
          },
          {
            path: 'Model',
            name: 'RoamProjectModel',
            meta: { title: '更新项目', group: '我的项目', groupIcon: 'el-icon-menu', hideMenu: true, activeName: 'RoamProjectManage' },
            component: () => import('@/views/pages/RoamProject/Model'),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: { name: 'RoamProject' },
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
