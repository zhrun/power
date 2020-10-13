
import request from '@/config/axios';

export function getResources (params) {
  return request({
    url: '/authServices/authResources',
    params,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 创建权限
 * @param {*} data
 */
export function createResources (data) {
  return request({
    url: 'authServices/authResource',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 编辑权限
 * @param {*} data
 */
export function updateResources (data) {
  return request({
    url: 'authServices/authResource',
    data,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 删除权限
 * @param {*} data
 */
export function delResources (data) {
  return request({
    url: 'authServices/authResource',
    params:data,
    mode: 'auth',
    method: 'delete'
  });
}


/**
 * 获取角色列表数据
 * @param {*} data
 */
export function getRoleList (params) {
  return request({
    url: 'authServices/userRoles',
    params,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 创建角色
 * @param {*} data
 */
export function createRole (data) {
  return request({
    url: 'authServices/userRole',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 编辑角色
 * @param {*} data
 */
export function updateRole (data) {
  return request({
    url: 'authServices/userRole',
    data,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 删除角色
 * @param {*} data
 */
export function delRole (data) {
  return request({
    url: 'authServices/userRole/' + data.uid + '?proKey=' + data.proKey,
    mode: 'auth',
    method: 'delete'
  });
}

/**
 * get角色权限
 * @param {*} data
 */

export function getroleAuthBatch (data) {
  return request({
    url: 'authServices/roleAuth',
    params: data,
    method: 'get',
    mode: 'auth'
  });
}
/**
 * @description: 查询某角色权限上限列表
 * @param 
 * @return: [] data 
 */
export function getRoleResources (params) {
  return request({
    url: '/authServices/authResourceParentUid',
    params,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 角色权限配置
 * @param {*} data
 */
export function roleAuthBatch (data) {
  return request({
    url: 'authServices/roleAuthBatch',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 用户列表
 * @param {*} data
 */
export function queryUsersList (params) {
  return request({
    url: '/authServices/users',
    params,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * add新用户
 * @param {*} data
 */
export function createUsers (data) {
  return request({
    url: '/authServices/user',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 修改用户
 * @param {*} data
 */
export function updateUsersList (data) {
  return request({
    url: '/authServices/user',
    data,
    mode: 'auth',
    method: 'put'
  });
}
