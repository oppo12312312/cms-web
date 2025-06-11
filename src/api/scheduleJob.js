import ax from "@/utils/request";
import qs from "qs";

const baseUrl = "/scheduleJob/";

export function add(query) {
  //新增
  return ax.request({
    url: `${baseUrl}add`,
    method: "post",
    data: query,
  });
}

export function list(query) {
  //任务列表
  return ax.request({
    url: `${baseUrl}list`,
    method: "post",
    data: query,
  });
}

export function update(query) {
  //修改
  return ax.request({
    url: `${baseUrl}update`,
    method: "post",
    data: query,
  });
}

export function del(params) {
  //删除
  return ax.request({
    url: `${baseUrl}delete`,
    method: "post",
    params: params,
  });
}

export function validateCron(cron) {
  //校验cron表达式
  return ax.request({
    url: `${baseUrl}validateCron`,
    method: "post",
    params: {
      cron: cron,
    },
  });
}

export function manual(params) {
  //手动执行任务
  return ax.request({
    url: `${baseUrl}manual`,
    method: "post",
    params: params,
  });
}

export function logList(query) {
  //获取任务执行日志
  return ax.request({
    url: `${baseUrl}logInfo`,
    method: "post",
    data: query,
  });
}
