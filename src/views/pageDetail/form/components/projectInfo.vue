<template>
  <div class="project-info">
    <el-card>
      <div slot="header">
        <span>项目基础信息</span>
      </div>
      <div>
        <el-form
          :model="form"
          ref="form"
          label-width="150px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目编号" prop="name1">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name1"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="name2">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name2"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="name3">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name3"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="团队名称" prop="name4">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name4"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="团队主管" prop="name5">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name5"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目经理" prop="name6">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name6"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否立项" prop="name7">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name7"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="立项时间" prop="name8">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name8"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目起始时间" prop="name9">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name9"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目结束时间" prop="name10">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name10"
                  :disabled="disabled"
                >
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
export default {
  components: {},
  name: "ProjectInfo",
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
      })
    },
  },
  data() {
    return {
      disabled:true

    };
  },
  created() {
  },
  watch: {
  },
  methods: {

  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>

</style>
