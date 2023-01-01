<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否打卡" prop="isPunch">
        <el-select v-model="queryParams.isPunch" placeholder="是否打卡" clearable size="small">
          <el-option
            v-for="dict in isPunchOptions"
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
          v-hasPermi="['punchInfo:punch:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['punchInfo:punch:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['punchInfo:punch:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['punchInfo:punch:export']"
        >导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-error" size="mini" @click="noClockInMethod" :disabled="multiple">不打卡</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-success" size="mini" @click="clockInMethod" :disabled="multiple">打卡</el-button>
      </el-col>


    </el-row>

    <el-table v-loading="loading" :data="punchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="打卡常用位置" align="center"  prop="positionName" />
      <el-table-column label="打卡最大停顿时间（秒）" align="center" prop="sleepTime" />
      <el-table-column label="是否打卡" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isPunch"
            active-value="1"
            inactive-value="0"
            @change="reversePunchMethod(scope.row)"
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

    <!-- 添加或修改打卡人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item label="打卡位置" prop="positionId">
          <el-select
            v-model="form.positionId"
          >
            <el-option
              v-for="dict in positionOptions"
              :key="dict.id"
              :label="dict.siteName"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要打卡">
          <el-radio-group v-model="form.isPunch">
            <el-radio
              v-for="dict in isPunchOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打卡停顿最大时间（秒）" prop="sleepTime">
          <el-input v-model="form.sleepTime" placeholder="请输入停顿时间" v-only-number="{max:120,min:0,precision:0}"/>
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
import { listPunchPerson, getPunchPerson, delPunchPerson,
  addPunchPerson, updatePunchPerson, exportPunchPerson,reversePunch,changePunchStatue } from "@/api/punchInfo/punch";
import { listPunchPosition } from "@/api/position/punch";
export default {
  name: "Punch",
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
      // 打卡人信息表格数据
      punchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 0不需要打卡，1需要打卡字典
      isPunchOptions: [],
      positionOptions: [],//打卡位置
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: '',
        phone: '',
        password: '',
        positionId: '',
        isPunch: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] }
        ],
        phone:[{required: true, message: '联系电话不能为空', trigger: 'blur' },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的联系电话",
            trigger: "blur"
          }],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] }
        ],
        positionId: [
          { required: true, message: '打卡位置不能为空', trigger: ['change'] }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("is_punch").then(response => {
      this.isPunchOptions = response.data;
    });
    this.getPositionList();
  },
  methods: {
    // 合同类别字典 翻译
    contractTypeFormat(row, column) {
      return this.selectDictLabel(this.contractTypeOptions, row.contractType);
    },
    getPositionList() {
      let param={
        pageNum: 1,
        pageSize: 100,
      }
      listPunchPosition(param).then(response => {
        this.positionOptions = response.rows;
      });
    },
    /** 查询打卡人信息列表 */
    getList() {
      this.loading = true;
      listPunchPerson(this.queryParams).then(response => {
        this.punchList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 0不需要打卡，1需要打卡字典翻译
    isPunchFormat(row, column) {
      return this.selectDictLabel(this.isPunchOptions, row.isPunch);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        phone: undefined,
        password: undefined,
        positionId: undefined,
        isPunch: "0"
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 打卡
    clockInMethod(row){
      changePunchStatue(this.ids,1).then(res => {
        if (res.code === 200) {
          this.$message({type: "success", message: '操作成功'+"!",});
          this.getList();
        } else {
          this.$message({type: "error", message: '操作失败'+"!",});
        }
      });
    },
    // 不打卡
    noClockInMethod(row){
      changePunchStatue(this.ids,0).then(res => {
        if (res.code === 200) {
          this.$message({type: "success", message: '操作成功'+"!",});
          this.getList();
        } else {
          this.$message({type: "error", message: '操作失败'+"!",});
        }
      });
    },

    //反转 打卡状态
    reversePunchMethod(row){
      reversePunch(row.id).then(res => {
        if (res.code === 200) {
          this.$message({type: "success", message: '操作成功'+"!",});
          this.getList();
        } else {
          this.$message({type: "error", message: '操作失败'+"!",});
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加打卡人信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPunchPerson(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改打卡人信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePunchPerson(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPunchPerson(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除打卡人信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPunchPerson(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有打卡人信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPunchPerson(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
