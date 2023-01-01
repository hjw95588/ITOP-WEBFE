<template>
  <div>
    <el-form
      ref="processUpdateForm"
      :model="process"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="流程名称" prop="flowName">
        <el-input v-model.trim="process.flowName" />
      </el-form-item>
      <el-form-item label="流程Key" prop="flowKey">
        <el-input v-model="process.flowKey" disabled/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="process.description" type="textarea" maxlength="500" show-word-limit :autosize="{minRows: 4, maxRows:10}" /></el-form-item>
      <el-form-item class="itemFooter">
        <el-button :loading="loading" type="primary" @click="onSubmit"> 确定 </el-button>
        <el-button @click="onCancel"> 取消 </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>

// import { updateProcess } from '@/api/process'
import { updateProcess } from '@/api/process/processList'
import deepClone from 'clone-deep'
import store from '@/store'

export default {
  name: 'UpdateProcess',

  props: {
    processInfo: {
      type: Object,
      require: true,
      default: null
    }
  },
  data() {
    return {
      process: {
        id: null,
        flowKey: null,
        flowName: null,
        description: null,
      },
      loading: false,
      rules: {
        flowName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' },
          { max: 200, message: '流程名称最多输入200字符', trigger: 'blur' }
        ],
        flowKey: [
          { required: true, message: '请输入流程KEY', trigger: 'blur' },
          { min: 1, message: '长度最少为1个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
    processInfo: {
      handler(newValue, oldValue) {
        this.process = deepClone(newValue)
      },
      deep: true
    }
  },
  mounted() {
    this.process = deepClone(this.processInfo)
  },
  created() {
  },
  methods: {
    onSubmit() {
      const _this = this
      _this.loading = true
      _this.$refs['processUpdateForm'].validate((valid) => {
        if (valid) {
          let {id,flowName,flowKey,description} = _this.process;
          let postData = {id,flowName,flowKey,description}
          updateProcess(postData).then(response => {
            _this.$message.success('保存成功!')
            _this.$nextTick(() => {
              _this.loading = false
            })
            _this.$emit('closeUpdateForm')
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

      _this.$emit('closeUpdateForm')
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

.el-drawer {
  overflow: scroll;
}
.itemFooter { text-align: right;}
</style>
