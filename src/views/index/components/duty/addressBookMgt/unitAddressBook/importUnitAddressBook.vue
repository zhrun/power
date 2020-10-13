<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 导入单位通讯录
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data='breadcrumbData'></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            ref="tree"
            v-loading="treeIsloading"
            :data="treeData"
            :props="defaultProps"
            :root-id="rootId"
            @node-click="handleNodeClick"
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <div class="import_box">
            <el-row>
              <el-col :span="4">选择导入单位</el-col>
              <el-col :span="8">
                <el-input v-model="unitName" disabled></el-input>
              </el-col>
              <el-col :span="12">在左边机构树中选中要导入的上级主管部门</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">下载模版</el-col>
              <el-col :span="8">
                <a class="import_btn" @click="download">
                  <div>
                    <i class="el-icon-paperclip"></i>
                    <span>机构导入模板</span>
                  </div>
                  <!-- <a :href="downloadUrl" :download="downloadTitle"> -->
                    <i class="el-icon-download"></i>
                  <!-- </a> -->
                </a>
              </el-col>
              <el-col :span="12">点击左侧“下载模板”按钮，下载模板到本地，并录入数据</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">导入模板</el-col>
              <el-col :span="8">
                <el-upload
                  :action="action"
                  :multiple="false"
                  :data="uploadParam"
                  with-credentials
                  :show-file-list="false"
                  :headers="uploadHeaders"
                  name="file"
                  :on-success="onSuccess"
                >
                  <el-button>点击选择要导入的模板</el-button>
                </el-upload>
              </el-col>
              <el-col :span="12">选择下载的模板（录入数据后）再导入模板</el-col>
            </el-row>
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="20">
                <div class="import_msg_box">
                  <template v-if="errorUrl">
                    <p><span style="color: red">导入失败！</span>查看原因：<a :href="errorUrl">下载</a></p>
                  </template>
                  <template v-else-if="uploadSuccess">
                    <p><span style="color: red">导入成功！</span></p>
                  </template>
                  <template v-else>
                    <p>请选择正确的EXCEL文件导入，文件的列顺为：</p>
                    <p>机构类别、机构名称、机构简称、组织机构代码、单位电话、值班室电话、传真、值班手机、负责人、地址、邮编、位次、备注</p>
                    <p>导入成功后，显示导入信息</p>
                  </template>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <el-button @click="goBack" class="footer_button">返回</el-button>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import orgTree from "@/components/common/orgTree";
import {
  downloadUnitUrl,
  uploadUnitUrl,
  queryBackTree,
} from "@/views/index/api/onDuty/api.yy.js";
import { exportFn } from "@/utils/util";
import store from "@/store/store.js";

export default {
  name: "ImportUnitAddressBook",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [
      { name: "通讯录管理" },
      { name: "单位通讯录", routerName: "unitAddressBook" },
      { name: "导入通讯录" },
    ],
    treeData: [],
    rootId: "",
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    parentUid: "",
    unitName: "",
    action: uploadUnitUrl,
    uploadParam: {
      parentUid: "",
    },
    uploadHeaders: {
      platformType: 2, //1 后台  2 web 3app
      sourceType: "web",
    },
    errorUrl: "",
    uploadSuccess: false,
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryBackTree();
    },
    // 点击机构树节点
    handleNodeClick(data) {
      this.unitName = data.unitName;
      this.parentUid = data.uid;
      this.uploadParam = {
        parentUid: data.uid,
      };
    },
    // 上传成功回调
    onSuccess({ code, data, viewMsg }) {
      if (code === "00000000") {
        this.errorUrl = "";
        this.uploadSuccess = true;
      } else if (code === "10060002") {
        this.$message({ message: viewMsg, type: "error" });
        store.commit("exitLogin");
        setTimeout(() => {
          window.location.href = "./";
        }, 500);
      } else if (code === "10020004") {
        this.errorUrl = data.fileUrl;
        this.uploadSuccess = false;
      } else {
        let msg = "访问出错";
        if (viewMsg) {
          msg = viewMsg;
        }
        this.$message({ message: msg, type: "error" });
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    download() {
      exportFn(downloadUnitUrl, {}, "机构导入模板", "xls");
    },
    // 虎丘后台树数据
    async queryBackTree() {
      this.treeIsloading = true;
      try {
        const params = {
          unitType: 1,
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000" && data) {
          this.treeData = [data];
          this.parentUid = this.rootId = this.uploadParam.parentUid = data.uid;
          this.unitName = data.unitName;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
          this.treeIsloading = false;
        }
      } catch (error) {
        this.treeIsloading = false;
        console.log(error);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.import_box {
  .el-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-col {
      &:first-child {
        text-align: right;
        color: #666666;
        margin-right: 10px;
      }
      &:nth-child(2) {
        margin-right: 20px;
        .el-button {
          width: 100%;
          color: #fff;
          background-color: #5458fe;
        }
        .import_btn {
          cursor: pointer;
          padding: 0 10px;
          height: 40px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f0f2f5;
          border-radius: 6px;
          div {
            display: flex;
            align-items: center;
          }
          i {
            color: #999999;
            font-size: 16px;
            & + span {
              margin-left: 10px;
            }
            &:last-child {
              cursor: pointer;
              &:hover {
                color: #5458fe;
              }
            }
          }
          .download {
            cursor: pointer;
          }
        }
      }
      &:nth-child(3) {
        color: #999999;
      }
      .import_msg_box {
        border: 1px solid #e5eaf4;
        padding: 15px;
        border-radius: 6px;
        height: 300px;
        color: #c3c9d8;
      }
      /deep/ .el-upload {
        width: 100%;
      }
    }
  }
}
.footer_button {
  position: relative;
  left: 75px;
}
</style>
