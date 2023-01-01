<template>
  <div class="formItem">
    <BaseForm
      ref="baseForm"
      :formType="baseFormType"
      :form="baseForm"
      :approvalForm="approvalForm"
      :approvalVisible="approvalVisible"
    ></BaseForm>
    <FormBuild
      v-if="formPreView1.visible"
      ref="dynamicForm1"
      :options.sync="formPreView1.jsonData"
      :dynamic-data.sync="formPreView1.dynamicData"
      :default-value="formPreView1.defaultValue"
      :disabled="formPreView1.disabled"
    >
      <p slot="customizeTable1">自定义组件1</p>
      <p slot="customizeTable2">自定义组件2</p>
    </FormBuild>
    <!-- 流程审批表单（结束） -->

    <!-- 嵌套表格弹窗[搜索+树形表格]（开始） -->
    <tree-table-dialog
      :title="treeTableDialog.title"
      :visible.sync="treeTableDialog.visible"
      :tableHeaders="treeTableDialog.tableHeaders"
      :tableData="treeTableDialog.tableData"
      @search="treeTableSearch"
      @selectItem="treeTableSelectItem"
    ></tree-table-dialog>
    <!-- 嵌套表格弹窗[搜索+树形表格]（结束） -->

    <!-- 表格分页弹窗[搜索+表格+分页]（开始） -->
    <table-dialog
      :title="tableDialog.title"
      :visible.sync="tableDialog.visible"
      :tableHeaders="tableDialog.tableHeaders"
      :tableData="tableDialog.tableData"
      :currentPage="tableDialog.pageObj.currentPage"
      :total="tableDialog.pageObj.total"
      :pageSize="tableDialog.pageObj.pageSize"
      @search="tableSearch"
      @selectItem="tableSelectItem"
      @currentPageChange="tableCurrentPageChange"
      @pageSizeChange="tablePageSizeChange"
    ></table-dialog>
    <!-- 表格分页弹窗[搜索+表格+分页]（结束） -->

    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（开始） -->
    <tree-select-table-dialog
      :title="treeSelectTableDialog.title"
      :visible.sync="treeSelectTableDialog.visible"
      :tableHeaders="treeSelectTableDialog.tableHeaders"
      :tableData="treeSelectTableDialog.tableData"
      :currentPage="treeSelectTableDialog.pageObj.currentPage"
      :total="treeSelectTableDialog.pageObj.total"
      :pageSize="treeSelectTableDialog.pageObj.pageSize"
      @searchCompany="treeSelectTableSearchCompany"
      @searchName="treeSelectTableSearchName"
      @treeNodeClick="treeNodeClickHander"
      @selectItem="tableSearch"
      @currentPageChange="tableSearch"
      @pageSizeChange="tableSearch"
    ></tree-select-table-dialog>
    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（结束） -->

    <!-- 动态表格弹窗（开始） -->
    <d-table-dialog
      :inputDefaultValue="ruleForm1.dname"
      :propName="dTableDialog.propName"
      :request="dTableDialog.request"
      :title="dTableDialog.title"
      :visible.sync="dTableDialog.visible"
      :tableHeaders="dTableDialog.tableHeaders"
    ></d-table-dialog>
    <!-- 动态表格弹窗（结束） -->
  </div>
</template>

