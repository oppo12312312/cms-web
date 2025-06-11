import components from "@/components/common/";
import directives from "@/directives";
import * as filters from "@/filters"; // global filters
import "./registerServiceWorker";
import config from "@/config";

import md5 from "js-md5";
import xss from "xss";
import {
  setCookie,
  getCookie,
  msg,
  toast,
  alert,
  confirm,
  isEmptyObject,
  copyObject,
} from "@/utils/util";

import { mapGetters, mapActions } from "vuex";

import { setLocalStore, getStorage } from "@/utils/localStore";

export default {
  install(Vue) {
    //加载公共组件
    Object.keys(components).forEach((key) => {
      var name = key.replace(/(\w)/, (v) => v.toUpperCase()); //首字母大写
      Vue.component(`v${name}`, components[key]);
    });

    //加载公共指令
    Object.keys(directives).forEach((key) => {
      var name = key.replace(/(\w)/, (v) => v.toUpperCase()); //首字母大写
      Vue.directive(`${name}`, directives[key]);
    });
    //注册过滤器
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key]);
    });

    Vue.prototype.$filters = Vue.options.filters;
    //全局混合
    Vue.mixin({
      computed: {
        ...mapGetters(["userInfo", "logined", "depts", "lang_college"]),
      },
      data() {
        return {
          appConfig: config.settings,
        };
      },
      mounted() {
        // this.defaultThemeConfig();
      },
      methods: {
        ...mapActions(["getOpts"]),
        getOptTxt(type, value, name = "label", defaultValue = "暂无") {
          const options = this.$store.getters[type];
          if (!options || options.length == 0) return defaultValue;
          const opt = options.find((v) => v.value == value);
          if (opt) return opt[name];
          return defaultValue;
        },
        defaultThemeConfig() {
          const theme = getStorage("theme");
          this.setTheme(theme);
        },
        setTheme(name) {
          document.getElementsByTagName("body")[0].className = "theme-" + name;
          setLocalStore("theme", name);
        },
        dateTimeRangeFormate(sTime, eTime) {
          return sTime.substr(0, 16) + "至" + eTime.substr(0, 16);
        },
        getQueryString(name) {
          const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          const r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]);
          return null;
        },
        getRid() {
          return Math.random().toString().substr(3, length) + Date.now();
        },
        copy(obj) {
          return JSON.parse(JSON.stringify(obj));
        },
        isEmptyObject(obj) {
          return isEmptyObject(obj);
        },
        copyObject(obj) {
          return copyObject(obj);
        },
        setCookie(key, value, cookieExpires) {
          setCookie(key, value, cookieExpires);
        },
        getCookie(key) {
          return getCookie(key);
        },
        getAccess(access) {
          if (this.$store.state.user.access.indexOf(access.toString()) > -1) {
            return true;
          } else {
            return false;
          }
        },
        md5(pass) {
          return md5(`${pass}`);
        },
        toast(msg, type, opts) {
          toast(msg, type, opts);
        },
        alert(msg, title, opts) {
          alert(msg, title, opts);
        },
        msg(tip, title, opts) {
          msg(tip, title, opts);
        },
        confirm(msg, title, opts) {
          confirm(msg, title, opts);
        },
        xss(con) {
          xss.whiteList["input"] = [
            "type",
            "src",
            "disabled",
            "checked",
            "class",
          ];
          xss.whiteList["p"] = ["style", "class"];
          xss.whiteList["span"] = ["style", "class"];
          xss.whiteList["img"] = [
            "src",
            "alt",
            "title",
            "width",
            "max-width",
            "style",
            "height",
          ];
          xss.whiteList["math"] = [];
          xss.whiteList["semantics"] = [];
          xss.whiteList["mrow"] = [];
          xss.whiteList["mtext"] = [];
          xss.whiteList["annotation"] = ["encoding"];
          xss.whiteList["msub"] = [];
          xss.whiteList["mi"] = [];
          xss.whiteList["mo"] = [];
          xss.whiteList["mn"] = [];
          xss.whiteList["li"] = ["class"];
          xss.whiteList["span"] = ["class", "title", "aria-hidden", "style"];
          xss.whiteList["code"] = [];
          xss.whiteList["li"] = ["class", "id"];
          xss.whiteList["td"] = ["style", "class"];
          xss.whiteList["p"] = ["style", "class"];
          xss.whiteList["div"] = ["style", "class"];
          xss.whiteList["a"] = [
            "style",
            "class",
            "id",
            "target",
            "href",
            "title",
          ];
          return xss(con);
        },
      },
    });
  },
};
