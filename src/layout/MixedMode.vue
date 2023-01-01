<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <mixed-sidbar class="sidebar-container" />
    <div :class="{mixedation: navbarMode === 'mixed', hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <mixed-navbar />
        <div class="breadHamburger">
          <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
          />
          <breadcrumb class="breadcrumb-container" />
        </div>
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import Hamburger from "@/components/Hamburger";
import Breadcrumb from "@/components/Breadcrumb";
import { AppMain, Settings, MixedSidbar, TagsView, MixedNavbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    RightPanel,
    Settings,
    MixedSidbar,
    TagsView,
    MixedNavbar,
    Hamburger,
    Breadcrumb
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    navbarMode () {
      return this.$store.state.settings.navbarMode
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";
  .breadcrumb-container { display: block !important; padding: 0 15px; line-height: 36px !important; margin: 0 !important; }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  .breadHamburger {
    height: 36px;
    overflow: hidden;
    position: relative;
    // background: #fff;
    .hamburger-container {
      line-height: 36px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    .breadcrumb-container {
      float: left;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .footer-container {
    padding: 42px 16px;
    text-align: center;
    color: rgba(0,0,0,0.65);
    font-size: 14px;
    background: #f0f2f5;
    .footer-links {
      margin-bottom: 8px;
    }
    .footer-copyright {
      color: rgba(0,0,0,.45);
      font-size: 14px;
    }
    
  }
</style>
