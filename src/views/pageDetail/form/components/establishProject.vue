<template>
  <div class="establish-project">
    <el-card>
      <div slot="header">
        <span>实施立项</span>
      </div>
      <div>
        <el-form :model="form" ref="form" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目预算金额（万元）" prop="name1">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name1"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目费用（万元）" prop="name2">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name2"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目费用占比（%）" prop="name3">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name3"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="内部人工成本（万元）" prop="name4">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name4"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内部人工成本占比（%）" prop="name5">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name5"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in form.list" :key="index">
            <el-col :span="8">
              <el-form-item label="外采1" :prop="`list[${index}]name1`">
                <el-input
                  placeholder="请输入内容"
                  v-model="item.name1"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="金额（万元）" :prop="`list[${index}]name2`">
                <el-input
                  placeholder="请输入内容"
                  v-model="item.name2"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="占比（%）" :prop="`list[${index}]name3`">
                <el-input
                  placeholder="请输入内容"
                  v-model="item.name3"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="外部采购费用-其他（万元）" prop="tableData">
              <el-table
                :data="form.tableData"
                border
                style="width: 100%"
                :header-cell-style="{
                  textAlign: 'center',
                  fontWeight: 'normal',
                  padding: '0'
                }"
              >
                <el-table-column prop="date" label="投入名称">
                </el-table-column>
                <el-table-column prop="name" label="投入金额(万元)">
                </el-table-column>
                <el-table-column prop="address" label="占比（%）">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目预估金额（万元）" prop="name6">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name6"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目毛利润（万元）" prop="name7">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name7"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目毛利率（%）" prop="name8">
                <el-input
                  placeholder="请输入内容"
                  v-model="form.name8"
                  :disabled="disabled"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  name: "EstablishProject",
  props: {
    form: {
      type: Object,
      default: () => ({
        list:[],
        tableData: [],
        name1: "",
        name2: "",
        name3: "",
        name4: "",
        name5: "",
        name6: "",
        name7: "",
        name8: "",
        name9: "",
        name10: "",
        name11: ""
      })
    }
  },
  data() {
    return {
      disabled: true,
    };
  },
  created() {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
