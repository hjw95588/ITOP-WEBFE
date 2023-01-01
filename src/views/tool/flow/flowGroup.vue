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
        <el-form class="queryParent"
          :model="queryParams"
          ref="queryForm"
          label-width="80px"
          v-show="showSearch"
        >
          <el-form-item label="审批岗位" prop="groupName" class="el-item-three">
            <el-input
              v-model.trim="queryParams.groupName"
              placeholder="请输入审批岗位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="审批人员" prop="groupName">
            <el-input
              v-model="queryParams.groupName"
              placeholder="请输入审批人员"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item class="query-item">
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
                v-hasPermi="['kylin:group:add']"
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
                v-hasPermi="['kylin:group:edit']"
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
                v-hasPermi="['kylin:group:remove']"
                >删除</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-user"
                size="mini"
                @click="dynamicHandle"
                v-hasPermi="['kylin:group:dynamicHandle']"
                >动态审批组维护</el-button
              >
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['kylin:group:export']"
                >导出</el-button
              >
            </el-col> -->
            <table-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns" />
          </el-row>
          <el-table
            v-loading="loading"
            :data="groupList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="审批岗位" align="center" prop="groupName" v-if="columns[0].visible"/>
            <el-table-column label="审批人员" align="center" prop="userList" v-if="columns[1].visible">
              <template slot-scope="scope">
                <span v-if="scope.row.groupType==3&&scope.row.roles">{{ scope.row.roles | rolesFilter }}</span> 
                <span v-else>{{ scope.row.userList | userListFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="审批类型 " prop="groupType" align="center" v-if="columns[2].visible">
              <template slot-scope="scope">
                <span>{{ scope.row.groupType | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
              v-if="columns[3].visible"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="修改时间"
              align="center"
              prop="updateTime"
              width="180"
              v-if="columns[4].visible"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.updateTime) || "-" }}</span>
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

        <!-- 树形图+表格分页弹窗[搜索+表格+分页]（开始） -->
        <tree-multi-select-table-dialog
          ref="treeSelecteGroupNameDialog"
          :title="treeSelectTableDialog.title"
          :visible.sync="treeSelectTableDialog.visible"
          :selectedUserList="treeSelectTableDialog.selectedUserList"
          @updateUserList="updateUserList"
        ></tree-multi-select-table-dialog>
        <!-- 树形图+表格分页弹窗[搜索+表格+分页]（结束） -->

        <!-- 添加或修改流程节点组对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" :append-to-body="true">
          <el-form ref="form" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="审批岗位 :" prop="groupName">
              <el-input v-model.trim="form.groupName" placeholder="请输入审批岗位" />
            </el-form-item>
            <el-form-item v-if="true" label="岗位类型 :" prop="groupType">
              <el-radio-group v-model="form.groupType">
                <el-radio :label="1">人员/班组</el-radio>
                <el-radio :label="2">岗位/动态组</el-radio>
                <el-radio :label="3">角色</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批人员 :" prop="userList" v-if="form.groupType === 1" class="user-list">
              <!-- <span class="label">审批人员 :</span> -->
              <div class="user-list-right">
                <el-tag
                  style="margin-right: 10px; margin-bottom: 10px"
                  :key="tag.userId"
                  v-for="tag in form.userList"
                  closable
                  :disable-transitions="false"
                  @close="handleCloseTagItem(tag)"
                >
                  {{ tag.userName }}
                </el-tag>
                <el-button
                  class="button-new-tag"
                  size="small"
                  @click="addFormUserList"
                  >+ 添加</el-button
                >
              </div>
            </el-form-item>
            <el-form-item
              v-if="form.groupType === 2"
              label="动态组 :"
              key="post"
              prop="postId"
            >
              <el-select
                v-model="form.postId"
                filterable
                placeholder="请选择审批岗位"
                @change="updateDynamicOption"
              >
                <el-option
                  v-for="item in groupOptionList"
                  :key="item.groupDynamicId"
                  :label="item.groupDynamicName"
                  :value="item.groupDynamicId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:" prop="roleId" v-if="form.groupType === 3">
              <el-select
                v-model="form.roleId"
                multiple
                key="role"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in roleOptions"
                  :key="`role${index}`"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select> 
            </el-form-item>
                    
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listGroup,
  getGroup,
  delGroup,
  addGroup,
  updateGroup,
  exportGroup,
} from "@/api/process/group";
import { listDynamicGroup } from "@/api/process/dynamicGroup";
import { getBriefProcessListPage } from "@/api/process/processList";
import { getRoles } from "@/api/system/user";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";
import deepClone from "clone-deep";

