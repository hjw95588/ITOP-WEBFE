<template>
  <div class="app-container">
    <div class="container-info">
      <div class="filter-container">
        <el-form :inline="true" :model="searchObject">
          <el-form-item label="表单名称">
            <el-input
              v-model="searchObject.controlName"
              placeholder="表单名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="表单KEY">
            <el-input
              v-model="searchObject.formKey"
              placeholder="表单KEY"
              clearable
            />
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
          element-loading-text="玩命加载数据中..."
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="表单编号" width="95">
            <template slot-scope="scope">
              <!-- {{
                (searchObject.pageNum - 1) * searchObject.pageSize +
                  scope.$index +
                  1
              }} -->
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="表单名称">
            <template slot-scope="scope">
              {{ scope.row.controlName }}
            </template>
          </el-table-column>
          <el-table-column label="表单KEY">
            <template slot-scope="scope">
              {{ scope.row.formKey }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-row>
                <el-col :span="12">
                  <el-button
                    type="info"
                    size="mini"
                    plain
                    :disabled='!!scope.row.nodeId || formIdList.includes(scope.row.id)'
                    @click="handlePreview(scope.row)"
                    >预览</el-button
                  >
                </el-col>
                <el-col :span="12">
                  <el-button
                    type="success"
                    size="mini"
                    plain
                    
                    @click="handleSelectForm(scope.row)"
                    >选择</el-button
                  >
                </el-col>
              </el-row>
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

      <div>
        <!-- 预览 -->

        <el-dialog
          :title="formPreViewDialog.title"
          :visible.sync="formPreViewDialog.visible"
          :width="formPreViewDialog.width"
          :fullscreen="formPreViewDialog.fullscreen"
          :close-on-press-escape="formPreViewDialog.closeOnPressEscape"
          append-to-body
          center
        >
          <PreFormView
            ref="preFormView"
            :form-info.sync="formPreViewDialog.data"
            :width="formPreViewDialog.width"
            @closePreViewDialog="closePreViewDialog"
          />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { generateTitle } from "@/utils/i18n";
import Pagination from "@/components/Pagination";
import { getFormList } from "@/api/tool/form";
import PreFormView from "@/components/PreFormView";

export default {
  name: "SelectForm",
  components: { Pagination, PreFormView },
  props: {
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  computed:{
    formIdList(){
      let arr = [];
      let nodeList = this.processInfo.nodeList;
      nodeList.forEach(item=>{
        if(item.nodeId && item.form && item.form.id){
          arr.push(item.form.id)
        }
      })
      return arr;
    }
  },
  data() {
    return {
      searchObject: {
        formKey: "",
        controlName: "",
        pageNum: 1,
        pageSize: 10
      },

      list: [],
      listLoading: true,
      total: 0,
      formPreViewDialog: {
        title: "预览",
        visible: false,
        width: "",
        name: "预览", // 组件名,
        loading: false,
        fullscreen: false,
        closeOnPressEscape: false,
        data:'' // 预览时该条数据相关内容
      }
    };
  },
  created() {
    this.searchObject = {
      formKey: "",
      controlName: "",
      pageNum: 1,
      pageSize: 10
    };
    this.queryList();
  },
  mounted() {},
  methods: {
    handleSelectForm(row) {
      console.log('点击选择按钮',row)
      this.$emit("setForm", row);
    },
    closePreViewDialog() {
      this.$nextTick(() => {
        this.formPreViewDialog.visible = false;
      });
    },
    handlePreview(row) {
      // 打开预览模态框
      this.formPreViewDialog.data = row;
      this.$nextTick(() => {
        this.formPreViewDialog.visible = true;
      });
    },
    generateTitle,
    queryList() {
      this.listLoading = true;
      var param = this.searchObject;
      param['businessKey'] = this.processInfo.flowKey;
      getFormList(param).then(response => {
        this.list = response.rows
        console.log("this.list:", this.list)
        this.total = response.total
        this.listLoading = false
      }).catch(err => {
          this.listLoading = false;
          console.log(err);
        });


    }
  }
};
</script>

<style scoped>
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
}

.page-footer {
  width: 100%;
  height: 50px;
}
</style>
