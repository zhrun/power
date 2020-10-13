<template>
  <el-scrollbar class="main_container">
    <div class="filter_container">
      <div style="width:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-form-item label="物资" prop="keyword">
            <el-input v-model.trim="searchForm.keyword" placeholder="请输入物资名称或编号" @keyup.enter.native="doSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
						<el-button @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width:100%" v-loading="loading">
          <el-table-column prop="resourceName" label="物资名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="resourceCode" label="编号" min-width="100%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="measuringUnitName" label="计量单位" width="90px">
          </el-table-column>
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
          <el-table-column label="库存总数" show-overflow-tooltip>
						<template slot-scope="{row}">
							{{row.storage || 0}}
						</template>
          </el-table-column>
          <el-table-column label="可用库存" show-overflow-tooltip>
						<template slot-scope="{row}">
							{{row.availableStorage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="maxWarningValue" label="上限预警" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="minWarningValue" label="下限预警" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="" label="操作" width="120px">
            <template slot-scope="{row}">
              <span class="handle_btn" @click="viewItem(row)">查看库存明细</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="searchForm.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="searchForm.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import {
	getStorageStatisticsList,
	exportStorageStatisticsListUrl,
} from '_api/supplies/api.yy'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'

export default {
	name: 'StorageStatistics',
	data: () => ({
		searchForm: {
			unitUid: '',
			keyword: '',
			pageNum: 1,
			pageSize: 10,
		},
		tableData: [],
		total: 0,
		loading: false,
	}),
	created() {
		this.doSearch()
		const userInfoStr = localStorage.getItem('vis_user_info')
		const { dutyUserInfo } = userInfoStr && JSON.parse(userInfoStr)
		this.searchForm.unitUid = dutyUserInfo.unitUid
	},
	methods: {
		doSearch: _debounce(function() {
			this.getStorageStatisticsList()
		}, 500),
		reset() {
			this.$refs.searchForm.resetFields()
			this.getStorageStatisticsList()
		},
		viewItem({ uid }) {
			this.$router.push({
				name: 'storageDetail',
				query: {
					categoryUid: uid,
				},
			})
		},
		handleSizeChange(val) {
			this.searchForm.pageSize = val
			this.searchForm.pageNum = 1
			this.doSearch()
		},
		handleCurrentChange(val) {
			this.searchForm.pageNum = val
			this.doSearch()
		},
		buildParams() {
			const { unitUid, keyword, pageNum, pageSize } = _cloneDeep(
				this.searchForm
			)
			const params = {
				'where.unitUid': unitUid || null,
				'where.keyword': keyword || null,
				pageNum: pageNum,
				pageSize: pageSize,
			}
			return params
		},
		exportData: _debounce(function() {
			const params = this.buildParams()
			delete params.pageNum
			params.pageSize = this.total
			const downloadFullName = `${formatDate(
				new Date(),
				'yyyyMMdd'
			)}导出的库存统计数据.xls`
			exportFn(
				exportStorageStatisticsListUrl,
				params,
				null,
				null,
				downloadFullName
			)
		}, 500),
		// 查询采购计划列表
		async getStorageStatisticsList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getStorageStatisticsList(params)
				if (code === '00000000' && data) {
					const { list, total } = data
					this.tableData = list
					this.total = total
				}
				this.loading = false
			} catch (error) {
				this.loading = false
			}
		},
	},
}
</script>

<style lang='scss' scoped>
.main_container {
	height: calc(100% - 75px);
	padding-top: 20px;
}
/deep/.el-date-editor {
	.el-range-separator {
		width: 20px;
	}
}
.form-buttons {
	margin-bottom: 10px;
}
.status1 {
	color: #00a405;
}
.status2 {
	color: #5458fe;
}
</style>
