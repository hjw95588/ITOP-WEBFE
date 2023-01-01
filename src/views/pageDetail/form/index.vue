<template>
  <div class="base-form">
    <Approval
      ref="approvalForm"
      :approvalForm="approvalForm"
      v-if="approvalVisible"
    />
    <BaseForm01 :ref="formType" :form="form" v-if="formType === 'baseForm01'" />
    <BaseForm02 :ref="formType" :form="form" v-if="formType === 'baseForm02'" />



  </div>
</template>

<script>
import { Approval } from "@/views/pageDetail/form/components";
import { BaseForm01, BaseForm02 } from "@/views/pageDetail/form/views";
export default {
  components: {
    BaseForm01,
    BaseForm02,
    Approval
  },
  name: "BaseForm",
  props: {
    formType: {
      type: String,
      default: ""
    },
    form: {
      type: Object,
      default: () => ({})
    },
    approvalForm: {
      type: Object,
      default: () => ({})
    },
    approvalVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {
    /**校验业务表单 */
    async businessValidate () {
      /** 普通表单校验 */
      if (this.formType && !!this.$refs[this.formType]) {
        let res = await this.$refs[this.formType].validataForm(
          this.approvalForm
        );
        console.log(res)
        if (res.constructor === Boolean) {
          if (!res) {
            this.msgInfo("温馨提示: 业务信息填写有误, 请仔细填写信息内容！")
          }
          return res
        } else {
          return res.validateState
        }
      }
    },
    async validataForm() {
      /**验证审批 */
      if (this.approvalVisible) {
        const approlFormState = this.$refs.approvalForm.validateApprolForm();
        if (!approlFormState) {
          this.msgInfo("温馨提示: * 号为必填项, 请仔细填写审批必填内容！")
          return approlFormState;
        }
        if (this.approvalForm.approvalFlag === 1) {
          const businessState = await this.businessValidate()
          return businessState
        }
        return true
      } else {
        const businessState = await this.businessValidate()
        return businessState
      }
    },
    /** 保存流程变量 */
    saveChildVariables() {
      if (this.approvalVisible === true) {
        /** 保存审批表单变量 */
        this.$refs.approvalForm.updateApprovalVariables();
      }
      if (this.formType && this.$refs[this.formType].updateBizFlowVariables) {
        /** 保存业务表单变量 */
        this.$refs[this.formType].updateBizFlowVariables();
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped></style>
