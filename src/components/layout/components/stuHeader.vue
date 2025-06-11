<template>
  <el-header class="stu-header" height="260px">
    <div class="navbar clearfix">
      <ul class="navbar-top-links let-menu fl">
        <img src="@p/static/imgs/school_logo.png" style="height: 44px" />
        <span
          style="
            height: 32px;
            line-height: 32px;
            margin-left: 16px;
            padding-left: 16px;
            border-left: 1px solid #d8d8d8;
            font-weight: 400;
            font-size: 16px;
            color: #ffffff;
          "
          >离校管理系统</span
        >
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
          <img
            style="width: 24px; height: 24px; vertical-align: middle"
            class="icon-img"
            src="@p/static/imgs/stu/icon-name.png"
          />
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
          @click="logout"
          v-if="!userInfo.loginUrl && userInfo.title == 'yingxin'"
        >
          <img
            style="width: 24px; height: 24px; vertical-align: middle"
            class="icon-img"
            src="@p/static/imgs/stu/exit.png"
          />
          <!-- <el-button type="text" class="logout-btn">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button> -->
        </li>
        <li
          @click="logout"
          v-if="!userInfo.loginUrl && userInfo.title != 'yingxin'"
        >
          <img
            style="width: 24px; height: 24px; vertical-align: middle"
            class="icon-img"
            src="@p/static/imgs/stu/exit.png"
          />
          <!-- <el-button type="text" class="logout-btn">
            <i class="el-icon-switch-button"></i>
            退出
          </el-button> -->
        </li>
      </ul>
    </div>
    <img
      src="@p/static/imgs/stu/byj.png"
      style="margin-left: 204px; margin-top: 57px; height: 40px"
    />
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
.fn-mt5 {
  margin-top: 5px;
}

.stu-header {
  height: 260px;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  // position: absolute;
  width: 100%;
  left: 0;
  top: 0;

  background: url("~@p/static/imgs/stu/leavingStuIndexBg.png") no-repeat;
  background-size: 100% 100%;

  .navbar {
    height: 80px;
    line-height: 80px;

    .let-menu {
      display: flex;
      height: 80px;
      align-items: center;
      padding-left: 180px;
      color: #fff;
      font-size: 20px;
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
