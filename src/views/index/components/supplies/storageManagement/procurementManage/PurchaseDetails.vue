<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<div class="main_content" v-loading="printLoading">
			<el-scrollbar style="height: 100%">
				<div ref="printContent">
					<el-row class="title">
						<img :src="statusImgs[`purchaseStatus${model.statusFlag}`]" alt="" class="status_img">
						<span class="title_text">基本信息</span>
						<span class="tips">{{`创建于${model.createTime}，最近更新于${model.updateTime}`}}</span>
					</el-row>
					<el-row class="short_width">
						<el-row class="base_info">
							<el-col :span="8">采购单编号：{{model.purchaseCode}}</el-col>
							<el-col :span="8" v-if="model.purchaseTypeFlag == '1'">相关采购计划：{{`${model.purchasePlanName}`}}</el-col>
							<el-col :span="8">采购类型：{{model.purchaseTypeFlag == '1' ? '计划采购' : '临时采购'}}</el-col>
						</el-row>
						<el-row class="base_info">
							<el-col :span="8">供应商：{{model.supplierName}}</el-col>
							<el-col :span="8">联系人：{{cantactPerson()}}</el-col>
							<el-col :span="8">交货日期：{{model.deliveryDate}}</el-col>
						</el-row>
						<el-row class="base_info">
							<el-col :span="8">采购员：{{model.purchaser}}</el-col>
							<el-col :span="8">存放仓库：{{model.warehouseName}}</el-col>
							<el-col :span="8" v-if="model.statusFlag == '3'">入库时间：{{model.warehousingDate}}</el-col>
						</el-row>
					</el-row>
					<el-row class="gray_line"></el-row>
					<div data-html2canvas-ignore='true'></div>
					<el-row class="title">采购明细表</el-row>
					<el-table
						class="supplies_table"
						:data="model.resourceList"
						style="width: 100%"
					>
						<el-table-column label="序号" width="110px">
							<template slot-scope="{$index}">
								{{$index + 1}}
							</template>
						</el-table-column>
						<el-table-column prop="resourceName" label="物资装备名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="resourceCode" label="物资装备编号" show-overflow-tooltip></el-table-column>
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
						<el-table-column prop="measuringUnit" label="单位">
							<template slot-scope="{row}">
								{{row.measuringUnit || '-'}}
							</template>
						</el-table-column>
						<el-table-column prop="purchaseNum" label="计划采购数量" width="110px"></el-table-column>
						<el-table-column prop="purchaseUnitPrice" label="预估单价（元）"></el-table-column>
						<el-table-column prop="total" label="合计（元）">
							<template slot-scope="{row}">
								{{row.purchaseUnitPrice * row.purchaseNum}}
							</template>
						</el-table-column>
						<el-table-column prop="actualQuantity" label="入库数量" v-if="model.statusFlag == '3'"></el-table-column>
					</el-table>
				</div>
				<div class="footer_button">
					<el-button @click="goBack">返回</el-button>
					<template v-if="model.statusFlag == 1">
						<el-button type="primary" @click="goToEdit">编辑</el-button>
						<el-button type="primary" @click="doPrint">打印</el-button>
						<el-button type="primary" @click="begin">开始采购</el-button>
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
import { getPurchaseDetails, beginPurchase } from '_api/supplies/api.yy'
import print from 'print-js'
import html2canvas from 'html2canvas'
import _get from 'lodash/get'

export default {
	name: 'PurchaseDetails',
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
			statusImgs: {
				purchaseStatus1: require('../../../../../../assets/img/supplies/purchaseStatus1.png'),
				purchaseStatus2: require('../../../../../../assets/img/supplies/purchaseStatus2.png'),
				purchaseStatus3: require('../../../../../../assets/img/supplies/purchaseStatus3.png'),
			},
			printLoading: false,
			measuringUnitList: [],
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			this.breadcrumbData.push({
				name: '采购单详情',
			})
			this.getPurchaseDetails()
			this.getDictTypes()
		},
		goBack() {
			this.$router.go(-1)
		},
		goToEdit() {
			this.$router.push({
				name: 'addOrEditPurchase',
				query: {
					uid: this.uid,
					flag: 'edit',
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
					// this.img = url
					print({
						printable: url,
						type: 'image',
						style: '@media print{@page {size:landscape}}',
						documentTitle: '采购单', // 打印的标题，显示在打印的上方
					})
					console.log(url)
					this.printLoading = false
				})
				.catch(() => {
					this.printLoading = false
				})
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
		cantactPerson() {
			const { contactPerson, contactPhone } = this.model
			if (!contactPerson && !contactPhone) {
				return '-'
			}
			return `${contactPerson || ''} ${contactPhone ? `(${contactPhone})` : ''}`
		},
		transformUnit(measuringUnit) {
			return _get(
				this.measuringUnitList.find(el => el.dictKey === measuringUnit),
				'dictValue',
				'-'
			)
		},
		async begin() {
			const params = { uid: this.uid }
			const { code } = await beginPurchase(params)
			if (code === '00000000') {
				this.getPurchaseDetails()
			}
		},
		async getPurchaseDetails() {
			const params = { uid: this.uid }
			const { code, data } = await getPurchaseDetails(params)
			if (code === '00000000') {
				this.model = data
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
.main_content {
	position: relative;
	.status_logo {
		position: absolute;
	}
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
