import Vue from "vue";
import Cookies from "js-cookie";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import Element from "element-ui";
// import "./assets/styles/element-variables.scss";
import i18n from "./lang"; // internationalization
import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/kylin.scss"; // kylin css
import App from "./App";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";
import "./assets/icons"; // icon
import "./permission"; // permission control
import { getDicts, getDictsCatch } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  download,
  handleTree
} from "@/utils/king";
import Pagination from "@/components/Pagination";
// table 增强工具组件
import TableToolbar from "@/components/TableToolbar"
// 列表组件
import TableList from "@/components/TableList"
// 流程设计器相关组件
import { vuePlugin } from "@/flow/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);
import MyPD from "@/flow/package/index.js";
Vue.use(MyPD);
// bpmn绘图工具样式
import "bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式
// 引入表单设计器组件
import FormDesign from './components/elementFormDesign'
import {
  setFormOptions
} from './components/elementFormDesign'
FormDesign.setDesignConfig({
  uploadImg: {
    // headers:""//给上传控件添加请求头信息
    // data:""//给上传文件添加一些携带参数
    // name:""//上传文件名
    // action:"www.baidu.com" // 默认的上传路径
  }
})
Vue.use(FormDesign)
Vue.prototype.setFormOptions = setFormOptions
import dict from "@/utils/dict";
import business from "@/utils/business";
import '@/utils/mathematical.js';
import filters from "@/utils/filters";
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

import onlyNumber from '@/directive/el-input'; //添加此行=>自定义全局指令
Vue.use(onlyNumber); //添加此行=>使用该全局指令
Vue.prototype.getDicts = getDicts;
Vue.prototype.getDictsCatch = getDictsCatch;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.$dict = dict;
Vue.prototype.$business = business;
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};
Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};
Vue.component("Pagination", Pagination);
Vue.component('TableToolbar', TableToolbar)
Vue.component('TableList', TableList)
Vue.use(permission);
Vue.use(Element, {
  size: Cookies.get("size") || "medium"
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  i18n,
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线
  },
});
