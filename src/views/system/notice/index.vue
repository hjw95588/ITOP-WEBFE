<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      label-width="80px"
      class="queryParent"
      v-show="showSearch"
    >
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select
          v-model="queryParams.noticeType"
          placeholder="公告类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          >重置</el-button>
      </el-form-item>
    </el-form>
    <div class="dataWrap">
      <el-row :gutter="10" class="fnButon">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            v-hasPermi="['system:notice:add']"
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
            v-hasPermi="['system:notice:edit']"
            >修改</el-button
          >
        </el-col>
        <!--    <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-close"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:notice:remove']"
          >关闭</el-button>
        </el-col>-->
        <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
      </el-row>
      <el-table
        v-loading="loading"
        :data="noticeList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="序号"
          align="center"
          prop="noticeId"
          width="100"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="公告标题"
          align="center"
          prop="noticeTitle"
          :show-overflow-tooltip="true"
          v-if="columns[1].visible"
        />
        <el-table-column
          label="公告类型"
          align="center"
          prop="noticeType"
          :formatter="typeFormat"
          width="100"
          v-if="columns[2].visible"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          :formatter="statusFormat"
          width="100"
          v-if="columns[3].visible"
        />
        <el-table-column
          label="创建者"
          align="center"
          prop="creator"
          width="100"
          v-if="columns[4].visible"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="100"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:notice:edit']"
              >修改</el-button
            >
            <!--  <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:notice:remove']"
            >关闭</el-button>-->
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" :append-to-body="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                v-model="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送部门" prop="dept">
              <Treeselect
                :disabled="dialogType"
                :propValue.sync="form.dept"
                @selectUnit="selectUnit"
                :multiple="true"
              >
              </Treeselect>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-model="form.status" label="0">正常</el-radio>
                <el-radio v-model="form.status" label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top: 20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNotice,
  getNotice,
  delNotice,
  addNotice,
  updateNotice,
  exportNotice,
} from "@/api/system/notice";
import Editor from "@/components/Editor";
import Treeselect from "../../components/Treeselect/index";
import { _debounce } from "@/utils/public";

export default {
  name: "Notice",
  components: {
    Editor,
    Treeselect,
  },
  data() {
    return {
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `序号`, visible: true },
        { key: 1, label: `公告标题`, visible: true },
        { key: 2, label: `公告类型`, visible: true },
        { key: 3, label: `状态`, visible: true },
        { key: 4, label: `创建者`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
        { key: 6, label: `操作`, visible: true }
      ],
      controlNoticeQuery: false, // 控制搜索
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
      noticeList: [],
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
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined,
      },
      dialogType: false,
      // 表单参数
      form: {
        deptId: null,
        dept: null,
      },
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],

        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_notice_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then((response) => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 选择归属部门 */
    selectUnit(value) {
      this.form.dept = value;
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then((response) => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        dept: null,
        noticeContent: undefined,
        status: "0",
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
      this.ids = selection.map((item) => item.noticeId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.dept = []
      this.open = true;
      this.title = "添加公告";
      this.dialogType = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.dialogType = true;
      const noticeId = row.noticeId || this.ids;
      getNotice(noticeId).then((response) => {
        this.form = response.data;
        response.data.dept.forEach((item) => {
          item.id = item.deptId;
          item.label = item.deptName;
        });
        this.form.dept = response.data.dept;
        this.open = true;
        this.title = "修改公告";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const noticeIds = row.noticeId || this.ids;
      this.$confirm(
        '是否确认删除公告编号为"' + noticeIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delNotice(noticeIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let detpList = [];
          this.form.dept.forEach((item) => {
            detpList.push(item.id);
          });
          this.form.deptId = detpList;
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNotice(this.form).then((response) => {
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
  },
};
</script>
