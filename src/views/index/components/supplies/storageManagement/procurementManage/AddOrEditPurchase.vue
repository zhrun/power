<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<div class="main_content">
			<el-scrollbar style="height: 100%">
				<el-form ref="form" :model="model" :rules="rules" inline label-width="110px">
					<div class="title">基本信息</div>
						<el-form-item label="采购类型" prop="purchaseTypeFlag">
							<el-radio-group
								v-model="model.purchaseTypeFlag"
								@change="changePurchaseType"
								:disabled="isEdit"
								style="width: 190px"
							>
								<el-radio label="1">计划采购</el-radio>
								<el-radio label="2">临时采购</el-radio>
							</el-radio-group>
						</el-form-item>
						<template v-if="model.purchaseTypeFlag === '1'">
							<el-form-item label="相关采购计划" prop="purchasePlanUid">
								<el-select
									v-model="model.purchasePlanUid"
									placeholder="请选择采购计划"
									@change="changePurchasePlan"
									:disabled="isEdit"
									style="width: 190px"
								>
									<el-option v-for="item in purchasePlanList" :key="item.uid" :label="item.purchasePlanName" :value="item.uid"></el-option>
								</el-select>
							</el-form-item>
						</template>
						<el-form-item label="供应商" prop="supplierUid">
							<el-select
								v-model="model.supplierUid"
								placeholder="请选择供应商"
								:disabled="!!model.resourceList.length"
								style="width: 190px"
								@change="changeSupplierUid"
							>
								<el-option v-for="item in supplierList" :key="item.uid" :label="item.supplierName" :value="item.uid"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="交货日期" prop="deliveryDate">
							<el-date-picker
								v-model="model.deliveryDate"
								type="date"
								format="yyyy-MM-dd"
								value-format="yyyy-MM-dd"
								placeholder="请选择交货日期"
								:picker-options="pickerOptions"
								style="width: 190px"
							>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="联系人" prop="contactPerson">
							<el-input v-model.trim="model.contactPerson" placeholder="请输入联系人姓名" maxlength="10" style="width: 190px"></el-input>
						</el-form-item>
						<el-form-item label="联系电话" prop="contactPhone">
							<el-input v-model.trim="model.contactPhone" placeholder="请输入联系电话" maxlength="13" style="width: 190px"></el-input>
						</el-form-item>
						<el-form-item label="采购员" prop="purchaser">
							<el-input v-model.trim="model.purchaser" placeholder="请输入采购员姓名" maxlength="10" style="width: 190px"></el-input>
						</el-form-item>
						<el-form-item label="存放仓库" prop="warehouseUid">
							<el-select v-model="model.warehouseUid" placeholder="请选择仓库" style="width: 190px">
								<el-option v-for="item in warehouseList" :key="item.uid" :label="item.warehouseName" :value="item.uid"></el-option>
							</el-select>
						</el-form-item>
					<div class="gray_line"></div>
					<div class="title">采购明细表</div>
					<el-form-item>
						<el-button type="primary" @click="chooseSupplies" :disabled="!model.supplierUid">选择物资装备</el-button>
						<el-button @click="batchDelete" :disabled="!model.resourceList.length">批量删除</el-button>
					</el-form-item>
					<el-table
						class="supplies_table"
						:data="model.resourceList"
						current-row-key="categoryUid"
						style="width: 100%"
						@selection-change="handleSelectionChange"
					>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column prop="resourceName" label="物资装备名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="resourceCode" label="物资装备编号" width="180px" show-overflow-tooltip></el-table-column>
						<el-table-column label="规格型号" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row.model || '-'}}
							</template>
						</el-table-column>
						<el-table-column label="品牌" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row.brand || '-'}}
							</template>
						</el-table-column>
						<el-table-column label="单位">
							<template slot-scope="{row}">
								{{row.measuringUnit || '-'}}
							</template>
						</el-table-column>
						<template v-if="model.purchaseTypeFlag == '1'">
							<el-table-column prop="planPurchaseNum" label="计划采购数量" width="110px"></el-table-column>
							<el-table-column prop="purchasedNum" label="已采购数量" width="110px"></el-table-column>
						</template>
						<el-table-column label="采购数量" width="140px">
							<template slot-scope="{row, $index}">
								<el-form-item :prop="'resourceList.'+$index+'.purchaseNum'" :rules="rules.purchaseNum" :key="row.categoryUid">
									<el-input v-model.trim="row.purchaseNum" placeholder="请输入数量"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="预估单价（元）" width="140px">
							<template slot-scope="{row, $index}">
								<el-form-item :prop="'resourceList.'+$index+'.purchaseUnitPrice'" :rules="rules.purchaseUnitPrice" :key="row.categoryUid">
									<el-input v-model.trim="row.purchaseUnitPrice" placeholder="请输入单价"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="合计（元）" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row | total}}
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="{$index}">
								<span class="handle_btn" @click="handleDelete($index)">删除</span>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
				<div class="footer_button">
					<el-button @click="goBack">返回</el-button>
					<el-button type="primary" @click="save">保存</el-button>
				</div>
			</el-scrollbar>
    </div>
		<select-supplies-dialog
			ref="selectSuppliesDialog"
			title="选择物资装备"
			:showDialog.sync="showSelectSuppliesDialog"
			:selectedList="model.resourceList"
			:getSuppliesListFn="getSuppliesListFn"
			:getSuppliesListParams="getSuppliesListParams"
			@confirm="confirm"
		></select-supplies-dialog>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import SelectSuppliesDialog from '_com/supplies/SelectSuppliesDialog'
