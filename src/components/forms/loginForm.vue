<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-position="left"
    label-width="0px"
    class="loginForm"
  >
    <slot name="formHeader"></slot>
    <el-form-item prop="account">
      <el-input
        type="text"
        v-model.trim="ruleForm.account"
        @keyup.enter.native="handleSubmit"
        auto-complete="off"
        placeholder="账号"
      >
        <i slot="prefix" class="el-icon-user-solid"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input
        type="password"
        @keyup.enter.native="handleSubmit"
        v-model.trim="ruleForm.checkPass"
        auto-complete="off"
        placeholder="密码"
      >
        <i slot="prefix" class="el-icon-lock"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="kaptcha">
      <el-input
        type="text"
        @keyup.enter.native="handleSubmit"
        v-model.trim="ruleForm.kaptcha"
        auto-complete="off"
        placeholder="验证码"
      >
        <i slot="prefix" class="el-icon-picture"></i>
        <template slot="append">
          <img @click="kaptcha" :src="imgSrc" alt="" />
        </template>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember"
      >记住密码</el-checkbox
    >
    <el-form-item style="width: 100%">
      <el-button
        type="primary"
        style="width: 100%; margin-top: 15px"
        @click.native.prevent="handleSubmit"
        :loading="logining"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from "vuex";
import formMinxin from "./minxins/formMinxin.js";
import CryptoJS from "crypto-js/crypto-js";
import config from "@/config";
import router from "@/router";
import { getOtherToken, setOtherToken } from "@/utils/auth";
import { kaptcha } from "@/api/login";
import { encrypt } from "@/utils/util";
export default {
  mixins: [formMinxin],
  props: {
    crypType: {
      type: String,
      default: null,
    },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
        // } else if (!this.regexSets.passReg.test(value)) {
        //   callback(new Error("用户密码不正确"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      imgSrc: "",
      ruleForm: {
        account: "",
        checkPass: "",
        kaptcha: "",
        kaptchaKey: "",
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        kaptcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      checked: true,
    };
  },
  created() {
    this.kaptcha();
    const user_cookie = this.getCookie("user_cookie")
      ? this.getCookie("user_cookie").toString()
      : "";
    if (user_cookie) {
      const { account, checkPass } = JSON.parse(
        CryptoJS.AES.decrypt(user_cookie, config.secret).toString(
          CryptoJS.enc.Utf8
        )
      );
      this.ruleForm.account = account;
      this.ruleForm.checkPass = checkPass;
    }
  },
  methods: {
    ...mapActions(["handleLogin", "resetViews"]),
    handleSubmit(ev) {
      const me = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true;
          const loginParams = {
            userName: this.ruleForm.account,
            password: this.ruleForm.checkPass,
            subSystem: "",
            kaptcha: this.ruleForm.kaptcha,
            kaptchaKey: this.ruleForm.kaptchaKey,
            //password: this.md5(this.ruleForm.checkPass)
          };
          if (this.crypType == "sm4") {
            // const SM4 = require("gm-crypt").sm4;
            // let sm4Config = {
            //   key: "4120356091247385",
            //   mode: "ecb",
            //   cipherType: "base64"
            // };
            // let sm4 = new SM4(sm4Config);
            // loginParams.password = sm4.encrypt(loginParams.password);
            loginParams.password = encrypt(loginParams.password);
          }
          this.handleLogin(loginParams)
            .then(() => {
              if (this.checked) {
                this.setCookie(
                  "user_cookie",
                  CryptoJS.AES.encrypt(
                    JSON.stringify(this.ruleForm),
                    config.secret
                  ),
                  30
                );
              } else {
                this.setCookie("user_cookie", "");
              }
              // this.resetViews();
              this.$router.push("/");
            })
            .catch((err) => {
              this.kaptcha();
              this.logining = false;
            });
        } else {
          return false;
        }
      });
    },
    kaptcha() {
      kaptcha().then((data) => {
        this.imgSrc = "data:image/jpeg;base64," + data.data.base64;
        this.ruleForm.kaptchaKey = data.data.kaptchaKey;
      });
    },
  },
};
</script>
<style lang="scss">
.loginForm {
  .el-input-group__append {
    padding: 0;
    img {
      height: 30px;
    }
  }
  .remember {
    display: block;
    margin-top: -5px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 45px;
  }
  .el-input__prefix {
    left: 0;
    display: inline-block;
    width: 40px;
    line-height: 40px;
    font-size: 18px;
    border-right: 1px solid #e5e6e7;
  }
}
</style>
