import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import Login from '@/components/sign/Login'
import Register from '@/components/sign/Register'
import HomeHead from '@/components/home/HomeHead'
import UserLayout from '@/components/user/Layout'
import UserSettingHome from '@/components/user/Home'
import UserSettingAccount from '@/components/user/Account'
import NovelSetting from '@/components/user/NovelSetting'
import NovelShow from '@/components/user/NovelShow'
import AdminLayout from '@/components/admin/Layout'
import AdminSettingHome from '@/components/admin/Home'
import AdminSettingAccount from '@/components/admin/Account'
import UsersSetting from '@/components/admin/UsersSetting'
import AdminNovelSetting from '@/components/admin/NovelSetting'

Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      component: HomeHead,
      children: [
        { path: '', component: Home }
      ],
      meta: {
        auth: false
      }
    },
    { path: '/view/sign/Login', component: Login, meta: { auth: false } },
    { path: '/view/sign/Register', component: Register, meta: { auth: false } },
    {
      path: '/view/user',
      component: UserLayout,
      children: [
        { path: '', redirect: 'home' },
        { path: 'home', component: UserSettingHome, meta: { auth: true } },
        { path: 'account', component: UserSettingAccount, meta: { auth: true } },
        { path: 'novelSetting', component: NovelSetting, meta: { auth: true } },
      ],
      meta: { auth: true }
    },
    { path: '/view/user/novel/*', component: NovelShow },
    {
      path: '/view/admin',
      component: AdminLayout,
      children: [
        { path: '', redirect: 'home' },
        { path: 'home', component: AdminSettingHome, meta: { auth: true } },
        { path: 'account', component: AdminSettingAccount, meta: { auth: true } },
        { path: 'usersSetting', component: UsersSetting, meta: { auth: true } },
        { path: 'novelSetting/*', component: AdminNovelSetting, meta: { auth: true } }
      ],
      meta: { auth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auth) && to.meta.auth) { //判断路由是否需要登录权限
    let token = localStorage.getItem('token')
    if (!token) {
      Vue.prototype.$message.error("未登录，请登录！")
      next({
        path: '/view/sign/Login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
  next()
})


export default router