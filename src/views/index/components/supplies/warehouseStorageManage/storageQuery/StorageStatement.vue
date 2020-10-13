<template>
  <el-scrollbar class="main_container">
    <div class="filter_container">
      <div style="width:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <!-- <el-form-item label="仓库" prop="warehouse">
            <el-select v-model="searchForm.warehouse">
              <el-option
                v-for="item in warehouseList"
                :key="item.uid"
                :value="item.uid"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="物资" prop="keyword">
            <el-input v-model.trim="searchForm.keyword" placeholder="请输入物资名称或编号"></el-input>
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
          <el-table-column prop="listCode" label="单据编号" width="180">
          </el-table-column>
          <el-table-column label="库位" width="" show-overflow-tooltip>
						<template slot-scope="{row}">
							{{row.locationName || '-'}}
						</template>
          </el-table-column>
          <el-table-column prop="initialStorage" label="期初库存" width="">
						<template slot-scope="{row}">
							{{row.initialStorage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="changeNum" label="变动数据" width="">
						<template slot-scope="{row}">
							{{row.changeNum || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="afterStorage" label="期末库存" width="">
						<template slot-scope="{row}">
							{{row.afterStorage || 0}}
						</template>
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
} from '_api/supplies/api.yy'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'

export default {
	name: 'StorageStatement',
	props: {
		warehouseUid: {
			type: String,
			default: '',
	},
	},
	data: () => ({
		searchForm: {
			keyword: '',
			pageNum: 1,
			pageSize: 10,
		},
		tableData: [],
		total: 0,
		loading: false,
		bizTypeFlagList: require('@/mock/data/supplies/bussinessType.json'),
	}),
	created() {
		const userInfoStr = localStorage.getItem('vis_user_info')
		const { dutyUserInfo } = userInfoStr && JSON.parse(userInfoStr)
		this.searchForm.unitUid = dutyUserInfo.unitUid
		this.doSearch()
	},
	methods: {
		doSearch() {
			this.getStorageStatementList()
		},
		reset() {
			this.$refs.searchForm.resetFields()
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
		buildParams() {
			const { unitUid, keyword, pageNum, pageSize } = _cloneDeep(
				this.searchForm
			)
			const params = {
				'where.unitUid': unitUid || null,
				'where.keyword': keyword || null,
				'where.warehouseUid': this.warehouseUid || null,
				pageNum: pageNum,
				pageSize: pageSize,
			}
			return params
		},
		exportData() {
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
		},
		// 查询库存流水列表
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
