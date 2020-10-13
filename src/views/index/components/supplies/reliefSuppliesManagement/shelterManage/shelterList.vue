<template>
<div>
<visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="main_content">
    <el-scrollbar style="height:100%;">
      <el-form :model="shelterInfo" inline>
              <el-form-item label="场所类型" style="width: 255px;">
                <el-select
                  v-model="shelterInfo.placeFlag"
                  placeholder="全部"
                  style="width: 180px;"
                >
                  <el-option
                    v-for="item in placeFlagList"
                    :key="item.uid"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="联系人" style="width: 255px;">
                <el-input style="width: 180px;" placeholder="请搜索联系人姓名" v-model.trim="shelterInfo.contactName"></el-input>
              </el-form-item>

              <el-form-item label="场所名称" style="width: 255px;">
                <el-input @keyup.enter.native="doSearch" placeholder="请搜索场所名称" style="width: 180px;" v-model.trim="shelterInfo.placeName"></el-input>
              </el-form-item>

              <el-button type="primary" @click="doSearch">查询</el-button>
              <el-button @click="resetForm">重置</el-button>

          <el-row>
            <el-button type="primary" @click="addNew">新增</el-button>
            <el-button @click="exportData" >导出</el-button>
          </el-row>
          <el-row>
            <el-table style="width: 100%;margin-top:40px;" v-loading="loading" :data="tableData">
              <el-table-column label="场所编号" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.placeCode || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="避难所名称" show-overflow-tooltip width="100">
              <template slot-scope="scope">
                <span>{{scope.row.placeName || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="场所类型" show-overflow-tooltip> 
                <template slot-scope="scope">
                <span>{{scope.row.placeFlagName || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="位置" width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                <span>{{scope.row.position || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="面积(平方米)" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                <span>{{scope.row.areaSize || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="容纳人数(人)" show-overflow-tooltip width="120"> 
                <template slot-scope="scope">
                <span>{{scope.row.capacity || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="所属单位" show-overflow-tooltip>
                <template slot-scope="scope">
                <span>{{scope.row.affiliatedUnit || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="联系人" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                <span>{{scope.row.contactName || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="配套设施" width="240" show-overflow-tooltip>
                <template slot-scope="scope">
                <span>{{scope.row.supportingFacilities || '-'}}</span>
              </template>
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="{row}">
              <span class="handle_btn" @click="viewItem(row)">查看</span>
								<span class="handle_btn" @click="editshelter(row)">编辑</span>
								<span class="handle_btn" @click="handleDelete(row)">删除</span>
              </template>
          </el-table-column>
            </el-table>
          </el-row>

      </el-form>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="shelterInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="shelterInfo.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          style="display:flex;justify-content: center;"
          class="pagination_comp"
        ></el-pagination>
    </el-scrollbar>
  </div>
</div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import { getDicts,getShelterPage,deleteShelter,exportShelterUrl } from '@/views/index/api/supplies/api.xy'
import { exportFn, formatDate } from '@/utils/util'
import _debounce from 'lodash/debounce'
export default {
  name: 'professorlist',
  components: {
		visBreadcrumb,
	},
  props: {},
  data() {
    return {
      loading:false,
      total:0,
      shelterInfo: {
        affiliatedUnit: '',
        areaSize: '',
        buildTime: '',
        capacity: '',
        contactName: '',
        latitude: '',
        longitude: '',
        officePhone: '',
        placeCode: '',
        placeFlag: '',
        placeFlagName: '',
        placeName: '',
        position: '',
        remark: '',
        supportingFacilities: '',
        uid: '',
        },
      breadcrumbData: [
        { name: '救援资源' },
        { name: '避难场所' },
      ],
      tableData:[],
      placeFlagList:[],
    }
  },
  computed: {},
  created() {
    this.getPlace()
    this.getShelterPage()
  },
  activated(){
    this.getShelterPage()
  },
  methods: {
      handleSizeChange(val) {
			this.shelterInfo.pageSize = val
			this.shelterInfo.pageNum = 1
			this.doSearch()
		},
		handleCurrentChange(val) {
			this.shelterInfo.pageNum = val
			this.doSearch()
		},
    addNew() {
      this.$router.push({
        name: "addoreditshelter",
        query: {
          flag: 'add'
        }
      })
    },
    viewItem({ uid }) {
			this.$router.push({
				name: 'shelterdetails',
				query: {
					uid,
				},
			})
    },
    
    editshelter({ uid }) {
			this.$router.push({
				name: 'addoreditshelter',
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
          const params = {uid}
					this.deleteShelter(params)
					// this.$message({
					// 	type: 'success',
					// 	message: '删除成功!',
					// })
				})
				.catch(() => {})
    },
    // 删除物资
		async deleteShelter(params) {
			const { code } = await deleteShelter(params)
			if (code === '00000000') {
				this.$message({
					type: 'success',
					message: '删除成功！'
        })
        this.doSearch();
			}
    },
    //获取场所
        getPlace() {
        let params = {
            dictType: '9',
            parentId: '0',
        }
        getDicts(params)
            .then((res) => {
            if (res && res.code === '00000000') {
                if (res.data && res.data.length > 0) {
                res.data.map((item) => {
                    let placeFlag = {}
                    placeFlag.label = item.dictValue
                    placeFlag.value = item.dictKey
                    this.placeFlagList.push(placeFlag)
                })
                }
            }
            })
            .catch((error) => {
            console.log('接口报错=>', error)
            })
        },
     // 获取列表
    async getShelterPage() {
      const params = {
        "where.placeFlag": this.shelterInfo.placeFlag|| null,
        "where.placeName": this.shelterInfo.placeName|| null,
        "where.queryStr":this.shelterInfo.contactName|| null,
        pageNum: this.shelterInfo.pageNum,
        pageSize: this.shelterInfo.pageSize,
        orderBy: 'create_time',
        order: null,
      };
        this.loading = true;
      try {
        const { code, data } = await getShelterPage(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.total = data.total;
        }
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    exportData:_debounce(function(){
      const params = {
        "where.placeFlag": this.shelterInfo.placeFlag|| null,
        "where.placeName": this.shelterInfo.placeName|| null,
        "where.queryStr":this.shelterInfo.contactName|| null,
        // pageNum: this.shelterInfo.pageNum,
        pageSize: this.total,
        orderBy: 'create_time',
        order: null, 
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的避难场所数据.xls`
      exportFn(exportShelterUrl, params, null, null, downloadFullName)
    },500),
    doSearch: _debounce(function() {
			this.getShelterPage()
		}, 500),
    resetForm(){
      this.shelterInfo.placeFlag=''
      this.shelterInfo.placeName=''
      this.shelterInfo.contactName=''
      this.pageNum=1
      this.doSearch()
    }
  },
}
</script>

<style lang="scss" scoped>
.cont {
  line-height: 40px;
  color: red;
}
/deep/.bottom_buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 44px;
  margin-bottom: 49px;
  .el-button {
    width: 130px;
    & + .el-button {
      margin-left: 20px;
    }
  }
}
.fome_size{
  display: flex;
}
/deep/.el-form-item {
    width: 220px;
}
.handle_btn {
    cursor: pointer;
    font-size: 14px;
    color: $main_color;
    padding: 0 5px;
    position: relative;

    &:first-child {
      padding-left: 0px;
    }

    &:not(:first-child) {
      &::before {
        content: "";
        position: absolute;
        width: 1px;
        top: 3px;
        left: 0px;
        height: 15px;
        background-color: $main_color;
        display: inline-block;
      }
    }
 }
</style>
