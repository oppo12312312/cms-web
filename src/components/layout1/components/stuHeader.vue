<template>
  <el-header class="stu-header">
    <div class="navbar clearfix">
      <ul class="navbar-top-links let-menu fl">
        <img src="@p/static/imgs/school_logo.png" class="fn-mt10" />
      </ul>
      <ul class="navbar-top-links fr cursorPoint fc-white">
        <li v-if="userInfo.loginUrl">
          <el-button type="text" @click="goXg(userInfo.loginUrl)">
            <span
              class="el-icon-wrap"
              style="
                vertical-align: middle;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #8f8f8f;
              "
            >
              <i
                class="el-icon-s-home"
                style="color: #fff; line-height: 20px; font-size: 12px"
              ></i>
            </span>
            <span style="color: #fff">主页</span>
          </el-button>
        </li>
        <li>
          <img class="icon-img" src="@p/static/imgs/stu/icon-name.png" />
          {{ userInfo.trueName || "张三" }}
        </li>
        <!--  <li>
          <el-dropdown trigger="click">
            <span class="displayIbk">
              <el-button type="text" class="fc-white">
                <img class="icon-img" src="@p/static/imgs/switch.png" />
                切换角色
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div>
                  <i class="fa fa-user"></i>
                  修改密码
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div>
                  <i class="fa fa-sign-out"></i>
                  退出登录
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li> -->
        <li
          @click="casLogout"
          v-if="!userInfo.loginUrl && userInfo.title == 'yingxin'"
        >
          <el-button type="text" class="logout-btn">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button>
        </li>
        <li
          @click="logout"
          v-if="!userInfo.loginUrl && userInfo.title != 'yingxin'"
        >
          <el-button type="text" class="logout-btn">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button>
        </li>
      </ul>
    </div>
  </el-header>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    opened: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      updatePassFormPosting: false,
    };
  },
  methods: {
    ...mapActions(["handleLogout"]),
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
    casLogout() {
      const me = this;
      this.alert(`确定退出登录?`, "退出", {
        type: "warning",
        request: () => {
          return this.handleLogout();
        },
        success(data) {
          window.location.href = data.data;
        },
      });
    },
    goXg(url) {
      window.location.href = url;
    },
  },
};
</script>
<style lang="scss">
.stu-header {
  height: 60px;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  .navbar {
    .let-menu {
      color: #fff;
      font-size: 20px;
      padding-left: 10px;
    }
  }
  .navbar-top-links {
    li {
      display: inline-block;
      margin-right: 15px;
      line-height: 60px;
    }
  }
  .tags-view-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    background: #fff;
    padding: 10px;
  }
}
.logout-btn.el-button {
  color: #fff;
}
</style>
