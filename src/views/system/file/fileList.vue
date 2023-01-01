<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-left: 0;">
      <el-col :span="5" class="leftWrap">
          <!-- @input="searchDept" -->
        <el-input
          v-model.trim="searchDeptValue"
          placeholder="请输入搜索目录"
          prefix-icon="el-icon-search"
          size="small"
          style="margin: 12px 0;"
          class="searchInput"
        ></el-input>
        <el-tree
          lazy
          :props="defalutProps"
          :load="loadDocReposiNode"
          :highlight-current="true"
          class="reposiTree"
          accordion
          @node-click="treeNodeClick"
        >
          <span :class="['dataItem', node.expanded ? 'expended' : '']" slot-scope="{ node }">
            <span><i class="el-icon-folder iconClass"></i>{{ node.label }}</span>
            <span v-if="!node.isLeaf" class="el-icon-arrow-right"></span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="19">
        <el-form :model="queryParams" :rules="fileQueryRules" ref="fileQureyParms" :class="['queryParent', controlFileQuery?'evenItmes':'']" label-width="80px" v-show="showSearch">
          <el-form-item label="文件名称" prop="fileActualName" class="el-item-two">
            <el-input
              v-model.trim="queryParams.fileActualName"
              placeholder="请输入文件名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="文件编号" prop="fileId" class="el-item-two">
            <el-input
              v-model.trim="queryParams.fileId"
              placeholder="请输入文件编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="文件格式" prop="fileSuffix" class="el-item-two" v-show="controlFileQuery">
            <el-select
              v-model="queryParams.fileSuffix"
              placeholder="文件格式"
              clearable
              allow-create
              filterable
            >
              <el-option
                v-for="format in formatOptions"
                :key="format.formatValue"
                :label="format.formatLabel"
                :value="format.formatValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件大小" v-show="controlFileQuery" class="el-item-two">
            <el-col :span="11" class="colSpan">
              <el-form-item prop="fileSizeMin" class="fileSizeItem">
                <el-input
                  placeholder="最小数值"
                  v-model="queryParams.fileSizeMin"
                  clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11" class="colSpan">
              <el-form-item prop="fileSizeMax" class="fileSizeItem">
                <el-input
                  placeholder="最大数值"
                  v-model="queryParams.fileSizeMax"
                  clearable>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="上传时间" prop="fileUploadRange" v-show="controlFileQuery" class="el-item-two">
            <el-date-picker
              v-model="queryParams.fileUploadRange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="上传者" prop="uerName" v-show="controlFileQuery" class="el-item-two">
            <el-input
              v-model.trim="queryParams.userName"
              placeholder="请输入上传者"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item class="query-item">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery" size="mini">重置</el-button>
            <el-button type="text" v-stowExpand="['controlFileQuery']"
              >{{controlFileQuery ? '收起' : '展开'}}<i :class="[controlFileQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down', 'el-icon--right']"></i></el-button>
          </el-form-item>
        </el-form>
        <div class="dataWrap">
          <div class="fnButon">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              :disabled="isEmpoty"
              @click="downloadFile"
            >下载</el-button>
              <!-- @click="handleExport" -->
            <table-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" :columns="columns" />
          </div>
          <el-table
            ref="mulitipTable"
            v-loading="loading"
            :data="fileList"
            @select="handleSelection"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="文件名称"
              align="center"
              prop="fileActualName"
              width="180"
              :show-overflow-tooltip="true"
              v-if="columns[0].visible"
            />
            <el-table-column
              label="目录"
              align="center"
              prop="repositoryName"
              width="180"
              :show-overflow-tooltip="true"
              v-if="columns[1].visible"
            />
            <el-table-column
              label="大小"
              align="center"
              prop="fileSize"
              width="180"
              :show-overflow-tooltip="true"
              v-if="columns[2].visible"
            />
            <el-table-column
              label="上传人"
              align="center"
              prop="createBy"
              width="180"
              v-if="columns[3].visible"
            >
            </el-table-column>
            <el-table-column
              label="上传时间"
              align="center"
              prop="createTime"
              v-if="columns[4].visible"
            />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
              v-if="columns[5].visible"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-download"
                  @click="handlePreview(scope.row)"
                  >下载</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="previewFile(scope.row)"
                  >浏览</el-button>
                <!-- <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-s-operation"
                >更多</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
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
import Picture from '@/views/components/filePreview/components/picture'
import PdfView from '@/views/components/filePreview/components/pdfView'
import XlxsView from '@/views/components/filePreview/components/xlxsView'
import TxtView from '@/views/components/filePreview/components/txtView'
import { getDocReposiParent, getDocReposiChild, getDocReposiList, previewFile } from '@/api/system/file'
export default {
  name: 'FileList',
  components: { Picture, PdfView, XlxsView, TxtView },
  data () {
    const validateIsNum = (rule, value, cb) => {
      const valdateReg =  /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/
      if (!valdateReg.test(value)) {
        cb(new Error(rule.message))
      }
      cb();
    }
    const validateIsThanZero = (rule, value, cb) => {
      if (value < 0) {
        cb(new Error(rule.message))
      }
      cb()
    }
    const validateMinMax = (rule, value, cb, minNum) => {
      if (minNum && minNum !== 0) {
        const difference = value - minNum
        if (difference < 0) {
          cb(new Error(rule.message))
        }
      }
      cb()
    }
    return {
      fileType: '1', // 文件类型
      searchDeptValue: "", // 查询文件目录
      catalogueData: [],
      defalutProps: {
        children: 'zones',
        label: 'itemName',
        isLeaf: 'leaf'
      },
      loading: false, // 加载状态
      isExpended: false, // 控制第一级是否展开
      repositoryCode: '', // 父级目录id
      fileRepositoryId: '', // 子目录id
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileActualName: '',
        fileVirtualName: '',
        fileSuffix: '',
        fileId: '',
        fileSizeMin: '', // 文件最小值
        fileSizeMax: '', // 文件最大值
        userName: '',
        fileUploadRange: [],
        fileRepositoryId: '',
        repositoryCode: ''
      },
      fileQueryRules: {
        fileSizeMin: [
          { validator: (rule, value, cb) => validateIsNum(rule, value, cb), message: '请输入数字', trigger: 'blur' },
          { validator: (rule, value, cb) => validateIsThanZero(rule, value, cb), message: '数值需大于0', trigger: 'blur' }
        ],
        fileSizeMax: [
          { validator: (rule, value, cb) => validateIsNum(rule, value, cb), message: '请输入数字', trigger: 'blur' },
          { validator: (rule, value, cb) => validateIsThanZero(rule, value, cb), message: '数值需大于0', trigger: 'blur' },
          { validator: (rule, value, cb) => validateMinMax(rule, value, cb, this.queryParams.fileSizeMin), message: '最大值不能小于最小值', trigger: 'blur' },
        ]
      },
      showSearch: true, // 控制搜索现实与否
      controlFileQuery: false, // 控制部分搜索框
      // 文件格式字典
      formatOptions: [{
        formatValue: 'jpg',
        formatLabel: 'JPG'
      }, {
        formatValue: 'png',
        formatLabel: 'PNG'
      }, {
        formatValue: 'html',
        formatLabel: 'HTML'
      }, {
        formatValue: 'xlsx',
        formatLabel: 'XLSX'
      }, {
        formatValue: 'txt',
        formatLabel: 'TXT'
      }, {
        formatValue: 'pdf',
        formatLabel: 'PDF'
      }],
      // 列信息
      columns: [
        { key: 0, label: `文件名称`, visible: true },
        { key: 1, label: `文件编号`, visible: true },
        { key: 2, label: `文件格式`, visible: true },
        { key: 3, label: `文件大小`, visible: true },
        { key: 4, label: `上传者`, visible: true },
        { key: 5, label: `上传时间`, visible: true }
      ],
      // 文件列表
      fileList: [],
      total: 0, // 文件总数
      previewDialog: false, // 预览弹窗
      fileItem: {},
      previewType: "",
      checkTableRow: {} // 选中的表格
    }
  },
  computed: {
    isEmpoty () {
      return Object.keys(this.checkTableRow).length === 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 初始化一级子节点
    loadDocReposiNode (node, resolve) {
      // level为0
      if (node.level === 0) {
        this.getParentNode(resolve)
      }
      if (node.level > 0) {
        this.getChildNode(node, resolve)
      }
    },
    // 获取一级父节点
    getParentNode (resolve) {
      getDocReposiParent().then(res => {
        if (res.code === 200) {
          const parentList = res.rows.map(item => ({
            itemName: item.repositoryName,
            code: item.repositoryCode,
            leaf: false
          }))
          return resolve(parentList)
        }
      })
    },
    // 获取子节点
    getChildNode (node, resolve) {
      getDocReposiChild({ repositoryCode: node.data.code }).then(res => {
        if (res.code === 200) {
          const childList = res.rows.map(item => ({
            itemName: item.fileTypeName,
            code: item.repositoryId,
            leaf: true
          }))
          return resolve(childList)
        }
      })
    },
    treeNodeClick (node) {
      if (node.leaf) {
        this.queryParams.fileRepositoryId = node.code
        this.queryParams.repositoryCode = ''
      } else {
        this.queryParams.fileRepositoryId = ''
        this.queryParams.repositoryCode = node.code
      }
        // return
      this.getList()
    },
    // 获取列表数据
    getList () {
      this.loading = true
      const {
        pageNum,
        pageSize,
        fileActualName,
        fileVirtualName,
        fileSuffix,
        fileId,
        fileSizeMin, // 文件最小值
        fileSizeMax, // 文件最大值
        userName,
        fileRepositoryId,
        repositoryCode
      } = this.queryParams
      const beginTime = this.queryParams.fileUploadRange[0]
      const endTime = this.queryParams.fileUploadRange[1]
      const data = {
        pageNum,
        pageSize,
        fileActualName,
        fileVirtualName,
        fileSuffix,
        fileId,
        fileSizeMin, // 文件最小值
        fileSizeMax, // 文件最大值
        userName,
        fileRepositoryId,
        repositoryCode,
        beginTime,
        endTime
      }
      getDocReposiList(data).then(res => {
        if (res.code === 200) {
          this.fileList = res.rows
          this.total = res.total
          this.loading = false
        }
      })
    },
    /** 重置筛选按钮操作 */
    resetQuery() {
      this.resetForm("fileQureyParms");
      this.handleQuery();
    },
    // 搜索按钮操作
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 表格选择
    handleSelection (selection, row) {
      this.$refs.mulitipTable.clearSelection()
      if (selection.length === 0) {
        this.checkTableRow = {}
      } else {
        this.$refs.mulitipTable.toggleRowSelection(row, true)
        this.checkTableRow = row
      }
    },
    // 表格顶部下载文件
    downloadFile () {
      this.handlePreview(this.checkTableRow)
    },
    // 文件下载
    handlePreview(file) {
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = file.name;
      a.href = process.env.VUE_APP_BASE_API+"/common/download?docId="+ file.fileId;
      a.dispatchEvent(event);
      a.remove()
    },
    // 文件预览
    previewFile (file) {
      const docId = file.fileId
      this.fileItem = file
      previewFile(docId).then(res => {
        if (res.code === 200) {
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
  }
}
</script>

<style lang="scss" scoped>
  .leftWrap { padding-top: 5px; padding-bottom: 10px; background: #fff; text-align: center;
    .searchInput { margin: 0 0 12px 0 !important;}
    .reposiTree { max-height: 700px; overflow-y: auto; }
    .dataItem { display: flex; justify-content: space-between; align-items: center; width: 100%; font-size: 12px; line-height: 26px;
      .iconClass { margin-right: 5px;}
      .el-icon-arrow-right { transition: transform .3s ease-in-out; }
      &.expended {
        color: #1890ff;
        .el-icon-arrow-right { transform: rotate(90deg)}
      }
    }
  }
  .colSpan { padding: 0 !important;
    .fileSizeItem { width: 100%; }
  }
  .radioWrap { width: 100%; padding: 5px; background: #fff; display: block; margin-bottom: 10px;}
  ::v-deep .el-radio-button__inner { width: 100%; font-size: 14px !important; line-height: 22px !important; }
  ::v-deep .el-tree-node__expand-icon { display: none; }
  ::v-deep .el-dialog__body { height: 566px; overflow-y: auto;}
  ::v-deep .el-dialog__header { border-bottom: 1px solid #e6e6e6;}
</style>