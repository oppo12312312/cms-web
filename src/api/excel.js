import ax from "@/utils/request";
import qs from "qs";
import { downloadExcelFile, uploadFiles, downloadFile } from "@/api/file";

export function importTemplate(importCode, filename) {
  const name = filename || "excel";
  downloadExcelFile(
    `/excel/template/download`,
    "post",
    name,
    {},
    {
      importCode: importCode,
      filename: name,
    }
  );
}

export function downGenerqate(importCode, filename) {
  const name = filename || "excel";
  downloadExcelFile(
    `/excel/template/downGenerqate`,
    "post",
    name,
    {},
    {
      importCode: importCode,
      filename: name,
    }
  );
}

export function upload(importCode) {
  return `/excel/import/upload`;
}

export function progress(importCode, batchId) {
  return ax.request({
    url: `/excel/import/progress`,
    method: "post",
    params: {
      batchId: batchId,
    },
  });
}

export function result(importCode, query) {
  return ax.request({
    url: `/excel/import/result`,
    method: "post",
    data: query,
  });
}

export function abnormal(importCode, query) {
  return ax.request({
    url: `/excel/import/result/abnormal`,
    method: "post",
    params: query,
  });
}

export function aduit(importCode, query) {
  return ax.request({
    url: `/excel/import/result/abnormal/audit`,
    method: "post",
    data: query,
  });
}

export function hisRemove(importCode, query) {
  return ax.request({
    url: `/excel/import/remove`,
    method: "post",
    params: query,
  });
}

export function remove(importCode, query) {
  return ax.request({
    url: `/excel/import/result/abnormal/remove`,
    method: "post",
    data: query,
  });
}

export function last(importCode, query) {
  return ax.request({
    url: `/excel/import/result/last`,
    method: "post",
    data: query,
  });
}

export function titles(importCode) {
  return ax.request({
    url: `/excel/import/titles`,
    method: "post",
    params: {
      importCode: importCode,
    },
  });
}

export function history(importCode, query) {
  return ax.request({
    url: `/excel/import/history`,
    method: "post",
    params: {
      importCode: importCode,
    },
    data: query,
  });
}

export function submit(importCode, batchId, ignoreAbnormal) {
  return ax.request({
    url: `/excel/import/submit`,
    method: "post",
    params: {
      importCode: importCode,
      batchId: batchId,
      ignoreAbnormal: ignoreAbnormal,
    },
  });
}

export function download(importCode, name, params) {
  downloadFile(`/excel/import/download`, "post", name, "xls", params);
}

export function saveMold(query) {
  return ax.request({
    url: `${baseUrl}saveMold`,
    method: "post",
    data: query,
  });
}

export function getMoldList(tableid) {
  return ax.request({
    url: `${baseUrl}moldList`,
    method: "post",
    params: {
      tableid: tableid,
    },
  });
}

export function moldColumns(moldid) {
  return ax.request({
    url: `${baseUrl}moldColumns`,
    method: "post",
    params: {
      moldid: moldid,
    },
  });
}
