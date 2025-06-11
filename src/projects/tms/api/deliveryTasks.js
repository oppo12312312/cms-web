import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";

export function dispatchTask(data) {
  return ax.request({
    url: "/dispatchSchedules/dispatchTask",
    method: "post",
    data,
  });
}

export function dispatche(data) {
  return ax.request({
    url: "/deliveryTasks/dispatche",
    method: "post",
    data,
  });
}

export function view(params) {
  return ax.request({
    url: "/deliveryTasks/view",
    method: "post",
    params,
  });
}

// 导出
export function exportList(params, name) {
  downloadExcelFile("/deliveryTasks/export", "post", name, params);
}

// 配送任务查询接口
export function searchPSOrders(data) {
  return ax.request({
    url: "/orderInfo/searchPSOrders",
    method: "post",
    data,
  });
}
