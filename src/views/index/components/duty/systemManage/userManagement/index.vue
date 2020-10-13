<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 用户管理列表
-->
<template>
  <div class="statistics usm">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            :data="unitTreeData"
            :props="defaultProps"
            rootId
            v-loading="treeIsloading"
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="main_title">本页维护所有的单位管理员。</div>
          <!-- <div class="filter_container"> -->
            <div class="button_group">
              <el-button @click.native="addManager" icon="iconfont iconbianzu12">新增管理员</el-button>
              <el-button @click.native="resetUserPsd" icon="iconfont iconzhongzhimima">重置密码</el-button>
              <el-button @click.native="importManagers" icon="iconfont iconbianzu26">导入</el-button>
              <el-button @click.native="exportManagers" icon="iconfont iconbianzu15">导出</el-button>
            </div>
            <div class="filter_form">
              <el-input
                v-model.trim="searchKey"
                style="width: 200px;"
                @keyup.enter.native="doSearch"
                suffix-icon="el-icon-doSearch"
                placeholder="请输入姓名/手机号/卡号"
              ></el-input>
              <el-button type="primary" @click="doSearch">查找</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          <!-- </div> -->
          <el-table ref="table" :data="tableData" @selection-change="handleSelectionChange"  v-loading="tableIsloading">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column
              prop="userName"
              width="100px"
              label="姓名">
            </el-table-column>
            <el-table-column
              label="用户名">
              <template slot-scope="scope">
                <span>{{ scope.row.loginName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="卡号">
              <template slot-scope="scope">
                <span>{{ scope.row.cardNo || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="手机号">
              <template slot-scope="scope">
                <span>{{ scope.row.userMobile || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所属单位">
              <template slot-scope="scope">
                <span>{{ scope.row.unitName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="150px"
              label="操作">
              <template slot-scope="scope">
                <span class="handle_btn" @click="handleEnabled(scope.row)" v-if="scope.row.isForce">启用</span>
                <span class="handle_btn" @click="handleForbidden(scope.row)" v-else>禁用</span>
                <span class="handle_btn" @click="handleEdit(scope.row)">编辑</span>
                <span class="handle_btn" @click="handleDelete(scope.row)">删除</span>
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
    <resetPsdDialog
      :show="showResetPsdDialog"
      @close="closeResetPsdDialog"
      @confirm="confirmResetPsd"
    ></resetPsdDialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import orgTree from "@/components/common/orgTree";
import resetPsdDialog from "@/components/common/resetPsdDialog";
import { exportFn } from "@/utils/util";
import {
  getZbTree,
  getUserList,
  deleteUser,
  editAuth,
  resetPsd,
  exportSysUserUrl,
} from "@/views/index/api/onDuty/api.yy.js";
import { getPublicKey } from "@/views/index/api/eas/api.eas.js";
import _debounce from "lodash/debounce";

export default {
  name: "user-management",
  components: { visBreadcrumb, orgTree, resetPsdDialog },
  data: () => ({
    name: "organization",
    breadcrumbData: [{ name: "系统管理" }, { name: "用户管理" }],
    unitTreeData: [],
    rootId: "",
    tableData: [],
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    treeIsloading: false,
    tableIsloading: false,
    searchKey: "",
    unitUid: "",
    unitName: "",
    pageSize: 10,
    pageNum: 1,
    total: 0,
    proKey: "",
    selectedList: [],
    showResetPsdDialog: false,
    JSEncryptKey: "",
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
      this.getZbTree();
      this.getPublicKey();
    },
    // 重置搜索条件
    reset() {
      this.searchKey = "";
      this.pageNum = 1;
      this.doSearch();
    },
    // 点击新增管理员按钮
    addManager() {
      this.$router.push({
        path: "/main/editManager",
        query: {
          flag: "add",
          uid: "",
          unitUid: this.unitUid,
          unitName: this.unitName,
        },
      });
    },
    importManagers() {
      this.$router.push({
        path: "/main/importManager",
      });
    },
    handleSelectionChange(val) {
      this.selectedList = val;
    },
    handleNodeClick: _debounce(function(data) {
      this.unitUid = data.uid;
      this.unitName = data.unitName;
      this.pageNum = 1;
      this.doSearch();
    }, 100),
    handleEnabled(row) {
      this.editAuth(row);
    },
    handleForbidden(row) {
      this.editAuth(row);
    },
    handleEdit(row) {
      this.$router.push({
        path: "/main/editManager",
        query: {
          flag: "edit",
          uid: row.uid,
          unitUid: this.unitUid,
          unitName: this.unitName,
        },
      });
    },
    handleDelete(row) {
      this.$confirm("您确认要删除此信息吗？删除后，该用户会被清除。", "提示")
        .then(() => {
          this.deleteUser(row.uid);
        })
        .catch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.doSearch();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.doSearch();
    },
    resetUserPsd() {
      if (!this.selectedList.length) {
        this.$message({
          message: "请选择至少一个用户",
          type: "error",
        });
        return;
      }
      this.showResetPsdDialog = true;
    },
    closeResetPsdDialog() {
      this.showResetPsdDialog = false;
    },
    confirmResetPsd(psd) {
      this.resetPsd(psd);
    },
    doSearch: _debounce(async function() {
      const params = {
        "where.keyword": this.searchKey || null,
        "where.unitId": this.unitUid,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: "create_time",
        order: "desc",
      };
      this.tableIsloading = true;
      try {
        const { code, data } = await getUserList(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.total = data.total;
          this.tableIsloading = false;
          return;
        }
      } catch {
        this.tableIsloading = false;
        this.$message({
          message: "查询人员列表失败",
          type: "error",
        });
      }
    }, 100),
    exportManagers() {
      const params = {
        unitUid: this.unitUid,
        keyword: this.searchKey,
      };
      exportFn(exportSysUserUrl, params, "单位管理员信息", "xls", this);
    },
    async deleteUser(uid) {
      try {
        const { code } = await deleteUser({ uid });
        if (code === "00000000") {
          this.doSearch();
        }
      } catch {
        this.$message({
          message: "删除管理员失败",
          type: "error",
        });
      }
    },
    async getZbTree() {
      this.treeIsloading = true;
      try {
        const { code, data } = await getZbTree();
        if (code === "00000000") {
          this.unitTreeData = [data];
          this.unitUid = data.uid;
          this.rootId = data.uid;
          this.unitName = data.unitName;
          this.treeIsloading = false;
          this.doSearch();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
        }
      } catch {
        this.treeIsloading = false;
        this.$message({
          message: "获取机构树失败!",
          type: "error",
        });
      }
    },
    async editAuth({ uid, userName, isForce }) {
      try {
        const params = { uid, proKey: this.proKey, isForce: !isForce };
        const { code } = await editAuth(params);
        if (code === "00000000") {
          this.$message({
            message: `已${isForce ? "启用" : "禁用"}用户：${userName}`,
            type: "success",
          });
          this.doSearch();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async resetPsd(newPsd) {
      try {
        const uid = this.selectedList
          .reduce((pre, cur) => {
            return [...pre, cur.uid];
          }, [])
          .join(",");
        let encrypt = new window.JSEncrypt();
        encrypt.setPublicKey(this.JSEncryptKey);
        const params = {
          uid,
          password: encrypt.encrypt(newPsd),
          proKey: this.proKey,
        };
        const { code } = await resetPsd(params);
        if (code === "00000000") {
          this.$message({
            message: "重置密码成功",
            type: "success",
          });
          this.closeResetPsdDialog();
          this.$refs.table.clearSelection();
        }
      } catch (error) {
        console.log(error);
      }
    },
    getPublicKey() {
      getPublicKey().then((res) => {
        if (res && res.code == "00000000") {
          this.JSEncryptKey = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main_title,
.button_group,
.filter_form {
  margin-bottom: 20px;
}
/deep/.el-button {
  i {
    margin-right: 10px;
  }
}
</style>
