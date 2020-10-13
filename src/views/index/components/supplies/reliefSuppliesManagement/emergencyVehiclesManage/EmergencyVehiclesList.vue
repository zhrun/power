<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="main_content">
      <el-scrollbar style="height:100%;">
        <el-form :model="vehicleInfo" inline>
          <el-form-item label="车辆类型" style="width: 255px;">
            <el-select
              v-model="vehicleInfo.vehicleTypeFlagName"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in vehicleTypeList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" style="width: 255px;">
            <el-select
              v-model="vehicleInfo.orgName"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in orgNameList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出车状态" style="width: 255px;">
            <el-select
              v-model="vehicleInfo.vehicleStatusFlagName"
              placeholder="全部"
              style="width: 180px;"
            >
              <el-option
                v-for="item in vehicleStatusList"
                :key="item.uid"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号码" style="width: 255px;">
            <el-input
              @keyup.enter.native="doSearch"
              style="width: 150px;"
              placeholder="请搜索车牌号码"
              v-model.trim="vehicleInfo.licenseNumber"
            ></el-input>
          </el-form-item>

          <el-button type="primary" @click="doSearch">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-row style="margin-top:10px">
            <el-button type="primary" @click="addNew">新增</el-button>
            <el-button @click="exportData">导出</el-button>
          </el-row>
          <el-row>
            <el-table
              :data="tableData"
              v-loading="loading"
              style="width: 100%;margin-top:40px;"
            >
              <el-table-column label="车辆编号" min-width="90">
                <template slot-scope="scope">
                  <span>{{ scope.row.vehicleCode || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="车牌号码" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.licenseNumber || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="号牌种类" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.licenseFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="车身颜色" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.colourFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="车辆类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.vehicleTypeFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="核载人数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.loads || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属单位" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.orgName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="负责人" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.principal || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="停放位置" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.parkingPosition || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="出车状态">
                <template slot-scope="scope">
                  <span>{{ scope.row.vehicleStatusFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="适用领域 " show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.field || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="{ row }">
                  <span
                    v-if="row.vehicleStatusFlag == 2"
                    class="handle_btn"
                    @click="changeVehicleStatus(row)"
                    >完成调用</span
                  >
                  <span class="handle_btn" @click="viewItem(row)">查看</span>
                  <span class="handle_btn" @click="editvehicles(row)"
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
          :current-page.sync="vehicleInfo.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="vehicleInfo.pageSize"
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
  getVehiclePage,
  deleteVehicle,
  exportVehicleUrl,
  getOrgName,
  complete,
} from '@/views/index/api/supplies/api.xy'
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
      loading: false,
      total: 0,
      breadcrumbData: [{ name: '救援资源' }, { name: '应急车辆' }],
      vehicleInfo: {
        uid: '',
        vehicleCode: '',
        licenseNumber: '',
        vehicleTypeFlagName: '',
        licenseFlagName: '',
        loads: '',
        colourFlagName: '',
        orgName: '',
        principal: '',
        parkingPosition: '',
        longitude: '',
        latitude: '',
        field: '',
        vehicleStatusFlagName: '',
        vehicleStatusFlag: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      vehicleStatusList: [],
      vehicleTypeList: [],
      orgNameList: [],
    }
  },
  computed: {},
  activated() {
    this.getVehiclePage()
  },
  
  created() {
    this.getVehiclePage()
    this.getVehicleType()
    this.getVehicleStatus()
    this.getOrgName()
  },
  methods: {
    handleSizeChange(val) {
      this.vehicleInfo.pageSize = val
      this.vehicleInfo.pageNum = 1
      this.doSearch()
    },
    handleCurrentChange(val) {
      this.vehicleInfo.pageNum = val
      this.doSearch()
    },
    addNew() {
      this.$router.push({
        name: 'addoreditvehicles',
        query: {
          flag: 'add',
        },
      })
    },
    editvehicles({ uid }) {
      this.$router.push({
        name: 'addoreditvehicles',
        query: {
          uid,
          flag: 'edit',
        },
      })
    },
    // 获取列表
    async getVehiclePage() {
      const params = {
        'where.vehicleTypeFlag': this.vehicleInfo.vehicleTypeFlagName || null,
        'where.orgName': this.vehicleInfo.orgName || null,
        'where.queryStr': this.vehicleInfo.licenseNumber || null,
        'where.vehicleStatusFlag':this.vehicleInfo.vehicleStatusFlagName || null,
        pageNum: this.vehicleInfo.pageNum,
        pageSize: this.vehicleInfo.pageSize,
        orderBy: 'create_time',
        order: null,
      }
      this.loading = true
      try {
        const { code, data } = await getVehiclePage(params)
        if (code === '00000000') {
          this.tableData = data.list
          this.total = data.total
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    exportData: _debounce(function() {
      const params = {
        'where.vehicleTypeFlag': this.vehicleInfo.vehicleTypeFlagName || null,
        'where.orgName': this.vehicleInfo.orgName || null,
        'where.queryStr': this.vehicleInfo.licenseNumber || null,
        'where.vehicleStatusFlag':this.vehicleInfo.vehicleStatusFlagName || null,
        // pageNum: this.vehicleInfo.pageNum,
        pageSize: this.total,
        orderBy: 'create_time',
        order: null,
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的应急车辆数据.xls`
      exportFn(exportVehicleUrl, params, null, null, downloadFullName)
    }, 500),
    handleDelete({ uid }) {
      this.$confirm('是否删除？删除后不可恢复。', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const params = { uid }
          this.deleteVehicle(params)
        })
        .catch(() => {})
    },
    // 删除物资
    async deleteVehicle(params) {
      const { code } = await deleteVehicle(params)
      if (code === '00000000') {
        this.$message({
          type: 'success',
          message: '删除成功！',
        })
        this.doSearch()
      }
    },
    doSearch: _debounce(function() {
      this.getVehiclePage()
    }, 500),
    resetForm() {
      this.vehicleInfo.vehicleTypeFlagName = ''
      this.vehicleInfo.orgName = ''
      this.vehicleInfo.licenseNumber = ''
      this.vehicleInfo.vehicleStatusFlagName = ''
      this.pageNum = 1
      this.doSearch()
    },

    //获取车辆类型
    getVehicleType() {
      let params = {
        dictType: '7',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let vehicleType = {}
                vehicleType.label = item.dictValue
                vehicleType.value = item.dictKey
                this.vehicleTypeList.push(vehicleType)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取出车状态
    getVehicleStatus() {
      let params = {
        dictType: '33',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let vehicleStatus = {}
                vehicleStatus.label = item.dictValue
                vehicleStatus.value = item.dictKey
                this.vehicleStatusList.push(vehicleStatus)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取所属单位
    getOrgName() {
      getOrgName().then((res) => {
        if (res && res.code === '00000000') {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              this.orgNameList.push(item)
            })
          }
        }
      })
    },
    viewItem({ uid }) {
      this.$router.push({
        name: 'vehiclesdetails',
        query: {
          uid,
        },
      })
    },
    changeVehicleStatus({ uid }) {
      this.$confirm(
        '该车辆是否已完成调用？确定后，系统将修改出车状态为未出车。',
        '完成调用',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          const params = { uid }
          this.complete(params)
        })
        .catch(() => {})
    },
    async complete(params) {
      const { code } = await complete(params)
      if (code === '00000000') {
        this.$message({
          type: 'success',
          message: '已完成调用！',
        })
        this.doSearch()
      }
    },
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

  &.gray {
    color: #c3c9d8;

    &::before {
      background-color: #c3c9d8;
    }
  }
}
</style>
