<template>
<!-- 右侧边栏 -->
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <el-collapse v-model="activeTab">
      <!-- 常规 -->
      <el-collapse-item name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>常规</div>
        <div class="panel-tab__content">
          <el-form size="mini" label-width="90px">
            <el-form-item label="ID">
              <el-input
                v-model="elementBaseInfo.id"
                :disabled="idEditDisabled || elementType === 'bpmn:Process'"
                clearable
                @keyup.enter.native="updateBaseId(elementBaseInfo.id)"
              />
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                v-model="elementBaseInfo.name"
                :disabled="idEditDisabled || elementType === 'bpmn:Process'"
                clearable
                @keyup.native="updateBaseInfo('name', elementBaseInfo.name)"
                @change="updateBaseInfo('name', $event)"
              />
            </el-form-item>
            <!--流程的基础属性-->
            <template v-if="elementType === 'bpmn:Process'">
              <el-form-item label="版本">
                <el-input
                  v-model="elementBaseInfo.versionTag"
                  :disabled="true"
                  clearable
                  @keyup.native="updateBaseInfo('versionTag', elementBaseInfo.versionTag)"
                  @change="updateBaseInfo('versionTag', $event)"
                />
              </el-form-item>
              <el-form-item label="可执行">
                <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable', $event)" />
              </el-form-item>
            </template>
          </el-form>
          <!-- 初始节点人员配置 -->
          <!-- <template v-if="elementType === 'bpmn:StartEvent'">
            <div class="element-property input-property">
              <div class="element-property__label">发起人</div>
              <div class="element-property__value">
                <el-input
                  v-model="activeElementBusinessObject.initiator"
                  size="mini"
                  @change="updateBaseInfo('initiator', activeElementBusinessObject.initiator)"
                ></el-input>
              </div>
            </div>
          </template> -->
          <!-- 人员信息配置 -->
          <template v-if="elementType === 'bpmn:UserTask'">
            <!-- <div class="element-property input-property">
              <div class="element-property__label">处理人</div>
              <div class="element-property__value">
                <el-input
                  v-model="activeElementBusinessObject.assignee"
                  size="mini"
                  @change="updateBaseInfo('assignee', activeElementBusinessObject.assignee)"
                ></el-input>
              </div>
            </div> -->
            <!-- <div class="element-property input-property">
              <div class="element-property__label">处理人</div>
              <div class="element-property__value">
                <el-input
                  v-model="activeElementBusinessObject.candidateUsers"
                  size="mini"
                  @change="updateBaseInfo('candidateUsers', activeElementBusinessObject.candidateUsers)"
                ></el-input>
              </div>
            </div> -->
            <!-- <div class="element-property input-property">
              <div class="element-property__label">候选组</div>
              <div class="element-property__value">
                <el-input
                  v-model="activeElementBusinessObject.candidateGroups"
                  size="mini"
                  @change="updateBaseInfo('candidateGroups', activeElementBusinessObject.candidateGroups)"
                ></el-input>
              </div>
            </div> -->
          </template>
          <!--连接线的基础配置-->
          <condition-config v-if="flowTypeViewable" v-bind="$props" :conditions="sequenceFlowCondition" :element-id="elementId" />
          <!--任务节点配置-->
          <task-loop-characteristics v-if="taskLoopViewable" v-bind="$props" :element-id="elementId" :element-business-object="activeElementBusinessObject" />
        </div>
      </el-collapse-item>
      <!-- 审批岗位 -->
      <template v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'">
        <el-collapse-item name="group">
          <div slot="title" class="panel-tab__title"><i class="el-icon-s-cooperation"></i>审批岗位</div>
          <user-task-group-config
          ref="userTaskGroupConfig"
          :processInfo="processInfo"
          :element-id="elementId"
          @updateBaseInfo="updateBaseInfo"
          ></user-task-group-config>
        </el-collapse-item>
      </template>
      <!-- 外置表单配置-->
      <template v-if="elementType === 'bpmn:UserTask' || elementType === 'bpmn:StartEvent'">
        <el-collapse-item name="form">
          <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>节点表单</div>
          <user-task-form-config
          ref="userTaskFormConfig"
          :processInfo="processInfo"
          :element-id="elementId"
          ></user-task-form-config>
          <!-- <element-form-config
            v-bind="$props"
            :element-id="elementId"
            :element-business-object="activeElementBusinessObject"
            @change-form-key="updateBaseInfo('formKey', $event)"
          /> -->
        </el-collapse-item>
      </template>
      <!-- 任务监听器 -->
      <el-collapse-item name="taskListeners" v-if="elementType === 'bpmn:UserTask'">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>任务监听器 TaskListener</div>
        <user-task-listener v-bind="$props" :element-id="elementId" :listeners="taskListeners" @change="updateTaskListener" />
      </el-collapse-item>
      <!-- 执行监听器 -->
      <el-collapse-item name="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>执行监听器 ExecutionListener</div>
        <element-listener v-bind="$props" :element-id="elementId" :listeners="elementListeners" @change="updateElementListener" />
      </el-collapse-item>
      <!-- 扩展属性 -->
      <el-collapse-item name="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-attributes v-bind="$props" :element-id="elementId" :attributes="elementAttributes" @change="updateElementAttributes" />
      </el-collapse-item>
      <!-- 其他 -->
      <el-collapse-item name="other">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>其他</div>
        <div class="panel-tab__content">
          <div class="element-property input-property">
            <div class="element-property__label">元素文档</div>
            <div class="element-property__value">
              <el-input
                type="textarea"
                v-model="documentation"
                size="mini"
                resize="vertical"
                :autosize="{ minRows: 2, maxRows: 4 }"
                @input="updateDocumentation"
                @blur="updateDocumentation"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

