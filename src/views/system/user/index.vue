<template>
  <div class="app-container">
    <div class="user-management" id="FullOrderDetailBox">
      <el-row :gutter="20" style="margin-left: 0;">
        <!-- 左侧部门树 -->
        <el-col class="deptSearch" :span="5">
          <div class="grid-content bg-purple">
            <el-input
              v-model.trim="searchDeptValue"
              @input="searchDept"
              placeholder="请输入部门名称"
              prefix-icon="el-icon-search"
              size="small"
              style="margin-bottom: 30px"
              class="searchInput"
              v-show="showSearch"
            ></el-input>

            <el-tree
              ref="deptTree"
              lazy
              v-show="!isSearching"
              :style="{
                overflow: 'auto',
              }"
              :highlight-current="true"
              :load="eltreeLoadNode"
              :props="defaultProps"
              node-key="deptId"
              :default-expanded-keys="['0000000000']"
              @node-click="handleNodeClick"
              class="filter-tree"
            />
            <div v-show="isSearching" class="dept-list">
              <div v-if="searchDeptList.length > 0" class="has-data">
                <div
                  v-for="(item, index) in searchDeptList"
                  :key="index"
                  @click="handleNodeClick(item)"
                >
                  {{ item.deptName }}
                </div>
              </div>
              <div v-else class="no-data">暂无数据</div>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content bg-purple-light">
            <!-- 查询条件 -->
            <el-form
              label-position="right"
              ref="ruleForm"
              label-width="80px"
              :model="formLabelAlign"
              :class="['queryParent', isStowExpand?'evenItmes':'']"
              v-show="showSearch"
            >
              <el-form-item label="用户名称:" prop="userName" class="el-item-two">
                <el-input
                  v-model.trim="formLabelAlign.userName"
                  size="small"
                  placeholder="请输入用户名称"
                ></el-input> </el-form-item>
              <el-form-item label="用户编码:" prop="userId" class="el-item-two">
                <el-input
                  v-model.trim="formLabelAlign.userId"
                  size="small"
                  placeholder="请输入用户编码"
                ></el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="status" class="el-item-two"  v-show="isStowExpand">
                <el-select
                  v-model="formLabelAlign.status"
                  size="small"
                  placeholder="用户状态"
                >
                <el-option label="正常" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
              </el-select> </el-form-item>
              <el-form-item class="el-item-two query-item">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="onSubmit"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetForm('ruleForm')"
                  >重置</el-button>
                  <el-button
                    type="text"
                    v-stowExpand="['isStowExpand']"
                  >{{isStowExpand ? '收起' : '展开'}}<i :class="[isStowExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down', 'el-icon--right']"></i></el-button>
              </el-form-item>
            </el-form>
            <div class="dataWrap">
              <!-- 操作按钮 -->
              <div class="fnButon" style="margin-bottom: 10px">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  v-hasPermi="['system:user:add']"
                  @click="openDialog('add')"
                  >新增</el-button
                >
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  :disabled="multipleSelection.length !== 1"
                  v-hasPermi="['system:user:edit']"
                  @click="openDialog('edit2')"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  :disabled="multipleSelection.length === 0"
                  icon="el-icon-delete"
                  size="mini"
                  v-hasPermi="['system:user:remove']"
                  @click="onDelete(2)"
                  >删除</el-button
                >
                <el-checkbox v-model="isShowDelUser" border v-hasPermi="['system:user:query']">显示已删除用户</el-checkbox>
                <!-- <button @click="print">打印</button> -->
                <table-toolbar :showSearch.sync="showSearch" @queryTable="resetForm('ruleForm')" :columns="columns" />
              </div>

              <!-- 表格 -->
                <!-- :cell-style="{ background: '#f8fdff' }" -->
              <el-table
                :data="tableData"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                element-loading-text="Loading"
                style="width: 100%"
              >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                  align="center"
                  label="用户编码"
                  prop="userId"
                  width="90"
                  v-if="columns[0].visible"
                ></el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="用户名称"
                  prop="userName"
                  width="90"
                  v-if="columns[1].visible"
                ></el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="部门"
                  prop="deptName"
                  max-width="120"
                  v-if="columns[2].visible"
                >
                  <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.depts" :key="index">{{
                      item.deptName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="手机号码"
                  prop="phonenumber"
                  width="110"
                  v-if="columns[3].visible"
                ></el-table-column>
                <el-table-column
                  align="center"
                  show-overflow-tooltip
                  label="创建时间"
                  prop="createTime"
                  min-width="80"
                  v-if="columns[4].visible"
                ></el-table-column>
                <el-table-column align="center" show-overflow-tooltip label="状态" min-width="40" v-if="columns[5].visible">
                  <template slot-scope="scope">
                    <span>{{ scope.row.status === '0' ? '正常' : '停用' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="操作"
                  prop="operate"
                  width="280"
                  fixed="right"
                  v-if="columns[6].visible"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-edit"
                      size="mini"
                      v-hasPermi="['system:user:edit']"
                      v-show="scope.row.delFlag === '0'"
                      @click="openDialog('edit1', scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      size="mini"
                      v-hasPermi="['system:user:remove']"
                      v-show="scope.row.delFlag === '0'"
                      @click="onDelete(1, scope.row)"
                      >删除</el-button
                    >
                    <el-button
                      type="text"
                      icon="el-icon-view"
                      size="mini"
                      v-hasPermi="['system:user:query']"
                      v-show="scope.row.delFlag === '0'"
                      @click="checkInfo(scope.row)"
                      >查看</el-button
                    >
                    <el-button
                      type="text"
                      icon="el-icon-refresh-right"
                      size="mini"
                      v-hasPermi="['system:user:resetPwd']"
                      v-show="scope.row.delFlag === '0'"
                      @click="resPassword(scope.row)"
                      >重置</el-button
                    >
                    <el-button
                      v-show="scope.row.delFlag === '2'"
                      size="mini"
                      type="text"
                      icon="el-icon-refresh-right"
                      @click="handleRestore(scope.row)"
                      v-hasPermi="['system:user:edit']"
                      >恢复</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
              <pagination
                :total="total"
                :page.sync="currentPage"
                :limit.sync="pageSize"
                @pagination="fetchData"
              />
            </div>
            <!-- 新增/编辑/预览弹窗 -->
            <el-dialog
              class="user-dialog"
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
                      <el-form-item label="用户编码:" prop="userId">
                        <el-input
                          v-model="dialogFormLabel.userId"
                          size="small"
                          :disabled="dialogType !== 'add'"
                          placeholder="请输入用户编码"
                          :validate-event="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="用户名称:" prop="userName">
                        <el-input
                          v-model="dialogFormLabel.userName"
                          size="small"
                          placeholder="请输入用户名称"
                          :validate-event="true"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" class="user-management-dept">
                    <el-col :span="12"
                      ><el-form-item label="归属部门:" prop="dept">
                        <Treeselect
                          :disabled="dialogType === 'preview'"
                          :propValue.sync="dialogFormLabel.dept"
                          @selectUnit="selectUnit"
                          :multiple="true"
                        ></Treeselect> </el-form-item
                    ></el-col>
                    <el-col :span="12">
                      <el-form-item label="手机号码:" prop="phonenumber">
                        <el-input
                          v-model.trim="dialogFormLabel.phonenumber"
                          size="small"
                          maxlength="11"
                          placeholder="请输入手机号码"
                        ></el-input> </el-form-item
                    ></el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="邮箱:" prop="email">
                        <el-input
                          v-model.trim="dialogFormLabel.email"
                          size="small"
                          placeholder="请输入邮箱"
                          :validate-event="true"
                        ></el-input> </el-form-item
                    ></el-col>
                    <!-- <el-col :span="12">
                      <el-form-item label="用户密码:" prop="password">
                        <el-input
                          v-model.trim="dialogFormLabel.password"
                          size="mini"
                          show-password
                          placeholder="请输入用户密码"
                          :validate-event="true"
                        ></el-input> </el-form-item
                    ></el-col> -->
                    <el-col :span="12">
                      <el-form-item label="用户性别:" prop="sex">
                        <el-select
                          v-model="dialogFormLabel.sex"
                          size="mini"
                          placeholder="请选择"
                        >
                          <el-option label="男" value="0"></el-option>
                          <el-option label="女" value="1"></el-option>
                          <el-option label="未知" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12"
                      ><el-form-item label="角色:" prop="roles">
                        <el-select
                          v-model="dialogFormLabel.roles"
                          multiple
                          size="mini"
                          @change="test"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in dialogFormLabel.roleOptions"
                            :key="index"
                            :label="item.label"
                            :value="item"
                          ></el-option>
                        </el-select> </el-form-item
                    ></el-col>
                    <el-col :span="12">
                      <el-form-item label="岗位:" prop="posts">
                        <el-select
                          v-model="dialogFormLabel.posts"
                          multiple
                          size="mini"
                          @change="test"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in dialogFormLabel.postsOptions"
                            :key="index"
                            :label="item.label"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="状态:" prop="status">
                        <el-radio v-model="dialogFormLabel.status" label="0"
                          >正常</el-radio
                        >
                        <el-radio v-model="dialogFormLabel.status" label="1"
                          >停用</el-radio
                        >
                      </el-form-item></el-col
                    >
                  </el-row>
                  <el-form-item label="备注:" prop="remark">
                    <el-input
                      type="textarea"
                      :rows="2"
                      maxlength="1000"
                      show-word-limit
                      placeholder="请输入内容"
                      v-model="dialogFormLabel.remark"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span
                slot="footer"
                v-if="dialogType !== 'preview'"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click="submitForm('dialogForm')"
                  size="medium"
                  >提交</el-button
                >
                <el-button @click="cancle('dialogForm')" size="medium"
                  >取消</el-button
                >
              </span>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { resetUserPwd, restore } from '@/api/system/user'
import { _debounce } from "@/utils/public";
import Treeselect from "@/views/components/Treeselect/index";

export default {
  name: "User",
  components: { Treeselect },
  filters: {},
  props: ["content_height"],
  data() {
    return {
      isStowExpand: false,
      /** 查询部门 */
      isSearching: false, // 是否处于查询部门状态
      searchDeptValue: "", // 查询部门
      searchDeptList: [], // 查询到的部门列表
      searchDeptById: "", // 根据部门ID查询用户列表
      searchDeptObj: null,  //左侧选择的部门对象
      // 是否显示已删除用户
      isShowDelUser: false,
      // 显示搜索条件
      showSearch: true,
      // 取消监控
      unwatch: null,
      /** tree */
      defaultProps: {
        label: "deptName",
        children: "zones",
        isLeaf: "leaf",
      },

      /** form */
      formLabelAlign: {
        userName: "",
        userId: "",
        status: "",
        delFlag: 0
      },
      /** table */
      listLoading: true,
      tableData: [],
      multipleSelection: [], // 选中的表格数据

      /** Pagination */
      currentPage: 1,
      pageSize: 10,
      total: 0,

      /** dialog */
      title: "添加用户",
      dialogType: "add",
      dialogVisible: false,
      dialogFormLabel: {
        userName: "", // 用户名称
        userId: "", // 用户编码

        dept: null, // 部门

        phonenumber: "", // 手机号码
        email: "", // 邮箱
        password: "", // 密码

        roles: [], // 角色Id集合
        roleOptions: [],
        posts: [], // 岗位Id集合
        postsOptions: [],
        sex: "0", // 性别
        status: "0", // 状态
        remark: "", // 备注
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编码`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `部门`, visible: true },
        { key: 3, label: `手机号码`, visible: true },
        { key: 4, label: `创建时间`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `操作`, visible: true }
      ],
      rules: {
        userId: [
          { required: true, message: "用户编码不能为空", trigger: "blur" },
          { max: 20, message: '用户编码最多输入20个字符' }
        ],
        dept: [
          { required: true, message: "归属部门不能为空", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          // {
          //   pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
          //   message: "请输入正确的手机号码",
          //   trigger: "blur",
          // },
        ],
        email: [
          { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          },
          { max: 40, message: '邮箱最多输入40个字符' }
          // {
          //   type: "email",
          //   message: "请输入正确的邮箱地址",
          //   trigger: "blur",
          // },
        ],
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { max: 10, message: '用户名称最多输入10个字符' }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { pattern: /^[0-9a-zA-Z@*]+$/,
            message: "密码不能输入中文或空格",
            trigger: "blur"
          }
        ],
        roles: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
    };
  },
  created() {
    this.fetchData();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.unwatch = vm.$watch('isShowDelUser', (newVal, oldVal) => {
        vm.formLabelAlign.delFlag = newVal ? 2 : 0;
        vm.fetchData()
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    this.unwatch()
    next()
  },
  methods: {
    print() {
      // window.print();//打印全部
      var oldHtml = document.body.innerHTML; //将body内容先行存储
      // console.log(document.getElementById("FullOrderDetailBox"), "V-----");
      var printbox = document.getElementById("FullOrderDetailBox").innerHTML; //再将所要打印区域内容赋值给body
      document.body.innerHTML = printbox; //再将所要打印区域内容赋值给body
      window.print(); //调用全部打印事件
      document.body.innerHTML = oldHtml; //将body内容再返回原页面
      window.location.reload(); //打印取消后刷新页面防止按钮不能点击
    },
    test(val) {
      // console.log(val, "VAL---------");
    },
    /** 查询部门 */
    searchDept: _debounce(function (_type, index, item) {
      if (this.searchDeptValue !== "") {
        request({
          url: `/system/dept/list?deptName=${this.searchDeptValue}`,
          method: "GET",
        }).then((res) => {
          if (res.code === 200) {
            this.searchDeptList = res.rows;
            this.isSearching = true;
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        });
      } else {
        this.isSearching = false;
      }
    }, 500),

    /** el-tree懒加载 */
    eltreeLoadNode(node, resolve) {
      // // 如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.eltreeLoadfirstnode(resolve);
      }
      // 如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.eltreeLoadchildnode(node, resolve);
      }
    },

    /** el-tree初始化一级节点 */
    eltreeLoadfirstnode(resolve) {
      let $this = this;
      request({
        url: "/system/dept/parentNode",
        method: "GET",
      }).then((res) => {
        if (res.code === 200) {
          return resolve([res.data]);
        } else {
          this.$message({
            type: "error",
            message: "获取根节点部门失败!",
          });
        }
      });
    },

    /** el-tree加载节点的子节点集合 */
    eltreeLoadchildnode(node, resolve) {
      request({
        url: `/system/dept/find/${node.data.deptId}`,
        method: "GET",
      }).then((res) => {
        if (res.code === 200) {
          return resolve(res.data);
        } else {
          this.$message({
            type: "error",
            message: "获取子部门树失败!",
          });
        }
      });
    },

    /** 选择归属部门 */
    selectUnit(value) {
      this.dialogFormLabel.dept = value;
    },

    /** 点击el-tree树节点更新用户列表 */
    handleNodeClick(data) {
      console.log(data)
      this.searchDeptById = data.deptId;
      this.searchDeptObj = Object.assign(data, {
        label: data.deptName,
        id: data.deptId
      });
      this.currentPage = 1;
      this.fetchData();
    },

    /** 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.searchDeptById = "";
      this.fetchData();
    },
    /** 查询 */
    onSubmit() {
      this.currentPage = 1;
      this.fetchData();
    },
    /** 获取表格数据接口 */
    fetchData() {
      this.listLoading = true;
      let params = {};
      params.userName = this.formLabelAlign.userName;
      params.userId = this.formLabelAlign.userId;
      params.pageNum = this.currentPage - 1;
      params.pageSize = this.pageSize;
      params.deptIdStr = this.searchDeptById;
      params.status = this.formLabelAlign.status;
      params.delFlag = this.formLabelAlign.delFlag;
      request({
        url: "/system/user/list",
        method: "GET",
        params,
      }).then((res) => {
        if (res.code === 200) {
          this.listLoading = false;
          this.tableData = res.rows;
          this.total = res.total;
        } else {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: "获取用户列表失败!",
          });
        }
      });
    },

    /** 双击预览 */
    checkInfo(row) {
      this.openDialog("preview", row);
    },

    /** 表格选中项发生改变 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /** 每页条数改变 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchData();
    },

    /** 当前页改变 */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    /** 打开新增/编辑/预览弹窗 */
    openDialog(flag, row) {
      /**
       * flag=add为新增
       * flag=preview为预览
       * flag=edit1为在表格上点击按钮
       * flag=edit2为选中表格项后编辑
       */
      this.dialogType = flag;
      this.dialogVisible = true;
      this.getRolesPosts()
      if (flag === "add") {
        this.title = "添加用户";
        this.dialogFormLabel.userName = "";
        this.dialogFormLabel.userId = "";
        this.dialogFormLabel.dept = this.searchDeptObj ? [this.searchDeptObj] : null;

        this.dialogFormLabel.phonenumber = "";
        this.dialogFormLabel.email = "";
        this.dialogFormLabel.password = "";

        this.dialogFormLabel.roles = [];

        this.dialogFormLabel.sex = "0";
        this.dialogFormLabel.status = "0";
        this.dialogFormLabel.remark = "";
      } else {
        if (flag === "edit1" || flag === "preview") {
          this.title = flag === "edit1" ? "编辑用户" : "预览";
          this.dialogFormLabel.userName = row.userName;
          this.dialogFormLabel.userId = row.userId;
          if (row.depts !== undefined) {
            row.depts.forEach((item) => {
              item.id = item.deptId;
              item.label = item.deptName;
            });
          }
          this.dialogFormLabel.dept = row.depts;

          this.dialogFormLabel.phonenumber = row.phonenumber;
          this.dialogFormLabel.email = row.email;
          this.dialogFormLabel.password = row.password;
          if (row.roles !== undefined) {
            row.roles.forEach((item) => {
              item.value = item.roleId;
              item.label = item.roleName;
            });
          }
          this.dialogFormLabel.roles = row.roles;
          if (row.posts !== undefined) {
            row.posts.forEach(item => {
              item.value = item.postId,
              item.label = item.postName
            })
          }
          this.dialogFormLabel.posts = row.posts;

          this.dialogFormLabel.sex = row.sex;
          this.dialogFormLabel.status = row.status;
          this.dialogFormLabel.remark = row.remark;
        } else {
          this.title = "编辑用户";
          this.dialogFormLabel.userName = this.multipleSelection[0].userName;
          this.dialogFormLabel.userId = this.multipleSelection[0].userId;
          this.multipleSelection[0].depts.forEach((item) => {
            item.id = item.deptId;
            item.label = item.deptName;
          });
          this.dialogFormLabel.dept = this.multipleSelection[0].depts;

          this.dialogFormLabel.phonenumber = this.multipleSelection[0].phonenumber;
          this.dialogFormLabel.email = this.multipleSelection[0].email;
          this.dialogFormLabel.password = this.multipleSelection[0].password;

          this.multipleSelection[0].roles.forEach((item) => {
            item.value = item.roleId;
            item.label = item.roleName;
          });
          this.dialogFormLabel.roles = this.multipleSelection[0].roles;

          this.dialogFormLabel.sex = this.multipleSelection[0].sex;
          let abc = this.multipleSelection[0];
          this.dialogFormLabel.status = abc.status;
          this.dialogFormLabel.remark = this.multipleSelection[0].remark;
        }
      }
    },

    /** 点击[取消]新增/编辑按钮 */
    cancle(formName) {
      this.$confirm("您确定取消提交表单信息吗？编辑的信息将不被保存", "警告", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.dialogVisible = false;
        // this.dialogFormLabel = {};
        this.$refs[formName].resetFields();
      });
    },

    /** 点击[确定]新增/编辑按钮 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleEditUser();
        } else {
          return false;
        }
      });
    },

    /** 调用新增/修改用户接口 */
    handleEditUser(userId, status) {
      let data = {};
      data.userId = this.dialogFormLabel.userId;
      data.userName = this.dialogFormLabel.userName;
      let detpList = [];
      this.dialogFormLabel.dept.forEach((item) => {
        detpList.push(item.id);
      });
      data.deptId = detpList;
      data.phonenumber = this.dialogFormLabel.phonenumber;
      data.email = this.dialogFormLabel.email;
      data.password = this.dialogFormLabel.password;
      let roleIds = [];
      this.dialogFormLabel.roles.forEach((item) => {
        roleIds.push(item.value);
      });
      data.roleIds = roleIds;
      let postIds = []
      this.dialogFormLabel.posts.forEach(item => [
        postIds.push(item.value)
      ])
      data.postIds = postIds
      data.sex = this.dialogFormLabel.sex;
      data.status = this.dialogFormLabel.status;
      data.remark = this.dialogFormLabel.remark;
      if (this.dialogType === "edit1" || this.dialogType === "edit2") {
        data.userId = this.dialogFormLabel.userId;
      }
      request({
        url: "/system/user",
        method: this.dialogType === "add" ? "POST" : "PUT",
        data,
      }).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: `${res.msg}!`,
          });
          this.dialogVisible = false;
          this.fetchData();
        } else {
          this.$message({
            type: "error",
            message: `${res.msg}!`,
          });
        }
      });
    },
    /** 删除 */
    onDelete(flag, row) {
      /**
       * flag=1为在表格上点击删除按钮
       * flag=2为选中表格项后删除
       */
      if (flag === 1) {
        this.dialogFormLabel.userId = row.userId;
      } else {
        this.dialogFormLabel.userId = "";
        this.multipleSelection.forEach((item) => {
          this.dialogFormLabel.userId = this.dialogFormLabel.userId.concat(
            `${item.userId},`
          );
        });
        this.dialogFormLabel.userId = this.dialogFormLabel.userId.slice(
          0,
          this.dialogFormLabel.userId.length - 1
        );
      }
      this.$confirm(
        `是否确认删除?`,
        "警告",
        {
          cancelButtonClass: "btn-custom-cancel",
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        request({
          url: `/system/user/${this.dialogFormLabel.userId}`,
          method: "DELETE",
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: `${res.msg}!`,
            });
            this.fetchData();
          } else {
            this.$message({
              type: "error",
              message: `${res.msg}!`,
            });
          }
        });
      });
    },
    /** 重置密码按钮操作 */
    resPassword(row) {
      this.$confirm('是否重置该用户登录密码？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        resetUserPwd(row.userId).then(response => {
            console.log(response)
            if (response.code === 200) {
              this.msgSuccess('密码已重置为初始密码！');
            } else {
              this.msgError(response.msg);
            }
          });
        }).catch(() => {});
    },
    // 恢复按钮
    handleRestore (row) {
      const recoveryObj = {
        userId: row.userId,
        delFlag: '0'
      }
      restore(recoveryObj).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          //this.open = false;
          this.fetchData();
        } else {
          this.msgError(response.msg);
        }
      })
    },
    /**获取角色和岗位 */
    async getRolesPosts () {
      await this.getRoles()
      await this.getPosts()
    },
    /** 获取角色数据 */
    getRoles () {
      request({
        url: '/system/role/list',
        method: 'get',
        params: {
          status: '0',
          delFlag: '0'
        }
      }).then(res => {
        if (res.code === 200) {
          this.dialogFormLabel.roleOptions = res.rows.map(item => ({
            value: item.roleId,
            label: item.roleName
          }))
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    /** 获取岗位数据 */
    getPosts () {
      request({
        url: '/system/post/list',
        method: 'get',
        params: {
          status: '0'
        }
      }).then(res => {
        if (res.code === 200) {
          this.dialogFormLabel.postsOptions = res.rows.map(item => ({
            value: item.postId,
            label: item.postName
          }))
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    this.searchDeptObj = null;
    // this.searchDeptById = "";
    next()
  }
};
</script>

<style lang="scss" scoped>
.user-management ::v-deep .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}
.user-management-dept ::v-deep .el-form-item__content {
  line-height: 20px;
}
.deptSearch { padding-top: 10px; background: #fff;
  .searchInput { margin-bottom: 10px !important;}
}
.dept-list {
  font-size: 14px;
  font-weight: normal;
  overflow-y: auto;
  .has-data {
    div {
      margin-bottom: 5px;
      background-color: #f8fdff;
      padding: 10px;
    }
    div:hover {
      background-color: #e4f3fb;
      cursor: pointer;
    }
  }
  .no-data {
    text-align: center;
    background-color: #fff;
    padding: 50px;
  }
}
</style>
