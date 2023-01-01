<template>
  <div class="app-container">
    <div class="container-info">
      <div class="filter-container">
        <el-form :inline="true" :model="searchObject">
          <el-form-item label="审批岗位">
            <el-input
              v-model="searchObject.groupName"
              placeholder="审批岗位"
              clearable
            />
          </el-form-item>
          <!--  <el-form-item label="表单KEY">
            <el-input
              v-model="searchObject.formKey"
              placeholder="表单KEY"
              clearable
            />
          </el-form-item> -->

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
          <el-table-column align="center" label="编号" width="95">
            <template slot-scope="scope">
              {{
                (searchObject.pageNum - 1) * searchObject.pageSize +
                  scope.$index +
                  1
              }}
            </template>
          </el-table-column>
          <el-table-column label="审批岗位">
            <template slot-scope="scope">
              {{ scope.row.groupName }}
            </template>
          </el-table-column>
          <el-table-column label="审批人员">
            <template slot-scope="scope">
              <span>{{ scope.row.userList | userListFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                style="width:60px"
                plain
                :disabled="
                  !!scope.row.nodeId || groupIdList.includes(scope.row.groupId)
                "
                @click="handleSelectForm(scope.row)"
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

      <div></div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { generateTitle } from "@/utils/i18n";
import Pagination from "@/components/Pagination";
import {listGroup} from "@/api/process/group";
import PreFormView from "@/components/PreFormView";

export default {
  name: "SelectGroup",
  components: { Pagination, PreFormView },
  props: {
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  computed: {
    groupIdList() {
      let arr = [];
      let nodeList = this.processInfo.nodeList;
      nodeList.forEach(item => {
        if (item.nodeId && item.group && item.group.groupId) {
          arr.push(item.group.groupId);
        }
      });
      return arr;
    }
  },
  data() {
    return {
      searchObject: {
        groupName: "",
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
        data: "" // 预览时该条数据相关内容
      }
    };
  },
  filters: {
    userListFilter(userList) {
      let arr = [];
      userList.map(item => {
        // 这里的后端返回有问题
        arr.push(item.userName);
      });
      return arr.join(",");
    }
  },
  created() {
    this.searchObject = {
      groupName: "",
      pageNum: 1,
      pageSize: 10
    };
    this.queryList();
  },
  mounted() {

  },
  methods: {
    handleSelectForm(row) {
      console.log("点击选择按钮", row);
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
      let param = this.searchObject;
      param['businessKey'] = this.processInfo.flowKey;
      listGroup(param)
        .then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.listLoading = false;
        })
        .catch(err => {
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
