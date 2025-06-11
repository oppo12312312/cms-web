import ax from "@/utils/request";

/**
 * 角色列表
 * @param {Object} params
 */
export function listRole(params) {
  return ax.request({
    url: `/role/list`,
    method: "get",
    params
  });
}

/**
 * 新增角色
 * @param {Object} data
 */
export function addRole(data) {
  return ax.request({
    url: `/role/add`,
    method: "post",
    data
  });
}

/**
 * 修改角色
 * @param {Object} data
 */
export function updateRole(data) {
  return ax.request({
    url: `/role/update`,
    method: "post",
    data
  });
}

/**
 * 删除角色
 * @param {Object} params
 */
export function deleteRole(params) {
  return ax.request({
    url: `/role/delete`,
    method: "get",
    params
  });
}

/**
 * 获取角色详情
 * @param {Object} params
 */
export function getRoleDetail(params) {
  return ax.request({
    url: `/role/detail`,
    method: "get",
    params
  });
}

/**
 * 获取角色授权资源
 * @param {Object} params
 */
export function getRoleResources(params) {
  return ax.request({
    url: `/role/resources`,
    method: "get",
    params
  });
}

/**
 * 角色授权
 * @param {Object} data
 */
export function authorizeRole(data) {
  return ax.request({
    url: `/role/authorize`,
    method: "post",
    data
  });
} 