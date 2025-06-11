import ax from "@/utils/request";
import axios from "axios";

export function kaptcha(data) {
  return ax.request({
    url: `session/kaptcha`,
    method: "post",
    data: data,
  });
}

export function login(data) {
  return ax.request({
    url: `session/login`,
    method: "post",
    data: data,
  });
}

export function otherLogin(data) {
  return ax.request({
    url: `/session/ssoLogin`,
    method: "post",
    data: data,
  });
}

export function changeRole(data) {
  return ax.request({
    url: `changeRole_copy`,
    method: "post",
    data: data,
  });
}

export function getInfo(token) {
  return ax.request({
    url: `user/info`,
    method: "post",
    params: {
      token,
    },
  });
}

export function logout(token) {
  return ax.request({
    url: `/session/loginOut`,
    method: "post",
    params: {
      token: token,
    },
  });
}

export function casLogin(data) {
  return ax.request({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    url: `/session/cas/login`,
    method: "post",
    data: data,
  });
}

export function casLogout(token) {
  return ax.request({
    url: `/session/casLoginOut`,
    method: "post",
    params: {
      token: token,
    },
  });
}

export function getRedisToken() {
  return ax.request({
    url: "/redirect/getRedisToken",
    method: "POST",
  });
}

export function getParam() {
  return ax.request({
    url: `/session/config/getParam`,
    method: "post",
  });
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    // 这里的 "jsonCallBack" ，和调用的 jsonp 的 url 中的 callback 值相对应（见粗体字）

    window.jsonCallBack = (result) => {
      resolve(result);
    };

    const JSONP = document.createElement("script");

    JSONP.type = "text/javascript";

    JSONP.src = url;

    document.getElementsByTagName("head")[0].appendChild(JSONP);

    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP);
    }, 500);
  });
}

export function xgLogout(data, callback) {
  axios.get(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
  });
  // return ax.request({
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  //   },
  //   url: data,
  //   method: 'get'
  // })
}

export function innerLogin(params, data) {
  return ax.request({
    url: `/outApi/innerLogin`,
    method: "post",
    params,
    data,
  });
}
