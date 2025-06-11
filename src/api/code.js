import ax from "@/utils/request";
import qs from "qs";
const syUrl = "/pDmcode/";

//代码标准管理api
export function codeTreeList(params) {
  // 字典表代码树
  return ax.request({
    url: `${syUrl}codeTreeList`,
    method: "post",
    data: params,
  });
}

export function addCode(params) {
  // 字典新增
  return ax.request({
    url: `${syUrl}codeAdd`,
    method: "post",
    data: params,
  });
}

export function editCode(params) {
  // 字典修改
  return ax.request({
    url: `${syUrl}codeEdit`,
    method: "post",
    data: params,
  });
}

export function delCode(params) {
  // 字典删除
  // params = {
  //   ids: ""//字段代码id
  // }
  return ax.request({
    url: `${syUrl}codeDelete`,
    method: "post",
    data: qs.stringify(params, { indices: false }),
  });
}

export function codeSearch(params) {
  // 字典表搜索
  return ax.request({
    url: `${syUrl}codeSearch`,
    method: "post",
    data: params,
  });
}
