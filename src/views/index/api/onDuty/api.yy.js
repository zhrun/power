import request from "@/config/axios";
import { ajaxCtx } from "@/config/config.js";

/** 总后台机构服务start */
// 查询总机构树
export const getZbTree = () => {
  return request({
    url: "/duty/unit-service/zb-tree",
    method: "GET",
    mode: "uem",
  });
};
// 查询总后台机构列表
export const getUnitList = (params) => {
  return request({
    url: "/duty/unit-service/zb-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 查询后台机构列表
export const getBackUnitList = (params) => {
  return request({
    url: "/duty/unit-service/back-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 删除机构
export const deleteUnit = (params) => {
  return request({
    url: "/duty/unit-service/unit",
    method: "DELETE",
    mode: "uem",
    params: params,
  });
};
// 新增机构
export const addUnit = (params) => {
  return request({
    url: "/duty/unit-service/unit",
    method: "POST",
    mode: "uem",
    data: params,
  });
};
// 机构详情
export const getUnitDetail = (params) => {
  return request({
    url: "/duty/unit-service/unit-details",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 编辑机构
export const editUnit = (params) => {
  return request({
    url: "/duty/unit-service/unit",
    method: "PUT",
    mode: "uem",
    data: params,
  });
};
// 导出机构
export const exportUnit = (params) => {
  return request({
    url: "/duty/unit-service/export",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 查询位次列表
export const querySortList = (params) => {
  return request({
    url: "/duty/unit-service/query-sort-list",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 根据父级id生成最大sortId
export const getSortId = (params) => {
  return request({
    url: "/duty/unit-service/sort-id",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 查询后台机构树
export const queryBackTree = (params) => {
  return request({
    url: "/duty/unit-service/back-tree",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 查询前台机构树
export const queryUnitTree = (params) => {
  return request({
    url: "/duty/unit-service/unit-tree",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 查询前台机构树
export const getFrontUnitTree = (params) => {
  return request({
    url: "/duty/unit-service/unit-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};

// 机构通讯录模板下载
export const downloadUnitUrl = ajaxCtx["uem"] + "/duty/unit-service/download";
// 导入机构通讯录地址
export const uploadUnitUrl = ajaxCtx["uem"] + "/duty/unit-service/import";
// 导出机构通讯录地址
export const exportUnitUrl = ajaxCtx["uem"] + "/duty/unit-service/export";

/** 机构服务end */

/** 用户服务start */
// 总后台用户列表
export const getUserList = (params) => {
  return request({
    url: "/duty/user-service/zb-user-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 本级用户列表
export const getBackUserList = (params) => {
  return request({
    url: "/duty/user-service/back-user-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 下级管理员列表
export const getBackAdminList = (params) => {
  return request({
    url: "/duty/user-service/back-admin-page-list",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 新增用户
export const addUser = (params) => {
  return request({
    url: "/duty/user-service/user",
    method: "POST",
    mode: "uem",
    data: params,
  });
};
// 编辑
export const editUser = (params) => {
  return request({
    url: "/duty/user-service/user",
    method: "PUT",
    mode: "uem",
    data: params,
  });
};
// 删除用户
export const deleteUser = (params) => {
  return request({
    url: "/duty/user-service/user",
    method: "DELETE",
    mode: "uem",
    params: params,
  });
};
// 详情
export const getUserDetails = (params) => {
  return request({
    url: "/duty/user-service/user-details",
    method: "GET",
    mode: "uem",
    params: params,
  });
};
// 根据单位生成卡号
export const generateCardNO = (params) => {
  return request({
    url: "/duty/user-service/card-no",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 姓名查重
export const checkName = (params) => {
  return request({
    url: "/duty/user-service/user-name",
    method: "GET",
    mode: "uem",
    params,
  });
};
export const exportSysUserUrl = ajaxCtx["uem"] + "/duty/user-service/export";
export const downloadUserTemUrl =
ajaxCtx["uem"] + "/duty/user-service/download";
export const importSysUserUrl = ajaxCtx["uem"] + "/duty/user-service/import";
/** 用户服务end */

/** 人员通讯录start */
// 姓名查重
export const checkPersonName = (params) => {
  return request({
    url: "/duty/duty-user-service/person-name",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 手機號查重
export const checkPersonTelephone = (params) => {
  return request({
    url: "/duty/duty-user-service/telephone",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 人员通讯录列表
export const queryPersonList = (params) => {
  return request({
    url: "/duty/duty-user-service/contact-page-list",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 后台人员通讯录列表
export const queryBackPersonList = (params) => {
  return request({
    url: "/duty/duty-user-service/back-contact-page-list",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 新增人员通讯录
export const addPerson = (params) => {
  return request({
    url: "/duty/duty-user-service/user",
    method: "POST",
    mode: "uem",
    data: params,
  });
};
// 修改人员通讯录
export const editPerson = (params) => {
  return request({
    url: "/duty/duty-user-service/user",
    method: "PUT",
    mode: "uem",
    data: params,
  });
};
// 删除人员通讯录
export const deletePerson = (params) => {
  return request({
    url: "/duty/duty-user-service/user",
    method: "DELETE",
    mode: "uem",
    params,
  });
};
// 查询人员通讯录详情
export const getPersonDetail = (params) => {
  return request({
    url: "/duty/duty-user-service/user-details",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 查询位次列表
export const queryPersonSortList = (params) => {
  return request({
    url: "/duty/duty-user-service/query-sort-list",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 生成位次
export const getPersonSortId = (params) => {
  return request({
    url: "/duty/duty-user-service/sort-id",
    method: "GET",
    mode: "uem",
    params,
  });
};
// 人员通讯录模板下载
export const downloadUserUrl =
  ajaxCtx["uem"] + "/duty/duty-user-service/download";
// 导入人员通讯录
export const uploadUserUrl = ajaxCtx["uem"] + "/duty/duty-user-service/import";
// 导出机构通讯录
export const exportUserUrl = ajaxCtx["uem"] + "/duty/duty-user-service/export";
/** 人员通讯录end */

/** auth服务 */
// 查询所有角色列表
export const getUserRoles = (params) => {
  return request({
    url: "/authServices/userRoles",
    method: "GET",
    mode: "auth",
    params: params,
  });
};
// 根据项目查询权限列表
export const getAuthResources = (params) => {
  return request({
    url: "/authServices/authResources",
    method: "GET",
    mode: "auth",
    params: params,
  });
};
// 根据用户id查询用户权限列表
export const getAuthResourcesById = (params) => {
  return request({
    url: "/authServices/resource",
    method: "GET",
    mode: "auth",
    params: params,
  });
};
// 根据角色查询用户权限列表
export const getAuthResourcesByRole = (params) => {
  return request({
    url: "/authServices/roleAuth",
    method: "GET",
    mode: "auth",
    params: params,
  });
};
// 角色批量赋权
export const empowerBatch = (params) => {
  return request({
    url: "/authServices/roleAuthBatch",
    method: "POST",
    mode: "auth",
    data: params,
  });
};
// 根据用户id查询用户权限列表
export const setAuthResources = (params) => {
  return request({
    url: "/authServices/roleAuthBatch",
    method: "POST",
    mode: "auth",
    data: params,
  });
};
// 修改用户信息
export const editAuth = (params) => {
  return request({
    url: "/authServices/user",
    method: "PUT",
    mode: "auth",
    data: params,
  });
};
// 删除用户信息
export const resetPsd = (params) => {
  return request({
    url: "/authServices/reset",
    method: "PUT",
    mode: "auth",
    data: params,
  });
};
// 修改密码
export const changePsd = (params) => {
  return request({
    url: "/authServices/password",
    method: "PUT",
    mode: "auth",
    data: params,
  });
};
export const checkUserRename = (params) => {
  return request({
    url: "/authServices/userRename",
    method: "GET",
    mode: "auth",
    params,
  });
};
/** auth服务end */

/** 区域服务start */
export const getAreaList = (params) => {
  return request({
    url: "/duty/area-service/area-list",
    method: "GET",
    mode: "uem",
    params,
  });
};

/** 区域服务end */

/** 字典服务start */
  export const getDicts = (params) => {
    return request({
      url: "/duty/dict-service/dicts/byDictType",
      method: "GET",
      mode: "rel",
      params,
    });
  };


/** 字典服务end */
