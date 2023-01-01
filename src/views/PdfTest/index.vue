<template>
  <div class="app-container">
    <el-form ref="fileForm" :model="fileForm" :rules="fileForm.fileRule">
      <el-form-item label="上传文件" prop="fileList">
        <upLoad :propFileList.sync="fileForm.fileList" :repositoryId="63" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submitFile">提交</el-button>
      </el-form-item>
    </el-form>
    <div>我是父组件deapartureData：{{ deapartureData }}</div>
    <base-form :form="deapartureData"></base-form>
  </div>
</template>

<script>
import UpLoad from './upLoad.vue'
import BaseForm from './baseform'
export default {
  components: { UpLoad, BaseForm },
  data () {
    return {
      fileForm: {
        fileList: [],
        fileRule: {
          fileList: [
            { type: 'array', required: true, message: '文件不能为空', trigger: 'change' }
          ]
        }
      },
      deapartureData: {}
    }
  },
  created () {
    setTimeout(() => {
      this.deapartureData = {
        code: ['002', '003']
      }
    }, 8000);
  },
  methods: {
    submitFile () {
      this.$refs.fileForm.validate(valide => {
        if (valide) {
          console.log(this.fileForm.fileList)
        }
      })
    }
  }
}
</script>

<style>

</style>