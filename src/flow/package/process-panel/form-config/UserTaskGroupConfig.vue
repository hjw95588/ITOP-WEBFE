<template>
  <div class="form-config-container">
    <div class="form">
      <el-input v-model="groupName" readonly style="width:150px" />
      <el-button
        type="success"
        size="small"
        icon="el-icon-search"
        @click="showSelectDialog()"
        >选择</el-button
      >
    </div>

    <!-- 选择表单弹窗（开始） -->
    <el-dialog
      :title="selectFormDialog.title"
      :visible.sync="selectFormDialog.visible"
      :width="selectFormDialog.width"
      :fullscreen="selectFormDialog.fullscreen"
      :close-on-press-escape="selectFormDialog.closeOnPressEscape"
      append-to-body
      center
      :before-close="handleClose"
      @close="closeSelectFormDialog"
    >
      <select-group
        ref="selectGroup"
        :processInfo="processInfo"
        @setForm="setForm"
      />
    </el-dialog>
    <!-- 选择表单弹窗（结束） -->
  </div>
</template>
<script>
import SelectGroup from "@/views/form/selectGroup.vue";
import deepClone from "clone-deep";
export default {
  name: "UserTaskGroupConfig",
  components: { SelectGroup },
  props: {
    elementId: String,
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  data() {
    return {
      groupName: "",
      options: [
        {
          groupId: 1,
          groupKey:'key1',
          groupName: 'group1',
          userList: []
        },
        {
          groupId: 2,
          groupKey:'key2',
          groupName: 'group2',
          userList: []
        },
        {
          groupId: 3,
          groupKey:'key3',
          groupName: 'group3',
          userList: []
        },
      ],
      selectFormDialog: {
        title: "选择审批岗位",
        visible: false,
        width: "900",
        name: "选择审批岗位", // 组件名,
        loading: false,
        fullscreen: false,
        closeOnPressEscape: false
      }
    };
  },
  created() {
    // console.log("表单id", this.elementId);
  },
  watch: {
    elementId: {
      immediate: true,
      handler(newVal) {
        // console.log("elementId发生改变", newVal);
        this.initGroupName();
      }
    }
  },
  methods: {
    // 初始化表单的值
    initGroupName() {
      let hasNode = this.processInfo.nodeList.find(item => {
        return item.nodeId === this.elementId;
      });
      this.groupName =
        hasNode && hasNode.group && hasNode.group.groupName
          ? hasNode.group.groupName
          : "";
    },
    showSelectDialog() {
      this.selectFormDialog.visible = true;
    },
    closeSelectFormDialog() {
      this.selectFormDialog.visible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    setForm(groupRow) {
      // let groupRow = this.options.find(item=>item.groupId===this.groupName);
      console.log("点选择时（审批岗位）--这条流程信息", this.processInfo, groupRow);
      let nodeList = this.processInfo.nodeList;
      let hasNode = nodeList.find(item => {
        return item.nodeId === this.elementId;
      });
      console.log("hasNode", hasNode);
      // 准备节点对象
      /* let item = {
        nodeId:'',
        form:{
          nodeId: "", //节点id
          id: "",
          formKey: "",
          controlName: "",
          controlValue: ""
        },
        group:{
          groupId: '',
          groupKey: '',
          groupName: '',
          nodeId: '',
          userList: []
        }
      } */
      let { groupId, groupKey, groupName, userList } = groupRow;
      if (!hasNode) {
        // 节点数组中没有该节点时，直接添加
        let nodeItem = {
          nodeId: this.elementId,
          group: { groupId, groupKey, groupName, userList }
        };
        nodeList.push(nodeItem);
      } else {
        // console.log("要替换的节点信息", nodeItem);
        // 节点数组中有该节点时，替换原对象
        nodeList.forEach(item => {
          if (item.nodeId === this.elementId) {
            // item = deepClone(nodeItem)
            item['group']={};
            item["group"]["groupId"] = groupId;
            item["group"]["groupKey"] = groupKey;
            item["group"]["groupName"] = groupName;
            item["group"]["userList"] = deepClone(userList);
          }
        });
      }
      console.log("替换选择的表单", nodeList);
      this.groupName = groupName;
      let activitiVal = '${'+groupKey+'}';
      this.$emit('updateBaseInfo','candidateUsers',activitiVal)
      this.closeSelectFormDialog();

    },
  }
};
</script>
<style lang="less" scoped>
.form-config-container {
  padding: 20px 0;
}
.form {
  margin-left: 50px;
}
</style>
