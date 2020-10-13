<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查询人员通讯录列表
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            rootId
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-form :model="formModel" ref="formModel" inline label-width="60px">
                <el-form-item label="级别" prop="levelId">
                  <el-select v-model="formModel.levelId" placeholder="请选择级别" style="width: 150px">
                <el-option v-for="item in levelOptions" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
              </el-select>
                </el-form-item>
                <el-form-item prop="searchKey">
                  <el-input v-model.trim="formModel.searchKey" @keyup.enter.native="doSearch" placeholder="请输入姓名/手机号/职务" style="width:278px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="doSearch">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.name || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="职务">
              <template slot-scope="scope">
                <span>{{scope.row.titleName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="级别">
              <template slot-scope="scope">
                <span>{{scope.row.levelName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{isNotOpen(scope.row) ? "****" : (scope.row.telephone || '-')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="办公电话">
              <template slot-scope="scope">
                <el-tooltip placement="left" :disabled="isNotOpen(scope.row) || !scope.row.userPhone" popper-class="popper">
                  <div slot="content">
										<span class="user_phone_tip" :class="[(index % 3 === 0 || index % 3 === 1) && index + 1 !== scope.row.userPhone.split(',').length ? 'has_after' : '']" v-for="(item ,index) in scope.row.userPhone.split(',')" :key="scope.row.uid + 'userPhone' + index">
											{{item}}
										</span>
                  </div>
                  <span>{{isNotOpen(scope.row) ? "****" : (scope.row.userPhone || '-' )}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="所属单位" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.unitName || '-'}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import orgTree from '@/components/common/orgTree'
import { queryUnitTree, queryPersonList } from '@/views/index/api/onDuty/api.yy.js'
import { getPostionList } from '@/views/index/api/onDuty/api.zr.js'

export default {
	name: 'PersonelAddressQuery',
	components: { visBreadcrumb, orgTree },
	data() {
		return {
			breadcrumbData: [{ name: '通讯录查询' }, { name: '人员通讯录查询' }],
			treeData: [],
			rootId: '',
			tableData: [],
			defaultProps: {
				children: 'childList',
				label: 'unitName',
			},
			levelOptions: [],
			formModel: {
				searchKey: '',
				levelId: '',
			},
			unitUid: '',
			loading: false,
			pageNum: 1,
			pageSize: 10,
			total: 0,
			userInfo: {},
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			this.queryUnitTree()
			this.getLevelList()
			this.userInfo = JSON.parse(localStorage.getItem('vis_user_info') || '{}')
		},
		isNotOpen({ unitUid, phoneOpen }) {
			return unitUid !== this.userInfo.dutyUserInfo.unitUid && phoneOpen === 2
		},
		// 点击树节点
		handleNodeClick(data) {
			this.unitUid = data.uid
			this.pageNum = 1
			this.doSearch()
		},
		// 重置搜索条件
		resetForm() {
			this.$refs.formModel.resetFields()
			this.pageNum = 1
			this.doSearch()
		},
		// 触发搜索
		doSearch() {
			this.queryPersonList()
		},
		// 切换当前页码
		onPageChange(page) {
			this.pageNum = page
			this.doSearch()
		},
		// 切换每页展示条数
		handleSizeChange(val) {
			this.pageNum = 1
			this.pageSize = val
			this.doSearch()
		},
		// 获取级别列表
		async getLevelList() {
			try {
				const params = {
					'where.type': 2,
					pageSize: 0,
				}
				const { code, data } = await getPostionList(params)
				if (code === '00000000') {
					this.levelOptions = data.list
					this.levelOptions.unshift({
						uid: null,
						name: '全部',
					})
				}
			} catch (err) {
				console.log(err)
			}
		},
		// 获取前台机构树
		async queryUnitTree() {
			this.treeLoading = true
			try {
				const params = {
					filterType: 4,
				}
				const { code, data } = await queryUnitTree(params)
				if (code === '00000000' && data) {
					this.treeData = [data]
					this.rootId = data.uid
					this.unitUid = data.uid
					this.pageNum = 1
					this.doSearch()
					this.$nextTick(() => {
						this.$refs.tree.setCurrentKey(data.uid)
					})
				}
			} catch (error) {
				console.log(error)
			}
			this.treeLoading = false
		},
		// 获取人员通讯录列表
		async queryPersonList() {
			this.tableLoading = true
			try {
				const params = {
					'where.keyword': this.formModel.searchKey || null,
					'where.levelId': this.formModel.levelId || null,
					'where.unitId': this.unitUid || null,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					orderBy: 'sort_id',
					order: 'asc',
				}
				const { code, data } = await queryPersonList(params)
				if (code === '00000000') {
					this.tableData = data.list
					this.tableData.forEach(it => {
						it.userPhone = it.phoneList
							.reduce((pre, cur) => {
								return [...pre, cur.phone]
							}, [])
							.join(',')
					})
					this.total = data.total
				}
			} catch (err) {
				console.log(err)
			}
			this.tableLoading = false
		},
	},
}
</script>

<style lang="scss" scoped>
.user_phone_tip {
	display: inline-block;
	padding: 10px 0;
}
.has_after {
	&::after {
		content: '/';
		display: inline-block;
		margin-left: 5px;
		margin-right: 5px;
	}
}
</style>
