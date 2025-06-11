import Cookies from "js-cookie";
import gmCrypt from "gm-crypt";
// cookie保存的天数
import config from "@/config";

import { Message, MessageBox } from "element-ui";
import { Promise } from "q";

export const TOKEN_KEY = "token";

export const setCookie = (key, value, cookieExpires) => {
  // Cookies.set(key, value, {
  //   expires: cookieExpires || 1
  // })
  sessionStorage.setItem(key, value);
};

export const getCookie = (key) => {
  // return Cookies.get(key)
  return sessionStorage.getItem(key);
};

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: config.cookieExpires || 1,
  });
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};

export const getQueryString = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = (
    window.location.search
      ? window.location.search.substr(1)
      : window.location.href.split("?")[1] || ""
  ).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 1. 是否为对象；
export function isObject(obj) {
  return Object.prototype.isPrototypeOf(obj);
}

// 2. 是否为空对象；
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

export function copyObject(obj) {
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  const newObj = new obj.constructor(); //保持继承链
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      //不遍历其原型链上的属性
      const val = obj[key];
      newObj[key] = typeof val === "object" ? copyObject(val) : val; // 使用arguments.callee解除与函数名的耦合
    }
  }
  return newObj;
}

export const toast = (msg, type, opts) => {
  let options = {
    message: msg,
    type: type ? type : "info",
    customClass: "el-toast",
    offset: self != top ? 70 : 20,
    showClose: true,
  };
  let single = true;
  if (opts) {
    single = opts.single;
    options = Object.assign(options, opts);
  }
  if (single) {
    if (document.getElementsByClassName("el-toast").length === 0) {
      Message(options);
    }
  } else {
    Message(options);
  }
};

export const msg = (msg, title, opts) => {
  let options = {
    message:
      opts && opts.html
        ? opts.html
        : `<div>
    <p class="message-box-header">${title}</p>
    <p class="message-box-msg">${msg}</p>
    </div>`,
    dangerouslyUseHTMLString: true,
    showConfirmButton: true,
    showCancelButton: false,
    customClass: "xrzh-alert",
  };
  if (opts) {
    options = Object.assign(options, opts);
  }
  MessageBox(options).catch(() => {});
};

export const alert = (msg, title, opts) => {
  let options = {
    message: `<div>
    <p class="message-box-header">${title}</p>
    <p class="message-box-msg">${msg}</p>
    </div>`,
    dangerouslyUseHTMLString: true,
    showConfirmButton: true,
    showCancelButton: true,
    customClass: "xrzh-alert",
    beforeClose(action, instance, done) {
      if (action === "confirm") {
        if (opts.request) {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "执行中...";
          opts
            .request()
            .then((data) => {
              instance.confirmButtonText = "确定";
              instance.confirmButtonLoading = false;
              done();
              if (opts.success) {
                opts.success(data);
              }
            })
            .catch((res) => {
              instance.confirmButtonText = "确定";
              instance.confirmButtonLoading = false;
              done();
              if (opts.fail) {
                opts.fail(res);
              }
            });
        } else {
          done();
          if (opts.success) {
            opts.success();
          }
        }
      } else {
        done();
      }
    },
  };
  if (opts) {
    options = Object.assign(options, opts);
  }
  MessageBox(options).catch(() => {});
};

export const confirm = (msg, title, opts) => {
  let options = {
    message: msg,
    title: title,
    showCancelButton: true,
    confirmButtonText: "提交",
    cancelButtonText: "取消",
    confirmButtonClass: "el-button--primary",
    cancelButtonClass: "btn-custom-cancel el-button--default",
    customClass: "xrsz-confirm",
    modalAppendToBody: true,
    width: "50%",
    beforeClose(action, instance, done) {
      if (action === "confirm" && opts.request) {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "执行中...";
        opts
          .request()
          .then(() => {
            instance.confirmButtonText = "确定";
            instance.confirmButtonLoading = false;
            done();
            if (opts.success) {
              opts.success();
            }
          })
          .catch(() => {
            instance.confirmButtonText = "确定";
            instance.confirmButtonLoading = false;
            if (opts.fail) {
              opts.fail();
            }
          });
      } else {
        done();
      }
    },
  };
  if (opts) {
    options = Object.assign(options, opts);
  }
  MessageBox(options).catch(() => {});
};

export const claseAllDialog = () => {
  const $all = document.querySelectorAll(".el-dialog__wrapper");
  for (let i = $all.length - 1; i >= 0; i--) {
    const dialog = $all[i];
    dialog.style.display = "none";
  }
};

// 加密
export function encrypt(password) {
  const SM4 = gmCrypt.sm4;
  const sm4Config = {
    key: "4120356091247385",
    mode: "ecb",
    cipherType: "base64",
  };
  const sm4 = new SM4(sm4Config);

  return sm4.encrypt(password);
}

export const hashcode = (str) => {
  let hash = 0,
    i,
    chr,
    len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
