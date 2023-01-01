<template>
    <div>
      <div class="box">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addUserList">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="disabled" @click="deleteColumn">删除</el-button> 
     </div>
      <!-- 表格组件 -->
       <el-table
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="userId"
            align="center"
            label="用户编码">
            <template slot="header" slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">用户编码<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown" >
                  <el-input
                    size="small"
                    type="text"
                    placeholder="请输入"
                    style="width: 160px;"
                    clearable
                    v-model="userId">
                   </el-input>
                   <div class="btnBox">
                      <el-button type="primary" size="mini" @click="handleQuery('userId')">搜索</el-button>
                       <el-button size="mini" @click="resetQuery('userId')">重置</el-button>
                   </div>
                </el-dropdown-menu>
               </el-dropdown>
             
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            align="center"
            >
            <template slot="header" slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">用户名称<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown" >
                  <el-input
                    size="small"
                    type="text"
                    placeholder="请输入"
                    style="width: 160px;"
                    clearable
                    v-model="userName">
                   </el-input>
                   <div class="btnBox">
                      <el-button type="primary" size="mini" @click="handleQuery('userName')">搜索</el-button>
                       <el-button size="mini" @click="resetQuery('userName')">重置</el-button>
                   </div>
                </el-dropdown-menu>
               </el-dropdown>
             
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="dept"
            label="部门">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.dept" :key="index">{{scope.row.dept.length-1==index?item.deptName:item.deptName+','}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作" align="center" width="100">
          <template slot-scope="scope">
             <el-button type="text" size="small" @click="deleteColumn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes,jumper">
      </el-pagination>
  </div>
</template>

<script>
import { getUser,addUser,delUser } from "@/api/system/role";
import deepClone from "clone-deep";
export default {
  name: "RiskTrade",
  data() {
    return {
      dialogVisible:false,
      // 总条数
      total: 1,
      pageNum: 1,
      pageSize: 10,
      //主键ID集合
      ids:[],
      loading:false,
      disabled:true,
      tableData: [],
      userName:'',
      userId:'',
     userIds:[]
    };
  },
  props: {
    keepForm: {
      type: Object,
      default: () => {}
    },
  },
  components: {
   
},
  computed: {
    
  },
  filters: {
    
  },
  created() {
      
  },
   mounted() {
      this.getList()
   },
  methods: {
   /** 分配用户按钮操作 userId, userName,*/
    getList() {
      let obj={
        roleId:this.keepForm.roleId,
        userName:this.userName,
        userId:this.userId,
        pageSize:this.pageSize, 
        pageNum:this.pageNum
      }
      getUser(obj).then((response) => {
        this.tableData = response.rows;
        this.total=response.total
      });

    },
    
    /** 搜索按钮操作 */
    handleQuery(val) {
      if(val=="userName"){
        this.userId=""
      }else{
        this.userName=""
      }
      this.pageNum = 1;
      this.getList();
    },
     /** 重置按钮操作 */
    resetQuery(val) {
      if(val=="userName"){
        this.userName=""
      }else{
        this.userId=""
      }
      this.handleQuery(val);
    },
     // 修改帮定用户
    addUserList() {
        //获取未分页的全部用户
        getUser({roleId:this.keepForm.roleId}).then((response) => {
           this.$emit("addFormUserList",response.rows)
        });
        
    },
    /** 提交按钮（绑定用户） */
    submitUserScope (val) {
      if (this.keepForm.roleId) {
        let userIds = [];
        let roleId = this.keepForm.roleId;
       val.forEach((u) => {
          userIds.push(u.userId)
        });
        let postData = { roleId, userIds };
        addUser(postData).then((response) => {
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.userName=""
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    handleSelectionChange(val){
      this.userIds = val.map(item => item.userId)
      this.disabled=val.length<=0
    },
    //删除
    deleteColumn(row){
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
           let roleId = this.keepForm.roleId;
           let userIds=[]
           if(row.userId){
               userIds.push(row.userId)
           }else{
               userIds=this.userIds
           }
           //const userIds = row.userId || this.userIds;
           let postData = { roleId, userIds };
           console.log(postData)
          delUser(postData).then(
          response => {
            if(response&&response.code===200){
              this.getList()
             this.msgSuccess("删除成功");
            }else{
              this.msgError(response.msg);
            }
          }
        );
      }).catch(() => {});
    },
    
    // 每页数
    sizeChangeHandle (val) {
        this.pageSize = val
       this.pageNum = 1
        this.getList();
    },
    // 当前页
    currentChangeHandle (val) {
        this.pageNum = val
        this.getList();
    },
  },
 
};
</script>
<style lang="scss" scoped>
.box{
    margin-bottom: 15px;
    height: 32px;
    line-height: 32px;
  }
.btnBox{
    width: 100%;
    text-align: center;
}  
::v-deep{
 .el-table {
    th.el-table__cell{
      background: rgba(0,0,0,0.02);
    }
 }
 .el-pagination{
   margin: 20px 0;
   text-align: right;
 }
 .el-input{
   height: 32px;
   margin-bottom: 15px;
 }
 .el-dropdown-menu--medium{
     padding: 10px;
 }
}
</style>