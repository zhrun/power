<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 本级用户列表
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-form :model="formModel" inline label-width="60px">
                <el-form-item label="角色">
                  <el-select v-model="formModel.roleId" style="width: 130px">
                    <el-option
                      v-for="(option, index) in roleList"
                      :key="'role' + index"
                      :label="option.roleName"
                      :value="option.uid"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model.trim="formModel.searchKey"
                    placeholder="请输入姓名或手机号"
                    @keyup.enter.native="doSearch"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="doSearch">查询</el-button>
                  <el-button @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="button_group">
              <el-button icon="iconfont iconbianzu12" @click="addUser">新增用户</el-button>
              <el-button icon="iconfont iconzhongzhimima" @click="resetUserPsd">重置密码</el-button>
            </div>
          </div>
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
            @selection-change="selectionChange"
          >
            <el-table-column label="" type="selection"></el-table-column>
            <el-table-column label="姓名" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.userName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户名" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.loginName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="卡号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.cardNo || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.userMobile || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="职务" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.titleName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="级别" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.levelName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.rmsUserRoleInfos | roles}}</span>
              </template>
            </el-table-column>
            <el-table-column
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
    <reset-psd-dialog
      :show="showResetPsdDialog"
      @close="closeResetPsdDialog"
      @confirm="confirmResetPsd"
    ></reset-psd-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import resetPsdDialog from "@/components/common/resetPsdDialog";
import {
  getBackUserList,
  getUserRoles,
  editAuth,
  deleteUser,
  resetPsd,
} from "@/views/index/api/onDuty/api.yy.js";
import { getPublicKey } from "@/views/index/api/eas/api.eas.js";
import _debounce from "lodash/debounce";

export default {
  name: "sameLevelUser",
  components: { visBreadcrumb, resetPsdDialog },
  filters: {
    roles(val) {
      const roleNameList = val.reduce((pre, cur) => {
        return [...pre, cur.roleName];
      }, []);
      return roleNameList.join(",");
    },
  },
  data() {
    return {
      breadcrumbData: [{ name: "用户管理" }, { name: "本级用户" }],
      treeData: [],
      tableData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      roleList: [],
      formModel: {
        roleId: null,
        searchKey: "",
      },
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      curUserUid: "",
      proKey: "",
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
      this.doSearch();
      this.getUserRoles();
      this.getPublicKey();
      // 清除从人员通讯录点击设为系统用户跳转过来的数据
      localStorage.removeItem("setSystem");
    },
    handleNodeClick() {},
    // 触发搜索
    doSearch: _debounce(function() {
      this.getBackUserList();
    }, 100),
    // 重置搜索条件
    reset: _debounce(function() {
      this.formModel.roleId = null;
      this.formModel.searchKey = "";
      this.getBackUserList();
    }, 100),
    // 点击新增
    addUser() {
      this.$router.push({
        path: "/main/editSameLevelUser",
        query: {
          flag: "add",
        },
      });
    },
    // 启用用户
    handleEnabled(row) {
      this.editAuth(row);
    },
    // 禁用用户
    handleForbidden(row) {
      this.editAuth(row);
    },
    // 点击编辑
    handleEdit(row) {
      this.$router.push({
        path: "/main/editSameLevelUser",
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
          this.deleteUser(row);
        })
        .catch();
    },
    /* 表格分页方法 */
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
    // 选择行首复选框
    selectionChange(selections) {
      console.log("selections", selections);
      this.selectedList = selections;
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
    // 获取后台用户列表
    async getBackUserList() {
      const params = {
        "where.keyword": this.formModel.searchKey || null,
        "where.roleId": this.formModel.roleId || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: null,
        order: null,
      };
      try {
        const { code, data } = await getBackUserList(params);
        if (code === "00000000") {
          this.tableData = data.list;
          this.total = data.total;
        }
      } catch {
        this.$message({
          message: "查询用户列表失败",
          type: "error",
        });
      }
    },
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
          const roleList = data.list.filter(
            (it) => it.roleName !== "超级管理员"
          );
          roleList.unshift({
            roleName: "全部",
            uid: null,
          });
          this.roleList = roleList;
        }
      } catch {
        this.$message({
          message: "查询角色列表失败",
          type: "error",
        });
      }
    },
    // 启用、禁用用户
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
    // 删除用户请求
    async deleteUser({ uid, userName }) {
      try {
        const params = { uid };
        const { code } = await deleteUser(params);
        if (code === "00000000") {
          this.$message({
            message: `已删除用户：${userName}`,
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
          this.$refs.versionTable.clearSelection();
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
/deep/ .el-form-item {
  margin-bottom: 0px;
}
</style>
