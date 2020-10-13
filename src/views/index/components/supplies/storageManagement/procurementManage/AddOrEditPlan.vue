<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<main class="main_content">
			<el-scrollbar style="height: 100%">
				<el-form ref="form" :model="model" :rules="rules" inline>
					<div class="title">基本信息</div>
					<el-row>
						<el-col :span="12">
							<el-form-item label="采购计划名称" prop="purchasePlanName">
								<el-input
									style="width: 330px"
									v-model="model.purchasePlanName"
									placeholder="请输入采购计划名称"
									maxlength="20"
								></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="计划采购日期" prop="planDate">
								<el-date-picker
									v-model="model.planDate"
									type="daterange"
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd"
									:picker-options="pickerOptions"
									style="width: 300px"
								>
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="gray_line"></div>
					<div class="title">采购明细表</div>
					<el-form-item>
						<el-button type="primary" @click="chooseSupplies">选择物资装备</el-button>
						<el-button @click="batchDelete">批量删除</el-button>
					</el-form-item>
					<el-table
						class="supplies_table"
						:data="model.resourceList"
						current-row-key="categoryUid"
						style="width: 100%"
						@selection-change="handleSelectionChange"
					>
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column prop="resourceName" label="物资装备名称" width="110px" show-overflow-tooltip></el-table-column>
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
								{{transformUnit(row)}}
							</template>
						</el-table-column>
						<el-table-column prop="storage" label="库存总数" v-if="!isEdit"></el-table-column>
						<el-table-column prop="plannedPurchaseNum" label="已计划采购数" width="110px"></el-table-column>
						<el-table-column label="本次计划采购数" width="140px">
							<template slot-scope="{row, $index}">
								<el-form-item :prop="'resourceList.'+$index+'.purchaseNum'" :rules="rules.purchaseNum" :key="row.categoryUid">
									<el-input v-model.trim="row.purchaseNum" placeholder="请输入数量"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="预估单价（元）" width="140px">
							<template slot-scope="{row, $index}">
								<el-form-item :prop="'resourceList.'+$index+'.purchaseUnitPrice'" :rules="rules.purchaseUnitPrice"  :key="row.categoryUid">
									<el-input v-model.trim="row.purchaseUnitPrice" placeholder="请输入单价"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="合计（元）" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row | total}}
							</template>
						</el-table-column>
						<el-table-column label="供应商" width="180px">
							<template slot-scope="{row, $index}">
								<el-form-item :prop="'resourceList.'+$index+'.supplierUid'" :rules="rules.supplierUid"  :key="row.categoryUid">
									<el-select v-model="row.supplierUid"  placeholder="请选择供应商">
										<el-option
											v-for="item in supplierList"
											:key="item.uid"
											:label="item.supplierName"
											:value="item.uid"
										></el-option>
									</el-select>
								</el-form-item>
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
					<el-button type="primary" @click="save('1')">保存</el-button>
					<el-button type="primary" @click="save('2')">发布</el-button>
				</div>
			</el-scrollbar>
    </main>
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
	getPlanDetails,
	addPlan,
	editPlan,
	getSupplierList,
	getPlanCategoryList,
} from '_api/supplies/api.yy'
import { checkPurchaseQuantity, checkUnitPrice } from '@/utils/validator'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'
import _get from 'lodash/get'
import { accMul } from '@/utils/util'

