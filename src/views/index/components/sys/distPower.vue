<!-- 
* @author  ps_gen
* @Date: 2020-10-9 09:52:34
* @description 权限配置.
-->
<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height: 100%">
        <p class="subTitle">{{ name }}</p>
        <div class="clearfix">
          <div class="listBox limit-dialog" style="float: left">
            <el-scrollbar style="height: 100%">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div class="tree-list">
                <el-tree class="filter-tree" :data="allLimitObj.A" show-checkbox check-strictly default-expand-all node-key="uid"
                  ref="tree" @check-change="treeCheckChange" @check="treeCheck" :props="defaultProps"></el-tree>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div>
          <el-button type="default" @click="callBack" class="back-btn">返 回</el-button>
          <el-button type="primary" @click="saveTree" class="back-btn">保 存</el-button>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getRoleResources, roleAuthBatch, getroleAuthBatch, getResources,} from "@/views/index/api/system/api.zr.js";
import { proKey } from "@/config/config.js";
import { treeData } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      permission: JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [
        { name: "系统管理" },
        { name: "角色管理", routerName: "rolemanage" },
        { name: "配置权限" },
      ],
      versionLoading: false,
      proKey: proKey,
      allLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      allPermissions: [],
      defaultProps: {
        children: "children",
        label: "resourceName",
      },
      defaultKeys: [],
      checkedKeys: [],
      name: "",
      desc: "",
      checkAll: false,
      isIndeterminate: false,
      parentList: null,
    };
  },
  mounted() {
    this.getResources();
    this.getroleAuthBatch(this.$route.params.uid);
    this.name = this.$route.params.name;
    this.desc = this.$route.params.desc;
  },
  methods: {
    callBack() {
      this.$router.go(-1);
    },
    saveTree() {
      let checkKeys = this.$refs.tree.getCheckedKeys();
      let addKeys = [], delKeys = [];
      checkKeys.forEach((el) => {
        if (this.defaultKeys.indexOf(el) == -1) {
          addKeys.push({ opType: 1, uid: el,});
        }
      });
      this.defaultKeys.forEach((el) => {
        if (checkKeys.indexOf(el) == -1) {
          delKeys.push({ opType: 3, uid: el,});
        }
      });
      let d = {
        authResourceList: [],
        proKey: this.proKey,
        uid: this.$route.params.uid,
      };
      d.authResourceList = addKeys.concat(delKeys);
      if (d.authResourceList.length < 1) {
        this.$message({
          type: "info",
          message: "无任何修改",
        });
        return;
      }
      this.roleAuthBatch(d);
    },
    roleAuthBatch(d) {
      roleAuthBatch(d).then((res) => {
        if (res && res.data) {
          this.$message({
            type: "success",
            message: "权限修改成功",
          });
          this.defaultKeys = [];
          this.checkedKeys = [];
          this.getroleAuthBatch(this.$route.params.uid);
        }
      });
    },
    getroleAuthBatch(d) {
      getroleAuthBatch({
        proKey: this.proKey,
        uid: d,
      }).then((res) => {
        if (res && res.data && res.data.roleAuthList.length > 0) {
          res.data.roleAuthList.forEach((el) => {
            this.defaultKeys.push(el.uid);
            this.checkedKeys.push(el.uid);
          });
          this.timer = setTimeout(() => {
            if (this.checkedKeys.length == this.allPermissions.length) {
              this.isIndeterminate = false;
              this.checkAll = true;
            } else if (
              this.checkedKeys.length > 0 &&
              this.checkedKeys.length < this.allPermissions.length
            ) {
              this.isIndeterminate = true;
              this.checkAll = false;
            } else if (this.checkedKeys.length <= 0) {
              this.isIndeterminate = false;
              this.checkAll = false;
            }
            this.$refs.tree.setCheckedKeys(this.defaultKeys);
          }, 100);
        }
      });
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      if (val) {
        this.checkedKeys = [...this.allPermissions];
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
      } else {
        this.checkedKeys = [];
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
      }
    },
    treeCheck(a, b) {
      //关联上下级是否要选中
      let curKeys = this.$refs.tree.getCheckedKeys();
      if (curKeys.indexOf(a.uid) > -1) {
        let pid = a.parentUid;
        if (curKeys.indexOf(pid) == -1) {
          this.findParent(pid, curKeys);
          this.$refs.tree.setCheckedKeys(curKeys);
        }
      } else {
        if (a.children && a.children.length > 0) {
          this.chooseChild(a, curKeys);
        }
      }
    },
    findParent(idx, curKeys) {
      let a = this.parentList.find((e) => e.uid == idx);
      if (a) {
        curKeys.push(idx);
        if (a.parentUid && a.resourceLayer != 0) {
          this.findParent(a.parentUid, curKeys);
        }
      }
    },
    chooseChild(a, curKeys) {
      if (a.children && a.children.length > 0) {
        a.children.forEach((el) => {
          if (curKeys.indexOf(el.uid) > -1) {
            curKeys.splice(curKeys.indexOf(el.uid), 1);
          }
          if (el.children && el.children.length > 0) {
            this.chooseChild(el, curKeys);
          }
        });
      }
      this.$refs.tree.setCheckedKeys(curKeys);
    },
    treeCheckChange(a, b, c) {
      let currentCheck = this.$refs.tree.getCheckedKeys();
      if (currentCheck.length == this.allPermissions.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else if (
        currentCheck.length > 0 &&
        currentCheck.length < this.allPermissions.length
      ) {
        this.checkAll = false;
        this.isIndeterminate = true;
      } else if (currentCheck.length <= 0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    },
    //初始化数据
    getResources() {
      this.allLimitObj.A = [];
      getResources({
        proKey: this.proKey,
      }).then((res) => {
        if (res) {
          this.parentList = res.data;
          res.data.forEach((item) => {
            if (item.resourceLayer != 0) {
              this.allPermissions.push(item.uid);
            }
          });
          this.allLimitObj.A = treeData(res.data);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.back-btn{
    margin-left: 20px; 
    width: 150px; 
    margin-bottom: 0px
}
.statistics {
  position: relative;
}
.subTitle {
  font-size: 16px;
  color: #188ffb;
  padding-bottom: 10px;
  padding-left: 20px;
}
.listBox {
  border: 1px solid rgba(229, 234, 244, 1);
  width: 40%;
  padding: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  height: 65vh;
}
.flt {
  float: left;
  width: 200px;
  padding: 15px;
  height: 70vh;
  margin-bottom: 10px;
  background: rgba(229, 234, 244, 1);
  h3 {
    font-size: 16px;
    font-weight: bold;
    padding: 10px 0px;
  }
  .oncur {
    background: #ffffff;
    padding: 5px 10px;
    border-radius: 15px;
  }
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
<style>
.el-dialog__body {
  padding: 30px 100px 0px 60px;
}
.statistics .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>