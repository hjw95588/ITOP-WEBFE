(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-176d6c4e"],{"2bca":function(e,t,a){},"3d06":function(e,t,a){"use strict";a("2bca")},"93d1":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"main ebank-form"},[a("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":e.tabClickHander},model:{value:e.tabsValue,callback:function(t){e.tabsValue=t},expression:"tabsValue"}},e._l(e.tabList,(function(e,t){return a("el-tab-pane",{key:t,attrs:{label:e.title,name:e.name}})})),1),e._v(" "),a("div",{staticClass:"content of-auto",style:{height:e.tabContainerHeight}},[e.tabsShow[0]?a("div",{directives:[{name:"show",rawName:"v-show",value:"1"===e.tabsValue,expression:"tabsValue === '1'"}],staticClass:"tab-container"},[a("form-viewer",{key:e.browseWorkDetail.id,ref:"form"})],1):e._e(),e._v(" "),e.tabsShow[1]?a("div",{directives:[{name:"show",rawName:"v-show",value:"2"===e.tabsValue,expression:"tabsValue === '2'"}],staticClass:"tab-container"},[a("ops-list")],1):e._e(),e._v(" "),e.tabsShow[2]?a("div",{directives:[{name:"show",rawName:"v-show",value:"3"===e.tabsValue,expression:"tabsValue === '3'"}],staticClass:"tab-container"},[a("bpmn-viewer")],1):e._e(),e._v(" "),e.tabsShow[3]?a("div",{directives:[{name:"show",rawName:"v-show",value:"4"===e.tabsValue,expression:"tabsValue === '4'"}],staticClass:"tab-container"}):e._e()])],1),e._v(" "),a("div",{staticClass:"footer w-100 pad-t-10 pf r-0 b-10"},[a("el-button",{staticClass:"pan-btn light-blue-btn",attrs:{disabled:e.saveLoading||e.submitLoading,icon:"el-icon-close"},on:{click:e.pageClose}},[e._v("关闭")])],1),e._v(" "),a("el-dialog",{attrs:{title:"任务转派",visible:e.assignDialog,"close-on-click-modal":!1,"append-to-body":!0},on:{"update:visible":function(t){e.assignDialog=t}}},[a("el-form",{ref:"assignForm",attrs:{model:e.assignForm,"label-width":"100px",rules:e.assignFormRules}},[a("el-form-item",{attrs:{label:"任务名称",prop:"taskname"}},[a("el-input",{attrs:{autocomplete:"off",disabled:""},model:{value:e.assignForm.taskname,callback:function(t){e.$set(e.assignForm,"taskname",t)},expression:"assignForm.taskname"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"接收人",prop:"receiver"}},[a("el-input",{staticStyle:{width:"78%"},attrs:{size:"small",placeholder:"请选择任务接收人",readonly:""},model:{value:e.assignForm.receiver,callback:function(t){e.$set(e.assignForm,"receiver",t)},expression:"assignForm.receiver"}}),e._v(" "),a("el-button",{attrs:{type:"success",size:"small",icon:"el-icon-search"},on:{click:e.addFormReceiver}},[e._v("选择用户")])],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.assignDataSure}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:function(t){e.assignDialog=!1}}},[e._v("取 消")])],1)],1),e._v(" "),a("tree-multi-select-table-dialog",{ref:"treeSelecteGroupNameDialog",attrs:{title:e.treeSelectTableDialog.title,visible:e.treeSelectTableDialog.visible,isMultipleChoice:e.treeSelectTableDialog.isMultipleChoice,selectedUserList:e.treeSelectTableDialog.selectedUserList},on:{"update:visible":function(t){return e.$set(e.treeSelectTableDialog,"visible",t)},updateUserList:e.updateUserList}})],1)},i=[],r=(a("8e6e"),a("456d"),a("ac6a"),a("20d6"),a("96cf"),a("1da1")),n=(a("6c7b"),a("ade3")),o=a("e7bc"),l=a("2ca2"),c=a("5722"),u=a("bf27"),b=a("6719"),d=a("2f62"),m=a("9b41");function v(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,s)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?v(Object(a),!0).forEach((function(t){Object(n["a"])(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):v(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var h={mixins:[b["default"]],name:"workDetailBrowse",components:{FormViewer:o["default"],OpsList:l["default"],BpmnViewer:c["default"],TreeMultiSelectTableDialog:u["default"]},computed:f({},Object(d["c"])(["browseWorkDetail","routerPath"])),provide:function(){var e=this;return{changeReadOnlyState:function(){return e.readyOnlyState}}},data:function(){return{saveLoading:!1,submitLoading:!1,readyOnlyState:!0,operBtnVisible:!0,tabsShow:[!0,!1,!1,!1],tabsValue:"1",tabList:[{title:"任务浏览",name:"1"},{title:"操作进展",name:"2"},{title:"流程图",name:"3"}],assignDialog:!1,assignForm:{taskname:"",receiver:""},transServiceData:{taskId:"",userId:""},assignFormRules:{taskname:[{required:!0,message:"任务名称不能为空",trigger:"change"}],receiver:[{required:!0,message:"请选择任务接收人",trigger:"change"}]},treeSelectTableDialog:{title:"选择人员",visible:!1,width:"",isMultipleChoice:!1,selectedUserList:[]},routeFrome:""}},created:function(){this.routeFrome=this.routerPath},activated:function(){this.initPage(),this.setTabContent()},methods:{initPage:function(){var e=Array(4).fill(!1);e[0]=!0,this.tabsShow=JSON.parse(JSON.stringify(e)),this.tabsValue="1"},setTabContent:function(){},saveForm:function(){this.$refs.form.saveForm()},submitForm:function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$refs.form.submitForm();case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),setAssign:function(){this.assignForm.taskname=this.browseWorkDetail.itemName,this.transServiceData.taskId=this.browseWorkDetail.id,this.assignDialog=!0},resetData:function(){this.assignForm.taskname="",this.assignForm.receiver="",this.transServiceData.taskId="",this.transServiceData.userId="",this.assignDialog=!1},assignDataSure:function(){var e=this;this.$refs.assignForm.validate((function(t){if(t){var a=e.transServiceData;Object(m["a"])(a).then((function(t){200===t.code&&(e.$message({type:"success",message:"转派成功"}),e.$router.go(-1),e.$refs.assignForm.resetFields(),e.resetData())}))}}))},pageClose:function(){var e=this;this.$refs.form.cancelRequest(),this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex((function(t){return t.path===e.$route.path})),1),this.$router.push({path:this.routeFrome})},tabClickHander:function(){var e=this.tabsValue-1;this.tabsShow[e]=!0},addFormReceiver:function(){var e=this;this.$refs.treeSelecteGroupNameDialog.resetPage(),this.$nextTick((function(){e.treeSelectTableDialog.visible=!0,e.treeSelectTableDialog.selectedUserList=[]}))},updateUserList:function(e){var t=this;e.forEach((function(e){t.assignForm.receiver=e.userName,t.transServiceData.userId=e.userId}))}},mounted:function(){}},g=h,p=(a("3d06"),a("2877")),w=Object(p["a"])(g,s,i,!1,null,"b8c78b72",null);t["default"]=w.exports}}]);