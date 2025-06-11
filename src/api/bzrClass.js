import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";
import qs from "qs";
const baseUrl = "xgAssBzrClass";

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

export function appointBzr(query) {
  return ax.request({
    url: `${baseUrl}/appointBzr`,
    method: "post",
    data: query,
  });
}

export function changeAppointBzr(query) {
  return ax.request({
    url: `${baseUrl}/changeAppointFdy`,
    method: "post",
    data: query,
  });
}

export function disAppointBzr(query) {
  return ax.request({
    url: `${baseUrl}/disAppointFdy`,
    method: "post",
    data: query,
  });
}

export function exportBzrClassList(params, name) {
  downloadExcelFile(`${baseUrl}/exportBzrClassList`, "post", name, params);
}
