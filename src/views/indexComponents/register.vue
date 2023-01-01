<template>
  <div class="registerWrap">
    <el-form ref="baseForm" :model="registFom" :rules="registRules">
      <div v-if="stepActives === 0">
        <el-form-item prop="userId">
          <el-input type="text" v-model.trim="registFom.userId" autocomplete="off" placeholder="请输入用户名">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input type="text" v-model.trim="registFom.userName" autocomplete="off" placeholder="请输入姓名">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <el-input type="phone" v-model.trim="registFom.phoneNumber" autocomplete="off" placeholder="请输入手机号">
            <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input type="email" v-model.trim="registFom.email" autocomplete="off" placeholder="请输入邮箱地址">
            <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
      </div>
      <div v-else-if="stepActives === 1">
        <el-form-item prop="code" class="checkCodeCl">
          <el-input placeholder="请输入验证码" v-model.trim="registFom.code">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            <el-button slot="append" class="sendBtn" @click="sendEmailCode" :disabled="checkEmail.canClickState">
              {{checkEmail.canClickState ? `${checkEmail.btnText}s` : '发送邮箱验证码'}}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model.trim="registFom.password" autocomplete="off" placeholder="请填写6-12位密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="surePassword">
          <el-input type="password" v-model.trim="registFom.surePassword" autocomplete="off" placeholder="再次输入密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="successWrap" v-if="stepActives === 2">
      <p class="succeTitle">注册成功</p>
      <p class="accountNum">您的账号{{registFom.userId}}已成功注册!</p>
    </div>
    <div class="regBtnWrap">
      <el-button type="primary" style="width: 100%;" v-if="stepActives !== 2" :disabled="isClick" @click="nextStep">下一步</el-button>
      <el-button class="marginBtom" type="primary" style="width: 100%;" v-if="stepActives === 2" @click="goToLogin">返回登录</el-button>
      <p class="hasAcount" v-if="stepActives !== 2">已有账号？<el-button type="text" @click="goToLogin">立即登录</el-button></p>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { userRegiste, getEmailCode } from '@/api/system/user'
