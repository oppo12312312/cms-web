import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "sysUser";

export function userList(query) {
  return ax.request({
    url: `${baseUrl}/list`,
    method: "post",
    data: query,
  });
}

export function preGrantRole(userid) {
  return ax.request({
    url: `${baseUrl}/preGrantRole`,
    method: "post",
    params: {
      userid: userid,
    },
  });
}

export function grantRole(params) {
  return ax.request({
    url: `${baseUrl}/grantRole`,
    method: "post",
    params: params,
  });
}

export function userDetail(query) {
  return ax.request({
    url: `${baseUrl}/detail`,
    method: "post",
    data: query,
  });
}

export function userAdd(query) {
  return ax.request({
    url: `${baseUrl}/addUser`,
    method: "post",
    data: query,
  });
}

export function userDelete(data) {
  return ax.request({
    url: `${baseUrl}/deleteUser`,
    method: "post",
    params: { userids: data },
  });
}

export function initPass(userids, pwd) {
  return ax.request({
    url: `${baseUrl}/initPass`,
    method: "post",
    params: { userids, pwd },
  });
}

// POST /sysUser/editPass 修改密码
export function editPass(data) {
  return ax.request({
    url: `${baseUrl}/editPass`,
    method: "post",
    data,
  });
}

// 更改状态
export function changeStatus(data) {
  return ax.request({
    url: "/sysUser/changeStatus",
    method: "post",
    data,
  });
}
