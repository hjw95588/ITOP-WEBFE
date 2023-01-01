<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.horization {
  .app-main {
    // padding-top: 84px;
    padding-top: 0;
    overflow-y: auto;
  }
  &.fixed {
    .app-main { padding-top: 84px; }
  }
  &.hasTagsView.fixed {
    .app-main {
      padding-top: 120px;
      overflow-y: auto;
    }
  }
}
.vertication {
  &.hasTagsView {
    .app-main {
      padding-top: 0;
      overflow-y: auto;
    }
  
    .fixed-header+.app-main {
      padding-top: 84px;
      background: #f0f2f5;
    }
  }
}

.mixedation {
  .fixed-header + .app-main {
    padding-top: 84px;
  }
  &.hasTagsView {
    .fixed-header + .app-main {
      padding-top: 120px;
    }
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
