<template>
  <div>
    <div class="fileList">
      <ul class="listWrap">
        <li class="fileItem" v-for="item in previewFileList" :key="item.fileId">
          <div class="preViewLeft">
            <span class="iconWrap"><i class="el-icon-document"></i></span>
            <span class="fileTitle">{{item.fileActualName}}</span>
          </div>
          <div class="preViewRight">
            <span @click="previewFile(item)">预览</span>
            <span v-if="onDownload" @click="handlePreview(item)">下载</span>
            <span v-if="!!onDeletefile" @click="handleRemove(item)">删除</span>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="previewDialog" width="1200px"
      :before-close="closePreview"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <span slot="title"><i class="el-icon-folder-opened"></i><span>文件浏览</span></span>
      <TxtView v-if="previewType === 'SIMTEXT' && officePreviewType === 'pdf'" :suffix="suffixer" :textContent="txtContent" :fileName="fileItem.fileActualName" />
      <PdfView v-if="(previewType === 'OFFICE' || previewType === 'PDF') && officePreviewType === 'pdf'" :pdfSrc="frameSrc" />
      <Picture v-if="previewType === 'PICTURE'" :imgSrc="frameSrc" @clickModal="closePreview" />
      <XlxsView v-if="previewType === 'OFFICE' && officePreviewType === 'html'" :xlxsSrc="frameSrc" />
    </el-dialog>
  </div>
</template>

<script>
import Picture from './components/picture'
import PdfView from './components/pdfView'
import XlxsView from './components/xlxsView'
import TxtView from './components/txtView'
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export default {
  name: "FilePreview",
  components: { Picture, PdfView, XlxsView, TxtView },
  props: {
    previewFileList: {
      type: Array,
      default() {
        return [];
      },
    },
    onDeletefile: {
      type: Function
    },
    onDownload: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      files: [],
      txtContent: '',
      frameSrc: '', // 预览链接
      myHeaders: {
        Authorization: getToken(),
      },
      previewType: "",
      officePreviewType: '',
      fileItem: {},
      suffixer: '',
      previewDialog: false
    };
  },
  methods: {
    /** 附件类 */
    // 文件移除操作
    handleRemove(file) {
      let delhistory = [];
      file.operationType = 3;
      delhistory.push(file); // 记录删除文件的历史记录
      this.previewFileList.forEach((element, index, arr) => {
        if (file.fileId === element.fileId) {
          arr.splice(index, 1)
        }
      });
      this.$emit("updateDelhistory", delhistory);
      // this.$emit("update:previewFileList", this.files);
      this.onDeletefile(this.previewFileList)
      this.$emit("onChange", this.files);
    },
    // 文件下载
    handlePreview(file) {
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = file.name;
      a.href = process.env.VUE_APP_BASE_API+"/common/download?docId="+ file.fileId;
      a.dispatchEvent(event);
    },
    // 文件预览
    previewFile (file) {
      const docId = file.fileId
      this.fileItem = file
      request({
        url: `/common/filePreview/${file.fileId}`,
        method: 'GET'
      }).then(res => {
        if (res.code === 200) {
          // const encodeUrl = encodeURI('http://82.156.182.178:18188' + res.data.url)
          const encodeUrl = encodeURI(process.env.VUE_APP_BASE_API + res.data.url)
          this.frameSrc = encodeUrl
          this.previewType = res.data.type
          this.suffixer = res.data.suffix
          this.officePreviewType = res.data.officePreviewType
          res.data.type === 'SIMTEXT' && (this.txtContent = res.data.textData)
          this.previewDialog = true
        }
      })
    },
    // 关闭预览
    closePreview () {
      this.previewDialog = false
      this.frameSrc = ''
      this.previewType = ''
      this.officePreviewType = ''
      this.fileItem = {}
      this.suffixer = ''
    }
  },
  filter: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
  .fileList { padding: 10px 20px;
    .listWrap { margin: 0; padding: 0;
      .fileItem { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px;
        &:last-child { padding: 0; }
        .preViewLeft {
          span { vertical-align: middle; font-size: 14px; line-height: 22px; color: #666; }
        }
        .preViewRight {
          span { display: inline-block; vertical-align: middle; padding: 0 20px; font-size: 12px; font-family: sans-serif; line-height: 22px; border-radius: 4px; color: #fff; cursor: pointer; background: #2A435B;}
        }
      }
    }
  }
  ::v-deep .el-dialog__body { height: 566px; overflow-y: auto;}
  ::v-deep .el-dialog__header { border-bottom: 1px solid #e6e6e6;}
</style>
