import Cookies from "js-cookie";
const TokenKey = "token";
const casTokenKey = "casToken";
const rolesName = "adminRoles";
const adminInfo = "adminInfo";

// 存储token
export function getToken() {
  //return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey);
}

export function setToken(token) {
  const millisecond = new Date().getTime();
  const expiresTime = new Date(millisecond + 60 * 1000 * 120);
  //return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
  //return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(TokenKey);
}

export function getOtherToken() {
  return Cookies.get("otherTokenKey");
}

export function setOtherToken(token) {
  return Cookies.set("otherTokenKey", token);
}

export function setJessToken(token) {
  return Cookies.set("JSESSIONID", token);
}

// 存储角色
export function getAdminRoles() {
  const roles = Cookies.get(rolesName);
  if (roles) {
    return JSON.parse(roles);
  }
  return "";
}

export function setAdminRoles(roles) {
  return Cookies.set(rolesName, JSON.stringify(roles));
}

// 获取用户信息
export function getAdminInfo() {
  const admin = Cookies.get(adminInfo);
  if (admin) {
    return JSON.parse(admin);
  }
  return "";
}
// 存储用户信息
export function setAdminInfo(admin) {
  return Cookies.set(adminInfo, JSON.stringify(admin));
}
// 移除用户信息
export function removeAdminInfo() {
  return Cookies.remove(adminInfo);
}

// 获取路由列表
function setRoutes(list, origin) {
  let arr = [];
  for (const r of origin) {
    const n = list.filter((item) => {
      if (item.id == r.url) {
        item.meta.title = r.name;
        // item.meta.icon = r.icon;
        if (r.children) {
          item.children = setRoutes(item.children, r.children);
          return item.children;
        } else {
          return item.id == r.url;
        }
      }
    });
    arr = arr.concat(n);
  }
  return arr;
}

// 获取路由列表
// function setRoutes(list, origin, parent, sys) {
//   let arr = [];
//   if (origin && origin.length) {
//     for (let r of origin) {
//       for (let i = 0; i < list.length; i++) {
//         let nItem = JSON.parse(JSON.stringify(list[i]));
//         nItem.meta.sys = sys;
//         if (parent) {
//           //nItem.name = parent.name + nItem.name;
//           parent.meta.sys = sys;
//         }
//         nItem.component = list[i].component;
//         nItem.children = list[i].children;
//         if(list[i].beforeEnter) {
//           nItem.beforeEnter = list[i].beforeEnter;
//         }
//         if (nItem.id == r.url || nItem.id == r.id) {
//           if (!nItem.meta.hidden) {
//             nItem.meta.title = r.name;
//           }
//           // nItem.meta.icon = r.icon || 'A1';

//           if (r.children && r.children.length) {
//             if (nItem.children) {
//               nItem.children = (setRoutes(nItem.children.length ? nItem.children : list, r.children, nItem, sys));
//             }
//           }
//           if (nItem.children && nItem.children.length) {
//             for (let i = 0; i < nItem.children.length; i++) {
//               if (!nItem.children[i].meta.isHide) {
//                 nItem.redirect += nItem.children[i].path;
//                 break;
//               }
//             }
//           }
//           if (r.submodel) {
//             nItem.name += r.submodel;
//             nItem.path += '/' + r.submodel;
//             nItem.meta.submodel = r.submodel;
//           }
//           if (r.component && r.component == 'query') {
//             nItem.name += '-' + r.component;
//             nItem.path += '/' + r.component;
//             nItem.meta.isQuery = true;
//           }
//           arr = arr.concat(nItem);

//         }

//       }
//     }
//   }
//   return arr;
// }

export function getRoutes(routes, routeInfo) {
  const routeList = setRoutes(routes, routeInfo);
  return routeList;
}

// 存储casToken
export function getCasToken() {
  return sessionStorage.getItem(casTokenKey);
}

export function setCasToken(token) {
  return sessionStorage.setItem(casTokenKey, token);
}

export function removeCasToken() {
  return sessionStorage.removeItem(casTokenKey);
}
