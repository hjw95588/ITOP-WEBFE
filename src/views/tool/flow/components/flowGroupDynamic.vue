<template>
  <div>
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="组key" prop="groupDynamicKey">
        <el-input
          v-model="queryParams.groupDynamicKey"
          placeholder="请输入组key"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组名称" prop="groupDynamicName">
        <el-input
          v-model="queryParams.groupDynamicName"
          placeholder="请输入组名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.updateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
            v-hasPermi="['kylin:dynamicGroup:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['kylin:dynamicGroup:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['kylin:dynamicGroup:remove']"
          >删除</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['kylin:dynamicGroup:export']"
          >导出</el-button>
        </el-col> -->
      </el-row>
      <el-table v-loading="loading" :data="dynamicGroupList" @selection-change="handleSelectionChange" highlight-current-row  @current-change="groupItemClickHandler">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="组名称" align="center" prop="groupDynamicName" :show-overflow-tooltip="true" />
        <!-- <el-table-column label="组ID" align="center" prop="groupDynamicId" />
        <el-table-column label="组key" align="center" prop="groupDynamicKey" /> -->
        <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['kylin:dynamicGroup:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['kylin:dynamicGroup:remove']"
            >删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    
    <pagination
      
      :total="total"
      :layout="layout"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改流程动态审批组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" :append-to-body="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="组名称" prop="groupDynamicName">
          <el-input v-model.trim="form.groupDynamicName" placeholder="请输入组名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDynamicGroup, getDynamicGroup, delDynamicGroup, addDynamicGroup, updateDynamicGroup, exportDynamicGroup } from "@/api/process/dynamicGroup";

export default {
  name: "DynamicGroup",
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
      // 分页器参数
      layout: 'prev, pager, next',
      // 流程动态审批组表格数据
      dynamicGroupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupDynamicKey: undefined,
        groupDynamicName: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        groupDynamicName: [
          { required: true, message: "组名称能为空", trigger: "blur" },
          { max: 20, message: '组名称最多输入20个字符' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程动态审批组列表 */
    getList() {
      this.loading = true;
      listDynamicGroup(this.queryParams).then(response => {
        this.dynamicGroupList = response.rows;
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
        groupDynamicId: undefined,
        groupDynamicKey: undefined,
        groupDynamicName: undefined,
        createTime: undefined,
        updateTime: undefined
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
      this.ids = selection.map(item => item.groupDynamicId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程动态审批组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const groupDynamicId = row.groupDynamicId || this.ids
      getDynamicGroup(groupDynamicId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程动态审批组";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.groupDynamicId != undefined) {
            updateDynamicGroup(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDynamicGroup(this.form).then(response => {
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
      const groupDynamicIds = row.groupDynamicId || this.ids;
      this.$confirm('是否确认删除流程动态审批组编号为"' + groupDynamicIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDynamicGroup(groupDynamicIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有流程动态审批组数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDynamicGroup(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    groupItemClickHandler(row) {
      this.$emit("groupItemClick", row);
      // console.log("点击数据：" + row.groupDynamicId)
    }
  }
};
</script>