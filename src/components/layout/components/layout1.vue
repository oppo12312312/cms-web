<template>
  <div class="app-container layout2">
    <header-bar class="app-header" :title="title"></header-bar>
    <el-container
      class="app-content"
      :class="{ 'has-br': !$route.meta.layout }"
    >
      <el-main>
        <!-- <menu-tags></menu-tags> -->
        <transition name="el-fade-in" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headerBar from "./components/headerBar";
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import breadcrumb from "./components/breadcrumb";
import menuTags from "./components/menuTags";
import siderBar from "_c/siderbar";

export default {
  components: {
    headerBar,
    breadcrumb,
    menuTags,
    siderBar,
  },
  props: {
    title: String,
  },
  created() {
    this.init();
  },
  mounted() {
    //this.initView(() => this.addTags());
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      sidebar: {
        opened: true,
      },
      activeIndex: "",
    };
  },
  computed: {
    ...mapGetters(["subsysList", "services"]),
  },
  watch: {
    screenWidth(val) {},
    // $route() {
    //   this.init();
    // },
  },
  methods: {
    init() {
      // let activeIndex = 0;
      // if (this.$route.meta.sys) {
      //   activeIndex = this.$route.meta.sys;
      // }
      // this.setServices(activeIndex);
      // this.activeIndex = this.subsysList[activeIndex].sysId;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.app-container {
  position: relative;
  height: 100%;
  width: 100%;
  margin-bottom: 15px;
  .app-header {
    width: 100%;
    transition: 0.28s;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .app-content {
    min-height: 100%;
    -webkit-transition: margin-left 0.28s;
    transition: margin-left 0.28s;
    position: relative;
    padding: 75px 15px 15px 15px;

    .el-main {
      width: 100%;
      overflow: hidden;
      padding: 0px;
    }
  }
  &.hideSidebar {
    .app-siderbar {
      padding-top: 0px;
      .el-menu {
        background: transparent;
        .el-menu-item {
        }
        .el-submenu {
        }
      }
    }
    .app-content {
      .el-main {
        position: relative;
      }
    }
  }
}

.app-container.layout2 {
  .app-content {
    &.has-br {
      padding: 120px 15px 15px 15px;
    }
  }
}
.app-container.layout1 {
  position: relative;
  height: 100%;
  width: 100%;
  margin-bottom: 15px;
  .tags-view-container {
    margin-top: 60px;
  }
  .subsys-header {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 99;
  }
  .app-siderbar {
    top: 120px !important;
    height: calc(100% - 120px) !important;
  }
  .app-content {
    min-height: 100%;
    -webkit-transition: margin-left 0.28s;
    transition: margin-left 0.28s;
    margin-left: 220px;
    position: relative;
    padding: 150px 0px 15px 0px;
    background: #f5f3fb;

    .el-main {
      width: 100%;
      overflow: hidden;
      padding: 15px;
    }
  }
}
</style>
