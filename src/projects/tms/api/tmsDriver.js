import ax from "@/utils/request";

export function add(data) {
  return ax.request({
    url: "/tmsDriver/add",
    method: "post",
    data,
  });
}

export function close(params) {
  return ax.request({
    url: "/tmsDriver/close",
    method: "post",
    params,
  });
}

export function edit(data) {
  return ax.request({
    url: "/tmsDriver/edit",
    method: "post",
    data,
  });
}

export function editPass(data) {
  return ax.request({
    url: "/tmsDriver/editPass",
    method: "post",
    data,
  });
}

export function open(params) {
  return ax.request({
    url: "/tmsDriver/open",
    method: "post",
    params,
  });
}

export function pageList(data) {
  return ax.request({
    url: "/tmsDriver/pageList",
    method: "post",
    data,
  });
}

export function remove(params) {
  return ax.request({
    url: "/tmsDriver/remove",
    method: "post",
    params,
  });
}

export function selectSj(params) {
  return ax.request({
    url: "/tmsDriver/selectSj",
    method: "post",
    params,
  });
}

export function view(params) {
  return ax.request({
    url: "/tmsDriver/view",
    method: "post",
    params,
  });
}
