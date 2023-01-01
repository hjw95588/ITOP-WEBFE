<template>
  <div class="formItem">
    <el-row>
      <el-col :span="16">
        <span class="bpmn-label-item"
          >【{{ flowName }}流程】(绿色为已完成，蓝色为处理中)</span
        >
        <el-button-group key="scale-control">
          <el-tooltip effect="light" content="缩小视图">
            <el-button
              :size="headerButtonSize"
              :disabled="defaultZoom < 0.2"
              icon="el-icon-zoom-out"
              @click="processZoomOut()"
            />
          </el-tooltip>
          <el-button :size="headerButtonSize">{{
            Math.floor(this.defaultZoom * 10 * 10) + "%"
          }}</el-button>
          <el-tooltip effect="light" content="放大视图">
            <el-button
              :size="headerButtonSize"
              :disabled="defaultZoom > 4"
              icon="el-icon-zoom-in"
              @click="processZoomIn()"
            />
          </el-tooltip>
          <el-tooltip effect="light" content="重置视图并居中">
            <el-button
              :size="headerButtonSize"
              icon="el-icon-c-scale-to-original"
              @click="processReZoom()"
            />
          </el-tooltip>
        </el-button-group>
        <div
          ref="canvas"
          class="canvas"
          :style="{ height: elCanvasContainerHeight }"
      /></el-col>
      <el-col :span="8"
        ><div>
          <el-card
            style="overflow-y: auto; margin: 0px; padding: 0px"
            shadow="always"
            :body-style="{ height: elCardContainerHeight }"
          >
            <div class="block" v-if="nodeAssigneeList.length !== 0">
              <el-timeline style="padding: 0" :reverse="false">
                <el-timeline-item
                  v-for="(nodeAssignee, index) in nodeAssigneeList"
                  :key="index"
                  :icon="
                    nodeAssignee.status === '1'
                      ? 'el-icon-check'
                      : 'el-icon-more'
                  "
                  color="#47ADB7"
                  size="large"
                  :timestamp="nodeAssignee.createdTime"
                  placement="top"
                >
                  <el-card>
                    <div class="node-assignee-header">
                      <el-tooltip
                        :content="nodeAssignee.taskId"
                        placement="bottom"
                        effect="light"
                      >
                        <el-tag type="warning" v-if="nodeAssignee.sign === true"
                          ><i class="el-icon-connection"> 会签任务</i></el-tag
                        >
                        <el-tag
                          type="success"
                          v-if="nodeAssignee.sign === false"
                          ><i class="el-icon-link"> 普通任务</i></el-tag
                        >
                      </el-tooltip>
                    </div>
                    <el-table
                      :data="nodeAssignee.assigneeSet"
                      style="width: 100%"
                    >
                      <el-table-column label="处理人" width="120">
                        <template slot-scope="scope">
                          <el-tooltip
                            :content="scope.row.assigneeId"
                            placement="bottom"
                            effect="light"
                          >
                            <span>{{ scope.row.assigneeName }}</span>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column label="处理时间">
                        <template slot-scope="scope">
                          <span>{{
                            scope.row.handleTime === undefined
                              ? "—— —— —— ——"
                              : scope.row.handleTime
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="状态" width="80">
                        <template slot-scope="scope">
                          <el-tag
                            v-if="scope.row.handleFlag === true"
                            type="success"
                            >已处理</el-tag
                          >
                          <el-tag
                            v-if="scope.row.handleFlag !== true"
                            type="info"
                            >未处理</el-tag
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-empty
              :image-size="200"
              v-if="nodeAssigneeList.length === 0"
            ></el-empty>
          </el-card></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import BpmnViewer from "bpmn-js/lib/Modeler";
import { getChart, getNodeAssignee } from "@/api/work";
import mixin from "../../mixin.js";
import { mapGetters } from "vuex";
export default {
  mixins: [mixin],
  components: {},
  name: "BpmnViewer",
  inject: ['changeReadOnlyState'],
  data() {
    return {
      size: "",
      defaultZoom: 1,
      xmlStr: null,
      bpmnModeler: null,
      canvas: null,
      modeling: null,
      finishedNodeList: [],
      flowName: "",
      businessKey: "",
      currentNodeId: "",
      currentNodeIdGroupKey: "",
      processInstanceId: "",
      taskName: "",
      taskDefinitionKey: "",
      taskStatus: "",
      groupKey: "",
      nodeAssigneeList: [],
    };
  },
  props: {
    headerButtonSize: {
      type: String,
      default: "small",
      validator: (value) =>
        ["default", "medium", "small", "mini"].indexOf(value) !== -1,
    },
  },
  computed: {
    ...mapGetters(["workDetail", 'browseWorkDetail']),
    readOnlyState () {
      return this.changeReadOnlyState()
    },
  },
  created() {},
  watch: {},
  methods: {
    initPage() {
      let taskId = this.readOnlyState ? this.browseWorkDetail.id : this.workDetail.id;
      this.flowName = this.readOnlyState ? this.browseWorkDetail.flowName : this.workDetail.flowName;
      this.businessKey = this.readOnlyState ? this.browseWorkDetail.businessKey : this.workDetail.businessKey;
      this.processInstanceId = this.readOnlyState ? this.browseWorkDetail.processInstanceId : this.workDetail.processInstanceId;
      this.taskName = this.readOnlyState ? this.browseWorkDetail.taskName : this.workDetail.taskName;
      this.taskDefinitionKey = this.readOnlyState ? this.browseWorkDetail.taskDefinitionKey : this.workDetail.taskDefinitionKey;
      this.taskStatus = this.readOnlyState ? this.browseWorkDetail.status : this.workDetail.status;
      getChart({ taskId }).then((res) => {
        let data = res.data;
        this.xmlStr = data.resourceName;
        this.finishedNodeList = data.finishedNodeList;
        this.currentNodeId = data.currentNodeId;
        this.initBpmn();
      });
    },
    initBpmn() {
      const canvas = this.$refs.canvas;
      this.bpmnModeler = new BpmnViewer({
        container: canvas,
        additionalModules: [
          {
            // 禁用左侧默认工具栏
            paletteProvider: ["value", ""],
            // 禁用滚轮滚动
            // zoomScroll: ["value", ""],
            // 禁止拖动线
            bendpoints: ["value", ""],
            // 禁止点击节点出现contextPad
            contextPadProvider: ["value", ""],
            // 禁止双击节点出现label编辑框
            labelEditingProvider: ["value", ""],
          },
        ],
      });
      this.modeling = this.bpmnModeler.get("modeling");
      this.createNewDiagram();
      this.addEventBusListener();
    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        this.msgInfo("放大视图比例不得高于400%！");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        this.msgInfo("缩小视图比例不得低于20%！");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        this.msgInfo("缩小视图比例不得低于20%！");
      }
      if (newZoom > 4) {
        this.msgInfo("放大视图比例不得高于400%！");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(newZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    createNewDiagram() {
      if (!this.xmlStr) return;
      this.bpmnModeler.importXML(this.xmlStr, (err) => {
        if (err) {
          this.$message.error("BPMN文件不规范！" + err);
        } else {
          this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto"); // 流程图自适应
          var elementRegistry = this.bpmnModeler.get("elementRegistry");
          if (this.currentNodeId) {
            var shape = elementRegistry.get(this.currentNodeId);
            this.modeling.setColor(shape, {
              fill: "#E4EFFF",
              stroke: "#236AAE",
            });
            this.currentNodeIdGroupKey =
              shape.businessObject.$attrs["activiti:candidateUsers"];
            var startIndex = this.currentNodeIdGroupKey.indexOf("{");
            var endIndex = this.currentNodeIdGroupKey.lastIndexOf("}");
            let data = {
              processInstanceId: this.processInstanceId,
              nodeId: shape.businessObject.id,
              groupKey: this.currentNodeIdGroupKey.substring(
                startIndex + 1,
                endIndex
              ),
            };
            this.getNodeAssignee(data);
          }
          this.finishedNodeList.map((item) => {
            if (item === this.currentNodeId) {
              return;
            }
            let shape = elementRegistry.get(item);
            this.modeling.setColor(shape, {
              fill: "#F7FFFC",
              stroke: "#71CFAA",
            });
          });
          document.querySelector(".bjs-powered-by").remove();
        }
      });
    },
    /** 监听element */
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get("eventBus");
      /** 需要监听的事件集合 ["element.click", "element.changed"] */
      const eventType = ["element.click"];
      eventType.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          if (e.element.businessObject.$type === "bpmn:UserTask") {
            this.taskName = e.element.businessObject.name;
            this.groupKey =
              e.element.businessObject.$attrs["activiti:candidateUsers"];
            var startIndex = this.groupKey.indexOf("{");
            var endIndex = this.groupKey.lastIndexOf("}");
            let data = {
              processInstanceId: this.processInstanceId,
              nodeId: e.element.businessObject.id,
              groupKey: this.groupKey.substring(startIndex + 1, endIndex),
            };
            this.getNodeAssignee(data);
          }
        });
      });
    },
    getNodeAssignee(data) {
      getNodeAssignee(data).then((res) => {
        if (res.code === 200) {
          let data = res.data;
          this.nodeAssigneeList = data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
  },
  mounted() {
    this.initPage();
  },
};
</script>
<style lang="scss" scoped>
.bpmn-label-item {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 30px;
  background-image: linear-gradient(to right, #d9e6eb, #4f7d96);
  color: #3a556e;
  font-weight: 600;
  font-size: 16px;
}
.canvas {
  width: 100%;
}
.node-assignee-header {
  margin-bottom: 5px;
  i {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
