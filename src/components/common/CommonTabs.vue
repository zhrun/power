<template>
  <div class="tabs">
    <span
			class="tab"
			:class="{'active': activeValue === item[defaultProps.value]}"
			v-for="item in tabList"
			:key="item[defaultProps.value]"
			@click="clickTab(item)"
		>{{item[defaultProps.name]}}</span>
  </div>
</template>

<script>
export default {
	name: 'common-tabs',
	props: {
		// 标签数据
		tabList: {
			type: Array,
			required: true,
			default() {
				return []
			},
		},
		// 显示在tab中的字段名
		defaultProps: {
			type: Object,
			default() {
				return {
					name: 'name',
					value: 'value',
				}
			},
		},
		// 绑定的值，即当前选中的某个tab
		value: {
			type: String,
			required: true,
			default: '',
		},
	},
	data: () => ({
		activeValue: '',
	}),
	methods: {
		// 点击tab
		clickTab(item) {
			this.activeValue = item[this.defaultProps.value]
			this.$emit('input', this.activeValue)
		},
	},
	watch: {
		// 监听绑定的值
		value: {
			handler(val) {
				this.activeValue = val
			},
			immediate: true,
		},
	},
}
</script>

<style lang='scss' scoped>
.tabs {
	margin-top: 10px;
	padding-bottom: 15px;
	margin-right: 20px;
	border-bottom: 1px solid #e1e1e1;
	.tab {
		cursor: pointer;
		font-size: 14px;
		font-family: 'PingFangSC-Medium, PingFang SC';
		font-weight: 500;
		color: #999999;
		position: relative;
		margin-left: 10px;
		&.active {
			color: #5458fe;
			&::after {
				content: '';
				width: 28px;
				height: 3px;
				position: absolute;
				background: #5458fe;
				border-radius: 2px;
				left: 50%;
				bottom: 0;
				margin-left: -14px;
				margin-bottom: -8px;
			}
		}
		& + .tab {
			margin-left: 40px;
		}
	}
}
</style>
