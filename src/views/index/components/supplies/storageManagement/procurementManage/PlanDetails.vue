<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<div class="main_content" v-loading="printLoading">
			<el-scrollbar style="height: 100%">
				<div id="print" ref="printContent">
					<el-row class="title">
						<img :src="statusImgs[`planStatus${model.statusFlag}`]" alt="" class="status_img">
						<span class="title_text">基本信息</span>
						<span class="tips">{{`创建于${model.createTime || ''}，最近更新于${model.updateTime || ''}`}}</span>
					</el-row>
					<el-row class="short_width">
						<el-row class="base_info">
							<el-col :span="8">采购计划编号：{{model.purchasePlanCode}}</el-col>
							<el-col :span="8">采购计划名称：{{model.purchasePlanName}}</el-col>
							<el-col :span="8">计划采购日期：{{model.purchaseStartDate && model.purchaseStartDate.slice(0, 10)}} 至 {{model.purchaseStartDate && model.purchaseEndDate.slice(0, 10)}}</el-col>
						</el-row>
						<el-row class="base_info">
							<el-col :span="8">总金额：{{model.totalAmount}}</el-col>
							<el-col :span="8" v-if="model.statusFlag == 2 || model.statusFlag == 3">发布时间：{{model.publishDate}}</el-col>
							<el-col :span="8" v-if="model.statusFlag == 3">完成时间：{{model.finishDate}}</el-col>
						</el-row>
					</el-row>
					<el-row class="gray_line"></el-row>
					<el-row class="title">采购明细表</el-row>
					<div id="ignorePrint">
						<el-row v-if="model.statusFlag == 2" data-html2canvas-ignore='true'>
							<el-button type="primary" @click="producePurchase">生成采购单</el-button>
							<span class="tips">（请选择同一供应商的物资装备后再生成采购单）</span>
						</el-row>
					</div>
					<el-row v-if="model.purchaseList && model.purchaseList.length > 0">
						相关采购单:
						<span
							class="order"
							v-for="it in model.purchaseList"
							:key="it.purchaseCode"
							@click="goToDetail(it)"
						>
							{{it.purchaseCode}}
						</span>
					</el-row>
					<el-table
						class="supplies_table"
						:data="model.resourceList"
						style="width: 100%"
						@selection-change="handleSelectionChange"
					>
						<el-table-column type="selection" width="55" v-if="model.statusFlag == '2'" key="aa"></el-table-column>
						<el-table-column label="序号" width="110px" v-else key="bb">
							<template slot-scope="{$index}">
								{{$index + 1}}
							</template>
						</el-table-column>
						<el-table-column prop="resourceName" label="物资装备名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="resourceCode" label="物资装备编号" show-overflow-tooltip></el-table-column>
						<el-table-column prop="model" label="规格型号" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row.model || '-'}}
							</template>
						</el-table-column>
						<el-table-column prop="brand" label="品牌" show-overflow-tooltip>
							<template slot-scope="{row}">
								{{row.brand || '-'}}
							</template>
						</el-table-column>
						<el-table-column prop="supplierName" label="供应商"></el-table-column>
						<el-table-column prop="measuringUnit" label="单位">
							<template slot-scope="{row}">
								{{transformUnit(row.measuringUnit)}}
							</template>
						</el-table-column>
						<el-table-column prop="purchaseNum" label="计划采购数量" width="110px"></el-table-column>
						<el-table-column prop="purchaseUnitPrice" label="预估单价（元）"></el-table-column>
						<el-table-column prop="total" label="合计（元）">
							<template slot-scope="{row}">
								{{row.purchaseUnitPrice * row.purchaseNum}}
							</template>
						</el-table-column>
						<el-table-column prop="purchasedNum" label="已采购数量" v-if="model.status != '1'"></el-table-column>
					</el-table>
				</div>
				<div class="footer_button">
					<el-button @click="goBack">返回</el-button>
					<template v-if="model.statusFlag == 1">
						<el-button type="primary" @click="goToEdit">编辑</el-button>
						<el-button type="primary" @click="publish">发布</el-button>
					</template>
					<template v-else-if="model.statusFlag == 2">
						<el-button type="primary" @click="doPrint">打印</el-button>
						<el-button type="primary" @click="finish">完成</el-button>
					</template>
					<template v-else>
						<el-button type="primary" @click="doPrint">打印</el-button>
					</template>
				</div>
			</el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import {
	getPlanDetails,
	publishPlan,
	finishPlan,
	getSupplierList,
} from '_api/supplies/api.yy'
import { formatDate } from '@/utils/util'
import print from 'print-js'
import html2canvas from 'html2canvas'
import _get from 'lodash/get'

