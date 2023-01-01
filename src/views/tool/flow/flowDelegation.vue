<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="queryRules"
      label-width="80px"
      class="queryParent"
      v-show="showSearch"
    >
      <el-form-item label="委托人" prop="assignerName">
        <el-input
          v-model="queryParams.assignerName"
          placeholder="请输入委托人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="流程Key" prop="flowKey">
        <el-input
          v-model="queryParams.flowKey"
          placeholder="请输入流程Key"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="state">
        <el-select
          v-model="queryParams.state"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option label="有效" value="0" />
          <el-option label="无效" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="searchWrapper">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="dataWrap">
      <el-row :gutter="10" class="fnButon">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['kylin:delegation:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['kylin:delegation:edit']"
            >修改</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['kylin:delegation:remove']"
            >删除</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-view"
            size="mini"
            :disabled="single"
            @click="handleView"
            v-hasPermi="['kylin:delegation:query']"
            >浏览</el-button
          >
        </el-col>
        <table-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns" />
      </el-row>

      <el-table
        v-loading="loading"
        :data="delegationList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="序号"
          align="center"
          prop="id"
          width="100"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="委托人"
          align="center"
          prop="assignerName"
          width="150"
          v-if="columns[1].visible"
        />
        <el-table-column
          label="代理人"
          align="center"
          prop="assignee"
          width="150"
          :formatter="assigneeData"
          v-if="columns[2].visible"
        />
        <el-table-column
          label="代理开始时间"
          align="center"
          prop="delegationStartTime"
          width="200"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.delegationStartTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="代理结束时间"
          align="center"
          prop="delegationEndTime"
          width="200"
          v-if="columns[4].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.delegationEndTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          </template>
        </el-table-column>
              <el-table-column
          label="发起时间"
          align="center"
          prop="createTime"
          width="200"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务流程" align="center" prop="flow" :formatter="flowData" v-if="columns[6].visible" />
        <el-table-column align="center" show-overflow-tooltip label="状态" min-width="40" v-if="columns[7].visible">
          <template slot-scope="scope">
            <span>{{ scope.row.state === '0' ? '有效' : '无效' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="280px"
          v-if="columns[8].visible"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['kylin:delegation:edit']"
              >修改</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['kylin:delegation:remove']"
              >删除</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              v-hasPermi="['kylin:delegation:query']"
              >浏览</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleDeleHistory(scope.row)"
              v-hasPermi="['kylin:delegationHistory:list']"
              >代理历史</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" :before-close="cancel" :append-to-body="true">
      <div>
        <el-form
          label-position="right"
          ref="flowAssignform"
          :model="formLabel"
          :rules="rules"
          label-width="120px"
          :disabled="disableFormLabel"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <!-- <el-col :span="10">
              <el-form-item label="代理编号" prop="delegationId">
                <el-input v-model="formLabel.id" :disabled="true" />
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="委托人" prop="assignerId">
                <el-tag
                  v-show="!!formLabel.assignerName"
                  style="margin-right: 10px; margin-bottom: 10px"
                  :closable="false"
                  :disable-transitions="false"
                >{{ formLabel.assignerName }}</el-tag>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-search"
                  @click="addAssignerList"
                  >选择用户</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代理人" prop="assigneeId">
                <el-tag
                  style="margin-right: 10px; margin-bottom: 10px"
                  :key="tag.assigneeId"
                  v-for="tag in formLabel.assigneeList"
                  :closable="!disableFormLabel"
                  :disable-transitions="false"
                  @close="handleCloseTagItem(tag)"
                >{{ tag.assigneeName }}</el-tag>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-search"
                  @click="addAssigneeList"
                  >选择用户</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="代理开始时间" prop="delegationStartTime">
                <el-date-picker
                  v-model="formLabel.delegationStartTime"
                  type="datetime"
                  placeholder="选择代理开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代理结束时间" prop="delegationEndTime">
                <el-date-picker
                  v-model="formLabel.delegationEndTime"
                  type="datetime"
                  placeholder="选择代理结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="业务流程" prop="flow">
                <el-select
                  v-model="formLabel.flow"
                  multiple
                  size="mini"
                  placeholder="请选择代理的业务流程"
                  class="flowDelegation"
                >
                  <el-option
                    v-for="(item, index) in formLabel.flowOptions"
                    :key="index"
                    :label="item.label"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="state">
                <el-radio-group v-model="formLabel.state">
                  <el-radio label="0">有效</el-radio>
                  <el-radio label="1">无效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="代理原因" prop="reason">
                <el-input
                  type="textarea"
                  v-model="formLabel.reason"
                  placeholder="请输入代理原因"
                  rows="6"
                  maxlength="300"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="!disableFormLabel" slot="footer" class="dialog-footer" style="padding-top: 20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div v-else slot="footer" class="dialog-footer" style="padding-top: 20px">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
    <tree-multi-select-table-dialog
      ref="treeSelectAssigner"
      :title="treeSelectAssignerDialog.title"
      :visible.sync="treeSelectAssignerDialog.visible"
      :isMultipleChoice="treeSelectAssignerDialog.isMultipleChoice"
      :selectedUserList="treeSelectAssignerDialog.assignerList"
      @updateUserList="updateAssignerList"
    ></tree-multi-select-table-dialog>
    <tree-multi-select-table-dialog
      ref="treeSelectAssignee"
      :title="treeSelectAssigneeDialog.title"
      :visible.sync="treeSelectAssigneeDialog.visible"
      :isMultipleChoice="treeSelectAssigneeDialog.isMultipleChoice"
      :selectedUserList="treeSelectAssigneeDialog.AssigneeList"
      @updateUserList="updateAssigneeList"
    ></tree-multi-select-table-dialog>
  </div>
</template>

<script>
import {
  list,
  get,
  add,
  update,
  getFlowData
} from "@/api/process/delegation";
import { _debounce, formateDateTime } from "@/utils/public";
import TreeMultiSelectTableDialog from "../../components/treeMultiSelectTableDialog/index.vue";
import deepClone from "clone-deep";
import { validateDate } from '@/utils/validate'
export default {
  name: "Delegation",
  components: {
    TreeMultiSelectTableDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      delegationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        assignerName: undefined,
        flowKey: undefined,
        state: undefined,
      },
      /**查询条件校验 */
      queryRules: {

        createBy: [
          { validator: this.$validateSpecialCharacters, trigger: "blur" },
        ],
      },
      disableFormLabel: false, // 是否禁用表单
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
      { key: 0, label: `代理编号`, visible: false },
      { key: 1, label: `委托人`, visible: true },
      { key: 2, label: `代理人`, visible: true },
      { key: 3, label: `代理开始时间`, visible: true },
      { key: 4, label: `代理结束时间`, visible: true },
      { key: 5, label: `发起时间`, visible: true },
      { key: 6, label: `业务流程`, visible: true },
      { key: 7, label: `状态`, visible: true },
      { key: 8, label: `操作`, visible: true }
      ],
      // 表单参数
      formLabel: {
        id: "",
        assignerId: "", // 委托人
        assignerName: "", 
        delegationStartTime: '', // 代理开始时间
        delegationEndTime: '', // 代理结束时间
        assigneeList: [], // 代理人列表
        state: '',
        reason: '',
        flow: [], // 流程Id集合
        flowOptions: [],
      },
      assignFolwId: null, // 被代理流程ID
      // 表单校验
      rules: {

        assignerId: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        assigneeList: [
          { type: 'array', required: true, message: "不能为空", trigger: "blur" },
        ],
        delegationStartTime: [{ required: true, message: "不能为空", trigger: "blur" }],
        delegationEndTime: [{ required: true, message: "不能为空", trigger: "blur" },
          { validator: (rule, value, cb) => validateDate(rule, value, cb, this.formLabel.delegationStartTime),
            message: '代理结束时间不能小于开始时间', trigger: 'blur'
          }
        ],
        flow: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      treeSelectAssignerDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        isMultipleChoice: false, // 委托人单选
        assignerList: [], 
      },
      treeSelectAssigneeDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        isMultipleChoice: true, // 被受托人多选,待修改
        AssigneeList: [], 
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.delegationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      // 表单参数
      this.formLabel = {
        id: "",
        assignerId: "", // 委托人
        assignerName: "", 
        delegationStartTime: '', // 代理开始时间
        delegationEndTime: '', // 代理结束时间
        assigneeList: [], // 代理人列表
        state: '',
        reason: '',
        flow: [], // 流程Id集合
        flowOptions: [],
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valide) => {
        if (valide) {
          this.queryParams.pageNum = 1;
          this.getList();
        } else {
          return valide;
        }
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 删除弹窗中的审批人员
    handleCloseTagItem(tag) {
      let index = this.formLabel.assigneeList.findIndex(
        (item) => item.userId === tag.userId
      );
      this.formLabel.assigneeList.splice(index, 1);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.disableFormLabel = false
      this.reset();
      this.assignFolwId = null
      this.open = true;
      this.title = "新增流程代理";
      this.getData();
      this.formLabel.status = "0";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.disableFormLabel = false
      this.reset();
      this.getData();
      const delegationId = row.id || this.ids;
      this.assignFolwId = row.id
      this.getAssignData(delegationId)
      this.title = "修改流程代理";
    },
    /** 浏览按钮操作 */
    handleView(row) {
      this.disableFormLabel = true
      this.reset();
      this.getData();
      const delegationId = row.id || this.ids;
      this.getAssignData(delegationId)
      this.title = "浏览流程代理";
    },
    /** 查看代理历史 */
    handleDeleHistory (row) {
      const id = row.id
      this.$router.push({
        path: '/delegation/flowDelegationHistory',
        query: { deleGationId: id }
      })
    },
    /** 获取代理详细数据 */
    getAssignData (delegationId) {
      get(delegationId).then((response) => {
        this.formLabel.id = response.data.id;
        this.formLabel.delegationStartTime = response.data.delegationStartTime;
        this.formLabel.delegationEndTime = response.data.delegationEndTime;
        this.formLabel.assignerName = response.data.assignerName;
        this.formLabel.assignerId = response.data.assignerId;
        this.formLabel.assigneeList = response.data.assignee; // 代理人列表
        this.formLabel.state = response.data.state;
        this.formLabel.reason = response.data.reason;
        this.formLabel.flow = response.data.flow.map(item => ({
          value: item.flowKey,
          label: item.flowName
        }))
        this.open = true;
        //this.title = "浏览";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["flowAssignform"].validate(valid => {
        if (valid) {
          let assigneeId = [];
          let flowKey = [];
          let flows = this.formLabel.flow;
          flows.forEach((f) => {
            flowKey.push(f.value)
          });
          // let delegationStartTime = formateDateTime(this.formLabel.delegationStartTime)
          // let delegationEndTime = formateDateTime(this.formLabel.delegationEndTime)
          let delegationStartTime = this.formLabel.delegationStartTime;
          let delegationEndTime = this.formLabel.delegationEndTime;
          console.log(this.formLabel.assigneeList)
          this.formLabel.assigneeList.forEach(item => {
            assigneeId.push(item.assigneeId)
          })
          let { assignerId, state, reason, id } = this.formLabel;
          let postData = { id, assignerId, delegationStartTime, delegationEndTime, state, reason, assigneeId, flowKey };
          if (this.assignFolwId !== null) {
            update(postData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
                this.reset()
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            add(postData).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                this.reset()
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const delegationIds = row.id || this.ids;
      this.$confirm('是否确认删除编号为"' + delegationIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return del(delegationIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    async getData() {
      await this.getFlow();
    },
    /** 获取流程数据 */
    getFlow() {
      getFlowData().then((res) => {
        if (res.code === 200) {
          this.formLabel.flowOptions = res.rows.map((item) => ({
            value: item.flowKey,
            label: item.flowName,
          }));
        }
      });
    },
    /**选择委托人 */
    addAssignerList() {
      this.$refs.treeSelectAssigner.resetPage();
      this.$nextTick(() => {
        this.treeSelectAssignerDialog.visible = true;
      });
    },
    updateAssignerList(selectedUserList) {
      //console.log("selectedUserList", selectedUserList);
      selectedUserList.forEach((item) => {
        this.formLabel.assignerId = item.userId;
        this.formLabel.assignerName = item.userName;
      });
    },
    /**选择被受托人 */
    addAssigneeList() {
      this.$refs.treeSelectAssignee.resetPage();
      this.$nextTick(() => {
        const cloneAssignList = deepClone(this.formLabel.assigneeList)
        this.treeSelectAssigneeDialog.AssigneeList = cloneAssignList.map(item => ({
          userId: item.assigneeId,
          userName: item.assigneeName
        }))
        this.treeSelectAssigneeDialog.visible = true;
      });
    },
    // 修改受托人
    updateAssigneeList(selectedUserList) {
      this.formLabel.assigneeList = selectedUserList.map(item =>({
        assigneeId: item.userId,
        assigneeName: item.userName
      }))
      //console.log("selectedUserList", selectedUserList);
      // selectedUserList.forEach((item) => {
      //   this.formLabel.assigneeId = item.userId;
      //   this.formLabel.assigneeName = item.userName;
      // });
    },

    assigneeData(row){
      let arr = []
      row.assignee.forEach((item, index)=>{
        if (index > 2) {
          return
        }
        arr.push(item.assigneeName);
      })
      return arr.join(',')
    },
    flowData(row){
      let arr = []
      row.flow.forEach((item, index)=>{
        if (index > 2) {
          return
        }
        arr.push(item.flowName);
      })
      return arr.join(',')
    },

  },
};
</script>

<style lang="scss" scoped>
      ::v-deep .el-tag.el-tag--info { font-size: 14px !important; line-height: 30px !important;}
     ::v-deep .el-input--suffix .el-input__inner { min-height: 36px !important; padding-top: 4px !important; padding-bottom: 4px !important;}
    .flowDelegation { width: 220px; }
</style>