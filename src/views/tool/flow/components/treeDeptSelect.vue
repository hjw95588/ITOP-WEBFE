<template>
  <div>
    <treeselect
      v-model="deptValue"
      valueFormat="object"
      @input="selectUnit"
      :load-options="treeselectLoadNode"
      :options="companyOptions"
      :multiple="multiple"
      :searchable="false"
      :disabled="disabled"
      noChildrenText="没有更多了~"
      placeholder="请选择"
      loadingText="加载中..."
    />
  </div>
</template>

<script>
import request from "@/utils/request";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
export default {
  name: "",
  components: { Treeselect },
  props: {
    propValue: {
      type: Object,
      default: () => null
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deptValue: null,
      companyOptions: []
    };
  },
  created() {
    this.treeselectLoadfirstnode();
  },
  mounted() {},
  activited() {},
  update() {},
  beforeRouteUpdate() {},
  methods: {
    /** tree-select懒加载 */
    treeselectLoadNode({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (!parentNode.isLeaf) {
          /** 加载节点的子节点集合 */
          request({
            url: `/system/dept/find/${parentNode.id}`,
            method: "GET"
          }).then(res => {
            if (res.code === 200) {
              let childDeptOp = [];
              res.data.forEach(item => {
                let obj = {};
                obj.id = item.deptId;
                obj.label = item.deptName;
                obj.isLeaf = item.leaf;
                obj.children = null;
                childDeptOp.push(obj);
              });
              parentNode.children = childDeptOp;
              callback();
            }
          });
        } else {
          /** 没有子节点 */
          parentNode.children = [];
          callback();
        }
      }
    },

    /** treeselect初始化一级节点 */
    treeselectLoadfirstnode() {
      let $this = this;
      request({
        url: "/system/dept/parentNode",
        method: "GET"
      }).then(res => {
        if (res.code === 200) {
          let data = [res.data];
          let deptOp = [];
          data.forEach(item => {
            let obj = {};
            obj.id = item.deptId;
            obj.label = item.deptName;
            obj.isLeaf = item.leaf;
            obj.children = null;
            deptOp.push(obj);
          });
          $this.companyOptions = deptOp;
        }
      });
    },

    /** 选择树节点 */
    selectUnit(node) {
      !!node && this.$emit("selectUnit", node);
    }
  },
  filter: {},
  computed: {},
  watch: {
    isClose: {
      handler(newValue, oldValue) {
        this.deptValue = !!this.propValue ? this.propValue : null
      },
      immediate: true,
    }
  }
};
</script>

<style lang="scss" scoped></style>
