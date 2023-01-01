<template>
  <div class="login">
    <div  class="login-form">
      <div class="login-logo">
        <!-- <h3 class="title">Kylin</h3> -->
<!--        <img src="@/assets/image/kylin-logo-login.png">-->
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" v-if="modelNum === 0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" />
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
        <el-form-item class="btnWrap" style="width: 100%">
          <el-button type="text" class="textClas" @click="goToRegiste">立即注册</el-button>
          <el-divider direction="vertical" class="line"></el-divider>
          <el-button type="text" class="textClas" @click="goToForgetPass">忘记密码</el-button>
        </el-form-item>
      </el-form>
      <Register v-if="modelNum === 1" @registLogin="toLogin" />
      <ForgetPass v-if="modelNum === 2" @forgetPwdLogin="toLogin" />
      <UpdateIntPwd v-if="modelNum === 3" :userId="loginForm.username" @updatePwdLogin="toLogin" />
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>© 2021-2022 Hjw All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import Register from '@/views/indexComponents/register'
import ForgetPass from '@/views/indexComponents/forgetPass'
import UpdateIntPwd from '@/views/indexComponents/updateIntPwd'
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encryptClient, decryptClient } from '@/utils/security'

export default {
  name: "Login",
  components: { Register, ForgetPass, UpdateIntPwd },
  data() {
    return {
      modelNum: 0, // 控制登录等模块：0：登录模块；1：注册模块；2：忘记密码模块；3：修改初始密码
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "111111",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
        if(res.imageCode){
          this.$set(this.loginForm, 'code', res.imageCode)
        }

      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decryptClient(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encryptClient(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then((res) => {
              this.loading = false;
              if (res.initPwd) {
                this.modelNum = 3
                return
              }
              this.$router.push({ path: "/" });
              this.$store.dispatch('app/changeLoginMode', 'normal')
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    // 忘记密码
    goToForgetPass () {
      this.modelNum = 2
    },
    // 立即注册
    goToRegiste () {
      this.modelNum = 1
    },
    // 注册完成
    toLogin (value) {
      this.getCode()
      this.loginForm.code = ''
      this.loading = false;
      this.modelNum = value
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: flex-end;
  padding-right: 120px;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background-color: rgba(255,255,255,0.5);
  width: 400px;
  padding: 25px 25px 5px 25px;
  // margin-left: auto;
  // margin-right: 120px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-logo {
  margin: 0px auto 20px auto;
  text-align: center;
  img {
    width: 80%;
  }
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.btnWrap { display: flex; justify-content: space-between;
  .textClas { font-size: 14px; color: #3b94f5; font-weight: 550;}
  .line { height: 60%; background: #a0b5c9; }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
