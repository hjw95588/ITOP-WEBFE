<template>
  <div class="app-container">
    <div class="container-info">
      <!-- 查询表单 开始 -->
      <div class="filter-container">
        <el-form
          class="queryParent"
          ref="flowForm"
          label-width="80px"
          :model="searchObject"
          v-show="showSearch"
        >
          <el-form-item prop="flowName" label="流程名称">
            <el-input
              v-model.trim="searchObject.flowName"
              placeholder="流程名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="flowKey" label="流程Key">
            <el-input
              v-model.trim="searchObject.flowKey"
              placeholder="流程Key"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="searchObject.state"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in $dict.processStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="searchWrapper">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="searchList"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button>
              <!-- <el-button type="text" v-stowExpand="['controlProcessQuery']"
          >{{controlProcessQuery ? '收起' : '展开'}}<i :class="[controlProcessQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down', 'el-icon--right']"></i></el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <!-- 查询表单 结束 -->
      <div class="dataWrap">
        <!-- 新增按钮 开始 -->
        <div class="fnButon">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            v-hasPermi="['kylin:flow:add']"
            @click="addProcess"
            >新增</el-button
          >
          <table-toolbar :showSearch.sync="showSearch" @queryTable="queryList" :columns="columns" />
        </div>
        <!-- 新增按钮 结束 -->
        <!-- 查询列表 开始 -->
        <div v-loading="listLoading" class="content-container" ref="tableCot">
          <el-table
            v-loading="listLoading"
            :data="list"
            :element-loading-text="$t('loading.text')"
            border
            fit
            highlight-current-row
          >
            <!-- :max-height="tableHeight" -->
            <el-table-column fixed align="center" label="编号" width="95" v-if="columns[0].visible">
              <template slot-scope="scope">
                {{
                  (searchObject.pageNum - 1) * searchObject.pageSize +
                  scope.$index +
                  1
                }}
              </template>
            </el-table-column>
            <el-table-column fixed label="流程名称" v-if="columns[1].visible">
              <template slot-scope="scope">
                {{ scope.row.flowName }}
              </template>
            </el-table-column>
            <el-table-column label="流程Key" v-if="columns[2].visible">
              <template slot-scope="scope">
                {{ scope.row.flowKey }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="110" align="center" v-if="columns[3].visible">
              <template slot-scope="scope">
                {{ scope.row.state | processStatusFilter }}
              </template>
            </el-table-column>
            <el-table-column
              label="描述"
              align="center"
              width="100"
              :show-overflow-tooltip="true"
              v-if="columns[4].visible"
            >
              <template slot-scope="scope">
                {{ scope.row.description }}
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="操作时间" width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime || scope.row.createTime }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="420"
              class-name="small-padding fixed-width"
              v-if="columns[5].visible"
            >
              <template slot-scope="scope">
                <el-row :gutter="2">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-edit"
                    v-hasPermi="['kylin:flow:edit']"
                    @click="editForm(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-view"
                    v-hasPermi="['kylin:flow:query']"
                    @click="showDiagram(scope.row)"
                    >查看</el-button
                  >
                <!--  <el-col :span="3">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteProcess(scope.row)"
                    >停用</el-button
                  >
                </el-col> -->
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-delete"
                    v-hasPermi="['kylin:flow:remove']"
                    @click="deleteProcess(scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-s-promotion"
                    v-hasPermi="['kylin:flow:start']"
                    @click="publish(scope.row)"
                    >发布</el-button
                  >
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-setting"
                    v-hasPermi="['kylin:flow:edit']"
                    @click="showEditDiagramDialog(scope.row)"
                    >编辑流程图</el-button
                  >
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 查询列表 结束 -->
      <!-- 分页器 开始 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="searchObject.pageNum"
        :limit.sync="searchObject.pageSize"
        @pagination="queryList"
      />
      <div>
        <!-- “0、新增流程图”操作 开始 -->
        <el-dialog
          v-if="addProcessDialog.visible"
          :title="addProcessDialog.title"
          :visible.sync="addProcessDialog.visible"
          :width="addProcessDialog.width"
          :close-on-click-modal="false"
          center
          :before-close="handleClose"
          :append-to-body="true"
        >
          <insert-form
            ref="addProcess"
            @close="closeAddProcessDialog"
            @queryList="queryList"
          />
        </el-dialog>
        <!-- “0、新增流程图”操作 结束 -->

        <!-- “1、编辑流程”操作 开始 -->
        <el-drawer
          v-if="showUpdateDialog.visible"
          :title="showUpdateDialog.title"
          :visible.sync="showUpdateDialog.visible"
          :direction="showUpdateDialog.direction"
          append-to-body
          :wrapperClosable="false"
          custom-class="drawer"
          :before-close="handleClose"
        >
          <div class="custom_drawer__content">
            <updateForm
              ref="updateForm"
              :process-info.sync="showUpdateDialog.data"
              @queryList="queryList"
              @closeUpdateForm="closeUpdateForm"
            />
          </div>
        </el-drawer>
        <!-- “1、编辑流程”操作 结束 -->

        <!-- “2、查看流程图”操作 开始 -->
        <el-dialog
          v-if="showDiagramDialog.visible"
          :title="showDiagramDialog.title"
          :visible.sync="showDiagramDialog.visible"
          :width="showDiagramDialog.width"
          :close-on-click-modal="false"
          center
          :before-close="handleClose"
          :append-to-body="true"
        >
          <ShowDiagram
            :new-process-diagram-xml.sync="diagramXml"
            @close="closeShowDiagram"
          />
        </el-dialog>
        <!-- “2、查看流程图”操作 结束 -->

        <!-- “4、选择默认版本”操作 开始 -->
        <!-- <el-dialog
          v-if="processVersionDialog.visible"
          :title="processVersionDialog.title"
          :visible.sync="processVersionDialog.visible"
          :width="processVersionDialog.width"
          center
          :before-close="handleClose"
        >
          <processVersion
            ref="processVersion"
            :process-info.sync="processVersionDialog.data"
            @queryList="queryList"
            @close="closeProcessVersionDialog"
          />
        </el-dialog> -->
        <!-- “4、选择默认版本”操作 结束 -->

        <!-- “6、流程设计器”操作 开始 -->
        <el-dialog
          v-if="editDiagramDialog.visible"
          :title="editDiagramDialog.title"
          :visible.sync="editDiagramDialog.visible"
          :width="editDiagramDialog.width"
          :fullscreen="editDiagramDialog.fullscreen"
          :close-on-click-modal="false"
          :close-on-press-escape="editDiagramDialog.closeOnPressEscape"
          center
          :before-close="handleClose"
          @close="closeDiagramDialog"
          :append-to-body="true"
        >
          <!-- <diagram-manager
            v-if="editDiagramDialog.visible"
            ref="diagramManager"
            :process-info.sync="processInfo"
            :new-process-diagram-xml.sync="diagramXml"
            :process-detail-id.sync="editDiagramDialog.data"
            @queryList="queryList"
            @close="closeDiagramDialog"
          /> -->
          <diagram-manager
            v-if="editDiagramDialog.visible"
            ref="diagramManager"
            :process-info.sync="processInfo"
            :new-process-diagram-xml.sync="diagramXml"
            @queryList="queryList"
            @close="closeDiagramDialog"
          />
        </el-dialog>
        <!-- “6、流程设计器”操作 结束 -->
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { generateTitle } from "@/utils/i18n";
import {
  getProcessListPage,
  deleteProcess,
  publishProcess,
} from "@/api/process/processList";
import Pagination from "@/components/Pagination";
import ShowDiagram from "@/components/ShowDiagram";
import diagramManager from "./processDesign.vue";
import processVersion from "./processVersion.vue";
import updateForm from "./update.vue";
import insertForm from "./addProcess.vue";

