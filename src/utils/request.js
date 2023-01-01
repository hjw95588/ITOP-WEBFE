import axios from 'axios'
let CancelToken = axios.CancelToken
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { encryptData, decryptData } from '@/utils/security'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000,
})
service.cancelToken = CancelToken
// request拦截器
service.interceptors.request.use(
  config => {
    const currentUrl = config.url // 获取当前执行API
    const entryptApiArr = store.state.settings.entryptApi // 获取需加密的API数组
    const existenceState = entryptApiArr.includes(currentUrl) // 判断当前执行API是否存在于加密数组中
    if (existenceState) {
      // 获取传输数据
      const data = config.params || config.data
      if (data) {
        // 对数据进行加密
        const encryData = encryptData(data)
        config.headers['Encrypt-Key'] = encryData.encryptKey
        config.headers['Signature'] = encryData.sign
        if (config.data) {
          config.data = encryData.data
        }
        if (config.params) {
          config.params = encryData.data
        }
      }
    }
    if (currentUrl === '/updatePwdWhenInit') {
      config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
    }
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (currentUrl.indexOf('/common/uploads') !== -1) {
      config.timeout = 50000
    }
    if (currentUrl.indexOf('/VndAttendanceBaseData/syncAttendance') !== -1) {
      config.timeout = 0
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
  let decryData = {}
  if (!!res.headers['encrypt-key'] && !!res.headers['signature']) {
    const entryptData = {
      encryptKey: res.headers['encrypt-key'],
      data: res.data,
      sign: res.headers['signature']
    }
    decryData = decryptData(entryptData)
  } else {
    decryData = res.data
  }
  const code = decryData.code
    if (code === 401) {
      const isJumpState = store.state.settings.isJumpLogin
      if (isJumpState) {
        MessageBox.confirm(
          '登录状态过期，请重新登陆IAM！',
          '系统提示',
          {
            confirmButtonText: '确定'
          }
        ).then(() => {
          store.dispatch('GetIamUrl').then(res => {
            if (res.code === 200) {
              removeToken()
              window.open(res.data, '_self')
            }
          })
        })
      } else {
        MessageBox.confirm(
          '登录状态已过期，请您重新登录！',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
    } else if (code == 500) {
      console.log('我报了500')
      Notification.error({
        title: res.data.msg
      })
      return Promise.reject('error')
    } else {
      return decryData
    }
  },
  error => {
    console.log('请求超时err')
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
