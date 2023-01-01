<template>
  <div class="contrace-info">
    <el-card>
      <div slot="header">
        <span>合同信息</span>
      </div>
      <div>
        <el-form :model="form" ref="form" label-width="150px" :rules="rules" :disabled="readOnlyState">
          <el-row>
            <el-col>
              <el-form-item label="合同名称" prop="name1">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name1"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否签署" prop="name2">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name2"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="签署日期" prop="name3">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name3"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="税后可确认总收入（万元）" prop="name4">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name4"
                  @input="numberInputHandler('form.name4')"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总金额（万元）" prop="name5">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name5"
                  :disabled="disabled"
                  @input="numberInputHandler('form.name5')"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="软件费用金额（万元）" prop="name6">
                <el-input placeholder="请输入内容" v-model="form.name6" @input="numberInputHandler('form.name6')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="硬件费用金额（万元）" prop="name7">
                <el-input placeholder="请输入内容" v-model="form.name7" @input="numberInputHandler('form.name7')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据费用金额（万元）" prop="name8">
                <el-input placeholder="请输入内容" v-model="form.name8" @input="numberInputHandler('form.name8')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务费用金额（万元）" prop="name9">
                <el-input placeholder="请输入内容" v-model="form.name9" @input="numberInputHandler('form.name9')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="人员费用金额（万元）" prop="name10">
                <el-input placeholder="请输入内容" v-model="form.name10" @input="numberInputHandler('form.name10')">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他费用金额（万元）" prop="name11">
                <el-input placeholder="请输入内容" v-model="form.name11" @input="numberInputHandler('form.name11')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>


        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import mixin from "../mixin.js";
import {NumberReg} from '../validator'
export default {
  mixins: [mixin],
  components: {},
  name: "ContractInfo",
  props: {
    form: {
      type: Object,
      default: () => ({
        name1:'',
        name2:'',
        name3:'',
        name4:'',
        name5:'',
        name6:'',
        name7:'',
        name8:'',
        name9:'',
        name10:'',
        name11:'',
      })
    }
  },
  inject: ['changeReadOnlyState'],
  data() {
    return {
      disabled: true,
      rules: {
        name4: [{ validator: NumberReg, trigger: 'blur' }],
        name6: [{ validator: NumberReg, trigger: 'blur' }],
        name7: [{ validator: NumberReg, trigger: 'blur' }],
        name8: [{ validator: NumberReg, trigger: 'blur' }],
        name9: [{ validator: NumberReg, trigger: 'blur' }],
        name10: [{ validator: NumberReg, trigger: 'blur' }],
        name11: [
          { required: true, message: "必填项", trigger: "blur" },
          { validator: NumberReg, trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    readOnlyState () {
      return this.changeReadOnlyState()
    }
  },
  created() {},
  watch: {},
  methods: {
  },
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
