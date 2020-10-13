<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查询单位通讯录
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            v-loading="treeIsLoading"
            :data="treeData"
            :props="defaultProps"
            rootId
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="filter_container">
            <div class="filter_form">
              <el-input
                v-model.trim="searchKey"
                @keyup.enter.native="doSearch" 
                suffix-icon="el-icon-search"
                placeholder="请输入机构名称"
              ></el-input>
              <el-button type="primary" @click="doSearch">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="tableIsLoading"
          >
            <el-table-column label="机构名称">
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
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import orgTree from "@/components/common/orgTree";
import { queryUnitTree, getFrontUnitTree } from "@/views/index/api/onDuty/api.yy.js";
import _debounce from "lodash/debounce";

export default {
  name: "CompanyAddressQuery",
  components: { visBreadcrumb, orgTree },
  data() {
    return {
      breadcrumbData: [{ name: "通讯录查询" }, { name: "单位通讯录查询" }],
      treeData: [],
      treeIsLoading: false,
      tableData: [],
      tableIsLoading: false,
      defaultProps: {
        children: "childList",
        label: "unitName",
      },
      parentUid: "",
      loading: false,
      searchKey: "",
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryUnitTree();
    },
    // 点击树节点
    handleNodeClick(data) {
      this.parentUid = data.uid;
      this.pageNum = 1;
      this.doSearch();
    },
    //重置
    reset() {
      this.searchKey = "";
      this.pageNum = 1;
      this.doSearch();
    },
    //查询
    doSearch: _debounce(function() {
      this.getFrontUnitTree();
    }, 100),
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.doSearch();
    },
    // 切换每页展示条数
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.doSearch();
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
    // 获取单位通讯录列表
    async getFrontUnitTree() {
      const params = {
        "where.unitId": this.parentUid,
        "where.keyword": this.searchKey || null,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.tableIsLoading = true;
      try {
        const { code, data } = await getFrontUnitTree(params);
        if (code === "00000000") {
          this.initTableData(data.list);
          this.total = data.total;
        }
      } catch (err) {
        console.log(err);
      }
      this.tableIsLoading = false;
    },
    // 获取后台机构树数据
    async queryUnitTree() {
      this.treeIsloading = true;
      try {
        const params = {
          unitType: null,
        };
        const { code, data } = await queryUnitTree(params);
        if (code === "00000000") {
          this.treeData = [data];
          this.parentUid = data.uid;
          this.parentUnitName = data.unitName;
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
  },
};
</script>

<style lang="scss" scoped>
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
