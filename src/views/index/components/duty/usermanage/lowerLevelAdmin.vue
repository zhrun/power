<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 下级管理员列表
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            v-loading="treeIsloading"
            :data="treeData"
            :props="defaultProps"
            :rootId="rootId"
            @node-click="handleNodeClick"
            @hook:mounted="treeIsMounted"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div>
              <el-input
                v-model.trim="searchKey"
                style="width:200px;"
                placeholder="请输入姓名、手机号或卡号"
                @keyup.enter.native="doSearch"
              ></el-input>
              <el-button type="primary" @click="doSearch">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
            <div>
              <el-button icon="iconfont iconbianzu12" @click="addManager">新增管理员</el-button>
              <el-button icon="iconfont iconzhongzhimima" @click="resetUserPsd">重置密码</el-button>
            </div>
          </div>
          <el-table ref="table" :data="tableData" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column
              prop="userName"
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
              width="140px"
              label="操作">
              <template slot-scope="scope">
                <template v-if="scope.row.uid !== curUserUid">
                  <span class="handle_btn" @click="handleEnabled(scope.row)" v-if="scope.row.isForce">启用</span>
                  <span class="handle_btn" @click="handleForbidden(scope.row)" v-else>禁用</span>
                </template>
                <span class="handle_btn" @click="handleEdit(scope.row)">编辑</span>
                <span class="handle_btn" @click="handleDelete(scope.row)" v-if="scope.row.uid !== curUserUid">删除</span>
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
import {
  getBackAdminList,
  queryBackTree,
  deleteUser,
  resetPsd,
  editAuth,
} from "@/views/index/api/onDuty/api.yy.js";
import { getPublicKey } from "@/views/index/api/eas/api.eas.js";
import _debounce from "lodash/debounce";

export default {
  name: "lowerLevelAdmin",
  components: { visBreadcrumb, orgTree, resetPsdDialog },
  data() {
    return {
      breadcrumbData: [{ name: "用户管理" }, { name: "下级管理员" }],
      treeData: [],
      rootId: "",
      treeIsloading: false,
      tableData: [],
      defaultProps: {
        children: "childList",
        label: "unitName",
      },
      unitUid: "",
      unitName: "",
      searchKey: "",
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      proKey: "",
      curUserUid: "",
      selectedList: [],
      showResetPsdDialog: false,
      JSEncryptKey: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.curUserUid = userInfo.uid;
      this.proKey = userInfo.proKey;
      this.queryBackTree();
      this.getPublicKey();
    },
    // 点击机构树节点
    handleNodeClick(data) {
      this.unitUid = data.uid;
      this.unitName = data.unitName;
      this.pageNum = 1;
      this.doSearch();
    },
    // 点击新增管理员editLowerLevelAdmin
    addManager() {
      this.$router.push({
        path: "/main/editLowerLevelAdmin",
        query: {
          flag: "add",
          unitUid: this.unitUid,
          unitName: this.unitName,
        },
      });
    },
    reset() {
      this.searchKey = "";
      this.pageNum = 1;
      this.doSearch();
    },
    // 开始搜索
    doSearch: _debounce(function() {
      this.getBackAdminList();
    }, 100),
    // 选中行首的复选框
    handleSelectionChange(selections) {
      this.selectedList = selections;
    },
    // 点击启用
    handleEnabled(row) {
      this.editAuth(row);
    },
    // 点击禁用
    handleForbidden(row) {
      this.editAuth(row);
    },
    // 点击编辑
    handleEdit(row) {
      this.$router.push({
        path: "/main/editLowerLevelAdmin",
        query: {
          flag: "edit",
          uid: row.uid,
        },
      });
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm("您确认要删除此信息吗？删除后，该用户会被清除。", "提示")
        .then(() => {
          this.deleteUser(row.uid);
        })
        .catch();
    },
    // 切换当前页码
    onPageChange(val) {
      this.pageNum = val;
      this.doSearch();
    },
    // 切换每页展示条数
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.doSearch();
    },
    // 重置密码
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
    // 关闭重置密码弹框
    closeResetPsdDialog() {
      this.showResetPsdDialog = false;
    },
    // 确认重置密码
    confirmResetPsd(psd) {
      this.resetPsd(psd);
    },
    // 获取机构树数据
    async queryBackTree() {
      this.treeIsloading = true;
      try {
        const params = {
          unitType: "1",
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000" && data) {
          this.treeData = [data];
          this.unitUid = data.uid;
          this.rootId = data.uid;
          this.unitName = data.unitName;
          this.doSearch();
        }
      } catch (error) {
        console.log(error);
      }
      this.treeIsloading = false;
    },
    treeIsMounted() {
      this.$refs.tree.setCurrentKey(this.rootId);
    },
    // 获取后台管理员列表
    async getBackAdminList() {
      this.loading = true;
      try {
        const params = {
          "where.unitId": this.unitUid || null,
          "where.keyword": this.searchKey || null,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          orderBy: "create_time",
          order: "desc",
        };
        const { code, data } = await getBackAdminList(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.total = data.total;
        }
      } catch {
        this.$message({
          message: "查询下级管理员列表失败",
          type: "error",
        });
      }
      this.loading = false;
    },
    // 删除管理员
    async deleteUser(uid) {
      try {
        const params = { uid };
        const { code } = await deleteUser(params);
        if (code === "00000000") {
          this.$message({
            message: "删除管理员成功",
            type: "success",
          });
          this.doSearch();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 重置密码请求
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
    // 启用/禁用管理员
    async editAuth({ uid, userName, isForce }) {
      try {
        const params = { uid, proKey: this.proKey, isForce: !isForce };
        const { code } = await editAuth(params);
        if (code === "00000000") {
          this.$message({
            message: `已${isForce ? "启用" : "禁用"}管理员：${userName}`,
            type: "success",
          });
          this.doSearch();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 加密
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
</style>
