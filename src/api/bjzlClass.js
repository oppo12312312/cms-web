import ax from "@/utils/request";
import { downloadExcelFile } from "@/api/file";
import qs from "qs";
const baseUrl = "xgAssBjzlClass";

export function getAppointList(query) {
  return ax.request({
    url: `${baseUrl}/getAppointList`,
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

export function appointBjzl(query) {
  return ax.request({
    url: `${baseUrl}/appointBzrl`,
    method: "post",
    data: query,
  });
}

export function changeAppointBjzl(query) {
  return ax.request({
    url: `${baseUrl}/changeAppointFdy`,
    method: "post",
    data: query,
  });
}

export function disAppointBjzl(query) {
  return ax.request({
    url: `${baseUrl}/disAppointFdy`,
    method: "post",
    data: query,
  });
}

export function bjzlDetail(query) {
  return ax.request({
    url: `${baseUrl}/student`,
    method: "post",
    params: query,
  });
}

export function exportBjzlClassList(params, name) {
  downloadExcelFile(`${baseUrl}/exportBzrClassList`, "post", name, params);
}
