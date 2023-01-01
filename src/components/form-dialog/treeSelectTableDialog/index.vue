<template>
  <!-- 树形图+表格分页弹窗[搜索+表格+分页] -->
  <div class="container">
    <el-dialog
      v-if="visible"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <div>
        <el-row :gutter="10">
          <!-- 左边 -->
          <el-col :span="6">
            <el-row :gutter="10" class="pad-b-10">
              <el-col :span="12">
                <el-input v-model="searchCompany" placeholder="请输入"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="searchCompanyHandler"
                  >机构查询</el-button
                >
              </el-col>
            </el-row>
            <div class="tree-container">
              <el-tree
                :data="treeObj.data"
                :props="treeObj.defaultProps"
                @node-click="handleNodeClick"
              ></el-tree>
            </div>
          </el-col>
          <!-- 右边 -->
          <el-col :span="18">
            <el-row :gutter="10" class="pad-b-10">
              <el-col :span="12">
                <el-input
                  v-model="searchName"
                  placeholder="请输入搜索内容"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="searchNameHandler"
                  >人员查询</el-button
                >
              </el-col>
            </el-row>
            <div class="c-189">待选择用户</div>
            <el-table
              :data="tableData"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              height="250"
              :default-expand-all="false"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @row-click="tableRowClickHander"
            >
              <el-table-column
                v-for="(item, index) in tableHeaders"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
              >
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="showTableDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="showTableDialog.visible = false"
          >确 定</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
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
    tableHeaders: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    }
  },
  data() {
    return {
      searchCompany:"",
      searchName: "",
      treeObj: {
        data: [
          {
            label: "一级 1",
            children: [
              {
                label: "二级 1-1",
                children: [
                  {
                    label: "三级 1-1-1"
                  }
                ]
              }
            ]
          },
          {
            label: "一级 2",
            children: [
              {
                label: "二级 2-1",
                children: [
                  {
                    label: "三级 2-1-1"
                  }
                ]
              },
              {
                label: "二级 2-2",
                children: [
                  {
                    label: "三级 2-2-1"
                  }
                ]
              }
            ]
          },
          {
            label: "一级 3",
            children: [
              {
                label: "二级 3-1",
                children: [
                  {
                    label: "三级 3-1-1"
                  }
                ]
              },
              {
                label: "二级 3-2",
                children: [
                  {
                    label: "三级 3-2-1"
                  }
                ]
              }
            ]
          }
        ],
        defaultProps: {
          children: "children",
          label: "label"
        }
      }
    };
  },
  methods: {
    // 搜索框(机构)
    searchCompanyHandler() {
      this.$emit("searchCompany", this.searchCompany);
    },
    // 搜索框（人员）
    searchNameHandler() {
      this.$emit("searchName", this.searchName);
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
    // 当前页面数修改
    handleCurrentChange(currentPage) {
      this.$emit("currentPageChange", currentPage);
    },
    // 每页几条修改
    handleSizeChange(pageSize) {
      this.$emit("pageSizeChange", pageSize);
    },
    // 树形节点的点击事件
    handleNodeClick(node) {
      this.$emit('treeNodeClick',node)
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-container{
  height: 250px;
  overflow: auto;
}
</style>
