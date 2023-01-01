import { getTotal } from '@/api/system/notice'
import { getTaskList } from '@/api/work'
const state = {
  noticeUnreadCont: 0, // 通知未读数量
  annountCont: 0, // 公告未读数量
  dealWithCont: 0 // 待办未读数量
}
const mutations = {
  GET_UNREADCONT: (state, total) => {
    state.noticeUnreadCont = total
  },
  GET_ANOUNTCONT: (state, total) => {
    state.annountCont = total
  },
  GET_DEALCONT: (state, total) => {
    state.dealWithCont = total
  }
}
const actions = {
  // 获取通知未读
  GetUnreadCont ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getTotal({ noticeType: '1' }).then(res => {
        if (res.code === 200) {
          commit('GET_UNREADCONT', res.data)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取待办
  GetToDoCont({ commit, state, rootState }) {
    return new Promise((resolve, reject) => {
      let userId = rootState.user.userId
      let params = {
        userId,
        status: '0',
        pageSize: 0,
        pageNum: 1
      }
      getTaskList(params).then(res => {
        if (res.code === 200) {
          commit('GET_DEALCONT', res.total)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取公告未读
  GetAnnounCont ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getTotal({ noticeType: '2' }).then(res => {
        if (res.code === 200) {
          commit('GET_ANOUNTCONT', res.data)
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  state,
  mutations,
  actions
}