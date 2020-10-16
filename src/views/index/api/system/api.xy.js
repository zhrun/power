import request from "@/config/axios";

export const getOrgan = (data) => {
  return request({
    url: "/authServices/organInfos",
    method: "GET",
    mode: "auth",
    params: data
  })
};
export function createOrgan (data) {
  return request({
    url: '/authServices/organInfo',
    data,
    mode: 'auth',
    method: 'post'
  });
}
export function delOrgan (params) {
  return request({
    url: '/authServices/organInfo',
    mode: 'auth',
    method: "DELETE",
    params,
  });
}
export function updateOrganList (data) {
  return request({
    url: '/authServices/organInfo',
    data,
    mode: 'auth',
    method: 'put'
  });
}
// 根据用户id查询用户权限列表
export const getAuthResourcesById = (params) => {
  return request({
    url: "/authServices/resource",
    method: "GET",
    mode: "auth",
    params: params,
  });
};
export function addGroup (data) {
  return request({
    url: '/resourceGroupServices/resourceGroup',
    data,
    mode: 'auth',
    method: 'post'
  });
}
export const getResourceGroups = (params) => {
  return request({
    url: "/resourceGroupServices/resourceGroups",
    method: "GET",
    mode: "auth",
    params: params,
  });
};

