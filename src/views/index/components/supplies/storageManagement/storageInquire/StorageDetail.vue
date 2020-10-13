<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<div class="main_content">
			<el-scrollbar style="height: 100%">
					<el-row class="title">物资信息</el-row>
          <el-row class="base_info">
            <el-col :span="8">物资名称：{{model.resourceName}}</el-col>
            <el-col :span="8">物资编号：{{model.resourceCode}}</el-col>
            <el-col :span="8">库存总数：{{model.storage || 0}}</el-col>
          </el-row>
          <el-row class="base_info">
            <el-col :span="8">可用库存：{{model.availableStorage || 0}}</el-col>
            <el-col :span="8">上限预警值：{{model.maxStorageValue}}</el-col>
            <el-col :span="8">下限预警值：{{model.minStorageValue}}</el-col>
          </el-row>
					<el-row class="gray_line"></el-row>
					<el-row class="title">库存明细</el-row>
					<el-table
						class="supplies_table"
						:data="model.warehouseGoodsStorageList"
						style="width: 100%"
					>
						<el-table-column prop="warehouseName" label="存放仓库" show-overflow-tooltip></el-table-column>
						<el-table-column label="库存总数">
							<template slot-scope="{row}">
							{{row.totalStorage || 0}}
						</template>
						</el-table-column>
						<el-table-column label="可用库存">
							<template slot-scope="{row}">
							{{row.availableStorage || 0}}
						</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="{row}">
								<span class="handle_btn" @click="viewStorageStatement(row)">查看库存流水</span>
							</template>
						</el-table-column>
					</el-table>
				<div class="footer_button">
					<el-button @click="goBack">返回</el-button>
				</div>
			</el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import { getSuppliesStorageDetails } from '_api/supplies/api.yy'

export default {
	name: 'StorageDetail',
	props: {
		categoryUid: {
			type: String,
			default: '',
		},
	},
	components: {
		visBreadcrumb,
	},
	data() {
		return {
			breadcrumbData: [
				{ name: '仓储管理' },
				{ name: '库存查询', routerName: 'storageInquire' },
				{ name: '库存详情' },
			],
			model: {},
		}
	},
	created() {
		this.getSuppliesStorageDetails()
	},
	methods: {
		viewStorageStatement({ warehouseUid }) {
			this.$router.push({
				name: 'storageInquire',
				query: {
					tabIndex: '2',
				},
			})
			const storageStatementConditions = {
				warehouseUid,
					resourceCode: this.model.resourceCode,
			}
			localStorage.setItem('storage_statement_conditions', JSON.stringify(storageStatementConditions))
		},
		goBack() {
			history.back()
		},
		async getSuppliesStorageDetails() {
			const params = {
			categoryUid: this.categoryUid,
			}
			const { code, data } = await getSuppliesStorageDetails(params)
			if (code === '00000000') {
				// _assign(this.model, data)
				this.model = data
			}
		},
	},
}
</script>

<style lang='scss' scoped>
/deep/ .el-row {
	margin-bottom: 30px;
	font-size: 14px;
}
.title {
	color: #333333;
	font-weight: bold;
}
.short_width {
	width: 70%;
}
.base_info {
	margin-bottom: 0;
	span {
		color: #333333;
		& + span {
			margin-left: 100px;
		}
	}
	& + .base_info {
		margin-top: 10px;
	}
}
.order {
	margin-left: 10px;
	color: $main_color;
	cursor: pointer;
	& + .order {
		margin-left: 20px;
	}
}
.tips {
	font-size: 12px;
	color: #999999;
	margin-left: 10px;
}
.gray_line {
	margin-right: 20px;
	margin-top: 30px;
	border-bottom: 1px solid #e1e1e1;
}
.footer_button {
	text-align: center;
	margin-top: 30px;
	margin-bottom: 30px;
	.el-button + .el-button {
		margin-left: 10px;
	}
}
.supplies_table {
	.el-form-item {
		margin: 18px 0;
	}
}
.handle_btn {
	cursor: pointer;
	font-size: 14px;
	color: #5458fd;
	padding: 0 5px;
}
</style>
