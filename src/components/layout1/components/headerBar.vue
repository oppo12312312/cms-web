<template>
  <el-header class="app-header">
    <div class="navbar">
      <div class="sys-name">&nbsp;</div>
      <!-- <img :src="'./static/imgs/sys-name.png'" height="32px" style="margin-left: 236px;"/> -->
      <div class="navbar-right">
        <div>
          <i class="el-icon-user-solid"></i> {{ userInfo.trueName || "" }}
        </div>
        <div style="margin-left: 12px" @click="$refs.dialog.init()">
          修改密码
        </div>
        <!-- <div v-if="userInfo.roles.length > 1">
          <el-dropdown trigger="click">
            <span class="displayIbk">
              {{ userInfo.activeRoleName }}
                <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="max-height: 500px; overflow-y: auto">
                <el-dropdown-item v-for="r in userInfo.roles" :key="r.roleId">
                  <div @click.prevent="switchRole(r)">{{ r.roleName }}</div>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
        <!-- <div v-if="userInfo.loginouturl" @click="casLogout" class="logout"><svg-icon icon-class="logout" /></div>
        <div v-else @click="logout" class="logout"><svg-icon icon-class="logout" /></div> -->
        <div @click="logout" class="logout">
          <svg-icon icon-class="logout" />
        </div>
      </div>

      <reset-password-dialog ref="dialog" />
      <!-- <ul class="navbar-top-links fr cursorPoint">
        <li v-if="userInfo.loginUrl">
          <el-button type="text" @click="goXg(userInfo.loginUrl)">
            <span
              class="el-icon-wrap"
              style="vertical-align:middle;width:20px;height: 20px;border-radius:50%;background:#8F8F8F;"
            >
              <i class="el-icon-s-home" style="color: #fff;line-height:20px;font-size: 12px;"></i>
            </span>
            首页
          </el-button>
        </li>
        <li>
          <el-button type="text">
            <i class="el-icon-user-solid"></i>
            {{ userInfo.trueName || "张三" }}
          </el-button>
        </li>
        <li v-if="userInfo.roles.length">
          <el-dropdown trigger="click">
            <span class="displayIbk">
              <el-button type="text" size="small">
                {{ userInfo.activeRoleName }}
                <i class="el-icon-caret-bottom"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="max-height: 500px; overflow-y: auto">
                <el-dropdown-item v-for="r in userInfo.roles" :key="r.roleId">
                  <div @click.prevent="switchRole(r)">{{ r.roleName }}</div>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li @click="casLogout" v-if="userInfo.loginouturl">
          <el-button type="text">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button>
        </li>
        <li @click="logout" v-else>
          <el-button type="text">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button>
        </li>
      </ul> -->
    </div>
    <div class="tags-view-container">
      <breadcrumb></breadcrumb>
    </div>
  </el-header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import breadcrumb from "./breadcrumb";
import resetPasswordDialog from "./components/resetPasswordDialog.vue";
import themePicker from "_c/themePicker/";
import { getToken } from "@/utils/auth";

export default {
  props: {
    opened: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    breadcrumb,
    resetPasswordDialog,
    themePicker,
  },
  data() {
    return {
      dialogTableVisible: false,
      updatePassFormPosting: false,
    };
  },
  computed: {
    ...mapGetters(["param"]),
    title() {
      return PROJECT.title;
    },
  },
  methods: {
    ...mapActions(["handleLogout", "changeRole"]),
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
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
          // let token = me.getQueryString("token");
          // if (token && me.userInfo.loginouturl) {
          //   window.location.href = me.userInfo.loginouturl;
          // } else {
          //   me.$router.push({
          //     name: "login",
          //   });
          // }
        },
      });
    },
    casLogout() {
      // let me = this;
      // this.alert(`确定退出登录?`, "退出", {
      //   type: "warning",
      //   request: () => {
      //     return this.handleLogout();
      //   },
      //   success(data) {
      //     window.location.href = data.data;
      //   }
      // });
    },
    goXg(url) {
      window.location.href = url;
    },
  },
};
</script>
<style lang="scss">
.sys-name {
  margin-left: 220px;
  font-size: 24px;
  font-family: "Microsoft Yahei";
  letter-spacing: 0px;
  font-weight: bold;
  filter: drop-shadow(rgba(80, 191, 255, 0.06) 0px 0px 8px);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: -webkit-linear-gradient(90deg, #b5efff 0%, #fff 100%);
}
.app-header {
  .navbar {
    height: 66px !important;
    overflow: hidden;
    position: relative;
    color: #fff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    z-index: 1;
    .let-menu {
      font-size: 20px;
      padding-left: 10px;
    }
    .el-button.el-button--text {
      color: #fff;
    }
  }
  .navbar-top-links {
    padding-top: 0 !important;
    li {
      display: inline-block;
      margin-right: 15px;
      line-height: 50px;
    }
  }
  .tags-view-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 0 15px 0 235px;
    background: #f3f4fb;
    .el-breadcrumb {
      padding: 10px !important;
      line-height: 20px;
      /* background: #fff; */
    }
  }
}
</style>
