import request from "@/config/axios";
import { ajaxCtx } from "@/config/config.js";

/** 单位管理员-统计分析 start */
export const getAdminData = (params) => {
  return request({
    url: "/muem/resource/statistics-service/organize-admin",
    method: "GET",
    params,
    mode: "rel",
  });
};
/** 单位管理员-统计分析 end */
/** 仓库管理员-统计分析 start */
export const getWarehouseData = (params) => {
  return request({
    url: "/muem/resource/statistics-service/warehouse-admin",
    method: "GET",
    params,
    mode: "rel",
  });
};
/** 仓库管理员-统计分析 end */
/** 仓储管理 start */
// 采购计划列表
export const getPlanList = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出采购计划
export const exportPlanUrl = ajaxCtx["rel"] + "/muem/resource/purchase-plan-service/export";
// 根据采购计划获取供应商列表
export const getSupplierListByPlanId = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/get-supplier-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 新增采购计划
export const addPlan = (data) => {
  return request({
    url: "/muem/resource/purchase-plan-service/plan",
    method: "POST",
    data,
    mode: "rel",
  });
};
// 编辑采购计划
export const editPlan = (data) => {
  return request({
    url: "/muem/resource/purchase-plan-service/plan",
    method: "PUT",
    data,
    mode: "rel",
  });
};
// 采购计划详情
export const getPlanDetails = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/plan",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 删除采购计划
export const deletePlan = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/plan",
    method: "DELETE",
    params,
    mode: "rel",
  });
};
// 发布采购计划
export const publishPlan = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/publish",
    method: "PUT",
    params,
    mode: "rel",
  });
};
// 发布采购计划
export const finishPlan = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/finish",
    method: "PUT",
    params,
    mode: "rel",
  });
};
// 采购单列表
export const getPurchaseList = (params) => {
  return request({
    url: "/muem/resource/purchase-service/list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出采购单
export const exportPurchaseUrl = ajaxCtx["rel"] + "/muem/resource/purchase-service/export";
// 新增采购单
export const addPurchase = (data) => {
  return request({
    url: "/muem/resource/purchase-service/purchase",
    method: "POST",
    data,
    mode: "rel",
  });
};
// 编辑采购单
export const editPurchase = (data) => {
  return request({
    url: "/muem/resource/purchase-service/purchase",
    method: "PUT",
    data,
    mode: "rel",
  });
};
// 删除采购单
export const deletePurchase = (params) => {
  return request({
    url: "/muem/resource/purchase-service/purchase",
    method: "DELETE",
    params,
    mode: "rel",
  });
};
// 采购单详情
export const getPurchaseDetails = (params) => {
  return request({
    url: "/muem/resource/purchase-service/purchase",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 开始采购
export const beginPurchase = (params) => {
  return request({
    url: "/muem/resource/purchase-service/begin-purchase",
    method: "PUT",
    params,
    mode: "rel",
  });
}
// 采购计划物资装备分页列表
export const getPlanCategoryList = (params) => {
  return request({
    url: "/muem/resource/purchase-plan-service/get-category-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 采购单物资装备分页列表
export const getCategoryList = (params) => {
  return request({
    url: "/muem/resource/purchase-service/get-category-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 库存查询分页
export const getStorageStatisticsList = (params) => {
  return request({
    url: "/muem/resource/storage-service/count-page-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出库存统计列表
export const exportStorageStatisticsListUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/count-page/export";
// 库存流水分页
export const getStorageStatementList = (params) => {
  return request({
    url: "/muem/resource/storage-service/flow-page-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出库存流水列表
export const exportStorageStatementListUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/flow-page/export";
// 物资库存详情
export const getSuppliesStorageDetails = (params) => {
  return request({
    url: "/muem/resource/storage-service/details-page-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 库存预警列表
export const getStorageWarningList = (params) => {
  return request({
    url: "/muem/resource/storage-service/warning-page-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出库存预警
export const exportStorageWarningListUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/warning-page/export";
// 保质期预警列表
export const getExpiryDateWarningList = (params) => {
  return request({
    url: "/muem/resource/storage-service/expiry-date-warning-page-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 导出保质期预警
export const exportExpiryDateWarningListUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/expiry-date-warning-page/export";
// 供应商列表
export const getSupplierList = (params) => {
  return request({
    url: "/muem/resource/supplier-service/supplier-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 仓库列表
export const getWarehouseList = (params) => {
  return request({
    url: "/muem/resource/warehouse-service/warehouse-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 字典数据
export const getByDictType = (params) => {
  return request({
    url: "/muem/resource/dict-service/dicts/byDictType",
    method: "GET",
    params,
    mode: "rel",
  });
};
// 获取仓库信息
export const getCurrentUserWarehouseList = (params) => {
  return request({
    url: "/muem/resource/warehouse-service/current-user-warehouse-list",
    method: "GET",
    params,
    mode: "rel",
  });
};
/** 仓储管理 end */