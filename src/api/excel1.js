import ax from "@/utils/request";
import qs from "qs";
import { downloadExcelFile, uploadFiles, downloadFile } from "@/api/file";

export function importTemplate(tableid, filename) {
  const name = filename || "excel";
  downloadExcelFile(
    `arDataImport/downloadTemplate`,
    "post",
    name,
    {},
    {
      tableid: tableid,
      filename: name,
    }
  );
}

export function downGenerqate(tableid, filename) {
  const name = filename || "excel";
  downloadExcelFile(
    `/excel/template/${tableid}/downGenerqate`,
    "post",
    name,
    {},
    {
      tableid: tableid,
      filename: name,
    }
  );
}

export function upload(tableid) {
  return `arDataImport/upload`;
}

export function progress(tableid, batchId) {
  return ax.request({
    url: `arDataImport/progress`,
    method: "post",
    params: {
      batchId: batchId,
    },
  });
}

export function result(tableid, query) {
  return ax.request({
    url: `arDataImport/result`,
    method: "post",
    data: query,
  });
}

export function abnormal(tableid, query) {
  return ax.request({
    url: `arDataImport/result/abnormal`,
    method: "post",
    params: query,
  });
}

export function aduit(tableid, query) {
  return ax.request({
    url: `arDataImport/result/abnormal/audit`,
    method: "post",
    data: query,
  });
}

export function hisRemove(tableid, query) {
  return ax.request({
    url: `arDataImport/remove`,
    method: "post",
    params: query,
  });
}

export function remove(tableid, query) {
  return ax.request({
    url: `arDataImport/result/abnormal/remove`,
    method: "post",
    data: query,
  });
}

export function last(tableid, query) {
  return ax.request({
    url: `arDataImport/result/last`,
    method: "post",
    data: query,
  });
}

export function titles(tableid) {
  return ax.request({
    url: `arDataImport/titles`,
    method: "post",
    params: {
      tableid: tableid,
    },
  });
}

export function history(tableid, query) {
  return ax.request({
    url: `arDataImport/history`,
    method: "post",
    params: {
      tableid: tableid,
    },
    data: query,
  });
}

export function submit(tableid, batchId, ignoreAbnormal) {
  return ax.request({
    url: `arDataImport/submit`,
    method: "post",
    params: {
      tableid: tableid,
      batchId: batchId,
      ignoreAbnormal: ignoreAbnormal,
    },
  });
}

export function download(tableid, name, params) {
  downloadFile(`arDataImport/download`, "post", name, "xls", params);
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
