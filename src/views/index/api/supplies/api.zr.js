
import request from '@/config/axios';
/**
 * 创建 修改 删除 查询仓库  createWarehouse   updateWarehouse  deleteWarehouse  queryWarehouse
 * 查询分页列表 及列表  queryWarehousePageList  queryWarehouseList
 * @param {*} data
 */
export function createWarehouse (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse',
    data,
    mode: 'rel',
    method: 'post'
  });
}
export function updatePrincipal (data) {
  return request({
    url: '/muem/resource/warehouse-service/principal',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function updateWarehouse (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function deleteWarehouse (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse',
    params:data,
    mode: 'rel',
    method: 'delete'
  });
}
export function queryWarehouse (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse-details',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
export function queryWarehousePageList (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse-page-list',
    mode: 'rel',
    method: 'get',
    params:data
  });
}
export function queryWarehouseList (data) {
  return request({
    url: '/muem/resource/warehouse-service/warehouse-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
export function queryCurWarehouseList (data) {
  return request({
    url: '/muem/resource/warehouse-service/current-user-warehouse-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
  
/**
 * 创建 修改 删除 查询供货商  createSupplier   updateSupplier  deleteSupplier  querySupplier
 * 查询分页列表 及列表  querySupplierPageList  querySupplierList
 * @param {*} data
 */
export function createSupplier (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier',
    data,
    mode: 'rel',
    method: 'post'
  });
}
export function updateSupplier (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function deleteSupplier (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier',
    params:data,
    mode: 'rel',
    method: 'delete'
  });
}
export function querySupplier (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier-details',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
export function querySupplierPageList (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier-page-list',
    mode: 'rel',
    method: 'get',
    params:data
  });
}
export function querySupplierList (data) {
  return request({
    url: '/muem/resource/supplier-service/supplier-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
/**
 * 供应商导出 导入
 * @param { data }
 */
export function getExportSupplier (params) {
  return request({
    url: '/muem/resource/supplier-service/export',
    params,
    mode: 'rel',
    method: 'get'
  });
}
export function importSupplierList (data) {
  return request({
    url: '/muem/resource/supplier-service/import',
    method: 'post',
    mode: 'rel',
    data:data
  });
}
/**
 * 库位列表  新增   修改  删除 queryLocationList  createLocation   updateLocation  deleteLocation  
 * @param { data }
 */
export function queryLocationList (data) {
  return request({
    url: '/muem/resource/location-service/location-tree',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}

export function createLocation (data) {
  return request({
    url: '/muem/resource/location-service/location',
    data,
    mode: 'rel',
    method: 'post'
  });
}
export function updateLocation (data) {
  return request({
    url: '/muem/resource/location-service/location',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function deleteLocation (data) {
  return request({
    url: '/muem/resource/location-service/location',
    params:data,
    mode: 'rel',
    method: 'delete'
  });
}

/**
 * 库存预警查询列表  queryWarningList  导出接口
 * @param { data }
 */
export function queryWarningList (data) {
  return request({
    url: '/muem/resource/storage-service/expiry-date-warning-page-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}

/**
 * 仓库管理员查询列表  queryUsersList   createUsersList   updateUsersList  deleteUsersList 
 * @param { data }
 */
export function queryUsersList (data) {
  return request({
    url: '/muem/resource/warehouse-user-service/user-rel-page-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
export function createUsersList (data) {
  return request({
    url: '/muem/resource/warehouse-user-service/user-rel',
    data,
    mode: 'rel',
    method: 'post'
  });
}
export function updateUsersList (data) {
  return request({
    url: '/muem/resource/warehouse-user-service/user-rel',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function deleteUsersList (data) {
  return request({
    url: '/muem/resource/warehouse-user-service/user-rel',
    params:data,
    mode: 'rel',
    method: 'delete'
  });
}
/**
 * getJoblist   取角色列表
 * @param { data }
 */
// http://apirel.aorise.org/muem-auth/api/auth/authServices/userRoles?_r=1598234553446&where.roleName=&where.proKey=76REIG4opmUgOkWuSfVzA1&pageNum=1&pageSize=10
export function getJoblist(data) {
  return request({
      url: '/authServices/userRoles',
      method: 'get',
      mode: 'auth',
      params:data
  });
}
/**
 * batchUpload   上传
 * @param { data }
 */
export function batchUpload(data) {
  return request({
      url: '/duty/file-upload-service/batch',
      method: 'post',
      mode: 'uem',
      timeout: 180000,
      data
  });
}

/**
 * 重置密码
 * @param {*} data
 */
export function resetPwd(data) {
  return request({
    url: '/authServices/reset',
    mode: 'auth',
    data,
    method: 'put'
  });
}


/**
 * 盘点管理员查询列表  queryCheckList   createCheck   updateCheck  deleteCheck  queryCheck
 * @param { data }
 */
export function queryCheckList (data) {
  return request({
    url: '/muem/resource/storage-check-service/list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
export function createCheck (data) {
  return request({
    url: '/muem/resource/storage-check-service/check',
    data,
    mode: 'rel',
    method: 'post'
  });
}
export function updateCheck (data) {
  return request({
    url: '/muem/resource/storage-check-service/check',
    data,
    mode: 'rel',
    method: 'put'
  });
}
export function deleteCheck (data) {
  return request({
    url: '/muem/resource/storage-check-service/check',
    params:data,
    mode: 'rel',
    method: 'delete'
  });
}
export function queryCheck (data) {
  return request({
    url: '/muem/resource/storage-check-service/check',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}

export function updatePublish (data) {
  return request({
    url: '/muem/resource/storage-check-service/publish',
    params:data,
    mode: 'rel',
    method: 'put'
  });
}
//盘点结果分页查询
export function queryCheckPageList (data) {
  return request({
    url: '/muem/resource/storage-check-service/check-result-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
//查询所有物资
export function queryResourceList (data) {
  return request({
    url: '/muem/resource/resource-service/resource-page-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
//查询所有设备列表
export function queryCameraList (data) {
  return request({
    url: '/muem/resource/camera-service/camera-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
//查询仓库下用户列表
export function queryWareUserList (data) {
  return request({
    url: '/muem/resource/warehouse-user-service/user-rel-list',
    params:data,
    mode: 'rel',
    method: 'get'
  });
}
//用户查重
export const checkUserRename = (params) => {
  return request({
    url: "/authServices/userRename",
    method: "GET",
    mode: "auth",
    params,
  });
};