export default {
	name: 'PlanDetails',
	props: {
		uid: {
			type: String,
			default: '',
		},
	},
	components: {
		visBreadcrumb,
	},
	data() {
		return {
			breadcrumbData: [
				{ name: '仓储管理' },
				{ name: '采购管理', routerName: 'procurementManage' },
			],
			model: {},
			selectedPurchase: [],
			statusImgs: {
				planStatus1: require('../../../../../../assets/img/supplies/planStatus1.png'),
				planStatus2: require('../../../../../../assets/img/supplies/planStatus2.png'),
				planStatus3: require('../../../../../../assets/img/supplies/planStatus3.png'),
			},
			printLoading: false,
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
			this.breadcrumbData.push({
				name: '采购计划详情',
			})
			this.getPlanDetails()
			this.getDictTypes()
		},
		handleSelectionChange(val) {
			this.selectedPurchase = val
		},
		// 生成采购单
		producePurchase() {
			if (this.selectedPurchase.length === 0) {
				this.$message('请选择物资装备')
				return
			}
			const supplierUid = this.selectedPurchase[0].supplierUid
			// 不是同一供应商的物资装备不能生成采购单
			const flag = this.selectedPurchase.some(
				item => item.supplierUid !== supplierUid
			)
			if (flag) {
				this.$message('请选择同一供应商的物资装备，再生成采购单')
				return
			}
			// 查询供应商列表，校验供应商是否禁用
			this.getSupplierList(supplierUid)
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
		transformUnit(measuringUnit) {
			return _get(
				this.measuringUnitList.find(el => el.dictKey === measuringUnit),
				'dictValue',
				'-'
			)
		},
		goBack() {
			this.$router.go(-1)
		},
		goToEdit() {
			this.$router.push({
				name: 'addOrEditPlan',
				query: {
					uid: this.uid,
					flag: 'edit',
				},
			})
		},
		goToDetail({ uid }) {
			this.$router.push({
				name: 'purchaseDetails',
				query: {
					uid,
				},
			})
		},
		doPrint() {
			this.printLoading = true // 打印的时候loading
			// 保存当前滚动位置
			const scrollY = window.scrollY
			const scrollX = window.scrollX
			// 滚动到顶部，生成图片后还原
			window.scroll(0, 0)
			html2canvas(this.$refs.printContent, {
				backgroundColor: null,
				useCORS: true,
				windowHeight: this.$refs.printContent.scrollHeight, // 转成的canvas的高度
			})
				.then(canvas => {
					// 还原滚动位置
					window.scroll(scrollX, scrollY)
					// let url = canvas.toDataURL('image/jpeg', 1.0)
					const url = canvas.toDataURL()
					print({
						printable: url,
						type: 'image',
						style: '@media print{@page {size:landscape}}',
						documentTitle: '采购计划', // 打印的标题，显示在打印的上方
					})
					console.log(url)
					this.printLoading = false
				})
				.catch(() => {
					this.printLoading = false
				})
		},
		finish() {
			this.$confirm('是否确认完成该计划？', '提示')
				.then(() => {
					this.finishPlan()
				})
				.catch()
		},
		async finishPlan() {
			const params = { uid: this.model.uid }
			const { code } = await finishPlan(params)
			if (code === '00000000') {
				this.$message({
					type: 'success',
					message: '已完成！',
				})
				this.getPlanDetails()
			} else {
				this.$message({
					type: 'error',
					message: '完成计划失败！',
				})
			}
		},
		async publish() {
			this.$confirm('是否确认发布？', '提示')
				.then(() => {
					this.publishPlan()
				})
				.catch()
		},
		async publishPlan() {
			const curDate = formatDate(new Date(), 'yyyy-MM-dd')
			if (
				new Date(`${curDate} 00:00:00`).getTime() -
					new Date(this.model.purchaseStartDate).getTime() >
				0
			) {
				this.$message('计划采购开始日期应不小于当前日期')
				return
			}
			const params = { uid: this.uid }
			const { code } = await publishPlan(params)
			if (code === '00000000') {
				this.$message({
					type: 'success',
					message: '发布成功！',
				})
				this.getPlanDetails()
			} else {
				this.$message({
					type: 'error',
					message: '发布失败！',
				})
			}
		},
		async getPlanDetails() {
			const params = { uid: this.uid }
			const { code, data } = await getPlanDetails(params)
			if (code === '00000000') {
				this.model = data
			}
		},
		// 获取供应商列表
		async getSupplierList(supplierUid) {
			const params = {
				unitUid: this.unitUid,
				useFlag: '1',
			}
			const { code, data } = await getSupplierList(params)
			if (code === '00000000') {
				// 选中的供应商不在供应商列表中，证明被禁用
				if (!data.some(({ uid }) => uid === supplierUid)) {
					this.$message({
						type: 'error',
						message: '该供应商已被禁用',
					})
					return
				}
				// 跳转到新增采购单页面
				this.$router.push({
					name: 'addOrEditPurchase',
					query: {
						flag: 'add',
					},
				})
				const sendMessage = {
					purchasePlanUid: this.uid,
					supplierUid,
					resourceList: this.selectedPurchase,
				}
				localStorage.setItem('producePurchaseInfo', JSON.stringify(sendMessage))
			}
		},
	},
}
</script>

<style lang='scss' scoped>
.status_img {
	position: absolute;
	right: 10%;
	top: 0;
}
/deep/ .el-row {
	margin-bottom: 30px;
	font-size: 14px;
	.el-col {
		padding-right: 10px;
	}
}
.title {
	color: #333333;
	font-weight: bold;
	position: relative;
}
.short_width {
	width: 70%;
}
.base_info {
	margin-bottom: 0;
	span {
		color: #333333;
		& + span {
			margin-left: 100px;
		}
	}
	& + .base_info {
		margin-top: 10px;
	}
}
.order {
	margin-left: 10px;
	color: $main_color;
	cursor: pointer;
	& + .order {
		margin-left: 20px;
	}
}
.tips {
	font-size: 12px;
	color: #999999;
	margin-left: 10px;
}
.gray_line {
	margin-right: 20px;
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
.supplies_table {
	.el-form-item {
		margin: 18px 0;
	}
}
</style>
