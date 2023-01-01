<template>
  <!-- 1、实现表单的动态构建；2、提交时走校验规则；3、表单元素自定义事件 -->
  <div class="app-container">
    <div class="main ebank-form">
      <!-- tab标签 -->
      <el-tabs v-model="tabsValue" type="border-card" @tab-click="tabClickHander">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
      <div class="content of-auto" :style="{ height: tabContainerHeight }">
        <div
          class="tab-container"
          v-if="tabsShow[0]"
          v-show="tabsValue === '1'"
        >
          <form-viewer ref="form" :key="browseWorkDetail.id"></form-viewer>
        </div>
        <div
          class="tab-container"
          v-if="tabsShow[1]"
          v-show="tabsValue === '2'"
        >
          <ops-list></ops-list>
        </div>
        <div
          class="tab-container"
          v-if="tabsShow[2]"
          v-show="tabsValue === '3'"
        >
          <bpmn-viewer></bpmn-viewer>
        </div>
        <div
          class="tab-container"
          v-if="tabsShow[3]"
          v-show="tabsValue === '4'"
        ></div>
      </div>
    </div>
    <div class="footer w-100 pad-t-10 pf r-0 b-10">
      <el-button
        :disabled="saveLoading || submitLoading"
        class="pan-btn light-blue-btn"
        icon="el-icon-close"
        @click="pageClose"
        >关闭</el-button
      >
    </div>
    <el-dialog title="任务转派" :visible.sync="assignDialog" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="assignForm" label-width="100px" :rules="assignFormRules" ref="assignForm">
        <el-form-item label="任务名称" prop="taskname">
          <el-input v-model="assignForm.taskname" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="receiver">
          <el-input
            v-model="assignForm.receiver"
            size="small"
            placeholder="请选择任务接收人"
            readonly
            style="width: 78%"
          ></el-input>
          <el-button
            type="success"
            size="small"
            icon="el-icon-search"
            @click="addFormReceiver"
            >选择用户</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="assignDataSure">确 定</el-button>
        <el-button @click="assignDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（开始） -->
    <tree-multi-select-table-dialog
      ref="treeSelecteGroupNameDialog"
      :title="treeSelectTableDialog.title"
      :visible.sync="treeSelectTableDialog.visible"
      :isMultipleChoice="treeSelectTableDialog.isMultipleChoice"
      :selectedUserList="treeSelectTableDialog.selectedUserList"
      @updateUserList="updateUserList"
    ></tree-multi-select-table-dialog>
    <!-- 树形图+表格分页弹窗[搜索+表格+分页]（结束） -->
  </div>
</template>

<script>
import FormViewer from "./components/formViewer";
import OpsList from "./components/opsList";
import BpmnViewer from "./components/bpmnViewer";
import TreeMultiSelectTableDialog from "@/views/components/treeMultiSelectTableDialog";
import mixin from "../mixin.js";
import { mapGetters } from "vuex";
import { assigneeSet } from '@/api/work'
export default {
  mixins: [mixin],
  name: "workDetailBrowse",
  components: {
    FormViewer,
    OpsList,
    BpmnViewer,
    TreeMultiSelectTableDialog
  },
  computed: {
    ...mapGetters(["browseWorkDetail", "routerPath"]),
  },
  provide () {
    return {
      changeReadOnlyState: () => this.readyOnlyState
    }
  },
  data() {
    return {
      saveLoading: false, // 保存按钮等状态控制
      submitLoading: false, // 提交按钮等状态控制
      readyOnlyState: true,
      operBtnVisible: true,
      tabsShow: [true, false, false, false],
      tabsValue: "1",
      tabList: [
        {
          title: "任务浏览",
          name: "1",
        },
        {
          title: "操作进展",
          name: "2",
        },
        {
          title: "流程图",
          name: "3",
        },
      ],
      assignDialog: false, // 任务转派弹窗
      assignForm: { // 转派任务数据
        taskname: '', 
        receiver: '',
      },
      transServiceData: {
        taskId: '',
        userId: ''
      },
      assignFormRules: {
        taskname: [
          { required: true, message: '任务名称不能为空', trigger: 'change' }
        ],
        receiver: [
          { required: true, message: '请选择任务接收人', trigger: 'change' }
        ]
      },
      // 树形图+表格分页弹窗[搜索+树形表格+分页]
      treeSelectTableDialog: {
        title: "选择人员",
        visible: false,
        width: "",
        isMultipleChoice: false, // 负责人禁止多选
        selectedUserList: [], // "添加/编辑流程节点组---添加审批人员"弹窗的userList
      },
      routeFrome: '' // 记录来自哪个路由
    };
  },
  created() {
    this.routeFrome = this.routerPath
  },
  activated() {
    this.initPage();
    this.setTabContent();
  },
  methods: {
    initPage() {
      let tabsShow = Array(4).fill(false);
      tabsShow[0] = true;
      this.tabsShow = JSON.parse(JSON.stringify(tabsShow));
      this.tabsValue = "1";
    },
    setTabContent() {},
    saveForm() {
      this.$refs.form.saveForm();
    },
    async submitForm() {
      await this.$refs.form.submitForm();
    },
    setAssign() {
      this.assignForm.taskname = this.browseWorkDetail.itemName
      this.transServiceData.taskId = this.browseWorkDetail.id
      this.assignDialog = true
      // this.$message("此功能正在开发，敬请期待！！！");
    },
    resetData () {
      this.assignForm.taskname = ''
      this.assignForm.receiver = ''
      this.transServiceData.taskId = ''
      this.transServiceData.userId = ''
      this.assignDialog = false
    },
    assignDataSure () {
      this.$refs.assignForm.validate(valide => {
        if (valide) {
          const data = this.transServiceData
          assigneeSet(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '转派成功'
              })
              this.$router.go(-1)
              this.$refs.assignForm.resetFields()
              this.resetData()
            }
          })
        }
      })
    },
    pageClose() {
      this.$refs.form.cancelRequest()
      this.$store.state.tagsView.visitedViews.splice(
        this.$store.state.tagsView.visitedViews.findIndex(
          (item) => item.path === this.$route.path
        ),
        1
      );
      this.$router.push({ path: this.routeFrome })
    },
    tabClickHander() {
      let index = this.tabsValue - 1;
      this.tabsShow[index] = true;
    },
    // 添加“接收人”
    addFormReceiver() {
      this.$refs.treeSelecteGroupNameDialog.resetPage();
      this.$nextTick(() => {
        this.treeSelectTableDialog.visible = true;
        this.treeSelectTableDialog.selectedUserList = []
      });
    },
    // 修改审批人员
    updateUserList(selectedUserList) {
      // console.log("selectedUserList", selectedUserList);
      selectedUserList.forEach((item) => {
        this.assignForm.receiver = item.userName;
        this.transServiceData.userId = item.userId;
      });
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.app-container { padding-bottom: 0;}
.b-10 { padding-top: 10px; position: static;}
@import "~@/assets/styles/ebank-form.scss";
</style>
