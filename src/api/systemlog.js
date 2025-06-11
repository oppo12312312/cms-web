import ax from "@/utils/request";
import qs from "qs";
const baseUrl = "sysLog";

export function listAccess(query) {
  return ax.request({
    url: `${baseUrl}/listAccess`,
    method: "post",
    data: query,
  });
}

export function listOp(query) {
  return ax.request({
    url: `${baseUrl}/listOp`,
    method: "post",
    data: query,
  });
}
