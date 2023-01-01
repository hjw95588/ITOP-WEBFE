<template>
  <div class="base-form02">
    <!-- 合同信息（开始） -->
    <contract-info
    ref="contractForm"
    :form="form.contractForm"
    ></contract-info>
    <!-- 合同信息（结束） -->
  </div>
</template>

<script>
import {ProjectInfo, ContractInfo} from '@/views/pageDetail/form/components';
export default {
  components: {
    ProjectInfo,
    ContractInfo
  },
  name: "BaseForm02",
  props: {
    form: {
      type: Object,
      default: () => ({
        projectForm:{},
        contractForm:{},
      })
    }
  },
  data() {
    return {

    };
  },
  created() {},
  watch: {},
  methods: {
    async validataForm(){
      // 普通表单校验
      let normalFormArr = ["contractForm"];
      let checkNormalForm = await this.$business.checkForm(this, normalFormArr);
      return checkNormalForm;
    },
    updateBizFlowVariables() {
      let variables = {
        bizVariables: this.form.contractForm.name1,
      };
      this.$store.commit("work/UPDATE_BIZ_FLOW_VARIABLES", variables);
    },

  },
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
