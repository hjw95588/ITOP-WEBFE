<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
import FlowConditionVue from './flow/package/refactor/flow-condition/FlowCondition.vue';
// import { mpaMutations } from 'vuex'
export default  {
  name:  'App',
  mounted () {
    let url = document.location.href.toString();
    // let url = 'http://192.168.4.102:20110/dashboard?kylinAuthorization=eyJhbGciOiJIUzUMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjVjMDdjMTcxLTEzYzEtNDYwYi05MDIwLTEwMTIzYWQyNjUyYSJ9.U513IAjo2pP0hdRS8BBD172mYbLDU8IQSABy3WS_FhxBLucuAjJ5CS2eIXFsFz2CppwASS5EnRx0JFHjwTEC5g&userId=admin'
    const authStr = 'kylinAuthorization='
    const codeStr = 'code='
    if (url.split("?")[1] && url.split("?")[1].indexOf(authStr) !== -1 || url.split("?")[1] && url.split("?")[1].indexOf(codeStr) !== -1) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'isJumpLogin',
        value: true
      })
      // 如果传入code
      if (url.split("?")[1] && url.split("?")[1].indexOf(codeStr) !== -1) {
        const arrUrl = url.split("?")[1].split('&')
        const code = arrUrl[0].slice(codeStr.length, arrUrl[0].length)
        let userId = arrUrl[1].slice(7, arrUrl[1].length)
        // console.log(code === 401)
        if (code === '401') {
          // console.log('我走了401')
          this.$store.dispatch('GetIamUrl').then(res => {
            if (res.code === 200) {
              window.open(res.data, '_self')
            }
          })
        } else {
          this.$router.push({
            path: '/nouser',
            query: {
              userId: userId
            }
          })
        }
        return
      }
      /** 路由参数存在token时会进入此判断 */
      if (url.split("?")[1] && url.split("?")[1].indexOf(authStr) !== -1) {
        let arrUrl = url.split("?")[1].split('&');
        let token = arrUrl[0].slice(authStr.length, arrUrl[0].length)
        setToken(token);
        this.$store.commit("SET_TOKEN", token);
        let userId = arrUrl[1].slice(7, arrUrl[1].length)
        this.$store.commit("SET_USERID", userId);
        this.$router.push({ path: '/index' })
      }
    }
    //  else {
    //   this.$store.dispatch('settings/changeSetting', {
    //     key: 'isJumpLogin',
    //     value: false
    //   })
    //   // this.$router.push({ path: '/login' })
    // }
    // 调用换肤方法
    this.changeFace()
  },
  methods: {
    changeFace () {
      const faceStyle = this.$store.state.settings.systemFace
      if (faceStyle) {
        document.getElementsByTagName('body')[0].classList.add(faceStyle)
        // const headeEl = document.getElementsByTagName('head')[0]
        // const createEl = document.createElement('link')
        const createEl = document.getElementById('styleLink')
        // createEl.id = 'styleLink'
        createEl.href = `${process.env.BASE_URL}theme/${faceStyle}/index.css`
        // createEl.rel = "stylesheet"
        // createEl.type = "text/css"
        
        // headeEl.appendChild(createEl)
      }
    }
  }
}
</script>
