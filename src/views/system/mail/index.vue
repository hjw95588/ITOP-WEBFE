<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      class="queryParent"
      label-width="80px"
      v-show="showSearch"
    >
      <el-form-item label="发送人" prop="sender" class="el-item-two">
        <el-input
          v-model="queryParams.sender"
          placeholder="请输入发送人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="收件人" prop="receivers">
        <el-input
          v-model="queryParams.receivers"
          placeholder="请输入收件人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主题" prop="subject">
        <el-input
          v-model="queryParams.subject"
          placeholder="请输入主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="正文" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入正文"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发送时间" prop="sendDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.sendDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发送时间">
        </el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="抄送" prop="cc">
        <el-input
          v-model="queryParams.cc"
          placeholder="请输入抄送"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密送" prop="bcc">
        <el-input
          v-model="queryParams.bcc"
          placeholder="请输入密送"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
      <!-- </el-form-item> -->
      <el-form-item label="发送状态" prop="status" class="el-item-two">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择发送状态"
          clearable
          size="small"
        >
          <el-option label="失败" value="0" />
          <el-option label="成功" value="1" />
        </el-select>
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
    </el-form>
    <div class="dataWrap">
      <el-row :gutter="10" class="fnButon">
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:mail:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:mail:export']"
            >导出</el-button
          >
        </el-col>
        <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
      </el-row>
      <el-table
        v-loading="loading"
        :data="mailList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="邮件编号" align="center" prop="mailId" :show-overflow-tooltip="true"/> -->
        <el-table-column
          label="发送人"
          align="center"
          prop="sender"
          :show-overflow-tooltip="true"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="收件人"
          align="center"
          prop="receivers"
          :show-overflow-tooltip="true"
          v-if="columns[1].visible"
        />
        <el-table-column
          label="主题"
          align="center"
          prop="subject"
          :show-overflow-tooltip="true"
          v-if="columns[2].visible"
        />
        <el-table-column
          label="发送时间"
          align="center"
          prop="sendDate"
          width="180"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.sendDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发送状态"
          align="center"
          prop="status"
          :formatter="stausFormatter"
          width="80"
          v-if="columns[4].visible"
        />
        <!-- <el-table-column label="错误信息" align="center" prop="error" :show-overflow-tooltip="true"/> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="find(scope.row)"
              v-hasPermi="['system:mail:query']"
              >浏览</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:mail:remove']"
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

    <!-- 添加或修改邮件记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" :append-to-body="true">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        disabled
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="发送人" prop="sender">
              <el-input v-model="form.sender" placeholder="发送人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人" prop="receivers">
              <el-input v-model="form.receivers" placeholder="收件人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主题" prop="subject">
          <el-input v-model="form.subject" placeholder="主题" />
        </el-form-item>
        <el-form-item label="正文" prop="text">
          <el-input
            v-model="form.text"
            placeholder="正文"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </el-form-item>
        <el-form-item label="抄送" prop="cc">
          <el-input v-model="form.cc" placeholder="抄送" />
        </el-form-item>
        <el-form-item label="密送" prop="bcc">
          <el-input v-model="form.bcc" placeholder="密送" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发送时间" prop="sendDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model="form.sendDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择发送时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">失败</el-radio>
                <el-radio label="1">成功</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="错误信息" prop="error">
          <el-input
            v-model="form.error"
            placeholder="错误信息"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMail, getMail, delMail, exportMail } from "@/api/system/mail";

export default {
  name: "Mail",
  data() {
    return {
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `发送人`, visible: true },
        { key: 1, label: `收件人`, visible: true },
        { key: 2, label: `主题`, visible: true },
        { key: 3, label: `发送时间`, visible: true },
        { key: 4, label: `发送状态`, visible: true },
        { key: 6, label: `操作`, visible: true }
      ],
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
      // 邮件记录表格数据
      mailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sender: undefined,
        receivers: undefined,
        subject: undefined,
        content: undefined,
        sendDate: undefined,
        cc: undefined,
        bcc: undefined,
        status: undefined,
        error: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sender: [
          { required: true, message: "发送人不能为空", trigger: "blur" },
        ],
        receivers: [
          { required: true, message: "收件人不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        sendDate: [
          { required: true, message: "发送时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    stausFormatter: function (row) {
      if (row.status == "0") {
        return "失败";
      }
      if (row.status == "1") {
        return "成功";
      }
    },
    /** 查询邮件记录列表 */
    getList() {
      this.loading = true;
      listMail(this.queryParams).then((response) => {
        this.mailList = response.rows;
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
        mailId: undefined,
        sender: undefined,
        receivers: undefined,
        subject: undefined,
        content: undefined,
        sendDate: undefined,
        cc: undefined,
        bcc: undefined,
        status: "0",
        error: undefined,
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
      this.ids = selection.map((item) => item.mailId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 浏览按钮操作 */
    find(row) {
      this.reset();
      const mailId = row.mailId || this.ids;
      getMail(mailId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "浏览邮件记录";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const mailIds = row.mailId || this.ids;
      this.$confirm('是否确认删除该条邮件记录"', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMail(mailIds);
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
      this.$confirm("是否确认导出所有邮件记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMail(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>