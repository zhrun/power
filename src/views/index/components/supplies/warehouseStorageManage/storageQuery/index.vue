<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_content br15">
				<common-tabs v-model="tabValue" :tabList="tabList"></common-tabs>
				<storage-statistics ref="storageStatistics" :warehouseUid="warehouseUid" v-if="tabValue === '1'" key="statistics"></storage-statistics>
				<storage-statement ref="storageStatement" :warehouseUid="warehouseUid" v-else key="statement"></storage-statement>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import CommonTabs from '@/components/common/CommonTabs'
import StorageStatistics from './StorageStatistics'
import StorageStatement from './StorageStatement'

export default {
	name: 'StorageQuery',
	components: {
		visBreadcrumb,
		CommonTabs,
		StorageStatistics,
		StorageStatement,
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
			warehouseUid: '', // 仓管员的仓库id
		}
	},
	created() {
		const warehouseListStr = localStorage.getItem('current_user_warehouse_list') || '[]'
		this.warehouseUid = JSON.parse(warehouseListStr)[0] && JSON.parse(warehouseListStr)[0].uid || ''
	},
	activated() {
		this.$refs[
			this.tabValue === '1' ? 'storageStatistics' : 'storageStatement'
		].doSearch()
	},
}
</script>

<style lang="scss" scoped>
</style>
