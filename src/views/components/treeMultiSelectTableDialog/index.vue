<template>
  <!-- 树形图+表格分页弹窗[搜索+表格+分页] -->
  <div class="container">
    <el-dialog
      v-if="visible"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <div>
        <el-row :gutter="10">
          <!-- 左边 -->
          <el-col :span="6">
            <el-row>
              <el-input
                v-model="searchDeptValue"
                @input="searchDept"
                placeholder="请输入部门名称"
                prefix-icon="el-icon-search"
                size="small"
                style="margin-bottom: 10px"
              ></el-input>
            </el-row>

            <div class="tree-container">
              <el-tree
                ref="deptTree"
                lazy
                v-show="!isSearching"
                :style="{
                  overflow: 'auto'
                }"
                :highlight-current="true"
                :load="eltreeLoadNode"
                :props="defaultProps"
                node-key="deptId"
                :default-expanded-keys="['0000000000']"
                @node-click="handleNodeClick"
                class="filter-tree"
              />
              <div v-show="isSearching" class="dept-list">
                <div v-if="searchDeptList.length > 0" class="has-data">
                  <div
                    v-for="(item, index) in searchDeptList"
                    :key="index"
                    @click="handleNodeClick(item)"
                  >
                    {{ item.deptName }}
                  </div>
                </div>
                <div v-else class="no-data">暂无数据</div>
              </div>
            </div>
          </el-col>
          <!-- 右边 -->
          <el-col :span="18">
            <el-row :gutter="10" class="pad-b-10">
              <el-col :span="12">
                <el-input
                  v-model="formLabelAlign.userName"
                  placeholder="请输入用户名称"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="searchNameHandler"
                  >人员查询</el-button
                >
              </el-col>
            </el-row>
            <div v-if="selectedUserList.length > 0" class="tagWrap">
              <span class="c-189"> 已选择用户：</span>
              <el-tag
                style="margin-right:10px;margin-bottom:10px"
                :key="tag.userId"
                v-for="tag in selectedUserList"
                closable
                :disable-transitions="false"
                @close="handleCloseTagItem(tag)"
              >
                {{ tag.userName }}
              </el-tag>
            </div>

              <!-- height="265" -->
            <el-table
              :data="tableData"
              style="width: 100%;margin-bottom: 20px;overflow: auto;"
              v-loading="listLoading"
              :height="tabalHeight"
              element-loading-text="Loading"
            >
              <el-table-column
                align="center"
                label="用户编码"
                prop="userId"
              ></el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
                label="用户名称"
                prop="userName"
              ></el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
                label="部门"
                prop="deptName"
              >
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.dept" :key="index">{{
                    item.deptName
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="80"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-row>
                    <el-col>
                      <el-button
                        type="success"
                        size="mini"
                        plain
                        @click="checkUser(scope.row, scope.$index)"
                        >{{!scope.row.checkState ? '选择' : '取消选择'}}</el-button
                      >
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              :background="true"
              :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import { _debounce } from "@/utils/public";
