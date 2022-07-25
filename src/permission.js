import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken, setAppMainFull } from '@/utils/auth'
import { getUrlParams } from '@/utils/ruoyi'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/onlyStatistics']

const getIndexPath = (arr) => {
  let path = '';
  arr.forEach((v, i) => {
    if (i === 0) {
      if (v.children && v.children.length) {
        v.children.forEach((v1, i1) => {
          if (i1 === 0) {
            path = v.path === '/' ? v.path + v1.path : v.path + '/' + v1.path
          }
        })
      } else {
        path = v.path;
      }
    }
  })
  return path;
}


router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getUrlParams('singleToken')) {
    // 单点登录
    let token = getUrlParams('singleToken')
    setToken(token)
    // 设置AppMain组件 全屏显示
    setAppMainFull(true)
    let query = { ...to.query }
    delete query.singleToken
    let queryStr = ''
    for (let key in query) {
      queryStr += `${key}=${query[key]}&`
    }
    if (queryStr) {
      queryStr = queryStr.substr( 0, queryStr.length - 1)
      location.href = `${location.origin}${location.pathname}?${queryStr}`
    } else {
      location.href = `${location.origin}${location.pathname}`
    }
  } else if (getUrlParams('token')) {
    // 腾云登录
    store.dispatch("LoginByToken", { loginType: 1, token: getUrlParams('token') }).then(() => {
      location.href = location.origin + location.pathname;
    })
  } else {
    if (getToken()) {
      to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
      /* has token*/
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) {
          // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetInfo').then(() => {
            store.dispatch('GenerateRoutes').then(accessRoutes => {
              let indexPage = {
                path: '',
                redirect: '',
              }
              if (accessRoutes && accessRoutes.length) {
                indexPage.redirect = getIndexPath(accessRoutes)
              }
              accessRoutes.unshift(indexPage)
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          })
          // .catch(err => {
          //   store.dispatch('LogOut').then(() => {
          //     Message.error(err)
          //     next({ path: '/' })
          //   })
          // })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        // next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        next(`/login`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
