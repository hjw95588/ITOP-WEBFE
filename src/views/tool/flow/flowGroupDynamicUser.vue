<template>
  <div class="app-container">
    <el-row>
      <el-col :span="7" class="left-box">
        <flow-group-dynamic @groupItemClick="groupItemClick" />
      </el-col>
      <el-col :span="17" class="right-box">
        <!-- <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="组ID" prop="groupDynamicId">
            <el-input
              v-model="queryParams.groupDynamicId"
              placeholder="请输入组ID"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户ID" prop="userId">
            <el-input
              v-model="queryParams.userId"
              placeholder="请输入用户ID"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户姓名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门ID" prop="deptId">
            <el-input
              v-model="queryParams.deptId"
              placeholder="请输入部门ID"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              v-model="queryParams.deptName"
              placeholder="请输入部门名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
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
        </el-form> -->
        <div class="dataWrap">
          <el-row :gutter="10" class="fnButon">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['kylin:dynamicGroupUser:add']"
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
                v-hasPermi="['kylin:dynamicGroupUser:edit']"
                >修改</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['kylin:dynamicGroupUser:remove']"
                >删除</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['kylin:dynamicGroupUser:export']"
                >导出</el-button
              >
            </el-col>
          </el-row>
          <el-table
            v-loading="loading"
            :data="dynamicGroupUserList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="用户" align="center" prop="userName" />
            <el-table-column label="所在部门" align="center" prop="deptName" />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['kylin:dynamicGroupUser:edit']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['kylin:dynamicGroupUser:remove']"
                  >删除</el-button
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

        <!-- 添加或修改流程动态审批组用户关联对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" :append-to-body="true">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <!-- <el-form-item label="组ID" prop="groupDynamicId">
              <el-input
                v-model="form.groupDynamicId"
                placeholder="请输入组ID"
                style="width: 320px"
              />
            </el-form-item> -->
            <el-form-item label="用户" prop="userId">
              <el-input v-model="form.userName" readonly style="width: 278px" />
              <el-button
                type="success"
                size="small"
                icon="el-icon-search"
                @click="addFormUserList"
                >选择用户</el-button
              >
            </el-form-item>
            <el-form-item label="所在部门" prop="deptId">
              <tree-dept-select
                :isClose="open"
                :propValue.sync="form.depts"
                @selectUnit="selectUnit"
                :multiple="false"
                :disabled="false"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 树形图+表格分页弹窗[搜索+表格+分页]（开始） -->
        <tree-multi-select-table-dialog
          ref="treeSelecteGroupNameDialog"
          :title="treeSelectTableDialog.title"
          :visible.sync="treeSelectTableDialog.visible"
          :isMultipleChoice="treeSelectTableDialog.isMultipleChoice"
          :selectedUserList="treeSelectTableDialog.selectedUserList"
          @updateUserList="updateUserList"
        ></tree-multi-select-table-dialog>
        <!-- 树形图+表格分页弹窗[搜索+表格+分页]（结束） -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FlowGroupDynamic from "./components/flowGroupDynamic";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";
import TreeDeptSelect from "./components/treeDeptSelect";
import {
  listDynamicGroupUser,
  getDynamicGroupUser,
  delDynamicGroupUser,
  addDynamicGroupUser,
  updateDynamicGroupUser,
  exportDynamicGroupUser,
} from "@/api/process/dynamicGroupUser";

export default {
  components: { FlowGroupDynamic, TreeMultiSelectTableDialog, TreeDeptSelect },
  name: "DynamicGroupUser",
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
      // 流程动态审批组用户关联表格数据
      dynamicGroupUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupDynamicId: undefined,
        userId: undefined,
        userName: undefined,
        deptId: undefined,
        deptName: undefined,
      },
      groupItem: {
        groupDynamicId: undefined,
        groupDynamicName: undefined,
      },
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "选择人员",
        visible: false,
        isMultipleChoice: false, // 关联用户禁止多选
        width: "",
        selectedUserList: [], // "添加/编辑流程节点组---添加审批人员"弹窗的userList
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupDynamicId: [
          { required: true, message: "组ID不能为空", trigger: "blur" },
        ],
        userId: [{ required: true, message: "用户不能为空", trigger: "blur" }],
        deptId: [
          { required: true, message: "所在部门不能为空", trigger: "blur" },
        ],
      },
    };
  },
  filters: {
    userListFilter(userId) {
      console.log("userListFilter:" + userId);
      let arr = [];
      if (userId.length === 0) {
        return "-";
      }
      userId.map((item) => {
        arr.push(item.userName);
      });
      return arr.join(",");
    },
  },
  created() {
    this.getList();
  },
  methods: {
    groupItemClick(row) {
      // this.resetQuery();
      this.queryParams.groupDynamicId = row.groupDynamicId;
      this.groupItem.groupDynamicId = row.groupDynamicId;
      this.groupItem.groupDynamicName = row.groupDynamicName;
      console.log("右侧查询列表参数" + this.queryParams.groupDynamicId);
      this.getList();
      this.add = false;
    },
    /** 查询流程动态审批组用户关联列表 */
    getList() {
      this.loading = true;
      listDynamicGroupUser(this.queryParams).then((response) => {
        this.dynamicGroupUserList = response.rows;
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
      this.form = {
        groupDynamicUserId: undefined,
        groupDynamicId: undefined,
        userId: undefined,
        userName: undefined,
        deptId: undefined,
        deptName: undefined,
        depts: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.groupDynamicUserId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      if (this.groupItem.groupDynamicId != undefined) {
        this.reset();
        this.open = true;
        this.title = "添加流程动态审批组用户关联";
        this.form.groupDynamicId = this.groupItem.groupDynamicId;
        this.$set(this.form, "depts", null)
      } else {
        this.$message({
          showClose: true,
          message: `请先点击组名称`,
          type: 'error',
          duration: 1500
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const groupDynamicUserId = row.groupDynamicUserId || this.ids;
      getDynamicGroupUser(groupDynamicUserId).then((response) => {
        let resObj = response.data
        this.form = resObj
        this.$set(this.form, 'depts', {
          id: resObj.deptId,
          label: resObj.deptName
        })
        this.open = true;
        this.title = "修改流程动态审批组用户关联";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.groupDynamicUserId != undefined) {
            updateDynamicGroupUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDynamicGroupUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
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
      const groupDynamicUserIds = row.groupDynamicUserId || this.ids;
      this.$confirm(
        '是否确认删除流程动态审批组用户关联编号为"' +
          groupDynamicUserIds +
          '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDynamicGroupUser(groupDynamicUserIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有流程动态审批组用户关联数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDynamicGroupUser(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    // 添加“审批人员”
    addFormUserList() {
      this.$refs.treeSelecteGroupNameDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectTableDialog.selectedUserList = [];
        this.treeSelectTableDialog.visible = true;
      });
    },
    // 修改审批人员
    updateUserList(selectedUserList) {
      console.log("selectedUserList", selectedUserList);
      selectedUserList.forEach((item) => {
        this.form.userId = item.userId;
        this.form.userName = item.userName;
      });
    },
    /** 选择归属部门 */
    selectUnit(value) {
      console.log("selectUnit:",value)
      this.form.deptId = value.id;
      this.form.deptName = value.label;
    },
  },
};
</script>

<style lang="less" scoped>
.left-box {
  height: auto;
}
.right-box {
  height: auto;
  padding-left: 10px;
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