export default {
	name: 'AddOrEditPlan',
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
		return {
			breadcrumbData: [
				{ name: '仓储管理' },
				{ name: '采购管理', routerName: 'procurementManage' },
			],
			model: {
				purchasePlanName: '',
				planDate: '',
				resourceList: [],
				statusFlag: '',
			},
			rules: {
				purchasePlanName: [
					{ required: true, message: '该项不可为空', trigger: 'blur' },
				],
				planDate: [
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
				supplierUid: [
					{ required: true, message: '该项不可为空', trigger: 'change' },
				],
			},
			supplierList: [],
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24
				},
			},
			showSelectSuppliesDialog: false,
			suppliesList: [], // 物资装备列表
			getSuppliesListFn: getPlanCategoryList,
			getSuppliesListParams: {},
			unitUid: '',
			measuringUnitList: [],
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			const userInfoStr = localStorage.getItem('vis_user_info')
			const userInfo = (userInfoStr && JSON.parse(userInfoStr)) || {}
			this.unitUid = _get(userInfo, 'dutyUserInfo.unitUid', '')
			this.getSuppliesListParams = {
				'where.ownerGroupId': this.unitUid,
			}
			this.breadcrumbData.push({
				name: `${this.isEdit ? '编辑' : '新增'}采购计划`,
			})
			this.getSupplierList()
			this.updateSuppliesList()
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
		initEditData(data) {
			_assign(this.model, data)
			// 物资列表中，已选择的供应商被禁用时，清空已选的供应商，重新选择
			data.resourceList.map(({ supplierUid }, index) => {
				if (!this.supplierList.some(it => it.uid === supplierUid)) {
					this.model.resourceList[index].supplierUid = ''
				}
			})
			this.model.planDate = [data.purchaseStartDate, data.purchaseEndDate]
		},
		chooseSupplies() {
			this.showSelectSuppliesDialog = true
		},
		// 批量删除
		batchDelete() {
			const _this = this
			this.selectedSupplies.map(item => {
				const selectedIndex = _this.model.resourceList.findIndex(
					({ categoryUid }) => categoryUid === item.categoryUid
				)
				if (selectedIndex > -1) {
					_this.model.resourceList.splice(selectedIndex, 1)
				}
			})
		},
		// 选中的物资
		handleSelectionChange(val) {
			this.selectedSupplies = val
		},
		// 单个删除
		handleDelete(index) {
			// this.$refs['form'].clearValidate()
			this.model.resourceList.splice(index, 1)
		},
		confirm(val) {
			this.model.resourceList = _cloneDeep(val)
		},
		// 更新物资装备列表
		updateSuppliesList() {
			this.$nextTick(() => {
				this.$refs['selectSuppliesDialog'].reset()
			})
		},
		goBack() {
			this.$router.go(-1)
		},
		// 点击保存
		save: _debounce(function(statusFlag) {
			this.$refs.form.validate(valid => {
				if (!valid) return
				if (statusFlag === '2') {
					this.$confirm('是否确定发布？', '提示')
						.then(() => {
							this.model.statusFlag = statusFlag
							this.validateSuccess()
						})
						.catch()
				} else {
					this.model.statusFlag = statusFlag
					this.validateSuccess()
				}
			})
		}, 500),
		// 构建请求参数
		buildParams() {
			const params = _cloneDeep(this.model)
			params.purchaseStartDate = params.planDate[0] || null
			params.purchaseEndDate = params.planDate[1] || null
			delete params.planDate
			return params
		},
		// 校验通过
		async validateSuccess() {
			const params = this.buildParams()
			const { code } = await (this.isEdit ? editPlan(params) : addPlan(params))
			if (code === '00000000') {
				if (this.isEdit) {
					this.goBack()
				} else {
					this.$router.push({
						name: 'procurementManage',
						query: {
							t: +new Date(),
						}
					})
				}
			}
		},
		// 获取采购计划列表
		async getPlanDetails() {
			const params = { uid: this.uid }
			const { code, data } = await getPlanDetails(params)
			if (code === '00000000') {
				this.initEditData(data)
			}
		},
		// 获取供应商列表
		async getSupplierList() {
			const params = {
				unitUid: this.unitUid,
				useFlag: '1',
			}
			const { code, data } = await getSupplierList(params)
			if (code === '00000000') {
				this.supplierList = data
				if (this.isEdit) {
					this.getPlanDetails()
				}
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
		margin: 20px 0;
	}
}
</style>
