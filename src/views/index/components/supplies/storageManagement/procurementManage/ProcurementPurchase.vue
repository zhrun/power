<template>
  <el-scrollbar class="main_container">
    <div class="filter_container">
      <div style="width:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-form-item label="交货日期" prop="deliveryDate">
            <el-date-picker
              v-model="searchForm.deliveryDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
              style="width: 250px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="statusFlag">
            <el-select v-model="searchForm.statusFlag" style="width: 120px">
              <el-option
                v-for="item in statusList"
                :key="item.dictKey"
                :value="item.dictKey"
                :label="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存放仓库" prop="warehouseUid">
            <el-select v-model="searchForm.warehouseUid">
              <el-option
                v-for="item in warehouseList"
                :key="item.uid"
                :label="item.warehouseName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购计划名称" prop="purchasePlanName">
            <el-input
              v-model.trim="searchForm.purchasePlanName"
              @keyup.enter.native="doSearch"
              suffix-icon="el-icon-doSearch"
              placeholder="请输入采购计划名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="采购单编号" prop="purchaseCode">
            <el-input
              v-model.trim="searchForm.purchaseCode"
              @keyup.enter.native="doSearch"
              suffix-icon="el-icon-doSearch"
              placeholder="请输入采购单编号"
              style="width:170px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="form-buttons">
          <el-button type="primary" @click="addNew">新增</el-button>
          <el-button @click="exportData">导出</el-button>
        </div>
        <el-table :data="tableData" v-loading="loading" style="width:100%">
          <el-table-column label="序号" width="50px">
            <template slot-scope="{$index}">
              {{$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseCode" label="采购单编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="purchaseTypeFlag" label="采购类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="关联采购计划" show-overflow-tooltip>
						<template slot-scope="{row}">
								<span class="handle_btn" @click="goToPlan(row)">{{row.purchasePlanName || '-'}}</span>
							</template>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="交货日期" show-overflow-tooltip>
						<template slot-scope="{row}">
							<span>{{row.deliveryDate.slice(0, 10)}}</span>
						</template>
          </el-table-column>
          <el-table-column prop="warehouseName" label="存放仓库" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="categoryCount" label="采购物资装备（种）" width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="totalAmount" label="采购金额（元）" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{row.statusFlag | status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="140px">
            <template slot-scope="{row}">
              <span class="handle_btn" @click="viewItem(row)">查看</span>
              <template v-if="row.statusFlag == '1'">
                <span class="handle_btn" @click="editPurchase(row)">编辑</span>
                <span class="handle_btn" @click="handleDelete(row)">删除</span>
              </template>
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
	getPurchaseList,
	exportPurchaseUrl,
	deletePurchase,
	getWarehouseList,
} from '_api/supplies/api.yy'
import { PROCUREMENT_ORDER_STATUS } from '@/utils/suppliesDictionaries'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'
import _get from 'lodash/get'

export default {
	name: 'ProcurementPurchase',
	data: () => ({
		keyword: '',
		searchForm: {
			deliveryDate: '',
			statusFlag: null,
			warehouseUid: '',
			purchasePlanName: '',
			purchaseCode: '',
			pageNum: 1,
			pageSize: 10,
		},
		statusList: [],
		warehouseList: [],
		tableData: [],
		total: 0,
		loading: false,
		unitUid: '',
	}),
	filters: {
		status(val) {
			return PROCUREMENT_ORDER_STATUS[val]
		},
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			const userInfoStr = localStorage.getItem('vis_user_info')
			const userInfo = (userInfoStr && JSON.parse(userInfoStr)) || {}
			this.unitUid = _get(userInfo, 'dutyUserInfo.unitUid', '')
			this.getDictTypes()
			this.getWarehouseList()
			this.doSearch()
			localStorage.removeItem('producePurchaseInfo')
		},
		doSearch: _debounce(function() {
			this.getPurchaseList()
		}, 500),
		reset() {
			this.$refs.searchForm.resetFields()
			this.searchForm.pageNum = 1
			this.doSearch()
		},
		getDictTypes() {
			const dicTypeStr = localStorage.getItem('dic_type')
			// 所有字典数据
			const allDictType = (dicTypeStr && JSON.parse(dicTypeStr)) || []
			// 状态字典表
			const dictList = allDictType.find(({ dictType }) => dictType === '12')
				.dictList
			this.statusList = [
				{
					dictKey: '',
					dictValue: '全部',
				},
				...dictList,
			]
		},
		goToPlan({ purchasePlanUid }) {
			if(purchasePlanUid){
				this.$router.push({
				name: 'planDetails',
				query: {
					uid: purchasePlanUid,
				},
				})
			}
			
		},
		viewItem({ uid }) {
			this.$router.push({
				name: 'purchaseDetails',
				query: {
					uid,
				},
			})
		},
		editPurchase({ uid }) {
			this.$router.push({
				name: 'addOrEditPurchase',
				query: {
					flag: 'edit',
					uid,
				},
			})
		},
		addNew() {
			this.$router.push({
				name: 'addOrEditPurchase',
				query: {
					flag: 'add',
				},
			})
		},
		handleDelete({ uid }) {
			this.$confirm('是否删除？删除后不可恢复。', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					const params = { uid }
					this.deletePurchase(params)
				})
				.catch(() => {})
		},
		buildParams() {
			const {
				deliveryDate,
				statusFlag,
				warehouseUid,
				purchasePlanName,
				purchaseCode,
				pageNum,
				pageSize,
			} = _cloneDeep(this.searchForm)
			const params = {}
			params['where.deliveryStartDate'] = deliveryDate[0] || null
			params['where.deliveryEndDate'] = deliveryDate[1] || null
			params['where.statusFlag'] = statusFlag || null
			params['where.warehouseUid'] = warehouseUid || null
			params['where.purchasePlanName'] = purchasePlanName || null
			params['where.purchaseCode'] = purchaseCode || null
			params.pageNum = pageNum
			params.pageSize = pageSize
			return params
		},
		async deletePurchase(params) {
			const { code } = await deletePurchase(params)
			if (code === '00000000') {
				this.$message({
					type: 'success',
					message: '删除成功！',
				})
				this.doSearch()
			}
		},
		exportData: _debounce(function() {
			const downloadFullName = `${formatDate(
				new Date(),
				'yyyyMMdd'
			)}导出的采购单数据.xls`
			const params = this.buildParams()
			delete params.pageNum
			params.pageSize = this.total
			exportFn(exportPurchaseUrl, params, null, null, downloadFullName)
		}, 500),
		handleSizeChange(val) {
			this.searchForm.pageSize = val
			this.searchForm.pageNum = 1
			this.doSearch()
		},
		handleCurrentChange(val) {
			this.searchForm.pageNum = val
			this.doSearch()
		},
		async getPurchaseList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getPurchaseList(params)
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
		// 根据单位id获取仓库列表
		async getWarehouseList() {
			const params = {
				unitUid: this.unitUid,
				useFlag: '1',
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
		color: #ccc;
	}
}
.form-buttons {
	margin-bottom: 10px;
}
.status0 {
	color: #00a405;
}
.status1 {
	color: #5458fe;
}
</style>