import ConditionConfig from "./condition-config/ConditionConfig";
import ElementListener from "./extensional/listeners/ElementListener";
import UserTaskListener from "./extensional/listeners/UserTaskListener";
import ElementAttributes from "./extensional/attrbutes/ElementAttributes";
import TaskLoopCharacteristics from "./task-config/TaskLoopCharacteristics";
import ElementFormConfig from "./form-config/ElementFormConfig";
import UserTaskFormConfig from "./form-config/UserTaskFormConfig";
import UserTaskGroupConfig from "./form-config/UserTaskGroupConfig";
// import { is } from 'bpmn-js/lib/util/ModelUtil';
// import { debounce } from "@/utils";
import deepClone from 'clone-deep'
import { updateProcess } from '@/api/process/processList'

export default {
  name: "MyProcessPanel",
  components: {UserTaskFormConfig, UserTaskGroupConfig, TaskLoopCharacteristics, ElementAttributes, ElementListener, UserTaskListener, ConditionConfig },
  componentName: "MyProcessPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "activiti"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    },
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      activeTab: "base",
      activeElementBusinessObject: {},
      elementBaseInfo: {}, // 基础属性：名称、标签等
      documentation: "", // 元素文档 对应的字符串
      sequenceFlowCondition: {}, // 连线条件实例（包含需要的类型字段）
      elementListeners: [], // 扩展属性 -- 执行监听器实例集合
      taskListeners: [],  // 扩展属性 -- 任务监听器实例集合
      elementAttributes: [] // 扩展属性 -- 自定义字段属性实例集合
    };
  },
  computed: {
    elementType() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.$type;
      return null;
    },
    elementId() {
      if (this.activeElementBusinessObject) return this.activeElementBusinessObject.id;
      return null;
    },
    flowTypeViewable() {
      if (this.elementType !== "bpmn:SequenceFlow") return false;
      // return this.activeElementBusinessObject.sourceRef && this.activeElementBusinessObject.sourceRef.$type !== "bpmn:StartEvent";
      return this.activeElementBusinessObject.sourceRef && this.activeElementBusinessObject.sourceRef.$type;
    },
    taskLoopViewable() {
      return this.elementType && this.elementType.indexOf("Task") !== -1;
    }
  },
  created() {
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      this.modeling = this.bpmnModeler.get("modeling");
      this.moddle = this.bpmnModeler.get("moddle");
      this.eventBus = this.bpmnModeler.get("eventBus");
      this.bpmnFactory = this.bpmnModeler.get("bpmnFactory");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.replace = this.bpmnModeler.get("replace");
      this.selection = this.bpmnModeler.get("selection");
      this.elementBaseInfo.id = this.processInfo.flowKey;
      this.elementBaseInfo.name = this.processInfo.flowName;
      this.$nextTick(() => this.getActiveElement());
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      const processElement = this.elementRegistry.find(el => el.type === "bpmn:Process");
      this.activeElementBusinessObject = { ...processElement.businessObject };
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        const shape = newSelection[0] || this.elementRegistry.find(el => el.type === "bpmn:Process");
        // console.log('监听选择事件999',shape)
        this.initFormOnChanged(shape.id);
      });
      // 监听元素改变
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.activeElementBusinessObject.id) {
          this.initFormOnChanged(element.id);
        }
      });
      this.bpmnModeler.on('shape.removed', ({ element }) => {
        if (this.processInfo.nodeList && this.processInfo.nodeList.length !== 0) {
          this.processInfo.nodeList.forEach((item, index, arr) => {
            if (element.id === item.nodeId) {
              arr.splice(index, 1)
            }
          })
        }
      })
    },
    // 元素更新时更新表单
    initFormOnChanged(elementId) {
      const element = this.elementRegistry.get(elementId); // 元素
      if (!element) return;
      this.activeElementBusinessObject = {
        ...JSON.parse(JSON.stringify(element.businessObject)),
        parent: element.businessObject?.$parent ? JSON.parse(JSON.stringify(element.businessObject?.$parent)) : null,
        sourceRef: element.businessObject.sourceRef ? JSON.parse(JSON.stringify(element.businessObject.sourceRef)) : null,
        targetRef: element.businessObject?.targetRef ? JSON.parse(JSON.stringify(element.businessObject?.targetRef)) : null
      };
      this.elementBaseInfo = JSON.parse(JSON.stringify(element.businessObject));
      const shapeDoc = element.businessObject?.documentation; // 元素文档
      // 设置文档属性
      this.documentation = shapeDoc && shapeDoc.length ? shapeDoc[0]?.text : "";
      // 设置扩展监听
      if (element.businessObject?.extensionElements?.values) {
        this.elementListeners = element.businessObject.extensionElements.values.filter(
          ex => ex.$type === `${this.prefix}:ExecutionListener`
        );
        this.taskListeners = element.businessObject.extensionElements.values.filter(
          ex => ex.$type === `${this.prefix}:TaskListener`
        );
        this.elementAttributes = element.businessObject.extensionElements.values.filter(ex => ex.$type === `${this.prefix}:Properties`);
      } else {
        this.elementListeners = [];
        this.taskListeners = [];
        this.elementAttributes = [];
      }
      // 设置条件属性
      if (element.type.indexOf("SequenceFlow") !== -1) {
        if (element.businessObject.conditionExpression) {
          this.sequenceFlowCondition = { ...element.businessObject.conditionExpression };
          this.$set(this.sequenceFlowCondition, "type", "condition");
          return;
        }
        const sourceShape = this.elementRegistry.get(element.businessObject.sourceRef.id);
        if (sourceShape.businessObject.default && sourceShape.businessObject.default.id === elementId) {
          this.$set(this.sequenceFlowCondition, "type", "default");
          return;
        }
        this.$set(this.sequenceFlowCondition, "type", "normal");
      }
      // 设置表单属性
     /*   console.log('设置表单属性',this.$refs.userTaskFormConfig)
      this.$refs.userTaskFormConfig.initControlName(); */

    },
    // 更新 元素 ID
    updateBaseId(newId) {
      if (!newId || !newId.length) return this.$message.error("ID 不能为空");
      console.log("update id");
      const newShape = this.elementRegistry.get(this.elementId);
      this.modeling.updateProperties(newShape, { id: newId, di: { id: `${newId}_di` } }); // 同时更新 图形id
      this.initFormOnChanged(newId); // 重新更新表单
    },
    // 更新常规信息
    updateBaseInfo(key, value) {
      if(key === 'name'){
        this.processInfo.flowName = value;
        updateProcess(deepClone(this.processInfo));
      }
      const shape = this.elementRegistry.get(this.elementId);
      let attrObj = {};
      attrObj[key] = value;
      this.modeling.updateProperties(shape, attrObj);
    },
    // 更新元素文档
    updateDocumentation() {
      const element = this.elementRegistry.get(this.elementId);
      const documentation = this.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
      this.modeling.updateProperties(element, {
        documentation: [documentation]
      });
    },
    // 更新事件监听器（这里返回的监听器都是实例，不需要再次实例化）
    updateElementListener(listeners) {
      const element = this.elementRegistry.get(this.elementId);
      // 获取当前元素的所有扩展配置实例数组
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是监听器的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", {
        values: otherExtensions.concat(listeners)
      });
      this.updateElementExtensions(element, extensions);
    },
    // 更新事件监听器（这里返回的监听器都是实例，不需要再次实例化）
    updateTaskListener(listeners) {
      const element = this.elementRegistry.get(this.elementId);
      // 获取当前元素的所有扩展配置实例数组
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是监听器的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:TaskListener`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", {
        values: otherExtensions.concat(listeners)
      });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展属性（attributes 是普通数组，需要重新创建实例）
    updateElementAttributes(attributes) {
      const properties = this.moddle.create(`${this.prefix}:Properties`, {
        values: attributes.map(attr => {
          return this.moddle.create(`${this.prefix}:Property`, { name: attr.name, value: attr.value });
        })
      });
      const element = this.elementRegistry.get(this.elementId);
      const extensionElements = element.businessObject.get("extensionElements");
      // 截取不是扩展属性的属性
      const otherExtensions = extensionElements?.get("values")?.filter(ex => ex.$type !== `${this.prefix}:Properties`) || [];
      // 重建扩展属性
      const extensions = this.moddle.create("bpmn:ExtensionElements", { values: otherExtensions.concat([properties]) });
      this.updateElementExtensions(element, extensions);
    },
    // 更新扩展配置 extensionElements 到元素
    updateElementExtensions(element, extensions) {
      this.modeling.updateProperties(element, { extensionElements: extensions });
      // 更新表单
      this.initFormOnChanged(this.elementId);
    }
  }
};
</script>
