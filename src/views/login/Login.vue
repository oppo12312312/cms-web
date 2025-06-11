<template>
  <div class="login-bg">
    <div class="login-bg login-container">
      <div class="login-wrapper clearfix">
        <!-- <img :src="'./static/imgs/logo.webp'" height="80px" class="logo" style="margin-left:14px;margin-bottom: 8px;"/> -->
        <div class="fn-fl">
          <img src="@p/static/imgs/login_left.png" class="login-left-png" />
        </div>
        <div class="fn-fr fn-pt05 input-wrap">
          <p class="normal-md-font fn-mt00 fn-mb00" style="color: #334150">
            欢迎登录
          </p>
          <login-form crypType="sm4">
            <div
              slot="formHeader"
              class="subsystem-tit bold"
              style="margin-bottom: 20px"
            >
              {{ title }}
            </div>
          </login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken, removeToken } from "@/utils/auth"; // set token to cookie
import loginForm from "_c/forms/loginForm";
import { mapGetters } from "vuex";
// 绑定用户
export default {
  name: "Login",
  components: {
    loginForm,
  },
  computed: {
    ...mapGetters(["param"]),
    title() {
      return PROJECT.title;
    },
  },
};
</script>
<style lang="scss">
.login-bg {
  width: 100%;
  height: 100%;
  background: #eff7fe;
}
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.login-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: #fff;
  width: 810px;
  padding: 80px 40px 60px 70px;
  box-sizing: border-box;
  border-radius: 10px;
  .logo {
    position: absolute;
    top: 64px;
    left: calc(50% + 36px);
  }
  .login-left-png {
    width: 350px;
  }
  .input-wrap {
    width: 310px;
    position: relative;
    margin-top: 30px;
    .login-input {
      width: 100%;
      font-size: 14px;
      line-height: 30px;
      padding: 10px 20px 10px 60px;
      border: none;
      background: #f3f3f3;
      box-sizing: border-box;
      height: 50px;
    }
    .login-icon-wrap {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 20px;
      top: 15px;
      text-align: center;
    }
    &.identifycode-wrap {
      .login-input {
        width: 60%;
      }
      .identify-code {
        width: 33%;
        float: right;
        background: #f3f3f3;
        height: 50px;
      }
    }
  }
}

.login-btn-wrap {
  padding: 50px 18px 0;
  position: relative;
}
.login-btn-wrap {
  #msg {
    position: absolute;
    left: 0;
    top: 5px;
    font-size: 12px;
    line-height: 20px;
    color: #ff0000;
  }
  .login-btn {
    width: 100%;
    border: none;
    border-radius: 10px;
    background: #24386a;
    text-align: center;
    padding: 12px 0;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    letter-spacing: 1em;
  }
}
@media screen and (min-width: 1440px) {
  .login-wrapper {
    width: 890px;
    padding: 130px 60px 110px 90px;
  }
  .login-wrapper .login-left-png {
    width: 380px;
  }
  .login-wrapper .input-wrap {
    width: 330px;
  }
}
/* .login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  .login-box {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    .el-input {
      // input {
      //   background: transparent;
      //   border: 0;
      //   -webkit-appearance: none;
      //   border-radius: 0;
      // }
    }
  }
} */
</style>
