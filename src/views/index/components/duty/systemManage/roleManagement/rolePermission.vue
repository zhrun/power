<!-- 
* @module role-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查看角色权限/配置角色权限
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_content">
      <div class="title">{{ `${isEdit ? '配置':'查看'}【${this.roleName}】权限` }}</div>
      <el-scrollbar class="tree">
        <el-tree
          ref="authTree"
          :data="treeData"
          :props="defaultProps"
          :show-checkbox="isEdit"
          default-expand-all
          check-strictly
          node-key="uid"
          @check-change="handleCheckChange"
        ></el-tree>
      </el-scrollbar>
      <div class="footer_buttons">
        <el-button @click="back">返回</el-button>
        <el-button @click="save" type="primary" v-if="isEdit">保存</el-button>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { listToTree } from "@/utils/util";
import {
  getAuthResources,
  getAuthResourcesByRole,
  empowerBatch,
} from "@/views/index/api/onDuty/api.yy.js";
import _xor from "lodash/xor";

export default {
  name: "role-permission",
  components: {
    visBreadcrumb,
  },
  props: {
    uid: "",
    roleName: "",
    flag: "",
  },
  data: () => ({
    breadcrumbData: [
      { name: "系统管理" },
      { name: "角色管理", routerName: "roleManagement" },
    ],
    title: "",
    treeData: [],
    authUidList: [],
    defaultProps: {
      children: "children",
      label: "resourceName",
    },
  }),
  computed: {
    isEdit() {
      return this.flag === "edit";
    },
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
      this.proKey = userInfo.proKey;
      this.breadcrumbData.push({
        name: this.isEdit ? "配置权限" : "查看角色权限",
      });
      if (this.isEdit) {
        this.getAuthResources();
      } else {
        this.getAuthResourcesByRole();
      }
    },
    handleCheckChange() {},
    // 回退
    back() {
      if (this.isEdit) {
        this.$confirm("是否确定要返回？", "提示")
        .then(() => {
          this.goBack();
        })
        .catch();
      } else {
        this.goBack();
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // 初始化树结构
    initTreeData(data) {
      const list = data;
      const arr = data.filter((it) => it.resourceLayer === 1);
      arr.forEach((el) => {
        const itTree = listToTree(list, el.uid);
        el.children = itTree;
      });
      this.treeData = arr;
    },
    // 初始化角色权限
    initRoleAuth(roleAuthList) {
      this.authUidList = roleAuthList.reduce((list, cur) => {
        return [...list, cur.uid];
      }, []);
      this.$refs.authTree.setCheckedNodes(roleAuthList);
    },
    // 保存
    save() {
      const checkedKeys = this.$refs["authTree"].getCheckedKeys();
      // 已选中的节点列表和初始权限列表之间的差集
      const xorList = _xor(checkedKeys, this.authUidList);
      const res = xorList.reduce((pre, uid) => {
        const opType = this.authUidList.includes(uid) ? 3 : 1;
        const authResource = {
          uid,
          opType,
        };
        return [...pre, authResource];
      }, []);
      this.empowerBatch(res);
    },
    // 获取所有的权限列表
    async getAuthResources() {
      this.loading = true;
      try {
        const userInfoStr = localStorage.getItem("vis_user_info") || "{}";
        const { proKey } = JSON.parse(userInfoStr);
        const params = { proKey };
        const { code, data } = await getAuthResources(params);
        if (code === "00000000") {
          this.initTreeData(data);
          this.getAuthResourcesByRole();
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    // 获取权限树
    async getAuthResourcesByRole() {
      try {
        const params = {
          uid: this.uid,
          proKey: this.proKey,
        };
        const { code, data } = await getAuthResourcesByRole(params);
        if (code === "00000000") {
          const { roleAuthList } = data;
          if (this.isEdit) {
            this.initRoleAuth(roleAuthList);
          } else {
            this.initTreeData(roleAuthList);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 批量赋权
    async empowerBatch(authResourceList) {
      try {
        const params = {
          authResourceList,
          proKey: this.proKey,
          uid: this.uid,
        };
        const { code } = await empowerBatch(params);
        if (code === "00000000") {
          this.$message({
            message: "权限配置成功",
            type: "success",
          });
          this.goBack();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main_content {
  height: calc(100% - 40px);
  overflow-y: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
}
.title {
  color: #5458fe;
  font-size: 16px;
  height: 40px;
}
.tree {
  width: 60%;
  height: 80%;
  border: 1px solid $border_color;
  padding: 20px 0 0 20px;
}
.footer_buttons {
  margin-top: 20px;
  display: flex;
  align-items: center;
  .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
