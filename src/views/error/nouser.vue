<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404_new.png" alt="404" height="100%">
        <!-- <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404"> -->
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">
          用户{{ userId }}不存在！
        </div>
        <!-- <div class="bullshit__headline">
          {{ message }}
        </div> -->
        <div class="bullshit__info">
          系统将在{{timerClose}}s后自动关闭！
        </div>
        <!-- <router-link to="/" class="bullshit__return-home">
          返回首页
        </router-link> -->
        <div class="bullshit__return-home" @click="closeSystem">
          关闭系统
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoUser',
  data () {
    return {
      timerInterval: null,
      userId: '',
      timerClose: 5
    }
  },
  computed: {
    message() {
      return '找不到网页！'
    }
  },
  created () {
    this.userId = this.$route.query.userId
    this.timerInterval = setInterval(() => {
      this.timerClose --
      if (this.timerClose === 0) {
        window.close()
        clearInterval(this.timerInterval)
      }
    }, 1000)
  },
  methods: {
    closeSystem () {
      window.close()
      clearInterval(this.timerInterval)
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  // transform: translate(-50%,-50%);
  // position: relative;
  // top: 40%;
  // left: 50%;
  height: 100%;
  width: 100%;
}
.wscn-http404 {
  position: relative;
  width: 1005;
  height: 100%;
  box-sizing: border-box;
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    // float: left;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &__parent {
      display: block;
      margin: 0 auto;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: absolute;
    top: 130px;
    left: 0;
    right: 0;
    margin: 0 auto;
    float: left;
    width: 600px;
    padding: 30px 0;
    overflow: hidden;
    text-align: center;
    &__oops {
      font-size: 30px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 40px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 32px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 18px;
      line-height: 36px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      margin: 0 auto;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
