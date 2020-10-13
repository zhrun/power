<template>
  <el-scrollbar class="main_container">
    <div class="filter_container">
      <div style="width:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-form-item label="仓库" prop="warehouseUid">
            <el-select v-model="searchForm.warehouseUid">
              <el-option
                v-for="item in warehouseList"
                :key="item.uid"
                :value="item.uid"
                :label="item.warehouseName"
              ></el-option>
            </el-select>
          </el-form-item>
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
          <el-table-column prop="resourceCode" label="编号" width="180" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="业务类型">
						<template slot-scope="{row}">
							{{bizTypeFlag(row)}}
						</template>
          </el-table-column>
          <el-table-column prop="listCode" label="单据编号" width="160">
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="库位" width="180" show-overflow-tooltip>
						<template slot-scope="{row}">
							{{row.locationName || '-'}}
						</template>
          </el-table-column>
          <el-table-column label="期初库存">
						<template slot-scope="{row}">
							{{row.initialStorage || 0}}
						</template>
          </el-table-column>
          <el-table-column label="变动数据">
						<template slot-scope="{row}">
							{{row.changeNum || 0}}
						</template>
          </el-table-column>
          <el-table-column label="期末库存">
						<template slot-scope="{row}">
							{{row.afterStorage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="measuringUnitName" label="计量单位" width="90">
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
	getStorageStatementList,
	exportStorageStatementListUrl,
	getWarehouseList,
} from '_api/supplies/api.yy'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _debounce from 'lodash/debounce'

export default {
	name: 'StorageStatement',
	data: () => ({
		searchForm: {
			unitUid: '',
			warehouseUid: '',
			keyword: '',
			pageNum: 1,
			pageSize: 10,
		},
		warehouseList: [],
		tableData: [],
		total: 0,
		loading: false,
		bizTypeFlagList: require('@/mock/data/supplies/bussinessType.json'),
	}),
	created() {
		const userInfoStr = localStorage.getItem('vis_user_info')
		const { dutyUserInfo } = (userInfoStr && JSON.parse(userInfoStr)) || {}
		this.searchForm.unitUid = dutyUserInfo.unitUid
		// 从库存详情跳转带过来的仓库id和物资编号
		const conditionsStr = localStorage.getItem('storage_statement_conditions')
		const { warehouseUid, resourceCode } =
			(conditionsStr && JSON.parse(conditionsStr)) || {}
		this.searchForm.warehouseUid = warehouseUid
		this.searchForm.keyword = resourceCode
		this.getWarehouseList()
		this.doSearch()
		// 删除存储的条件信息
		localStorage.removeItem('storage_statement_conditions')
	},
	activated() {
			// 从库存详情跳转带过来的仓库id和物资编号
		const conditionsStr = localStorage.getItem('storage_statement_conditions')
		const { warehouseUid, resourceCode } =
			(conditionsStr && JSON.parse(conditionsStr)) || {}
		this.searchForm.warehouseUid = warehouseUid
		this.searchForm.keyword = resourceCode
		this.doSearch()
		// 删除存储的条件信息
		localStorage.removeItem('storage_statement_conditions')
	},
	methods: {
		doSearch: _debounce(function() {
			this.getStorageStatementList()
		}, 500),
		reset() {
			this.searchForm.warehouseUid = ''
			this.searchForm.keyword = ''
			this.getStorageStatementList()
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
		bizTypeFlag({ bizTypeFlag }) {
			const { dictValue } =
				_find(this.bizTypeFlagList, item => bizTypeFlag === item.dictKey) || {}
			return dictValue
		},
		exportData: _debounce(function() {
			const params = this.buildParams()
			delete params.pageNum
			params.pageSize = this.total
			const downloadFullName = `${formatDate(
				new Date(),
				'yyyyMMdd'
			)}导出的库存流水数据.xls`
			exportFn(
				exportStorageStatementListUrl,
				params,
				null,
				null,
				downloadFullName
			)
		}, 500),
		buildParams() {
			const { unitUid, warehouseUid, keyword, pageNum, pageSize } = _cloneDeep(
				this.searchForm
			)
			const params = {
				'where.unitUid': unitUid || null,
				'where.warehouseUid': warehouseUid || null,
				'where.keyword': keyword || null,
				pageNum: pageNum,
				pageSize: pageSize,
			}
			return params
		},
		// 查询采购计划列表
		async getStorageStatementList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getStorageStatementList(params)
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
		// 获取仓库列表
		async getWarehouseList() {
			const params = {
				unitUid: this.searchForm.unitUid,
			}
			const { code, data } = await getWarehouseList(params)
			if (code === '00000000') {
				this.warehouseList = data
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
