import {
  createRouter,
  createWebHistory
} from 'vue-router';
import Login from '../views/Login.vue';

const routes = [{
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: '主页',
    icon: 'el-icon-s-home',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/about',
        name: '信息提醒',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: '/A',
        name: '版权信息',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/A.vue')
      },
      {
        path: '/about',
        name: '关于',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
      },
    ]
  },
  {
    path: '/',
    name: '人事系统',
    icon: 'el-icon-menu',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/HR',
        name: '人才储备',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/hr.vue')
      }, {
        path: '/HR',
        name: '人事管理',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/hr.vue')
      },
      {
        path: '/PR',
        name: '人力成本',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/pr.vue')
      },
      {
        path: '/time',
        name: '考勤管理',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/kq.vue')
      },
      {
        path: '/tr',
        name: '培训发展',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/tr.vue')
      },
      {
        path: '/kpi',
        name: '绩效考核',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/kpi.vue')
      },
      {
        path: '/info',
        name: '信息发布',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/info.vue')
      }
    ]
  }, {
    path: '/',
    name: '单据申请',
    icon: 'el-icon-s-tools',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/OT',
        name: '加班管理',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/account.vue')
      },
      {
        path: '/LEV',
        name: '假单管理',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/structure.vue')
      },
      {
        path: '/Diff',
        name: '积假管理',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/structure.vue')
      }, {
        path: '/Diff',
        name: '年假管理',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/structure.vue')
      }
    ]
  }, {
    path: '/',
    name: '系统设置',
    icon: 'el-icon-s-tools',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/account',
        name: '用户账号',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/account.vue')
      },
      {
        path: '/role',
        name: '角色设置',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/roleform.vue')
      },
      {
        path: '/policy',
        name: '账号策略',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/policyform.vue')
      },
      {
        path: '/STRU',
        name: '组织结构',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/structure.vue')
      },
      {
        path: '/REFS',
        name: '系统参数',

        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/references.vue')
      },
    ]
  }, {
    path: '/',
    name: '系统工具',
    icon: 'el-icon-s-data',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [{
        path: '/loglist',
        name: '日志',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../components/loglist.vue')
      },
      {
        path: '/account',
        name: '提醒设置',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/account.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    //  console.log(this.$store.getters.token)
    if (localStorage.getItem("token")) {
      next()
    } else {
      next("/");
    }
  }
})
export default router