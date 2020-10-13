/* 查看人工录入 */
<template>
  <div class="report-page manual-details">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 主体 -->
    <div class="content-wrap" style="margin-top:10px;margin-left:10px;">
      <!-- 核实模块 -->
      <div class="layout_column">
        <el-scrollbar style="height: 100%;">
          <p class="reporter_wrap title_wrap">
            <span class="tit flx1">
              基本情况
              <span class="remark1" v-if="detailsData.receiveInfo.handleStatus==0">待核实</span>
              <span class="remark1" v-if="detailsData.receiveInfo.handleStatus==1">待审批</span>
              <span class="remark1" v-if="detailsData.receiveInfo.handleStatus==2">待处理</span>
              <span class="remark1" v-if="detailsData.receiveInfo.handleStatus==99">已结束</span>
            </span>
          </p>

          <p class="reporter_wrap">
            <!-- <span>编号：{{detailsData.receiveInfo.eventCode}}</span> -->
            <span
              class="phone"
            >{{detailsData.checkInfo.submitToName}}于{{detailsData.receiveInfo.createTime}}录入</span>

            <!-- <span>{{detailsData.optUserName || '-'}}于{{detailsData.receiveInfo.createTime || '-'}}录入</span> -->
            <span class="phone">联系电话：{{detailsData.checkInfo.submitToPhone || '-'}}</span>
          </p>
          <p></p>

          <ul class="info_list">
            <li>
              <span
                class="influence"
                v-if="detailsData.receiveInfo.affectedNumber==0 || detailsData.receiveInfo.injuredNumber==0 || detailsData.receiveInfo.deadNumber==0 || detailsData.receiveInfo.affectedNumber || detailsData.receiveInfo.injuredNumber || detailsData.receiveInfo.deadNumber"
              >
                受影响情况：
                <span
                  class="mgr-15"
                  v-if="detailsData.receiveInfo.affectedNumber==0 || detailsData.receiveInfo.affectedNumber"
                >{{(detailsData.receiveInfo.affectedNumber==0 || detailsData.receiveInfo.affectedNumber) ? detailsData.receiveInfo.affectedNumber : '-'}}人受影响</span>
                <span
                  class="mgr-15"
                  v-if="detailsData.receiveInfo.injuredNumber==0 || detailsData.receiveInfo.injuredNumber"
                >{{(detailsData.receiveInfo.injuredNumber==0 || detailsData.receiveInfo.injuredNumber) ? detailsData.receiveInfo.injuredNumber : '-'}}人受伤</span>
                <span
                  class="mgr-15"
                  v-if="detailsData.receiveInfo.deadNumber==0 || detailsData.receiveInfo.deadNumber"
                >{{(detailsData.receiveInfo.deadNumber==0 || detailsData.receiveInfo.deadNumber) ? detailsData.receiveInfo.deadNumber : '-'}}人死亡</span>
              </span>
            </li>
            <li>
              <span class="label">事件编号：</span>
              <span class="value">{{detailsData.receiveInfo.eventCode}}</span>
            </li>
            <li>
              <span class="label">事件名称：</span>
              <span class="value">{{detailsData.receiveInfo.eventName || '-'}}</span>
            </li>
            <li>
              <span class="label">发生时间：</span>
              <span class="value">{{detailsData.receiveInfo.eventTime || ''}}</span>
            </li>
            <li>
              <span class="label">发生地点：</span>
              <span class="value">{{detailsData.receiveInfo.eventAddress || '-'}}</span>
            </li>
            <li>
              <span class="label">主要内容：</span>
              <span class="value">{{detailsData.receiveInfo.eventContent || '-'}}</span>
            </li>
            <li>
              <span class="label">事发原因：</span>
              <span class="value">{{detailsData.receiveInfo.eventReason || '-'}}</span>
            </li>
            <li>
              <span class="label">处理措施：</span>
              <span class="value">{{detailsData.receiveInfo.handlingMethod || '-'}}</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 3">
              <span class="label">来电人员：</span>
              <span
                class="value"
              >{{detailsData.receiveInfo.reporterName || '-'}}({{detailsData.receiveInfo.contactPhone || '-'}})</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 3">
              <span class="label">来电时间：</span>
              <span class="value">{{detailsData.receiveInfo.callTime || '-'}}</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 4">
              <span class="label">督办单位：</span>
              <span
                class="value"
              >{{detailsData.receiveInfo.supervisionUnit || '-'}}({{detailsData.receiveInfo.contactPhone || '-'}})</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 4">
              <span class="label">督办下发时间：</span>
              <span class="value">{{detailsData.receiveInfo.supervisionTime || '-'}}</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 4">
              <span class="label">督办要求：</span>
              <span class="value">{{detailsData.receiveInfo.supervisionRemark || '-'}}</span>
            </li>
            <li v-if="detailsData.receiveInfo.receiveType == 5">
              <span class="label">消息渠道：</span>
              <span
                class="value"
              >{{detailsData.receiveInfo.eventChannel || '-'}}({{detailsData.receiveInfo.contactPhone || '-'}})</span>
            </li>
          </ul>
          <!-- <p class="hr_line"></p> -->
        </el-scrollbar>
      </div>
      <div class="layout_column two_right" style="margin-left:10px">
        <el-scrollbar style="height: 100%;">
          <p class="title_wrap">
            <!-- <span class="tit">核实情况</span>
            <span class="overtime" v-show="false">超时</span>-->
            <span class="tit">接报说明</span>
            <!-- <span class="influence">值班员：{{}}</span> -->
          </p>
          <ul class="info_list">
            <li>
              <span class="label">核实附件：</span>
              <span v-if="checkAttachments.length==0||!checkAttachments">-</span>
            </li>
            <li>
              <span class="value">
                <img
                  class="img"
                  style="width:100px;height:100px"
                  v-for="(item, index) in checkAttachments"
                  :key="'checkAttachments_'+index"
                  :src="item.fileType=='mp4'?'./static/img/videoPre.png':item.fileFullPath"
                  @click="previewEnclos(index)"
                />
              </span>
            </li>

            <!-- <li class="h-common">
              <div class="img-content clearfix" v-if="imgList.length>0||videoDataURl.length>0">
                <span class="img-unit" v-for="(item, index) in imgList" :key="index+6">
                  <el-image class="img-fill" :src="item" :preview-src-list="imgList"></el-image>
                </span>
                <span class="img-unit" v-show="videoDataURl && videoDataURl.length>0" v-for="(item, index) in videoList" :key="index+100">
                  <img
                    src="_assets/img/videoPre.png"
                    class="img-fill"
                    @click="playVideo(index)"
                  />
                </span>
              </div>
            </li>-->

            <!-- <li>
              <span class="label">核实附件：</span>
              <span
                class="img-unit"
                v-for="(item, index) in imgList"
                :key="'checkAttachments_'+index"
                v-show="imgList.length>0"
              >
                <el-image
                  class="img-fill"
                  :src="item"
                  :preview-src-list="imgList"
                  style="width: 100px; height: 100px"
                ></el-image>
              </span>

              <span class="value">
                <img
                  src="_assets/img/videoPre.png"
                  class="img"
                  @click="playVideo()"
                  v-show="videoDataURl && videoDataURl.length>0"
                />
              </span>
            </li>-->
            <li>
              <span class="label">附件来源：</span>
              <span class="value">{{detailsData.checkInfo.fileSourceDesc || '-'}}</span>
            </li>
            <li>
              <span class="label">报送对象：</span>
              <span class="value">{{detailsData.approveInfo.submitToName || '-'}}</span>
            </li>
            <li>
              <span class="label">报送备注：</span>
              <span class="value">{{detailsData.approveInfo.submitRemark || '-'}}</span>
            </li>
          </ul>

          <el-button @click="goBack">返回</el-button>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog :visible.sync="enclosVisible" class="enclosDialog">
      <div is="preview" :eData="checkAttachments" v-model="currentEnclosIndex"></div>
    </el-dialog>
    <div class="video" v-if="dialogVisible">
      <span class="close" @click="dialogVisible=false">×</span>
      <video controls class="play-video" style="height:100vh;">
        <source :src="videoDataURl" type="video/mp4" />您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>
    <!-- <div class="video" v-if="dialogVisible">
      <span class="close" @click="dialogVisible=false">×</span>
      <video controls class="play-video"  style="height:100vh;">
        <source :src="videoDataURl" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>-->
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import "_assets/css/module_report.scss";
import { manualDetails } from "@/views/index/api/eas/api.eas.js";
import preview from "_com/preview.vue";

