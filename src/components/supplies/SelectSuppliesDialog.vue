<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    top="10vh"
    @close="closeDialog"
  >
    <el-form ref="searchForm" inline :model="searchForm">
      <div class="space_between">
        <div>
          <el-form-item label="物资装备" prop="queryCondition">
            <el-input v-model.trim="searchForm.queryCondition" placeholder="请输入物资名称或编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </div>
        <el-form-item style="margin-right: 0">
          <el-button type="primary" @click="confirm">确定选择</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="table"
      :data="suppliesList"
      style="width: 100%"
      row-key="categoryUid"
			max-height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column prop="resourceName" label="物资装备名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resourceCode" label="物资装备编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="model" label="规格型号" show-overflow-tooltip>
				<template slot-scope="{row}">
					{{row.model || '-'}}
				</template>
			</el-table-column>
      <el-table-column prop="brand" label="品牌" show-overflow-tooltip>
				<template slot-scope="{row}">
					{{row.brand || '-'}}
				</template>
			</el-table-column>
      <el-table-column prop="storage" label="库存总数">
				<template slot-scope="{row}">
					{{row.storage || 0}}
				</template>
			</el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      @current-change="handleCurrentChange"
      :current-page.sync="searchForm.pageNum"
      :page-size="searchForm.pageSize"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep'
import _xorBy from 'lodash/xorBy'
import _remove from 'lodash/remove'

export default {
	name: 'SelectSuppliesDialog',
	props: {
		// 弹框是否打开的标志
		showDialog: {
			type: Boolean,
			required: true,
			default: false,
		},
		// 从外部传入的已选中的数据
		selectedList: {
			type: Array,
			required: true,
			default: () => [],
		},
		// 标题
		title: {
			type: String,
			required: true,
			default: '',
		},
		// 唯一性标志
		exclusiveKey: {
			type: String,
			default: 'categoryUid',
		},
		// 获取列表数据的函数
		getSuppliesListFn: {
			type: Function,
			required: true,
		},
		// 获取列表数据函数的参数
		getSuppliesListParams: {
			type: Object,
			required: true,
			default: () => {},
		},
	},
	data() {
		return {
			visible: false,
			searchForm: {
				queryCondition: '',
				pageNum: 1,
				pageSize: 10,
			},
			selectedSupplies: [],
			total: 0,
			suppliesList: [],
			difList: [],
		}
	},
	methods: {
		async doSearch() {
			const params = _cloneDeep(this.getSuppliesListParams)
			const { queryCondition, pageNum, pageSize } = this.searchForm
			params['where.queryCondition'] = queryCondition || null
			params.pageNum = pageNum
			params.pageSize = pageSize
			const { code, data } = await this.getSuppliesListFn(params)
			if (code === '00000000') {
				this.suppliesList = data.list
				this.total = data.total
			}
		},
		reset() {
			this.$refs.searchForm && this.$refs.searchForm.resetFields()
			this.doSearch()
		},
		handleCurrentChange(val) {
			this.searchForm.pageNum = val
			this.doSearch()
		},
		// 勾选了复选框callback
		handleSelectionChange(val) {
			this.selectedSupplies = val
		},
		// 点击确认
		confirm() {
			// 目前已选中的数据 和 最初传入的选中数据 对比的差值
			const difList = _xorBy(this.selectedSupplies, this.selectedList, this.exclusiveKey)
			// 初始化暴露出去的选中数据
			const newList = _cloneDeep(this.selectedList)
			difList.map(difItem => {
				const isExist = newList.some(({categoryUid}) => difItem.categoryUid === categoryUid)
				if (isExist) {
					_remove(newList, ({categoryUid}) => difItem.categoryUid === categoryUid)
				} else {
					newList.push(difItem)
				}
			})
			this.$emit('confirm', _cloneDeep(newList))
			this.closeDialog()
		},
		// 关闭弹框
		closeDialog() {
			this.$emit('update:showDialog', false)
		},
	},
	watch: {
		showDialog(val) {
			this.visible = val
			if (!val) return
			const _this = this
			this.$nextTick(() => {
				// 清空选中
				_this.$refs.table.clearSelection()
				// 根据外部传入的数据选中
				_this.selectedList.map(item => {
					_this.$refs.table.toggleRowSelection(item, true)
				})
				// 更新当前页，暂时解决第一页选不中的问题
				this.reset()
			})
		},
	},
}
</script>

<style lang='scss' scoped>
/deep/ .el-dialog {
	width: 60%;
}
/deep/ .el-dialog__header {
	background: #5458fe;
	border-radius: 8px 8px 0px 0px;
	padding: 15px 30px;
	.el-dialog__title {
		color: #ffffff;
		font-size: 14px;
		font-weight: bold;
	}
	.el-dialog__headerbtn {
		.el-dialog__close {
			color: #ffffff;
		}
		&:hover {
			.el-dialog__close {
				color: #ffffff;
			}
		}
	}
}
/deep/ .el-dialog__body {
	min-height: 70vh;
}
.space_between {
	display: flex;
	justify-content: space-between;
}
.pagination {
	margin-top: 40px;
	text-align: center;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
	background: $main_color;
}
</style>
