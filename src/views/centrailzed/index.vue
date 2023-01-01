<template>
  <div class="app-container">
    <div class="jump_wrap">
      <div class="text_decrip">此功能须在原系统进行操作，将为您跳转到原系统</div>
      <!-- <div><el-button @click="jumpOldSys">集采模块跳转</el-button></div> -->
    </div>
  </div>
</template>

<script>
import { getOldSysUrl } from '@/api/login'
export default {
  name: 'Centrailzed',
  created () {
    this.jumpOldSys()
  },
  methods: {
    jumpOldSys () {
      getOldSysUrl().then(res => {
        if (res.code === 200) {
          window.open(res.msg, '_blank')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .jump_wrap { margin: 80px; display: flex; flex-direction: column; align-items: center;
    .text_decrip { margin-bottom: 20px; }
  }
</style>