export default {
  name: "programDetails",
  components: { visBreadcrumb, preview },
  data() {
    return {
      // 面包屑导航数据
      breadcrumbData: [
        { name: "突发接报" },
        { name: "人工录入", routerName: "manualUp" },
        { name: "查看详情" }
      ],
      // 录入详情数据
      detailsData: {
        reportInfo: {},
        checkInfo: {},
        reportAttachments: {},
        receiveInfo: {},
        approveInfo: {}
      },
      videoDataURl: "",
      imgList: [],
      videoList: [],
      // 查看附件弹窗显隐开关
      enclosVisible: false,
      dialogVisible: false,
      // 当前查看的附件的路径
      enclosUrl: "",
      checkAttachments: [],
      currentEnclosIndex: 0
    };
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    // 获取数据
    getDetails() {
      let params = {
        uid: this.$route.query.eventId
      };
      manualDetails(params)
        .then(res => {
          if (res && res.data) {
            console.log("manualDetails", res);
            this.detailsData = res.data;
            if (res.data.checkAttachments) {
              this.checkAttachments = res.data.checkAttachments;
              if (this.checkAttachments && this.checkAttachments.length > 0) {
                this.checkAttachments.map(item => {
                  if (item.fileType == "mp3") {
                    this.autoDataURl = item.fileFullPath;
                    this.autoLength = parseInt(item.voiceTimeSpan / 1000);
                  } else if (item.fileType == "mp4") {
                    let videoList = "";
                    videoList = item.fileFullPath;
                    this.videoList.push(videoList);

                    this.videoDataURl = item.fileFullPath;
                  } else if (
                    item.fileType == "jpg" ||
                    item.fileType == "jpeg" ||
                    item.fileType == "png" ||
                    item.fileType == "gif" ||
                    item.fileType == "bmp"
                  ) {
                    let imgUnit = "";
                    imgUnit = item.fileFullPath;
                    this.imgList.push(imgUnit);
                  }
                });
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    playVideo(index) {
      this.dialogVisible = true;
      this.videoDataURl = this.videoList[index];
    },
    previewEnclos(index) {
      this.currentEnclosIndex = index;
      this.enclosVisible = true;
    },
    // 返回
    goBack() {
      console.log(this.$route.query.channelType);
      this.$router.push({
        name: "manualUp",
        query: { channelType: this.$route.query.channelType }
      });
    },

    /* 数据转化 */
    // 审批状态转化
    turnStatus(val) {
      switch (val) {
        case 0:
          return "待核实";
        case 1:
          return "待审批";
        case 2:
          return "已审批";
        case 99:
          return "已结束";
        default:
          return "-";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.remark1 {
  width: 43px;
  padding: 0 3.5px;
  height: 16px;
  line-height: 16px;
  background: rgba(255, 96, 0, 1);
  border-radius: 4px;
  font-size: 10px;
  font-family: Microsoft YaHei;
  font-weight: normal;
  color: rgba(255, 255, 255, 1);
  margin-left: 10px;
  // padding: 5px;
}
.video {
  position: fixed;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  .close {
    position: fixed;
    z-index: 11;
    right: 20px;
    top: 20px;
    color: #ffffff;
    border: solid 1px #ffffff;
    border-radius: 50%;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 28px;
    font-size: 24px;
    cursor: pointer;
  }
  .play-video {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
.manual-details {
  .mgr-15 {
    margin-right: 15px;
  }

  .content-wrap {
    .reporter_wrap {
      .phone {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-style: normal;
        color: #999999;
      }
    }
    .layout_column {
      .el-scrollbar {
        .info_list {
          .h-common {
            margin-bottom: 20px;
            .el-icon-circle-close {
              color: white;
            }
            .img-content {
              width: 100%;
              overflow: hidden;
              .img-unit {
                width: 100px;
                height: 100px;
                margin-right: 2%;
                margin-top: 10px;
                float: left;
                .img-fill {
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                  // border-radius: 8px;
                }
                video {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
        .el-scrollbar__wrap {
          .el-scrollbar__view {
            padding-right: 30%;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.enclosDialog {
  .el-dialog {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    background-color: transparent;
    .el-dialog__headerbtn {
      color: #fff;
      border-radius: 100px;
      width: 40px;
      height: 40px;
      text-align: center;
      border: 2px solid #fff;
      font-size: 0;
      .el-dialog__close {
        vertical-align: top;
        color: #fff !important;
        font-size: 32px;
        line-height: 36px;
      }
    }
    .el-dialog__body {
      height: calc(100% - 30px);
    }
  }
}
</style>