<template>
  <div class="approval-compoents">
    <el-card>
      <div slot="header">
        <span>审批</span>
      </div>
      <div>
        <el-form
          :model="approvalForm"
          ref="approvalForm"
          label-width="150px"
          :rules="rules"
          :disabled="readOnlyState"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="审批结果" prop="approvalFlag">
                <el-radio-group v-model="approvalForm.approvalFlag">
                  <el-radio :label="1">同意</el-radio>
                  <el-radio :label="0">不同意</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审批意见" prop="approvalSuggestion">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入审批意见"
                  v-model="approvalForm.approvalSuggestion"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="审批人员" prop="approvalPerson">
                <el-input
                  v-model="approvalForm.approvalPerson"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属部门" prop="approvalDept">
                <el-input
                  v-model="approvalForm.approvalDept"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批时间" prop="approvalTime">
                <el-input
                  v-model="approvalForm.approvalTime"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { NumberReg } from "../validator";
import { parseTime } from "@/utils/king";

export default {
  components: {},
  name: "Approval",
  props: {
    approvalForm: {
      type: Object,
      default: () => ({
        approvalFlag: "",
        approvalSuggestion: "",
        approvalPerson: "",
        approvalDept: "",
        approvalTime: "",
      }),
    },
  },
  inject: ['changeReadOnlyState'],
  data() {
    return {
      disabled: true,
      rules: {
        approvalFlag: [
          { required: true, message: "必填项", trigger: "change" },
          // { validator: NumberReg, trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["name", "depts"]),
    readOnlyState () {
      return this.changeReadOnlyState()
    }
  },
  created() {
    this.initData();
  },
  watch: {},
  methods: {
    initData() {
      if (!this.readOnlyState) {
        this.approvalForm.approvalPerson = this.name;
        this.approvalForm.approvalDept = this.depts[0].deptName;
        this.approvalForm.approvalTime = parseTime(
          Date.now(),
          "{y}-{m}-{d} {h}:{i}:{s}"
        );
      } else {
        if (JSON.stringify(this.approvalForm) === '{}') {
          this.approvalForm.approvalPerson = this.name;
          this.approvalForm.approvalDept = this.depts[0].deptName;
        }
      }
    },
    updateApprovalVariables() {
      let variables = {
        pass: this.approvalForm.approvalFlag === 1 ? true : false,
      };
      this.$store.commit("work/UPDATE_APPROVAL_VARIABLES", variables);
    },
    // 验证表单
    validateApprolForm () {
      let boolState
      this.$refs.approvalForm.validate(valide => {
        boolState = valide
      })
      return boolState
    }
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
</style>
