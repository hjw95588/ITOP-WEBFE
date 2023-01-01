<template>
  <!-- 嵌套表格弹窗[搜索+树形表格] -->
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
          :lazy="lazy"
          @row-click="tableRowClickHander"
          :load="load"
        >
          <el-table-column
            v-for="(item, index) in tableHeaders"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>

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
    lazy: {
       type: Boolean,
     default: false
     }
  },
  data() {
    return {
      searchName: "",
    };
  },
  methods: {
    load(tree, treeNode, resolve){
      this.$emit("load", tree, treeNode, resolve);
    },
    // 搜索框
    searchHander() {
      this.$emit("search", this.searchName);
    },
    // table的某一行点击
    tableRowClickHander(row) {
      this.$emit("selectItem", row);
      this.handleClose();
    },
    // 关闭弹窗
    handleClose() {
      this.searchName="";
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="scss" scoped></style>
