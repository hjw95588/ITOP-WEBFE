<template>
  <el-upload
    :ref="'uploadFile'"
    action="/common/uploads"
    :headers="myHeaders"
    :list-type="listType"
    :http-request="myUpload"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
    :before-upload="beforeUpload"
    :file-list="files"
    :limit="limit"
    :data="data"
    :name="name"
    :disabled="disabled"
  >
    <el-button type="primary" size="mini"
      >{{ buttonText }}<i class="el-icon-upload el-icon--right"></i
    ></el-button>
    <div slot="tip" class="el-upload__tip">{{ warnText }}</div>
  </el-upload>
</template>

<script>
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export default {
  name: "UploadFile",
  props: {
    warnText: String,
    buttonText: String,
    data: Object, // 上传时附带的额外参数
    name: {  //上传的文件字段名
      type: String,
      default: "file"
    },
    limit: Number,
    multiple: { // 是否支持多选文件
      type: Boolean
    },
    disabled: { // 是否禁用
      type: Boolean
    },
    listType: String, // 文件列表的类型
    value: { // 默认的文件数组
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: "/common/uploads"
    }
  },
  data() {
    return {
      files: [],
      myHeaders: {
        Authorization: getToken()
      }
    };
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue.length === 0) {
          this.files = [];
        }
        // 监听value,变化时让fileList也变化
        this.files = newValue;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 文件上传接口
    myUpload(content) {
      console.log('上传的文件',content.file)
      let imgfile = new FormData();
      imgfile.append("files", content.file);

      request({
        url: content.action,
        method: "POST",
        data: imgfile,
      }).then((res) => {
        if (res.code === 200) {
          console.log('上传接口执行')
          // this.$message.success("上传成功！");
          let documents = [];
          let obj = {};
          console.log('上传的文件对象--前',JSON.stringify(obj))
          let file = res.file[0];
          let name = Object.keys(file)[0];
          let url = Object.values(file)[0];
          obj.name = name;
          obj.url = url;
          obj.fileName = name;
          obj.filePath = url;
          /* obj.name = res.data[0].fileName;
          obj.url = res.data[0].filePath;
          obj.piisDocId = res.data[0].piisDocId;
          obj.filePath = res.data[0].filePath;
          obj.fileName = res.data[0].fileName; */
          console.log('上传的文件对象',JSON.stringify(obj))
          console.log('上传的文件对象-后',obj)
          this.files.push(obj);
          this.$emit('input', this.files)
          // this.$emit("update:propFileList", this.files);
          // this.$emit("onChange", this.files);
        } else {
          // this.$message.error(res.msg);
        }
      });
    },
     // 文件移除操作
    handleRemove(file, fileList) {
      let delhistory = [];
      file.operationType = 3;
      delhistory.push(file); // 记录删除文件的历史记录
      this.$emit('input', this.files)
      /* this.$emit("updateDelhistory", delhistory);
      this.$emit("update:propFileList", fileList);
      this.$emit("onChange", this.files); */
    },
    // 文件上传成功
    handleSuccess(fn, file, fileList) {},
    // 文件上传失败
    handleError(fn, file, fileList) {},
    // 超出限制提示
    handleExceed(files, fileList) {
      console.log('超出数量限制',this.limit)
      this.$message.warning(`当前最多选择 ${this.limit} 个文件`);
    },
    //上传文件大小和格式校验
    beforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isFile =
        fileType === "txt" ||
        fileType === "doc" ||
        fileType === "docx" ||
        fileType === "xls" ||
        fileType === "xlsx" ||
        fileType === "ppt" ||
        fileType === "pptx" ||
        /* fileType === "jpg" ||
        fileType === "png" || */
        fileType === "pdf";
      if (!isFile) {
        this.$message.error("请选择正确的文件格式");
        return false;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传图片大小不能超过 50MB!");
      }
      return isLt50M && isFile;
    },
    // 文件下载
    handlePreview(file) {
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = file.name;
      a.href = "http://" + file.url;
      a.dispatchEvent(event);
    },
    /* handleOnSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.fileList.push({
          name: file.name,
          url: response.data.url,
          fileId: response.data.fileId,
          uid: file.uid
        });
      } else if (response.code === 1) {
        this.$message({
          showClose: true,
          message: `上传${file.name}文件服务器返回code为1`,
          type: "error"
        });
      }

      this.$emit("input", this.fileList);
      this.$emit("onSuccess", response, file, fileList);
    },
    beforeUpload(file) {
      this.$emit("beforeUpload", file);
    },
    handleRemove(file, fileList) {
      this.fileList = [...fileList];
      this.$emit("input", this.fileList);
      this.$emit("onRemove", file, fileList);
    },

    handlePictureCardPreview(file) {} */
  }
};
</script>
