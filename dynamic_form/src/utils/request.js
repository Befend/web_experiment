import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import Vue from 'vue'

axios.defaults.withCredentials = true // 让ajax携带cookie

export const getBaseUrl = () => {
  return Vue.prototype.VUE_APP_EVALUATE_API
}

// create an axios instance
const service = axios.create({
  baseURL: '',
  timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['token'] = getToken()
    // }
    if (config.baseURL === '') {
      config.baseURL = getBaseUrl()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const disposition = response.headers && response.headers['content-disposition']
    const filename =
      disposition && disposition.indexOf('=') > -1 ? decodeURI(disposition.substring(disposition.indexOf('=') + 1)) : ''
    window.sessionStorage.setItem('blobFileName', filename)
    const res = response.data
    const config = response.config
    if (config.selfHandle) {
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if ((config.params && config.params.doNotConfirmSucess) || Array.isArray(res)) {
      // 不需要验证res.success
      return res
    }
    if (!res.success) {
      Message({
        message: res.message || '请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 40000: Token expired;
      // if (res.ackCode === 40000 || res.ackCode === 50012 || res.ackCode === 50008) {
      //   // to re-login
      //   MessageBox.confirm('您已被登出，请重新登录！', '确认登出', {
      //     confirmButtonText: '登出',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || '请联系管理员！'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
