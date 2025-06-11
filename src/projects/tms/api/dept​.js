import ax from "@/utils/request";

// 逻辑删除部门
export function deleteDept(data) {
  return ax.request({
    url: "/dept/deleteDept",
    method: "post",
    data,
  });
}

// 部门列表
export function queryDeptlist(data) {
  return ax.request({
    url: "/dept/queryDeptlist",
    method: "post",
    data,
  });
}

// 编辑部门
export function saveOrUpdateDept(data) {
  return ax.request({
    url: "/dept/saveOrUpdateDept",
    method: "post",
    data,
  });
}
