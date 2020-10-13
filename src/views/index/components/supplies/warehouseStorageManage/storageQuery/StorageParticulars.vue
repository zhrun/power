<template>
  <div>
		<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
		<div class="main_content" v-loading="loading">
			<el-scrollbar style="height: 100%">
					<el-row class="title">物资信息</el-row>
          <el-row class="base_info">
            <el-col :span="12">物资名称：{{model.resourceName}}</el-col>
            <el-col :span="12">物资编号：{{model.resourceCode}}</el-col>
          </el-row>
          <el-row class="base_info">
            <el-col :span="12">库存总数：{{model.storage || 0}}</el-col>
            <el-col :span="12">可用库存：{{model.availableStorage || 0}}</el-col>
          </el-row>
					<el-row class="gray_line"></el-row>
					<el-row class="title">库存明细</el-row>
					<el-table
						class="supplies_table"
						:data="model.locationGoodsStorageList"
						style="width: 100%"
					>
						<el-table-column prop="locationName" label="存放库位" show-overflow-tooltip align="center"></el-table-column>
						<el-table-column prop="storage" label="库存数量" align="center"></el-table-column>
						<!-- <el-table-column prop="availableStorage" label="可用库存"></el-table-column> -->
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
	name: 'StorageParticulars',
	props: {
		uid: {
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
				{ name: '库存查询', routerName: 'storageQuery' },
				{ name: '库存详情' },
			],
			model: {},
			loading: false,
		}
	},
	created() {
		this.getSuppliesStorageDetails()
	},
	methods: {
		viewStorageStatement({ warehouseUid }) {
			this.$router.push({
				name: 'storageStatement',
				query: {
					warehouse: warehouseUid,
				},
			})
		},
		goBack() {
			history.back()
		},
		async getSuppliesStorageDetails() {
			this.loading = true
			try {
				const params = {
					categoryUid: this.uid,
				}
				const { code, data } = await getSuppliesStorageDetails(params)
				if (code === '00000000') {
					this.model = data
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
</style>
