<template>
  <div class="app-container layout-l" :class="{ hideSidebar: !sidebar.opened }">
    <header-bar
      @toggleSidebar="toggleSidebar"
      :title="title"
      :opened="sidebar.opened"
      style="z-index: 1"
    ></header-bar>
    <sider-bar
      v-if="!(subSystem.sysType == 'third' && subSystem.sysAction)"
      class="app-siderbar"
      :opened="sidebar.opened"
    ></sider-bar>
    <el-container
      v-if="!(subSystem.sysType == 'third' && subSystem.sysAction)"
      class="app-content"
    >
      <transition name="el-fade-in" mode="out-in">
        <el-main>
          <router-view></router-view>
        </el-main>
      </transition>
    </el-container>
    <div
      v-if="
        (subSystem.sysType == 'third' && subSystem.sysAction) ||
        subSystem.sysId == 'czda'
      "
      class="third-iframe"
    >
      <iframe :src="iframeUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import siderBar from "./components/siderBar";
import headerBar from "./components/headerBar";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { getToken } from "@/utils/auth";
import { getRedisToken } from "@/api/login";
import {
  getSessionStorage,
  removeSessionStorage,
} from "@/utils/sessionStorage";

export default {
  components: {
    siderBar,
    headerBar,
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      sidebar: {
        opened: true,
      },
      inIframe: false,
      iframeUrl: "",
    };
  },
  created() {
    // if(window.parent.document.getElementById("Ateon-SetParent-iframe")){
    //   this.inIframe = this.getIframeQueryString('xg',"Ateon-SetParent-iframe");
    // }
  },
  mounted() {
    // 监听窗口大小
    this.changeSider();
    this.changeSiderBar();
    window.onresize = () => {
      if (!this.$route.meta.closeSidebar) {
        return (() => {
          this.screenWidth = document.body.clientWidth;
        })();
      }
    };
  },
  computed: {
    ...mapGetters(["logined", "subSystem", "param"]),
    title() {
      return this.param.systemName || PROJECT.title;
    },
    // iframeUrl() {
    //   return this.subSystem.sysAction + '?baseToken=' + getToken();
    // }
  },
  watch: {
    screenWidth(val) {
      this.changeSider();
    },
    $route() {
      this.changeSiderBar();
    },
    subSystem() {
      this.checkThird();
    },
    userInfo() {
      this.checkThird();
    },
  },
  created() {
    this.checkThird();
  },
  methods: {
    checkThird() {
      if (this.subSystem.sysType == "third" && this.subSystem.sysAction) {
        if (this.subSystem.sysId == "sg") {
          this.iframeUrl =
            this.subSystem.sysAction + "?baseToken=" + getToken();
        } else {
          getRedisToken().then((res) => {
            this.iframeUrl = this.subSystem.sysAction + "?token=" + res.data;
          });
        }
      } else if (this.subSystem.sysId == "czda") {
        this.iframeUrl =
          "http://36.111.184.76:9292/grow/?token=" +
          getToken() +
          "&id=czda#/home";
      }
    },
    ...mapActions(["getUserInfo"]),
    changeSiderBar() {
      if (this.$route.meta.closeSidebar) {
        this.sidebar.opened = false;
      } else {
        this.sidebar.opened = true;
      }
    },
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened;
    },
    changeSider() {
      if (this.screenWidth < 960) {
        this.handleClose();
      } else {
        this.handleOpen();
      }
    },
    handleOpen() {
      this.sidebar.opened = true;
    },
    handleClose() {
      this.sidebar.opened = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$light-color: #24386a;
$background-color: #22272d;
$ul-background: #000;
.app-container.layout-l {
  position: relative;
  height: 100%;
  width: 100%;
  background: #f3f4fb;
  .app-header {
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: 0.28s;
    .webTitle {
      color: #fff;
      line-height: 50px;
      font-size: 20px;
      padding: 0 0 0 20px;
      letter-spacing: 2px;
      font-weight: 600;
    }
  }
  .app-siderbar {
    transition: width 0.28s;
    width: 220px !important;
    background-color: #005767;
    color: #fff;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow-y: auto;
    .el-submenu {
      .el-submenu__title {
        color: #f5f5f5;
        padding-left: 10px !important;
        height: 44px !important;
        line-height: 44px !important;
        &:hover {
          background-color: $background-color;
          color: $light-color;
          i:first-child {
            color: $light-color;
          }
        }
        & + .el-menu {
          background-color: $ul-background;
          .el-menu-item {
            &.is-active {
              background: $light-color;
              color: #fff;
              font-weight: 600;
            }
          }
        }
        i {
          color: #f5f5f5;
          &.el-submenu__icon-arrow {
            font-size: 14px;
          }
        }
      }
      &.is-opened {
        .el-submenu__title {
          background-color: $background-color;
          color: #fff;
          font-weight: 600;
          i:first-child {
            color: #f5f5f5;
          }
        }
      }
      .el-menu {
        padding: 0;
        .el-menu-item {
          padding-left: 38px !important;
          padding-right: 15px;
          height: 40px !important;
          line-height: 40px !important;
        }
      }
    }
    .el-menu {
      background-color: $background-color;
      border-right: 0;
      padding: 10px 0;
      .el-submenu__title:focus {
        color: $light-color;
      }
      .el-menu-item {
        color: #f5f5f5;
        padding-left: 10px !important;
        height: 44px !important;
        line-height: 44px !important;
        &:focus {
          color: $light-color;
        }
        &:hover {
          color: $light-color;
          background: transparent;
        }
        &.is-active {
          color: $light-color;
          font-weight: 600;
          background-color: $background-color;
        }
      }
    }
  }
  .app-content {
    height: 100%;
    -webkit-transition: margin-left 0.28s;
    transition: margin-left 0.28s;
    margin-left: 220px;
    position: relative;
    // padding-top: 75px;
    // padding-bottom: 15px;
    background: #f5f3fb;
    padding: 106px 0 15px;

    .el-main {
      width: 100%;
      overflow: hidden;
      padding: 0 15px 0;
    }
  }
  &.hideSidebar {
    .app-siderbar {
      width: 64px !important;
      padding-top: 0px;
      .el-menu {
        background: transparent;
        .el-submenu {
          .el-submenu__title {
            padding-left: 20px !important;
          }
        }
      }
    }
    .tags-view-container {
      padding: 0 15px 0 15px;
    }

    .app-header {
      //padding-left: 64px;
    }
    .tags-view-container {
      padding-left: 80px;
    }
    .app-content {
      margin-left: 64px;
      .el-main {
        position: relative;
      }
    }
  }
}
// when menu collapsed
.el-menu--vertical {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-menu-item {
    background: $background-color;
    color: #f5f5f5;
    &:hover {
      color: $light-color;
      background: $background-color;
    }
  }
}
.third-iframe {
  position: absolute;
  top: 60px;
  width: 100vw;
  height: calc(100vh - 60px);
  z-index: 1002;
  overflow: hidden;
  iframe {
    margin-top: -60px;
    width: 100vw;
    height: calc(100vh);
  }
}
.app-content-hide-layout {
  padding: 16px !important;
  margin: 60px 0 0 0 !important;
}
</style>
