<template>
  <div class="app-container">
    <el-form :class="['queryParent', controlRoleQuery?'evenItmes':'']" :model="queryParams" ref="queryForm" label-width="80px"
      v-show="showSearch"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model.trim="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model.trim="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" v-show="controlRoleQuery">
        <el-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="query-item">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="text" v-stowExpand="['controlRoleQuery']"
          >{{controlRoleQuery ? '收起' : '展开'}}<i :class="[controlRoleQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down', 'el-icon--right']"></i></el-button>
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
            v-hasPermi="['system:role:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:role:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:role:export']"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-checkbox v-model="isShowDelRole" border v-hasPermi="['system:role:query']">显示已删除角色</el-checkbox>
        </el-col>
        <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
      </el-row>
      <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" v-if="columns[0].visible" />
        <el-table-column label="角色编号" prop="roleId" width="120" v-if="columns[1].visible" />
        <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" v-if="columns[2].visible"/>
        <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" v-if="columns[3].visible"/>
        <el-table-column label="显示顺序" prop="roleSort" width="100" v-if="columns[4].visible"/>
        <el-table-column label="状态" align="center" width="100" v-if="columns[5].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
              v-hasPermi="['system:role:deactivate']"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[6].visible">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="columns[7].visible">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-show="scope.row.delFlag === '0'"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:role:edit']"
            >修改</el-button>
            <el-button
              v-show="scope.row.delFlag === '0'"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"
            >删除</el-button>
            <el-button
              v-show="scope.row.delFlag === '2'"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleRecovery(scope.row)"
              v-hasPermi="['system:role:edit']"
            >恢复</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-user"
              v-show="scope.row.delFlag === '0'"
              @click="handleUser(scope.row)"
              v-hasPermi="['system:role:edit']"
              >分配用户</el-button
            > -->
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" :close-on-click-modal="false" :before-close="cancelDataScope" :append-to-body="true">
      <el-tabs v-model="activeName">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="first">
          <div style="text-align:right;width:100%;margin-bottom:10px; ">
           <el-button size="mini" type="text" icon="el-icon-edit" v-show="isBasicInformationEdit" @click="isBasicInformationEdit=false">编辑</el-button>
           <el-button size="mini" type="text" icon="el-icon-finished" v-show="!isBasicInformationEdit" @click="submitForm">保存</el-button>
           <el-button size="mini" type="text" icon="el-icon-refresh-right" v-show="!isBasicInformationEdit" @click="cancel('information')">取消</el-button>
          </div>  
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model.trim="form.roleName" :disabled="isBasicInformationEdit" placeholder="请输入角色名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">  
                <el-form-item label="权限字符" prop="roleKey">
                  <el-input v-model="form.roleKey" :disabled="isBasicInformationEdit" placeholder="请输入权限字符" />
                </el-form-item>
              </el-col> 
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="角色顺序" prop="roleSort">
                  <el-input-number v-model="form.roleSort" :disabled="isBasicInformationEdit" controls-position="right" :min="0" :max="999" />
                </el-form-item>
              </el-col>  
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio
                    :disabled="isBasicInformationEdit"
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}</el-radio>
                  </el-radio-group>
                </el-form-item>
             </el-col> 
            </el-row>    
            <el-row>
              <el-form-item label="备注">
                <el-input v-model.trim="form.remark" type="textarea" :disabled="isBasicInformationEdit" maxlength="500" show-word-limit placeholder="请输入内容"></el-input>
              </el-form-item> 
              </el-row> 
            </el-form>
        </el-tab-pane>

        <!-- 权限管理 -->
        <el-tab-pane label="权限管理" name="second" :disabled="keepForm.roleId?false:true">
          <div>
            <div class="roleLeft">
              <h4 class="menuTitle">
                <span>菜单权限</span>
                <el-button size="mini" type="text" icon="el-icon-edit" v-show="!isMenuEdit" @click="menuEdit(form.roleId)">编辑</el-button>
                <el-button size="mini" type="text" icon="el-icon-finished" v-show="isMenuEdit" @click="submitForm('tree')">保存</el-button>
                <el-button size="mini" type="text" icon="el-icon-refresh-right" v-show="isMenuEdit" @click="cancel('tree')">取消</el-button>
              </h4>
              <div class="noMargin">
                <!-- :show-checkbox="isCanEdit" -->
                <el-tree 
                  v-show="isMenuEdit"
                  :data="menuOptions"
                  show-checkbox
                  ref="menu"
                  node-key="id"
                  empty-text="加载中，请稍后"
                  :props="defaultProps"
                ></el-tree>
                <el-tree
                  v-show="!isMenuEdit"
                  :data="checkedMenuOptions"
                  highlight-current
                  :show-checkbox="false"
                  ref="menuS"
                  node-key="id"
                  :empty-text="scopeMenuEmpty"
                  :props="defaultProps"
                  @node-click="editCurrentTreeNode"
                >
                </el-tree>
                <div v-show="coverShow" class="cover" @click="msgError(dataScopeRadio=='2'?'请选择绑定部门':'内容不能为空')"></div>
              </div>
            </div>
            <div class="roleRight">
              <div class="roleRight_T" v-if="isCanEditDataScope">
                <h4 class="menuTitle">
                  <span>操作权限</span>
                  <el-button size="mini" type="text" icon="el-icon-edit" v-show="isBtnEdit" @click="edit('btnEdit')">编辑</el-button>
                  <el-button size="mini" type="text" icon="el-icon-finished" v-show="!isBtnEdit" value="btn" @click="submitForm('btn')">保存</el-button>
                  <el-button size="mini" type="text" icon="el-icon-refresh-right" v-show="!isBtnEdit" @click="cancel('btn')">取消</el-button>
                </h4>
               <el-checkbox-group v-model="checkedKeysAllList" :disabled="isBtnEdit" style="margin-left:20px;">
                <el-checkbox v-for="(item,index) in btnMenus[editCurTreeId]" :key="index" :label="item.menuId">{{item.menuName}}</el-checkbox>
              </el-checkbox-group>
              </div>
              <div class="roleRight_B" v-if="isCanEditDataScope">
                <h4 class="menuTitle">
                  <span>数据权限</span>
                  <el-button size="mini" type="text" icon="el-icon-edit" v-show="isRoleEdit" @click="edit('roleEdit')">编辑</el-button>
                  <el-button size="mini" type="text" icon="el-icon-finished" v-show="!isRoleEdit" @click="submitDataScope">保存</el-button>
                  <el-button size="mini" type="text" icon="el-icon-refresh-right" v-show="!isRoleEdit" @click="cacheEditeCancel">取消</el-button>
                </h4>
                <el-form :model="deptForm" :rules="deptRules" label-width="100px">
                  <el-form-item class="noMargin">
                    <el-radio-group v-model="dataScopeRadio" @change="changeHandler">
                      <el-radio class="dataPowerRadio" :disabled="isRoleEdit" v-for="dataItem in dataScopeOptions" :key="dataItem.value" :label="dataItem.value">{{dataItem.label}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="绑定部门" size="small" prop="selectDeptsArr" v-if="dataScopeRadio === '2'">
                    <Treeselect
                     :disabled="isRoleEdit"
                      :propValue.sync="selectDeptsArr"
                      @selectUnit="selectUnit"
                      :multiple="true"
                    ></Treeselect>
                  </el-form-item>
                  <el-form-item label-width="70px" label="内容" size="small" prop="SQLCon" v-if="dataScopeRadio === '6'">
                     <el-input v-model.trim="deptForm.SQLCon" :disabled="isRoleEdit" @input="SQLConChange" type="textarea" maxlength="200" show-word-limit placeholder="请输入" />
                  </el-form-item>
                </el-form>
              </div>
              <el-empty v-if="!isCanEditDataScope" :image-size="40" description="请先选择菜单"></el-empty>
            </div>
          </div>
        </el-tab-pane>

        <!-- 分配用户 -->
        <el-tab-pane label="分配用户" name="third" :disabled="keepForm.roleId?false:true">
          <user-table v-if="activeName=='third'" ref="userTable" :keepForm="keepForm" @addFormUserList="addFormUserList"/>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer">
        <el-button @click="cancelDataScope">关 闭</el-button>
      </div> 
    </el-dialog>

   
    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（开始） -->
    <tree-multi-select-table-dialog
      ref="treeSelecteGroupNameDialog"
      :title="treeSelectTableDialog.title"
      :visible.sync="treeSelectTableDialog.visible"
      :selectedUserList="treeSelectTableDialog.selectedUserList"
      @updateUserList="updateUserList"
    ></tree-multi-select-table-dialog>
    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（结束） -->

  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus} from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";
