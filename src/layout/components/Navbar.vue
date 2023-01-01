<template>
  <div class="navbar" :class="{ 'verticalModl': navbarMode ==='vertical' }">
    <hamburger
      v-if="navbarMode === 'vertical'"
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb v-if="navbarMode === 'vertical'" class="breadcrumb-container" />

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
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import Notice from "./Notice";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Notice,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", "device"]),
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
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          // location.reload();
          this.$store.dispatch('GetIamUrl').then(res => {
            if (res.code === 200) {
              window.open(res.data, '_self')
            }
          })
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  &.verticalModl {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }

  .hamburger-container {
    line-height: 46px;
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
