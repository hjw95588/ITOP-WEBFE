import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import Layout from "@/layout";

NProgress.configure({ showSpinner: false })

const whiteList = ['/index', '/login', '/auth-redirect', '/bind', '/register', '/forgetPass', '/nouser']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          const roles = res.roles
          store.dispatch('GenerateRoutes', { roles }).then(accessRoutes => {
            accessRoutes.forEach((item, index, arr) => {
              if (!item.children && item.parentId === 0) {
                const childObj = {
                  path: item.path,
                  component: item.component,
                  name: item.name,
                  meta: item.meta
                }
                const routObj = {
                  component: Layout,
                  path: item.path,
                  parentId: item.parentId,
                  children: [childObj]
                }
                arr[index] = routObj
              }
            })
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('登陆状态过期')
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      if (to.path === '/index') {
        let url = document.location.href.toString();
        let strIndex = url.indexOf('?')
        // url中不存在serach值
        if (strIndex === -1) {
          store.dispatch('GetIamUrl').then(res => {
            if (res.code === 200) {
              window.open(res.data, '_self')
            }
          })
        } else {
          next({ path: '/App' })
        }
      } else {
        next()
      }
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
