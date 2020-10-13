<!-- 
* @module unit-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 组织机构列表
-->
<template>
  <div class="statistics usm">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left" v-loading="treeIsloading">
          <org-tree
            ref="tree"
            :data="unitData"
            :props="defaultProps"
            rootId
            :highlight-current="true"
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div>
              <el-button @click.native="addUnit" icon="iconfont iconbianzu12">新增</el-button>
            </div>
            <div class="filter_form">
              <el-input
                v-model.trim="keyword"
                @keyup.enter.native="doSearch"
                suffix-icon="el-icon-doSearch"
                placeholder="请输入机构名称"
              ></el-input>
              <el-button type="primary" @click="doSearch">查找</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
          <el-table :data="tableData" v-loading="tableIsloading">
            <el-table-column
              show-overflow-tooltip
              label="单位名称">
              <template slot-scope="scope">
                <span>{{scope.row.unitName || '-'}}</span>
              </template>
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
            <el-table-column label="传真">
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
              label="上级机构">
              <template slot-scope="scope">
                <span>{{ scope.row.parentUnitName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="80px"
              label="操作">
              <template slot-scope="scope">
                <span class="handle_btn" @click="handleView(scope.row)">查看</span>
                <span class="handle_btn" @click="handleEdit(scope.row)">修改</span>
                <span v-if="scope.row.level !== 1" class="handle_btn" @click="handleDelete(scope.row)">删除</span>
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
import orgTree from "@/components/common/orgTree";
import {
  getZbTree,
  getUnitList,
  deleteUnit,
} from "@/views/index/api/onDuty/api.yy.js";

export default {
  name: "unit-management",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [{ name: "系统管理" }, { name: "组织机构" }],
    unitData: [],
    rootId: "",
    tableData: [],
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    treeIsloading: false,
    tableIsloading: false,
    keyword: "",
    parentUid: "",
    parentUnitName: "",
    pageNum: 1,
    pageSize: 10,
    total: 0,
    proKey: "",
  }),
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.proKey = userInfo.proKey;
      this.getZbTree();
    },
    // 错误提示框
    errorMessage(msg) {
      this.$message({
        message: msg,
        type: "error",
      });
    },
    // 获取总后台机构树
    async getZbTree() {
      this.treeIsloading = true;
      try {
        const { code, data } = await getZbTree();
        if (code === "00000000") {
          this.unitData = [data];
          this.parentUid = this.rootId = data.uid;
          this.parentUnitName = data.unitName;
          this.doSearch();
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
        }
      } catch {
        this.errorMessage("获取机构树失败!");
      }
      this.treeIsloading = false;
    },
    // 删除机构
    async deleteUnit(row) {
      try {
        const { code } = await deleteUnit({
          uid: row.uid,
        });
        if (code === "00000000") {
          this.$message({
            message: `删除${row.unitName}成功`,
            type: "success",
          });
          this.parentUid = row.parentUid;
          this.doSearch();
          this.getZbTree();
        }
      } catch {
        this.errorMessage(`删除${row.unitName}失败`);
      }
    },
    // 点击新增按钮
    addUnit() {
      this.$router.push({
        path: "/main/editUnit",
        query: {
          uid: this.uid,
          flag: "add",
          parentUid: this.parentUid,
          parentUnitName: this.parentUnitName,
        },
      });
    },
    // 点击机构树节点
    handleNodeClick(data) {
      this.parentUid = data.uid;
      this.parentUnitName = data.unitName;
      this.pageNum = 1;
      this.doSearch();
    },
    // 搜索
    async doSearch() {
      this.tableIsloading = true;
      try {
        const params = {
          "where.unitId": this.parentUid,
          "where.unitType": 1,
          "where.keyword": this.keyword || null,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          orderBy: "a.level asc,a.sort_id",
          order: "asc",
        };
        const { code, data } = await getUnitList(params);
        if (code === "00000000") {
          this.initTableData(data.list);
          this.total = data.total;
          this.tableIsloading = false;
          return;
        }
      } catch {
        this.tableIsloading = false;
        this.errorMessage("获取机构列表失败");
      }
    },
    // 初始化表格数据
    initTableData(list) {
      this.tableData = list.reduce((pre, cur) => {
        let phoneData = {
          unitPhone: [],
          dutyPhone: [],
          fax: [],
        };
        const phoneKeyList = ["unitPhone", "dutyPhone", "fax"];
        cur.phoneList.map(({ type, phone }) => {
          phoneData[phoneKeyList[type - 1]].push(phone);
        });
        phoneKeyList.map((key) => {
          cur[key] = phoneData[key].join(",");
        });
        return [...pre, cur];
      }, []);
    },
    // 重置搜索条件
    reset() {
      this.keyword = "";
      this.pageNum = 1;
      this.doSearch();
    },
    // 点击编辑
    handleEdit(row) {
      this.$router.push({
        path: "/main/editUnit",
        query: {
          uid: row.uid,
          flag: "edit",
        },
      });
    },
    // 点击查看
    handleView(row) {
      this.$router.push({
        path: "/main/viewUnit",
        query: {
          uid: row.uid,
        },
      });
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm(
        "您确认要删除此信息吗？删除后，所有下级单位和用户会被清除。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteUnit(row);
        })
        .catch(() => {});
    },
    // 更改当前每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.doSearch();
    },
    // 更改当前页码
    handleCurrentChange(val) {
      this.pageNum = val;
      this.doSearch();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