export default {
  name: 'Register',
  data () {
    const validePass = (rule, value, cb) => {
      if (value === '') {
        cb (new Error('请填写位密码'))
      } else if (value.length < 6 || value.length > 12) {
        cb (new Error('请填写6-12位密码'))
      } else {
        if (this.registFom.surePassword !== '') {
          this.$refs.baseForm.validateField('surePassword')
        }
        cb()
      }
    }
    const valideSurePass = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请再次输入密码'))
      } else if (value !== this.registFom.password) {
        cb(new Error('两次密码输入不一致，请确认后输入'))
      } else {
        cb()
      }
    }
    // 去重校验
    const remDuplicate = (rule, value, cb, msg) => {
      if (!!msg) {
        cb(new Error(msg))
      }
      cb()
    } 
    return {
      stepActives: 0, // 步骤条
      isClick: false, // 控制下一步是否可点击
      stepData: [
        { title: '填写账号信息' },
        { title: '验证邮箱信息' },
        { title: '注册完成' }
      ],
      userIdMsg: '', // 用户重名提示
      phoneNumMsg: '', // 用户重名提示
      emailMsg: '', // 用户重名提示
      // 注册信息
      registFom: {
        userId: '', // 用户名
        userName: '',// 姓名
        // affiliatUnit: '',
        phoneNumber: '',
        email: '',
        password: '',
        code: '', // 邮箱验证码
        surePassword: '',
        uuid: '' // 唯一标识
      },
      // 注册信息校验
      registRules: {
        userId: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '用户名输入不正确', trigger: 'blur' },
          { validator: (rule, value, cb) => remDuplicate(rule, value, cb, this.userIdMsg)}
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
          { validator: (rule, value, cb) => remDuplicate(rule, value, cb, this.phoneNumMsg)}
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          },
          { validator: (rule, value, cb) => remDuplicate(rule, value, cb, this.emailMsg)}
        ],
        password: [
          { required: true, validator: validePass, trigger: 'blur' }
        ],
        surePassword: [
          { required: true, validator: valideSurePass, trigger: 'blur' }
        ]
      },
      checkEmail: {
        btnText: 300, // 发送验证码文本
        canClickState: false, // 是否禁用发送按钮
        readySend: false, // 已发送提示
        timer: null,
        errTipe: false, // 控制验证码错误提示语
        cookieTimer: null // 清楚cookie定时器
      }
    }
  },
  methods: {
    // 去登录
    goToLogin () {
      this.$emit('registLogin', 0)
    },
    setCookie (cookieData) {
      clearTimeout(this.checkEmail.cookieTimer)
      const currentTime = new Date().getTime()
      const expiresTime = currentTime + 60 * 1000 * 5
      Cookies.set('registUuid', cookieData, { expires: expiresTime })
      this.checkEmail.cookieTimer = setTimeout(() => {
        Cookies.remove('registUuid')
        clearTimeout(this.checkEmail.cookieTimer)
      }, 200000)
    },
    // 发送邮箱验证码
    sendEmailCode () {
      this.checkEmail.errTipe = false
      this.checkEmail.canClickState = true
      const getRegistUUID = Cookies.get('registUuid')
      if (getRegistUUID !== undefined) {
        this.registFom.uuid = getRegistUUID
      }
      getEmailCode({ email: this.registFom.email }).then(res => {
        if (res.code === 200) {
          this.checkEmail.readySend = true
          this.registFom.uuid = res.uuid
          this.setCookie(res.uuid)
          this.$message({
            message: `验证码已发送至${this.forgetPwDForm.email}邮箱！`,
            type: 'success'
          })
        } 
      })
      this.checkEmail.timer = setInterval(() => {
        this.checkEmail.btnText --
        if (this.checkEmail.btnText === 0) {
          this.checkEmail.canClickState = false
          this.checkEmail.readySend = false
          this.checkEmail.btnText = 300
          clearInterval(this.checkEmail.timer)
        }
      }, 1000)
    },
    // 点击下一步
    nextStep () {
      if (this.stepActives >= 2) return
      if (this.stepActives === 0) {
        this.userIdMsg = ''
        this.phoneNumMsg = ''
        this.emailMsg = ''
        this.isClick = true
        this.$refs.baseForm.validate(valide => {
          if (valide) {
            const {
              userId,
              userName,
              password,
              email,
              phoneNumber,
            } = this.registFom
            userRegiste({userId, userName, password, email, phoneNumber}).then(res => {
              if (res.code === 10100) {
                this.stepActives ++
              } else if (res.code === 10101) {
                this.userIdMsg = res.msg
                this.$refs.baseForm.validateField('userId')
              } else if (res.code === 10103) {
                this.phoneNumMsg = res.msg
                this.$refs.baseForm.validateField('phoneNumber')
              } else if (res.code === 10102) {
                this.emailMsg = res.msg
                this.$refs.baseForm.validateField('email')
              }
              this.isClick = false
            }).catch(err => {
              this.isClick = false
            })
            this.checkEmail.errTipe && (this.checkEmail.errTipe = false)
          } else {
            this.isClick = false
          }
        })
      } else if (this.stepActives === 1) {
        this.isClick = true
        const {
          userId,
          userName,
          password,
          email,
          phoneNumber,
          code,
          uuid
        } = this.registFom
        userRegiste({userId, userName, password, email, phoneNumber, code, uuid}).then(res => {
          if (res.code === 200) {
            this.stepActives ++
            this.isClick = false
          }
        }).catch(err => {
          this.checkEmail.errTipe = true
          this.isClick = false
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .checkCodeCl { text-align: center;
    .sendBtn { width: 140px; font-size: 14px; height: 36px; background: #2a435b; color: #f5f7fa; height: 100%; border-radius: 0;
      &.is-disabled { background: #f5f7fa; color: #909399;
        &:hover { background: #f5f7fa; color: #909399; }
      }
    }
  }
  .stipWrap { padding-bottom: 10px; height: 60px;
    .textP { width: 400px;  margin: 0 auto; font-size: 14px; line-height: 30px;
      &.textGray { color: #595e62; }
      &.textRed { color: #fa4e4e; }
    }
  }
  .regBtnWrap {
    .marginBtom { margin-bottom: 22px; }
    .hasAcount { font-size: 14px; color: #999898; text-align: center; font-weight: 550;
      .el-button--text { font-size: 14px; font-weight: 550; color: #1f86f7; }
    }
  }
  .successWrap { text-align: center;
    .succeTitle { font-size: 24px; font-weight: 550; }
  }
  ::v-deep .el-input-group__append { overflow: hidden; font-size: 0;}
</style>