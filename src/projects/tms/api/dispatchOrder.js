import ax from "@/utils/request";

export function dispatchOrder(data) {
  return ax.request({
    url: "/dispatchSchedules/dispatchOrder",
    method: "post",
    data,
  });
}

export function updateFee(data) {
  return ax.request({
    url: "/dispatchOrder/updateFee",
    method: "post",
    data,
  });
}

export function view(params) {
  return ax.request({
    url: "/dispatchOrder/view",
    method: "post",
    params,
  });
}