export default {
  name: "processList",
  components: {
    Pagination,
    ShowDiagram,
    updateForm,
    insertForm,
    diagramManager,
    processVersion,
  },
  data() {
    return {
      controlProcessQuery: false, // 控制搜索
      // 显示搜索条件
      showSearch: true,
      tableHeight: 0,
      searchObject: {
        flowName: "",
        flowKey: "",
        state: null,
        pageNum: 1,
        pageSize: 10,
      },
      companyList: [],
      companyMap: {},
      statusMap: { 1: "未发布", 2: "已发布" },
      list: [],
      listLoading: true,
      total: 0,
      previewOptions: {
        width: 850,
      },
      // 列信息
      columns: [
        { key: 0, label: `编号`, visible: true },
        { key: 1, label: `流程名称`, visible: true },
        { key: 2, label: `流程Key`, visible: true },
        { key: 3, label: `状态`, visible: true },
        { key: 4, label: `描述`, visible: true },
        { key: 5, label: `操作`, visible: true },
      ],
      showUpdateDialog: {
        // 弹窗组件传递数据
        title: "编辑流程",
        visible: false,
        width: "",
        name: "编辑流程", // 组件名,
        loading: false,
        data: "",
        fullscreen: false,
        closeOnPressEscape: false,
        direction: "rtl",
      },
      diagramXml: "",
      showDiagramDialog: {
        title: "查看流程图",
        visible: false,
        width: "",
        data: "",
        name: "", // 组件名,
        loading: false,
      },
      processVersionDialog: {
        title: "选择默认版本",
        visible: false,
        width: "70%",
        data: "",
        name: "选择默认版本", // 组件名,
        loading: false,
        fullscreen: true,
        closeOnPressEscape: false,
      },
      addProcessDialog: {
        title: "新增流程图",
        visible: false,
        width: "",
        data: "",
        name: "", // 组件名,
        loading: false,
      },
      editDiagramDialog: {
        title: "流程设计器",
        visible: false,
        width: "",
        data: "",
        name: "流程设计器", // 组件名,
        loading: false,
        fullscreen: true,
        closeOnPressEscape: false,
      },
      processInfo: {},
    };
  },
  beforeCreate() {
    console.log(
      "...............processList-----------------beforeCreate--------------"
    );
  },
  created() {
    console.log(
      "...............processList-----------------start--------------"
    );
    this.searchObject = {
      flowName: "",
      flowKey: "",
      state: null,
      pageNum: 1,
      pageSize: 10,
    };
    this.queryList();
  },
  mounted() {
    console.log(this.$dict);
    this.getTableHeight();
    window.onresize = () => {
      this.getTableHeight();
    };
  },
  methods: {
    getTableHeight() {
      // 页面头部固定高度84；
      // 表格距页面底部大概70；
      if (!this.$refs.tableCot) return;
      this.$nextTick(() => {
        let offsetHeight = 84 + this.$refs.tableCot.offsetTop; // 84+148
        let windowHeight = document.documentElement.clientHeight;
        this.tableHeight = windowHeight - offsetHeight - 70;
      });
    },
    closeProcessVersionDialog() {
      this.processVersionDialog.visible = false;
    },
    showProcessVersionDialog(row) {
      console.log("版本", row);
      this.$nextTick(() => {
        this.processVersionDialog.data = row;
        this.processVersionDialog.visible = true;
      });
    },
    publish(row) {
      console.log("发布", row);
      if (row.resourceName === undefined) {
        this.$message.info("请先绘制流程图再发布！");
        return;
      }
      const postData = {
        id: row.id,
        resourceName: row.resourceName,
      };
      publishProcess(postData).then((response) => {
        if (response.code === 200) {
          this.$message.success("发布成功！");
          this.queryList();
        }
      });
    },
    closeDiagramDialog() {
      this.$nextTick(() => {
        this.editDiagramDialog.visible = false;
        this.queryList();
      });
    },
    showEditDiagramDialog(row) {
      console.log("一条数据", row);
      this.processXml = row.resourceName || "";
      this.processInfo.processXml = this.processXml;
      this.processInfo = row;
      this.processInfo.processXml = this.processXml;
      this.diagramXml = this.processXml;
      this.$nextTick(() => {
        this.editDiagramDialog.visible = true;
        this.editDiagramDialog.data = row.id;
      });
    },
    handleClose(done) {
      this.$confirm(this.$t("action.confirmClose"))
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    editForm(data) {
      this.showUpdateDialog.data = data;
      this.showUpdateDialog.visible = true;
      console.log(
        "this.showUpdateDialog.data:" +
          JSON.stringify(this.showUpdateDialog.data)
      );
    },
    closeUpdateForm() {
      this.$nextTick(() => {
        this.showUpdateDialog.visible = false;
      });
    },
    closeAddProcessDialog() {
      this.$nextTick(() => {
        this.addProcessDialog.visible = false;
      });
    },
    addProcess() {
      this.$nextTick(() => {
        this.addProcessDialog.visible = true;
      });
    },
    generateTitle,
    // 点击查询
    searchList() {
      this.searchObject.pageNum = 1;
      this.queryList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("flowForm");
      this.searchObject.pageNum = 1;
      this.queryList();
    },
    queryList() {
      this.listLoading = true;
      let param = this.searchObject;
      getProcessListPage(param).then((response) => {
        this.list = response.rows;
        this.total = response.total;
        this.$nextTick(() => {
          this.listLoading = false;
        });
      });
    },
    deleteProcess(process) {
      this.$confirm("确认删除？")
        .then((_) => {
          const _that = this;
          _that.listLoading = true;
          deleteProcess(process.id)
            .then((response) => {
              _that.listLoading = false;
              this.$message.success("删除成功");
              this.$nextTick(() => {
                this.listLoading = false;
              });
              _that.queryList();
            })
            .catch(function (error) {
              _that.listLoading = false;
              console.error(error);
            });
        })
        .catch((_) => {});
    },
    closeShowDiagram() {
      this.diagramXml = "";
      this.$nextTick(() => {
        this.showDiagramDialog.visible = false;
      });
    },
    showDiagram(row) {
      // 返回xml，传递给弹窗
      this.processXml = row.resourceName || "";
      this.processInfo.processXml = this.processXml;
      this.diagramXml = this.processXml || "";
      this.showDiagramDialog.visible = true;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  padding-bottom: 0;
}
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
</style>
