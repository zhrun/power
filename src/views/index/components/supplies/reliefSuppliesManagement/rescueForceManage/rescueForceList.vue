<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="main_content">
      <el-scrollbar style="height:100%;">
        <el-form class="form-container" inline>
          <el-form-item label="级别">
            <el-select
              v-model="forcesInfo.level"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in levelList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类型">
            <el-select
              v-model="forcesInfo.forcesFlag"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in forcesFlagList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性">
            <el-select
              v-model="forcesInfo.attributeFlag"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in attributeList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" style="width: 255px;">
            <!-- <el-input
                style="width: 140px;"
                placeholder="请搜索负责人电话或姓名"
                v-model="forcesInfo.principal"
              ></el-input> -->
            <el-select
              v-model="forcesInfo.principal"
              filterable
              default-first-option
              placeholder="请搜索负责人电话或姓名"
            >
              <el-option
                v-for="item in principalList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="名称">
            <el-input
              @keyup.enter.native="doSearch"
              style="width: 180px;"
              v-model="forcesInfo.forcesName"
              placeholder="请搜索队伍名称"
            ></el-input>
          </el-form-item>

          <el-button type="primary" @click="getRescuPage">查询</el-button>
          <el-button @click="resetForm">重置</el-button>

          <el-row>
            <el-button type="primary" @click="addNew">新增</el-button>
            <el-button @click="exportData">导出</el-button>
          </el-row>
          <el-row>
            <el-table
              :data="tableData"
              v-loading="loading"
              style="width: 100%;margin-top:40px;"
            >
              <el-table-column label="队伍编号" width="120px">
                <template slot-scope="scope">
                  <span>{{ scope.row.forcesCode || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.forcesName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属单位" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.orgName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="级别" width="70">
                <template slot-scope="scope">
                  <span>{{ scope.row.levelFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="属性" width="110">
                <template slot-scope="scope">
                  <span>{{ scope.row.attributeFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.forcesFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="队伍人数(人)" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.forcesAmount || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="负责人及联系方式"
                width="180"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    >{{ scope.row.principal || '-' }}({{
                      scope.row.contactPhone
                    }})</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="办公电话"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{
                  `${scope.row.officeCode}-${scope.row.officePhone}` || '-'
                }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所在地" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.forcesAddress || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="主要装备"
                width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.equipmentName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="{ row }">
                  <span class="handle_btn" @click="viewItem(row)">查看</span>
                  <span class="handle_btn" @click="editmaterials(row)"
                    >编辑</span
                  >
                  <span class="handle_btn" @click="handleDelete(row)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="forcesInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="forcesInfo.pageSize"
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
import {
  getDicts,
  getRescuPage,
  deleteRescueForce,
  getPrincipal,
  exportRescueForceUrl,
} from '@/views/index/api/supplies/api.xy'
import { exportFn, formatDate } from '@/utils/util'
import _debounce from 'lodash/debounce'
export default {
  name: 'rescueforcelist',
  components: {
    visBreadcrumb,
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0,
      breadcrumbData: [{ name: '救援资源' }, { name: '救援力量' }],
      forcesInfo: {
        forcesName: '',
        forcesAmount: '',
        orgName: '',
        level: '',
        attribute: '',
        forcesFlag: '',
        officeCode: '',
        officePhone: '',
        foundDate: '',
        principal: '',
        contactPhone: '',
        forcesAddress: '',
        equipmentName: '',
        longitude: '',
        latitude: '',
        field: '',
      },
      levelList: [],
      forcesFlagList: [],
      attributeList: [],
      tableData: [],
      principalList: [],
    }
  },
  computed: {},
  created() {
    this.init()
  },
  activated() {
    this.getRescuPage()
  },
  methods: {
    handleSizeChange(val) {
      this.forcesInfo.pageSize = val
      this.forcesInfo.pageNum = 1
      this.doSearch()
    },
    handleCurrentChange(val) {
      this.forcesInfo.pageNum = val
      this.doSearch()
    },
    addNew() {
      this.$router.push({
        name: 'addoreditrescueforce',
        query: {
          flag: 'add',
        },
      })
    },
    init() {
      this.getlevel()
      this.getForcesFlag()
      this.getAttribute()
      this.getRescuPage()
      this.getPrincipal()
    },

    viewItem({ uid }) {
      // const sendMessage = {
      //   uid,
      // }
      // localStorage.setItem('materialsInfo', JSON.stringify(uid))
      localStorage.setItem('materialsInfoUid', JSON.stringify({ uid }))
      this.$router.push({
        name: 'rescueforcedetails',
        query: {
          uid,
        },
      })
    },
    editmaterials({ uid }) {
      this.$router.push({
        name: 'addoreditrescueforce',
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
          this.deleteRescueForce(params)
          // this.$message({
          // 	type: 'success',
          // 	message: '删除成功!',
          // })
        })
        .catch(() => {})
    },
    // 删除物资
    async deleteRescueForce(params) {
      const { code } = await deleteRescueForce(params)
      if (code === '00000000') {
        this.$message({
          type: 'success',
          message: '删除成功！',
        })
        this.doSearch()
      }
    },
    //获取救援力量级别
    getlevel() {
      let params = {
        dictType: '19',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let level = {}
                level.label = item.dictValue
                level.value = item.dictKey
                this.levelList.push(level)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },

    //获取救援力量类型
    getForcesFlag() {
      let params = {
        dictType: '20',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let forcesFlag = {}
                forcesFlag.label = item.dictValue
                forcesFlag.value = item.dictKey
                this.forcesFlagList.push(forcesFlag)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },

    //获取救援力量属性
    getAttribute() {
      let params = {
        dictType: '21',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let attribute = {}
                attribute.label = item.dictValue
                attribute.value = item.dictKey
                this.attributeList.push(attribute)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取负责人
    getPrincipal() {
      getPrincipal()
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let principal = {}
                principal.label = item
                principal.value = item
                this.principalList.push(principal)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    // 获取列表
    async getRescuPage() {
      const params = {
        'where.levelFlag': this.forcesInfo.level || null,
        'where.attributeFlag': this.forcesInfo.attributeFlag || null,
        'where.forcesFlag': this.forcesInfo.forcesFlag || null,
        'where.queryStr': this.forcesInfo.principal || null,
        'where.forcesName': this.forcesInfo.forcesName || null,
        pageNum: this.forcesInfo.pageNum,
        pageSize: this.forcesInfo.pageSize,
        orderBy: 'create_time',
        order: 'desc',
      }
      this.loading = true
      try {
        const { code, data } = await getRescuPage(params)
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
    exportData: _debounce(function() {
      const params = {
        'where.levelFlag': this.forcesInfo.levelFlag || null,
        'where.attributeFlag': this.forcesInfo.attributeFlag || null,
        'where.forcesFlag': this.forcesInfo.forcesFlag || null,
        'where.queryStr': this.forcesInfo.principal || null,
        'where.forcesName': this.forcesInfo.forcesName || null,
        // pageNum: this.forcesInfo.pageNum,
        pageSize: this.total,
        orderBy: 'create_time',
        order: 'desc',
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的救援力量数据.xls`
      exportFn(exportRescueForceUrl, params, null, null, downloadFullName)
    }, 500),
    resetForm() {
      // this.$refs.materialsInfo.resetFields()
        this.forcesInfo.level = ''
        this.forcesInfo.attributeFlag = ''
        this.forcesInfo.forcesFlag = ''
        this.forcesInfo.principal = ''
        this.forcesInfo.forcesName = ''
        this.pageNum = 1
      this.doSearch()
    },
    // 触发搜索
    doSearch: _debounce(function() {
      this.getRescuPage()
    }, 500),
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
.form_size {
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
}
</style>