import Treeselect from "@/views/components/Treeselect/index";
import deepClone from "clone-deep";
import UserTable from "./components/UserTable.vue"
export default {
  name: "Role",
  components: {
    TreeMultiSelectTableDialog,
    Treeselect,
    UserTable
  },
  data() {
    // 自定义顺序验证
    const validateRoleSort = (rule, value, cb) => {
      const sortReg = /^[0-9]*[0-9][0-9]*$/
      if (!sortReg.test(String(value))) {
        cb(new Error('角色顺序不能输入小数'))
      }
      cb()
    };
   const validateSQL= (rule, value, cb) => {
      if (value=='') {
        this.msgError("内容不能为空");
      }
      cb()
    };
    return {
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        selectedUserList: [], // "添加/编辑流程节点组---添加审批人员"弹窗的userList
      },
      controlRoleQuery: false, // 控制搜索条件
      // 显示搜索条件
      showSearch: true,
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 分配权限菜单为空时提示语
      scopeMenuEmpty: '加载中，请稍后',
      // 是否显示弹出层（分配用户）
      openUserScope: false,
      // 日期范围
      dateRange: [],
      // 是否显示已删除角色
      isShowDelRole: false,
      // 状态数据字典
      statusOptions: [],
      // 列信息
      columns: [
        { key: 0, label: `角色编号`, visible: true },
        { key: 1, label: `角色名称`, visible: true },
        { key: 2, label: `权限字符`, visible: true },
        { key: 3, label: `手机号码`, visible: true },
        { key: 4, label: `显示顺序`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
        { key: 7, label: `操作`, visible: true }
      ],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "3",
          label: "一级部门数据权限"
        },
        {
          value: "4",
          label: "二级部门数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        },
        {
          value: "2",
          label: "自定义数据权限"
        },
         {
          value: "6",
          label: "开发者数据权限"
        }
      ],
      // 表单参数
      dataScopeRadio: '1',// 数据权限选择数据
      unwatchCurScopeId: null, // 监控当前选择权限radio
      unwatchScopeDept: null, // 监控当前选择权限radio
      unwatchScopeSQL:null,//监控当前选择权限radio
      // 是否可编辑数据权限
      isCanEditDataScope: false,
      curRoleId: '', // 当前编辑的角色ID
      // 控制部门选择显示与否
      deptTree: {
        isShowDeptTree: false,
        // 数据权限为自定义时，选择的部门
        selectDepts: [],
      },
      // 缓存编辑过操作按钮的菜单集合
      cacheEditedMenus: [],
      // =数据权限-当前编辑菜单ID
      editCurTreeId: 0,
      // 菜单列表
      menuOptions: [],
      menuIds:[],//menusNoLeaf下所有菜单id
      // 权限修改树形菜单
      checkedMenuOptions: [],
      // 存储筛选数据
      emptyArr: [],
      // 回显的部门
      depteEchoArr: [],
      // 部门选择展示是数据
      selectDeptsArr: [],
      //开发者数据权限数据
      deptForm:{
        SQLCon:'',
      },
      
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        delFlag: 0 // 删除状态0：未删除 2：已删除
      },
      // 取消监控
      unwatch: null,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
       activeName: 'first',
       isMenuEdit:true,//菜单是否为可编辑状态
       isRoleEdit:true,//数据权限是否为可编辑状态
       isBtnEdit:true,//操作权限按钮是否为可编辑状态
       isBasicInformationEdit:false,//基本信息是否为可编辑状态
       keepForm:{},//保存初始状态的表单内容
       keepCacheEditedMenus:[],//初始数据权限
       coverShow:false,//菜单权限蒙层
       checkList:[],//菜单多选
       btnMenus:[],//菜单按钮
       checkedKeysAll:[],//操作权限多选(初始)
       checkedKeysAllList:[],//操作权限多选
       noChildrenMenuId:[],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" },
          { validator: validateRoleSort, trigger: 'blur' }
        ]
      },
      deptRules:{
         selectDeptsArr: [
          { required: true, trigger: "change" }
        ],
        SQLCon: [
          { required: true,validator: validateSQL, trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.unwatch = vm.$watch('isShowDelRole', (newVal, oldVal) => {
        vm.queryParams.delFlag = newVal ? 2 : 0;
        vm.getList()
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    this.unwatch && this.unwatch()
    next()
  },
  computed: {
    dataScopeDepts () {
      return [...this.selectDeptsArr]
    },
    dataScopeSQL () {
      return this.deptForm.SQLCon
    },
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys.map(Number);
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return new Promise ((resolve, reject) => {
        roleMenuTreeselect(roleId).then(response => {
          if (response.code === 200) {
            this.menuOptions = response.menus;
            resolve(response.checkedKeys)
          }
        });
      })
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        this.$refs.dept.setCheckedKeys(response.checkedKeys);
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.roleId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮(基本信息、菜单权限、操作权限)
    cancel(type) {
      let _this=this
      _this.$confirm('确认要放弃此次编辑吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        if(type=='btn'){
            _this.checkedKeysAllList= _this.checkedKeysAll;
            _this.isBtnEdit= !_this.isBtnEdit;
        }else if(type=='tree'){
            _this.checkedKeysAllList=_this.checkedKeysAll;
            _this.isMenuEdit=!_this.isMenuEdit
        }else{
          _this.form=deepClone(_this.keepForm)
          if(_this.title=="新增"){
            _this.isBasicInformationEdit=false
          }else{
          _this.isBasicInformationEdit=true
          }
        }
      })
    },
    // 取消按钮（数据权限）
    cacheEditeCancel(){
       let _this=this
      _this.$confirm('确认要放弃此次编辑吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          _this.isRoleEdit=true
          _this.coverShow=false
          _this.cacheEditedMenus=deepClone(_this.keepCacheEditedMenus)
          _this.cacheEditedMenus.forEach(item => {
          if (_this.editCurTreeId === item.menuId) {
            if (item.menuScope) {
              if (item.menuScope.length === 1 ) {
                _this.dataScopeRadio = item.menuScope
                _this.selectDeptsArr = []
                _this.deptForm.SQLCon=''
              } else if(item.menuScope.indexOf("SQL") != -1) {
                _this.dataScopeRadio = '6'
                _this.deptForm.SQLCon=item.menuScope.split("-")[1]
              }else{
                _this.dataScopeRadio = '2'
                _this.$nextTick(() => {
                  _this.selectDeptsArr = item.selectDeptsArr
                })
              }
            } 
          }
        })
        })
    },
    // 关闭按钮
    cancelDataScope() {
      this.open = false;
      this.selectDeptsArr = []
      this.deptForm.SQLCon=''
      this.cacheEditedMenus = []
      this.emptyArr= []
      this.dataScopeRadio = ''
      this.unwatchCurScopeId=null
      this.reset();

      this.keepCacheEditedMenus=[]
      this.coverShow=false
      this.isRoleEdit=true
      this.checkedMenuOptions=[]
      this.checkList=[]
      this.isBtnEdit=true
      this.getList();
    },

    /**点击菜单节点编辑 */
    editCurrentTreeNode (nodeData, node) {
      this.editCurTreeId = nodeData.id
      if (nodeData.children && nodeData.children.length === 0) {
        this.cacheEditedMenus.forEach(item => {
          if (this.editCurTreeId === item.menuId) {
            if (item.menuScope) {
              if (item.menuScope.length === 1 ) {
                this.dataScopeRadio = item.menuScope
                this.selectDeptsArr = []
                this.deptForm.SQLCon=''
              }  else if(item.menuScope.indexOf("SQL") != -1) {
                this.dataScopeRadio = '6'
                this.deptForm.SQLCon=item.menuScope.split("-")[1]
              }else{
                this.dataScopeRadio = '2'
                this.$nextTick(() => {
                  this.selectDeptsArr = item.selectDeptsArr
                })
              }
            } 
          }
        })
        this.isCanEditDataScope = true
      }
    },
 
    /**切换时先缓存当前编辑 */
    cacheCurMenuFs () {
      this.unwatchCurScopeId = this.$watch('dataScopeRadio', (newVal, oldVal) => {
       
        if (newVal === '2') {
          this.watchSelectRR()
        }else if(newVal === '6'){
            this.watchSelectSQL()
        } else {
          this.cacheEditedMenus.forEach(item => {
            if (item.menuId === this.editCurTreeId) {
              item.menuScope = newVal
              !!this.unwatchScopeDept && this.unwatchScopeDept()
            }
          })
        }
      })
    },
    watchSelectRR () {
      this.unwatchScopeDept = this.$watch('dataScopeDepts',(newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.cacheEditedMenus.forEach(item => {
            if (item.menuId === this.editCurTreeId) {
              item.selectDeptsArr = newVal
              const deptsArr = newVal.map(item => (item = item.id))
              const deptsStr = deptsArr.join.apply(deptsArr)
              item.menuScope = deptsStr
            }
          })
        }
      }, {
        deep: true
      })
    },
    watchSelectSQL () {
      this.unwatchScopeSQL = this.$watch('dataScopeSQL',(newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.cacheEditedMenus.forEach(item => {
            if (item.menuId === this.editCurTreeId) {
              item.menuScope = "SQL-"+newVal
            }
          })
        }
      }, {
        deep: true
      })
    },
    changeHandler(value){
      if((value==2&&this.selectDeptsArr.length==0)||(value==6&&!this.deptForm.SQLCon)){
        this.coverShow=true
      }else{
        this.coverShow=false
      }
    },
    // 选择数据权限部门
    selectUnit (updateData) {
       this.selectDeptsArr = updateData
       this.coverShow=false
      if(this.selectDeptsArr.length==0){
        this.coverShow=true
        this.msgError("请选择绑定部门");
      }
    },
    SQLConChange(val){
      this.deptForm.SQLCon=val
      this.coverShow=false
      if(!this.deptForm.SQLCon){
        this.coverShow=true
        this.msgError("内容不能为空");
      }
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        remark: undefined
      };
      this.keepForm={}
      this.resetForm("form");
      this.resetForm("userform");
      this.activeName='first'
      this.isCanEditDataScope=false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "新增角色信息";
      this.isMenuEdit=true
      this.isBasicInformationEdit=false
      this.checkList=[]
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const self = this
      self.reset();
      self.isBasicInformationEdit=true
      self.isRoleEdit=true
      self.isMenuEdit=false
      self.curRoleId = row.roleId || self.ids[0]
      getRole(self.curRoleId).then(response => {
        self.keepForm=deepClone( response.data)
        self.form = response.data;
        self.open = true;
        self.title = "修改角色信息";
        // self.$nextTick(() => {
        //  self.$refs.userTable.getList()
        // })
      });
      self.handleDataScope(self.curRoleId)
    },
    // 恢复按钮
    handleRecovery (row) {
      const recoveryObj = {
        roleId: row.roleId,
        delFlag: '0'
      }
      updateRole(recoveryObj).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      })
    },
    /** 分配数据权限操作 */
    handleDataScope(roleId) {
      this.cacheEditedMenus = []
       this.noChildrenMenuId=[]
      this.cacheCurMenuFs()
      roleMenuTreeselect(roleId).then(response => {
        if (response.code === 200) {
          if (response.menusNoLeaf.length === 0) {
            this.scopeMenuEmpty = '暂无菜单数据，请配置菜单权限！'
          }
          this.btnMenus=deepClone(response.menusLeaf)
          this.checkedKeysAll=deepClone(response.checkedKeysAll)
          this.checkedKeysAllList=deepClone(response.checkedKeysAll)
          
          const arr = deepClone(response.menusNoLeaf)
          this.checkedMenuOptions = this.transTreeData(arr)
          const checkedMenuIdDeep = deepClone(this.checkedMenuOptions)
          if (response.deptList && response.deptList.length !== 0) {
            this.depteEchoArr = response.deptList.map(item =>({
              ...item,
              id: item.deptId,
              label: item.deptName
            }))
          }
          this.handleDeepData(checkedMenuIdDeep)
          // 深拷贝response.roleMenuList
          const roleMenuList = deepClone(response.roleMenuList)
          // 将response.deptList合并为response.menusNoLeaf中的一个selectDept数组，返回合并后的数组
          const mergeRoleMenuList = this.mergeDepteMenu(this.emptyArr)
          // console.log(mergeRoleMenuList)
          // 将所有出现的末级菜单加入到cacheEditedMenus
          this.addMenuToCachEditMenus(roleMenuList, mergeRoleMenuList)
        // this.openDataScope = true;
        }
      });
    },
    /**处理深层数据-拉平response.menusNoLeaf */
    handleDeepData (arrData) {
      arrData.forEach(item => {
        if (!item.children || item.children.length === 0) {
          this.emptyArr.push.apply(this.emptyArr, [{...item, menuId: item.id}])
          this.menuIds.push(item.id)
        } else {
          this.handleDeepData(item.children)
        }
      })
    },
    /**处理数据 */
    transTreeData (arr) {
      const transArr = arr.map(item => {
        if (item.children && item.children.length !== 0) {
          item.children = this.transTreeData(item.children)
        }else{
          //获取没有子节点的菜单id
          this.noChildrenMenuId.push(item.menuId)
        }
        const obj = {
          id: item.menuId,
          label: item.menuName,
          children: item.children
        }
        return obj
      })
      return transArr
      
    },
    /**合并deptList和roleMenuList */
    mergeDepteMenu (roleMenuLIST) {
      const menuDeptList = roleMenuLIST
      menuDeptList.forEach(item => {
        item.selectDeptsArr = []
        this.depteEchoArr.forEach(el => {
          if (item.menuId === el.menuId) {
            item.selectDeptsArr.push(el)
          }
        })
      })
      return menuDeptList
    },
    /** 将所有出现的末级菜单加入到cacheEditedMenus*/
    addMenuToCachEditMenus(roleMenuList, menusNoList) {
      // return
      menusNoList.forEach(el => {
        roleMenuList.forEach(item => {
          if (item.menuId === el.menuId) {
            if (!item.menuScope || item.menuScope.length === 0) {
              el.menuScope = '1'
            } else {
              el.menuScope = item.menuScope
            }
            this.cacheEditedMenus.push(el)
          }
        })
      })
      this.keepCacheEditedMenus=deepClone(this.cacheEditedMenus)
    },
    /** 提交按钮 */
    submitForm: function(type) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (type === 'tree') {
              let menuIdList = this.getMenuAllCheckedKeys();
              let cloneCheckList = deepClone(this.checkList)
              //console.log('原ids', cloneCheckList, '待提交ids：',menuIdList)
              let delIds = cloneCheckList.filter(item => menuIdList.indexOf(item) === -1)
              //console.log('要删除的ids', delIds)
              //构造函数，数组删除方法
              Array.prototype.delete = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                  this.splice(index, 1);
                }
              };
              for( let i = 0; i< delIds.length; i++ ) {
                if (this.btnMenus.hasOwnProperty([delIds[i]])) {
                  cloneCheckList.delete(delIds[i])
                  //console.log(this.btnMenus[delIds[i]],delIds[i])
                  this.btnMenus[delIds[i]].map(item => {
                    cloneCheckList.delete(item.menuId)
                  })
                }
                if(this.menuIds.includes(delIds[i])){
                  cloneCheckList.delete(delIds[i])
                }
              }
              //console.log('删除id后原ids：', cloneCheckList)
              this.form.menuIds = [...new Set([...cloneCheckList, ...menuIdList])]
            }else if(type=='btn'){
              this.form.menuIds=this.checkedKeysAllList
            }else{
               this.$delete(this.form,'menuIds')
            }
          if (this.form.roleId != undefined) {
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.keepForm=deepClone(this.form)
                if (type === 'tree'){
                  this.isCanEditDataScope=false
                  this.isMenuEdit=false
                  this.handleDataScope(this.form.roleId)
                }else if(type=='btn'){
                  this.isBtnEdit=true
                  this.checkedKeysAll=deepClone(this.form.menuIds)
                }else{
                  this.isBasicInformationEdit=true
                }
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.keepForm=deepClone(response.data)
                this.form=deepClone(response.data)
                this.curRoleId=response.data.roleId
                this.isBasicInformationEdit=true
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if(this.dataScopeRadio=='2'&&this.selectDeptsArr.length==0){
        this.msgError("请选择绑定部门");
        return
      }else if(this.dataScopeRadio=='6'&&!this.deptForm.SQLCon){
        this.msgError("内容不能为空");
        return
      }
      let params=deepClone(this.cacheEditedMenus)
      if (this.curRoleId != undefined) {
         
        params.forEach(item => {
          item.roleId = this.curRoleId
          delete item.selectDeptsArr
        })
        const data = JSON.stringify(params)
        dataScope(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.keepCacheEditedMenus=deepClone(this.cacheEditedMenus)
          //  this.cacheEditedMenus = []
          //  this.selectDeptsArr = []
          //   this.emptyArr= []
         //   this.openDataScope = false;
           this.getList();
           // this.isCanEditDataScope = false
            this.unwatchCurScopeId=null
            this.isRoleEdit=true
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRole(roleIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有角色数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRole(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
   
    // 修改帮定用户
    addFormUserList(userForm) {
      this.$refs.treeSelecteGroupNameDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectTableDialog.selectedUserList = deepClone(
          // 树形弹窗的默认值
          userForm
        );
        this.treeSelectTableDialog.visible = true;
      });
    },
    // 修改”审批人员数据“
    updateUserList(selectedUserList) {
      //console.log(selectedUserList,"selectedUserList")
      this.$nextTick(() => {
        this.$refs.userTable.submitUserScope(selectedUserList)
      });
    },
    
    //编辑菜单权限
    menuEdit(roleId){
      let self=this
      if(self.isBtnEdit==false||self.isRoleEdit==false){
         self.msgError('请确认其他编辑状态已保存');
        return
      }
       if(self.form.roleId){
          self.getRoleMenuTreeselect(roleId).then(res => {
            this.checkList=deepClone(res)
            self.$refs.menu.setCheckedKeys(res);
            self.isMenuEdit=true
          });
        }else{
          self.isMenuEdit=true
        }
     
    },
    //操作权限和数据权限编辑
    edit(val){
      if(this.isMenuEdit==true){
         this.msgError('请先保存菜单权限');
         return
      }
      if(val=="btnEdit"){
        this.isBtnEdit=false
      }else{
        this.isRoleEdit=false
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item.noMargin {
    .el-form-item__content { margin-left: 20px !important;
      .el-radio.dataPowerRadio { display: block; margin-bottom: 10px;
        &:last-child { margin-bottom: 0; }
      }
    }
  }
  .noMargin { 
    position: relative;
    .el-tree { height: 200px; overflow-y: auto;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
    .cover{
      position: absolute;
      height: 200px; 
      top:0;
      right: 0;
      cursor:not-allowed;
      width:100%;
    }
  }
.roleLeft { display: inline-block; width: 35%; padding-right: 10px;  border-right: 1px solid #DCDFE6;
    .menuTitle { display: flex; justify-content: space-between; align-items: center;
      span{
        flex: 1;
      }
      .toggleSpan { font-size: 12px; font-weight: normal;
        .edit { color: #3587f3; cursor: pointer; }
        .success { color: #35f345; }
      }
    }
    .el-form-item { margin-bottom: 10px;}
    &.addRoleClass { width: 100%; border-right: 0; padding-right: 0; }
  }
  .roleRight { display: inline-block; width: 64%; vertical-align: top;padding-left:20px;
    .roleRight_T{
      padding-bottom: 10px;
      border-bottom:1px solid #DCDFE6;
    }
   .menuTitle { display: flex; justify-content: space-between; align-items: center;
      span{
        flex: 1;
      }
    }
    .powerTop { padding-left: 10px; border-bottom: 1px solid #DCDFE6;}
    .powerBottom { padding-left: 10px;}
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
.dialog-footer{
  float: right;
  margin-top: 40px;
}

::v-deep{
  .el-dialog{
    margin: 20px auto;
  }
  .vue-treeselect__menu-container{position: absolute;left: 0;top: -37px !important;}
  .el-empty{
   text-align: center;
   .el-empty__image{
     display: inline-block;
     margin-top: 80px;
   }
  }
}
</style>