<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="user" /> 用户名称
                </div>
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="phone" /> 手机号码
                </div>
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="email" /> 用户邮箱
                </div>
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="tree" /> 所属部门
                </div>
                <div class="pull-right" v-if="userDept">{{ userDept }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="peoples" /> 所属角色
                </div>
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <div class="svgWrap">
                  <svg-icon icon-class="date" /> 创建日期
                </div>
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      userDept: '', // 用户部门拼接
      roleGroup: '',
      postGroup: '',
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        if (response.data.dept && response.data.dept.length !== 0) {
          this.userDept = this.handleArrData(response.data.dept, 'deptName')
        }
        if (response.data.roles && response.data.roles.length !== 0) {
          this.roleGroup = this.handleArrData(response.data.roles, 'roleName')
        }
        if (response.data.posts && response.data.posts.length !== 0) {
          this.postGroup = this.handleArrData(response.data.posts, 'postName');
        }
      });
    },
    handleArrData (arr, name) {
      let dataArr = []
      let nameStr = ''
      if (arr.length !== 0) {
        for (var i = 0; i < arr.length; i ++) {
          dataArr.push(arr[i][name])
        }
        nameStr = dataArr.join()
        return nameStr
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.svgWrap {
  font-weight: bold;
  }
</style>
