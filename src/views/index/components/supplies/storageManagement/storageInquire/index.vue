<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_content br15">
				<common-tabs v-model="tabValue" :tabList="tabList"></common-tabs>
				<storage-statistics ref="storageStatistics" v-if="tabValue === '1'" key="statistics"></storage-statistics>
				<storage-statement
					v-else
					ref="storageStatement"
					key="statement"
					:warehouseUid="warehouseUid"
					:resourceCode="resourceCode"
				></storage-statement>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import CommonTabs from '@/components/common/CommonTabs'
import StorageStatistics from './StorageStatistics'
import StorageStatement from './StorageStatement'

export default {
	name: 'StorageInquire',
	components: { visBreadcrumb, CommonTabs, StorageStatistics, StorageStatement },
	props: {
		tabIndex: {
			type: String,
			default: '1'
		},
		warehouseUid: {
			type: String,
			default: ''
		},
		resourceCode: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			breadcrumbData: [{ name: '仓储管理' }, { name: '库存查询' }],
			tabList: [
				{
					name: '库存统计',
					value: '1',
				},
				{
					name: '库存流水',
					value: '2',
				},
			],
			tabValue: '1',
		}
	},
	activated() {
		this.tabValue = this.tabIndex
		// const curCom = this.$refs[this.tabValue === '1' ? 'storageStatistics' : 'storageStatement']
		// curCom && curCom.doSearch()
	}
}
</script>

<style lang="scss" scoped>
</style>
