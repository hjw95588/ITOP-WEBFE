<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="menuQureyParms" class="queryParent" label-width="80px" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName" class="el-item-two">
        <el-input
          v-model.trim="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="visible" class="el-item-two">
        <el-select v-model="queryParams.visible" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in visibleOptions"
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
    <div class="dataWrap">
      <div class="fnButon">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd(null)" v-hasPermi="['system:menu:add']">新增</el-button>
        <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
      </div>
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160" v-if="columns[0].visible"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100" v-if="columns[1].visible">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60" v-if="columns[2].visible"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" v-if="columns[3].visible"></el-table-column>
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" v-if="columns[4].visible"></el-table-column>
        <el-table-column prop="visible" label="可见" :formatter="visibleFormat" width="80" v-if="columns[5].visible"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="columns[7].visible">
          <template slot-scope="scope">
            <el-button size="mini" 
              type="text" 
              icon="el-icon-edit" 
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:menu:edit']"
            >修改</el-button>
            <el-button 
              size="mini" 
              type="text" 
              icon="el-icon-plus" 
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:menu:add']"
            >新增</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:menu:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :append-to-body="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M" :disabled="addOrChange === 1 && (form.menuType === 'C' || form.menuType === 'F')">目录</el-radio>
                <el-radio label="C" :disabled="addOrChange === 1 && form.menuType === 'F'">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model.trim="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model.trim="form.orderNum" controls-position="right" :min="0" :max="999" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="路由地址" prop="path">
              <el-input v-model.trim="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model.trim="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'" label="菜单状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model.trim="form.perms" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
  name: "Menu",
  components: { Treeselect, IconSelect },
  data() {
    // 自定义顺序验证
    const orderNumSort = (rule, value, cb) => {
      const sortReg = /^[0-9]*[0-9][0-9]*$/
      if (!sortReg.test(String(value))) {
        cb(new Error('菜单顺序不能输入小数'))
      }
      cb()
    }
    return {
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `菜单名称`, visible: true },
        { key: 1, label: `图标`, visible: true },
        { key: 2, label: `排序`, visible: true },
        { key: 3, label: `权限标识`, visible: true },
        { key: 4, label: `组件路径`, visible: true },
        { key: 5, label: `可见`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
        { key: 7, label: `操作`, visible: true }
      ],
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单状态数据字典
      visibleOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
          { max: 50, message: '菜单名称最多输入50个字符' }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
          { validator: orderNumSort, trigger: 'blur' }
        ],
        component: [
          { max: 200, message: '路由地址最多输入200个字符' }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
          { max: 200, message: '路由地址最多输入200个字符' }
        ]
      },
      // 标记是新增还是修改
      addOrChange: 0 // 0：表格左上角新增 1：行内新增 2：修改
     };
  },
  created() {
    this.getList();
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "menuId");
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.menuQureyParms.resetFields();
      this.getList();
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    // 菜单显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType == "F") {
        return "";
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        visible: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.addOrChange = 1
        this.form.menuType = row.menuType
        this.form.parentId = row.menuId;
      } else {
        this.addOrChange = 0
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.addOrChange = 2
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.menuType === 'F' && (this.form.icon = '')
          if (this.form.menuId != undefined) {
            updateMenu(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMenu(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
          this.addOrChange = 0
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMenu(row.menuId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>