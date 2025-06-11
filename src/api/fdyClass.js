import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";
import qs from "qs";
const baseUrl = "xgAssFdyClass";

export function getAppointList(query) {
  return ax.request({
    url: `${baseUrl}/getAppointList`,
    method: "post",
    data: query,
  });
}

export function getHisAppointList(query) {
  return ax.request({
    url: `${baseUrl}/getHisAppointList`,
    method: "post",
    data: query,
  });
}

export function getUnAppointList(query) {
  return ax.request({
    url: `${baseUrl}/getUnAppointList`,
    method: "post",
    data: query,
  });
}

export function appointFdy(query) {
  return ax.request({
    url: `${baseUrl}/appointFdy`,
    method: "post",
    data: query,
  });
}

export function changeAppointFdy(query) {
  return ax.request({
    url: `${baseUrl}/changeAppointFdy`,
    method: "post",
    data: query,
  });
}

export function disAppointFdy(query) {
  return ax.request({
    url: `${baseUrl}/disAppointFdy`,
    method: "post",
    data: query,
  });
}

export function exportFdyClassList(params, name) {
  downloadExcelFile(`${baseUrl}/exportFdyClassList`, "post", name, params);
}
