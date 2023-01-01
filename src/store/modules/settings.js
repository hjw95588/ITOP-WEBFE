import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch, navbarMode, entryptApi, systemFace, isJumpLogin } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  supportPinyinSearch : supportPinyinSearch,
  navbarMode : navbarMode,
  searchIsShow: false, // 控制路由搜索框
  entryptApi: entryptApi, // 控制路由搜索框
  systemFace: systemFace,  // 系统主题
  isJumpLogin: isJumpLogin // 是否为跳转登录
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

