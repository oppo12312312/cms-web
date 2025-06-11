<template>
  <div class="sider-bar-c">
    <div class="logo">
      <!-- <img :src="'./static/imgs/logo.png'" height="45px" width="200px"/> -->
      采食家平台
    </div>

    <div class="menu-c">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          class="el-menu-vertical"
          :unique-opened="true"
          :collapse="isCollapse"
          mode="vertical"
          :default-active="activeMenu"
          :collapse-transition="false"
          background-color="#005767"
          text-color="#fff"
          active-text-color="#FF8D1A"
        >
          <sidebar-item
            v-for="route in permission_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            :opened="opened"
          ></sidebar-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import sidebarItem from "./components/sidebarItem";
import { mapGetters } from "vuex";

export default {
  props: {
    opened: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
    },
  },
  components: {
    sidebarItem,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    isCollapse() {
      return !this.opened;
    },
  },
};
</script>
<style lang="scss" scoped>
.sider-bar-c {
  display: flex;
  flex-direction: column;
}
.logo {
  width: 280px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 24px;
  margin-left: -32px;
}
.menu-c {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background-image: url(~@p/static/imgs/tuxing.png);
  background-size: 220px 178px;
  background-repeat: no-repeat;
  background-position: bottom;
  margin-top: -5px;
}
//滚动条
.menu-c::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #005767;
}

/*定义滚动条轨道 内阴影+圆角*/

.menu-c::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0);
}

/*定义滑块 内阴影+圆角*/

.menu-c::-webkit-scrollbar-thumb {
  border-radius: 8px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #23fffc;
}
</style>