export default {
  name: "FlowGroup",
  components: {
    TreeMultiSelectTableDialog,
  },
  data() {
    return {
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        selectedUserList: [], // "添加/编辑流程节点组---添加审批人员"弹窗的userList
      },
      // 流程树形图
      treeProps: {
        label: "flowName",
        isLeaf: "leaf",
      },
      // 显示搜索条件
      showSearch: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessKey: "",
        groupName: "",
      },
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 流程节点组表格数据
      groupList: [],
      // 弹出层标题[新增/编辑弹窗]
      title: "",
      // 是否显示弹出层[新增/编辑弹窗]
      open: false,
      // 表单参数[新增/编辑弹窗]
      form: {
        businessKey: "",
        groupId: "", // 新增的时候不传groupId
        groupName: "",
        groupType: "",
        postId: "",
        postName: "",
        userList: [],
        roleId:[]// 角色Id集合
      },
      roleOptions: [],
      // 列信息
      columns: [
        { key: 0, label: `审批岗位`, visible: true },
        { key: 1, label: `审批人员`, visible: true },
        { key: 2, label: `审批类型`, visible: true },
        { key: 3, label: `创建时间`, visible: true },
        { key: 4, label: `修改时间`, visible: true },
      ],
      // 表单校验[新增/编辑弹窗]
      rules: {
        groupName: [
          { required: true, message: "审批岗位不能为空", trigger: "blur" },
          { max: 20, message: '用户编码最多输入20个字符' }
        ],
        groupType: [
          { required: true, message: '请选择岗位类型！', trigger: 'blur' }
        ],
        postId: [
          { required: true, message: '请选择动态组', trigger: 'blur' }
        ],
        userList: [
          { required: true, message: '请添加审批人员', trigger: 'change' }
        ],
         roleId: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
      groupOptionList: [],
      value: "",
    };
  },
  filters: {
    userListFilter(userList) {
      let arr = [];
      if (userList.length === 0) {
        return "-";
      }
      userList.map((item) => {
        // 这里的后端返回有问题
        arr.push(item.userName);
      });
      return arr.join(",");
    },
    rolesFilter(roles) {
      let arr = [];
      if (roles&&roles.length === 0) {
        return "-";
      }
      roles.map((item) => {
        arr.push(item.roleName);
      });
      return arr.join(",");
    },
    typeFilter(groupType) {
      if (groupType === "" || groupType === undefined || groupType === null) {
        return "";
      }
      const groupTypeMap = {
        1: "人员/班组",
        2: "岗位/动态组",
        3: "角色",
      };
      return groupTypeMap[groupType];
    },
  },
  created() {
    this.getList();
    this.getDynamicGroupList();
  },
  methods: {
    // 加载节点数据
    treeLoadNode(node, resolve) {
      console.log("动态加载树形数据", node, resolve);
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
        console.log("查询二级节点", res);
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
      console.log("点击每个叶子节点", data);
      let businessKey = data.id === "0000000000" ? "" : data.flowKey;
      this.queryParams.businessKey = businessKey;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询流程节点组列表 */
    getList() {
      this.loading = true;
      listGroup(this.queryParams).then((response) => {
        this.groupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDynamicGroupList() {
      listDynamicGroup().then((response) => {
        this.groupOptionList = response.rows;
      });
    },
     /** 获取角色数据 */
    getRoles () {
       let params= {
          status: '0',
          delFlag: '0'
        }
     getRoles(params).then(res => {
        if (res.code === 200) {
          this.roleOptions = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      console.log("选中的条数", selection);
      this.ids = selection.map((item) => item.groupId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 删除弹窗中的审批人员
    handleCloseTagItem(tag) {
      let index = this.form.userList.findIndex(
        (item) => item.userId === tag.userId
      );
      this.form.userList.splice(index, 1);
      this.treeSelectTableDialog.selectedUserList = deepClone(this.form.userList)
    },
    // 添加“审批人员”
    addFormUserList() {
      this.$refs.treeSelecteGroupNameDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectTableDialog.visible = true;
      });
    },
    // 修改”审批人员数据“
    updateUserList(selectedUserList) {
      this.$set(this.form,'userList',selectedUserList)
   //   this.form.userList = selectedUserList;
    },
    // 表单重置
    reset() {
      this.form.groupId = "";
      this.form.postId = "";
      this.form.roleId = [];
      this.form.groupName = "";
      this.form.userList = [];
      this.form.businessKey = this.queryParams.businessKey;
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      if (!this.queryParams.businessKey) {
        this.msgError("请优先选择一条流程！");
        return;
      }
      this.reset();
      this.treeSelectTableDialog.selectedUserList = []; // 树形弹窗的默认值
      this.open = true;
      this.getRoles()
      this.title = "添加流程节点组";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.getRoles()
      this.reset();
      const groupId = this.ids;
      
      getGroup(groupId).then((response) => {
        this.form = deepClone(response.data);
        if(response.data.roleId){
           this.form.roleId=response.data.roleId.split(",").map((item) => item * 1);
        }
       
        this.treeSelectTableDialog.selectedUserList = deepClone(
          // 树形弹窗的默认值
          this.form.userList
        );
        console.log(
          "树形弹窗中的选中人数",
          this.treeSelectTableDialog.selectedUserList
        );
        console.log("this.form",this.form)
        this.open = true;
        this.title = "修改流程节点组";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.groupId) {
            if (!this.form.businessKey) {
              this.msgError("请优先选择一条流程！");
              return;
            }
            let { businessKey, groupId, groupName, groupType, postId, postName, userList,roleId } = this.form;
             let postData = { businessKey, groupId, groupName, groupType };
            if(groupType===1){
              postData.userList=userList
            }else if(groupType===2){
              postData.postId=postId
            }else if(groupType===3){
              postData.roleIds=roleId
            }
          
            updateGroup(postData).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            let { businessKey, groupName, groupType, postId, postName, userList,roleId } = this.form;
             let postData = { businessKey, groupName, groupType };
            if(groupType===1){
              postData.userList=userList
            }else if(groupType===2){
              postData.postId=postId
            }else if(groupType===3){
              postData.roleIds=roleId
            }
            addGroup(postData).then((response) => {
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
    handleDelete() {
      const groupIds = this.ids;
      this.$confirm(
        '是否确认删除流程节点组编号为"' + groupIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delGroup(groupIds);
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
      this.$confirm("是否确认导出所有流程节点组数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportGroup(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 动态审批组维护 */
    dynamicHandle() {
      this.$router.push({
        path: "/flow/flowGroupDynamic",
      });
      return;
    },
    updateDynamicOption(val) {
      // console.log("groupOptionList:", this.groupOptionList)
      // this.form.postId = this.groupOptionList.groupDynamicId;
      // this.form.postName = this.groupOptionList.groupDynamicName;
      // console.log(" this.form:", this.form)
      console.log("updateDynamicOption", val)
      this.groupOptionList.forEach(item => {
        if(item.groupDynamicId === val) {
          this.form.postName = item.groupDynamicName;
          console.log("updateDynamicOption groupDynamicName", item.groupDynamicName)
        }
      })
    }
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
  font-size: 14px;
  color: #606266;
  line-height: 36px;
  .label {
    font-weight: 700;
    width: 90px;
    display: inline-block;
    text-align: right;
    padding-right: 10px;
  }
  .user-list-right {
    width: 380px;
  }
}
</style>
