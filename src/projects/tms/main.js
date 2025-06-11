import Vue from "vue";
import App from "./App.vue";
import router from "#/router";
import ElementUI from "element-ui";
import store from "#/store";

import "animate.css";
import "@/assets/style/basic.scss";
import "@/assets/style/globle.scss";
import "@/assets/style/theme.scss";

// iconfont
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
// import wlGantt from 'wl-gantt';

Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.use(wlGantt)

import installPlugin from "@/plugins";

Vue.use(installPlugin);

import BaiduMap from "vue-baidu-map";

Vue.use(BaiduMap, { ak: "J1pPx3oDyduHiB0CV6gREaylWyCO5j7p" });

import minxins from "@/minxins/";
import "@/icons";

Vue.mixin(minxins);

Vue.prototype.$EventBus = new Vue();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
