<template>
  <div class="base-form01">
    <!-- 项目基础信息（开始） -->
    <project-info ref="projectForm" :form="form.projectForm"></project-info>
    <!-- 项目基础信息（结束） -->

    <!-- 合同信息（开始） -->
    <contract-info ref="contractForm" :form="form.contractForm"></contract-info>
    <!-- 合同信息（结束） -->

    <!-- 项目进度（开始） -->
    <establish-project
      ref="establishProject"
      :form="form.establishProjectForm"
    ></establish-project>
    <!-- 项目进度（开始） -->
  </div>
</template>

<script>
import {
  ProjectInfo,
  ContractInfo,
  EstablishProject,
} from "@/views/pageDetail/form/components";
export default {
  components: {
    ProjectInfo,
    ContractInfo,
    EstablishProject,
  },
  name: "BaseForm01",
  props: {
    form: {
      type: Object,
      default: () => ({
        projectForm: {},
        contractForm: {},
        establishProjectForm: {},
      }),
    },
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {
    async validataForm() {
      // 普通表单校验
      let normalFormArr = [
        "projectForm",
        "contractForm",
        "establishProject",
      ];
      let checkNormalForm = await this.$business.checkForm(this, normalFormArr);
      return checkNormalForm;
    },
    updateBizFlowVariables() {
      // console.log("-------updateBizFlowVariables-------");
      let variables = {
        bizVariables: this.form.projectForm.name1,
      };
      this.$store.commit("work/UPDATE_BIZ_FLOW_VARIABLES", variables);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped></style>
