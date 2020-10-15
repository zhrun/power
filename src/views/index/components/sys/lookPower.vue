<!-- 
* @author  ps_gen
* @Date: 2020-10-9 09:52:34
* @description 查看权限.
-->
<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <div class="limt">
        <el-scrollbar style="height: 100%">
          <p class="subTitle">{{ name }}</p>
          <div class="listBox limit-dialog">
            <p><b>已有权限</b></p>
            <div class="tree-list">
              <el-tree class="filter-tree" :data="seeLimitObj.A" default-expand-all node-key="resourceName" ref="trees" :props="defaultProps"></el-tree>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div style="text-align: center">
        <el-button @click="callBack" class="back-btn">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getroleAuthBatch, getResources, } from "@/views/index/api/system/api.zr.js";
import { proKey } from "@/config/config.js";
import { treeData } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [
        { name: "系统管理" },
        { name: "角色管理", routerName: "rolemanage" },
        { name: "查看角色权限" },
      ],
      versionLoading: false,
      proKey: proKey,
      allUser: [],
      defaultProps: {
        children: "children",
        label: "resourceName",
      },
      seeLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      name: "",
      desc: "",
    };
  },
  mounted() {
    this.getroleAuthBatch(this.$route.params.uid);
    this.name = this.$route.params.name;
    this.desc = this.$route.params.desc;
  },
  methods: {
    getroleAuthBatch(d) {
      getroleAuthBatch({proKey: this.proKey,uid: d,}).then((res) => {
        if (res && res.data && res.data.roleAuthList.length > 0) {
          this.onSeeLimit(res.data);
        }
      });
    },
    onSeeLimit(obj) {
      this.seeLimitObj.A = [];
      this.seeLimitObj.B = [];
      this.seeLimitObj.C = [];
      this.seeLimitObj.D = [];
      this.seeLimitObj.E = [];
      this.seeLimitObj.A = treeData(obj.roleAuthList);
    },
    callBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.back-btn{
    margin-left: 20px;
    width: 150px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.limt {
  height: calc(100% - 80px);
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
}
.limit-dialog {
  /deep/ .el-button {
    background: #0785fd;
    color: #fff;
  }
  /deep/ .el-icon-caret-right:before {
    content: "";
  }
  /deep/ .el-tree-node__expand-icon.is-leaf {
    background: none;
  }
  /deep/ .el-tree-node__expand-icon {
    background: url("../../../../assets/img/temp/expand.png") no-repeat;
  }
  /deep/ .el-tree-node__expand-icon.expanded {
    background: url("../../../../assets/img/temp/takeup.png") no-repeat;
    transform: none;
  }
  /deep/ .el-tree-node__label {
    margin-left: 5px;
  }
  /deep/ .el-checkbox__inner {
    margin-left: 5px;
  }
}
</style>
<style>
.el-dialog__body {
  padding: 30px 100px 0px 60px;
}
</style>