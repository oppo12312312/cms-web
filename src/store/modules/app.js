import {
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
} from "@/utils/sessionStorage";
import { getDeptsListOptions } from "@/filters/options";

const app = {
  state: {
    views: [],
    depts: [],
  },
  mutations: {
    GET_DEPTS: (state, depts) => {
      state.depts = depts;
    },
    ADD_VIEW: (state, view) => {
      const isExist = state.views.filter((item) => {
        return item.name == view.name;
      });
      if (isExist.length) {
        return false;
      } else {
        if (!view.meta.notView) {
          state.views.push({
            name: view.name,
            title: view.meta.title,
          });
        }
      }
    },
    DEL_VIEW: (state, index) => {
      state.views.splice(index, 1);
    },
    CACHE_VIEWS: (state) => {
      setSessionStorage("cache_views", state.views);
    },
  },
  getters: {
    tag_views: (state) => {
      return state.views;
    },
    depts: (state) => {
      return state.depts;
    },
  },
  actions: {
    getDepts({ commit, state }) {
      return new Promise((resolve, reject) => {
        getDeptsListOptions({}).then((data) => {
          commit("GET_DEPTS", data);
          resolve();
        });
      });
    },
    addView({ commit, state }, view) {
      commit("ADD_VIEW", view);
      commit("CACHE_VIEWS");
    },
    delView({ commit }, index) {
      return new Promise((resolve, reject) => {
        commit("DEL_VIEW", index);
        commit("CACHE_VIEWS");
        resolve();
      });
    },
    initView({ commit, state }, cb) {
      const views = getSessionStorage("cache_views");
      const hash = {};

      if (views && views.length) {
        const arr = views.reduce(function (item, next) {
          hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
          return item;
        }, []);
        state.views = arr;
      }
      cb();
    },
    resetViews({ commit, state }) {
      state.views = [];
      setSessionStorage("cache_views", []);
    },
  },
};

export default app;
