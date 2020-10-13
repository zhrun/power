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
	name: '',
	props: {
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
		axis: {
			type: Object,
			default: () => ({
				xAxis: 'type',
				y1Axis: 'value',
				y2Axis: 'amount',
			}),
		},
		options: {
			type: Object,
			required: true,
			default: () => {
				return {
					color: ['#5457EC', '#DD9522'],
					type: 'timeCat',
					mask: 'YYYY-MM-DD',
					y1Alias: '',
					y2Alias: '',
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
			const _this = this
			this.chart = new _Chart({
				container: this.chartId, // dom元素的id
				autoFit: true,
				width: '460', //宽度 px
				height: '400', // 高度 px
				padding: [100, 50, 50, 70], // 图表的内边距
			})
			this.chart.legend({
				// 图例
				position: 'top',
				custom: true,
				allowAllCanceled: false,
				items: [
					{
						value: '入库总额',
						marker: {
							symbol: 'square',
							fill: this.options.color[0],
							radius: 5,
						},
					},
					{
						value: '入库单数',
						marker: {
							symbol: 'hyphen',
							stroke: this.options.color[1],
							radius: 5,
							lineWidth: 3,
						},
					},
				],
				onClick: function onClick(ev) {
					var item = ev.item
					var value = item.value
					var checked = item.checked
					var geoms = _this.chart.getAllGeoms()
					for (var i = 0; i < geoms.length; i++) {
						var geom = geoms[i]
						if (geom.getYScale().field === value) {
							if (checked) {
								geom.show()
							}
						} else {
							geom.hide()
						}
					}
				},
			})
			this.chart.source(this.chartData)
			this.chart.axis(this.axis.y2Axis, {
				grid: null,
				label: {
					textStyle: {
						fill: this.options.color[1],
					},
				},
			})
			this.chart.scale(this.axis.y1Axis, {
				alias: this.options.y1Alias, // 设置别名
			})
			this.chart.scale(this.axis.y2Axis, {
				alias: this.options.y2Alias, // 设置别名
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
			})
			this.chart
				.interval()
				.position(`${this.axis.xAxis}*${this.axis.y1Axis}`)
				.color(this.options.color[0])
				.size(10)
			this.chart
				.line() // 折线图
				.position(`${this.axis.xAxis}*${this.axis.y2Axis}`) // 横坐标和纵坐标
				.color(this.options.color[1])
				// .shape('smooth') // 平滑的曲线
			// this.chart
			// 	.point() // 点图
			// 	.position('date*amount')
			// 	.color(this.options.color[1])
			// 	.size(3)
			// 	.shape('circle')
			this.chart.render()
		},
	},
	watch: {
		chartData: {
			handler(val) {
				// this.chart.changeData(val)
				this.chart.clear() // 清理所有图形
				this.chart.source(val) // 加载新数据
				this.chart.scale(this.axis.xAxis, {
					range: [0, 1],
					type: this.options.type,
					mask: this.options.mask,
				})
				this.chart
					.interval()
					.position(`${this.axis.xAxis}*${this.axis.y1Axis}`)
					.color(this.options.color[0])
					.size(10)
				this.chart
					.line() // 折线图
					.position(`${this.axis.xAxis}*${this.axis.y2Axis}`) // 横坐标和纵坐标
					.color(this.options.color[1])
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
	top: 45px;
	left: 15px;
}
</style>
