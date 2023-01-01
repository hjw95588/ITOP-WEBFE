<template>
  <div class="registerWrap">
    <div class="titleWrap" v-if="resetSucess">
      <p class="updateText">系统检测到您为首次登录，由于系统安全机制，请修改初始密码！</p>
    </div>
    <div class="formWrap" v-if="resetSucess">
      <el-form ref="updatePwDForm" :model="updatePwDForm" :rules="registRules">
        <div>
          <el-form-item prop="password">
            <el-input type="password" v-model.trim="updatePwDForm.password" autocomplete="off" placeholder="请填写6-12位密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="surePassword">
            <el-input type="password" v-model.trim="updatePwDForm.surePassword" autocomplete="off" placeholder="再次输入密码">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="successWrap" v-if="!resetSucess">
      <p class="succeTitle">密码修改成功！</p>
    </div>
    <div class="btnWrap">
      <el-button type="primary" style="width: 100%;" v-if="resetSucess" :disabled="isClick" @click="nextStep">修改密码</el-button>
      <el-button type="primary" style="width: 100%;" v-else @click="goToLogin">返回登录</el-button>
    </div>
  </div>
</template>

<script>
import { updateIntPwd} from '@/api/system/user'
export default {
  name: 'UpdateIntPwd',
  props: {
    userId: {
      required: true,
      type: String,
      default: ''
    }
  },
  data () {
    const validePass = (rule, value, cb) => {
      if (value === '') {
        cb (new Error('请填写位密码'))
      } else if (value.length < 6 || value.length > 12) {
        cb (new Error('请填写6-12位密码'))
      } else {
        if (this.updatePwDForm.surePassword !== '') {
          this.$refs.updatePwDForm.validateField('surePassword')
        }
        cb()
      }
    }
    const valideSurePass = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('请再次输入密码'))
      } else if (value !== this.updatePwDForm.password) {
        cb(new Error('两次密码输入不一致，请确认后输入'))
      } else {
        cb()
      }
    }
    // 去重校验
    const pwdVidiate = (rule, value, cb, msg) => {
      if (!!msg) {
        cb(new Error(msg))
      }
      cb()
    } 
    return {
      isClick: false, // 控制重置按钮
      resetSucess: true, // 控制下一步是否可点击
      // 注册信息
      updatePwDForm: {
        password: '',
        surePassword: '',
      },
      pwdTitpMsg: '', // 密码重置非法提示
      // 注册信息校验
      registRules: {
        password: [
          { required: true, validator: validePass, trigger: 'blur' },
          { validator: (rule, value, cb) => pwdVidiate(rule, value, cb, this.pwdTitpMsg)}
        ],
        surePassword: [
          { required: true, validator: valideSurePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    console.log(this.userId)
  },
  methods: {
    // 去登录
    goToLogin () {
      this.$store.dispatch("LogOut").then(() => {
        this.$emit('updatePwdLogin', 0)
      })
    },
    // 点击下一步
    nextStep () {
      this.pwdTitpMsg = ''
      this.$refs.updatePwDForm.validate(valide => {
        if (valide) {
          const password = this.updatePwDForm.password
          const userId = this.userId
          updateIntPwd({userId, password}).then(res => {
            if (res.code === 10105 || res.code === 10106 || res.code === 10107) {
              this.pwdTitpMsg = res.msg
              this.$refs.updatePwDForm.validateField('password')
            } else if (res.code === 200) {
              this.resetSucess = false
              this.isClick = false
              if (sessionStorage.getItem('token')) {
                sessionStorage.removeItem('token')
              }
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .card { width: 65%;
    .updateText { text-align: center; color: #606266;}
  }
  .successWrap { padding: 30px 0 50px; text-align: center;
    .succeTitle { font-size: 24px; font-weight: 550; }
  }
  .titleWrap { position: relative;
    .updateText { text-align: center; color: #e60012; }
  }
  .btnWrap { margin-bottom: 22px;}
</style>