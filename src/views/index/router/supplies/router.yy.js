export default [
	/** 统计分析start */
	{
		path: 'statisticAnalysis',
		name: 'statisticAnalysis',
		component: () =>
			import('@/views/index/components/supplies/statisticAnalysis/index.vue'),
	},
	/** 统计分析end */
	/** 单位管理员-仓储管理start */
	// 采购管理
	{
		path: 'procurementManage',
		name: 'procurementManage',
		meta: {
			keepAlive: true,
		},
		props: router => ({
			tabIndex: router.query.tabIndex,
		}),
		component: () =>
			import('@/views/index/components/supplies/storageManagement/procurementManage/index.vue'),
	},
	// 新增或编辑采购计划
	{
		path: 'addOrEditPlan',
		name: 'addOrEditPlan',
		props: router => ({
			flag: router.query.flag,
			uid: router.query.uid,
		}),
		meta: {
			father: 'procurementManage',
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/procurementManage/AddOrEditPlan.vue'),
	},
	// 采购计划详情
	{
		path: 'planDetails',
		name: 'planDetails',
		props: router => ({
			uid: router.query.uid,
		}),
		meta: {
			father: 'procurementManage',
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/procurementManage/PlanDetails.vue'),
	},
	// 新增或编辑采购单
	{
		path: 'addOrEditPurchase',
		name: 'addOrEditPurchase',
		props: router => ({
			flag: router.query.flag,
			uid: router.query.uid,
		}),
		meta: {
			father: 'procurementManage',
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/procurementManage/AddOrEditPurchase.vue'),
	},
	// 查看采购单详情
	{
		path: 'purchaseDetails',
		name: 'purchaseDetails',
		props: router => ({
			uid: router.query.uid,
		}),
		meta: {
			father: 'procurementManage',
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/procurementManage/PurchaseDetails.vue'),
	},
	// 库存查询
	{
		path: 'storageInquire',
		name: 'storageInquire',
		props: router => ({
			tabIndex: router.query.tabIndex,
		}),
		meta: {
			keepAlive: true,
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/storageInquire/index.vue'),
	},
	// 库存详情
	{
		path: 'storageDetail',
		name: 'storageDetail',
		props: router => ({
			categoryUid: router.query.categoryUid,
		}),
		meta: {
			father: 'storageInquire',
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/storageInquire/StorageDetail.vue'),
	},
	// 库存预警
	{
		path: 'storageWarning',
		name: 'storageWarning',
		meta: {
			keepAlive: true,
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/storageWarning/index.vue'),
	},
	// 有效期预警
	{
		path: 'expiringDateWarnig',
		name: 'expiringDateWarnig',
		meta: {
			keepAlive: true,
		},
		component: () =>
			import('@/views/index/components/supplies/storageManagement/expiringDateWarnig/index.vue'),
	},
	/** 单位管理员-仓储管理end */
	/** 仓库管理员-仓储管理 start */
	// 库存查询
	{
		path: 'storageQuery',
		name: 'storageQuery',
		meta: {
			keepAlive: true,
		},
		component: () =>
			import('@/views/index/components/supplies/warehouseStorageManage/storageQuery/index.vue'),
	},
	// 库存详情
	{
		path: 'storageParticulars',
		name: 'storageParticulars',
		props: router => ({
			uid: router.query.uid,
		}),
		meta: {
			father: 'storageQuery',
		},
		component: () =>
			import('@/views/index/components/supplies/warehouseStorageManage/storageQuery/StorageParticulars.vue'),
	},
	/** 仓库管理员-仓储管理 end */
	/** 仓库管理员-统计分析 start */
	{
		path: 'WarehouseManagerStatisticAnalysis',
		name: 'WarehouseManagerStatisticAnalysis',
		component: () =>
			import('@/views/index/components/supplies/statisticAnalysis/WarehouseManagerStatisticAnalysis.vue'),
	},

	/** 仓库管理员-统计分析 end */
]
