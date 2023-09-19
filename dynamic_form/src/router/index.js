import Vue from 'vue'
import Router from 'vue-router'
import { asyncRoutes } from './asyncRoutes.js'
import { cookieParse } from '@/utils/cookie.js'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error)
}
export const constantRoutes = Object.keys(asyncRoutes).map((key) => {
  const name = key.toLowerCase()
  return {
    path: `/${name}`,
    name: name,
    component: asyncRoutes[key],
    meta: {},
    children: [],
    hidden: true
  }
})
constantRoutes.unshift({
  path: '/',
  name: 'layout',
  redirect: constantRoutes[0].path,
  hidden: true
})
constantRoutes.push({ path: '*', redirect: `/404`, hidden: true })
const cookie = cookieParse(document.cookie)
const applicationName = cookie.APPLICATION_NAME || ''
const prefix = applicationName !== '' ? `/${applicationName}/index/oneMap` : '/'
const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: prefix,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
