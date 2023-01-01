<template>
  <div class="app-container">
    <div class="dataWrap">
      <el-table v-loading="loading" :data="historyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键ID" align="center" prop="historyId" /> -->
        <el-table-column label="流程名称" align="center" prop="flowName" />
        <el-table-column label="节点名称" align="center" prop="nodeName" />
        <!-- <el-table-column label="流程部署ID" align="center" prop="deploymentId" />
        <el-table-column label="流程实例ID" align="center" prop="procInstId" />
        <el-table-column label="任务ID" align="center" prop="taskId" /> -->
        <el-table-column label="委托人" align="center" prop="assignerName" />
        <el-table-column label="代理人" align="center" prop="assigneeName" />
        <el-table-column label="任务完成时间" align="center" prop="completeTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.completeTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="代理记录ID" align="center" prop="delegationId" />
        <el-table-column label="代理记录摘要" align="center" prop="delegationAbstract" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              v-hasPermi="['kylin:delegationHistory:query']"
            >浏览</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['kylin:delegationHistory:remove']"
            >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :append-to-body="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :disabled="disableFormLabel"> 
        <el-form-item label="流程名称" prop="flowName">
          <el-input v-model="form.flowName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入节点名称" />
        </el-form-item>
        <!-- <el-form-item label="流程部署ID" prop="deploymentId">
          <el-input v-model="form.deploymentId" placeholder="请输入流程部署ID" />
        </el-form-item>
        <el-form-item label="流程实例ID" prop="procInstId">
          <el-input v-model="form.procInstId" placeholder="请输入流程实例ID" />
        </el-form-item>
        <el-form-item label="任务ID" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务ID" />
        </el-form-item> -->
        <el-form-item label="委托人姓名" prop="assigneeName">
          <el-input v-model="form.assigneeName" placeholder="请输入委托人ID" />
        </el-form-item>
        <el-form-item label="代理人姓名" prop="assigneeId">
          <el-input v-model="form.assignerName" placeholder="请输入代理人ID" />
        </el-form-item>
        <el-form-item label="任务完成时间" prop="completeTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.completeTime"
            type="datetime"
            placeholder="选择任务完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="代理记录ID" prop="delegationId">
          <el-input v-model="form.delegationId" placeholder="请输入代理记录ID" />
        </el-form-item>
        <!-- <el-form-item label="代理记录摘要" prop="delegationAbstract">
          <el-input v-model="form.delegationAbstract" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHistory, getHistory } from "@/api/process/delegation";

export default {
  name: "History",
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
      // 【请填写功能名称】表格数据
      historyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        delegationId: undefined
      },
      disableFormLabel: false, // 是否禁用表单
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.queryParams.delegationId = this.$route.query.deleGationId
    this.getList();
  },
  methods: {
    /** 查询代理历史列表 */
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then(response => {
        this.historyList = response.rows;
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
        historyId: undefined,
        flowName: undefined,
        nodeName: undefined,
        deploymentId: undefined,
        procInstId: undefined,
        taskId: undefined,
        assignerId: undefined,
        assigneeId: undefined,
        completeTime: undefined,
        delegationId: undefined,
        delegationAbstract: undefined
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
      this.ids = selection.map(item => item.historyId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const historyId = row.historyId || this.ids
      getHistory(historyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 浏览按钮操作 */
    handleView(row) {
      console.log(row)
      this.disableFormLabel = true
      this.reset();
      const historyId = row.historyId || this.ids
      getHistory(historyId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "浏览";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.historyId != undefined) {
            updateHistory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHistory(this.form).then(response => {
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
      const historyIds = row.historyId || this.ids;
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + historyIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHistory(historyIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHistory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>