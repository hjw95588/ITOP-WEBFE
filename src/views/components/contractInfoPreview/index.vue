<template>
  <div>
    <el-dialog
      title="合同浏览"
      :visible.sync="contrPreviewVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :before-close="handleClose"
      width="70%"
    >
      <el-card>
        <div slot="header"><span>外包合同</span></div>
        <div>
          <el-form label-width="180px" :form="contractInfo" disabled>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="oursourcingCntStartDate" :rules="[{ required: true, trigger: 'blur' }]">
                  <el-date-picker
                    type="date"
                    v-model="contractInfo.oursourcingCntStartDate"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="oursourcingCntEndDate" :rules="[{ required: true, trigger: 'blur' }]">
                  <el-date-picker
                    type="date"
                    v-model="contractInfo.oursourcingCntEndDate"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效期限(月)" prop="oursourcingCntEffectiveTime">
                  <el-input
                    v-model="contractInfo.oursourcingCntEffectiveTime"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同联系人" prop="oursourcingCntPrjContactName" :rules="[{ required: true, trigger: 'blur' }]">
                  <el-input
                    v-model="contractInfo.oursourcingCntPrjContactName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同名称" prop="oursourcingCntName" :rules="[{ required: true, trigger: 'blur' }]">
                  <el-input
                    v-model="contractInfo.oursourcingCntName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="12">
              <el-form-item label="外包合同文件" prop="docList" :rules="[{ required: true, trigger: 'blur' }]">
                <Upload :propFileList.sync="contractInfo.docList" :repositoryId="74" :fileTypeArr="['doc','docx', 'xls', 'xlsx','ppt','pptx', 'pdf']"></Upload>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from "@/components/upload/index.vue";
export default {
  name: 'ContractInfoPreview',
  components: { Upload },
  props: {
    contrPreviewVisible: {
      type: Boolean,
      default: false
    },
    contractInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 点击关闭
    handleClose () {
      this.$emit("update:contrPreviewVisible", false);
    }
  }
}
</script>

<style>

</style>