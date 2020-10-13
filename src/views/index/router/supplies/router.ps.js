
export default [
  /*-------------------- 仓管员>>仓储管理 --------------------*/

  // 仓储管理>采购管理
  {
    path: "purchaseManage",
    name: "purchaseManage",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/purchaseManage/purchaseManage.vue'),
  },
  // 仓储管理>采购管理>采购详情
  {
    path: "purchaseDetail",
    name: "purchaseDetail",
    meta: {
      father: 'purchaseManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/purchaseManage/purchaseDetail.vue'),
  },

  // 仓储管理>入库管理
  {
    path: "inStorageManage",
    name: "inStorageManage",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/putInStorageManage/inStorageManage.vue'),
  },
  // 仓储管理>入库管理>入库详情
  {
    path: "inStorageDetail",
    name: "inStorageDetail",
    meta: {
      father: 'inStorageManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/putInStorageManage/inStorageDetail.vue'),
  },
  // 仓储管理>入库管理>新增入库单
  {
    path: "addInStorage",
    name: "addInStorage",
    meta: {
      father: 'inStorageManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/putInStorageManage/addInStorage.vue'),
  },

  // 仓储管理>出库管理
  {
    path: "outStorageManage",
    name: "outStorageManage",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/outStorageManage/outStorageManage.vue'),
  },
  // 仓储管理>入库管理>出库详情
  {
    path: "outStorageDetail",
    name: "outStorageDetail",
    meta: {
      father: 'outStorageManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/outStorageManage/outStorageDetail.vue'),
  },
  // 仓储管理>入库管理>新增出库单
  {
    path: "addOutStorage",
    name: "addOutStorage",
    meta: {
      father: 'outStorageManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/outStorageManage/addOutStorage.vue'),
  },

  // 仓储管理>组装和拆卸管理
  {
    path: "aAndDManage",
    name: "aAndDManage",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/aAndDManage/aAndDManage.vue'),
  },
  // 仓储管理>组装和拆卸管理>组装和拆卸详情
  {
    path: "aAndDDetail",
    name: "aAndDDetail",
    meta: {
      father: 'aAndDManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/aAndDManage/aAndDDetail.vue'),
  },
  // 仓储管理>组装和拆卸管理>新增组装和拆卸
  {
    path: "addaAndD",
    name: "addaAndD",
    meta: {
      father: 'aAndDManage'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/aAndDManage/addaAndD.vue'),
  },

  // 仓储管理>标签打印
  {
    path: "printLabel",
    name: "printLabel",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/printLabel/printLabel.vue'),
  },
  // 仓储管理>标签打印>标签详情
  {
    path: "labelDetail",
    name: "labelDetail",
    meta: {
      father: 'printLabel'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/printLabel/labelDetail.vue'),
  },
  // 仓储管理>标签打印>标签详情
  {
    path: "qrcodePage",
    name: "qrcodePage",
    meta: {
      father: 'printLabel'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/printLabel/qrcodePage.vue'),
  },
  // 仓储管理>标签打印>新增标签
  {
    path: "addLabel",
    name: "addLabel",
    meta: {
      father: 'printLabel'
    },
    component: () => import('@/views/index/components/supplies/warehouseStorageManage/printLabel/addLabel.vue'),
  },
  // 消息列表
  {
    path: "messageList",
    name: "messageList",
    component: () => import('@/views/index/components/supplies/messageList.vue'),
  },
]


