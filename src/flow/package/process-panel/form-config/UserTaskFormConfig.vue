<template>
  <div class="form-config-container">
    <!-- <div class="form">
      <el-input v-model="controlName" readonly style="width: 150px" />
      <el-button
        type="success"
        size="small"
        icon="el-icon-search"
        @click="showSelectDialog()"
        >选择</el-button
      >
    </div> -->
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="nodeFormList"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="40">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="表单名称">
        <template slot-scope="{ row }">
          <span>{{ row.controlName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="表单类型">
        <template slot-scope="{ row }">
          <span>{{ row.formType | typeFilter }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="50px" align="center" label="排序">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column> -->

      <el-table-column>
        <template slot="header">
          <span class="btn" @click="showSelectDialog()">新增</span>
        </template>
        <template slot-scope="{ row }">
          <span class="btn" @click="handleDelete(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <!-- <div class="show-d">
      <el-tag style="margin-right: 12px">{{ $t("table.dragTips1") }} :</el-tag>
      {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>{{ $t("table.dragTips2") }} :</el-tag> {{ newList }}
    </div> -->
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
      <selectForm
        ref="selectForm"
        :processInfo="processInfo"
        @setForm="setForm"
      />
    </el-dialog>
    <!-- 选择表单弹窗（结束） -->
  </div>
</template>
<script>
import Sortable from "sortablejs";
import SelectForm from "@/views/form/selectForm.vue";
import deepClone from "clone-deep";
export default {
  name: "UserTaskFormConfig",
  components: { SelectForm },
  props: {
    elementId: String,
    processInfo: {
      type: Object,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      controlName: "",
      selectFormDialog: {
        title: "选择表单",
        visible: false,
        width: "900",
        name: "选择表单", // 组件名,
        loading: false,
        fullscreen: false,
        closeOnPressEscape: false,
      },
      nodeFormList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
      },
      sortable: null,
      oldList: [],
      newList: [],
    };
  },
  filters: {
    typeFilter(formType) {
      if (formType === "" || formType === undefined || formType === null) {
        return "";
      }
      const formTypeMap = {
        0: "Vue",
        1: "JSON",
        2: "审批",
      };
      return formTypeMap[formType];
    },
  },
  created() {
    this.getList();
  },
  watch: {
    elementId: {
      immediate: true,
      handler(newVal) {
        this.initControlName();
      },
    },
  },
  methods: {
    // 初始化表单的值
    initControlName() {
      // console.log("初始化表单的值-this.processInfo", this.processInfo);
      // console.log("初始化表单的值-this.elementId:", this.elementId);
      const initFormList = [];
      let hasNode = this.processInfo.nodeList.find((item) => {
        return item.nodeId === this.elementId;
      });
      // console.log("有当前节点的审批岗位、表单信息", this.processInfo, hasNode);
      // console.log("hasNode---:", hasNode);
      if (hasNode && hasNode.formList) {
        this.nodeFormList = hasNode.formList;
      } else {
        this.nodeFormList = initFormList;
        // console.log("----------init[]----");
      }
      // console.log("this.nodeFormList :", this.nodeFormList);
    },
    showSelectDialog() {
      this.selectFormDialog.visible = true;
    },
    closeSelectFormDialog() {
      this.selectFormDialog.visible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleDelete(row) {
      const id = row.id;
      this.$confirm("是否确认删除表单编号为[" + id + "]的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const index = this.nodeFormList.findIndex((d) => d.id === id);
          this.nodeFormList.splice(index, 1);
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    setForm(formRow) {
      // console.log("点选择时(表单)--这条流程信息", this.processInfo, formRow);
      let nodeList = this.processInfo.nodeList;
      let hasNode = nodeList.find((item) => {
        return item.nodeId === this.elementId;
      });
      // console.log("setForm--hasNode:", hasNode);
      // console.log("formRow:", formRow);
      // console.log("this.nodeFormList:", this.nodeFormList);
      let { id, formKey, formType, controlName, controlValue } = formRow;
      if (!hasNode) {
        let nodeItem = {
          nodeId: this.elementId,
          formList: [{ id, formKey, formType, controlName, controlValue }],
        };
        // console.log("nodeItem----:", nodeItem);
        nodeList.push(nodeItem);
        // console.log("nodeList-----:", nodeList);
        this.nodeFormList = nodeItem.formList;
      } else {
        if (!hasNode.formList) {
          let nodeItem2 = {
            formList: [{ id, formKey, formType, controlName, controlValue }],
          };
          // console.log("nodeItem--2--:", nodeItem2.formList);
          hasNode.formList = nodeItem2.formList;
          // console.log("nodeList--2---:", hasNode);
          this.nodeFormList = nodeItem2.formList;
        } else {
          hasNode.formList.push(formRow);
          // hasNode.formList.forEach((item) => {
          //   console.log("-------item-----", item);
          //   if (item.id === formRow.id) {
          //     console.log("----请勿重复选择表单！------");
          //     this.$message.error("建议请勿重复选择表单！");
          //   } else {
          //     console.log("--------final-----------");
          //     hasNode.formList.push(formRow);
          //   }
          // });
        }
      }
      // console.log("选择表单列表after：", this.processInfo.nodeList);
      this.closeSelectFormDialog();
    },
    async getList() {
      this.listLoading = true;

      this.listLoading = false;
      this.oldList = this.nodeFormList.map((v) => v.id);
      this.newList = this.oldList.slice();
      this.$nextTick(() => {
        this.setSort();
      });
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData("Text", "");
        },
        onEnd: (evt) => {
          const targetRow = this.nodeFormList.splice(evt.oldIndex, 1)[0];
          this.nodeFormList.splice(evt.newIndex, 0, targetRow);

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          this.newList.splice(evt.newIndex, 0, tempIndex);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-config-container {
  padding: 0;
}
.form {
  margin-left: 50px;
}
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
.btn {
  font-size: 12px;
  color: #4f7d96;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
  }
}
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
