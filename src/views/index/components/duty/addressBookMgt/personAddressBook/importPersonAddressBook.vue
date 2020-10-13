<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 导入人员通讯录
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data='breadcrumbData'></vis-breadcrumb>
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
              <el-col :span="12">在左边机构树中选中要导入的人员信息的单位</el-col>
            </el-row>
            <el-row>
              <el-col :span="4">下载模版</el-col>
              <el-col :span="8">
                <a class="import_btn" @click="download">
                  <div>
                    <i class="el-icon-paperclip"></i>
                    <span>{{downloadTitle}}</span>
                  </div>
                  <i class="el-icon-download"></i>
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
                  :show-file-list="false"
                  :headers="uploadHeaders"
                  with-credentials
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
  downloadUserUrl,
  uploadUserUrl,
  queryBackTree,
} from "@/views/index/api/onDuty/api.yy.js";
import { exportFn } from "@/utils/util";
import store from "@/store/store.js";

export default {
  name: "import-person-address-book",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [
      { name: "通讯录管理" },
      { name: "人员通讯录", routerName: "personAddressBook" },
      { name: "导入人员通讯录" },
    ],
    treeData: [],
    treeIsloading: false,
    rootId: "",
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    unitName: "",
    unitUid: "",
    unitType: "",
    uploadSuccess: false,
    downloadUrl: downloadUserUrl,
    action: uploadUserUrl,
    uploadParam: {
      unitUid: "",
      unitType: 1,
    },
    uploadHeaders: {
      platformType: 2, //1 后台  2 web 3app
      sourceType: "web",
    },
    errorUrl: "",
  }),
  computed: {
    downloadTitle() {
      return `${this.unitName}人员导入模板`;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.queryBackTree();
    },
    // 点击机构数节点
    handleNodeClick({ uid, unitName, unitType }) {
      this.unitUid = uid;
      this.unitName = unitName;
      this.unitType = unitType;
      this.uploadParam = {
        unitUid: uid,
        unitType: unitType,
      };
    },
    download() {
      exportFn(
        downloadUserUrl,
        {
          unitUid: this.unitUid,
          unitType: this.unitType,
        },
        this.downloadTitle,
        "xls"
      );
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
    goBack() {
      this.$router.go(-1);
    },
    // 获取后台机构树数据
    async queryBackTree() {
      this.treeLoading = true;
      try {
        // 过滤类别
        const params = {
          filterType: 4,
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000" && data) {
          this.treeData = [data];
          this.unitUid = this.rootId = this.uploadParam.unitUid = data.uid;
          this.unitName = data.unitName;
          this.unitType = data.unitType;
          this.pageNum = 1;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(data.uid);
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.treeLoading = false;
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
