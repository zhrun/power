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
							<chart-line-interval
								title="入库情况"
								chartId="inChartData"
								key="inChartData"
								:axis="axis"
								:chartData="inChartData"
								:options="inChartOptions"
							>
								<template v-slot:right>
									<el-radio-group class="right_buttons" v-model="inChartDimension" @change="changeInDimension">
										<el-radio-button label="month">本月</el-radio-button>
										<el-radio-button label="year">本年</el-radio-button>
									</el-radio-group>
								</template>
								<template v-slot:summaryInfo :info="inChartData">
									<div>
										<span class="info">入库总额：{{inChartData | total}}元</span>
										<span class="info">入库单数：{{inChartData | account}}</span>
									</div>
								</template>
							</chart-line-interval>
						</div>
						<div class="chart_box">
							<chart-line-interval
								title="出库情况"
								chartId="outChartData"
								key="outChartData"
								:axis="axis"
								:chartData="outChartData"
								:options="outChartOptions"
							>
								<template v-slot:right>
									<el-radio-group class="right_buttons" v-model="outChartDimension" @change="changeOutDimension">
										<el-radio-button label="month">本月</el-radio-button>
										<el-radio-button label="year">本年</el-radio-button>
									</el-radio-group>
								</template>
								<template v-slot:summaryInfo :info="outChartData">
									<div>
										<span class="info">出库总额：{{outChartData | total}}元</span>
										<span class="info">出库单数：{{outChartData | account}}</span>
									</div>
								</template>
							</chart-line-interval>
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
import ChartLineInterval from '_com/supplies/ChartLineInterval'
import { getWarehouseData } from '_api/supplies/api.yy'

export default {
	// 单位管理员-统计分析
	name: 'WarehouseManagerStatisticAnalysis',
	components: { VisBreadcrumb, ChartInterval, ChartLineInterval },
	filters: {
		total(val) {
			return val.reduce((pre, cur) => {
				return pre + cur.amount
			}, 0)
		},
		account(val) {
			return val.reduce((pre, cur) => {
				return pre + cur.value
			}, 0)
		},
	},
	data() {
		return {
			breadcrumbData: [{ name: '统计分析' }],
			statisticData: {},
			dataList: [],
			field: {
				resourceCount: '物资种数',
				overdueResourceCount: '超期物资数',
				expireResourceCount: '到期物资数',
			},
			warehouseTotalChartOptions: {
				color: 'l(90) 0:#BF8DFF 1:#5457EC',
			},
			warehouseAmountChartOptions: {
				color: 'l(90) 0:#60F9B1 1:#1870AD',
			},
			inChartOptions: {
				color: ['#5457EC', '#DD9522'],
				type: 'timeCat',
				mask: 'YYYY-MM-DD',
				y1Alias: '入库总额',
				y2Alias: '入库单数',
			},
			outChartOptions: {
				color: ['#5457EC', '#DD9522'],
				type: 'timeCat',
				mask: 'YYYY-MM-DD',
				y1Alias: '出库总额',
				y2Alias: '出库单数',
			},
			inChartData: [],
			inChartDimension: 'month', // 查询入库情况的维度
			outChartData: [],
			outChartDimension: 'month', // 查询出库情况的维度
			axis: {
				xAxis: 'type',
				y1Axis: 'amount',
				y2Axis: 'value',
			},
			loading: false,
		}
	},
	created() {
		this.getWarehouseData()
	},
	methods: {
		initData(data) {
			// 月份格式转换
			data.yearInChart = data.yearInChart.map(el => {
				el.type = `${el.type.split('-')[1].replace(/^0(.*)/, "$1")}月`
				return el
			})
			data.yearOutChart = data.yearOutChart.map(el => {
				el.type = `${el.type.split('-')[1].replace(/^0(.*)/, "$1")}月`
				return el
			})
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
			this.inChartData = this.statisticData[`${this.inChartDimension}InChart`]
			this.outChartData = this.statisticData[
				`${this.outChartDimension}OutChart`
			]
		},
		imgSrc({ id }) {
			return require(`@/assets/img/supplies/${id}.png`)
		},
		changeInDimension(val) {
			this.inChartOptions.type = val === 'month' ? 'timeCat' : 'cat'
			this.inChartOptions.mask = val === 'month' ? 'YYYY-MM-DD' : ''
			this.inChartData = this.statisticData[`${val}InChart`]
		},
		changeOutDimension(val) {
			this.outChartOptions.type = val === 'month' ? 'timeCat' : 'cat'
			this.outChartOptions.mask = val === 'month' ? 'YYYY-MM-DD' : ''
			this.outChartData = this.statisticData[`${val}OutChart`]
		},
		async getWarehouseData() {
			this.loading = true
			try {
				const { code, data } = await getWarehouseData()
				if (code === '00000000') {
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
	// justify-content: space-between;
	.data_box {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 280px;
		height: 90px;
		background: #EFF1FF;
		border-radius: 15px;
		margin-bottom: 30px;
		margin-right: 20px;
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
		border: 1px solid #e4e4e4;
		margin-bottom: 20px;
		margin-right: 15px;
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
