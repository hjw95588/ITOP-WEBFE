<template>
  <el-table
    v-loading="loading"
    :data="taskList"
    style="width: 100%"
    max-height="315"
    @row-dblclick="dblclick"
  >
    <el-table-column
      label="摘要"
      prop="itemName"
      :show-overflow-tooltip="true"
      fixed="left"
    />
    <!-- <el-table-column label="业务名称" prop="flowName" /> -->
    <el-table-column label="环节名称" prop="taskName" width="150" />
    <el-table-column label="责任人" prop="handler" width="100" />
    <el-table-column
      label="发起时间"
      align="center"
      prop="createTime"
      width="180"
    >
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="状态" prop="roleSort" width="100" >
      <template slot-scope="scope">
        <span>{{scope.row.status | statusFilter}}</span>
      </template>
    </el-table-column> -->
    <el-table-column
      label="操作"
      align="center"
      class-name="small-padding fixed-width"
      width="150px"
      fixed="right"
    >
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          v-show="scope.row.status === '0'"
          icon="el-icon-edit"
          @click="operHander('1', scope.row)"
          v-hasPermi="['kylin:taskTodo:list']"
          >处理</el-button
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
</template>

<script>
import { mapGetters } from "vuex";
import { getTaskList } from "@/api/work";
export default {
  name: "WorkList",
  data() {
    return {
      // 总条数
      total: 0,
      // 角色表格数据
      taskList: [],
      // 状态数据字典
      statusOptions: [
        { label: "待处理", value: "0" },
        { label: "已处理", value: "1" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: "",
        dateRange: [], // 日期范围
        status: "0",
      },
    };
  },
  computed: {
    ...mapGetters(["userId"]),
  },
  filters: {
    statusFilter(status) {
      if (status === "" || status === undefined || status === null) {
        return "";
      }
      const statusMap = {
        0: "待处理",
        1: "已处理",
      };
      return statusMap[status];
    },
  },
  created() {
    this.getList();
  },
  methods: {
    operHander(tag, row) {
      if (tag === "2" || tag === "3") {
        this.$message("此功能正在开发，敬请期待！！！");
        return;
      }
      this.$store.commit('work/UPDATE_JUMP_ROUTE_NAME', '/index')
      if (tag === '1') {
        this.$store.commit("work/UPDATE_WORK_DETAIL", {row});
        this.$router.push({
          name: "WorkDetailHandle",
          params: { itemName: row.itemName },
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
      let { taskName, pageNum, pageSize, dateRange, status } = this.queryParams;
      let beginTime, endTime;
      if (dateRange !== null && dateRange.length > 0) {
        beginTime = dateRange[0];
        endTime = dateRange[1];
      }
      let params = {
        userId,
        taskName,
        beginTime,
        endTime,
        status,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 双击预览
    dblclick(row) {
      this.operHander("4", row);
    },
  },
  mounted() {},
};
</script>