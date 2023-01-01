<template>
  <div class="design">
    <FormDesign
      ref="bpm"
      :show-toolbars-text="true"
      :default-value="defaultValue"
      @save="handleSave"
      @close="handleClose"
    />
  </div>
</template>

<script>
import { updateForm } from "@/api/tool/form";
import deepClone from "clone-deep";

export default {
  name: "BpmFormDesign",
  props: {
    formInfo: {
      type: Object,
      require: true,
      default: null,
    },
  },
  data() {
    return {
      form: {
        id: '',
        formKey: '',
        controlName: '',
        controlValue: '',
      },

      defaultValue: {
        config: {
          labelPosition: "right",
          labelWidthUnitPercent:false,
          labelWidth: 100,
          autoLabelWidth: false, // 子表单有问题
        },
        list: [],
      },
    };
  },
  computed: {},
  watch: {
    formInfo: {
      handler(newValue, oldValue) {
        this.form = deepClone(newValue);
        this.setDesignData(this.form);
        // 渲染JSON
        // this.$refs.bpm.setDesignData(this.form.controlValue)
      },
      deep: true,
    },
  },
  mounted() {
    console.log("design ---mounted --- ");
    this.setDesignData(this.formInfo);
    // this.form = deepClone(this.formInfo)
    // console.log('form --- ' + JSON.stringify(this.form))

    // if (this.form && this.form.controlValue) {
    //   this.$nextTick(() => {
    //     this.$refs.bpm.setDesignData(JSON.parse(this.formInfo.controlValue))
    //   })
    // } else {
    //   this.$refs.bpm.setDesignData(this.defaultValue)
    // }
  },
  created() {
    console.log("design ---start --- ");
  },
  methods: {
    // 对传入的json数据（this.formInfo.controlValue），进行默认显示
    setDesignData(formInfo) {
      this.form = deepClone(this.formInfo);
      if (this.form && this.form.controlValue) {
        this.$nextTick(() => {
          this.$refs.bpm.setDesignData(JSON.parse(this.formInfo.controlValue));
        });
      } else {
        this.$refs.bpm.setDesignData(this.defaultValue);
      }
    },
    deleteAll() {
      this.data.list = [];
    },
    handleSave(value) {
      console.log('保存按钮',value)
      const that = this;

      const controlValue = deepClone(value);
      const dynamicKeyList = this.getDynamicKeyList(value);
      controlValue.dynamicKeyList = dynamicKeyList;

      that.form.controlValue = JSON.stringify(controlValue);
      console.log('表单json',that.form.controlValue)
      const postData = {
        id: this.form.id,
        formKey: this.form.formKey,
        controlName: this.form.controlName,
        controlValue: this.form.controlValue,
      };
      updateForm(postData).then((response) => {
        that.$message.success("保存成功!");
        that.$nextTick(() => {
          that.loading = false
        })
        that.handleReset()
        that.$emit('closeFormDesignDialog')
        that.$emit('queryList')
      });
    },
    handleReset() {
      const that = this;
      that.$refs.bpm.deleteAll();
      // that.$refs.bpm.data.list = []
    },
    handleClose() {
      console.log("handleClose");

      const that = this;
      that.$refs.bpm.handleClose();
    },
    getDynamicKeyList(data) {
      var dynamicKeyList = [];
      if (data === null || data === undefined || data === "") {
        return dynamicKeyList;
      }
      data.list.forEach((item, i) => {
        if (
          item.type === "select" ||
          item.type === "checkbox" ||
          item.type === "cascader" ||
          item.type === "tree" ||
          item.type === "radio"
        ) {
          if (item.options.dynamic && item.options.dynamicKey !== "") {
            dynamicKeyList.push(item.options.dynamicKey);
          }
        }
      });
      return dynamicKeyList;
    },
  },
};
</script>

<style scoped>
.design {
  height: 100%;
}
</style>
