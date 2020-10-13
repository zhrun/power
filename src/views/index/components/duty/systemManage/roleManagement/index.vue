<!-- 
* @module role-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 角色管理
-->
<template>
  <div class="statistics usm">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-input
                v-model.trim="searchKey"
                @keyup.enter.native="doSearch"
                placeholder="请输入角色名称"
              ></el-input>
              <el-button type="primary" @click="doSearch">查找</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
          <el-table :data="tableData" style="width: 100%;">
            <el-table-column
              width="150px"
              align="center"
              prop="roleName"
              label="角色名称">
            </el-table-column>
            <el-table-column
              align="center"
              label="描述">
              <template slot-scope="scope" show-overflow-tooltip>
                <span>{{scope.row.roleDesc || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="200px"
              align="center"
              label="创建日期">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <span class="handle_btn" @click="handleView(scope.row)">查看权限</span>
                <!-- <span class="handle_btn" @click="handleEdit(scope.row)">权限配置</span> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getUserRoles } from "@/views/index/api/onDuty/api.yy.js";
import { formatDate } from "@/utils/util.js";
import _debounce from "lodash/debounce";

export default {
  name: "role-management",
  components: { visBreadcrumb },
  filters: {
    time(val) {
      return formatDate(val, "yyyy-MM-dd HH:mm");
    },
  },
  data: () => ({
    breadcrumbData: [{ name: "系统管理" }, { name: "角色管理" }],
    tableData: [
      {
        id: "1",
        name: "超级管理员",
        description: "就是超级",
        createDate: "2020-04-15 16:00",
      },
    ],
    searchKey: "",
    proKey: "",
    pageSize: 10,
    pageNum: 1,
    total: 0,
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.proKey = userInfo.proKey;
      this.doSearch();
    },
    reset() {
      this.searchKey = "";
      this.doSearch();
    },
    doSearch: _debounce(function() {
      this.getUserRoles();
    }, 100),
    // 获取用户角色列表
    async getUserRoles() {
      const params = {
        "where.roleName": this.searchKey,
        "where.proKey": this.proKey,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      try {
        const { code, data } = await getUserRoles(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.total = data.total;
        }
      } catch {
        this.$message({
          message: "查询角色列表失败",
          type: "error",
        });
      }
    },
    // 查看角色权限
    handleView(row) {
      this.$router.push({
        path: "/main/rolePermission",
        query: {
          uid: row.uid,
          flag: "view",
          roleName: row.roleName,
        },
      });
    },
    // 配置角色权限
    handleEdit(row) {
      this.$router.push({
        path: "/main/rolePermission",
        query: {
          uid: row.uid,
          flag: "edit",
          roleName: row.roleName,
        },
      });
    },
    // 修改每页展示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    // 修改页码
    handleCurrentChange(val) {
      this.pageNum = val;
      this.search();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  .el-table__header {
    width: 100% !important;
  }
  .el-table__body {
    width: 100% !important;
  }
}
</style>
