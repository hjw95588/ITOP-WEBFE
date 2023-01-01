<template>
  <!-- 表格分页弹窗[搜索+表格+分页] -->
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
        <el-row :gutter="10" class="pad-b-10">
          <el-col :span="12">
            <el-input
              v-model="searchName"
              placeholder="请输入搜索内容"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="searchHander">搜索</el-button>
          </el-col>
        </el-row>
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
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
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
      default: ""
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
      default: () => [10, 20, 30, 40, 50]
    },

  },
  data() {
    return {
      searchName: "",
    };
  },
  methods: {
    // 搜索框
    searchHander() {
      this.$emit("search", this.searchName);
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

  }
};
</script>
<style lang="scss" scoped>
  .el-pagination { text-align: right;}
</style>
