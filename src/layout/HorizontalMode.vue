<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div class="horiHead" :class="{'fixed-header':fixedHeader}">
     <HeadNavbar />
     <breadcrumb class="breadcrumb-container" />
      <tags-view v-if="needTagsView" />
    </div>
    <div :class="{horization: navbarMode === 'horizontal',hasTagsView:needTagsView, fixed: fixedHeader}" class="main-container">
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import Breadcrumb from "@/components/Breadcrumb";
import { AppMain, Settings, TagsView, HeadNavbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    RightPanel,
    Settings,
    TagsView,
    HeadNavbar,
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
        headNavBar: this.navbarMode === 'horizontal',
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
    }
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

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .horiHead {
    transition: width 0.28s;
    // box-shadow: 0 1px 4px rgba(0 21 41 / 0.3);
    padding-top: 50px;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    left: 0;
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
