import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/login/login')
    },
    {
      path:'/index',
      name:'index',
      component:()=>import('../components/index/index'),
      children:[
        {
          path:'admins',
          name:'admins',
          component:()=>import('../components/admins/admins')
        },
        {
          path:'role',
          name:'role',
          component:()=>import('../components/admins/role')
        },
        {
          path:'permission',
          name:'permission',
          component:()=>import('../components/admins/permission')
        },
        {
          path:'customer',
          name:'customer',
          component:()=>import('../components/customer/customer')
        },
        {
          path:'industrys',
          name:'industrys',
          component:()=>import('../components/industry/industrys')
        },
        {
          path:'industry',
          name:'industry',
          component:()=>import('../components/industry/industry')
        },
        {
          path:'position',
          name:'position',
          component:()=>import('../components/industry/position')
        }
      ]
    }
  ]
})
