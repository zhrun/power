import request from "@/config/axios";
import { ajaxCtx } from "@/config/config.js";


/**
 * getResourcePageList 所有物资装备分页列表
 * @param { data }
 */
export const getResourcePageList = (data) => {
  return request({
    url: "/muem/resource/resource-service/resource-page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getLocationTree 库位列表
 * @param { data }
 */
export const getLocationTree = (data) => {
  return request({
    url: "/muem/resource/location-service/location-tree",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/* ========== 仓管员-->采购管理 ========== */
/**
 * getPurchaseServiceList 采购单分页查询
 * @param { data }
 */
export const getPurchaseServiceList = (data) => {
  return request({
    url: "/muem/resource/purchase-service/list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
* getPurchaseServiceListForWarehousing 采购单分页查询
* @param { data }
*/
export const getPurchaseServiceListForWarehousing = (data) => {
 return request({
   url: "/muem/resource/purchase-service/list-for-warehousing",
   method: "GET",
   mode: "rel",
   params: data
 })
};

// 导出采购单
export const exportPurchaseUrl = ajaxCtx["rel"] + "/muem/resource/purchase-service/export";

/**
 * getPurchaseServiceDetail 采购单详情
 * @param { data }
 */
export const getPurchaseServiceDetail = (data) => {
  return request({
    url: "/muem/resource/purchase-service/purchase",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/* ========== 仓管员-->入库管理 ========== */

/**
 * getStorageWarehousingList  入库单分页列表
 * @param { data }
 */
export const getStorageWarehousingList = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

// 导出入库单
export const exportStorageUrl = ajaxCtx["rel"] + "/muem/resource/storage-warehousing-service/export";

/**
 * getStorageWarehousingDetail 入库单详情
 * @param { data }
 */
export const getStorageWarehousingDetail = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/warehousing",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getScanCodeList 入库单扫码记录
 * @param { data }
 */
export const getScanCodeList = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/scan-code-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * postStorageWarehousing 新增保存入库单
 * @param { data }
 */
export const postStorageWarehousing = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/warehousing",
    method: "POST",
    mode: "rel",
    data,
  })
};

/**
 * putStorageWarehousing 编辑保存入库单
 * @param { data }
 */
export const putStorageWarehousing = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/warehousing",
    method: "PUT",
    mode: "rel",
    data,
  })
};

/**
 * deleteStorageWarehousing 删除保存入库单
 * @param { data }
 */
export const deleteStorageWarehousing = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/warehousing",
    method: "DELETE",
    mode: "rel",
    params: data
  })
};

/**
 * putStorageWarehousingVerify 入库单审核
 * @param { data }
 */
export const putStorageWarehousingVerify = (data) => {
  return request({
    url: "/muem/resource/storage-warehousing-service/verify",
    method: "PUT",
    mode: "rel",
    data,
  })
};


/* ========== 仓管员-->出库管理 ========== */
/**
 * getOutDeliveryOrderPageList  出库单分页列表
 * @param { data }
 */
export const getOutDeliveryOrderPageList = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order-page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

// 导出出库单
export const exportOutDeliveryUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/out-delivery-order/export";

/**
 * getOutDeliveryOrderDetail 出库单详情
 * @param { data }
 */
export const getOutDeliveryOrderDetail = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order/details",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getOutDeliveryOrderScanList 获取出库单某物资的扫描记录列表
 * @param { data }
 */
export const getOutDeliveryOrderScanList = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order-scan-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * postOutDeliveryOrder 新增出库单
 * @param { data }
 */
export const postOutDeliveryOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order",
    method: "POST",
    mode: "rel",
    data
  })
};

/**
 * putOutDeliveryOrder 编辑出库单
 * @param { data }
 */
export const putOutDeliveryOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order",
    method: "PUT",
    mode: "rel",
    data
  })
};

/**
 * deleteOutDeliveryOrder 删除出库单
 * @param { data }
 */
export const deleteOutDeliveryOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order",
    method: "DELETE",
    mode: "rel",
    params: data
  })
};

