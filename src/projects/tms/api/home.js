import ax from "@/utils/request";

export function annualOverview(data) {
  return ax.request({
    url: "home/annualOverview",
    method: "post",
    data,
  });
}
export function fundBudgetRate(data) {
  return ax.request({
    url: "home/fundBudgetRate",
    method: "post",
    data,
  });
}

export function fundPayMonth(data) {
  return ax.request({
    url: "home/fundPayMonth",
    method: "post",
    data,
  });
}

export function fundPayRate(data) {
  return ax.request({
    url: "home/fundPayRate",
    method: "post",
    data,
  });
}

export function recentlyPay(data) {
  return ax.request({
    url: "home/recentlyPay",
    method: "post",
    data,
  });
}
