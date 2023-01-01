<template>
  <div class="sidebar-logo-container" :style="{'background': backgroundColor}">
    <transition name="sidebarLogoFade">
      <router-link key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title" :style="{'color': textColor}">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'

export default {
  name: 'SidebarLogo',
  props: {
    backgroundColor: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: 'ffffff'
    }
  },
  data() {
    return {
      title: 'e信打卡管理平台',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 6px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      // color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      &.light-color { color: #333; }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
