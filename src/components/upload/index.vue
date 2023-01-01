<template>
  <div>
    <el-upload
      class="upload-demo"
      action="/common/uploads"
      :headers="myHeaders"
      :http-request="myUpload"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :limit="limit"
      :file-list="files"
      :disabled='disableUpload'
    >
      <el-button type="primary" size="mini" :disabled='disableUpload'
        >上传<i class="el-icon-upload el-icon--right"></i
      ></el-button>
      <span slot="tip" class="el-upload__tip">
        只能上传{{ fileTypeString }}文件，且不超过50MB
      </span>
    </el-upload>
  </div>
</template>

<script>
import { isFunction, isUndefined } from "@/utils/types"
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
import { debug } from 'util';
export default {
  name: "Upload",
  components: {},
  props: {
    propFileList: {
      type: Array,
      default() {
        return [];
      },
    },
    repositoryId: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10,
    },
    disableUpload: {
      type: Boolean,
      default: false
    },
    fileTypeArr: {
      type: Array,
      default () {
        const filetype = ['txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'png', 'pdf','wps']
        return filetype
      }
    }
  },
  data() {
    return {
      files: [],
      myHeaders: {
        Authorization: getToken(),
      },
      isRequired: false
    };
  },
  mounted () {
    const parentElClass = this.$parent.$el.classList.value
    if (parentElClass.includes('el-form-item') && parentElClass.includes('is-required')) {
      this.isRequired = true
    } else {
      this.isRequired = false
    }
  },
  methods: {
    /** 附件类 */

    // 文件上传接口
    myUpload(content) {
      let imgfile = new FormData();
      imgfile.append("files", content.file);
      request({
        url: `${content.action}?repositoryId=${this.repositoryId}`,
        method: "POST",
        data: imgfile,
      }).then((res) => {
        if (res.code === 200) {
          let documents = [];
          let obj = {};
          let file = res.file[0];
          this.files.push(file);
          this.$emit("update:propFileList", this.files);
          this.$emit("onChange", this.files);
          this.isRequired && !isUndefined(this.$parent.onFieldChange) && isFunction(this.$parent.onFieldChange) && this.$parent.onFieldChange()
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
      this.$emit("updateDelhistory", delhistory);
      this.$emit("update:propFileList", fileList);
      this.$emit("onChange", this.files);
    },

    // 文件上传成功
    handleSuccess(fn, file, fileList) {
    },

    // 文件上传失败
    handleError(fn, file, fileList) {},

    // 超出限制提示
    handleExceed(files, fileList) {
      // console.log('超出数量限制',this.limit)
      this.$message.warning(`当前最多选择 ${this.limit} 个文件`);
    },

    //上传文件大小和格式校验
    beforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isFile = this.fileTypeArr.includes(fileType)
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
      a.href = process.env.VUE_APP_BASE_API+"/common/download?docId="+ file.fileId;
      a.dispatchEvent(event);
    },
  },
  filter: {},
  computed: {
    fileTypeString () {
      return this.fileTypeArr.join('、')
    }
  },
  watch: {
    propFileList: {
      handler(newlist, oldList) {
        // console.log(newlist)
        this.files = newlist.map(item =>({
          ...item,
          name: item.fileActualName,
          fileid: item.fileId
        }));
        this.isRequired && !isUndefined(this.$parent.onFieldChange) && isFunction(this.$parent.onFieldChange) && this.$parent.onFieldChange()
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-upload-list__item {
    transition: none !important;
  }
  ::v-deep .el-upload-list__item-name {
    transition: none !important;
  }
</style>
