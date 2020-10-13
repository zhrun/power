<template>
  <el-scrollbar class="main_container">
    <div class="filter_container">
      <div style="width:100%">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker
              v-model="searchForm.createDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
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
          <el-form-item label="采购计划" prop="queryCondition">
            <el-input
              v-model.trim="searchForm.queryCondition"
              @keyup.enter.native="doSearch"
              suffix-icon="el-icon-doSearch"
              style="width:230px"
              placeholder="请输入采购计划的名称或编号"
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
        <el-table :data="tableData" style="width:100%" v-loading="loading">
          <el-table-column label="序号" width="50px">
            <template slot-scope="{$index}">
              {{$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="purchasePlanCode" label="采购计划编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="purchasePlanName" label="采购计划名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="planDate" label="计划采购日期" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.purchaseStartDate && row.purchaseStartDate.slice(0, 10)}} 至 {{row.purchaseStartDate && row.purchaseEndDate.slice(0, 10)}}
            </template>
          </el-table-column>
          <el-table-column prop="categoryCount" label="采购物资装备（种）" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="totalAmount" label="总金额（元）" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span :class="`status${row.statusFlag}`">{{row.statusFlag | status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="制表人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="" label="操作" width="180px">
            <template slot-scope="{row}">
              <span class="handle_btn" @click="viewItem(row)">查看</span>
							<template v-if="row.statusFlag == '1'">
								<span class="handle_btn" @click="publish(row)">发布</span>
								<span class="handle_btn" @click="editPlan(row)">编辑</span>
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
	getPlanList,
	exportPlanUrl,
	deletePlan,
	publishPlan,
} from '_api/supplies/api.yy'
import { PUBLICATION_STATUS } from '@/utils/suppliesDictionaries'
import { exportFn, formatDate } from '@/utils/util'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'

export default {
	name: 'ProcurementPlan',
	data: () => ({
		keyword: '',
		searchForm: {
			createDate: ['', ''],
			statusFlag: null,
			queryCondition: '',
			pageNum: 1,
			pageSize: 10,
		},
		pickerOptions: {
			disabledDate(time) {
				return time.getTime() > Date.now()
			},
		},
		statusList: [],
		tableData: [],
		total: 0,
		loading: false,
	}),
	filters: {
		status(val) {
			return PUBLICATION_STATUS[val]
		},
	},
	created() {
		this.doSearch()
		this.getDictTypes()
	},
	methods: {
		doSearch: _debounce(function() {
			this.getPlanList()
		}, 500),
		reset() {
			this.$refs.searchForm.resetFields()
			this.doSearch()
		},
		getDictTypes() {
			const dicTypeStr = localStorage.getItem('dic_type')
			// 所有字典数据
			const allDictType = (dicTypeStr && JSON.parse(dicTypeStr)) || []
			// 状态字典表
			const dictList = allDictType.find(({ dictType }) => dictType === '13')
				.dictList
			this.statusList = [
				{
					dictKey: '',
					dictValue: '全部',
				},
				...dictList,
			]
		},
		addNew() {
			this.$router.push({
				name: 'addOrEditPlan',
				query: {
					flag: 'add',
				},
			})
		},
		exportData: _debounce(function() {
			const params = this.buildParams()
			delete params.pageNum
			params.pageSize = this.total
			const downloadFullName = `${formatDate(
				new Date(),
				'yyyyMMdd'
			)}导出的采购计划数据.xls`
			exportFn(exportPlanUrl, params, null, null, downloadFullName)
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
		viewItem({ uid }) {
			this.$router.push({
				name: 'planDetails',
				query: {
					uid,
				},
			})
		},
		editPlan({ uid }) {
			this.$router.push({
				name: 'addOrEditPlan',
				query: {
					uid,
					flag: 'edit',
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
					this.deletePlan(params)
				})
				.catch(() => {})
		},
		buildParams() {
			const {
				createDate,
				statusFlag,
				queryCondition,
				pageNum,
				pageSize,
			} = _cloneDeep(this.searchForm)
			const params = {
				'where.createStartTime':
					(createDate &&
						createDate[0] &&
						formatDate(createDate[0], 'yyyy-MM-dd')) ||
					null,
				'where.createEndTime':
					(createDate &&
						createDate[1] &&
						formatDate(createDate[1], 'yyyy-MM-dd')) ||
					null,
				'where.statusFlag': statusFlag,
				'where.queryCondition': queryCondition,
				pageNum: pageNum,
				pageSize: pageSize,
			}
			return params
		},
		async publish(item) {
			this.$confirm('是否确认发布？', '提示')
				.then(() => {
					this.publishPlan(item)
				})
				.catch()
		},
		async publishPlan({ uid, purchaseStartDate }) {
			const curDate = formatDate(new Date(), 'yyyy-MM-dd')
			if (
				new Date(`${curDate} 00:00:00`).getTime() -
					new Date(purchaseStartDate).getTime() >
				0
			) {
				this.$message('计划采购开始日期应不小于当前日期')
				return
			}
			const params = { uid }
			const { code } = await publishPlan(params)
			if (code === '00000000') {
				this.$message({
					type: 'success',
					message: '发布成功！',
				})
				this.doSearch()
			} else {
				this.$message({
					type: 'error',
					message: '发布失败！',
				})
			}
		},
		// 查询采购计划列表
		async getPlanList() {
			this.loading = true
			try {
				const params = this.buildParams()
				const { code, data } = await getPlanList(params)
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
		// 删除采购计划
		async deletePlan(params) {
			try {
				const { code } = await deletePlan(params)
				if (code === '00000000') {
					this.$message({
						type: 'success',
						message: '删除成功！',
					})
					this.doSearch()
				}
			} catch (e) {
				this.doSearch()
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
.status1 {
	color: #00a405;
}
.status2 {
	color: #5458fe;
}
</style>
