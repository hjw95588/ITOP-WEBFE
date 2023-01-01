<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="年份" prop="year">
        <el-input
          v-model="queryParams.year"
          placeholder="请输入年份"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期" prop="workDate">
        <el-date-picker size="small"
                        placeholder="请输入日期"
                        clearable
                        v-model="queryParams.workDate"
                        type="date"
                        value-format="yyyyMMdd"
                        @keyup.enter.native="handleQuery"
        />

      </el-form-item>
      <el-form-item label="日期类型" prop="dateType">
        <el-select v-model="queryParams.dateType" placeholder="日期类型" clearable size="small">
          <el-option
            v-for="dict in dateTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['punchInfo:calendars:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['punchInfo:calendars:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['punchInfo:calendars:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['punchInfo:calendars:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="calendarsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日期" align="center" prop="workDate" />
      <el-table-column label="日期类型" align="center" prop="dateType" :formatter="dateTypeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['punchInfo:calendars:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['punchInfo:calendars:remove']"
          >删除</el-button>
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

    <!-- 添加或修改打卡日历对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="日期" prop="workDate">
          <el-date-picker size="small"
                          placeholder="请输入日期"
                          clearable
                          v-model="form.workDate"
                          type="date"
                          value-format="yyyyMMdd"

          />
        </el-form-item>
        <el-form-item label="日期类型">
          <el-select v-model="form.dateType" placeholder="请选择日期类型">
            <el-option
              v-for="dict in dateTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
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
import { listCalendars, getCalendars, delCalendars, addCalendars, updateCalendars, exportCalendars } from "@/api/punchInfo/calendars";

export default {
  name: "Calendars",
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
      // 打卡日历表格数据
      calendarsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 1工作日 2休息日 3法定假日字典
      dateTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        year: '',
        dateType: '',
        workDate:''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        workDate: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
        dateType: [
          { required: true, message: "日期类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("punch_calendars").then(response => {
      this.dateTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询打卡日历列表 */
    getList() {
      this.loading = true;
      listCalendars(this.queryParams).then(response => {
        this.calendarsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 1工作日 2休息日 3法定假日字典翻译
    dateTypeFormat(row, column) {
      return this.selectDictLabel(this.dateTypeOptions, row.dateType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        workDate: '',
        year:'',
        dateType: ''
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
      this.ids = selection.map(item => item.workDate)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加打卡日历";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const workDate = row.workDate || this.ids
      getCalendars(workDate).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改打卡日历";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.workDate != undefined) {
            updateCalendars(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCalendars(this.form).then(response => {
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
      const workDates = row.workDate || this.ids;
      this.$confirm('是否确认删除打卡日历编号为"' + workDates + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delCalendars(workDates);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有打卡日历数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportCalendars(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    }
  }
};
</script>
