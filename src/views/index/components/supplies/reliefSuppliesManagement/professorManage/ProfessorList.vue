<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form class="form-container">
          <div>
            <div class="form_size">
              <el-form-item label="专家类别:" style="width: 300px;">
                <el-select
                  v-model="professorForm.expertCategoryFlag"
                  placeholder="全部"
                >
                  <el-option
                    v-for="item in expertCategoryList"
                    :key="item.uid"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="专家级别:" style="width: 300px;">
                <el-select
                  v-model="professorForm.expertLevelFlag"
                  placeholder="全部"
                >
                  <el-option
                    v-for="item in expertLevelList"
                    :key="item.uid"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  @keyup.enter.native="doSearch"
                  style="width: 150px;"
                  placeholder="请搜索专家姓名"
                  v-model="professorForm.expertName"
                ></el-input>
              </el-form-item>

              <el-button type="primary" @click="doSearch">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
            <el-button type="primary" @click="addNew">新增</el-button>
            <el-button @click="exportData">导出</el-button>

            <el-table
              :data="tableData"
              style="width: 100%;margin-top:40px;"
              @sort-change="changeSort"
              :sort-orders="['ascending', 'descending']"
              v-loading="loading"
            >
              <el-table-column label="专家编号" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.expertCode || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="专家姓名"
                sortable="custom"
                prop="name"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.expertName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="性别" width="50px">
                <template slot-scope="scope">
                  <span>{{ scope.row.gender || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="手机号" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.phoneNumber || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="办公电话" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.officePhone || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="工作单位" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.company || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="职称" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.jobTitleFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="常住地址" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.address || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="专家类别" width="90px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.expertCategoryFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="专家级别" width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.expertLevelFlagName || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="擅长领域"
                width="180"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.expertiseField || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160px">
                <template slot-scope="{ row }">
                  <span class="handle_btn" @click="viewItem(row)">查看</span>
                  <span class="handle_btn" @click="editprofessor(row)"
                    >编辑</span
                  >
                  <span class="handle_btn" @click="handleDelete(row)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="professorForm.pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="professorForm.pageSize"
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
  getExpertPage,
  deleteExpert,
  exportExpertUrl,
} from '@/views/index/api/supplies/api.xy'
import { exportFn, formatDate } from '@/utils/util'
import _debounce from 'lodash/debounce'
export default {
  name: 'professorlist',
  components: { visBreadcrumb },
  props: {},
  data() {
    return {
      loading: false,
      total: 0,
      breadcrumbData: [{ name: '救援资源' }, { name: '应急专家' }],
      professorForm: {
        uid: '',
        expertName: '',
        gender: '',
        birthday: '',
        politicalFlag: '',
        officeCode: '',
        officePhone: '',
        phoneNumber: '',
        email: '',
        address: '',
        graduatedSchool: '',
        educationFlag: '',
        personalProfile: '',
        company: '',
        jobTitleFlag: '',
        position: '',
        belongingFieldFlag: '',
        expertLevelFlag: '',
        expertCategoryFlag: '',
        expertiseField: '',
        experience: '',
        remark: '',
      },
      tableData: [],
      expertCategoryList: [],
      expertLevelList: [],
      order: 'desc',
      orderBy:'create_time',
    }
  },
  computed: {},
  created() {
    this.getExpertPage()
    this.getExpertCategory()
    this.getExpertLevel()
  },
  activated() {
    this.getExpertPage()
  },
  methods: {
    handleSizeChange(val) {
      this.professorForm.pageSize = val
      this.professorForm.pageNum = 1
      this.doSearch()
    },
    handleCurrentChange(val) {
      this.professorForm.pageNum = val
      this.doSearch()
    },
    doSearch: _debounce(function() {
      this.getExpertPage()
    }, 500),
    addNew() {
      this.$router.push({
        name: 'addoreditprofessor',
        query: {
          flag: 'add',
        },
      })
    },
    // 获取列表
    async getExpertPage() {
      const params = {
        'where.expertLevelFlag': this.professorForm.expertLevelFlag || null,
        'where.expertCategoryFlag':this.professorForm.expertCategoryFlag || null,
        'where.queryStr': this.professorForm.expertName || null,
        pageNum: this.professorForm.pageNum,
        pageSize: this.professorForm.pageSize,
        // orderBy: 'create_time desc,convert(expert_name using gbk)',
        orderBy:this.orderBy,
        // orderBy: 'convert(expert_name using gbk)',
        order: this.order,
      }
      this.loading = true
      try {
        const { code, data } = await getExpertPage(params)
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
        'where.expertLevelFlag': this.professorForm.expertLevelFlag || null,
        'where.expertCategoryFlag':
          this.professorForm.expertCategoryFlag || null,
        'where.queryStr': this.professorForm.expertName || null,
        pageNum: this.professorForm.pageNum,
        pageSize: this.professorForm.pageSize,
        orderBy: this.orderBy,
        // convert(expert_name using gbk)
        order: this.order,
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的应急专家数据.xls`
      exportFn(exportExpertUrl, params, null, null, downloadFullName)
    }, 500),
    //获取专家类别
    getExpertCategory() {
      let params = {
        dictType: '40',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let expertCategory = {}
                expertCategory.label = item.dictValue
                expertCategory.value = item.dictKey
                this.expertCategoryList.push(expertCategory)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取专家级别
    getExpertLevel() {
      let params = {
        dictType: '39',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let expertLevel = {}
                expertLevel.label = item.dictValue
                expertLevel.value = item.dictKey
                this.expertLevelList.push(expertLevel)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    changeSort(val) {
      if (val.order === 'descending') {
        this.order = 'desc'
        this.orderBy='convert(expert_name using gbk)'
      } else {
        this.order = 'asc'
        this.orderBy='convert(expert_name using gbk)'
      }
      this.getExpertPage()
    },

    viewItem({ uid }) {
      this.$router.push({
        name: 'professordetails',
        query: {
          uid,
        },
      })
    },

    editprofessor({ uid }) {
      this.$router.push({
        name: 'addoreditprofessor',
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
          this.deleteExpert(params)
          // this.$message({
          // 	type: 'success',
          // 	message: '删除成功!',
          // })
        })
        .catch(() => {})
    },
    // 删除物资
    async deleteExpert(params) {
      const { code } = await deleteExpert(params)
      if (code === '00000000') {
        this.$message({
          type: 'success',
          message: '删除成功！',
        })
        this.doSearch()
      }
    },
    resetForm() {
      // this.$refs.materialsInfo.resetFields()
        this.professorForm.expertLevelFlag = ''
        this.professorForm.expertCategoryFlag = ''
        this.professorForm.expertName = ''
        this.pageNum = 1
        this.order='desc'
        this.orderBy='create_time'
      this.doSearch()
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
// .el-form-item__content {
//     width: 220px;
// }
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
