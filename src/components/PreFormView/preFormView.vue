<template>
  <div class="formView">
    <FormBuild
      ref="bpm"
      :options.sync="options"
      :dynamic-data.sync="dynamicData"
      :default-value="defaultValue"
      :disabled="disabled"
    >
    </FormBuild>
    <div class="dialog-footer" v-if="showCloseBtn">
      <el-button type="primary" @click="close"> 关闭 </el-button>
    </div>
  </div>
</template>

<script>
import deepClone from "clone-deep";
import FormBuild from "../elementFormDesign/formBuild";

export default {
  name: "PreFormView",
  components: { FormBuild },
  props: {
    formInfo: {
      type: Object,
      require: true,
      default: null
    },
    defaultValue: { //表单默认值
      type: Object,
      require: false,
      default: {}
    },
    dynamicData: {  //动态数据
      type: Object,
      require: false,
      default: {}
    },
    width: {
      type: String,
      require: false,
      default: "850"
    },
    showCloseBtn: {
      type: Boolean,
      require: false,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: "",
        formKey: "",
        controlName: "",
        controlValue: "" // 表单json字符串化
      },
      options: {
        // json表单
        config: {
          labelPosition: "right",
          labelWidthUnitPercent: false,
          labelWidth: 100,
          autoLabelWidth: false
        },
        list: []
      },
      defaultOption: {
        // options的默认值
        config: {
          labelPosition: "right",
          labelWidthUnitPercent: false,
          labelWidth: 100,
          autoLabelWidth: false
        },
        list: []
      },
      formViewVisible: false
    };
  },
  computed: {},
  watch: {
    formInfo: {
      handler(newValue, oldValue) {
        this.form = deepClone(newValue);
        this.setData(this.form);
      },
      deep: true
    }
  },
  mounted() {},
  created() {
    this.setData(this.formInfo);
  },
  methods: {
    close() {
      const that = this;
      that.$emit("closePreViewDialog");
    },
    setData(formInfo) {
      this.form = deepClone(this.formInfo);
      if (this.form && this.form.controlValue) {
        this.$nextTick(() => {
          this.options = JSON.parse(this.form.controlValue);
        });
      } else {
        this.$nextTick(() => {
          this.options = this.defaultOption;
        });
      }
    }
  }
};
</script>

<style scoped>
.design {
  height: 100%;
}
.dialog-footer {
  text-align: right;
}
</style>
