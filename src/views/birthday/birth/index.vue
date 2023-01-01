<template>
  <div class="app-container">
    <div class="dataWrap">
        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['birthday:birth:export']"
            >导出</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-select v-model="selectPeople" placeholder="请选择人员" clearable size="small" >
              <el-option
                v-for="dict in givelikeList"
                :key="dict.userId"
                :label="dict.userName"
                :value="dict.sessionId"
              />
            </el-select>
          </el-col>

          <el-col :span="1.5">
            <span>允许调接口点赞</span>
            <el-switch
              label="允许点赞"
              v-model="isNeedGive"
              active-value="1"
              inactive-value="0"
            />
            <span v-show="false">{{changeParam}}</span>
          </el-col>

        </el-row>
      <table-list
        :tableData="newContractList"
        :headerData="newContractHeader"
        :pageNum="queryParams.pageNum"
        :pageSize="queryParams.pageSize"
        :cellStyle="cellStyle"
        @cellClick="cellClick"
        @ClickRow="handleSelectionChange"
      />
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="nameTitle" :visible.sync="imageDialog" width="20%" height="30%">
      <el-form ref="basicInfoForm" :model="basicInfo"  label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-image
              style="width: 200px; height: 200px"
              :src="dialogImageUrl"
              :preview-src-list="[dialogImageUrl]"
            />
          </el-col>
        </el-row>

      </el-form>



    </el-dialog>



  </div>
</template>

<script>
import { listBirth, exportBirth } from "@/api/birthday/birth";
import { listGivelike} from "@/api/person/givelike";
export default {
  name: "newContract",
  data() {
    return {
      isNeedGive:'0',
      basicInfo:{},
      edu:[],//教育
      edu2:[],//教育
      nameTitle:'',
      dialogImageUrl:'',
      imageDialog:false,
      isEdit: false,
      isDel: false,
      isDetail: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: {},
      selection:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      selectPeople: '',
      givelikeList:[],
      // 供应商合同表格数据
      newContractList: [],
      //供应商合同表格 表头
      newContractHeader: [
        {
          width:'90',
          prop: 'birUserId',
          tableType: 'birUserId',
          label: '人员id',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'120',
          prop: 'birName',
          tableType: 'birName',
          label: '姓名',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'100',
          prop: 'birMonth',
          tableType: 'birMonth',
          label: '月',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'100',
          prop: 'birDay',
          tableType: 'birDay',
          label: '月-天',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'deptName',
          tableType: 'deptName',
          label: '机构名称',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },

        {
          prop: 'avatar',
          tableType: 'avatar',
          label: '点赞',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'birth',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'flag',
          tableType: 'flag',
          label: '特殊',
          align: 'center',
          optionsname: 'genderTypeOptions',
          attrs: {
            "show-overflow-tooltip": true,
            formatter: this.genderTypeFormat
          },
          filltype: 'select',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },

      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 合同类别字典
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      genderTypeOptions:[]
    };
  },
  created() {
    this.getList();
    this.queryGiveLike();
    this.getGenderTypeDicts('is_punch', 'genderTypeOptions');
  },
  computed:{
    changeParam(){
      //传递给 xin.vue组件
      console.log('changeParam',new Date().getTime())
      this.$bus.$emit('transmit',this.selectPeople,this.isNeedGive);
      return this.selectPeople+"_"+this.isNeedGive;
    }
  },
  methods: {
    /*changePeople(str){
      if(str){
        //传递给 xin.vue组件
          this.$bus.$emit('transmit',str,this.isNeedGive);
      }
    },*/
    getGenderTypeDicts (type, attrs) {
      return this.getDicts(type).then(res => {
        if (res.code === 200) {
          this[attrs] = res.data.map(item => ({
            dictLabel: item.dictLabel,
            dictValue: item.dictValue
          }))
          let _data=[];
          res.data.forEach(item =>{
            item.dictValue=item.dictLabel;
            _data.push(item);
          })
          this.$store.dispatch('dict/changeDictData', {
            dictname: attrs,
            options: _data
          })
        }
      })
    },
    queryGiveLike(){
      let queryParams={
        pageSize:1000,
        pageNum: 1
      };
      listGivelike(queryParams).then(response => {
        this.givelikeList = response.rows;
      });
    },
    createLoves(){
      this.$refs.background.createLoves(event)
    },
    removeSmallHert(){
      this.$refs.background.removeSmallHert()
    },
    startDateFormat(row, column) {
      return this.parseTime(row.startDate,'{y}-{m}-{d}')
    },
    endDateFormat(row, column) {
      return this.parseTime(row.endDate,'{y}-{m}-{d}')
    },
    cellStyle(object){
      //指定那一列，显示样式
      if(object.columnIndex==2){
        if(!object.row.avatar) return 'default-color';
        return 'change-version-record'; // kylin.css样式
      }
    },
    cellClick(row, column, cell, event){
      let prop=column.property;
      if(prop=="birName" && row.avatar){
        this.nameTitle=row.birName
        this.imageDialog=true;
        this.showPhoto(row);
      }
    },
    async showPhoto(row){
      if(row.avatar){
        this.dialogImageUrl = row.avatar;
      }else{
        this.dialogImageUrl ="";
      }

    },
    genderTypeFormat(row, column) {
      return this.selectDictLabel(this.genderTypeOptions, row.flag);
    },
    /** 查询供应商合同列表 */
    getList() {
      this.loading = true;
      listBirth(this.queryParams).then(response => {
        this.newContractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery(data) {
      Object.assign(this.queryParams, data)
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery(data) {
      Object.assign(this.queryParams, data)
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {

      this.selection=selection;
      this.ids = selection.empid
      this.single = false
      this.multiple = false
      this.isDetail = true

      this.isEdit = true
      this.isDel = true


    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有点赞人员数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportBirth(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    }

  }
};
</script>
