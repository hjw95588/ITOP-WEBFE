<template>
  <div>
    <el-upload
      class="upload-demo"
      action="/common/uploads"
      :headers="myHeaders"
      :http-request="myUpload"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :show-file-list="true"
      :limit="limit"
      :file-list="files"
    >
      <el-button type="primary" size="mini"
        >上传<i class="el-icon-upload el-icon--right"></i
      ></el-button>
      <span slot="tip" class="el-upload__tip">
        只能上传doc、docx、xls、xlsx、ppt、pptx、pdf文件，且不超过50MB
      </span>
    </el-upload>
    <!-- <filePreview
      :previewFileList.sync="propFileList"
      :on-deletefile="delFile"
      :on-download="true"
    /> -->
  </div>
</template>

<script>
// import FilePreview from '@/views/components/filePreview'
import { isFunction, isUndefined } from "@/utils/types";
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export default {
  name: "Upload",
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
  },
  data() {
    return {
      files: [],
      successData: {
        name: '',
        date: ''
      },
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
    console.log(this.$parent)
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
          this.successData.date = file.createTime
          this.successData.name = file.fileVirtualName
          this.files.push(file);
          this.$emit("update:propFileList", this.files);
          // this.$emit("onChange", this.files);
          this.isRequired && !isUndefined(this.$parent.onFieldChange) && isFunction(this.$parent.onFieldChange) && this.$parent.onFieldChange()

        } else {
          // this.$message.error(res.msg);
        }
      });
    },
    // 超出限制提示
    handleExceed(files, fileList) {
      console.log('超出数量限制',this.limit)
      this.$message.warning(`当前最多选择 ${this.limit} 个文件`);
    },

    //上传文件大小和格式校验
    beforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传图片大小不能超过 50MB!");
      }
      // return isLt50M && isFile;
      return isLt50M
    },
    // 删除文件
    handleRemove (file, fileList) {
      this.$emit("update:propFileList", fileList);
    }
  },
  filter: {},
  computed: {},
  watch: {
    propFileList: {
      handler(newlist, oldList) {
        this.files = newlist.map(item =>({
          ...item,
          name: item.fileActualName,
          fileid: item.fileId
        }));
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .shadow { position: fixed; top: 0; right: 0; bottom: 0; left: 0; padding: 85px 20px 20px; text-align: center; background: rgba($color: #000000, $alpha: 0.6); z-index: 1003;
    .closeBtn { position: absolute; top: 50px; right: 50px; z-index: 999; width: 40px; height: 40px; background: rgba(249, 251, 252, 0.925); border-radius: 50%;
      &:hover { background: rgba(238, 238, 250 ,1) }
      .el-icon-close { font-size: 40px; line-height: 1;}
    }
    #iframePreview { width: 80%; height: 100%; background: #fff; }
    .imgPreviewWrap { width: 80%; height: 100%; overflow: auto; margin: 0 auto; text-align: center;
      .imgPreView { width: auto; height: auto; max-width: 100%; }
    }
  }
</style>