/**
 * putOutDeliveryOrderCheck 入库单审核
 * @param { data }
 */
export const putOutDeliveryOrderCheck = (data) => {
  return request({
    url: "/muem/resource/storage-service/out-delivery-order/check",
    method: "PUT",
    mode: "rel",
    data,
  })
};

/* ========== 仓管员-->标签打印 ========== */
/**
 * getPrintPageList  标签打印分页列表
 * @param { data }
 */
export const getPrintPageList = (data) => {
  return request({
    url: "/muem/resource/label-service/print-page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getReprintPageList  补打标签分页列表
 * @param { data }
 */
export const getReprintPageList = (data) => {
  return request({
    url: "/muem/resource/label-service/reprint-page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getPrintDetail  标签打印详情
 * @param { data }
 */
export const getPrintDetail = (data) => {
  return request({
    url: "/muem/resource/label-service/print-detail",
    method: "GET",
    mode: "rel",
    params: data
  })
};


/**
 * getLabelTest  根据物资分类uid和数量返回二维码
 * @param { data }
 */
export const getLabelTest = (data) => {
  return request({
    url: "/muem/resource/label-service/test",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * getResourceDetailList  根据入库单id查物资明细
 * @param { data }
 */
export const getResourceDetailList = (data) => {
  return request({
    url: "/muem/resource/label-service/resource-detail-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * postPrint  新增打印任务
 * @param { data }
 */
export const postPrint = (data) => {
  return request({
    url: "/muem/resource/label-service/print",
    method: "POST",
    mode: "rel",
    data
  })
};

/**
 * postReprint  新增补打
 * @param { data }
 */
export const postReprint = (data) => {
  return request({
    url: "/muem/resource/label-service/reprint",
    method: "POST",
    mode: "rel",
    data
  })
};

/**
 * getBarcodeList 根据打印任务id二维码
 * @param { data }
 */
export const getBarcodeList = (data) => {
  return request({
    url: "/muem/resource/label-service/barcode-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * putLabelFinish  批量设置打印状态
 * @param { data }
 */
export const putLabelFinish = (data) => {
  return request({
    url: "/muem/resource/label-service/finish",
    method: "PUT",
    mode: "rel",
    data
  })
};

/* ========== 仓管员-->组装和拆卸管理 ========== */

/**
 * getCombineOrderList  组装和拆卸单分页列表
 * @param { data }
 */
export const getCombineOrderList = (data) => {
  return request({
    url: "/muem/resource/storage-service/combine-order-page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

// 导出组装和拆卸单
export const exportCombineOrderUrl = ajaxCtx["rel"] + "/muem/resource/storage-service/combine-order/export";

/**
 * getCombineOrder  组装和拆卸单详情
 * @param { data }
 */
export const getCombineOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/combine-order/details",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * postCombineOrder  新增组装和拆卸单
 * @param { data }
 */
export const postCombineOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/combine-order",
    method: "POST",
    mode: "rel",
    data
  })
};

/**
 * putCombineOrder  编辑组装和拆卸单
 * @param { data }
 */
export const putCombineOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/combine-order",
    method: "PUT",
    mode: "rel",
    data
  })
};

/**
 * deleteCombineOrder  删除组装和拆卸单
 * @param { data }
 */
export const deleteCombineOrder = (data) => {
  return request({
    url: "/muem/resource/storage-service/combine-order",
    method: "DELETE",
    mode: "rel",
    params: data
  })
};


/* ========== 消息通知 ========== */

/**
 * getMessageList  消息通知列表
 * @param { data }
 */
export const getMessageList = (data) => {
  return request({
    url: "/muem/resource/message-service/page-list",
    method: "GET",
    mode: "rel",
    params: data
  })
};

/**
 * putMessageRead  读取消息
 * @param { data }
 */
export const putMessageRead = (data) => {
  return request({
    url: "/muem/resource/message-service/read?uid=" + data,
    method: "PUT",
    mode: "rel",
  })
};

