<template>
  <div class="app-container">

    <div class="dataWrap">
      <el-row :gutter="10" class="mb8">

        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :disabled="!isDetail"
            @click="handleDetail"
            v-hasPermi="['supplier:newcontract:query']"
          >浏览</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['supplier:newcontract:export']"
          >导出</el-button>
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

    <el-dialog :title="nameTitle" :loading="showLoading" :visible.sync="imageDialog" width="60%" height="30%">
      <el-form ref="basicInfoForm" :model="basicInfo"  label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期" >
              <el-input v-model="basicInfo.birthDate" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用工类型" >
              <el-input v-model="basicInfo.employType" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-image
              style="width: 200px; height: 200px"
              :src="dialogImageUrl"
              :preview-src-list="[dialogImageUrl]"
            />
            <el-form-item label="团队" >
              <div v-if="basicInfo.teamAffiliated">
                {{basicInfo.firtorgname}} / {{basicInfo.teamAffiliated}} 年龄: {{showAge(basicInfo.birthDate)}}
              </div>
              <div v-else>
                {{basicInfo.firtorgname}}  年龄:{{showAge(basicInfo.birthDate)}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首次工作/入职时间" >
              <el-input v-text="workDate(basicInfo)" readonly/>
            </el-form-item>
            <el-form-item label="职级" >
              <el-input v-model="basicInfo.cascadingJobGrade" readonly/>
            </el-form-item>

            <el-form-item label="最高学历" >
              <el-input v-model="basicInfo.lastEduDegree" readonly/>
            </el-form-item>

            <el-form-item label="邮箱" >
              <el-input v-model="email" readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-card v-if="basicInfo.updateGrade">
          <div slot="header">
            <span>职称升级记录</span>
          </div>
          <div class="contractWrap">
            <el-table style="width: 100%" :data="basicInfo.updateGrade" border>
              <el-table-column label="年份" prop="year"  />
              <el-table-column label="变化" prop="rank"  />
            </el-table>
          </div>
        </el-card>

        <el-card>
          <div slot="header">
            <span>教育经历</span>
          </div>
          <div class="contractWrap">
            <el-table style="width: 100%" :data="edu" border>
              <el-table-column label="学校名称" prop="schoolName"  />
              <el-table-column label="专业" prop="major"  />
              <el-table-column label="学历性质" prop="eduBackgroundTxt"  />

              <el-table-column label="学历" prop="eduLevelTxt"  />
              <el-table-column label="学位" prop="degreeTxt"  />
              <el-table-column label="在校是否获得嘉奖" prop="awards"  />

              <el-table-column label="是否留学生" prop="EXT_COL_938"  />
              <el-table-column label="是否985,211" prop="EXT_COL_939"  />

              <el-table-column label="开始时间" prop="startDate" :formatter="startDateFormat" />
              <el-table-column label="结束时间" prop="endDate" :formatter="endDateFormat" />
            </el-table>
          </div>
        </el-card>

      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import { listEmpInfo, delEmpInfo, exportEmpInfo,downImageFile,getEmpInfo } from "@/api/sysEmpInfo/empInfo";
export default {
  name: "newContract",
  data() {
    return {
      email:"",
      showLoading:true,
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
      // 供应商合同表格数据
      newContractList: [],
      //供应商合同表格 表头
      newContractHeader: [
        {
          width:'80',
          prop: 'empid',
          label: 'empid',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'empid',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'90',
          prop: 'workno',
          label: '工号',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'workno',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'80',
          prop: 'empName',
          label: '姓名',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'empName',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'80',
          prop: 'gender',
          label: '性别',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'select',
          tableType: 'gender',
          optionsname: 'genderTypeOptions',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'firtorgname',
          label: '部门名称',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'firtorgname',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:"150",
          prop: 'teamAffiliated',
          label: '团队名称',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'teamAffiliated',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'employType',
          label: '用工类型',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'employType',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'firstWorkDate',
          label: '首次参工时间',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'firstWorkDate',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'hireDate',
          label: '入职日期',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'hireDate',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'terminationDate',
          label: '离职日期',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'terminationDate',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'150',
          prop: 'mobile',
          label: '手机',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'mobile',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'ext_COL_974',
          label: '在职状态',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'EXT_COL_974',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },

        {
          prop: 'cascadingJobGrade',
          label: '职级',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'cascadingJobGrade',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'birthDate',
          label: '出生日期',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'birthDate',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },

        {
          prop: 'lastEduDegree',
          label: '最高学历',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'lastEduDegree',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          width:'80',
          prop: 'marriage',
          label: '婚姻',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'marriage',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'fertilityStatus',
          label: '生育',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'fertilityStatus',
          listeners: {
            onSearchFun: this.handleQuery,
            onResetFun: this.resetQuery
          }
        },
        {
          prop: 'isUpgrade',
          label: '升迁过',
          align: 'center',
          attrs: {
            "show-overflow-tooltip": true
          },
          filltype: 'input',
          tableType: 'isUpgrade',
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
    this.getGenderTypeDicts("sys_user_sex", 'genderTypeOptions');
    this.getList();
  },
  methods: {
    workDate(basicInfo){
      return basicInfo.firstWorkDate +"   /   "+ basicInfo.hireDate
    },
    startDateFormat(row, column) {
      return this.parseTime(row.startDate,'{y}-{m}-{d}')
    },
    endDateFormat(row, column) {
      return this.parseTime(row.endDate,'{y}-{m}-{d}')
    },
    showAge(birthDate){
      if(!birthDate) return;
      let birthdays = new Date(birthDate.replace(/-/g, "/"));
      let d = new Date();
      let age = d.getFullYear() - birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() || (d.getMonth() == birthdays.getMonth() && d.getDate()
          < birthdays.getDate()) ? 1 : 0);
      return age;
    },
    cellStyle(row){
      //指定那一列，显示样式
      if(row.columnIndex==3){
        return 'change-version-record'; // kylin.css样式
      }
    },
    cellClick(row, column, cell, event){
      let prop=column.property;
      if(prop=="empName"){
        //this.basicInfo= {};//清空
        this.saveLoading = true
        console.log(row.photoUrl)
        this.nameTitle=row.empName
        this.imageDialog=true;
        this.showPhoto(row);
        this.getDetail(row);
        //this.saveLoading = false
      }
    },
    /** 查看详情 */
     getDetail(row) {
      getEmpInfo(row.empid).then(res => {
        if (res.code == 200) {
          this.basicInfo = res.data;//赋值
          this.showEdu();
          this.showEmail();
        }
      })
    },
    showEmail(){
       let _data=JSON.parse(this.basicInfo.other1).data;
       let _list=[];
       if(_data.baseinfo.email){
         _list.push(_data.baseinfo.email);
       }
      if(_data.employinfo.corpEmail){
        _list.push(_data.employinfo.corpEmail);
      }
       this.email = _list.join(" / ");
    },
    showEdu(){
      this.edu=[];
      this.edu2=[];
      this.edu=JSON.parse(this.basicInfo.other1).data.edu
      let arrayData=JSON.parse(this.basicInfo.other2).data;
      this.fillData(this.filterEntity(arrayData,"edu"),this.edu2);
      this.assignEdu(this.edu,this.edu2)
    },
    assignEdu(edu1,edu2){
      edu2.sort((a,b)=>{
        return parseInt(b.startDate .replaceAll("-",""))-parseInt(a.startDate .replaceAll("-",""));
      })
      //合并
      let list=[];
      for(let i = 0; i <edu1.length; i++){
        //如果存在相同的属性，以后面edu1的属性值 对应的结果 为主
        list.push(Object.assign(edu2[i],edu1[i]))
      }
      if(this.edu.length>0){
        this.edu.splice(0);
        list.forEach(item=>{
          this.edu.push(item);
        })
      }
    },
    fillData(arrayData,array){
      arrayData.forEach(item=>{
        let obj={};
        if(item.length>0){
          item.forEach(it=>{
            if(it.fieldText){
              obj[it.fieldCode]=it.fieldText;
            }
          })
          array.push(obj);
        }
      })
    },
    filterEntity(arrayData,code){
      let obj=arrayData.filter(item=>{
        return item.code==code;
      })
      if(obj.length>0 && obj[0].data){
        return obj[0].data;
      }
      return [];
    },
    async showPhoto(row){
      if(row.photoUrl){
        let queryParam={
          photoUrl:row.photoUrl,
          empid:row.empid,
          workno:row.workno,
          empName:row.empName,
        }
        let res = await downImageFile(queryParam);
        let blob = new Blob([res], {type: 'image/jpeg'});
        const imageUrl = URL.createObjectURL(blob);
        this.dialogImageUrl = imageUrl;
      }

    },
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
    /** 查询供应商合同列表 */
    getList() {
      this.loading = true;
      listEmpInfo(this.queryParams).then(response => {
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
    handleDetail(){
      const id = this.ids
      this.$router.push({
        name: 'empInfoDetail',
        params:{
          id:id,
          type: 'detail',
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.ids;
      this.$confirm('是否确认删除', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delEmpInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
        this.isEdit = false;
        this.isDetail = false;
        this.isDel = false
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有人力信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportEmpInfo(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    }

  }
};
</script>
