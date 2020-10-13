<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 单位通讯录列表
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            v-loading="treeIsLoading"
            :data="treeData"
            :props="defaultProps"
            :rootId="rootId"
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-input
                v-model.trim="searchKey"
                @keyup.enter.native="doSearch"
                placeholder="请输入机构名称"
              ></el-input>
              <el-button type="primary" @click="doSearch">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
            <div class="button_group">
              <el-button icon="iconfont iconbianzu12" @click="add">新增</el-button>
              <el-button icon="iconfont iconbianzu26" @click="importMsg">导入</el-button>
              <el-button icon="iconfont iconbianzu15" @click="download">导出</el-button>
            </div>
          </div>
          <el-table :data="tableData" v-loading="tableIsLoading">
            <el-table-column label="机构名称" prop="unitName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="单位电话">
              <template slot-scope="scope">
                <el-tooltip placement="left" :disabled="!scope.row.unitPhone" popper-class="popper">
                  <div slot="content">
                    <span
                      class="user_phone_tip"
                      v-for="(item ,index) in scope.row.unitPhone.split(',')"
                      :key="scope.row.uid + 'unitPhone' + index"
                      :class="[(index % 3 === 0 || index % 3 === 1) && index + 1 !== scope.row.unitPhone.split(',').length ? 'has_after' : '']"
                    >
                      {{item}}
                    </span>
                  </div>
                  <span>{{scope.row.unitPhone || '-'}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="值班室电话">
              <template slot-scope="scope">
                <el-tooltip placement="left" :disabled="!scope.row.dutyPhone" popper-class="popper">
                  <div slot="content">
                    <span
                      class="user_phone_tip"
                      v-for="(item ,index) in scope.row.dutyPhone.split(',')"
                      :key="scope.row.uid + 'dutyPhone' + index"
                      :class="[(index % 3 === 0 || index % 3 === 1) && index + 1 !== scope.row.dutyPhone.split(',').length ? 'has_after' : '']"
                    >
                      {{item}}
                    </span>
                  </div>
                  <span>{{scope.row.dutyPhone || '-'}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="传真" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip placement="left" :disabled="!scope.row.fax" popper-class="popper">
                  <div slot="content">
                    <span
                      class="user_phone_tip"
                      v-for="(item ,index) in scope.row.fax.split(',')"
                      :key="scope.row.uid + 'fax' + index"
                      :class="[(index % 3 === 0 || index % 3 === 1) && index + 1 !== scope.row.fax.split(',').length ? 'has_after' : '']"
                    >
                      {{item}}
                    </span>
                  </div>
                  <span>{{scope.row.fax || '-'}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <span class="handle_btn" @click="handleDisabled(scope.row)" v-if="scope.row.status === 0">启用</span>
                <span class="handle_btn" @click="handleDisabled(scope.row)" v-else>禁用</span>
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
  exportUnitUrl,
  queryBackTree,
  getBackUnitList,
  editUnit,
  deleteUnit,
} from "@/views/index/api/onDuty/api.yy.js";
import { exportFn } from "@/utils/util";
import _debounce from "lodash/debounce";
import _cloneDeep from "lodash/cloneDeep";

export default {
  name: "unitAddressBook",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [{ name: "通讯录管理" }, { name: "单位通讯录" }],
    searchKey: "",
    treeData: [],
    rootId: "",
    treeIsLoading: false,
    tableData: [],
    tableIsLoading: false,
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    parentUid: "",
    parentUnitName: "",
    uid: "",
    pageNum: 1,
    pageSize: 10,
    total: 0,
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryBackTree();
    },
    // 点击树节点
    handleNodeClick({ uid, unitName, parentUid, parentUnitName, unitType }) {
      this.uid = uid;
      if (unitType === 1) {
        this.parentUid = uid;
        this.parentUnitName = unitName;
      } else {
        this.parentUid = parentUid;
        this.parentUnitName = parentUnitName;
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
      this.getBackUnitList();
    }, 100),
    // 初始化表格数据
    initTableData(list) {
      this.tableData = list.reduce((pre, cur) => {
        let phoneData = {
          unitPhone: [],
          dutyPhone: [],
          fax: [],
        };
        const phoneKeyList = {
          1: "unitPhone",
          2: "dutyPhone",
          3: "fax",
        };
        cur.phoneList.map(({ type, phone }) => {
          phoneData[phoneKeyList[type]] &&
            phoneData[phoneKeyList[type]].push(phone);
        });
        Object.keys(phoneData).map((key) => {
          cur[key] = phoneData[key].join(",");
        });
        return [...pre, cur];
      }, []);
    },
    // 点击新增
    add() {
      this.$router.push({
        path: "/main/editUnitAddressBook",
        query: {
          parentUid: this.parentUid,
          parentUnitName: this.parentUnitName,
          flag: "add",
        },
      });
    },
    // 点击导入
    importMsg() {
      this.$router.push({
        path: "/main/importUnitAddressBook",
      });
    },
    // 点击编辑
    handleEdit(row) {
      this.$router.push({
        path: "/main/editUnitAddressBook",
        query: {
          uid: row.uid,
          flag: "edit",
        },
      });
    },
    // 点击禁用
    handleDisabled(row) {
      this.editUnit(row);
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm("删除后，该机构所有用户会被清除，确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUnit(row);
          this.queryBackTree();
        })
        .catch(() => {});
    },
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
    // 获取后台单位通讯录列表
    async getBackUnitList() {
      const params = {
        "where.unitId": this.uid,
        "where.keyword": this.searchKey || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: "a.sort_id",
        order: "asc",
      };
      this.tableIsLoading = true;
      try {
        const { code, data } = await getBackUnitList(params);
        if (code === "00000000") {
          this.initTableData(data.list);
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      }
      this.tableIsLoading = false;
    },
    // 导出
    async download() {
      const params = {
        parentUid: this.uid,
        keyword: this.searchKey,
      };
      exportFn(exportUnitUrl, params, "单位通讯录", "xls", this);
    },
    // 获取后台机构树
    async queryBackTree() {
      this.treeIsloading = true;
      try {
        const params = {};
        const { code, data } = await queryBackTree(params);
        if (code === "00000000" && data) {
          this.treeData = [data];
          this.uid = data.uid;
          if (data.unitType === 1) {
            this.parentUid = data.uid;
            this.parentUnitName = data.unitName;
          } else {
            this.parentUid = data.parentUid;
            this.parentUnitName = data.parentUnitName;
          }
          this.rootId = data.uid;
          this.treeIsloading = false;
          this.doSearch();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
        }
      } catch (error) {
        this.treeIsloading = false;
        console.log(error);
      }
    },
    // 禁用/启用单位
    async editUnit(row) {
      try {
        const params = _cloneDeep(row);
        params.status = params.status === 0 ? 1 : 0;
        const { code } = await editUnit(params);
        if (code === "00000000") {
          this.$message({
            message: `已${params.status === 0 ? "禁用" : "启用"}${
              row.unitName
            }`,
            type: "success",
          });
          this.doSearch();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 删除机构
    async deleteUnit(row) {
      try {
        const { code } = await deleteUnit({
          uid: row.uid,
        });
        if (code === "00000000") {
          this.doSearch();
          this.$message({
            message: `删除${row.unitName}成功`,
            type: "success",
          });
        }
      } catch {
        this.errorMessage(`删除${row.unitName}失败`);
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
