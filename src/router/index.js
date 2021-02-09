import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views

const TestSeries = () => import('@/views/testSeries/TestSeries')
const AddTestSeries = () => import('@/views/testSeries/AddTestSeries')
const TestList = () => import('@/views/test/TestList')
const PublicUrl = () => import('@/views/misc/PublicUrl')
const AddCurrentAffairs = () => import('@/views/misc/AddCurrentAffairs')
const CurrentAffairList = () => import('@/views/currentAffair/CurrentAffairList')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

/*

*/
Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/pages/login',
      name: '',
      component: TheContainer,
      children: [
        {
          path: 'testSeries',
          name: 'Test Series',
          component: TestSeries
        },
        {
          path: 'add/testSeries',
          name: 'Add Test Series',
          component: AddTestSeries
        },
        {
          path: 'testList/:testSeriesId',
          name: 'Test List',
          component: TestList
        },
        {
          path: 'misc/publicFiles',
          name: 'Public Url',
          component: PublicUrl
        },
        {
          path: 'misc/addCurrentAffairs',
          name: 'Add Current Affairs',
          component: AddCurrentAffairs
        },
        {
          path: '/curentAffairList',
          name: 'curentAffairList',
          component: CurrentAffairList
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
       
        
      ]
    }
  ]
}

