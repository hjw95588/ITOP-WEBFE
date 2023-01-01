<template>
  <div id="navbarer" class="navbar" :class="{ 'mixedModl': navbarMode ==='mixed' }">
    <el-menu
      mode="horizontal"
      @select="handleMenuItem"
    >
      <el-menu-item v-for="route in headNavList" :key="route.path" :index="route.path">
        <item :icon="route.meta.icon||(route.meta&&route.meta.icon)" :title="route.meta.title" />
      </el-menu-item>
      <!-- <el-menu-item index="2">工作台</el-menu-item>
      <el-menu-item index="3">系统管理</el-menu-item>
      <el-menu-item index="4">系统监控</el-menu-item>
      <el-menu-item index="5">系统工具</el-menu-item>
      <el-menu-item index="6">参数配置</el-menu-item> -->
    </el-menu>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <notice></notice>

      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <div class="user-name">
            <span>{{ name }}</span>
          </div>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Item from './Item'
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import Notice from "../Notice";

export default {
  components: {
    Screenfull,
    SizeSelect,
    Search,
    Notice,
    Item
  },
  data() {
    return {
      headNavList: [] // 顶部栏数据
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "device", 'permission_routes']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
    navbarMode () {
      return this.$store.state.settings.navbarMode
    }
  },
  mounted () {
    const filterNav = this.permission_routes.filter(item => !item.hidden)
    this.headNavList = filterNav.filter(item => item.name && item.meta)
    const initRoute = filterNav.filter(item => !item.name)
    this.$store.commit('SET_SIDE_ROUTES', initRoute)
  },
  methods: {
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          // location.reload()
          this.$store.dispatch('GetIamUrl').then(res => {
            if (res.code === 200) {
              window.open(res.data, '_self')
            }
          })
        });
      });
    },
    // 点选顶栏
    handleMenuItem (key) {
      const sideFiltRoute = this.headNavList.filter(item => item.path === key)
      const sideRoute = sideFiltRoute[0].children.map(item => ({
        ...item,
        path: `${key}/${item.path}`
      }))
      this.$store.commit('SET_SIDE_ROUTES', sideRoute)
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 50px;
  overflow: hidden;
  position: relative;
  z-index: 3;
  background: #fff;
  &.mixedModl {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  .el-menu.el-menu--horizontal {
    height: 100%;
    flex: 1;
    border: 0;
    &>.el-menu-item { height: 100%; line-height: 50px;}
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 5px;
      height: 100%;
      font-size: 22px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 5px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0;
        cursor: pointer;
        transition: all 0.3s;

        .user-avatar {
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 10px;
        }
        .user-name {
          font-size: 15px;
          vertical-align: middle;
          margin-left: 5px;
          font-weight: 300;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
