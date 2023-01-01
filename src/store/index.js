import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import app from "./modules/app";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import form from "./modules/form";
import work from "./modules/work";
import message from "./modules/message";
import proj from "./modules/proj";
import getters from "./getters";
import dict from "./modules/dict";

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          work: val.work,  // 只存储部分数据
          dictTypeCatch: val.dict.dictTypeCatch
        };
      }
    })
  ],
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    form,
    work,
    message,
    proj,
    dict
  },
  getters
});

export default store;
