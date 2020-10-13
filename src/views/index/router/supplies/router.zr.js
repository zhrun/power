/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:42:24 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-17 16:46:32
 */

export default  [
// 基础信息 物资分类设置
  {
    path: "videoPlay",
    name: "videoPlay",
    component: () => import('@/views/index/components/supplies/video/videoPlay.vue'),
  },
  {
    path: "warehouseManage",
    name: "warehouseManage",
    meta: {
      keepAlive: true,
      isBack: true,
    },
    component: () => import('@/views/index/components/supplies/base/warehouseManage.vue'),
  },
  {
    path: "addWarehouse",
    name: "addWarehouse",
    meta: {
      father:'warehouseManage'
    },
    component: () => import('@/views/index/components/supplies/base/addWarehouse.vue'),
  },
  {
    path: "editWarehouse",
    name: "editWarehouse",
    meta: {
      father:'warehouseManage'
    },
    component: () => import('@/views/index/components/supplies/base/editWarehouse.vue'),
  },
  {
    path: "detailWarehouse",
    name: "detailWarehouse",
    meta: {
      father:'warehouseManage'
    },
    component: () => import('@/views/index/components/supplies/base/detailWarehouse.vue'),
  },
  {
    path: "supplierManage",
    name: "supplierManage",
    meta: {
      keepAlive: true,
      isBack: true,
    },
    component: () => import('@/views/index/components/supplies/base/supplierManage.vue'),
  },
  {
    path: "detailSupplier",
    name: "detailSupplier",
    meta: {
      father:'supplierManage'
    },
    component: () => import('@/views/index/components/supplies/base/detailSupplier.vue'),
  },
  {
    path: "editSupplier",
    name: "editSupplier",
    meta: {
      father:'supplierManage'
    },
    component: () => import('@/views/index/components/supplies/base/editSupplier.vue'),
  },
  {
    path: "inputSupplier",
    name: "inputSupplier",
    meta: {
      father:'supplierManage'
    },
    component: () => import('@/views/index/components/supplies/base/inputSupplier.vue'),
  },
  {
    path: "addSupplier", 
    name: "addSupplier",
    meta: {
      father:'supplierManage'
    },
    component: () => import('@/views/index/components/supplies/base/addSupplier.vue'),
  },
  {
    path: "operatorManagement",
    name: "operatorManagement",
    component: () => import('@/views/index/components/supplies/base/operatorManagement.vue'),
  },
  {
    path: "wareUserManage",
    name: "wareUserManage",
    component: () => import('@/views/index/components/supplies/base/wareUserManage.vue'),
  },
  {
    path: "carManagement",
    name: "carManagement",
    component: () => import('@/views/index/components/supplies/base/carManagement.vue'),
  },
  {
    path: "rolePermissions",
    name: "rolePermissions",
    component: () => import('@/views/index/components/supplies/base/rolePermissions.vue'),
  },
  {
    path: "roleDetail", 
    name: "roleDetail",
    meta: {
      father:'rolePermissions'
    },
    component: () => import('@/views/index/components/supplies/base/roleDetail.vue'),
  },
  {
    path: "locationManage",
    name: "locationManage",
    component: () => import('@/views/index/components/supplies/base/locationManage.vue'),
  },
  {
    path: "shelfWarning",
    name: "shelfWarning",
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/shelfWarning.vue'),
  },
  {
    path: "inventoryManage/inventory",
    name: "inventoryManage",
    meta: {
      keepAlive: true,
      isBack: true,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/inventoryManage/inventory.vue'),
  },
  {
    path: "inventoryManage/inventoryDetail", 
    name: "inventoryDetail",
    meta: {
      father:'inventoryManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/inventoryManage/inventoryDetail.vue'),
  },
  {
    path: "inventoryManage/addInventory", 
    name: "addInventory",
    meta: {
      father:'inventoryManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/inventoryManage/addInventory.vue'),
  },
  

]


