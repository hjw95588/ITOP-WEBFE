<template>
  <div class="app-container">
    <el-row class="groupWrap" :gutter="20" style="margin-left: 0;">
      <el-col :span="5" class="lightgreen-box">
        <el-tree
          lazy
          :load="treeLoadNode"
          :props="treeProps"
          :highlight-current="true"
          node-key="id"
          :default-expanded-keys="['0000000000']"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="19" class="orange-box">
        <el-form
          class="queryParent"
          ref="queryForm"
          :model="listQuery"
          label-width="80px"
          v-show="showSearch"
        >
          <el-form-item label="表单名称 " prop="controlName" class="el-item-two">
            <el-input
              v-model.trim="listQuery.controlName"
              placeholder="请输入表单名称 "
            />
          </el-form-item>
          <el-form-item label="表单类型" prop="formType" class="el-item-two">
            <el-select
              v-model="listQuery.formType"
              placeholder="请输入表单类型"
            >
              <el-option
                v-for="dict in formTypeOptions"
                :key="dict.val"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="el-item-two">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getList"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button>
              <!-- <el-button type="text" v-stowExpand="['controlflowFormQuery']"
          >{{controlflowFormQuery ? '收起' : '展开'}}<i :class="[controlflowFormQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down', 'el-icon--right']"></i></el-button> -->
          </el-form-item>
        </el-form>
        <div class="dataWrap">
          <el-row :gutter="10" class="fnButon">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleCreate"
                v-hasPermi="['kylin:formdata:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                v-hasPermi="['kylin:formdata:edit']"
                @click="handleUpdate(null)"
                >修改</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
                :disabled="single || jsonFormType"
                @click="showFormDesign(null)"
                >设计</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                :disabled="single || jsonFormType"
                v-hasPermi="['kylin:formdata:query']"
                @click="handlePreview(null)"
                >预览</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['kylin:formdata:remove']"
                >删除</el-button
              >
            </el-col>
            <table-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns" />
          </el-row>
          <el-table
            v-loading="listLoading"
            :data="list"
            size="mini"
            element-loading-text="Loading"
            fit
            border
            highlight-current-row
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column align="center" prop="id" label="表单ID" width="95" v-if="columns[0].visible" />
            <el-table-column label="表单Key " prop="formKey" align="center" v-if="columns[1].visible" />
            <el-table-column
              label="表单名称 "
              prop="controlName"
              align="center"
              v-if="columns[2].visible"
            />
            <el-table-column label="表单类型 " prop="formType" align="center" v-if="columns[3].visible">
              <template slot-scope="scope">
                <span>{{ scope.row.formType | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" v-if="columns[4].visible">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="mini"
                  v-hasPermi="['kylin:formdata:edit']"
                  @click="handleUpdate(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-setting"
                  size="mini"
                  :disabled="scope.row.formType !== '1'"
                  @click="showFormDesign(scope.row)"
                  >设计</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-view"
                  size="mini"
                  :disabled="scope.row.formType !== '1'"
                  v-hasPermi="['kylin:formdata:query']"
                  @click="handlePreview(scope.row)"
                  >预览</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 创建弹窗（开始） -->
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="45%"
      @close="handleDialogClose"
      :append-to-body="true"
    >
      <el-form
        ref="dataForm"
        :model="form"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="表单KEY :" prop="formKey">
          <el-input v-model="form.formKey" placeholder="请输入表单KEY " />
        </el-form-item> -->
        <el-form-item label="表单名称 :" prop="controlName">
          <el-input v-model.trim="form.controlName" placeholder="请输入表单名称 " />
        </el-form-item>
        <el-form-item v-if="true" label="表单类型 :" prop="formType">
          <el-radio-group v-model="form.formType">
            <el-radio label="0">业务表单-原生</el-radio>
            <el-radio label="1">动态表单-JSON</el-radio>
            <el-radio label="2">通用表单-审批</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.formType == '0'"
          label="查询API :"
          prop="selectUrl"
        >
          <el-input v-model.trim="form.selectUrl" placeholder="请输入查询API " />
        </el-form-item>
        <el-form-item
          v-if="form.formType == '0'"
          label="保存API :"
          prop="submitUrl"
        >
          <el-input v-model.trim="form.submitUrl" placeholder="请输入保存API " />
        </el-form-item>
        <el-form-item
          v-if="form.formType == '0'"
          label="业务表单ID :"
          prop="router"
        >
          <el-input
            v-model.trim="form.router"
            placeholder="请输入业务表单ID(Vue组件ID) "
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 创建弹窗（结束） -->

    <!-- 编辑弹窗（开始） -->
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="45%"
      @close="handleDialogClose"
      :append-to-body="true"
    >
      <el-form
        ref="updateDataForm"
        :model="updateForm"
        :rules="updateRules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <!-- <el-form-item v-if="true" label="表单KEY :" prop="formKey">
          <el-input v-model="updateForm.formKey" placeholder="请输入表单KEY " />
        </el-form-item> -->
        <el-form-item label="表单名称 :" prop="controlName">
          <el-input
            v-model.trim="updateForm.controlName"
            placeholder="请输入表单名称 "
          />
        </el-form-item>
        <el-form-item v-if="true" label="表单类型 :" prop="formType">
          <el-radio-group v-model="updateForm.formType">
            <el-radio label="0">业务表单-原生</el-radio>
            <el-radio label="1">动态表单-JSON</el-radio>
            <el-radio label="2">通用表单-审批</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="updateForm.formType == '0'"
          label="查询API :"
          prop="selectUrl"
        >
          <el-input
            v-model.trim="updateForm.selectUrl"
            placeholder="请输入查询API "
          />
        </el-form-item>
        <el-form-item
          v-if="updateForm.formType == '0'"
          label="保存API :"
          prop="submitUrl"
        >
          <el-input
            v-model.trim="updateForm.submitUrl"
            placeholder="请输入保存API "
          />
        </el-form-item>
        <el-form-item
          v-if="updateForm.formType == '0'"
          label="业务表单ID :"
          prop="router"
        >
          <el-input
            v-model.trim="updateForm.router"
            placeholder="请输入业务表单ID(Vue组件ID) "
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="updateDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹窗（结束） -->

    <!-- 预览弹窗（开始） -->
    <el-dialog
      v-if="formPreViewDialog.visible"
      :title="formPreViewDialog.title"
      :visible.sync="formPreViewDialog.visible"
      :width="formPreViewDialog.width"
      :fullscreen="formPreViewDialog.fullscreen"
      :close-on-press-escape="formPreViewDialog.closeOnPressEscape"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      center
    >
      <PreFormView
        ref="preFormView"
        :form-info.sync="formPreViewDialog.data"
        :width="formPreViewDialog.width"
        @closePreViewDialog="closePreViewDialog"
      />
    </el-dialog>
    <!-- 预览弹窗（结束） -->

    <!-- 设计弹窗（开始） -->
    <el-dialog
      v-if="formDesignDialog.visible"
      :title.sync="formDesignDialog.title"
      :visible.sync="formDesignDialog.visible"
      :width="formDesignDialog.width"
      :fullscreen="formDesignDialog.fullscreen"
      :close-on-press-escape="formDesignDialog.closeOnPressEscape"
      :modal-append-to-body="false"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
      @close="closeFormDesignDialog"
    >
      <BpmFormDesign
        v-if="formDesignDialog.visible"
        ref="bpmFormDesign"
        :form-info.sync="formDesignDialog.data"
        @queryList="getList"
        @closeFormDesignDialog="closeFormDesignDialog"
      />
    </el-dialog>
    <!-- 设计弹窗（结束） -->
  </div>
</template>

<script>
import { getBriefProcessListPage } from "@/api/process/processList";
import PreFormView from "@/components/PreFormView";
import BpmFormDesign from "@/components/BpmFormDesign";
import { getFormList, saveForm, updateForm, deleteById } from "@/api/tool/form";

export default {
  name: "FlowForm",
  components: { PreFormView, BpmFormDesign },
  data() {
    return {
      controlflowFormQuery: false,
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        businessKey: "",
        pageNum: 1,
        pageSize: 10,
        controlName: "",
        formType: "",
      },
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
      { key: 0, label: `表单ID`, visible: true },
      { key: 1, label: `表单Key`, visible: true },
      { key: 2, label: `表单名称`, visible: true },
      { key: 3, label: `表单类型`, visible: true },
      { key: 4, label: `操作`, visible: true },
      ],
      // 表单类型数据字典
      formTypeOptions: [
        { label: "业务表单-原生", value: "0" },
        { label: "动态表单-JSON", value: "1" },
        { label: "通用表单-审批", value: "2" },
      ],
      // 流程树形图
      treeProps: {
        label: "flowName",
        isLeaf: "leaf",
      },
      // 表格中选中的元素
      tableSelectArr: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // json表单禁用
      jsonFormType: false,
      // 弹窗
      titleMap: {
        update: "编辑",
        create: "创建",
      },
      dialogStatus: "",
      dialogVisible: false,
      form: {
        controlName: "", // 表单名称
        formType: "1",
        formType: "",
        selectUrl: "",
        submitUrl: "",
        router: "",
      },
      rules: {
        controlName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          { max: 20, message: '表单名称最多输入20个字符' }
        ],
        selectUrl: [
          { max: 50, message: '查询API最多输入50个字符' }
        ],
        formType: [
          { required: true, message: "请选择表单类型", trigger: "blur" },
        ],
        submitUrl: [
          { max: 50, message: '保存API最多输入50个字符' }
        ],
        router: [
          {
            required: true,
            message: "请输入业务表单ID(Vue组件ID)",
            trigger: "blur",
          },
          { max: 50, message: '请输入业务表单ID最多输入50个字符' }
        ],
      },
      updateDialogVisible: false,
      updateForm: {
        id: "", // 表单id
        controlName: "", // 表单名称
        formType: "",
        selectUrl: "",
        submitUrl: "",
        router: "",
      },
      updateRules: {
        controlName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          { max: 20, message: '用户编码最多输入20个字符' }
        ],
        formType: [
          { required: true, message: "请输入表单类型", trigger: "blur" },
        ],
        selectUrl: [
          { max: 50, message: '查询API最多输入50个字符' }
        ],
        submitUrl: [
          { max: 50, message: '保存API最多输入50个字符' }
        ],
        router: [
          {
            required: true,
            message: "请输入业务表单ID(Vue组件ID)",
            trigger: "blur",
          },
          { max: 50, message: '请输入业务表单ID最多输入50个字符' }
        ],
      },
      formPreViewDialog: {
        title: "预览",
        visible: false,
        width: "850",
        name: "预览", // 组件名,
        loading: false,
        fullscreen: false,
        closeOnPressEscape: false,
        data: "", // 预览时该条数据相关内容
      },
      formDesignDialog: {
        title: "表单设计器",
        visible: false,
        width: "",
        name: "表单设计器", // 组件名,
        loading: false,
        fullscreen: true,
        closeOnPressEscape: false,
      },
    };
  },
  filters: {
    typeFilter(formType) {
      if (formType === "" || formType === undefined || formType === null) {
        return "";
      }
      const formTypeMap = {
        0: "业务表单-原生",
        1: "动态表单-JSON",
        2: "通用表单-审批",
      };
      return formTypeMap[formType];
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 加载节点数据
    treeLoadNode(node, resolve) {
      // console.log("动态加载树形数据", node, resolve);
      // 如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.eltreeLoadfirstnode(resolve);
      }
      // 如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level === 1) {
        this.eltreeLoadchildnode(node, resolve);
      }
    },
    /** el-tree初始化一级节点 */
    eltreeLoadfirstnode(resolve) {
      return resolve([
        {
          id: "0000000000",
          flowName: "科技管理流程",
        },
      ]);
    },
    /** el-tree加载节点的子节点集合 */
    eltreeLoadchildnode(node, resolve) {
      getBriefProcessListPage({}).then((res) => {
        // console.log("查询二级节点", res);
        let list = res.rows;
        list.forEach((item) => {
          // 设置为叶子节点
          item["leaf"] = true;
        });
        return resolve(list);
      });
    },
    /** 点击el-tree树节点更新用户列表 */
    handleNodeClick(data) {
      // console.log("点击每个叶子节点", data);
      let businessKey = data.id === "0000000000" ? "" : data.flowKey;
      this.listQuery.businessKey = businessKey;
      this.getList();
    },
    /** 查询流程节点组列表 */
    getList() {
      this.listLoading = true;
      getFormList(this.listQuery)
        .then((res) => {
          this.list = res.rows;
          this.total = res.total;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          console.log(err);
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // console.log("执行重置");
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // console.log("选中的条数", selection);
      this.tableSelectArr = selection;
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if (selection.length == 1) {
        this.jsonFormType = selection[0].formType == "0";
      }
    },
    resetForm() {
      this.form = {
        formKey: "", // 表单KEY
        controlName: "", // 表单名称
        formType: "",
      };
    },
    handleCreate() {
      if (!this.listQuery.businessKey) {
        this.msgError("请优先选择一条流程！");
        return;
      }
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogVisible = true;
    },
    submitForm() {
      const _this = this;
      const refForm =
        _this.dialogStatus === "create" ? "dataForm" : "updateDataForm";
      _this.$refs[`${refForm}`].validate((valid) => {
        if (valid) {
          if (_this.dialogStatus === "create") {
            if (!this.listQuery.businessKey) {
              this.msgError("请优先选择一条流程！");
              return;
            }
          }
          this.$confirm("确定操作吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(function () {
            if (_this.dialogStatus === "create") {
              let { controlName, formType, selectUrl, submitUrl, router } =
                _this.form;
              let postData = {
                businessKey: _this.listQuery.businessKey,
                controlName,
                formType,
                selectUrl,
                submitUrl,
                router,
              };
              saveForm(postData)
                .then((response) => {
                  if (response.code === 200) {
                    _this.getList();
                    _this.$message.success(response.msg);
                    _this.dialogVisible = false;
                  } else {
                    _this.$message.error(response.msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              let { id, controlName, formType, selectUrl, submitUrl, router } =
                _this.updateForm;
              let businessKey = _this.listQuery.businessKey;
              let putData = {
                businessKey,
                id,
                controlName,
                formType,
                selectUrl,
                submitUrl,
                router,
              };
              updateForm(putData)
                .then((response) => {
                  if (response.code === 200) {
                    _this.getList();
                    _this.$message.success(response.msg);
                    _this.updateDialogVisible = false;
                  } else {
                    _this.$message.error(response.msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        }
      });
    },
    // 监听dialog关闭时的处理事件
    handleDialogClose() {
      const refForm =
        this.dialogStatus === "create" ? "dataForm" : "updateDataForm";
      if (this.$refs[[`${refForm}`]]) {
        this.$refs[[`${refForm}`]].clearValidate(); // 清除整个表单的校验
      }
    },
    // “编辑”
    handleUpdate(rows) {
      let row = !!rows ? rows : this.tableSelectArr[0];
      this.updateForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.updateDialogVisible = true;
    },
    // “预览”
    handlePreview(rows) {
      let row = !!rows ? rows : this.tableSelectArr[0];
      // 打开预览模态框
      let formData =
        '{"config":{"labelPosition":"right","labelWidth":30,"autoLabelWidth":false},"list":[{"type":"input","label":"姓名","options":{"label":"输入框","minWidth":10,"width":100,"defaultValue":"","placeholder":"请输入","clearable":false,"hidden":false,"disabled":false,"customStyle":"","dynamicFun":"","eventName":"change","eventNameOptions":[{"label":"change","value":"change"},{"label":"click","value":"click"},{"label":"blur","value":"blur"},{"label":"dblclick","value":"dblclick"},{"label":"focus","value":"focus"},{"label":"mouseout","value":"mouseout"},{"label":"mouseover","value":"mouseover"},{"label":"submit","value":"submit"},{"label":"reset","value":"reset"}]},"model":"input_1620370546376","key":"input_1620370546376","rules":[{"required":false,"message":"必填项","trigger":"blur"}]},{"type":"text","label":"意见反馈","options":{"minWidth":10,"width":100,"height":3,"defaultValue":"","placeholder":"请输入","clearable":false,"hidden":false,"disabled":false,"customStyle":"","dynamicFun":"","eventName":"change","eventNameOptions":[{"label":"change","value":"change"},{"label":"click","value":"click"},{"label":"blur","value":"blur"},{"label":"dblclick","value":"dblclick"},{"label":"focus","value":"focus"},{"label":"mouseout","value":"mouseout"},{"label":"mouseover","value":"mouseover"},{"label":"submit","value":"submit"},{"label":"reset","value":"reset"}]},"model":"text_1620370565863","key":"text_1620370565863","rules":[{"required":false,"message":"必填项","trigger":"blur"}]},{"type":"radio","label":"最终审批结果最终审批","options":{"disabled":false,"hidden":false,"clearable":false,"defaultValue":null,"dynamicKey":"","dynamic":false,"options":[{"value":"1","label":"通过"},{"value":"2","label":"不通过"}],"width":100,"customStyle":"","dynamicFun":"","eventName":"change","eventNameOptions":[{"label":"change","value":"change"},{"label":"click","value":"click"},{"label":"blur","value":"blur"},{"label":"dblclick","value":"dblclick"},{"label":"focus","value":"focus"},{"label":"mouseout","value":"mouseout"},{"label":"mouseover","value":"mouseover"},{"label":"submit","value":"submit"},{"label":"reset","value":"reset"}]},"model":"radio_1620370596636","key":"radio_1620370596636","rules":[{"required":false,"message":"必填项","trigger":"blur"}]}],"dynamicKeyList":[]}';
      row.formData = formData;
      // console.log("预览时没一条的元素", row);
      this.formPreViewDialog.data = row;
      this.formPreViewDialog.visible = true;
    },
    closePreViewDialog() {
      this.formPreViewDialog.visible = false;
    },
    // "设计"
    showFormDesign(rows) {
      let row = !!rows ? rows : this.tableSelectArr[0];
      // console.log("点击设计按钮", row);
      this.formDesignDialog.data = row;
      this.formDesignDialog.visible = true;
    },
    handleClose(done) {
      this.$confirm(this.$t("action.confirmClose"))
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    closeFormDesignDialog() {
      this.$nextTick(() => {
        this.formDesignDialog.visible = false;
      });
    },
    // 删除
    handleDelete() {
      const ids = this.ids;
      let _this = this;
      this.$confirm('是否确认删除表单id为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        deleteById(ids).then((response) => {
          if (response.code === 200) {
            _this.getList();
            _this.$message.success(response.msg);
          } else {
            _this.$message.error(response.msg);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.groupWrap { display: flex; justify-content: space-between;}
.lightgreen-box {
  padding: 5px;
  height: auto;
  background: #fff;
}
.orange-box {
  height: auto;
}
.user-list {
  display: flex;
  font-size: 14px;
  color: #606266;
  line-height: 36px;
  .label {
    font-weight: 700;
    width: 80px;
    display: inline-block;
    text-align: right;
    padding-right: 10px;
  }
  .user-list-right {
    width: 380px;
  }
}
</style>
