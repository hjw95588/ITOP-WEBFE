<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="定位简称" prop="siteName">
        <el-input
          v-model="queryParams.siteName"
          placeholder="请输入定位简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入纬度"
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
          v-hasPermi="['position:punch:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['position:punch:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['position:punch:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['position:punch:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="punchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="定位简称" align="center" prop="siteName" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="地址" align="center" prop="addr" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['position:punch:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['position:punch:remove']"
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

    <!-- 添加或修改打卡需要的常用位置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="定位简称" prop="siteName">
          <el-input
            placeholder="请选择定位"
            v-model="form.siteName"
          >
            <el-button slot="append" @click="openMap" >选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <MapDialog :mapVisible="mapVisible" v-on:mapLocationClose="mapLocationClose"
               v-on:mapLocationSave="mapLocationSave"></MapDialog>

  </div>
</template>

<script>
import { listPunchPosition, getPunchPosition, delPunchPosition,
  addPunchPosition, updatePunchPosition, exportPunchPosition } from "@/api/position/punch";
import MapDialog from '../components/MapDialog.vue'
export default {
  name: "Punch",
  components: {
    MapDialog
  },
  data() {
    return {
      mapVisible:false,
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
      // 打卡需要的常用位置表格数据
      punchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        siteName: '',
        longitude: '',
        latitude: '',
        addr: ''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        siteName: [
          { required: true, message: '定位简称不能为空', trigger: ['blur', 'change'] }
        ],
        longitude: [
          { required: true, message: '经度不能为空', trigger: ['blur', 'change'] }
        ],
        latitude: [
          { required: true, message: '纬度不能为空', trigger: ['blur', 'change'] }
        ],
        addr: [
          { required: true, message: '地址不能为空', trigger: ['blur', 'change'] }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openMap(){
      this.mapVisible = true
      // this.$nextTick(() => {
      //   this.mapVisible = true
      // })
    },
    mapLocationClose(){
      this.mapVisible = false
    },
    mapLocationSave(e){
      debugger;
      this.$set(this.form, 'siteName', e.address);
      this.$set(this.form, 'longitude', e.longitude);
      this.$set(this.form, 'latitude', e.latitude);
      this.$set(this.form, 'addr', e.address);
      this.mapVisible = false
    },
    /** 查询打卡需要的常用位置列表 */
    getList() {
      this.loading = true;
      listPunchPosition(this.queryParams).then(response => {
        this.punchList = response.rows;
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
        id: undefined,
        siteName: undefined,
        longitude: undefined,
        latitude: undefined,
        addr: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加打卡需要的常用位置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPunchPosition(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改打卡需要的常用位置";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePunchPosition(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPunchPosition(this.form).then(response => {
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
      this.$confirm('是否确认删除打卡需要的常用位置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPunchPosition(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有打卡需要的常用位置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPunchPosition(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
