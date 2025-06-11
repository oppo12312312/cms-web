import {
  login,
  casLogin,
  logout,
  casLogout,
  otherLogin,
  changeRole,
  getParam,
  innerLogin,
} from "@/api/login";
import { getToken, setToken, removeToken, getRoutes } from "@/utils/auth";
import { copyObject, getQueryString } from "@/utils/util";
import {
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
} from "@/utils/sessionStorage";
import router from "#/router";
import { resetRouter } from "@/router";
import { route404 } from "@/router/commonRoutes";
import asyncRoutes from "#/router/routes";
import store from "#/store";

function logined(data, commit, cb) {
  const userInfo = {
    name: data.userName,
    trueName: data.trueName,
    roles: data.roles || [],
    activeRole: data.activeRole,
    roleType: data.roleType,
    userId: data.userId,
    deptid: data.deptid,
    activeRoleName: data.activeRoleName,
    loginUrl: data.loginurl,
    loginouturl: data.loginouturl,
  };
  setToken(data.token);
  commit("SET_LOGINED", true);
  commit("SET_TOKEN", data.token);
  commit("SET_USERINFO", userInfo);
  setSessionStorage("userInfo", userInfo);
  // commit('SET_SUBSYSTEM', data.subsysList[0] || {});
  commit("SET_SUBLIST", data.list);
  setSessionStorage("subsysList", data.list);
  if (cb) {
    cb();
  }
}

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    routeInfo: [],
    logined: false,
    servies: [],
    subsysList: [],
    subSystem: {},
    param: {},
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_LOGINED: (state, logined) => {
      state.logined = logined;
    },
    SET_ROUTEINFO: (state, routeInfo) => {
      let newRoutes = [];
      const addRoutes = copyObject(asyncRoutes);
      // if (state.userInfo.activeRole == 'student') {
      //   addRoutes = copyObject(stuRoutes);
      // }
      const routes = store.state.setRouteInfo();
      newRoutes = getRoutes(routes, routeInfo);
      addRoutes.children = addRoutes.children.concat(newRoutes);
      router.addRoutes([addRoutes]);
      router.addRoutes(route404);
      state.routeInfo = addRoutes.children;

      state.servies = newRoutes;
    },
    SET_SUBLIST: (state, routeInfo) => {
      let newRoutes = [];
      const addRoutes = copyObject(asyncRoutes);

      const routes = store.state.setRouteInfo();
      newRoutes = getRoutes(routes, routeInfo);
      addRoutes.children = addRoutes.children.concat(newRoutes);
      router.addRoutes([addRoutes]);
      router.addRoutes(route404);
      state.routeInfo = addRoutes.children;

      state.servies = newRoutes;
      state.subsysList = routeInfo;
    },
    SET_SERCIVES: (state, index) => {
      if (state.subsysList[index].sysType == "third") {
        setSessionStorage("baseUrl", state.subsysList[index].sysService);
      } else {
        removeSessionStorage("baseUrl");
      }
      state.servies = state.subsysList[index].children;
    },
    SET_SUBSYSTEM: (state, subSystem) => {
      setSessionStorage("subSystem", subSystem);
      state.subSystem = subSystem;
    },
    SET_PARAM: (state, param) => {
      state.param = param;
    },
  },
  getters: {
    permission_routes: (state) => {
      return state.routeInfo;
    },
    userInfo: (state) => {
      return state.userInfo;
    },
    logined: (state) => {
      return state.logined;
    },
    services: (state) => {
      return state.servies;
    },
    subsysList: (state) => {
      return state.subsysList;
    },
    subSystem: (state) => {
      return state.subSystem;
    },
    param: (state) => {
      return state.param;
    },
    lang_college: (state) => {
      return state.param.schoolCode == "whetc" ? "系部" : "学院";
    },
    isXX: (state) => {
      return state.userInfo.roleType == "xx";
    },
    // 首页是否展示活动统计页面
    showStat: (state) => {
      // /activityStat
      const flatMenus = (menus) => {
        return menus.flatMap((v) => [
          v,
          ...(v.children ? flatMenus(v.children) : []),
        ]);
      };
      const list = state.subSystem?.list || [];
      return flatMenus(list).some((v) => v.url == "/activity_homepage");
    },
  },
  actions: {
    // 获取config
    getParam({ commit, state }, param) {
      // getParam().then(res => {
      //   document.getElementsByTagName('body')[0].className = 'theme-' + (res.data?.themecode || 'default');
      //   document.title = res.data?.systemName;
      //   // document.getElementsByTagName('body')[0].className = 'theme-' + ('purple');
      //   res.data.type = getQueryString('type')
      //   commit('SET_PARAM', res.data || {});
      // });
    },
    // 登录
    handleLogin({ commit, state }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            localStorage.setItem("cas", false);
            logined(response.data, commit, () => {
              resolve();
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    casLogin({ commit, state }, userInfo) {
      return new Promise((resolve, reject) => {
        casLogin(userInfo)
          .then((response) => {
            localStorage.setItem("cas", true);
            logined(response.data, commit, () => {
              resolve();
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    changeRole({ commit, state }, role) {
      return new Promise((resolve, reject) => {
        changeRole({
          token: state.token,
          roleId: role.roleId,
          subSystem: "",
        })
          .then((response) => {
            resetRouter(router);
            const { data } = response;
            logined(response.data, commit, () => {
              resolve();
            });
            // if (data.list.length) {
            //   logined(response.data, commit, () => {
            //     resolve()
            //   });
            // }else{
            //   toast('该角色没有权限进入系统', 'warning')
            //   reject(error);
            // }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const userInfo = getSessionStorage("userInfo");
        const routeInfo = getSessionStorage("routeInfo");
        const subsysList = getSessionStorage("subsysList");
        if (userInfo) {
          commit("SET_LOGINED", true);
          commit(
            "SET_SUBSYSTEM",
            subsysList.find(
              (s) => s.sysId == (getQueryString("id") || "activity")
            ) ||
              subsysList[0] ||
              getSessionStorage("subSystem") ||
              {}
          );
          commit("SET_USERINFO", userInfo);
          commit("SET_SUBLIST", subsysList);
          resolve();
        } else {
          reject();
        }
      });
    },
    otherLogin({ commit, state }, query) {
      return new Promise((resolve, reject) => {
        if (query.type == "inner") {
          innerLogin(
            { Authorization: query.token },
            {
              token: query.token,
              subSystem: getQueryString("id") || "activity",
            }
          )
            .then((response) => {
              const { data } = response;
              const userInfo = {
                name: data.userName,
                trueName: data.trueName,
                roles: data.roles || [],
                activeRole: data.activeRole,
                roleType: data.roleType,
                loginUrl: data.loginurl,
                loginouturl: data.loginouturl,
                title: PROJECT.subSystem,
                userId: data.userId,
                deptid: data.deptid,
                activeRoleName: data.activeRoleName,
              };
              if (data.token) {
                setToken(data.token);
                commit("SET_LOGINED", true);
                commit("SET_TOKEN", data.token);
                commit("SET_USERINFO", userInfo);
                setSessionStorage("userInfo", userInfo);
                commit(
                  "SET_SUBSYSTEM",
                  data.subsysList.find(
                    (s) => s.sysId == (getQueryString("id") || "activity")
                  ) ||
                    data.subsysList[0] ||
                    {}
                );
                commit("SET_SUBLIST", data.subsysList);
                // setSessionStorage('subsysList', data.subsysList);
                resolve();
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          otherLogin(query)
            .then((response) => {
              const { data } = response;
              const userInfo = {
                name: data.userName,
                trueName: data.trueName,
                roles: data.roles || [],
                activeRole: data.activeRole,
                roleType: data.roleType,
                loginUrl: data.loginurl,
                loginouturl: data.loginouturl,
                title: PROJECT.subSystem,
                userId: data.userId,
                deptid: data.deptid,
                activeRoleName: data.activeRoleName,
              };
              if (data.token) {
                setToken(data.token);
                commit("SET_LOGINED", true);
                commit("SET_TOKEN", data.token);
                commit("SET_USERINFO", userInfo);
                setSessionStorage("userInfo", userInfo);
                commit(
                  "SET_SUBSYSTEM",
                  data.subsysList.find(
                    (s) => s.sysId == (getQueryString("id") || "activity")
                  ) ||
                    data.subsysList[0] ||
                    {}
                );
                commit("SET_SUBLIST", data.subsysList);
                // setSessionStorage('subsysList', data.subsysList);
                resolve();
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    },
    // 登出
    handleLogout({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem("cas") === "true") {
          casLogout(state.token)
            .then((res) => {
              removeToken();
              commit("SET_LOGINED", false);
              removeSessionStorage("routeInfo");
              removeSessionStorage("userInfo");
              resetRouter(router);
              window.location.href = res.data;
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          logout(state.token)
            .then((res) => {
              removeToken();
              commit("SET_LOGINED", false);
              removeSessionStorage("routeInfo");
              removeSessionStorage("userInfo");
              resetRouter(router);
              window.location.reload();
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    },
    setServices({ commit, state }, index) {
      commit("SET_SERCIVES", index);
    },
    setSubSystem({ commit, state }, subSystem) {
      commit("SET_SUBSYSTEM", subSystem);
    },
  },
};

export default user;
