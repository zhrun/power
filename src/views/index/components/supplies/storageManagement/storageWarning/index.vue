<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_container">
      <el-scrollbar style="height:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-form-item label="预警类型" prop="warningType">
            <el-select v-model="searchForm.warningType" placeholder="请选择预警类型">
              <el-option
                v-for="item in warningTypeList"
                :key="item.dictKey"
                :value="item.dictKey"
                :label="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物资名称" prop="keyword">
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
          <el-table-column prop="storage" label="库存总数">
						<template slot-scope="{row}">
							{{row.storage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="availableStorage" label="可用库存">
						<template slot-scope="{row}">
							{{row.availableStorage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="maxWarningValue" label="上限预警值">
          </el-table-column>
          <el-table-column prop="minWarningValue" label="下限预警值">
          </el-table-column>
          <el-table-column prop="warningTypeName" label="预警类型">
          </el-table-column>
          <el-table-column prop="" label="操作" width="120px">
            <template slot-scope="{row}">
              <span class="handle_btn" @click="viewStorage(row)">查看库存明细</span>
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
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import VisBreadcrumb from '_com/breadcrumb.vue'
import {
	getStorageWarningList,
	exportStorageWarningListUrl,
} from '_api/supplies/api.yy'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'

export default {
	name: 'StorageWarning',
	components: { VisBreadcrumb },
	filters: {
		category({ category1, category2, category3, category4 }) {
			return `${category1}${category2 ? '-' + category2 : ''}${
				category3 ? '-' + category3 : ''
			}${category4 ? '-' + category4 : ''}`
		},
	},
	data: () => ({
		breadcrumbData: [{ name: '仓储管理' }, { name: '库存预警' }],
		searchForm: {
			warningType: '',
			keyword: '',
			pageNum: 1,
			pageSize: 10,
		},
		warningTypeList: [],
		tableData: [],
		total: 0,
		loading: false,
		isFromMsg:true
	}),
	created() {
		this.doSearch()
		this.getDictTypes()
	},
	activated() {
		this.doSearch()
	},
	methods: {
		doSearch: _debounce(function() {
			this.getStorageWarningList()
		}, 500),
		reset() {
			this.$refs.searchForm.resetFields()
			this.getStorageWarningList()
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
		getDictTypes() {
      const dicTypeStr = localStorage.getItem('dic_type')
      // 所有字典数据
      const allDictType = (dicTypeStr && JSON.parse(dicTypeStr)) || []
      // 库存预警类型字典表
      this.warningTypeList = allDictType.find(({ dictType }) => dictType === '23').dictList
    },
		viewStorage({ categoryUid }) {
			this.$router.push({
				name: 'storageDetail',
				query: { categoryUid },
			})
		},
		buildParams() {
			const {
				warningType,
				keyword,
				pageNum,
				pageSize,
			} = _cloneDeep(this.searchForm)
			const params = {
				'where.warningType': warningType || null,
				'where.keyword': keyword || null,
				"where.warningUid":(this.$route.query && this.$route.query.uid) && this.isFromMsg?this.$route.query.uid:null,
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
			)}导出的库存预警数据.xls`
			exportFn(
				exportStorageWarningListUrl,
				params,
				null,
				null,
				downloadFullName
			)
		}, 500),
		// 查询采购计划列表
		async getStorageWarningList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getStorageWarningList(params)
				if (code === '00000000' && data) {
					const { list, total } = data
					this.tableData = list
					this.total = total
					if(this.problemData.length==0 && this.isFromMsg && (this.$route.query && this.$route.query.uid)){
						this.$message({
							message: "该记录已被消除",
							type: 'warning'
						})
					}
				}
				this.isFromMsg=false
				this.loading = false
			} catch (error) {
				this.isFromMsg=false
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
	padding-right: 20px;
	background: #fff;
	border-radius: 15px;
	padding-top: 10px;
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
