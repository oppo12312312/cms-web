import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import user from "@/store/modules/user.js";
import app from "@/store/modules/app.js";
import opts from "@/store/modules/opts.js";

import servies from "#/router/servies";
import extra from "#/router/extra";

export default new Vuex.Store({
  state: {
    setRouteInfo: (type) => {
      return servies.concat(extra);
    },
  },
  modules: {
    user,
    app,
    opts,
  },
});
