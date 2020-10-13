<!-- 
* @module right-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 权限管理
-->
<template>
  <div class="statistics usm">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <el-scrollbar class="tree">
        <el-tree
          v-loading="loading"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="true"
          :highlight-current="true"
          node-key="uid"
          @handleBtnClick="handleBtnClick"
        >
        </el-tree>
      </el-scrollbar>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { listToTree } from "@/utils/util";
import { getAuthResources } from "@/views/index/api/onDuty/api.yy.js";

export default {
  name: "right-management",
  components: { visBreadcrumb },
  data: () => ({
    breadcrumbData: [{ name: "系统管理" }, { name: "权限管理" }],
    treeData: [],
    loading: false,
    defaultProps: {
      children: "children",
      label: "resourceName",
    },
    btnList: [
      {
        name: "新增", // 按钮名称
        id: "Add", // 操作名称，用于拼接操作回调名
        iconClassList: ["el-icon-circle-plus-outline"], // 按钮图标样式类名列表
      },
      {
        name: "修改", // 按钮名称
        id: "Edit", // 操作名称，用于拼接操作回调名
        iconClassList: ["el-icon-edit"], // 按钮图标样式类名列表
      },
      {
        name: "删除", // 按钮名称
        id: "Delete", // 操作名称，用于拼接操作回调名
        iconClassList: ["el-icon-delete"], // 按钮图标样式类名列表
      },
    ],
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
      // 客户端密钥
      this.proKey = userInfo.proKey;
      this.getAuthResources();
    },
    // 点击树节点
    handleBtnClick(id, data) {
      this["handle" + id](data);
    },
    handleEdit(data) {
      console.log(data);
    },
    handleAdd(data) {
      console.log(data);
    },
    handleDelete(data) {
      console.log(data);
    },
    // 获取权限列表
    async getAuthResources() {
      this.loading = true;
      try {
        // 用户登录信息
        const userInfoStr = localStorage.getItem("vis_user_info") || "{}";
        const { proKey } = JSON.parse(userInfoStr);
        const params = { proKey };
        const { code, data } = await getAuthResources(params);
        if (code === "00000000") {
          this.initTreeData(data);
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    initTreeData(data) {
      // 因为根节点的parentUid和uid一样，需要先提取出来
      const rootIdx = data.findIndex((it) => it.parentUid === it.uid);
      // 根节点的uid
      const rootParentUid = data[rootIdx].uid;
      // 去除根节点后的数据
      const list = data;
      // 根节点
      const rootIt = list.splice(rootIdx, 1)[0];
      rootIt.level = 1;
      // 递归转为树结构
      const tree = listToTree(list, rootParentUid);
      // 树结构放到根节点下
      rootIt.children = tree;
      this.treeData = [rootIt];
    },
  },
};
</script>

<style lang="scss" scoped>
.tree {
  width: 100%;
  height: 100%;
  background: #fff;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
