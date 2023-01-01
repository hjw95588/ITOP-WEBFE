<template>
  <div class="app-container">
    <el-form
      class="queryParent"
      :model="queryParams"
      ref="queryForm"
      label-width="80px"
      v-show="showSearch"
    >
      <el-form-item label="摘要" prop="taskName" class="el-item-two">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入摘要"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起时间" class="el-item-two">
        <el-date-picker
          v-model="queryParams.dateRange"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="searchWrapper">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tag-group">
      <el-radio-group v-model="statusNum" @change="changeStatus">
        <el-radio-button label="0">待处理</el-radio-button>
        <el-radio-button label="1">已处理</el-radio-button>
      </el-radio-group>
      <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
      <el-table
        v-loading="loading"
        :data="taskList"
        @row-dblclick="dblclick"
      >
        <el-table-column fixed="left" label="序号" type="index" width="60">
          <template slot-scope="scope">
            <span>{{
              (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务编号"
          prop="executionId"
          :show-overflow-tooltip="true"
          width="150"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="摘要"
          prop="itemName"
          :show-overflow-tooltip="true"
          fixed="left"
          v-if="columns[1].visible"
        />
        <el-table-column label="业务名称" align="left" prop="flowName" width="180" sortable v-if="columns[2].visible" />
        <el-table-column label="环节名称" align="center" prop="taskName" width="150" sortable v-if="columns[3].visible" />
        <el-table-column label="责任人" align="center" prop="handler" width="100" v-if="columns[4].visible" />
        <el-table-column
          label="发起时间"
          align="center"
          prop="createTime"
          width="180"
          sortable
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" sortable v-if="columns[6].visible" >
          <template slot-scope="scope">
            <span>{{ scope.row | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="130px"
          fixed="right"
          v-if="columns[7].visible"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-show="scope.row.status === '0' "
              icon="el-icon-edit"
              @click="operHander('1', scope.row)"
              v-hasPermi="['kylin:taskTodo:list']"
              >处理</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-sort"
              v-show="scope.row.status === '0'"
              @click="operHander('2', scope.row)"
              v-hasPermi="['kylin:taskTodo:list']"
              >转派</el-button
            > -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh-right"
              v-if="scope.row.revoke"
              @click="revokeTask(scope.row)"
              v-hasPermi="['kylin:taskTodo:revokeTask']"
              >撤回</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-reading"
              @click="operHander('4', scope.row)"
              v-hasPermi="['kylin:taskTodo:list']"
              >浏览</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getTaskList, revoTaskReq } from "@/api/work";
import { mapGetters } from "vuex";

export default {
  name: "WorkList",
  data() {
    return {
      // 总条数
      total: 0,
      // 角色表格数据
      taskList: [],
      // 状态数据字典
      statusNum: "0",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: "",
        dateRange: [], // 日期范围
        // status: "0",
      },
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
      { key: 0, label: `业务编号`, visible: false },
      { key: 1, label: `摘要`, visible: true },
      { key: 2, label: `业务名称`, visible: true },
      { key: 3, label: `环节名称`, visible: true },
      { key: 4, label: `责任人`, visible: true },
      { key: 5, label: `发起时间`, visible: true },
      { key: 6, label: `状态`, visible: true },
      { key: 7, label: `操作`, visible: true }
      ],
    };
  },
  computed: {
    ...mapGetters(["userId", "workListPagenum"]),
  },
  filters: {
    statusFilter(row) {
      let status = row.status;
      if (status === "" || status === undefined || status === null) {
        return "";
      }
      if(row.deleteReason) {
        return "已作废";
      }
      const statusMap = {
        0: "待处理",
        1: "已处理",
      };
      return statusMap[status];
    },
  },
  created() {
    this.queryParams.pageNum = this.workListPagenum
    this.getList();
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'WorkDetailBrowse' || to.name === 'WorkDetailHandle') {
      this.$store.dispatch('work/updateListPagenumber', this.queryParams.pageNum)
      to.meta.activeMenu = '/work/work-list'
    } else {
      this.$store.dispatch('work/updateListPagenumber', 0)
    }
    next()
  },
  methods: {
    operHander(tag, row) {
      if (tag === "2" || tag === "3") {
        this.$message("此功能正在开发，敬请期待！！！");
        return;
      }
      this.$store.commit('work/UPDATE_JUMP_ROUTE_NAME', '/work/work-list')
      if (tag === '1') {
        this.$store.commit("work/UPDATE_WORK_DETAIL", {row});
        this.$router.push({
          name: "WorkDetailHandle",
          params: { itemName: row.itemName,taskName:row.taskName },
        });
      } else if (tag === '4') {
        this.$store.commit("work/BROWSE_WORK_DETAIL", {row});
        this.$router.push({
          name: "WorkDetailBrowse",
          params: { itemName: row.itemName },
        });
      }
      return;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      let userId = this.userId;
      const statusNum = this.statusNum;
      let { taskName, pageNum, pageSize, dateRange } = this.queryParams;
      let beginTime, endTime;
      if (dateRange !== null && dateRange.length > 0) {
        beginTime = dateRange[0];
        endTime = dateRange[1];
        if (beginTime === endTime) {
          beginTime = beginTime + ' ' + '00:00:00'
          endTime = endTime + ' ' + '23:59:59'
        }
      }
      let params = {
        userId,
        taskName,
        beginTime,
        endTime,
        status: statusNum,
        pageNum,
        pageSize,
      };
      getTaskList(params).then((res) => {
        this.taskList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 切换状态
    changeStatus() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 双击预览
    dblclick(row) {
      this.operHander("4", row);
    },
    // 撤回任务
    revokeTask (taskObj) {
      this.$confirm(
        '是否确认撤回任务？',
        '警告',
        {
          cancelButtonClass: "btn-custom-cancel",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        revoTaskReq({ taskId: taskObj.id, userId: this.userId }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: `${res.msg}!`,
            });
            this.getList();
          }
        }).catch(() => {})
      }).catch(() => {})
    }
  }
};
</script>
<style lang="scss" scoped>
.tag-group {
  padding: 10px;
  background: #fff;
  .el-radio-group { margin-bottom: 10px;}
}
::v-deep .el-table thead { color: #515a6e !important; font-size: 13px; }
</style>
