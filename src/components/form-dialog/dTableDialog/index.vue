<template>
  <!-- 动态渲染搜索输入框组件 -->
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
        <el-row :gutter="10" class="pad-b-10">
          <el-col :span="12">
            <el-input
              v-model="searchObj[propName]"
              placeholder="请输入搜索内容"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="getList">搜索</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="listLoading"
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
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="searchObj.pageNum"
          :limit.sync="searchObj.pageSize"
          @pagination="getList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  model: {
    prop: "checkedCode",
    event: "emitValue"
  },
  props: {
    inputDefaultValue: {
      type: String, // 外部搜索框的默认值
      default: ""
    },
    propName: {
      type: String, // 搜索时的属性名 && 选中一条时取的属性名
      default: ""
    },
    request: {
      type: Object,
      default: () => ({
        url: "",
        methods: "get",
      })
    },
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
    }
  },
  data() {
    return {
      listLoading: true,
      pageSizes: [10, 20, 30, 40],
      searchName: "",
      total: 0,
      searchObj: {
        pageNum: 1,
        pageSize: 10,
      },
      tableData: []
    };
  },
  watch:{
    visible(newVal,oldVal){
      if(newVal){
        this.initPage();
      }
    }
  },
  created() {
    this.$set(this.searchObj,this.propName,'')
    this.getList();
  },
  methods: {
    initPage(){
      this.searchObj.pageNum = 1;
      this.searchObj.pageSize = 10;
      this.searchObj[this.propName] = '';
      this.getList();
    },
    getList() {
      this.listLoading = true;
      let params = this.searchObj;
      // data: data
      let requestObj;
      let {url,method} = this.request
      if(!url) return;
      if(method === 'get'){
        requestObj = {url,method,params}
      }else if(method === 'post'){
        requestObj = {url,method,data:params}
      }
      request(requestObj)
        .then(res => {
          this.listLoading = false;
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    // table的某一行点击
    tableRowClickHander(row) {
      // console.log("选中行的数据", row);
      this.$emit('updateInputDefaultValue',row[this.propName])
      this.handleClose();
    },
    // 右上角关闭按钮
    handleClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="scss" scoped></style>
