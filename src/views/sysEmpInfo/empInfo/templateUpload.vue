<!---表单信息-->
<template>
  <div>
    <el-form
      ref="baseForm"
      label-width="180px"
    >
      <!---------------------------- 基本信息 start------------------------------------->
      <el-card>
        <div slot="header">
          <span>人员excel上传</span>
        </div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="离职人员上传文件excel" >
              <el-upload
                ref="upload"
                class="upload-demo"
                action="/sysEmpInfo/empInfo/terminationPerson/import/"
                :headers="myHeaders"
                :http-request="myUpload"
                :limit="1"
                :before-upload="beforeUpload"
                :show-file-list="false"
              >
                <el-button type="primary" size="mini"
                >上传<i class="el-icon-upload el-icon--right"></i
                ></el-button>

              </el-upload>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="升级人员上传文件.txt" >
              <el-upload
                ref="upload"
                class="upload-demo"
                action="/sysEmpInfo/empInfo/updateGradePerson/import/"
                :headers="myHeaders"
                :http-request="myUpload"
                :limit="1"
                :show-file-list="false"
              >
                <el-button type="primary" size="mini"
                >上传<i class="el-icon-upload el-icon--right"></i
                ></el-button>

              </el-upload>
            </el-form-item>

          </el-col>
        </el-row>
      </el-card>
      <!---------------------------- 基本信息 end------------------------------------->
    </el-form>



  </div>
</template>

<script>
import Upload from "@/components/upload/index.vue";
import { mapGetters } from "vuex";
import mixin from "@/views/pageDetail/mixin.js";
import {Notification} from "element-ui";
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export default {
  name: "addForm",
  mixins: [mixin],
  components: { Upload},
  data(){
    return{
      myHeaders: {
        Authorization: getToken(),
      },
    }
  },
  computed: {
    ...mapGetters(["workDetail"]),
  },
  created() {

  },
  methods: {
    /**附件改变后处理 */
    onChange(fileList) {

    },
    handleSuccess(res,file,fileList){
      //不执行
     console.log(11);
    },
    // 文件上传接口
    myUpload(content) {
      let imgfile = new FormData();
      imgfile.append("files", content.file);
      request({
        url: content.action,
        method: "POST",
        data: imgfile,
      }).then((res) => {
        if (res.code === 200) {
          console.log(res,"----------")
          this.msgSuccess("成功更新 "+res.data+" 条");
          this.$refs.upload.clearFiles();
        }
      });
    },

    beforeUpload(file){
      const fileName=file.name
      const fileType=fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
      if(
        fileType==='.xlsx' ||
        fileType==='.xls'
      ){}else{
        this.$message.error('请上传excel文件')
        return false
      }
      console.log("file.size",file.size)
    },
  },
  mounted(){

  }
}
</script>

<style scoped>

</style>
