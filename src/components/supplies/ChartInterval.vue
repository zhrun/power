<template>
  <div style="position: relative">
    <div :id="chartId"></div>
    <span class="title">{{title}}</span>
  </div>
</template>

<script>
import G2 from '@antv/g2'
// import { View } from "@antv/data-set";

export default {
	name: 'ChartInterval', // 柱状图
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
		options: {
			type: Object,
			required: true,
			default: () => {
				return {
					color: 'l(90) 0:#BF8DFF 1:#5457EC',
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
				padding: [60, 30, 50, 30], // 图表的内边距
			})
			this.chart.source(this.chartData, {
				type: {
					range: [0, 1],
				},
			})
			this.chart.scale('value', {
				alias: this.title,
			})
			this.chart.axis('value', false) // value坐标轴不显示
			this.chart.axis('type', {
				tickLine: false,
				label: {
					offset: 28, // 坐标轴文本 label 距离坐标轴线的距离
					autoRotate: false, // 是否自动旋转
					htmlTemplate: value => {
						return `<p style="color:#333333;width: 48px;font-size:12px;text-align:center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${value}</p>`
					},
					textStyle: {
						textAlign: 'middle', // 文本对齐方向  start middle end
					},
				},
			})
			this.chart
				.interval() // 柱状图
				.position('type*value') // 横坐标和纵坐标
				// .tooltip(false) // 关闭提示框
				.label('value', {
					// 图形文字（图例上方的文字）
					position: 'start',
					offset: 10,
				})
				.color(this.options.color) // 渐变色
				.size(16)
			this.chart.render()
		},
		getFillAttrs(cfg) {
			var attrs = G2.Util.mix(
				{
					fill: cfg.color,
					fillOpacity: cfg.opacity,
				},
				cfg.style
			)
			return attrs
		},
		getRectPath(points) {
			var path = []
			for (var i = 0; i < points.length; i++) {
				var point = points[i]
				if (point) {
					var action = i === 0 ? 'M' : 'L'
					path.push([action, point.x, point.y])
				}
			}
			var first = points[0]
			path.push(['L', first.x, first.y])
			path.push(['z'])
			return path
		},
	},
	watch: {
		chartData: {
			handler(val) {
				this.chart.changeData(val)
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
</style>