<script>
import TreeTableDialog from "@/components/form-dialog/treeTableDialog/index.vue";
import TableDialog from "@/components/form-dialog/tableDialog/index.vue";
import TreeSelectTableDialog from "@/components/form-dialog/treeSelectTableDialog/index.vue";
import Upload from "@/components/upload/index.vue";
import EbTable from "@/components/eb-table/index.vue";
import deepClone from "clone-deep";
import PreFormView from "@/components/PreFormView";
import DTableDialog from "@/components/form-dialog/dTableDialog/index.vue";
import FormBuild from "@/components/elementFormDesign/formBuild";
import { mapGetters, mapActions } from "vuex";
import { findList } from "@/api/tool/form.js";
import {
  saveApproval,
  submitTaskForm,
  getBaseForm,
  saveBaseForm,
} from "@/api/work";
import BaseForm from "@/views/pageDetail/form/index.vue";
export default {
  components: {
    TreeTableDialog,
    TableDialog,
    TreeSelectTableDialog,
    Upload,
    EbTable,
    PreFormView,
    DTableDialog,
    FormBuild,
    BaseForm,
  },
  name: "FormViewer",
  inject: ['changeReadOnlyState'],
  data() {
    return {
      baseFormType: "",
      baseFormGetApi: "",
      baseFormPostApi: "",
      baseForm: {},
      approvalFormId: "",
      approvalForm: {},
      approvalDataValue: {},
      approvalVisible: false,
      // 可增减输入框表格
      ebTable: {
        label: "外部采购费用",
        tableHeader: [
          { label: "姓名", prop: "name", type: "text" },
          { label: "性别", prop: "gender", type: "number" },
          { label: "年龄", prop: "age", type: "number" },
        ],
        tableItemBak: {
          name: "",
          gender: "",
          age: "",
        },
        tableList: [],
      },
      // 动态表格弹窗
      dTableDialog: {
        request: {
          url: "/kylin/formData/list",
          method: "get",
        },
        title: "表格弹窗",
        visible: false,
        width: "",
        propName: "controlName",
        tableHeaders: [
          {
            prop: "createTime",
            label: "日期",
            width: "",
          },
          {
            prop: "controlName",
            label: "表单名称",
            width: "",
          },
          {
            prop: "businessKey",
            label: "表单key",
            width: "",
          },
        ],
      },
      // 嵌套表格弹窗[搜索+树形表格]
      treeTableDialog: {
        title: "树形搜索弹窗",
        visible: false,
        width: "",
        tableHeaders: [
          {
            prop: "date",
            label: "日期",
            width: "180",
          },
          {
            prop: "name",
            label: "姓名",
            width: "180",
          },
          {
            prop: "address",
            label: "地址",
            width: "",
          },
        ],
        tableData: [
          {
            id: 1,
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
          },
          {
            id: 2,
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            id: 3,
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄",
            children: [
              {
                id: 31,
                date: "2016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1519 弄",
              },
              {
                id: 32,
                date: "2016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1519 弄",
              },
            ],
          },
          {
            id: 4,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 5,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 6,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 7,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
        ],
      },
      // 表格分页弹窗[搜索+树形表格+分页]
      tableDialog: {
        title: "表格弹窗",
        visible: false,
        width: "",
        tableHeaders: [
          {
            prop: "date",
            label: "日期",
            width: "180",
          },
          {
            prop: "name",
            label: "姓名",
            width: "180",
          },
          {
            prop: "address",
            label: "地址",
            width: "",
          },
        ],
        tableData: [
          {
            id: 1,
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
          },
          {
            id: 2,
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            id: 4,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 5,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 6,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 7,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
        ],
        pageObj: {
          currentPage: 1,
          total: 100,
          pageSize: 10,
        },
      },
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "树形图+表格弹窗",
        visible: false,
        width: "",
        tableHeaders: [
          {
            prop: "date",
            label: "日期",
            width: "180",
          },
          {
            prop: "name",
            label: "姓名",
            width: "180",
          },
          {
            prop: "address",
            label: "地址",
            width: "",
          },
        ],
        tableData: [
          {
            id: 1,
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄",
          },
          {
            id: 2,
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            id: 4,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 5,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 6,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
          {
            id: 7,
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄",
          },
        ],
        pageObj: {
          currentPage: 1,
          total: 100,
          pageSize: 10,
        },
      },
      ruleForm1: {
        name: "",
        dname: "",
      },
      rules1: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      ruleForm2: {
        desc: "",
        files: [],
      },
      rules2: {
        desc: [{ required: true, message: "描述不能为空", trigger: "blur" }],
        files: [
          { required: true, message: "上传文件不能为空", trigger: "blur" },
        ],
        name1: [{ required: true, message: "外采1不能为空", trigger: "blur" }],
        name2: [{ required: true, message: "金额1不能为空", trigger: "blur" }],
        name3: [{ required: true, message: "占比1不能为空", trigger: "blur" }],
      },
      // json动态渲染表单
      formPreView1: {
        visible: false,
        formId: "",
        disabled: false,
        jsonData: {},
        width: "",
        defaultValue: {},
        dynamicData: {},
      },
      unwatch: null // 取消监控
    };
  },
  computed: {
    ...mapGetters(["workDetail", "browseWorkDetail", "approvalVariables", "bizFlowVariables"]),
    readOnlyState () {
      return this.changeReadOnlyState()
    },
    id() {
      const idData = this.readOnlyState ? this.browseWorkDetail.id : this.workDetail.id
      return idData;
    },
  },
  beforeDestroy () {
    !!this.unwatch && this.unwatch()
  },
  created() {
    // console.log('我是created执行', this.changeReadOnlyState())l
    this.unwatch = this.$watch('id', (newValue, oldValue) => {
      this.initData();
    }, {
      deep: true,
      immediate: true,
    })
  },
  methods: {
    ...mapActions(['GetToDoCont']),
    // 关闭弹窗
    handleClose() {},
    // 后端返回深拷贝一份放到table上
    // 增删改查都调接口&&修改原data数据&&再执行一次查询接口（目的修改拷贝后的数据）
    // 每次筛选按钮点击都执行筛选接口
    // 处理不同的筛选条件的情况【1、需要全能的；2、模糊查询的；3、日期范围的】
    // 保存提交时候，给后端原数据
    handlerSearch() {
      let filter = this.searchObj;
      let tempFilter = {};
      //拿到有值的参数
      for (let key in filter) {
        if (
          typeof filter[key] != "undefined" &&
          typeof filter[key] != "null" &&
          filter[key] != null &&
          filter[key] != ""
        ) {
          // 数组&&非空数据---添加
          if (Array.isArray(filter[key]) && filter[key].length > 0) {
            tempFilter[key] = filter[key];
          } else if (!Array.isArray(filter[key])) {
            // 非数组---添加
            tempFilter[key] = filter[key];
          }
        }
      }
      let arr = this.form.projectMemberList;
      let resultArr = arr.filter((item) => {
        let flag = true;
        for (let key in tempFilter) {
          // item[key]---遍历元素的值；tempFilter[key]---筛选条件的值；key---要筛选的字段名
          let searchItem = this.searchOptions.find(
            (item) => item.searchName === key
          );
          let { type, tableName } = searchItem;
          if (type === "datepicker") {
            // startTime变量1
            // 1、日期范围的情况
            let dateArr = tempFilter[key];
            let st = new Date(dateArr[0]).getTime();
            let dt = new Date(dateArr[1]).getTime();
            let ct = new Date(item[tableName] + " 00:00:00").getTime();
            if (ct >= st && ct <= dt) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          } else if (type === "checkbox") {
            // 2、多选按钮的情况
            if (tempFilter[key].includes(item[tableName])) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          } else {
            // 3、模糊搜索框的情况
            if (item[key].toString().indexOf(tempFilter[key].toString()) >= 0) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
        }
        if (flag) {
          return item;
        }
      });
      console.log("搜索结果", JSON.stringify(resultArr));
    },
    // “多选”筛选器
    renderHeaderCheckbox(h, { column, $index }, index) {
      let searchName = this.searchOptions.find(
        (item) => item.tableName === column.property
      ).searchName;
      return (
        <span>
          {column.label}
          <el-popover
            placement="bottom"
            width="145"
            height="200"
            trigger="click"
            v-model={this.show[searchName]}
          >
            <span slot="reference">
              <i class="el-icon-arrow-down" style="fontSize:12px" />
            </span>
            <div class="pop-content">
              <el-checkbox-group v-model={this.searchObj[searchName]}>
                <el-checkbox
                  label="内部资源"
                  style="display:block;paddingBottom:5px"
                />
                <el-checkbox
                  label="外部资源"
                  style="display:block;paddingBottom:5px"
                />
              </el-checkbox-group>
              <div class="el-table-filter__bottom" style="paddingBottom:0px;">
                <button
                  class={
                    this.searchObj[searchName].length > 0 ? "" : "is-disabled"
                  }
                  on-click={this.handlerSearch}
                >
                  筛选
                </button>
                <button on-click={this.clearSearch.bind(this, searchName)}>
                  重置
                </button>
              </div>
            </div>
          </el-popover>
        </span>
      );
    },
    // “日期范围”筛选器
    renderHeaderDatePicker(h, { column, $index }, index) {
      let searchName = this.searchOptions.find(
        (item) => item.tableName === column.property
      ).searchName;
      return (
        <span>
          {column.label}
          <el-popover
            placement="bottom"
            width="377"
            height="200"
            trigger="click"
            v-model={this.show[searchName]}
          >
            <span slot="reference">
              <i class="el-icon-arrow-down" style="fontSize:12px" />
            </span>
            <div class="pop-content">
              <el-date-picker
                v-model={this.searchObj[searchName]}
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="marginBottom:10px"
                clearable={false}
              />
              <div class="el-table-filter__bottom" style="paddingBottom:0px;">
                <button
                  class={
                    this.searchObj[searchName].length > 0 ? "" : "is-disabled"
                  }
                  on-click={this.handlerSearch}
                >
                  筛选
                </button>
                <button on-click={this.clearSearch.bind(this, searchName)}>
                  重置
                </button>
              </div>
            </div>
          </el-popover>
        </span>
      );
    },
    clearSearch(searchName) {
      let type = this.searchOptions.find(
        (item) => item.searchName === searchName
      ).type;
      if (type === "datepicker") {
        this.searchObj[searchName] = [];
      } else if (type === "checkbox") {
        this.searchObj[searchName] = [];
      } else {
        this.searchObj[searchName] = "";
      }
      this.handlerSearch();
    },
    // 初始化表单数据
    initData() {
      let taskId = this.readOnlyState ? this.browseWorkDetail.id : this.workDetail.id;
      let businessKey = this.readOnlyState ? this.browseWorkDetail.businessKey : this.workDetail.businessKey;
      let nodeId = this.readOnlyState ? this.browseWorkDetail.taskDefinitionKey : this.workDetail.taskDefinitionKey;
      let params = { businessKey, nodeId, taskId };
      findList(params).then((res) => {
        res.data.forEach((data) => {
          /** 判断表单类型 0-业务表单 1-JSON表单 2-审批表单*/
          if (data.formType && data.formType === "0") {
            this.baseFormType = data.router;
            this.baseFormGetApi = data.selectUrl;
            this.baseFormPostApi = data.submitUrl;
            if (this.baseFormGetApi && this.baseFormGetApi !== "") {
              const bizKey = this.readOnlyState ? this.browseWorkDetail.bizKey : this.workDetail.bizKey;
              getBaseForm(this.baseFormGetApi, bizKey).then((res) => {
                if (res.code === 200) {
                  this.baseForm = res.data;
                  //业务表单formData特殊处理
                  if (this.baseFormType && this.$refs.baseForm && this.$refs.baseForm.$refs[this.baseFormType].handleFormData) {
                    this.$refs.baseForm.$refs[this.baseFormType].handleFormData(this.baseForm);
                  }
                }else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                }
              }
            );
           }
          } else if (data.formType && data.formType === "1") {
            this.formPreView1.jsonData = JSON.parse(data.controlValue);
            this.formPreView1.formId = data.id;
            this.formPreView1.visible = true;
            let customizeArr = this.formPreView1.jsonData.list.filter(
              (item) => item.type === "customize"
            );
          } else if (data.formType && data.formType === "2") {
            this.approvalVisible = true;
            this.approvalFormId = data.id;
            if (data.dataValue && data.dataValue.formDataValue) {
              this.approvalForm = JSON.parse(data.dataValue.formDataValue);
            }
            if (data.dataValue) {
              this.approvalDataValue = data.dataValue;
            }
          }
        });
      });
    },
    // 初始化传给预览组件的 json表单字符串
    // initData() {
    //   this.formPreView1.jsonData = JSON.parse(JSON.stringify(formData01));
    //   this.formPreView1.visible = true;
    //   let jsonData = this.formPreView1.jsonData;
    //   let customizeArr = jsonData.list.filter(
    //     (item) => item.type === "customize"
    //   );
    //   // console.log("需要自定义的组件数组", customizeArr);
    // },
    // 树形表格的搜索框
    treeTableSearch(val) {
      console.log("树形表格---搜索文字", val);
    },
    // 树形表格的选中某一行
    treeTableSelectItem(row) {
      console.log("树形表格---选择某一行", row);
      this.ruleForm1.name = row.name;
    },
    // 普通表格的搜索框
    tableSearch(val) {
      console.log("树形表格---搜索文字", val);
    },
    // 普通表格的选中某一行
    tableSelectItem(row) {
      console.log("树形表格---选择某一行", row);
      this.ruleForm1.name = row.name;
    },
    // 普通表格--当前页面数修改
    tableCurrentPageChange(currentPage) {
      console.log(`当前页: ${currentPage}`);
    },
    // 普通表格--没有条数数修改
    tablePageSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
    },
    // 树形节点的点击事件
    treeNodeClickHander(node) {
      console.log("选中的树形节点", node);
    },
    treeSelectTableSearchCompany(company) {
      console.log("树形+右侧表格--搜索机构", company);
    },
    treeSelectTableSearchName(name) {
      console.log("树形+右侧表格--搜索人员", name);
    },
    /** 保存数据 */
    async saveForm(isSubmit) {
        // console.log('formViewer页面727行' + checkNormalForm)
      /** 保存业务表单数据*/
      let baseForm = this.$refs.baseForm.form;
      console.log('formviewer', baseForm)
      if (
        baseForm &&
        Object.keys(baseForm).length !== 0 &&
        this.baseFormPostApi &&
        this.baseFormPostApi !== ""
      ) {
        let bizKey = this.workDetail.bizKey;
        console.log(baseForm)
        let baseFormData = JSON.stringify(baseForm);
        let saveData = { bizKey, baseFormData };
        await saveBaseForm(this.baseFormPostApi, saveData).then((res) => {
          if (res.code !== 200) return false;
        });
      }
      /** 保存审批表单数据 */
      let approvalForm = this.$refs.baseForm.approvalForm;
      if (
        approvalForm &&
        Object.keys(approvalForm).length !== 0 &&
        this.approvalDataValue
      ) {
        let taskId = this.workDetail.id;
        let formId = this.approvalFormId;
        let formValueId = this.approvalDataValue.id;
        let formValue = JSON.stringify(this.$refs.baseForm.approvalForm);
        let data = { taskId, formId, formValueId, formValue };
      await  saveApproval(data).then((res) => {
          if (res.code !== 200) return false;
        });
      }
      /** 保存动态表单数据*/
      // console.log("this.$refs.dynamicForm1:" + this.$refs.dynamicForm1);
      // if (this.$refs.dynamicForm1) {
      //   let dform = this.$refs.dynamicForm1.formData;
      //   if (!dform && dform !== "") {
      //     console.log("res111---最终提交后端数据", dform);
      //     let taskId = this.workDetail.id;
      //     let formDataId = this.formPreView1.formId;
      //     let formDataValue = JSON.stringify(dform);
      //     let data = { taskId, formDataId, formDataValue };
      //     return saveTaskForm(data).then((res) => {
      //       if (res.code !== 200) return false;

      //       return true;
      //     });
      //   }
      // }
      if (!isSubmit) {
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.$parent.pageClose()
      }
      return true;
    },

    /** 提交表单 */
    async submitForm() {
      let _this = this
      let checkNormalForm = await this.$refs.baseForm.validataForm();
      console.log("基础表单校验结果", checkNormalForm);
      if (!checkNormalForm) {
        return Promise.reject(checkNormalForm)
      }
      let saveFormSuccess = await this.saveForm(true);
      if (!saveFormSuccess) return;
      /** 保存流程变量数据 */
      this.$refs.baseForm.saveChildVariables();
      let flowVariables = this.approvalVariables
        ? Object.assign(this.approvalVariables, this.bizFlowVariables)
        : this.bizFlowVariables;
      let taskId = this.workDetail.id;
      let data = {
        taskId,
        variables: flowVariables,
      };
      /** Reset Variables Store */
      this.$store.commit("work/UPDATE_APPROVAL_VARIABLES", null);
      this.$store.commit("work/UPDATE_BIZ_FLOW_VARIABLES", null);
      /** 调用提交任务接口 */
      await submitTaskForm(data, _this).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.GetToDoCont()
          this.$parent.pageClose()
        }
      });
    },
    // 取消执行
    cancelRequest () {
      this.cancelSubTask && this.cancelSubTask()
    }
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.hide {
  display: none;
}
</style>