export default {
  model: {
    prop: "checkedCode",
    event: "emitValue"
  },
  props: {
    title: {
      type: String,
      default: "弹窗"
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "80%"
    },
    selectedUserList: {
      // 选择的用户列表
      type: Array,
      default: () => []
    },
    isMultipleChoice: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      /** 查询部门 */
      isSearching: false, // 是否处于查询部门状态
      searchDeptValue: "", // 查询部门
      searchDeptList: [], // 查询到的部门列表
      searchDeptById: "", // 根据部门ID查询用户列表
      /** 查询人员 */
      formLabelAlign: {
        userName: ""
      },
      /** tree */
      defaultProps: {
        label: "deptName",
        children: "zones",
        isLeaf: "leaf"
      },
      /** table */
      listLoading: true,
      tableData: [],
      /** Pagination */
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tabalHeight: 0, // 表格高度
    };
  },
  created() {
    // console.log('created的时候初始化数据',this)
    // this.fetchData();
  },
  mounted () {
    this.getTabaleHeight()
  },
  methods: {
    // 
    // 获取表格动态高度
    getTabaleHeight () {
      this.$nextTick(() => {
        // 头部高度 54
        // 人员查询搜索框高度 10 + 16
        // 表格的下边距 20
        // 分页的上下内边距和行高 16 + 4
        // 按钮的高度 10 + 20 + 16
        const windowHeight = document.documentElement.clientHeight
        const offSetHeight = 54 + 26 + 20 + 20 + 36 + 160
        this.tabalHeight = windowHeight - offSetHeight + 'px'
      })
    },
    initData(){
      this.isSearching = false;
      this.searchDeptValue = '';
      // this.searchDeptList = [];
      this.searchDeptById = '';
      this.formLabelAlign.userName = '';

      this.tableData = [];

      this.currentPage = 1;
      this.pageSize =10;
      this.total = 0;
    },
    // 弹窗展示的时候，初始化页面
    resetPage(){
      this.initData();
      // this.searchDept();
      this.fetchData();
    },
    /** 查询部门 */
    searchDept: _debounce(function(_type, index, item) {
      if (this.searchDeptValue !== "") {
        request({
          url: `/system/dept/list?deptName=${this.searchDeptValue}`,
          method: "GET"
        }).then(res => {
          if (res.code === 200) {
            this.searchDeptList = res.rows;
            this.isSearching = true;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
      } else {
        this.isSearching = false;
      }
    }, 500),
    /** el-tree懒加载 */
    eltreeLoadNode(node, resolve) {
      // // 如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.eltreeLoadfirstnode(resolve);
      }
      // 如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.eltreeLoadchildnode(node, resolve);
      }
    },

    /** el-tree初始化一级节点 */
    eltreeLoadfirstnode(resolve) {
      let $this = this;
      request({
        url: "/system/dept/parentNode",
        method: "GET"
      }).then(res => {
        if (res.code === 200) {
          return resolve([res.data]);
        } else {
          this.$message({
            type: "error",
            message: "获取根节点部门失败!"
          });
        }
      });
    },

    /** el-tree加载节点的子节点集合 */
    eltreeLoadchildnode(node, resolve) {
      request({
        url: `/system/dept/find/${node.data.deptId}`,
        method: "GET"
      }).then(res => {
        if (res.code === 200) {
          return resolve(res.data);
        } else {
          this.$message({
            type: "error",
            message: "获取子部门树失败!"
          });
        }
      });
    },
    // 搜索框（人员）
    searchNameHandler() {
      this.currentPage = 1;
      this.fetchData();
    },
    handleCloseTagItem(tag) {
      let findIndex = this.selectedUserList.findIndex(
        item => item.userId === tag.userId
      );
      this.tableData.forEach((item, index, arr) => {
        if (item.userId === tag.userId) {
          arr[index].checkState = false
        }
      })
      this.selectedUserList.splice(findIndex, 1);
    },
    // 点击提交
    submit() {
      if (this.selectedUserList.length !== 0) {
        this.selectedUserList.forEach(item => {
          this.$delete(item, 'checkState')
        })
      }
      console.log("选中的人员", this.selectedUserList);
      this.$emit("updateUserList", this.selectedUserList);
      this.handleClose();
    },
    // table的某一行点击
    tableRowClickHander(row) {
      this.$emit("selectItem", row);
      this.handleClose();
    },
    // 右上角关闭按钮
    handleClose() {
      this.$emit("update:visible", false);
    },
    // 点击列表用户按钮
    checkUser (rowData, index) {
      !rowData.checkState ? this.addUserItem(rowData, index) : this.handleCloseTagItem(rowData)
    },
    /** 表格选中项发生改变 */
    addUserItem(val, index) {
      if (this.isMultipleChoice) {
        this.selectedUserList.push(val)
      } else {
        this.selectedUserList.splice(0, 1, val)
        this.tableData.forEach(item => item.checkState = false)
      }
      this.tableData[index].checkState = true
    },
    /** 当前页改变 */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    /** 每页条数改变 */
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    /** 点击el-tree树节点更新用户列表 */
    async handleNodeClick(data) {
      this.searchDeptById = data.deptId;
      this.fetchData();
    },
    /** 获取表格数据接口 */
    fetchData() {
      // return;
      this.listLoading = true;
      let params = {};
      params.userName = this.formLabelAlign.userName;
      // params.userId = this.formLabelAlign.userId;
      params.pageNum = this.currentPage - 1;
      params.pageSize = this.pageSize;
      params.deptIdStr = this.searchDeptById;
      params.status = 0
      params.delFlag = 0
      // params.status = this.formLabelAlign.status;
      request({
        url: "/system/user/brief/list",
        method: "GET",
        params
      }).then(res => {
        if (res.code === 200) {
          this.listLoading = false;
          if (res.rows) {
            this.tableData = res.rows.map(item => ({
              ...item,
              checkState: false
            }))
          } else {
            this.tableData = []
          }
          this.total = res.total;
          this.fileUserSelect()
        } else {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: "获取用户列表失败!"
          });
        }
      });
    },
    fileUserSelect () {
      if (this.selectedUserList.length !== 0) {
        this.selectedUserList.forEach(selectItem => {
          this.tableData.forEach((tableItem, index, arr) => {
            if (selectItem.userId === tableItem.userId) {
              this.tableData[index].checkState = true
            }
          })
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-container {
  height: 310px;
  overflow: auto;
}
.el-dialog__body { padding: 10px 20px; }
.dept-list .has-data div{
  margin-bottom: 5px;
  background-color: #f8f8f9;
  padding: 10px;
}
.tagWrap { overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
</style>
