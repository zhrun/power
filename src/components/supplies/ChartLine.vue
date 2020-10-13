<template>
  <div style="position: relative">
    <div :id="chartId"></div>
    <span class="title">{{title}}</span>
    <div class="right_button">
      <slot name="right"></slot>
    </div>
    <div class="summary_info">
      <slot name="summaryInfo"></slot>
    </div>
  </div>
</template>

<script>
import G2 from '@antv/g2'

export default {
	name: 'ChartLine', // 折线图
	props: {
		axis: {
			type: Object,
			default: () => ({
				xAxis: 'date',
				yAxis: 'value',
			}),
		},
		chartId: {
			type: String,
			required: true,
			default: '',
		},
		title: {
			type: String,
			required: true,
			default: '',
		},
		chartData: {
			type: Array,
			required: true,
			default: () => {
				return []
			},
		},
		options: {
			type: Object,
			required: true,
			default: () => {
				return {
					color: 'l(90) 0:#BF8DFF 1:#5457EC',
					type: 'timeCat',
					mask: 'YYYY-MM-DD',
					yAlias: '采购总额',
				}
			},
		},
	},
	data() {
		return {
			chart: '',
		}
	},
	mounted() {
		this.renderChart()
	},
	methods: {
		renderChart() {
			const _Chart = G2.Chart
			this.chart = new _Chart({
				container: this.chartId, // dom元素的id
				autoFit: true,
				width: '460', //宽度 px
				height: '400', // 高度 px
				padding: [100, 30, 50, 70], // 图表的内边距
			})
			this.chart.source(this.chartData)
			this.chart.scale(this.axis.yAxis, {
				alias: this.options.yAlias, // 设置别名
			})
			this.chart.axis(this.axis.xAxis, {
				label: {
					offset: 25, // 坐标轴文本 label 距离坐标轴线的距离
					textStyle: {
						textAlign: 'center', // 文本对齐方向，可取值为： start middle end
						fill: '#999999', // 文本的颜色
						fontSize: '12', // 文本大小
						fontWeight: '300', // 文本粗细
						textBaseline: 'top', // 文本基准线，可取 top middle bottom，默认为middle
					},
				},
				tickLine: {
					length: -10, // 负值为刻度反向
				},
			})
			this.chart.scale(this.axis.xAxis, {
				// tickCount: 6, // 刻度的个数
				range: [0, 1],
				type: this.options.type,
				mask: this.options.mask,
				tickMethod: 'time-pretty',
			})
			this.chart
				.line() // 折线图
				.position(`${this.axis.xAxis}*${this.axis.yAxis}`) // 横坐标和纵坐标
				.color(this.options.color) // 渐变色
			this.chart.render()
		},
	},
	watch: {
		chartData: {
			handler(val) {
				this.chart.clear() // 清理所有图形
				this.chart.changeData(val)
				this.chart.source(this.chartData) // 加载新数据
				this.chart.scale(this.axis.xAxis, {
					// tickCount: 12, // 刻度的个数
					range: [0, 1],
					type: this.options.type,
					mask: this.options.mask,
					// tickMethod: 'time-pretty',
				})
				this.chart
					.line() // 折线图
					.position(`${this.axis.xAxis}*${this.axis.yAxis}`) // 横坐标和纵坐标
					.color(this.options.color) // 渐变色
				this.chart.render()
			},
			deep: true,
		},
	},
}
</script>

<style lang='scss' scoped>
.title {
	position: absolute;
	top: 15px;
	left: 15px;
	font-size: 14px;
	color: $main_color;
}
.right_button {
	position: absolute;
	top: 15px;
	right: 15px;
}
.summary_info {
	position: absolute;
	top: 50px;
	left: 30px;
}
</style>
