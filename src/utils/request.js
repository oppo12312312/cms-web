import axios from "axios";
import router from "@/router";
import { toast, hashcode } from "./util";
import config from "@/config";
import { getToken, removeToken } from "@/utils/auth";
import {
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
} from "@/utils/sessionStorage";
import { remove } from "js-cookie";
const baseUrl =
  process.env.NODE_ENV === "production"
    ? document.location.protocol +
      "//" +
      location.host +
      "/" +
      config.baseUrl.pro
    : config.baseUrl.dev;

class HttpRequest {
  constructor() {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const sUrl = getSessionStorage("baseUrl");
    const config = {
      baseURL: sUrl ? sUrl : this.baseUrl,
      //withCredentials: true,
      timeout: 60000 * 5,
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
    };
    return config;
  }
  distroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        const token = getToken() ? getToken() : "";
        if (token) {
          // Bearer是JWT的认证头部信息
          config.headers["authorization"] = token;
          config.headers["Access-Control-Allow-Origin"] = "*";
        }
        if (config.formid) {
          config.headers["repeatSubmitId"] = hashcode(
            JSON.stringify(config.data || config.parmas)
          );
        }
        // console.log(hashcode(config.data))
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.distroy(url);
        const { data } = res;
        // 二进制数据则直接返回
        const responseType = res.request?.responseType;
        if (responseType === "blob" || responseType === "arraybuffer")
          return res;
        if (data.code) {
          switch (data.code) {
            case 200:
              return data;
              break;
            case 203:
              return data;
              break;
            case 401:
              removeToken();
              toast("系统检查到您长时间未操作，请重新登录", "warning");
              location.reload();
              break;
            case 403:
              removeToken();
              toast("系统检查到您长时间未操作，请重新登录", "warning");
              location.reload();
              break;
            case 500:
              toast(data.msg, "warning");
              return Promise.reject(data);
              break;
            default:
              toast(data.msg, "warning");
              break;
          }
        } else {
          return data;
        }
      },
      (err) => {
        this.distroy(url);
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = "请求错误";
              break;

            case 401:
              err.message = "未授权，请登录";
              break;

            case 403:
              err.message = "拒绝访问";
              break;

            case 404:
              err.message = `请求地址出错`;
              break;

            case 408:
              err.message = "请求超时";
              break;

            case 500:
              err.message = "服务器内部错误";
              break;

            case 501:
              err.message = "服务未实现";
              break;

            case 502:
              err.message = "网关错误";
              break;

            case 503:
              err.message = "服务不可用";
              break;

            case 504:
              err.message = "网关超时";
              break;

            case 505:
              err.message = "HTTP版本不受支持";
              break;
          }
          if (err.response.status == 403) {
            toast("您没有权限访问该页面", "warning");
            router.push({ name: "403" });
          } else if (err.response.status == 405) {
            toast("登录过期,请重新登录", "warning");
            removeToken();
            location.reload();
          } else {
            toast(err.message, "error");
          }
        }
        //var originalRequest = error.config;//重连设置
        if (
          err.code == "ECONNABORTED" &&
          err.message.indexOf("timeout") != -1
        ) {
          // originalRequest._retry = true
          // return axios.request(originalRequest);
          toast("请求超时，请刷新页面", "error");
        }
        return Promise.reject(err);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

export default new HttpRequest(baseUrl);
