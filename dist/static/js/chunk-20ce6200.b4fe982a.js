(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-20ce6200"],{"0766":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("treeselect",{attrs:{valueFormat:"object","load-options":e.treeselectLoadNode,options:e.companyOptions,multiple:e.multiple,searchable:!1,disabled:e.disabled,noChildrenText:"没有更多了~",placeholder:"请选择",loadingText:"加载中..."},on:{input:e.selectUnit},model:{value:e.deptValue,callback:function(t){e.deptValue=t},expression:"deptValue"}})],1)},n=[],r=(i("ac6a"),i("b775")),s=i("ca17"),o=i.n(s),l=(i("542c"),{name:"",components:{Treeselect:o.a},props:{propValue:{type:Object,default:function(){return null}},multiple:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},isClose:{type:Boolean,default:!1}},data:function(){return{deptValue:null,companyOptions:[]}},created:function(){this.treeselectLoadfirstnode()},mounted:function(){},activited:function(){},update:function(){},beforeRouteUpdate:function(){},methods:{treeselectLoadNode:function(e){var t=e.action,i=e.parentNode,a=e.callback;t===s["LOAD_CHILDREN_OPTIONS"]&&(i.isLeaf?(i.children=[],a()):Object(r["a"])({url:"/system/dept/find/".concat(i.id),method:"GET"}).then((function(e){if(200===e.code){var t=[];e.data.forEach((function(e){var i={};i.id=e.deptId,i.label=e.deptName,i.isLeaf=e.leaf,i.children=null,t.push(i)})),i.children=t,a()}})))},treeselectLoadfirstnode:function(){var e=this;Object(r["a"])({url:"/system/dept/parentNode",method:"GET"}).then((function(t){if(200===t.code){var i=[t.data],a=[];i.forEach((function(e){var t={};t.id=e.deptId,t.label=e.deptName,t.isLeaf=e.leaf,t.children=null,a.push(t)})),e.companyOptions=a}}))},selectUnit:function(e){e&&this.$emit("selectUnit",e)}},filter:{},computed:{},watch:{isClose:{handler:function(e,t){this.deptValue=this.propValue?this.propValue:null},immediate:!0}}}),c=l,u=i("2877"),d=Object(u["a"])(c,a,n,!1,null,"7fa3d5a4",null);t["default"]=d.exports},1974:function(e,t,i){"use strict";i.d(t,"e",(function(){return n})),i.d(t,"d",(function(){return r})),i.d(t,"a",(function(){return s})),i.d(t,"f",(function(){return o})),i.d(t,"b",(function(){return l})),i.d(t,"c",(function(){return c}));var a=i("b775");function n(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup/list",method:"get",params:e})}function r(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup/"+e,method:"get"})}function s(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup",method:"post",data:e})}function o(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup",method:"put",data:e})}function l(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup/"+e,method:"delete"})}function c(e){return Object(a["a"])({url:"/kylin/flow/dynamicGroup/export",method:"get",params:e})}},"4fa3":function(e,t,i){},"507f":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{staticClass:"dataWrap"},[i("el-row",{staticClass:"fnButon",attrs:{gutter:10}},[i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroup:add"],expression:"['kylin:dynamicGroup:add']"}],attrs:{type:"primary",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),e._v(" "),i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroup:edit"],expression:"['kylin:dynamicGroup:edit']"}],attrs:{type:"success",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),e._v(" "),i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroup:remove"],expression:"['kylin:dynamicGroup:remove']"}],attrs:{type:"danger",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1)],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.dynamicGroupList,"highlight-current-row":""},on:{"selection-change":e.handleSelectionChange,"current-change":e.groupItemClickHandler}},[i("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),e._v(" "),i("el-table-column",{attrs:{label:"组名称",align:"center",prop:"groupDynamicName","show-overflow-tooltip":!0}})],1)],1),e._v(" "),i("pagination",{attrs:{total:e.total,layout:e.layout,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),e._v(" "),i("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","close-on-click-modal":!1,"append-to-body":!0},on:{"update:visible":function(t){e.open=t}}},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"组名称",prop:"groupDynamicName"}},[i("el-input",{attrs:{placeholder:"请输入组名称"},model:{value:e.form.groupDynamicName,callback:function(t){e.$set(e.form,"groupDynamicName","string"===typeof t?t.trim():t)},expression:"form.groupDynamicName"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1)],1)},n=[],r=i("1974"),s={name:"DynamicGroup",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,total:0,layout:"prev, pager, next",dynamicGroupList:[],title:"",open:!1,queryParams:{pageNum:1,pageSize:10,groupDynamicKey:void 0,groupDynamicName:void 0,createTime:void 0,updateTime:void 0},form:{},rules:{groupDynamicName:[{required:!0,message:"组名称能为空",trigger:"blur"},{max:20,message:"组名称最多输入20个字符"}]}}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.loading=!0,Object(r["e"])(this.queryParams).then((function(t){e.dynamicGroupList=t.rows,e.total=t.total,e.loading=!1}))},cancel:function(){this.open=!1,this.reset()},reset:function(){this.form={groupDynamicId:void 0,groupDynamicKey:void 0,groupDynamicName:void 0,createTime:void 0,updateTime:void 0},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.groupDynamicId})),this.single=1!=e.length,this.multiple=!e.length},handleAdd:function(){this.reset(),this.open=!0,this.title="添加流程动态审批组"},handleUpdate:function(e){var t=this;this.reset();var i=e.groupDynamicId||this.ids;Object(r["d"])(i).then((function(e){t.form=e.data,t.open=!0,t.title="修改流程动态审批组"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(void 0!=e.form.groupDynamicId?Object(r["f"])(e.form).then((function(t){200===t.code?(e.msgSuccess("修改成功"),e.open=!1,e.getList()):e.msgError(t.msg)})):Object(r["a"])(e.form).then((function(t){200===t.code?(e.msgSuccess("新增成功"),e.open=!1,e.getList()):e.msgError(t.msg)})))}))},handleDelete:function(e){var t=this,i=e.groupDynamicId||this.ids;this.$confirm('是否确认删除流程动态审批组编号为"'+i+'"的数据项?',"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return Object(r["b"])(i)})).then((function(){t.getList(),t.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){var e=this,t=this.queryParams;this.$confirm("是否确认导出所有流程动态审批组数据项?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return Object(r["c"])(t)})).then((function(t){e.download(t.msg)})).catch((function(){}))},groupItemClickHandler:function(e){this.$emit("groupItemClick",e)}}},o=s,l=i("2877"),c=Object(l["a"])(o,a,n,!1,null,null,null);t["default"]=c.exports},a76c:function(e,t,i){"use strict";i("d6d9")},bf27:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"container"},[e.visible?i("el-dialog",{attrs:{title:e.title,visible:e.visible,width:e.width,"before-close":e.handleClose,"close-on-click-modal":!1,"append-to-body":!0},on:{"update:visible":function(t){e.visible=t}}},[i("div",[i("el-row",{attrs:{gutter:10}},[i("el-col",{attrs:{span:6}},[i("el-row",[i("el-input",{staticStyle:{"margin-bottom":"10px"},attrs:{placeholder:"请输入部门名称","prefix-icon":"el-icon-search",size:"small"},on:{input:e.searchDept},model:{value:e.searchDeptValue,callback:function(t){e.searchDeptValue=t},expression:"searchDeptValue"}})],1),e._v(" "),i("div",{staticClass:"tree-container"},[i("el-tree",{directives:[{name:"show",rawName:"v-show",value:!e.isSearching,expression:"!isSearching"}],ref:"deptTree",staticClass:"filter-tree",style:{overflow:"auto"},attrs:{lazy:"","highlight-current":!0,load:e.eltreeLoadNode,props:e.defaultProps,"node-key":"deptId","default-expanded-keys":["0000000000"]},on:{"node-click":e.handleNodeClick}}),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.isSearching,expression:"isSearching"}],staticClass:"dept-list"},[e.searchDeptList.length>0?i("div",{staticClass:"has-data"},e._l(e.searchDeptList,(function(t,a){return i("div",{key:a,on:{click:function(i){return e.handleNodeClick(t)}}},[e._v("\n                  "+e._s(t.deptName)+"\n                ")])})),0):i("div",{staticClass:"no-data"},[e._v("暂无数据")])])],1)],1),e._v(" "),i("el-col",{attrs:{span:18}},[i("el-row",{staticClass:"pad-b-10",attrs:{gutter:10}},[i("el-col",{attrs:{span:12}},[i("el-input",{attrs:{placeholder:"请输入用户名称"},model:{value:e.formLabelAlign.userName,callback:function(t){e.$set(e.formLabelAlign,"userName",t)},expression:"formLabelAlign.userName"}})],1),e._v(" "),i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{type:"primary"},on:{click:e.searchNameHandler}},[e._v("人员查询")])],1)],1),e._v(" "),e.selectedUserList.length>0?i("div",{staticClass:"tagWrap"},[i("span",{staticClass:"c-189"},[e._v(" 已选择用户：")]),e._v(" "),e._l(e.selectedUserList,(function(t){return i("el-tag",{key:t.userId,staticStyle:{"margin-right":"10px","margin-bottom":"10px"},attrs:{closable:"","disable-transitions":!1},on:{close:function(i){return e.handleCloseTagItem(t)}}},[e._v("\n              "+e._s(t.userName)+"\n            ")])}))],2):e._e(),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{width:"100%","margin-bottom":"20px",overflow:"auto"},attrs:{data:e.tableData,height:e.tabalHeight,"element-loading-text":"Loading"}},[i("el-table-column",{attrs:{align:"center",label:"用户编码",prop:"userId"}}),e._v(" "),i("el-table-column",{attrs:{align:"center","show-overflow-tooltip":"",label:"用户名称",prop:"userName"}}),e._v(" "),i("el-table-column",{attrs:{align:"center","show-overflow-tooltip":"",label:"部门",prop:"deptName"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(t.row.dept,(function(t,a){return i("span",{key:a},[e._v(e._s(t.deptName))])}))}}],null,!1,1807517202)}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"80","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-row",[i("el-col",[i("el-button",{attrs:{type:"success",size:"mini",plain:""},on:{click:function(i){return e.checkUser(t.row,t.$index)}}},[e._v(e._s(t.row.checkState?"取消选择":"选择"))])],1)],1)]}}],null,!1,88487162)})],1),e._v(" "),i("el-pagination",{attrs:{"current-page":e.currentPage,"page-sizes":[10,20,30,40],"page-size":e.pageSize,background:!0,"pager-count":5,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:e.handleClose}},[e._v("取 消")])],1)]):e._e()],1)},n=[],r=(i("8e6e"),i("456d"),i("ade3")),s=(i("96cf"),i("1da1")),o=(i("ac6a"),i("20d6"),i("b775")),l=i("c9b7");function c(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,a)}return i}function u(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?c(Object(i),!0).forEach((function(t){Object(r["a"])(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):c(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var d={model:{prop:"checkedCode",event:"emitValue"},props:{title:{type:String,default:"弹窗"},visible:{type:Boolean,default:!1},width:{type:String,default:"80%"},selectedUserList:{type:Array,default:function(){return[]}},isMultipleChoice:{type:Boolean,default:!0}},data:function(){return{isSearching:!1,searchDeptValue:"",searchDeptList:[],searchDeptById:"",formLabelAlign:{userName:""},defaultProps:{label:"deptName",children:"zones",isLeaf:"leaf"},listLoading:!0,tableData:[],currentPage:1,pageSize:10,total:0,tabalHeight:0}},created:function(){},mounted:function(){this.getTabaleHeight()},methods:{getTabaleHeight:function(){var e=this;this.$nextTick((function(){var t=document.documentElement.clientHeight,i=316;e.tabalHeight=t-i+"px"}))},initData:function(){this.isSearching=!1,this.searchDeptValue="",this.searchDeptById="",this.formLabelAlign.userName="",this.tableData=[],this.currentPage=1,this.pageSize=10,this.total=0},resetPage:function(){this.initData(),this.fetchData()},searchDept:Object(l["a"])((function(e,t,i){var a=this;""!==this.searchDeptValue?Object(o["a"])({url:"/system/dept/list?deptName=".concat(this.searchDeptValue),method:"GET"}).then((function(e){200===e.code?(a.searchDeptList=e.rows,a.isSearching=!0):a.$message({type:"error",message:e.message})})):this.isSearching=!1}),500),eltreeLoadNode:function(e,t){0===e.level&&this.eltreeLoadfirstnode(t),e.level>=1&&this.eltreeLoadchildnode(e,t)},eltreeLoadfirstnode:function(e){var t=this;Object(o["a"])({url:"/system/dept/parentNode",method:"GET"}).then((function(i){if(200===i.code)return e([i.data]);t.$message({type:"error",message:"获取根节点部门失败!"})}))},eltreeLoadchildnode:function(e,t){var i=this;Object(o["a"])({url:"/system/dept/find/".concat(e.data.deptId),method:"GET"}).then((function(e){if(200===e.code)return t(e.data);i.$message({type:"error",message:"获取子部门树失败!"})}))},searchNameHandler:function(){this.currentPage=1,this.fetchData()},handleCloseTagItem:function(e){var t=this.selectedUserList.findIndex((function(t){return t.userId===e.userId}));this.tableData.forEach((function(t,i,a){t.userId===e.userId&&(a[i].checkState=!1)})),this.selectedUserList.splice(t,1)},submit:function(){var e=this;0!==this.selectedUserList.length&&this.selectedUserList.forEach((function(t){e.$delete(t,"checkState")})),console.log("选中的人员",this.selectedUserList),this.$emit("updateUserList",this.selectedUserList),this.handleClose()},tableRowClickHander:function(e){this.$emit("selectItem",e),this.handleClose()},handleClose:function(){this.$emit("update:visible",!1)},checkUser:function(e,t){e.checkState?this.handleCloseTagItem(e):this.addUserItem(e,t)},addUserItem:function(e,t){this.isMultipleChoice?this.selectedUserList.push(e):(this.selectedUserList.splice(0,1,e),this.tableData.forEach((function(e){return e.checkState=!1}))),this.tableData[t].checkState=!0},handleCurrentChange:function(e){this.currentPage=e,this.fetchData()},handleSizeChange:function(e){this.pageSize=e,this.fetchData()},handleNodeClick:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.searchDeptById=t.deptId,this.fetchData();case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),fetchData:function(){var e=this;this.listLoading=!0;var t={};t.userName=this.formLabelAlign.userName,t.pageNum=this.currentPage-1,t.pageSize=this.pageSize,t.deptIdStr=this.searchDeptById,t.status=0,t.delFlag=0,Object(o["a"])({url:"/system/user/brief/list",method:"GET",params:t}).then((function(t){200===t.code?(e.listLoading=!1,t.rows?e.tableData=t.rows.map((function(e){return u(u({},e),{},{checkState:!1})})):e.tableData=[],e.total=t.total,e.fileUserSelect()):(e.listLoading=!1,e.$message({type:"error",message:"获取用户列表失败!"}))}))},fileUserSelect:function(){var e=this;0!==this.selectedUserList.length&&this.selectedUserList.forEach((function(t){e.tableData.forEach((function(i,a,n){t.userId===i.userId&&(e.tableData[a].checkState=!0)}))}))}}},p=d,m=(i("d99d"),i("2877")),h=Object(m["a"])(p,a,n,!1,null,"645dba90",null);t["default"]=h.exports},c747:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container"},[i("el-row",[i("el-col",{staticClass:"left-box",attrs:{span:7}},[i("flow-group-dynamic",{on:{groupItemClick:e.groupItemClick}})],1),e._v(" "),i("el-col",{staticClass:"right-box",attrs:{span:17}},[i("div",{staticClass:"dataWrap"},[i("el-row",{staticClass:"fnButon",attrs:{gutter:10}},[i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:add"],expression:"['kylin:dynamicGroupUser:add']"}],attrs:{type:"primary",icon:"el-icon-plus",size:"mini"},on:{click:e.handleAdd}},[e._v("新增")])],1),e._v(" "),i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:edit"],expression:"['kylin:dynamicGroupUser:edit']"}],attrs:{type:"success",icon:"el-icon-edit",size:"mini",disabled:e.single},on:{click:e.handleUpdate}},[e._v("修改")])],1),e._v(" "),i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:remove"],expression:"['kylin:dynamicGroupUser:remove']"}],attrs:{type:"danger",icon:"el-icon-delete",size:"mini",disabled:e.multiple},on:{click:e.handleDelete}},[e._v("删除")])],1),e._v(" "),i("el-col",{attrs:{span:1.5}},[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:export"],expression:"['kylin:dynamicGroupUser:export']"}],attrs:{type:"warning",icon:"el-icon-download",size:"mini"},on:{click:e.handleExport}},[e._v("导出")])],1)],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{data:e.dynamicGroupUserList},on:{"selection-change":e.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),e._v(" "),i("el-table-column",{attrs:{label:"用户",align:"center",prop:"userName"}}),e._v(" "),i("el-table-column",{attrs:{label:"所在部门",align:"center",prop:"deptName"}}),e._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:edit"],expression:"['kylin:dynamicGroupUser:edit']"}],attrs:{size:"mini",type:"text",icon:"el-icon-edit"},on:{click:function(i){return e.handleUpdate(t.row)}}},[e._v("修改")]),e._v(" "),i("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["kylin:dynamicGroupUser:remove"],expression:"['kylin:dynamicGroupUser:remove']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(i){return e.handleDelete(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),i("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total > 0"}],attrs:{total:e.total,page:e.queryParams.pageNum,limit:e.queryParams.pageSize},on:{"update:page":function(t){return e.$set(e.queryParams,"pageNum",t)},"update:limit":function(t){return e.$set(e.queryParams,"pageSize",t)},pagination:e.getList}}),e._v(" "),i("el-dialog",{attrs:{title:e.title,visible:e.open,width:"500px","close-on-click-modal":!1,"append-to-body":!0},on:{"update:visible":function(t){e.open=t}}},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"用户",prop:"userId"}},[i("el-input",{staticStyle:{width:"278px"},attrs:{readonly:""},model:{value:e.form.userName,callback:function(t){e.$set(e.form,"userName",t)},expression:"form.userName"}}),e._v(" "),i("el-button",{attrs:{type:"success",size:"small",icon:"el-icon-search"},on:{click:e.addFormUserList}},[e._v("选择用户")])],1),e._v(" "),i("el-form-item",{attrs:{label:"所在部门",prop:"deptId"}},[i("tree-dept-select",{attrs:{isClose:e.open,propValue:e.form.depts,multiple:!1,disabled:!1},on:{"update:propValue":function(t){return e.$set(e.form,"depts",t)},"update:prop-value":function(t){return e.$set(e.form,"depts",t)},selectUnit:e.selectUnit}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:e.cancel}},[e._v("取 消")])],1)],1),e._v(" "),i("tree-multi-select-table-dialog",{ref:"treeSelecteGroupNameDialog",attrs:{title:e.treeSelectTableDialog.title,visible:e.treeSelectTableDialog.visible,isMultipleChoice:e.treeSelectTableDialog.isMultipleChoice,selectedUserList:e.treeSelectTableDialog.selectedUserList},on:{"update:visible":function(t){return e.$set(e.treeSelectTableDialog,"visible",t)},updateUserList:e.updateUserList}})],1)],1)],1)},n=[],r=(i("ac6a"),i("507f")),s=i("bf27"),o=i("0766"),l=i("b775");function c(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser/list",method:"get",params:e})}function u(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser/"+e,method:"get"})}function d(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser",method:"post",data:e})}function p(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser",method:"put",data:e})}function m(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser/"+e,method:"delete"})}function h(e){return Object(l["a"])({url:"/kylin/dynamicGroupUser/export",method:"get",params:e})}var f={components:{FlowGroupDynamic:r["default"],TreeMultiSelectTableDialog:s["default"],TreeDeptSelect:o["default"]},name:"DynamicGroupUser",data:function(){return{loading:!0,ids:[],single:!0,multiple:!0,total:0,dynamicGroupUserList:[],title:"",open:!1,queryParams:{pageNum:1,pageSize:10,groupDynamicId:void 0,userId:void 0,userName:void 0,deptId:void 0,deptName:void 0},groupItem:{groupDynamicId:void 0,groupDynamicName:void 0},treeSelectTableDialog:{title:"选择人员",visible:!1,isMultipleChoice:!1,width:"",selectedUserList:[]},form:{},rules:{groupDynamicId:[{required:!0,message:"组ID不能为空",trigger:"blur"}],userId:[{required:!0,message:"用户不能为空",trigger:"blur"}],deptId:[{required:!0,message:"所在部门不能为空",trigger:"blur"}]}}},filters:{userListFilter:function(e){console.log("userListFilter:"+e);var t=[];return 0===e.length?"-":(e.map((function(e){t.push(e.userName)})),t.join(","))}},created:function(){this.getList()},methods:{groupItemClick:function(e){this.queryParams.groupDynamicId=e.groupDynamicId,this.groupItem.groupDynamicId=e.groupDynamicId,this.groupItem.groupDynamicName=e.groupDynamicName,console.log("右侧查询列表参数"+this.queryParams.groupDynamicId),this.getList(),this.add=!1},getList:function(){var e=this;this.loading=!0,c(this.queryParams).then((function(t){e.dynamicGroupUserList=t.rows,e.total=t.total,e.loading=!1}))},cancel:function(){this.open=!1,this.reset()},reset:function(){this.form={groupDynamicUserId:void 0,groupDynamicId:void 0,userId:void 0,userName:void 0,deptId:void 0,deptName:void 0,depts:null},this.resetForm("form")},handleQuery:function(){this.queryParams.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleSelectionChange:function(e){this.ids=e.map((function(e){return e.groupDynamicUserId})),this.single=1!=e.length,this.multiple=!e.length},handleAdd:function(){void 0!=this.groupItem.groupDynamicId?(this.reset(),this.open=!0,this.title="添加流程动态审批组用户关联",this.form.groupDynamicId=this.groupItem.groupDynamicId,this.$set(this.form,"depts",null)):this.$message({showClose:!0,message:"请先点击组名称",type:"error",duration:1500})},handleUpdate:function(e){var t=this;this.reset();var i=e.groupDynamicUserId||this.ids;u(i).then((function(e){var i=e.data;t.form=i,t.$set(t.form,"depts",{id:i.deptId,label:i.deptName}),t.open=!0,t.title="修改流程动态审批组用户关联"}))},submitForm:function(){var e=this;this.$refs["form"].validate((function(t){t&&(void 0!=e.form.groupDynamicUserId?p(e.form).then((function(t){200===t.code?(e.msgSuccess("修改成功"),e.open=!1,e.getList()):e.msgError(t.msg)})):d(e.form).then((function(t){200===t.code?(e.msgSuccess("新增成功"),e.open=!1,e.getList()):e.msgError(t.msg)})))}))},handleDelete:function(e){var t=this,i=e.groupDynamicUserId||this.ids;this.$confirm('是否确认删除流程动态审批组用户关联编号为"'+i+'"的数据项?',"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return m(i)})).then((function(){t.getList(),t.msgSuccess("删除成功")})).catch((function(){}))},handleExport:function(){var e=this,t=this.queryParams;this.$confirm("是否确认导出所有流程动态审批组用户关联数据项?","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){return h(t)})).then((function(t){e.download(t.msg)})).catch((function(){}))},addFormUserList:function(){var e=this;this.$refs.treeSelecteGroupNameDialog.resetPage(),this.$nextTick((function(){e.treeSelectTableDialog.selectedUserList=[],e.treeSelectTableDialog.visible=!0}))},updateUserList:function(e){var t=this;console.log("selectedUserList",e),e.forEach((function(e){t.form.userId=e.userId,t.form.userName=e.userName}))},selectUnit:function(e){console.log("selectUnit:",e),this.form.deptId=e.id,this.form.deptName=e.label}}},g=f,v=(i("a76c"),i("2877")),y=Object(v["a"])(g,a,n,!1,null,"9600b5c6",null);t["default"]=y.exports},c9b7:function(e,t,i){"use strict";i.d(t,"a",(function(){return a}));i("a481"),i("20d6");function a(e,t){var i;t=t||200;return function(){var a=this,n=arguments;i&&clearTimeout(i),i=setTimeout((function(){i=null,e.apply(a,n)}),t)}}},d6d9:function(e,t,i){},d99d:function(e,t,i){"use strict";i("4fa3")}}]);