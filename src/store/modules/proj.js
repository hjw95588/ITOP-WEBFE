const proj = {
  namespaced: true,
  state: {
    queryParams: {},
    essListParams: {},
  },
  mutations: {
    UPDATE_PROJ_QUERYPARAMS: (state, params) => {
      state.queryParams = params
    },
    UPDATE_ESS_QUERYPARAMS: (state, params) => {
      state.essListParams = params
    }
  }
}

export default proj
