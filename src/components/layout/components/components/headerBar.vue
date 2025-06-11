<template>
  <el-header class="app-header">
    <div class="navbar">
      <div class="fl">
        <h1 class="webTitle fl">
          <el-image
            :src="require('@p/static/imgs/logo_yz.png')"
            fit="fill"
          ></el-image>
          <div class="disIbk">
            <p class="txt-grey txt-small">Community</p>
            <h5>一站式管理工作平台</h5>
          </div>
        </h1>
        <el-menu
          :default-active="defaultActive"
          class="el-menu-demo fl"
          mode="horizontal"
        >
          <el-menu-item
            v-for="(menu, index) in menuList"
            :index="resolvePath(menu.redirect ? menu.redirect : menu.path)"
            :key="index"
            @click="goMenu($event, menu)"
          >
            {{ menu.meta.title }}
          </el-menu-item>
        </el-menu>
      </div>

      <ul class="navbar-top-links fr cursorPoint">
        <!-- <li class="input-search">
          <el-input
            placeholder="请输入内容"
            v-model="key"
            
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </li> -->
        <li v-if="appConfig.themeSet">
          <theme-picker></theme-picker>
        </li>
        <li v-if="userInfo.roles.length">
          <el-dropdown trigger="click">
            <span class="displayIbk">
              <el-button type="text">
                {{ userInfo.activeRoleName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="r in userInfo.roles" :key="r.roleId">
                <div @click.prevent="switchRole(r)">
                  {{ r.roleName }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown trigger="click">
            <span class="avatar-wrap">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              ></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click.prevent="logout()">退出</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <div class="tags-view-container" v-if="!$route.meta.layout">
      <breadcrumb></breadcrumb>
    </div>
  </el-header>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import { isExternal } from "@/utils/util";
import path from "path";
import breadcrumb from "_c/layout1/components/breadcrumb";

import themePicker from "_c/themePicker/";

export default {
  components: {
    themePicker,
    breadcrumb,
  },
  data() {
    return {
      dialogTableVisible: false,
      updatePassFormPosting: false,
      defaultActive: "",
      key: "",
    };
  },
  computed: {
    ...mapGetters(["permission_routes", "services"]),
    menuList: function () {
      const routes = this.permission_routes.filter((item) => {
        return !item.meta.hidden && item.meta.headerMenu;
      });

      return routes;
    },
  },
  created() {
    this.defaultActive = this.activeMenu();
  },
  methods: {
    ...mapActions(["handleLogout", "changeRole", "resetViews"]),
    switchRole(r) {
      if (this.userInfo.activeRole == r.roleId) {
        this.toast("已是当前角色", "warning");
        return;
      }

      const me = this;
      this.alert(`确定切换到角色${r.roleName}?`, "切换角色", {
        type: "warning",
        request: () => {
          return this.changeRole(r);
        },
        success() {
          me.toast("切换成功", "success");
          //me.resetViews();
          me.$router.push({
            name: "home",
          });
        },
      });
    },
    logout() {
      const me = this;
      this.alert(`确定退出登录?`, "退出", {
        type: "warning",
        request: () => {
          return this.handleLogout();
        },
        success() {
          const token = me.getQueryString("token");
          if (token && me.userInfo.loginouturl) {
            window.location.href = me.userInfo.loginouturl;
          } else {
            me.$router.push({
              name: "login",
            });
          }
        },
      });
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return path.resolve("", routePath);
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    goMenu(e, menu) {
      this.$router.push({
        name: menu.name,
      });
    },
  },
};
</script>

<style lang="scss">
.avatar-wrap {
}
</style>
