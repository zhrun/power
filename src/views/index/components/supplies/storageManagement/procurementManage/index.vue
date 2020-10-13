<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_content br15">
				<common-tabs v-model="tabValue" :tabList="tabList"></common-tabs>
				<procurement-plan ref="procurementPlan" v-if="tabValue === '1'" key="plan"></procurement-plan>
				<procurement-purchase ref="procurementPurchase" v-else key="order"></procurement-purchase>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import CommonTabs from '@/components/common/CommonTabs'
import ProcurementPlan from './ProcurementPlan'
import ProcurementPurchase from './ProcurementPurchase'

export default {
	name: 'ProcurementManagement',
	components: { visBreadcrumb, CommonTabs, ProcurementPlan, ProcurementPurchase },
	props: {
		tabIndex: {
			type: String,
			default: '1'
		}
	},
	data() {
		return {
			breadcrumbData: [{ name: '仓储管理' }, { name: '采购管理' }],
			tabList: [
				{
					name: '采购计划',
					value: '1',
				},
				{
					name: '采购单',
					value: '2',
				},
			],
			tabValue: '1',
		}
	},
	created() {
		this.tabValue = this.tabIndex
	},
	activated() {
		this.$refs[this.tabValue === '1' ? 'procurementPlan' : 'procurementPurchase'].doSearch()
	}
}
</script>

<style lang="scss" scoped>
</style>
