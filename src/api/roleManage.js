import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "sysRole";

export function roleList(query) {
  return ax.request({
    url: `${baseUrl}/listRole`,
    method: "post",
    data: query,
  });
}
export function roleEdit(roleInfo) {
  return ax.request({
    url: `${baseUrl}/updateSysRole`,
    method: "post",
    data: roleInfo,
  });
}
export function roleAdd(roleInfo) {
  return ax.request({
    url: `${baseUrl}/addSysRole`,
    method: "post",
    data: roleInfo,
  });
}

export function roleDelete(data) {
  return ax.request({
    url: `${baseUrl}/delSysRole`,
    method: "post",
    params: { ids: data },
  });
}
export function roleGrantedUserList(query) {
  return ax.request({
    url: `${baseUrl}/saveRoleUsers`,
    method: "post",
    params: query,
  });
}
export function unGrantedUserList(query) {
  return ax.request({
    url: `${baseUrl}/unallocatedUserList`,
    method: "post",
    data: query,
  });
}
export function grantUsersRole(query) {
  return ax.request({
    url: `${baseUrl}/saveRoleUsers`,
    method: "post",
    data: qs.stringify(query, { indices: false }),
  });
}
export function deleteRoleUsers(query) {
  return ax.request({
    url: `${baseUrl}/deleteRoleUsers`,
    method: "post",
    params: query,
  });
}
export function roleGrantDetail(query) {
  return ax.request({
    url: `${baseUrl}/grantDetail`,
    method: "post",
    data: qs.stringify(query),
  });
}
export function saveGrant(query) {
  return ax.request({
    url: `${baseUrl}/setResourcePermis`,
    method: "post",
    params: query,
  });
}

export function findByResource(query) {
  return ax.request({
    url: `${baseUrl}/findByResource`,
    method: "post",
    params: query,
  });
}

export function roleUserList(query) {
  return ax.request({
    url: `${baseUrl}/userList`,
    method: "post",
    data: query,
  });
}

export function unallocatedUserList(query) {
  return ax.request({
    url: `${baseUrl}/unallocatedUserList`,
    method: "post",
    data: query,
  });
}
