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
          <el-form-item label="存放仓库" prop="warehouseUid">
            <el-select v-model="searchForm.warehouseUid">
              <el-option
                v-for="item in warehouseList"
                :key="item.uid"
                :value="item.uid"
                :label="item.warehouseName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物资名称" prop="keyword">
            <el-input v-model.trim="searchForm.keyword" placeholder="请输入物资名称" @keyup.enter.native="doSearch"></el-input>
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
          <el-table-column prop="resourceCode" label="编号" width="180">
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
          <el-table-column prop="warehousingCode" label="入库单编号" width="160px">
          </el-table-column>
          <el-table-column prop="storage" label="库存总数">
						<template slot-scope="{row}">
							{{row.storage || 0}}
						</template>
          </el-table-column>
          <el-table-column prop="shelfLifeValueStr" label="保质期"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="生产日期" width="100">
						<template slot-scope="{row}">
							{{row.productionDate ? row.productionDate.slice(0, 10) : '-'}}
						</template>
          </el-table-column>
          <el-table-column label="有效期至" width="100">
						<template slot-scope="{row}">
							{{row.expireDate ? row.expireDate.slice(0, 10) : '-'}}
						</template>
          </el-table-column>
          <el-table-column prop="overdueDay" label="到/过期天数"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="warningTypeName" label="预警类型"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="warehouseName" label="存放仓库" show-overflow-tooltip>
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
	getExpiryDateWarningList,
	getWarehouseList,
	exportExpiryDateWarningListUrl,
} from '_api/supplies/api.yy'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'

export default {
	name: 'ExpiringDateWarnig',
	components: { VisBreadcrumb },
	data: () => ({
		breadcrumbData: [{ name: '仓储管理' }, { name: '保质期预警' }],
		searchForm: {
			warningType: '',
			keyword: '',
			unitUid: '',
			warehouseUid: '',
			pageNum: 1,
			pageSize: 10,
		},
		warningTypeList: [],
		warehouseList: [
			{
				warehouseName: '全部',
				uid: null,
			},
		],
		tableData: [],
		total: 0,
		loading: false,
		isFromMsg:true
	}),
	created() {
		this.doSearch()
		this.getDictTypes()
		this.getWarehouseList()
		const userInfoStr = localStorage.getItem('vis_user_info')
		const { dutyUserInfo } = (userInfoStr && JSON.parse(userInfoStr)) || {}
		this.searchForm.unitUid = dutyUserInfo.unitUid
	},
	activated() {
		this.doSearch()
	},
	methods: {
		doSearch: _debounce(function() {
			this.getExpiryDateWarningList()
		}, 500),
		reset() {
			this.$refs.searchForm.resetFields()
			this.getExpiryDateWarningList()
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
			// 保质期预警类型字典表
			this.warningTypeList = allDictType.find(
				({ dictType }) => dictType === '8'
			).dictList
		},
		buildParams() {
			const {
				unitUid,
				warningType,
				warehouseUid,
				keyword,
				pageNum,
				pageSize,
			} = _cloneDeep(this.searchForm)
			const params = {
				'where.unitUid': unitUid || null,
				'where.keyword': keyword || null,
				'where.warehouseUid': warehouseUid || null,
				'where.warningType': warningType || null,
				'where.warningUid':
					(this.$route.query && this.$route.query.uid) && this.isFromMsg
						? this.$route.query.uid
						: null,
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
			)}导出的保质期预警数据.xls`
			exportFn(
				exportExpiryDateWarningListUrl,
				params,
				null,
				null,
				downloadFullName
			)
		}, 500),
		// 查询保质期预警计划列表
		async getExpiryDateWarningList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getExpiryDateWarningList(params)
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
		// 获取仓库列表
		async getWarehouseList() {
			const params = {
				unitUid: this.searchForm.unitUid,
			}
			const { code, data } = await getWarehouseList(params)
			if (code === '00000000') {
				this.warehouseList.push(...data)
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
