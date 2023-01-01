<template>
  <div>
    <el-form
      ref="insertProcessForm"
      :model="process"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="流程名称" prop="flowName">
        <el-input v-model.trim="process.flowName" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="process.description" type="textarea" maxlength="500" show-word-limit :autosize="{minRows: 4, maxRows:10}" /></el-form-item>
      <el-form-item class="btnWrap">
        <el-button :loading="loading" type="primary" @click="onSubmit"> 确定 </el-button>
        <el-button @click="onCancel"> 取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import { insertProcess } from '@/api/process/processList.js'
import { generateTitle } from '@/utils/i18n'
import store from '@/store'

export default {
  name: 'AddProcess',
  props: {
  },
  data() {
    return {
      process: {
        flowName: '',
        description: '',
      },
      company: {},
      companyList: [],
      companyMap: {},
      loading: false,
      rules: {
        flowName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { min: 1, message: '长度最少为1个字符', trigger: 'blur' },
          { max: 200, message: '流程名称最多输入200字符！' }
        ]

      }
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  created() {
  },
  methods: {
    generateTitle,
    onSubmit() {
      const _this = this
      _this.loading = true
      _this.$refs['insertProcessForm'].validate((valid) => {
        if (valid) {
          const postData = _this.process
          console.log('新增表单数据',postData)
          insertProcess(postData).then(response => {
            _this.$message.success('保存成功!')
            _this.$nextTick(() => {
              _this.loading = false
            })
            _this.$emit('close')
            _this.$emit('queryList')
          })
        } else {
          _this.$nextTick(() => {
            _this.loading = false
          })
          return
        }
      })
      this.$nextTick(() => {
        _this.loading = false
      })
    },
    onCancel() {
      const _this = this
      _this.$emit('close')
    }
  }
}
</script>

<style scoped>
.el-form-item label:after {
        content: "";
        display: inline-block;
        width: 100%;
    }

    .el-form-item__label {
        text-align: justify;
        height: 50px;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: none !important;
    }
.el-drawer:focus {
    outline: none;
}
.btnWrap { text-align: right;}
</style>
