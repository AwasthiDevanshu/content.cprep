import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views

const Company = () => import('@/views/company/Company')
const AddCompany = () => import('@/views/company/AddEditCompany')
const CandidateList = () => import('@/views/company/CandidateList')
const Notification = () => import('@/views/company/Notification')
const CompanyTestSeries = () => import('@/views/company/CompanyTestSeries')
const CompanyFeatures = () => import('@/views/company/CompanyFeatures')
const CourseList = () => import('@/views/course/CourseList')
const CourseVideoList = () => import('@/views/course/CourseVideoList')
const AddCourse = () => import('@/views/course/AddCourse')

const TestSeries = () => import('@/views/testSeries/TestSeries')
const AddTestSeries = () => import('@/views/testSeries/AddTestSeries')
const TestList = () => import('@/views/test/TestList')
const ScoreSheet = () => import('@/views/test/ScoreSheet')
const PublicUrl = () => import('@/views/misc/PublicUrl')
const AddCurrentAffairs = () => import('@/views/misc/AddCurrentAffairs')
const CurrentAffairList = () => import('@/views/currentAffair/CurrentAffairList')
const CompanyBanners = () => import('@/views/misc/CompanyBanners')
const CandidatePurchases = () => import('@/views/candidate/CandidatePurchases')
const CreateCandidates = () => import('@/views/candidate/CreateCandidates')
const CourseTransactionList = () => import('@/views/transaction/CourseTransaction')
const TestSeriesTransactionList = () => import('@/views/transaction/TestSeriesTransaction');
const TransactionExcel = () => import('@/views/transaction/TransactionExcel');

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
          path: 'Company',
          name: 'Company list',
          component: Company
        },
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
          path: '/company/testSeries',
          name: 'Company TestSeries',
          component: CompanyTestSeries
        },
        {
          path: '/company/addCompany',
          name: 'Add company',
          component: AddCompany
        },
        {
          path: '/company/companyFeatures',
          name: 'Company Features',
          component: CompanyFeatures
        },
        {
          path: '/company/CandidateList',
          name: 'Candidate List',
          component: CandidateList
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
          path: 'misc/companyBanners',
          name: 'Banners',
          component: CompanyBanners
        },
        {
          path: 'courseList',
          name: 'Course List',
          component: CourseList
        },
        {
          path: 'courseVideos/:courseId',
          name: 'Course Video List',
          component: CourseVideoList
          
        },
        {
          path: 'addCourse',
          name: 'Add Course',
          component: AddCourse
        },
        {
          path: 'editCourse/:courseId',
          name: 'Edit Course',
          component: AddCourse
        },
        {
          path: 'transactions/course',
          name: 'Course Transaction List',
          component: CourseTransactionList
        },
        {
          path: 'transactions/testSeries',
          name: 'Test Series Transaction List',
          component: TestSeriesTransactionList
        },
        {
          path: 'transactions/excelDownload',
          name: 'Transaction Excel',
          component: TransactionExcel
        },{
          path: 'candidatePurchases/:candidateId/:companyId',
          name: 'Candidate Purchases',
          component: CandidatePurchases
        },{
          path: 'CreateCandidates',
          name: 'Create Candidates',
          component: CreateCandidates
        },
        {
          path: '/curentAffairList',
          name: 'curentAffairList',
          component: CurrentAffairList
        },
        {
          path: '/notification',
          name: 'notification',
          component: Notification
        },
        {
          path: '/scoreSheet',
          name: 'scoreSheet',
          component: ScoreSheet
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

