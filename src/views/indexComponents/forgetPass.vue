<template>
  <div class="registerWrap">
    <div class="formWrap" v-if="resetSucess">
      <el-form ref="basePwDForm" :model="forgetPwDForm" :rules="registRules">
        <div>
          <el-form-item prop="userId">
            <el-input type="text" v-model.trim="forgetPwDForm.userId" autocomplete="off" placeholder="请输入用户名">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input type="email" v-model.trim="forgetPwDForm.email" autocomplete="off" placeholder="请输入邮箱地址">
              <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon" />
              <el-button slot="append" class="sendBtn" @click="sendEmailCode" :disabled="checkEmail.canClickState">
                {{checkEmail.canClickState ? `${checkEmail.btnText}s` : '发送'}}
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input placeholder="请输入验证码" v-model.trim="forgetPwDForm.code">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model.trim="forgetPwDForm.password" autocomplete="off" placeholder="请填写6-12位密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="surePassword">
            <el-input type="password" v-model.trim="forgetPwDForm.surePassword" autocomplete="off" placeholder="再次输入密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="successWrap" v-if="!resetSucess">
      <p class="succeTitle">密码重置成功！</p>
    </div>
    <div class="btnResWrap">
      <el-button v-if="resetSucess" type="primary" style="width: 100%;" :disabled="isClick" @click="nextStep">确认重置</el-button>
      <el-button class="marginBtom" v-else type="primary" style="width: 100%;" :disabled="isClick" @click="goToLogin">返回登录</el-button>
      <p><el-button v-if="resetSucess" type="text" style="width: 40%;" @click="goToLogin">返回登录</el-button></p>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { resetPwd, forgetPwdCode } from '@/api/system/user'
export default {
  name: 'Register',
  data () {
    const validePass = (rule, value, cb) => {
      if (value === '') {
        cb (new Error('请填写位密码'))
      } else if (value.length < 6 || value.length > 12) {
        cb (new Error('请填写6-12位密码'))
      } else {
        if (this.forgetPwDForm.surePassword !== '') {
          this.$refs.basePwDForm.validateField('surePassword')
        }
        cb()
      }
    }
    const valideSurePass = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请再次输入密码'))
      } else if (value !== this.forgetPwDForm.password) {
        cb(new Error('两次密码输入不一致，请确认后输入'))
      } else {
        cb()
      }
    }
    return {
      isClick: false, // 控制重置按钮
      resetSucess: true, // 控制下一步是否可点击
      userIdMsg: '', // 用户重名提示
      phoneNumMsg: '', // 用户重名提示
      emailMsg: '', // 用户重名提示
      // 注册信息
      forgetPwDForm: {
        userId: '', // 用户名
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
          { pattern: /^[A-Za-z0-9]+$/, message: '用户名输入不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
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
        timer: null,
        cookieTimer: null // 清楚cookie
      }
    }
  },
  methods: {
    // 去登录
    goToLogin () {
      this.$emit('forgetPwdLogin', 0)
    },
    // 把UUID存cookie
    setCookie (cookieData) {
      clearTimeout(this.checkEmail.cookieTimer)
      const currentTime = new Date().getTime()
      const expiresTime = currentTime + 60 * 1000 * 5
      Cookies.set('uuid', cookieData, { expires: expiresTime })
      this.checkEmail.cookieTimer = setTimeout(() => {
        Cookies.remove('uuid')
        clearTimeout(this.checkEmail.cookieTimer)
      }, 200000)
    },
    // 发送邮箱验证码
    sendEmailCode () {
      const msgArr = []
      this.$refs.basePwDForm.validateField(['userId', 'email'], errMsg => {
        if (errMsg !== '') {
          msgArr.push(errMsg)
        }
      })
      if (msgArr.length !== 0) return
      const getUUID = Cookies.get('uuid')
      if (getUUID !== undefined) {
        this.forgetPwDForm.uuid = getUUID
      }
      forgetPwdCode({ userId: this.forgetPwDForm.userId, email: this.forgetPwDForm.email }).then(res => {
        if (res.code === 200) {
          this.forgetPwDForm.uuid = res.uuid
          this.setCookie(res.uuid)
          this.checkEmail.canClickState = true
          this.checkEmail.timer = setInterval(() => {
            this.checkEmail.btnText --
            if (this.checkEmail.btnText === 0) {
              this.checkEmail.canClickState = false
              this.checkEmail.btnText = 300
              this.isClick = false
              clearInterval(this.checkEmail.timer)
            }
          }, 1000)
          this.$message({
            message: `验证码已发送至${this.forgetPwDForm.email}邮箱！`,
            type: 'success'
          })
        } else if (res.code === 10104) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 点击下一步
    nextStep () {
      this.$refs.basePwDForm.validate(valide => {
        if (valide) {
          this.isClick = true
          const {
            userId, // 用户名
            email,
            password,
            code, // 邮箱验证码
            uuid // 唯一标识
          } = this.forgetPwDForm
          resetPwd({ userId, email, password, code, uuid }).then(res => {
            if (res.code === 200) {
              this.resetSucess = false
              this.isClick = false
            }
          }).catch(err => {
            this.isClick = false
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .formWrap { padding-top: 10px;
    .sendBtn { font-size: 14px; height: 36px; background: #2a435b; color: #f5f7fa; height: 100%; border-radius: 0;
      &.is-disabled { background: #f5f7fa; color: #909399;
        &:hover { background: #f5f7fa; color: #909399; }
      }
    }
  }
  .successWrap { text-align: center;
    .succeTitle { font-size: 24px; font-weight: 550; }
  }
  .btnResWrap { display: flex; justify-content: space-around; flex-wrap: wrap;
    .marginBtom { margin-bottom: 22px; }
    .el-button--text {  font-weight: 550; color: #1f86f7; }
  }
  ::v-deep .el-input-group__append { overflow: hidden; font-size: 0;}
</style>