import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";

// 列表
export function list(data) {
  return ax.request({
    url: "/historyFile/list",
    method: "post",
    data,
  });
}

// 导出
export function exportList(params, name) {
  downloadExcelFile("/historyFile/export", "post", name, params);
}
