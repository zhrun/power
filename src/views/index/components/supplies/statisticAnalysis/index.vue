<template>
  <div class="statistics usm">
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_content" v-loading="loading">
			<el-scrollbar style="height: 100%">
				<div class="main_content_box">
					<el-row class="title">数据总览</el-row>
					<div class="data_boxes">
						<div class="data_box" v-for="item in dataList" :key="item.id">
							<img :src="imgSrc(item)" alt="">
							<div class="box_text">
								<span class="box_text_data">{{item.data || 0}}</span>
								<span class="box_text_title">{{item.title}}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="main_content_box">
					<el-row class="title">统计分析</el-row>
					<div class="data_boxes">
						<div class="chart_box">
							<chart-interval
								title="库存总数"
								chartId="warehouseTotalChart"
								key="warehouseTotalChart"
								:chartData="statisticData.warehouseTotalChart"
								:options="warehouseTotalChartOptions"
							>
							</chart-interval>
						</div>
						<div class="chart_box">
							<chart-interval
								title="库存总额"
								chartId="warehouseAmountChart"
								key="warehouseAmountChart"
								:chartData="statisticData.warehouseAmountChart"
								:options="warehouseAmountChartOptions"
							></chart-interval>
						</div>
						<div class="chart_box">
							<chart-line
								title="采购情况"
								chartId="purchaseChartData"
								key="purchaseChartData"
								:chartData="purchaseChartData"
								:axis="purchaseChartAxis"
								:options="purchaseChartOptions"
							>
								<template v-slot:right>
									<el-radio-group class="right_buttons" v-model="purchaseChartDimension" @change="changeDimension">
										<el-radio-button label="month">本月</el-radio-button>
										<el-radio-button label="year">本年</el-radio-button>
									</el-radio-group>
								</template>
								<template v-slot:summaryInfo :info="purchaseChartData">
									<div>
										<span class="info">采购总额：{{purchaseChartData | total}}元</span>
										<span class="info">采购笔数：{{statisticData[`${purchaseChartDimension}PurchaseTotal`]}}</span>
									</div>
								</template>
							</chart-line>
						</div>
					</div>
				</div>
			</el-scrollbar>
    </div>
  </div>
</template>

<script>
import VisBreadcrumb from '_com/breadcrumb.vue'
import ChartInterval from '_com/supplies/ChartInterval'
import ChartLine from '_com/supplies/ChartLine'
import { getAdminData } from '_api/supplies/api.yy'

export default {
	// 单位管理员-统计分析
	name: 'StatisticAnalysis',
	components: { VisBreadcrumb, ChartInterval, ChartLine },
	filters: {
		total(val) {
			return val.reduce((pre, cur) => {
				return pre + cur.value
			}, 0)
		},
		account(val) {
			return val.filter(item => item.value > 0).length
		},
	},
	data() {
		return {
			breadcrumbData: [{ name: '统计分析' }],
			loading: false,
			statisticData: {},
			dataList: [],
			field: {
				resourceCount: '物资种数',
				oversupplyResourceCount: '超储物资数',
				lackResourceCount: '缺货物资数',
				overdueResourceCount: '超期物资数',
				expireResourceCount: '到期物资数',
				warehouseCount: '仓库总数',
				forceCount: '救援队伍数',
				expertCount: '应急专家数',
				vehicleCount: '应急车辆数',
				shelterCount: '避难场所数',
			},
			warehouseTotalChartOptions: {
				color: 'l(90) 0:#BF8DFF 1:#5457EC',
			},
			warehouseAmountChartOptions: {
				color: 'l(90) 0:#60F9B1 1:#1870AD',
			},
			purchaseChartOptions: {
				color: 'l(90) 0:#69E3FF 1:#6183FF',
				type: 'timeCat',
				mask: 'YYYY-MM-DD',
				yAlias: '采购总额',
			},
			purchaseChartAxis: {
				xAxis: 'type',
				yAxis: 'value',
			},
			purchaseChartData: [],
			purchaseChartDimension: 'month', // 查询采购情况的维度
		}
	},
	created() {
		this.getAdminData()
	},
	methods: {
		initData(data) {
			// 月份格式转换
			data.yearPurchaseChart = data.yearPurchaseChart.map(el => {
				el.type = `${el.type.split('-')[1].replace(/^0(.*)/, "$1")}月`
				return el
			})
			console.log('data', data.yearPurchaseChart[0]);
			this.statisticData = data
			const field = this.field
			this.dataList = Object.keys(field).reduce((pre, cur) => {
				const curData = {
					title: field[cur],
					data: data[cur],
					id: cur,
				}
				return [...pre, curData]
			}, [])
			this.purchaseChartData =
				this.statisticData[`${this.purchaseChartDimension}PurchaseChart`] || []
		},
		imgSrc({ id }) {
			return require(`@/assets/img/supplies/${id}.png`)
		},
		changeDimension(val) {
			this.purchaseChartOptions.type = val === 'month' ? 'timeCat' : 'cat'
			this.purchaseChartOptions.mask = val === 'month' ? 'YYYY-MM-DD' : ''
			this.purchaseChartData = this.statisticData[`${val}PurchaseChart`]
		},
		async getAdminData() {
			this.loading = true
			try {
				const { code, data } = await getAdminData()
				if (code === '00000000' && data) {
					this.initData(data)
				}
				this.loading = false
			} catch (error) {
				this.loading = false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.main_content {
	padding: 0;
	background: none;
}
.main_content_box {
	background: #ffffff;
	border-radius: 15px;
	padding: 20px 30px 0;
	& + .main_content_box {
		margin-top: 20px;
		padding-bottom: 30px;
	}
}
/deep/ .el-row {
	margin-bottom: 30px;
	font-size: 14px;
}
.title {
	color: #333333;
	font-weight: bold;
}
.data_boxes {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.data_box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 280px;
		height: 90px;
		background: #EFF1FF;
		border-radius: 15px;
		margin-bottom: 30px;
		i {
			font-size: 60px;
			color: #dd9522;
		}
	}
	.box_text {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 20px;
		.box_text_data {
			font-size: 28px;
			color: $main_color;
			font-weight: bold;
		}
		.box_text_title {
			font-size: 14px;
			color: #666666;
		}
	}
	.chart_box {
		border-radius: 5px;
		margin-bottom: 20px;
		border: 1px solid #e4e4e4;
	}
}
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	background-color: $main_color;
	border-color: $main_color;
	color: #ffffff;
}
/deep/ .el-radio-button__inner:hover {
	color: $main_color;
}
/deep/ .el-radio-button:first-child .el-radio-button__inner {
	border-radius: 8px 0 0 8px;
	padding: 5px 15px;
	font-size: 12px;
}
/deep/ .el-radio-button:last-child .el-radio-button__inner {
	border-radius: 0 8px 8px 0;
	padding: 5px 15px;
	font-size: 12px;
}
.info {
	font-size: 12px;
	font-weight: bold;
	color: #333333;
	& + .info {
		margin-left: 36px;
	}
}
</style>
