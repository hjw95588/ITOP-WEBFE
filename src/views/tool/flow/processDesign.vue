<template>
  <div id="flow-container">
    <my-process-designer
      :key="`designer-${reloadIndex}`"
      v-model="xmlString"
      v-bind="controlForm"
      keyboard
      ref="processDesigner"
      :process-info.sync="processInfo"
      @element-click="elementClick"
      @init-finished="initModeler"
    />
    <MyProcessPanel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix" :process-info.sync="processInfo" class="process-panel" />

    <!-- demo config -->
    <div class="demo-control-bar">
      <div class="open-control-dialog" @click="controlDrawerVisible = true"><i class="el-icon-setting"></i></div>
    </div>
    <el-drawer :visible.sync="controlDrawerVisible" size="400px" title="偏好设置" append-to-body destroy-on-close>
      <el-form :model="controlForm" size="small" label-width="100px" class="control-form" @submit.native.prevent>
        <el-form-item label="流程ID">
          <el-input v-model="controlForm.processId" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="controlForm.processName" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="流转模拟">
          <el-switch v-model="controlForm.simulation" inactive-text="停用" active-text="启用" @change="reloadProcessDesigner" />
        </el-form-item>
        <el-form-item label="禁用双击">
          <el-switch v-model="controlForm.labelEditing" inactive-text="停用" active-text="启用" @change="changeLabelEditingStatus" />
        </el-form-item>
        <el-form-item label="隐藏label">
          <el-switch v-model="controlForm.labelVisible" inactive-text="停用" active-text="启用" @change="changeLabelVisibleStatus" />
        </el-form-item>
        <el-form-item label="流程引擎">
          <el-radio-group v-model="controlForm.prefix" @change="reloadProcessDesigner">
            <el-radio label="activiti">activiti</el-radio>
            <el-radio label="camunda">camunda</el-radio>
            <el-radio label="flowable">flowable</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工具栏">
          <el-radio-group v-model="controlForm.headerButtonSize">
            <el-radio label="mini">mini</el-radio>
            <el-radio label="small">small</el-radio>
            <el-radio label="medium">medium</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import translations from "@/flow/translations";
// 自定义渲染（隐藏了 label 标签）
import CustomRenderer from "@/flow/modules/custom-renderer";
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "@/flow/package/process-designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "@/flow/package/process-designer/plugins/palette";
// 自定义侧边栏
import MyProcessPanel from "@/flow/package/process-panel/ProcessPanel";

export default {
  name: "processDesign",
  components: {
    MyProcessPanel
  },
  props: {
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  data() {
    return {
      xmlString: "",
      modeler: null,
      reloadIndex: 0,
      controlDrawerVisible: false,
      translationsSelf: translations,
      controlForm: {
        processId: "",
        processName: "",
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: "activiti",
        headerButtonSize: "mini",
        additionalModel: [CustomContentPadProvider, CustomPaletteProvider]
      },
      addis: {}
    };
  },
  mounted() {
    // remove logo
    document.querySelector('.bjs-powered-by').remove()
  },
  created() {
    // console.log(this.translationsSelf);
  },
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        this.modeler = modeler;
      }, 10);
    },
    reloadProcessDesigner() {
      this.controlForm.additionalModel = [];
      for (let key in this.addis) {
        if (this.addis[key]) {
          this.controlForm.additionalModel.push(this.addis[key]);
        }
      }
      this.reloadIndex += 1;
      this.modeler = null; // 避免 panel 异常
    },
    changeLabelEditingStatus(status) {
      this.addis.labelEditing = status ? { labelEditingProvider: ["value", ""] } : false;
      this.reloadProcessDesigner();
    },
    changeLabelVisibleStatus(status) {
      this.addis.customRenderer = status ? CustomRenderer : false;
      this.reloadProcessDesigner();
    },
    elementClick(element) {
      this.element = element;
    },
  }
};
</script>

<style lang="scss">
@import "@/flow/package/theme/index.scss";

#flow-container {
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: auto max-content;
  grid-template-rows: 800px;
  // grid-auto-rows: minmax(min-content, max-content);

}
.demo-control-bar {
  position: fixed;
  right: 8px;
  bottom: 8px;
  z-index: 1;
  .open-control-dialog {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 32px;
    background: rgba(64, 158, 255, 1);
    color: #ffffff;
    cursor: pointer;
  }
}
.control-form {
  .el-radio {
    width: 100%;
    line-height: 32px;
  }
}
</style>
