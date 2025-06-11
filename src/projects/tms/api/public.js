import ax from "@/utils/request";

// 部门列表
export function queryDeptlist(data) {
  data.level = data.level || 3;
  return ax.request({
    url: "/public/queryDeptlist",
    method: "post",
    data,
  });
}
