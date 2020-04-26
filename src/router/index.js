import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login/login'
import layout from '@/view/layout'
import Main from '@/view/layout/sidebar/app-main'
Vue.use(Router);
export const fixedRouter = [
  {
    path: '/',
    component: layout,
    hidden: true,
    redirect: '/dashboard',
    meta: { title: '首页', icon: 'el-icon-s-home' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/view/admin/index'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  }
];

export const asyncRoutes = [
  /** ------------------物流管理 ------------------------ */
  {
    path: '/logistics',
    meta: { title: '流向流量业务系统', functionID: 106, icon: 'el-icon-s-data', type: '' },
    component: layout,
    children: [
      {
        path: 'client',
        name: 'client',
        component: () => import('@/view/account/company'),
        meta: { title: '单位账号管理', functionID: 10601, icon: '', type: '' },
      },
      // {
      //   path: 'business',
      //   name:'business',
      //   component: () => import('@/view/account/sales'),
      //   meta: { title: '营业部账号管理', functionID: 10602, icon: '', type: '' },
      // },
      // {
      //   path: 'staff/:id',
      //   // path: 'staff',
      //   name:'staff',
      //   component: () => import('@/view/account/staff'),
      //   meta: { title: '查看人员', functionID: 1060201, icon: '', type: '', activeMenu: '/logistics/business' },
      // },
      // {
      //   path: 'info',
      //   name:'info',
      //   component: () => import('@/view/task/list'),
      //   meta: { title: '任务查询', functionID: 10603, icon: '', type: '' },
      // },
      // {
      //   path: 'taskView',
      //   name:'taskView',
      //   component: () => import('@/view/task/view'),
      //   meta: { title: '任务详情', functionID: 1060301, icon: '', type: '', activeMenu: '/logistics/info' },
      // },
      // {
      //   path: 'systemSettings',
      //   name: 'systemSettings',
      //   component: () => import('@/view/data/data'),
      //   meta: { title: '数据结果', functionID: 10604, icon: '', type: '' },
      // },
      // {
      //   path: 'dataView',
      //   name:'dataView',
      //   component: () => import('@/view/data/view'),
      //   meta: { title: '查看', functionID: 1060401, icon: '', type: '', activeMenu: '/logistics/systemSettings' },
      // },

      {
        path:'business',
        name:'business',
        component: Main,
        meta: { title: '营业部账号管理', functionID: 10602, icon: '', type: '' },
        children:[
          {
            hidden: true,
            path:'/logistics/business',
            // name:'business',
            component: () => import('@/view/account/sales'),
            meta: {icon: '',title: '营业部账号管理',showName:'1', functionID: 10602, type: '' },
          },
          {
            path: 'staff/:id',
            name:'staff',
            component: () => import('@/view/account/staff'),
            meta: { title: '查看人员', functionID: 1060201, icon: '', type: '', activeMenu: '/logistics/business' },
          },
        ]
      },

      {
        path:'info',
        component: Main,
        meta: { title: '任务查询', functionID: 10603, icon: '', type: '' },
        children:[
          {
            hidden: true,
            path:'/logistics/info',
            name:'info',
            component: () => import('@/view/task/list'),
            meta: { title: '任务查询', functionID: 10603, icon: '', type: '',showName:'1' },
          },
          {
            hidden: true,
            path:'/logistics/contract',
            name:'contract',
            component: Main,
            meta: { title: '合同详情', functionID: 1060301, icon: '', type: '',},
            children:[
              {
                path:'/logistics/contract',
                // name:'contract',
                component: () => import('@/view/task/contract'),
                meta: { title: '合同详情', functionID: 1060301, icon: '', type: '',showName:'1' , activeMenu: '/logistics/info' },
              },
              {
                path: '/logistics/taskView',
                name:'taskView',
                component: () => import('@/view/task/view'),
                meta: { title: '任务详情', functionID: 106030101, icon: '', type: '', activeMenu: '/logistics/info' },
              },
            ]
          },]
      },

      // },
      {
        path:'systemSettings',
        // name:'systemSettings',
        component: Main,
        meta: { title: '数据结果', functionID: 10604, icon: '', type: '' },
        children:[
          {
            hidden: true,
            path:'/logistics/systemSettings',
            name:'systemSettings',
            component: () => import('@/view/data/data'),
            meta: { title: '数据结果', functionID: 10604, icon: '', type: '',showName:'1' },
          },
          {
            path: '/logistics/dataView',
            name:'dataView',
            component: () => import('@/view/data/view'),
            meta: { title: '查看', functionID: 1060401, icon: '', type: '', activeMenu: '/logistics/systemSettings' },
          },
        ]
      },
    ]
  },
  /** ------------------权限管理 ------------------------ */
  {
    path: '/auth',
    meta: { title: '权限管理', functionID: 102, icon: 'el-icon-s-grid', type: '' },
    component: layout,
    children: [
      {
        path: 'userSetting',
        name: 'userSetting',
        component: () => import('@/view/user/listUser'),
        meta: { title: '用户设置', functionID: 10201, icon: '', type: '' },
      },
      {
        path: 'roleSetting',
        name: 'roleSetting',
        component: () => import('@/view/user/listUserRole'),
        meta: { title: '角色设置', functionID: 10202, icon: '', type: '' },
      },
      {
        path: 'loginLog',
        component: () => import('@/view/log/login'),
        name: 'loginLog',
        meta: { title: '登录日志查询', functionID: 10203, icon: '', type: '' },
      },
      {
        path: 'operateLog',
        component: () => import('@/view/log/operation'),
        name: 'operationLog',
        meta: { title: '操作日志查询', functionID: 10204, icon: '', type: '' },
      }
    ]
  },
  {
    path: '*',
    redirect: '/dashboard'
  }
];

const createRouter = () => new Router({
  routes: fixedRouter
});

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router

