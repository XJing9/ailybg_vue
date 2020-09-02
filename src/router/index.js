import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* 解决刷新报错 */
/* const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
} */
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/login/login')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/index/index'),
      children: [
        {
          path: 'admins',
          name: 'admins',
          component: () => import('../components/admins/admins')
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('../components/admins/role')
        },
        {
          path: 'permission',
          name: 'permission',
          component: () => import('../components/admins/permission')
        },
        {
          path: 'customer',
          name: 'customer',
          component: () => import('../components/customer/customer')
        },
        {
          path: 'industrys',
          name: 'industrys',
          component: () => import('../components/industry/industrys')
        },
        {
          path: 'industry',
          name: 'industry',
          component: () => import('../components/industry/industry')
        },
        {
          path: 'position',
          name: 'position',
          component: () => import('../components/industry/position')
        },
        {
          path: 'entre',
          name: 'entre',
          component: () => import('../components/entre/entrepreneur')
        },
        {
          path: 'welfare',
          name: 'welfare',
          component: () => import('../components/entre/welfare')
        },
        {
          path: 'issue_position',
          name: 'issue_position',
          component: () => import('../components/entre/issue_position')
        },
        {
          path: 'interview',
          name: 'interview',
          component: () => import('../components/entre/interview')
        },
        {
          path: 'speciality',
          name: 'speciality',
          component: () => import('../components/entre/speciality')
        },
        {
          path: 'area',
          name: 'area',
          component: () => import('../components/sys/area')
        },
        {
          path: 'complaint',
          name: 'complaint',
          component: () => import('../components/complaint/complaint')
        },
        {
          path: 'resume',
          name: 'resume',
          component: () => import('../components/resumes/resume')
        },
        {
          path: 'photo',
          name: 'photo',
          component: () => import('../components/photos/photo')
        }
      ]
    }
  ]
})
