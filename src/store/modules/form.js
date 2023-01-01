import { getDicts } from "@/api/system/dict/data";

const form = {
  namespaced: true,
  state: {
    dict:{}
  },
  getters:{
    getDict:state => { //动态获取字典表中的数据
      return key => {
        return state.dict[key] || [];
      }
    },
  },
  mutations: {
    setDict: (state,{key, value}) => {
      state.dict = {...state.dict, [key]:value}
    }
  },
  actions: {
    // 动态渲染下拉框--数据动态返回&&做vuex缓存
    fetchDictByKey({getters,commit}, key){
      // 把接口返回的数据组装成需要的设计格式：即label、value的形式
      function buildDynamicData(options) {
        if (!options instanceof Array) {
          return [];
        }
        options.forEach(item => {
          item["label"] = item.dictLabel;
          item["value"] = item.dictCode;
        });
        return options;
      }
      // 如果缓存里面有字典，直接返回
      if(getters.getDict(key).length) return getters.getDict(key);
      return getDicts(key).then(res=>{
        const list = res.data || [];
        const value = buildDynamicData(list);
        commit('setDict',{key, value})
        return value;
      }).catch(e=>[])

    }
  }
}

export default form
