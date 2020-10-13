<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 人员通讯录列表
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            v-loading="treeLoading"
            :data="treeData"
            :props="defaultProps"
            :root-id="rootId"
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-input
                style="width: 200px"
                v-model.trim="searchKey"
                @keyup.enter.native="doSearch"
                placeholder="请输入姓名或手机号"
              ></el-input>
              <el-button type="primary" @click="doSearch">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
            <div class="button_group">
              <el-button icon="iconfont iconbianzu12" @click="addPerson">新增人员</el-button>
              <el-button icon="iconfont iconbianzu26" @click="upload">导入</el-button>
              <el-button icon="iconfont iconbianzu15" @click="download">导出</el-button>
            </div>
          </div>
          <el-table :data="tableData" v-loading="tableLoading">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="职务">
              <template slot-scope="scope">
                <span>{{ scope.row.titleName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ isNotOpen(scope.row) ? "****" : (scope.row.telephone || '-') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="办公电话">
              <template slot-scope="scope">
                <el-tooltip
                  popper-class="popper"
                  placement="left"
                  :disabled="isNotOpen(scope.row) || !scope.row.userPhone"
                >
                  <div slot="content">
                      <span class="user_phone_tip" :class="[(index % 3 === 0 || index % 3 === 1) && index + 1 !== scope.row.userPhone.split(',').length ? 'has_after' : '']" v-for="(item ,index) in scope.row.userPhone.split(',')" :key="scope.row.uid + 'userPhone' + index">
                        {{item}}
                      </span>
                  </div>
                  <span>{{isNotOpen(scope.row) ? "****" : (scope.row.userPhone || '-')}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="所属单位" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.unitName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="150px"
              label="操作">
              <template slot-scope="scope">
                <span class="handle_btn" @click="setSystem(scope.row)" v-if="scope.row.unitUid === userInfo.dutyUserInfo.unitUid && scope.row.sysUserStatus === 1">设为系统用户</span>
                <span class="handle_btn" @click="handleView(scope.row)">查看</span>
                <span class="handle_btn" @click="handleEdit(scope.row)">编辑</span>
                <span class="handle_btn" @click="handleDelete(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            class="pagination_comp"
          ></el-pagination>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import orgTree from "@/components/common/orgTree";
import {
  exportUserUrl,
  queryBackTree,
  queryBackPersonList,
  deletePerson,
} from "@/views/index/api/onDuty/api.yy.js";
import { exportFn } from "@/utils/util";
import _debounce from "lodash/debounce";

export default {
  name: "unit-address-book",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [{ name: "通讯录管理" }, { name: "人员通讯录" }],
    searchKey: "",
    rootId: "",
    treeData: [],
    tableData: [],
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    unitUid: "",
    unitName: "",
    interUnitUid: "",
    interOfficeUid: "",
    pageNum: 1,
    pageSize: 10,
    total: 0,
    treeLoading: false,
    tableLoading: false,
    userInfo: {},
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.queryBackTree();
    },
    isNotOpen({ unitUid, phoneOpen }) {
			return unitUid !== this.userInfo.dutyUserInfo.unitUid && phoneOpen === 2
		},
    phoneTooleTip(val) {
      const list = val.split(',');
      const tooleTip = list.reduce((pre, cur, index) => {
        if (index === 0) return cur;
        return `${pre}${ (index) % 3 === 0 ? '</br>' : ' / ' }${cur}`;
      }, "");
      console.log('tooleTip', tooleTip);
      
      return tooleTip;
    },
    // 点击机构树节点
    handleNodeClick(data) {
      if (data.unitType === 1) {
        this.unitUid = data.uid;
        this.unitName = data.unitName;
        this.interUnitUid = "";
        this.interOfficeUid = "";
      }
      if (data.unitType === 2) {
        this.unitUid = data.parentUid;
        this.unitName = "";
        this.interUnitUid = data.uid;
        this.interOfficeUid = "";
      }
      if (data.unitType === 3) {
        this.unitUid = data.parentUid;
        this.unitName = "";
        this.interOfficeUid = data.uid;
        this.interUnitUid = "";
      }
      this.pageNum = 1;
      this.doSearch();
    },
    reset() {
      this.searchKey = "";
      this.pageNum = 1;
      this.doSearch();
    },
    // 触发搜索
    doSearch: _debounce(function() {
      this.queryBackPersonList();
    }, 100),
    // 切换每页展示条数
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.doSearch();
    },
    // 切换当前页码
    onPageChange(val) {
      this.pageNum = val;
      this.doSearch();
    },
    // 点击新增
    addPerson() {
      this.$router.push({
        path: "/main/editPersonAddressBook",
        query: {
          flag: "add",
          unitName: this.unitName,
          unitUid: this.unitUid,
          interUnitUid: this.interUnitUid,
          interOfficeUid: this.interOfficeUid,
        },
      });
    },
    // 导出
    download: _debounce(function() {
      const params = {
        unitId: this.interUnitUid || this.interOfficeUid || this.unitUid,
        keyword: this.searchKey,
      };
      exportFn(exportUserUrl, params, "人员通讯录", "xls", this);
    }, 100),
    // 点击导入
    upload() {
      this.$router.push({
        path: "/main/importPersonAddressBook",
      });
    },
    // 点击设为系统用户
    setSystem(row) {
      this.$router.push({
        path: "/main/editSameLevelUser",
        query: {
          flag: "add",
        },
      });
      localStorage.setItem("setSystem", JSON.stringify(row));
    },
    // 点击查看
    handleView(row) {
      this.$router.push({
        path: "/main/viewPersonAddressBook/",
        query: {
          uid: row.uid,
        },
      });
    },
    // 点击编辑
    handleEdit(row) {
      this.$router.push({
        path: "/main/editPersonAddressBook/",
        query: {
          flag: "edit",
          uid: row.uid,
        },
      });
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm(`是否确认删除该人员信息？`, "提示")
        .then(() => {
          this.deletePerson(row);
        })
        .catch();
    },
    // 获取后台人员通讯录列表
    async queryBackPersonList() {
      this.tableLoading = true;
      try {
        const params = {
          "where.keyword": this.searchKey || null,
          "where.unitId":
            this.interUnitUid || this.interOfficeUid || this.unitUid,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          orderBy: "sort_id",
          order: "asc",
        };
        const { code, data } = await queryBackPersonList(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.tableData.forEach((it) => {
            it.userPhone = it.phoneList
              .reduce((pre, cur) => {
                return [...pre, cur.phone];
              }, [])
              .join(",");
          });
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      }
      this.tableLoading = false;
    },
    // 获取后台机构树请求
    async queryBackTree() {
      this.treeLoading = true;
      try {
        const params = {
          filterType: 4,
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000" && data) {
          this.treeData = [data];
          this.rootId = data.uid;
          this.unitUid = data.uid;
          this.unitName = data.unitName;
          this.pageNum = 1;
          this.doSearch();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.treeLoading = false;
    },
    // 删除人员通讯录
    async deletePerson({ uid, name }) {
      try {
        const params = { uid };
        const { code } = await deletePerson(params);
        if (code === "00000000") {
          this.$message({
            message: `删除${name}成功`,
            type: "success",
          });
          this.doSearch();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-button {
  a {
    color: #5458fd;
    text-decoration: none;
  }
}
.user_phone_tip {
  display: inline-block;
  padding: 10px 0;
}
.has_after {
  &::after {
    content: "/";
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
