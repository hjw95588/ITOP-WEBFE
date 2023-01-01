import { login, logout, getInfo, getIamUrl } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userId:'',
    name: '',
    avatar: '',
    roles: [],
    depts: [],
    posts: [],
    fullDepts: '',
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_DEPTS: (state, depts) => {
      state.depts = depts
    },
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    SET_FULLDEPTS: (state, fullDepts) => {
      state.fullDepts = fullDepts
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          if (res.initPwd) {
            sessionStorage.setItem('token', res.token)
          } else {
            setToken(res.token)
            commit('SET_TOKEN', res.token)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/image/profile.png") : process.env.VUE_APP_BASE_API + '/profile/avatar' + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          if(res.depts && res.depts.length > 0) {
            commit('SET_DEPTS', res.depts)
          }
          if(res.posts && res.posts.length > 0) {
            commit('SET_POSTS', res.posts)
          }
          if(res.fullDepts && res.fullDepts != "") {
            commit('SET_FULLDEPTS', res.fullDepts)
          }
          commit('SET_NAME', user.userName)
          commit('SET_USERID', user.userId)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_DEPTS', [])
          commit('SET_POSTS', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 或去IAM地址
    GetIamUrl () {
      return new Promise((resolve, reject) => {
        getIamUrl().then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
