<template>
  <div class="app-container">
    <div class="container-info">
      <div class="filter-container">
        <el-form :inline="true" :model="searchObject">
          <el-form-item label="字典名称">
            <el-input
              v-model="searchObject.dictName"
              placeholder="字典名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="字典类型">
            <el-input
              v-model="searchObject.dictType"
              placeholder="字典类型"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchObject.status"
              placeholder="状态"
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
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-loading="listLoading" class="content-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            align="center"
            label="字典编号"
            width="50"
            prop="dictId"
          >
          </el-table-column>
          <el-table-column
            label="字典名称"
            align="center"
            :show-overflow-tooltip="true"
            prop="dictName"
          >
          </el-table-column>
          <el-table-column
            label="字典类型"
            align="center"
            :show-overflow-tooltip="true"
            prop="dictType"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            :formatter="statusFormat"
          >
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            :show-overflow-tooltip="true"
            prop="remark"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                style="width:50px"
                plain
                @click="selectDict(scope.row)"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-footer">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="searchObject.pageNum"
          :limit.sync="searchObject.pageSize"
          style="float:right;"
          @pagination="queryList"
        />
      </div>

    </div>
  </div>
</template>

<script>
import store from "@/store";
import { generateTitle } from "@/utils/i18n";
import Pagination from "@/components/Pagination";
import { listType } from "@/api/system/dict/type";

export default {
  name: "SelectDict",
  components: { Pagination },
  data() {
    return {
      searchObject: {
        pageNum: 1,
        pageSize: 10,
        dictName: "",
        dictType: "",
        status: ""
      },
      statusOptions: [],
      list: [],
      listLoading: true,
      total: 0,

    };
  },
  created() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.initPage();
  },
  mounted() {},
  methods: {
    initPage(){
      this.searchObject = {
        pageNum: 1,
        pageSize: 10,
        dictName: "",
        dictType: "",
        status: ""
      }
      this.queryList()
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    selectDict(row) {
      this.$emit("save", row.dictType);
    },
    generateTitle,
    queryList() {
      this.listLoading = true;
      var param = this.searchObject;
      listType(param).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.$nextTick(() => {
          this.listLoading = false;
        });
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.line {
  text-align: center;
}
.el-drawer:focus {
  outline: none;
}
.custom_drawer__content {
  margin: 5px 20px;
  align-content: center;
}
.el-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 32px;
  padding: 20px 20px 0;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  font-weight: 600;
}
.drawer {
  overflow: scroll;
}
.page-footer {
  width: 100%;
  height: 50px;
}
</style>
