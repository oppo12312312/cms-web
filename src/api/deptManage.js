import ax from "@/utils/request";
import qs from "qs";

const baseUrl1 = "/dept/";
const baseUrl2 = "/major/";
const baseUrl3 = "/class/";

export function dwList(query) {
  //单位列表
  return ax.request({
    url: `${baseUrl1}queryDeptlist`,
    method: "post",
    data: query,
  });
}

export function zyList(query) {
  //专业列表
  return ax.request({
    url: `${baseUrl2}queryMajorlist`,
    method: "post",
    data: query,
  });
}

export function bjList(query) {
  //班级列表
  return ax.request({
    url: `${baseUrl3}queryClasslist`,
    method: "post",
    data: query,
  });
}

export function saveDept(query) {
  //新增/编辑单位
  return ax.request({
    url: `${baseUrl1}saveOrUpdateDept`,
    method: "post",
    data: query,
  });
}

export function saveMajor(query) {
  //新增/编辑专业
  return ax.request({
    url: `${baseUrl2}saveOrUpdateMajor`,
    method: "post",
    data: query,
  });
}

export function saveClass(query) {
  //新增/编辑班级
  return ax.request({
    url: `${baseUrl3}saveOrUpdateClass`,
    method: "post",
    data: query,
  });
}

export function delDept(query) {
  //删除单位
  return ax.request({
    url: `${baseUrl1}deleteDept`,
    method: "post",
    data: query,
    /* data: qs.stringify(query, {
      indices: false
    }) */
  });
}

export function delMajor(query) {
  //删除专业
  return ax.request({
    url: `${baseUrl2}deleteMajor`,
    method: "post",
    data: query,
    // data: qs.stringify(query, {
    //   indices: false
    // })
  });
}

export function delClass(query) {
  //删除班级
  return ax.request({
    url: `${baseUrl3}deleteClass`,
    method: "post",
    data: query,
  });
}

// POST /genBh 自动生成班号
export function genBh(data) {
  return ax.request({
    url: `/class/genBh`,
    method: "post",
    data,
  });
}

// POST /deptSub/list 列表
export function deptSubList(data) {
  return ax.request({
    url: `/deptSub/list`,
    method: "post",
    data,
  });
}