import {
	addPurchase,
	editPurchase,
	getPurchaseDetails,
	getSupplierList,
	getWarehouseList,
	getCategoryList,
	getPlanList,
	getSupplierListByPlanId,
} from '_api/supplies/api.yy'
import {
	checkPurchaseQuantity,
	checkUnitPrice,
	checkContactWay,
} from '@/utils/validator'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'
import _get from 'lodash/get'
import { accMul } from '@/utils/util'

export default {
	name: 'AddOrEditPurchase',
	props: {
		flag: {
			type: String,
			required: true,
			default: '',
		},
		uid: {
			type: String,
			default: '',
		},
	},
	components: {
		visBreadcrumb,
		SelectSuppliesDialog,
	},
	computed: {
		isEdit() {
			return this.flag === 'edit'
		},
	},
	filters: {
		// 计算合计
		total({ purchaseNum, purchaseUnitPrice }) {
			if (
				purchaseNum &&
				purchaseUnitPrice &&
				!isNaN(purchaseNum * purchaseUnitPrice)
			) {
				return accMul(purchaseNum, purchaseUnitPrice, 2)
			}
			return '-'
		},
	},
	data() {
		const checkPurchaser = (rule, value, callback) => {
			let reg = /^[\u4E00-\u9FA5]+$/
			if (value && !reg.test(value)) {
				callback(new Error('请输入正确的采购员姓名'))
			} else {
				callback()
			}
		}
		const checkContactPerson = (rule, value, callback) => {
			let reg = /^[\u4E00-\u9FA5]+$/
			if (value && !reg.test(value)) {
				callback(new Error('请输入正确的联系人姓名'))
			} else {
				callback()
			}
		}
		return {
			breadcrumbData: [
				{ name: '仓储管理' },
				{ name: '采购管理', routerName: 'procurementManage' },
			],
			model: {
				purchaseTypeFlag: '1',
				purchasePlanUid: '',
				supplierUid: '',
				warehouseUid: '',
				deliveryDate: '',
				purchaser: '',
				contactPerson: '',
				contactPhone: '',
				statusFlag: '1',
				resourceList: [],
			},
			purchasePlanList: [],
			supplierList: [],
			warehouseList: [],
			rules: {
				deliveryDate: [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				],
				purchasePlanUid: [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				],
				supplierUid: [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				],
				purchaser: [
					{ required: true, message: '该项不可为空', trigger: 'blur' },
					{ validator: checkPurchaser, trigger: 'blur' },
				],
				warehouseUid: [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				],
				purchaseNum: [
					{ required: true, message: '该项不可为空', trigger: 'blur' },
					{ validator: checkPurchaseQuantity, trigger: 'blur' },
				],
				purchaseUnitPrice: [
					{ required: true, message: '该项不可为空', trigger: 'blur' },
					{ validator: checkUnitPrice, trigger: 'blur' },
				],
				contactPerson: [{ validator: checkContactPerson, trigger: 'blur' }],
				contactPhone: [{ validator: checkContactWay, trigger: 'blur' }],
			},
			showSelectSuppliesDialog: false,
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24
				},
			},
			getSuppliesListFn: getCategoryList,
			getSuppliesListParams: {},
			selectedSupplies: [],
			measuringUnitList: [],
			unitUid: '',
		}
	},
	created() {
		this.init()
		this.initDefaultPurchaseInfo()
	},
	methods: {
		init() {
			const userInfoStr = localStorage.getItem('vis_user_info')
			const userInfo = (userInfoStr && JSON.parse(userInfoStr)) || {}
			this.unitUid = _get(userInfo, 'dutyUserInfo.unitUid', '')
			this.breadcrumbData.push({
				name: `${this.isEdit ? '编辑' : '新增'}采购单`,
			})
			this.getPlanList()
			this.getWarehouseList()
			if (this.isEdit) {
				this.getPurchaseDetails()
			}
			this.getDictTypes()
		},
		// 获取字典表数据
		getDictTypes() {
			const dicTypeStr = localStorage.getItem('dic_type')
			// 所有字典数据
			const allDictType = (dicTypeStr && JSON.parse(dicTypeStr)) || []
			// 计量单位字典表
			this.measuringUnitList = allDictType.find(
				({ dictType }) => dictType === '6'
			).dictList
		},
		transformUnit({ measuringUnit }) {
			return _get(
				this.measuringUnitList.find(el => el.dictKey === measuringUnit),
				'dictValue',
				'-'
			)
		},
		// 初始化从采购计划带过来的信息
		initDefaultPurchaseInfo() {
			const producePurchaseInfoStr = localStorage.getItem('producePurchaseInfo')
			if (!producePurchaseInfoStr) return
			const producePurchaseInfo = JSON.parse(producePurchaseInfoStr)
			// 采购计划和采购单字段对应处理
			producePurchaseInfo.resourceList.forEach(item => {
				// 采购单的已计划采购数量 对应 采购计划的采购数量
				item.planPurchaseNum = item.purchaseNum
				// 已采购数量
				// item.purchasedNum = item.plannedPurchaseNum
				// 采购单的采购数量要重新填写
				item.purchaseNum = null
			})
			_assign(this.model, producePurchaseInfo)
			this.getSupplierListByPlanId(producePurchaseInfo.purchasePlanUid)
			this.updateSuppliesList()
		},
		initEditData(data) {
			_assign(this.model, data)
			if (data.purchasePlanUid) {
				this.getSupplierListByPlanId(data.purchasePlanUid)
			} else {
				this.getSupplierList()
			}
			this.updateSuppliesList()
		},
		// 切换采购类型
		changePurchaseType(val) {
			this.model.supplierUid = ''
			// 清空供应商列表
			this.supplierList = []
			this.model.resourceList = []
			if (val === '2') {
				this.model.purchasePlanUid = null
				this.rules.purchasePlanUid = []
				this.getSupplierList()
			} else {
				this.rules.purchasePlanUid = [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				]
			}
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
			})
			this.updateSuppliesList()
		},
		// 切换供应商
		changeSupplierUid(val) {
			if (!val) return
			this.model.supplierUid = val
			this.updateSuppliesList()
		},
		// 组装获取物资列表的参数
		buildGetSuppliesListParams() {
			const params = {}
			const { purchaseTypeFlag, purchasePlanUid, supplierUid } = this.model
			if (purchaseTypeFlag === '1') {
				// 采购类型：计划采购
				params['where.purchasePlanUid'] = purchasePlanUid || null
			}
			params['where.supplierUid'] = supplierUid || null
			return params
		},
		updateSuppliesList() {
			this.getSuppliesListParams = this.buildGetSuppliesListParams()
			this.$nextTick(() => {
				this.$refs['selectSuppliesDialog'].reset()
			})
		},
		// 切换采购计划
		changePurchasePlan(val) {
			this.model.supplierUid = ''
			this.model.resourceList = []
			this.getSupplierListByPlanId(val)
		},
		// 打开物资选择弹框
		chooseSupplies() {
			this.showSelectSuppliesDialog = true
		},
		batchDelete() {
			this.selectedSupplies.map(item => {
				const selectedIndex = this.model.resourceList.findIndex(
					({ uid }) => uid === item.uid
				)
				if (selectedIndex > -1) {
					this.model.resourceList.splice(selectedIndex, 1)
				}
			})
		},
		handleSelectionChange(val) {
			this.selectedSupplies = val
		},
		handleDelete(index) {
			this.model.resourceList.splice(index, 1)
		},
		closeDialog() {
			this.showSelectSuppliesDialog = false
		},
		confirm(val) {
			this.model.resourceList = val
		},
		goBack() {
			this.$router.go(-1)
		},
		// 保存
		save: _debounce(function() {
			this.$refs.form.validate(valid => {
				if (!valid) return
				this.validateSuccess()
			})
		}, 500),
		// 校验成功
		async validateSuccess() {
			const params = _cloneDeep(this.model)
			const { code } = await (this.isEdit
				? editPurchase(params)
				: addPurchase(params))
			if (code === '00000000') {
				if (this.isEdit) {
					this.goBack()
				} else {
					this.$router.push({
						name: 'procurementManage',
						query: {
							t: +new Date(),
							tabIndex: '2',
						},
					})
				}
			}
		},
		// 获取采购单详情
		async getPurchaseDetails() {
			const params = { uid: this.uid }
			const { code, data } = await getPurchaseDetails(params)
			if (code === '00000000') {
				this.initEditData(data)
			}
		},
		// 根据单位id获取供应商列表
		async getSupplierList() {
			const params = {
				unitUid: this.unitUid,
				useFlag: '1',
			}
			const { code, data } = await getSupplierList(params)
			if (code === '00000000') {
				this.supplierList = data
			}
		},
		// 根据单位id获取仓库列表
		async getWarehouseList() {
			const params = {
				unitUid: this.unitUid,
				useFlag: '1',
			}
			const { code, data } = await getWarehouseList(params)
			if (code === '00000000') {
				this.warehouseList = data
			}
		},
		// 查询采购计划列表
		async getPlanList() {
			const params = {
				'where.statusFlag': this.isEdit ? null : '2',
				pageNum: 1,
				pageSize: 9999,
			}
			const { code, data } = await getPlanList(params)
			if (code === '00000000') {
				this.purchasePlanList = data.list
			}
		},
		// 根据采购计划查询供应商列表
		async getSupplierListByPlanId(uid) {
			const params = { uid }
			const { code, data } = await getSupplierListByPlanId(params)
			if (code === '00000000') {
				this.supplierList = data
			}
		},
	},
}
</script>

<style lang='scss' scoped>
.title {
	color: #333333;
	font-size: 14px;
	font-weight: bold;
	margin-bottom: 30px;
}
/deep/ .el-date-editor .el-range-separator {
	width: 20px;
}
.gray_line {
	margin-top: 10px;
	margin-right: 20px;
	margin-bottom: 20px;
	border-bottom: 1px solid #e1e1e1;
}
.footer_button {
	text-align: center;
	margin-top: 30px;
	margin-bottom: 30px;
	.el-button + .el-button {
		margin-left: 10px;
	}
}
.handle_btn {
	cursor: pointer;
	font-size: 14px;
	color: $main_color;
}
.supplies_table {
	/deep/ td {
		padding: 0;
	}
	.el-form-item {
		margin: 18px 0;
	}
}
</style>
