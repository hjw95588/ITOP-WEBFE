<!---表单信息-->
<template>
  <div>
    <el-form
      :model="basicInfo"
      ref="baseForm"
      :disabled="readOnlyState"
      label-width="180px"
    >
      <!---------------------------- 基本信息 start------------------------------------->
      <el-card>
        <div slot="header">
          <span>人员基本信息</span>
        </div>

        <el-row>
          <el-form-item label="照片" prop="photo" >
<!--          <el-dialog
            append-to-body
            class="dialog1"
            width="40%">
            <img :src="dialogImageUrl" alt="" class="ims">
          </el-dialog>-->
            <el-image
              style="width: 200px; height: 200px"
              :src="dialogImageUrl"
              :preview-src-list="[dialogImageUrl]"
            />

          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="empid" >
              <el-input v-model="basicInfo.empid" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" >
              <el-input v-model="basicInfo.workno" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" >
              <el-input v-model="basicInfo.empName" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" >
              <el-input v-model="basicInfo.gender" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" >
              <el-input v-model="basicInfo.firtorgname" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="所属团队" >
              <el-input v-model="basicInfo.teamAffiliated" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用工类型" >
              <el-input v-model="basicInfo.employType" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="首次参工时间" >
              <el-input v-model="basicInfo.firstWorkDate" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职日期" >
              <el-input v-model="basicInfo.hireDate" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" >
              <el-input v-model="basicInfo.mobile" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工资卡账户名" >
              <el-input v-model="basicInfo.ext_COL_994" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="工资卡卡号" >
              <el-input v-model="basicInfo.ext_COL_951" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应届生" >
              <el-input v-model="basicInfo.ext_COL_999" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="在职状态" >
              <el-input v-model="basicInfo.ext_COL_974" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职级" >
              <el-input v-model="basicInfo.cascadingJobGrade" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" >
              <el-input v-model="basicInfo.birthDate" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="民族" >
              <el-input v-model="basicInfo.nation" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" >
              <el-input v-model="basicInfo.idCardNo" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="政治面貌" >
              <el-input v-model="basicInfo.politics" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="入党时间" >
<!--              {{parseTime(basicInfo.ext_COL_998,'{y}-{m}-{d}')}}-->
              <el-input v-text="ruDang()" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="国籍" >
              <el-input v-model="basicInfo.nationality" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="户口所在地" >
              <el-input v-model="basicInfo.hujiAddress" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生地" >
              <el-input v-model="basicInfo.ext_COL_934" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" >
              <el-input v-model="basicInfo.hujiCity" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现居住地" >
              <el-input v-model="basicInfo.nowAddr" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历" >
              <el-input v-model="basicInfo.lastEduDegree" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学位" >
              <el-input v-model="basicInfo.highDegree" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="特长" >
              <el-input v-model="basicInfo.ext_COL_935" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="婚姻" >
              <el-input v-model="basicInfo.marriage" readonly/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="生育状况" >
              <el-input v-model="basicInfo.fertilityStatus" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="离职日期" >
              <el-input v-model="basicInfo.terminationDate" readonly/>
            </el-form-item>

          </el-col>
        </el-row>

      </el-card>
      <!---------------------------- 基本信息 end------------------------------------->
    </el-form>

    <el-card>
      <div slot="header">
        <span>工作经历</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="workexp" border>
          <el-table-column label="公司名称" prop="companyName"  />
          <el-table-column label="部门" prop="department"  />
          <el-table-column label="职位" prop="position"  />
          <el-table-column label="开始时间" prop="startDate" :formatter="startDateFormat" />
          <el-table-column label="结束时间" prop="endDate" :formatter="endDateFormat" />

        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>项目描述</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="projectExp" border>
          <el-table-column label="项目名称" prop="experienceTitle"  />
          <el-table-column label="所属公司" prop="belongToCompany"  />
          <el-table-column label="项目描述" prop="experienceDescription"  />

          <el-table-column label="责任描述" prop="experienceDuty"  />

          <el-table-column label="开始时间" prop="startDate"  />
          <el-table-column label="结束时间" prop="endDate"  />
        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>证照类型</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="certificate" border>
          <el-table-column label="证件名称" prop="certificateTypeTxt"  />
          <el-table-column label="编号" prop="certificateNo"  />
          <el-table-column label="开始时间" prop="startDate" :formatter="startDateFormat" />
          <el-table-column label="结束时间" prop="endDate" :formatter="endDateFormat" />

        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>紧急联系人</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="emergency" border>
          <el-table-column label="姓名" prop="contactPerson"  />
          <el-table-column label="关系" prop="relationshipTxt"  />
          <el-table-column label="联系方式" prop="tel"  />

        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>语言能力</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="language" border>
          <el-table-column label="语种" prop="languageTxt"  />
          <el-table-column label="听说能力" prop="loTxt"  />
          <el-table-column label="读写能力" prop="rwTxt"  />

        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>证书</span>
      </div>
      <div class="contractWrap">
       <el-table style="width: 100%" :data="skill" border>
          <el-table-column label="证书/奖励名称" prop="certificatation"  />
          <el-table-column label="获得日期" prop="acquaintedDate"  />
          <el-table-column label="颁发单位" prop="EXT_COL_942"  />
        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>银行卡信息</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="bank" border>
          <el-table-column label="开户人姓名" prop="accountName"  />
          <el-table-column label="开户银行" prop="bankName"  />
          <el-table-column label="银行账号" prop="bankAccount"  />

          <el-table-column label="开户地点" prop="bankAddr"  />
          <el-table-column label="用途" prop="useDesc"  />

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


    <el-card>
      <div slot="header">
        <span>家庭成员</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="family" border>

          <el-table-column label="家庭成员姓名" prop="name"  />
          <el-table-column label="关系" prop="relationshipTxt"  />

          <el-table-column label="联系电话" prop="homeTel"  />
          <el-table-column label="联系地址" prop="homeAddress"  />
          <el-table-column label="家庭成员身份证号码" prop="idCardNo"  />

          <el-table-column label="家庭成员出生日期" prop="birthday" :formatter="birthFormat" />
          <el-table-column label="所在单位" prop="company"  />
        </el-table>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        <span>附件</span>
      </div>
      <div class="contractWrap">
        <el-table style="width: 100%" :data="files" border>
          <el-table-column label="附件名称" prop="fileName"  />
          <el-table-column label="附件类型" prop="fileTypeTxt"  />
          <el-table-column label="附件路径" prop="fileUrl" >
            <template slot-scope="scope">
              <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row)  target="_blank"-->
