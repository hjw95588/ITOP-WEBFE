<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="userName" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入userName"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['person:givelike:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['person:givelike:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['person:givelike:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['person:givelike:export']"
        >导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <span style="color:red">注意：关闭之后，sessionId依然有效，只是不参与点赞了</span>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="givelikeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工名称" align="center" prop="userName" />
      <el-table-column label="员工编号" align="center" prop="userId" />
      <el-table-column label="sessionId" align="center" prop="sessionId" />
      <el-table-column label="是否给与他人点赞" align="center" prop="isNeedGive" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isNeedGive"
            active-value="1"
            inactive-value="0"
            @change="reverseIsNeedGiveMethod(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改点赞人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="用户" prop="userId">

          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="form.userId"
            @focus="treeSelectDialogShow"
             />

        </el-form-item>

        <el-form-item label="sessionId" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入sessionId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <tree-multi-select-table-dialog
      ref="treeSelectUserDialog"
      :title="treeSelectDialog.title"
      :visible.sync="treeSelectDialog.visible"
      :selectedUserList="treeSelectDialog.selectedUserList"
      :isMultipleChoice="false"
      @updateUserList="callBackUserSearch"
    ></tree-multi-select-table-dialog>

  </div>
</template>

<script>
import { listGivelike, getGivelike, delGivelike,
  addGivelike, updateGivelike, exportGivelike,reverseIsNeedGive } from "@/api/person/givelike";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";
export default {
  name: "Givelike",
  components: { TreeMultiSelectTableDialog},
  data() {
    return {
      treeSelectDialog: {
        title: "选择人员",
        visible: false,
        selectedUserList:[]
      },
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
      // 点赞人信息表格数据
      givelikeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sessionId: '',
        remark: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    reverseIsNeedGiveMethod(row){
      reverseIsNeedGive(row.userId).then(res => {
        if (res.code === 200) {
          this.$message({type: "success", message: '操作成功'});
          this.getList();
        } else {
          this.$message({type: "error", message: '操作失败'});
        }
      });
    },
    callBackUserSearch(val){
      if(val && val.length>0){
        const arrNames = val.map(item => {
          return (item = item.userName);
        });
        const arrIds = val.map(item => {
          return (item = item.userId);
        });
        this.$set(this.form, 'userId', arrIds.join(","))
      }else{
        this.$set(this.form, 'userId', "")
      }
    },
    treeSelectDialogShow(){
      this.treeSelectDialog.selectedUserList=[];
      this.$refs.treeSelectUserDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectDialog.visible = true;
      });
    },
    /** 查询点赞人信息列表 */
    getList() {
      this.loading = true;
      listGivelike(this.queryParams).then(response => {
        this.givelikeList = response.rows;
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
        sessionId: '',
        remark: ''
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
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加点赞人信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getGivelike(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改点赞人信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateGivelike(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addGivelike(this.form).then(response => {
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
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除点赞人信息编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGivelike(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有点赞人信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGivelike(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
