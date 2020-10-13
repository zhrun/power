<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-11
* @description 导入用户
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data='breadcrumbData'></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <div class="import_box">
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
                  :on-progress="onProgress"
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
                    <p>所属单位、姓名、用户名、手机号码</p>
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
          <!-- <div class="button_group">
            <el-button @click="goBack">返回</el-button>
          </div> -->
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
  downloadUserTemUrl,
  importSysUserUrl,
} from "@/views/index/api/onDuty/api.yy.js";
import { exportFn } from "@/utils/util";
import store from "@/store/store.js";

export default {
  name: "import-manager",
  components: { visBreadcrumb, orgTree },
  data: () => ({
    breadcrumbData: [
      { name: "系统管理" },
      { name: "用户管理", routerName: "userManagement" },
      { name: "导入管理员" },
    ],
    treeData: [],
    rootId: "", // 根节点的id
    treeIsloading: false,
    defaultProps: {
      children: "childList",
      label: "unitName",
    },
    uid: "",
    unitName: "",
    action: importSysUserUrl,
    downloadUrl: downloadUserTemUrl,
    downloadTitle: "管理员导入模板",
    uploadParam: {},
    errorUrl: "",
    uploadSuccess: false,
    uploadHeaders: {
      platformType: 2, //1 后台  2 web 3app
      sourceType: "web",
    },
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getZbTree();
    },
    download() {
      exportFn(downloadUserTemUrl, {}, "管理员导入模板", "xls");
    },
    // 点击机构树节点
    handleNodeClick(data) {
      this.unitName = data.unitName;
      this.uid = data.uid;
      this.uploadParam = {
        unitUid: this.uid,
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
    // 上传过程中的回调
    onProgress() {
      console.log(arguments);
    },
    // 回退
    goBack() {
      this.$router.go(-1);
    },
    // 获取总后台机构树
    async getZbTree() {
      this.treeIsloading = true;
      try {
        const { code, data } = await getZbTree();
        if (code === "00000000") {
          this.treeData = [data];
          this.uid = data.uid;
          this.rootId = data.uid;
          this.unitName = data.unitName;
          this.uploadParam = {
            unitUid: data.uid,
          };
          this.treeIsloading = false;
          this.doSearch();
        }
      } catch {
        this.treeIsloading = false;
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
          text-decoration: none;
          padding: 0 10px;
          height: 40px;
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
      /deep/ .el-upload {
        width: 100%;
      }
      .import_msg_box {
        border: 1px solid #e5eaf4;
        padding: 15px;
        border-radius: 6px;
        height: 300px;
        color: #c3c9d8;
      }
    }
  }
}
.footer_button {
  position: relative;
  left: 75px;
}
</style>
