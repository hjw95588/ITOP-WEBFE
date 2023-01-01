<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form
      class="queryParent"
      label-position="right"
      ref="ruleForm"
      label-width="80px"
      :model="formLabelAlign"
      v-show="showSearch"
    >
      <el-form-item label="部门名称:" prop="deptName" class="el-item-two">
        <el-input
          v-model.trim="formLabelAlign.deptName"
          size="small"
          placeholder="请输入部门名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status" class="el-item-two">
        <el-select
          v-model="formLabelAlign.status"
          size="small"
          placeholder="部门状态"
        >
          <el-option label="正常" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="searchWrapper">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="conditionSubmit(1)"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetForm('ruleForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="dataWrap">
      <!-- 部门列表 -->
      <div class="fnButon">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="mini"
          v-hasPermi="['system:dept:add']"
          @click="openDialog('add2')"
          >新增</el-button
        >
        <table-toolbar :showSearch.sync="showSearch" @queryTable="resetForm('ruleForm')" :columns="columns" />
      </div>
      <el-table
        :data="tableData"
        row-key="deptId"
        :expand-row-keys="['0000000000']"
        v-if="tableFlag"
        lazy
        :load="tableLoadchildnode"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%;"
      >
        <el-table-column
          show-overflow-tooltip
          label="部门名称"
          prop="deptName"
          min-width="300"
          v-if="columns[0].visible"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="部门ID"
          prop="deptId"
          min-width="300"
          v-if="columns[1].visible"
        ></el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="120" v-if="columns[2].visible">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">正常</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="operate" width="400" v-if="columns[3].visible">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="mini"
              v-hasPermi="['system:dept:edit']"
              @click="openDialog('edit', scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-plus"
              size="mini"
              v-hasPermi="['system:dept:add']"
              @click="openDialog('add1', scope.row)"
              >新增</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              v-hasPermi="['system:dept:remove']"
              @click="onDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              icon="el-icon-view"
              size="mini"
              v-hasPermi="['system:dept:query']"
              @click="checkInfo(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="(formLabelAlign.deptName || formLabelAlign.status) && searchFlag"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增/编辑/预览弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      width="750px"
      :append-to-body="true"
    >
      <div style="padding-right: 20px">
        <el-form
          label-position="right"
          ref="dialogForm"
          :rules="rules"
          label-width="85px"
          :disabled="dialogType === 'preview'"
          :model="dialogFormLabel"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                v-if="
                  !(
                    dialogFormLabel.deptId === '0000000000' && (dialogType === 'edit' || dialogType === 'preview')
                  )
                "
                label="上级部门"
                prop="parent"
              >
                <Treeselect
                  :disabled="dialogType === 'preview'"
                  :propValue.sync="dialogFormLabel.parent"
                  @selectUnit="selectUnit"
                ></Treeselect>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门ID" prop="deptId">
                <el-input
                  type="text"
                  :disabled="title === '修改部门'"
                  v-model.trim="dialogFormLabel.deptId"
                  size="small"
                  placeholder="请输入部门ID"
                  :validate-event="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="部门名称:" prop="deptName">
                <el-input
                  type="text"
                  v-model.trim="dialogFormLabel.deptName"
                  size="small"
                  placeholder="请输入部门名称"
                  :validate-event="true"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item label="负责人:" prop="leader">
                <el-input
                  v-model.trim="dialogFormLabel.leader"
                  size="small"
                  placeholder="请选择负责人"
                  readonly
                  style="width: 148px"
                ></el-input>
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-search"
                  @click="addFormUserList"
                  >选择用户</el-button
                >
              </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="部门状态:" prop="status">
                <el-radio v-model="dialogFormLabel.status" label="0"
                  >正常</el-radio
                >
                <el-radio v-model="dialogFormLabel.status" label="1"
                  >停用</el-radio
                >
              </el-form-item></el-col
            >
            <el-col :span="12"></el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" v-if="dialogType !== 'preview'" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('dialogForm')"
          size="medium"
          >提交</el-button
        >
        <el-button @click="cancle('dialogForm')" size="medium">取消</el-button>
      </span>
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
  </div>
</template>

<script>
import request from "@/utils/request";
import Treeselect from "../../components/Treeselect/index";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";

export default {
  name: "",
  components: {
    Treeselect,
    TreeMultiSelectTableDialog
  },
  props: ["content_height"],
  data() {
    return {
      // 控制搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `部门名称`, visible: true },
        { key: 1, label: `部门ID`, visible: true },
        { key: 2, label: `状态`, visible: true },
        { key: 3, label: `操作`, visible: true }
      ],
      /** form */
      formLabelAlign: {
        deptName: "",
        status: ""
      },
      searchFlag: false,

      /** table */
      tableFlag: true,
      tableData: [],

      /** 分页 */
      currentPage: 1,
      pageSize: 10,
      total: 1,

      /** dialog */
      title: "添加部门",
      dialogType: "add",
      dialogVisible: false,
      dialogFormLabel: {
        // parentId: null, // 上级部门ID
        // parentName: "", // 上级部门名称
        parent: null, // 上级部门

        deptName: "", // 部门名称
        deptId: "", // 部门id

        leader: "", // 负责人
        phone: "", // 联系电话
        email: "", // 邮箱
        status: "0" // 部门状态0-正常 1-停用
      },
      rules: {
        parent: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { max: 30, message: '部门名称最多输入30个字符' }
        ],
        deptId: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { pattern: /^[0-9]*$/g, message: '部门ID只能输入数字', trigger: 'blur' }
        ],
        phone: [
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ]
      },
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        isMultipleChoice: false, // 负责人禁止多选
        selectedUserList: [], // "添加/编辑流程节点组---添加审批人员"弹窗的userList
      }
    };
  },
  created() {
    this.tableLoadfirstnode();
  },
  methods: {
    conditionSubmit (num) {
      this.onSubmit(num);
    },
    /** 查询 */
    onSubmit(pageNum) {
      if (
        this.formLabelAlign.deptName === "" &&
        this.formLabelAlign.status === ""
      ) {
        this.tableLoadfirstnode();
      } else {
        this.searchFlag = true;
        this.currentPage = pageNum
        let params = {};
        params.deptName = this.formLabelAlign.deptName;
        params.status = this.formLabelAlign.status;
        params.pageNum = this.currentPage - 1;
        params.pageSize = this.pageSize;
        request({
          url: "/system/dept/list",
          method: "GET",
          params
        }).then(res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
      }
    },
    /** 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.searchFlag = false;
      this.tableLoadfirstnode();
    },

    /** table初始化一级节点 */
    tableLoadfirstnode() {
      let $this = this;
      request({
        url: "/system/dept/parentNode",
        method: "GET"
      }).then(res => {
        if (res.code === 200) {
          res.data.hasChildren = !res.data.leaf;
          this.tableData = [res.data];
          this.$nextTick(() => {
            document.getElementsByClassName('el-table__expand-icon')[0].click()
          })
        } else {
          this.$message({
            type: "error",
            message: "获取根节点部门失败!"
          });
        }
      });
    },

    /** table加载节点的子节点集合 */
    tableLoadchildnode(tree, treeNode, resolve) {
      request({
        url: `/system/dept/find/${tree.deptId}`,
        method: "GET"
      }).then(res => {
        if (res.code === 200) {
          let childrenData = res.data;

          for (let i = 0; i < childrenData.length; i++) {
            childrenData[i].hasChildren = !childrenData[i].leaf;
          }

          return resolve(childrenData);
        } else {
          this.$message({
            type: "error",
            message: "获取子部门树失败!"
          });
        }
      });
    },

    /** 双击预览 */
    checkInfo(row) {
      this.openDialog("preview", row);
    },

    /** 删除 */
    onDelete(row) {
      this.$confirm(`是否确认删除?`, "警告", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableFlag = false;
          request({
            url: `/system/dept/${row.deptId}`,
            method: "DELETE"
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: `${res.msg}!`
              });
              this.tableFlag = true
              this.tableLoadfirstnode();
            } else {
              this.$message({
                type: "error",
                message: `${res.msg}!`
              });
            }
          }).catch(error => {
            this.tableFlag = true
          });
        })
        .catch(() => {});
    },

    /** 每页条数改变 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSubmit(1);
    },

    /** 当前页改变 */
    handleCurrentChange(val) {
      this.onSubmit(val);
    },

    /** 新增/编辑/预览弹窗 */
    openDialog(flag, row) {
      /**
       * flag=add1为在表格上点击新增按钮
       * flag=add2为直接点击新增按钮
       * flag=edit为编辑
       * flag=preview为预览
       */
      this.dialogType = flag;
      this.dialogVisible = true;
      if (flag === "edit" || flag === "preview") {
        this.title = flag === "edit" ? "修改部门" : "预览";
        // this.dialogFormLabel.parentId = row.parentId;
        // this.dialogFormLabel.parentName = row.parentName;
        this.dialogFormLabel.parent = {
          label: row.parentName,
          id: row.parentId
        };
        this.dialogFormLabel.deptName = row.deptName;
        this.dialogFormLabel.deptId = row.deptId;
        this.dialogFormLabel.leader = row.leader;
        this.dialogFormLabel.phone = row.phone;
        this.dialogFormLabel.email = row.email;
        this.dialogFormLabel.status = row.status;
      } else {
        this.title = "添加部门";
        this.dialogFormLabel.deptName = "";
        this.dialogFormLabel.deptId = "";
        this.dialogFormLabel.leader = "";
        this.dialogFormLabel.phone = "";
        this.dialogFormLabel.email = "";
        this.dialogFormLabel.status = "0";
        if (flag === "add1") {
          this.dialogFormLabel.parent = {
            label: row.deptName,
            id: row.deptId
          };
          // this.dialogFormLabel.parentId = row.deptId;
          // this.dialogFormLabel.parentName = row.deptId;
        } else {
          // this.dialogFormLabel.parentId = null;
          // this.dialogFormLabel.parentName = "";
          this.dialogFormLabel.parent = null;
        }
      }
    },

    /** 选择上级部门 */
    selectUnit(node) {
      // this.dialogFormLabel.parentId = node[0].id;
      // this.dialogFormLabel.parentName = node[0].label;
      this.dialogFormLabel.parent = node;
    },

    /** 点击[取消]新增/编辑按钮 */
    cancle(formName) {
      this.$confirm("您确定取消提交表单信息吗？编辑的信息将不被保存", "警告", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dialogVisible = false;
        // this.dialogFormLabel = {};
        this.$refs[formName].resetFields();
      });
    },

    /** 点击[确定]新增/编辑按钮 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleEditDept();
        } else {
          return false;
        }
      });
    },

    /** 调用新增/修改部门接口 */
    handleEditDept() {
      this.tableFlag = false;
      let data = {};
      data.parentId = this.dialogFormLabel.parent.id;
      data.deptName = this.dialogFormLabel.deptName;
      data.leader = this.dialogFormLabel.leader;
      // data.phone = this.dialogFormLabel.phone;
      // data.email = this.dialogFormLabel.email;
      data.status = this.dialogFormLabel.status;
      data.deptId = this.dialogFormLabel.deptId;
      let res = request({
        url: "/system/dept",
        method: this.dialogType === "edit" ? "PUT" : "POST",
        data
      })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: `${res.msg}!`
            });
            this.dialogVisible = false;
            this.tableFlag = true;
            if (this.formLabelAlign.deptName === "" && this.formLabelAlign.status === "") {
              this.tableLoadfirstnode();
            } else {
              this.onSubmit(1)
            }
          } else {
            this.tableFlag = true;
            this.$message({
              type: "error",
              message: `${res.msg}!`
            });
          }
        })
        .catch(error => {
          this.tableFlag = true;
        });
    },
    /**选择用户 */
    // 添加“审批人员”
    addFormUserList() {
      this.$refs.treeSelecteGroupNameDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectTableDialog.visible = true;
        this.treeSelectTableDialog.selectedUserList = []
      });
    },
    // 修改审批人员
    updateUserList(selectedUserList) {
      selectedUserList.forEach((item) => {
        // this.form.userId = item.userId;
        this.dialogFormLabel.leader = item.userName;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
  .el-pagination.is-background { text-align: right;}
</style>