<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="main_content">
      <el-scrollbar style="height:100%;">
        <el-form :model="materialsInfo" inline>
          <el-row>
            <el-form-item label="所属资源:" style="margin-left:0px">
              <el-select
                placeholder="全部"
                style="width: 200px;"
                v-model="materialsInfo.assetTypeFlag"
              >
                <el-option
                  v-for="item in resourceTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类:">
              <div class="select_group">
                <el-select
                  placeholder="全部"
                  v-model="materialsInfo.catalogTypeFlag1"
                  @change="
                    (value) => {
                      handleCatalogType(value, 1)
                    }
                  "
                >
                  <el-option
                    v-for="item in catalogTypeFlag1List"
                    :key="item.uid"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  >
                  </el-option>
                </el-select>

                <el-select
                  placeholder="全部"
                  v-model="materialsInfo.catalogTypeFlag2"
                  @change="
                    (value) => {
                      handleCatalogType(value, 2)
                    }
                  "
                >
                  <el-option
                    v-for="item in catalogTypeFlag2List"
                    :key="item.uid"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>

                <el-select
                  placeholder="全部"
                  v-model="materialsInfo.catalogTypeFlag3"
                  @change="
                    (value) => {
                      handleCatalogType(value, 3)
                    }
                  "
                >
                  <el-option
                    v-for="item in catalogTypeFlag3List"
                    :key="item.uid"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>

                <el-select
                  placeholder="全部"
                  v-model="materialsInfo.catalogTypeFlag4"
                  @change="
                    (value) => {
                      handleCatalogType(value, 4)
                    }
                  "
                >
                  <el-option
                    v-for="item in catalogTypeFlag4List"
                    :key="item.uid"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="所属级别:">
              <el-select
                placeholder="全部"
                style="width:200px"
                v-model="materialsInfo.levelTypeFlag"
              >
                <el-option
                  v-for="item in levelTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label-width="142px"
              label="物资装备名称或编号:"
              prop="resourceName"
              style="margin-left: 0px;"
            >
              <el-input
                v-model="materialsInfo.resourceName"
                placeholder="请输入名称或编号"
                style="width:168px;"
                @keyup.enter.native="doSearch"
              ></el-input>

              <el-button
                @click.native="getResourcePage"
                type="primary"
                style="margin-left:10px"
                >查询</el-button
              >
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-row>

          <el-form-item class="bottom_buttons">
            <el-button type="primary" @click="addNew">新增</el-button>
            <el-button @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column label="物资装备编号" min-width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.resourceCode || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="物资装备名称"
            min-width="200px"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.resourceName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属资源" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.assetTypeFlagName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属级别" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.levelTypeFlagName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属分类" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{  scope.row.catalogTypeFlagName1 }}
                {{ scope.row.catalogTypeFlagName2? '-' +  scope.row.catalogTypeFlagName2: ''}}
                {{ scope.row.catalogTypeFlagName3? '-' +  scope.row.catalogTypeFlagName3: ''}}
                {{ scope.row.catalogTypeFlagName4? '-' +  scope.row.catalogTypeFlagName4: ''}}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="计量单位" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.measuringUnitName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.model || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="品牌" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.brand || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="160px">
            <template slot-scope="{ row }">
              <span class="handle_btn" @click="viewItem(row)">查看</span>
              <span class="handle_btn" @click="editmaterials(row)">编辑</span>
              <span class="handle_btn" @click="handleDelete(row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="materialsInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="materialsInfo.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          class="pagination_comp"
        ></el-pagination>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import {
  getResourcePage,
  getDicts,
  deleteResource,
  exportMaterialsUrl,
} from '@/views/index/api/supplies/api.xy'
import { exportFn, formatDate } from '@/utils/util'
// import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'
import visBreadcrumb from '_com/breadcrumb.vue'
export default {
  name: 'materials',
  components: {
    visBreadcrumb,
  },

  data() {
    return {
      // isFirstEnter:false ,
      loading: false,
      total: 0,
      storage: '',
      breadcrumbData: [{ name: '救援资源' }, { name: '物资装备 ' }],
      materialsTypeList: [], //物资装备类型
      levelTypeList: [], //所属级别
      resourceTypeList: [], //所属资源
      materialsInfo: {
        // uid:'',

        resourceName: '',
        assetTypeFlag: '',
        resourceTypeFlag: '',
        levelTypeFlag: '',
        catalogTypeFlag1: '',
        catalogTypeFlag2: '',
        catalogTypeFlag3: '',
        catalogTypeFlag4: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      uid: '',
      catalogTypeFlag1List: [], //大类
      catalogTypeFlag2List: [], //中类
      catalogTypeFlag3List: [], //小类
      catalogTypeFlag4List: [], //细类
    }
  },
  created() {
    this.init()
    // this.isFirstEnter=true 
  },
  activated() {
    this.getResourcePage()
  },
  methods: {
    exportData: _debounce(function() {
      const params = {
        'where.assetTypeFlag': this.materialsInfo.assetTypeFlag || null,
        'where.levelTypeFlag': this.materialsInfo.levelTypeFlag || null,
        'where.catalogTypeFlag1': this.materialsInfo.catalogTypeFlag1 || null,
        'where.catalogTypeFlag2': this.materialsInfo.catalogTypeFlag2 || null,
        'where.catalogTypeFlag3': this.materialsInfo.catalogTypeFlag3 || null,
        'where.catalogTypeFlag4': this.materialsInfo.catalogTypeFlag4 || null,
        'where.queryStr': this.materialsInfo.resourceName || null,
        // pageNum: this.materialsInfo.pageNum,
        pageSize: this.total,
        orderBy: 'create_time',
        order: 'desc',
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的物资装备数据.xls`
      exportFn(exportMaterialsUrl, params, null, null, downloadFullName)
    }, 500),
    handleSizeChange(val) {
      this.materialsInfo.pageSize = val
      this.materialsInfo.pageNum = 1
      this.doSearch()
    },
    handleCurrentChange(val) {
      this.materialsInfo.pageNum = val
      this.doSearch()
    },

    handleCatalogType(value, level) {
      const LENGTH = 4
      // 清空所有下级
      for (let i = level + 1; i < LENGTH + 1; i++) {
        this[`catalogTypeFlag${i}List`] = []
        this.materialsInfo[`catalogTypeFlag${i}`] = ''
      }
      // if (level + 1 === LENGTH) return
      if (level + 1 > LENGTH) return
      const list = this[`catalogTypeFlag${level}List`]
      const curItem = list.filter((it) => it.dictKey === value)
      const curId = curItem && curItem[0].dictId
      this.getcatalogType(curId, level + 1)
    },
    //获得所属分类
    getcatalogType(parentId, level) {
      let params = {
        dictType: '1',
        parentId,
      }
      getDicts(params)
        .then(({ code, data }) => {
          if (code === '00000000' && data) {
            this[`catalogTypeFlag${level}List`] = data
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },

    //获取所属资源
    getResourceType() {
      let params = {
        dictType: '3',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let resourceType = {}
                resourceType.label = item.dictValue
                resourceType.value = item.dictKey
                this.resourceTypeList.push(resourceType)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取所属级别
    getlevelTypeList() {
      let params = {
        dictType: '5',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let levelType = {}
                levelType.label = item.dictValue
                levelType.value = item.dictKey
                this.levelTypeList.push(levelType)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    addNew() {
      this.$router.push({
        name: 'addoreditmaterials',
        query: {
          flag: 'add',
        },
      })
    },
    // 重置搜索条件
    resetForm() {
      // this.$refs.materialsInfo.resetFields()
        this.materialsInfo.resourceName = ''
        this.materialsInfo.assetTypeFlag = ''
        this.materialsInfo.levelTypeFlag = ''
        this.materialsInfo.catalogTypeFlag1 = ''
        this.materialsInfo.catalogTypeFlag2 = ''
        this.materialsInfo.catalogTypeFlag3 = ''
        this.materialsInfo.catalogTypeFlag4 = ''
        this.pageNum = 1
      this.doSearch()
    },
    doSearch: _debounce(function() {
      this.getResourcePage()
    }, 500),
    // 获取列表
    init() {
      this.getcatalogType('0', 1)
      this.getResourceType()
      this.getlevelTypeList()
      this.doSearch()
    },
    async getResourcePage() {
      const params = {
        'where.assetTypeFlag': this.materialsInfo.assetTypeFlag || null,
        'where.levelTypeFlag': this.materialsInfo.levelTypeFlag || null,
        'where.catalogTypeFlag1': this.materialsInfo.catalogTypeFlag1 || null,
        'where.catalogTypeFlag2': this.materialsInfo.catalogTypeFlag2 || null,
        'where.catalogTypeFlag3': this.materialsInfo.catalogTypeFlag3 || null,
        'where.catalogTypeFlag4': this.materialsInfo.catalogTypeFlag4 || null,
        'where.queryStr': this.materialsInfo.resourceName || null,
        pageNum: this.materialsInfo.pageNum,
        pageSize: this.materialsInfo.pageSize,
        orderBy: 'create_time',
        order: 'desc',
      }
      this.loading = true
      try {
        const { code, data } = await getResourcePage(params)
        if (code === '00000000') {
          this.tableData = data.list
          this.total = data.total
        }
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
      
    },
    viewItem({ uid }) {
      localStorage.setItem('materialsInfoUid', JSON.stringify({ uid }))
      this.$router.push({
        name: 'materialsdetails',
        query: {
          uid,
        },
      })
    },
    editmaterials({ uid }) {
      this.$router.push({
        name: 'addoreditmaterials',
        query: {
          uid,
          flag: 'edit',
        },
      })
    },
    handleDelete({ uid, storage }) {
      if (storage != 0) {
        this.$alert('库存不为零，无法删除', '删除', {
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {})
      } else {
        this.$confirm('是否删除？删除后不可恢复。', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const params = { uid }
            this.deleteResource(params)
          })
          .catch(() => {})
      }
    },
    // 删除物资
    async deleteResource(params) {
      const { code } = await deleteResource(params)
      if (code === '00000000') {
        this.$message({
          type: 'success',
          message: '删除成功！',
        })
        this.doSearch()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.bottom_buttons {
  display: flex;
  .el-button {
    & + .el-button {
      margin-left: 10px;
    }
  }
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
      content: '';
      position: absolute;
      width: 1px;
      top: 3px;
      left: 0px;
      height: 15px;
      background-color: $main_color;
      display: inline-block;
    }
  }

  &.gray {
    color: #c3c9d8;

    &::before {
      background-color: #c3c9d8;
    }
  }
}

// /deep/.el-pagination {
//   display: flex;
//   justify-content: center;
// }
/deep/.el-select {
  margin-left: 10px;
}
/deep/ .el-button.min:focus,
.el-button.min:hover {
  background: #5458fd;
  border-color: #5458fd;
  color: #ffffff;
}
</style>
