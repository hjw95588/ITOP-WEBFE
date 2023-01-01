const dict = {
  namespaced: true,
  state: {
    dictTypeCatch: []
  },
  mutations: {
    UPDATE_DICT_DATA: (state , {vm, data}) => {
      vm.$set(state, data['dictname'], data['options'])
    },
    UPDATE_DICT_TYPE: (state, data) => {
      const typeItem = {
        type: data.typename,
        data: data.typedata
      }
      state.dictTypeCatch.push(typeItem)
    }
  },
  actions: {
    changeDictData ({ commit }, data) {
      commit('UPDATE_DICT_DATA', {vm: this._vm, data:data})
    },
    changeDictType({ commit }, data) {
      commit('UPDATE_DICT_TYPE', data)
    }
  }
}

export default dict