<!--              <div> <a @click="downLoadFileMethod(scope.row)" >下载</a>  </div>-->
              <el-button
                size="small"
                type="text"
                @click="downLoadFileMethod(scope.row)"
              >下载
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>

  </div>
</template>

<script>
import mixin from "@/views/pageDetail/mixin.js";
import {  downLoadFile,downImageFile } from "@/api/sysEmpInfo/empInfo";
import personImage from '../image/person.png'
export default {
  name: "addForm",
  mixins: [mixin],
  data(){
    return{
      workexp:[],//工作经历
      certificate:[],//身份证
      emergency:[],//紧急联系人
      training: {},//培训
      language:[],//语言
      baseinfo: {},//基础信息
      bank:[],//银行卡信息
      edu:[],//教育
      edu2:[],//教育
      skill: [],//技能
      employinfo: {},//雇佣
      files: [],//附件
      family: [],//家庭成员
      projectExp:[],//项目经验
      dialogImageUrl:personImage,
      srcList:[]
    }
  },
  computed: {

  },
  props: {
    //可以在vc中拿到
    basicInfo: {
      type: Object
    },
    detailDisabled: {
      type: Boolean,
      default: () => false
    },
    readOnlyState: {
      type: Boolean,
      default: () => false
    },
  },
  created() {

  },
  watch: {
    //简写形式
    ["basicInfo.empid"](val){
      let data1=JSON.parse(this.basicInfo.other1).data;
      this.workexp=data1.workexp
      this.certificate=data1.certificate
      this.emergency=data1.emergency
      this.training=data1.training

      this.language=data1.language
      this.baseinfo=data1.baseinfo
      this.bank=data1.bank
      this.edu=data1.edu

      this.employinfo=data1.employinfo
      this.files=data1.files
      this.family=data1.family


      this.showUrl();

      let arrayData=JSON.parse(this.basicInfo.other2).data;

      this.fillData(this.filterEntity(arrayData,"skill"),this.skill);

      this.fillData(this.filterEntity(arrayData,"edu"),this.edu2);
      this.assignEdu(this.edu,this.edu2)

      this.fillData(this.filterEntity(arrayData,"projectExp"),this.projectExp);
    }

  },
  methods: {
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
    async showUrl(){
      if(this.basicInfo.photoUrl){
        let queryParam={
          photoUrl:this.basicInfo.photoUrl,
          empid:this.basicInfo.empid,
          workno:this.basicInfo.workno,
          empName:this.basicInfo.empName,
        }
        let res = await downImageFile(queryParam);
        let blob = new Blob([res], {type: 'image/jpeg'});
        const imageUrl = URL.createObjectURL(blob);
        //const  imageUrl = "https://t11.baidu.com/it/u=3341805220,3348495499&fm=58"
        console.log(imageUrl,"图片")
        this.dialogImageUrl = imageUrl;
        //this.srcList.push(imageUrl);
      }

    },
    ruDang(){

      return this.parseTime(this.basicInfo.ext_COL_998,'{y}-{m}-{d}')
    },
    startDateFormat(row, column) {
      return this.parseTime(row.startDate,'{y}-{m}-{d}')
    },
    endDateFormat(row, column) {
      return this.parseTime(row.endDate,'{y}-{m}-{d}')
    },
    birthFormat(row, column) {
      if(!row.birthday) return "";
      return this.parseTime(row.birthday,'{y}-{m}-{d}')
    },
   async downLoadFileMethod(row){
      if(row.fileUrl){
        let queryParam={
          photoUrl:row.fileUrl
        }
        let res = await downLoadFile(queryParam);
        this.downloadUrlFile(res,row.fileUrl);
      }
    },
    downloadUrlFile(response,fileUrl){
  // 提取文件名
  /*const contentDisposition = response.headers['content-disposition'];
  if (!contentDisposition) {
    return;
  }
  let fileName = contentDisposition.match(/fileName=(.*)/)[1];
  fileName = decodeURIComponent(fileName);*/
      let object=fileUrl.split("/");
      let fileName=this.basicInfo.empid+"_"+this.basicInfo.workno+"_"+this.basicInfo.empName+"_"+object[object.length-1];
  // 将二进制流转为blob
  const blob = new Blob([response], {
    type: 'application/octet-stream'
  });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    console.log(",,blobURL,",blobURL)
    tempLink.setAttribute('download', fileName);
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    setTimeout(() => {
      document.body.removeChild(tempLink);
      // 释放blob URL地址
      window.URL.revokeObjectURL(blobURL);
    }, 300);
  }
}
  },
  mounted(){

  }
}
</script>

<style scoped>

</style>
