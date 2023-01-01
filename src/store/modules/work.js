import Vue from 'vue'
const work = {
  namespaced: true,
  state: {
    workDetail: {},
    approvalVariables: {},
    bizFlowVariables: {},
    browseWorkDetail: {},
    routerPath: '', // 路由名称
    pageNumber: 0
  },

  mutations: {
    UPDATE_WORK_DETAIL: (state, params) => {
      state.workDetail = params.row
    },
    BROWSE_WORK_DETAIL: (state, params) => {
      state.browseWorkDetail = params.row
    },
    UPDATE_APPROVAL_VARIABLES: (state, params) => {
      state.approvalVariables = params
    },
    UPDATE_BIZ_FLOW_VARIABLES: (state, params) => {
      state.bizFlowVariables = params
    },
    UPDATE_JUMP_ROUTE_NAME: (state, params) => {
      state.routerPath = params
    },
    UPDATE_LIST_PAGENUMBER: (state, number) => {
      state.pageNumber = number
    }
  },

  actions: {
    updateApprovalVariables({ commit }) {
      commit('UPDATE_APPROVAL_VARIABLES')
    },
    updateBizFlowVariables({ commit }) {
      commit('UPDATE_BIZ_FLOW_VARIABLES')
    },
    updateListPagenumber({ commit }, num) {
      commit('UPDATE_LIST_PAGENUMBER', num)
    }
  }
}

export default work
