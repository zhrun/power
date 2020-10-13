/* 查看小程序接报 */
<template>
  <div class="report-page program-details">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 主体 -->
    <div class="content-wrap" style="margin-top:10px;margin-left:10px;">
      <!-- 上报信息 -->
      <div v-if="uid" class="layout_column report_column" is="programReoprt" :uid="uid"></div>
      <!-- 核实模块 -->
      <div class="layout_column two_right">
        <el-scrollbar style="height: 100%;">
          <p class="title_wrap">
            <span class="tit">核实记录</span>
            <span class="overtime" v-if="form.isOvertime==1">超时</span>
          </p>
          <p class="tot reporter_wrap title_wrap">
            <span class="flx1">
              {{form.checkerName}}于
              <span class="remark">{{form.checkTime}} 提交</span>
            </span>
            <span class="flx1">联系电话：{{form.checkerPhone}}</span>
          </p>
          <p class="influence" v-if="form.affct==0 || form.injured==0 || form.dead==0 || form.affct || form.injured || form.dead">
            受影响情况：
            <span class="mgr-15" v-if="form.affct==0 || form.affct">{{(form.affct==0 || form.affct) ? form.affct : '-'}}人受影响</span>
            <span class="mgr-15" v-if="form.injured==0 || form.injured">{{(form.injured==0 || form.injured) ? form.injured : '-'}}人受伤</span>
            <span class="mgr-15" v-if="form.dead==0 || form.dead">{{(form.dead==0 || form.dead) ? form.dead : '-'}}人死亡</span>
          </p>
          <ul class="info_list">
            <li>
              <span class="label">核实方式：</span>
              <span class="value">{{form.checkType || '-'}}</span>
            </li>
            <li v-if="form.checkType=='电话核实'">
              <span class="label">核实对象：</span>
              <span
                class="value"
              >{{form.checkToType=='其他'? (form.checkToRemark || '-') : (form.checkToType || '-')}}</span>
            </li>
            <li v-if="form.checkType=='网格员核实'">
              <span class="label">网格员姓名：</span>
              <span class="value">{{form.gridName}}</span>
            </li>
            <li v-if="form.checkType=='网格员核实'">
              <span class="label">网格员联系方式：</span>
              <span class="value">{{form.gridPhone}}</span>
            </li>
            <li v-if="form.checkType=='其他渠道核实'">
              <span class="label">核实渠道：</span>
              <span class="value">{{form.channel}}</span>
            </li>
            <li>
              <span class="label">发生时间：</span>
              <span class="value">{{form.time || '-'}}</span>
            </li>
            <li>
              <span class="label">主要内容：</span>
              <span class="value">{{form.eventContent || '-'}}</span>
            </li>
            <li>
              <span class="label">事发原因：</span>
              <span class="value">{{form.eventReason || '-'}}</span>
            </li>
            <li>
              <span class="label">处理措施：</span>
              <span class="value">{{form.handlingMethod || '-'}}</span>
            </li>
          </ul>
          <p class="hr_line"></p>
          <p class="result_wrap"></p>
          <ul class="info_list" v-if="form.checkResultFlag==1">
            <li >
              <span class="label">核实结论：</span><span class="fhbs">符合报送</span>  
              </li>
            <!-- <li class="h-common">
              <div class="img-content clearfix">
                <span class="label" style="float:left">核实附件：</span>
                <span
                  class="img-unit"
                  v-for="(item, index) in imgList"
                  :key="index+6"
                >
                  <el-image class="img-fill" :src="item" :preview-src-list="imgList"></el-image>
                </span>
                <span class="img-unit" v-show="videoDataURl && videoDataURl.length>0">
                  <img
                    src="_assets/img/videoPre.png"
                    class="img-fill"
                    @click="playVideo"
                  />
                </span>
              </div>
            </li> -->
            <li><span class="label">核实附件：</span>
              <span v-if="checkAttachments.length==0||!checkAttachments">-</span>
            </li>
            <li>
              
              
              <span class="value">
                <img class="img" v-for="(item, index) in checkAttachments" :key="'checkAttachments_'+index" :src="item.fileType=='mp4'?'./static/img/videoPre.png':item.fileFullPath" @click="previewEnclos(index)">
              </span>
              
            </li>
            <li>
              <span class="label">附件来源：</span>
              <span class="value">{{form.fileSourceDesc || '-'}}</span>
            </li>
            <li>
              <span class="label">报送对象：</span>
              <span class="value">{{form.submitToName || '-'}}</span>
            </li>
            <li>
              <span class="label">报送备注：</span>
              <span class="value">{{form.submitRemark || '-'}}</span>
            </li>
          </ul>
          <ul class="info_list" v-if="form.checkResultFlag==0">
            <li>
              <span class="label">核实结论:</span>
              <span class="bfhbs">不符合报送</span>
              </li>
            <li>
              <span class="label">缘由说明：</span>
              <span class="value">{{form.checkRemark || '-'}}</span>
            </li>
          </ul>

          <el-button @click="goBack">返回</el-button>
        </el-scrollbar>
      </div>
    </div>
    <!-- <el-dialog title="查看附件" :visible.sync="enclosVisible" width="45%">
      <img :src="enclosUrl" style="display: block; width: 100%;" />
    </el-dialog> -->
    <el-dialog :visible.sync="enclosVisible" class="enclosDialog">
      <div is="preview" :eData="checkAttachments" v-model="currentEnclosIndex"></div>
    </el-dialog>
    <div class="video" v-if="dialogVisible">
      <span class="close" @click="dialogVisible=false">×</span>
      <video controls class="play-video"  style="height:100vh;">
        <source :src="videoDataURl" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import programReoprt from "_com/common/programReport.vue";
import { getCheckinfo } from "@/views/index/api/eas/api.eas.js";
import preview from "_com/preview.vue"

import "_assets/css/module_report.scss";
export default {
  name: "programDetails",
  components: { visBreadcrumb, programReoprt, preview },
  data() {
    return {
      uid: "",
      form: {
        isOvertime: "0", // 超时标记
        checkerName: "", // 接报员姓名
        checkerPhone: "", // 接报员联系方式
        checkTime: "", // 核实时间
        affct: "", // 受影响
        injured: "", // 受伤
        dead: "", // 死亡
        checkType: "", // 核实方式
        checkToType: "", // 电话核实对象
        checkToRemark: "", // 电话核实其他
        gridName: "", // 网格员核实姓名
        gridPhone: "", // 网格员核实电话
        channel: "", // 渠道核实渠道信息
        time: "", // 发生时间
        eventContent: "", // 主要内容
        eventReason: "", // 事发原因
        handlingMethod: "", // 处理措施
        enclos: [], // 核实附件
        fileSourceDesc: "", // 附件来源
        submitToName: "",
        submitToUid: "",
        submitRemark: "",
        checkRemark: "",
        checkResultFlag: ""
      },
      // 面包屑导航数据
      breadcrumbData: [
        { name: "突发接报" },
        { name: "小程序接报", routerName: "programUp" },
        { name: "查看详情" }
      ],
      videoDataURl: "",
      imgList: [],
      // 查看附件弹窗显隐开关
      enclosVisible: false,
      dialogVisible: false,
      // 当前查看的附件的路径
      enclosUrl: "",

      checkAttachments: [],
      currentEnclosIndex: 0,
    };
  },
  mounted() {
    // 获取uid和核实信息详情
    this.uid = this.$route.query.uid;
    let uid = this.$route.query.uid;
    this.getCheckinfo(uid);
  },
  methods: {
    getCheckinfo(uid) {
      console.log(uid);
      let d = {
        uid: uid
      };
      getCheckinfo(d).then(res => {
        if (res && res.data) {
          console.log("getCheckinfo", res);

          if (res.data.checkAttachments) {
            this.checkAttachments = res.data.checkAttachments;
            if (this.checkAttachments && this.checkAttachments.length > 0) {
              this.checkAttachments.map(item => {
                if (item.fileType == "mp3") {
                  this.autoDataURl = item.fileFullPath;
                  this.autoLength = parseInt(item.voiceTimeSpan / 1000);
                } else if (item.fileType == "mp4") {
                  this.videoDataURl = item.fileFullPath;
                } else if (
                  item.fileType == "jpg" ||
                  item.fileType == "jpeg" ||
                  item.fileType == "png" ||
                  item.fileType == "gif"||
                  item.fileType == "bmp"
                ) {
                  let imgUnit = "";
                  imgUnit = item.fileFullPath;
                  this.imgList.push(imgUnit);
                }
              });
            }
          }
          if (res.data.checkInfo) {
            this.form.isOvertime = res.data.checkInfo.isOvertime;
            this.form.checkerName = res.data.checkInfo.submitToName;
            this.form.checkerPhone = res.data.checkInfo.submitToPhone;
            this.form.checkTime = res.data.checkInfo.checkTime;
            if (res.data.checkInfo.checkType == 1) {
              this.form.checkType = "电话核实";
            } else if (res.data.checkInfo.checkType == 2) {
              this.form.checkType = "app视频核实";
            } else if (res.data.checkInfo.checkType == 3) {
              this.form.checkType = "网格员核实";
            } else if (res.data.checkInfo.checkType == 4) {
              this.form.checkType = "其他渠道核实";
            }
            if (res.data.checkInfo.checkToType == 1) {
              this.form.checkToType = "上报人";
            } else if (res.data.checkInfo.checkToType == 2) {
              this.form.checkToType = "上报人紧急联系人";
            } else if (res.data.checkInfo.checkToType == 3) {
              this.form.checkToType = "其他";
              this.form.checkToRemark = res.data.checkInfo.checkToRemark;
            }
            this.form.gridName = res.data.checkInfo.gridMamangerName;
            this.form.gridPhone = res.data.checkInfo.gridMamangerPhone;
            this.form.channel = res.data.checkInfo.checkChannel;
            this.form.fileSourceDesc = res.data.checkInfo.fileSourceDesc;
            this.form.checkRemark = res.data.checkInfo.checkRemark;
            this.form.checkResultFlag = res.data.checkInfo.checkResultFlag;
          }
          if (res.data.receiveInfo) {
            this.form.time = res.data.receiveInfo.eventTime;
            this.form.eventContent = res.data.receiveInfo.eventContent;
            this.form.eventReason = res.data.receiveInfo.eventReason;
            this.form.handlingMethod = res.data.receiveInfo.handlingMethod;
            this.form.affct = res.data.receiveInfo.affectedNumber;
            this.form.injured = res.data.receiveInfo.injuredNumber;
            this.form.dead = res.data.receiveInfo.deadNumber;
          }
          // if (res.data.reportInfo) {
          // }
          // if (res.data.userEmergencyContactInfo) {
          //   this.formemergencyName = res.data.userEmergencyContactInfo.contactName
          // }
          if (res.data.approveInfo) {
            this.form.submitToName = res.data.approveInfo.submitToName;
            this.form.submitToUid = res.data.approveInfo.submitToUid;
            this.form.submitRemark = res.data.approveInfo.submitRemark;
          }
        }
      });
    },
    playVideo() {
      this.dialogVisible = true;
    },
    // 预览
    previewEnclos(index) {
      this.currentEnclosIndex = index;
      this.enclosVisible = true;
    },
    // 返回
    goBack() {
      // this.$router.go(-1);
      this.$router.push({ name: "programUp" });

    }
  }
};
</script>

<style lang="scss" scoped>
.video{
  position: fixed;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  .close{
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
  .play-video{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
.program-details {
  .tot {
    font-size: 14px;
    font-family: Microsoft YaHei;
    margin-bottom: 10px;
    color: rgba(51, 51, 51, 1);
  }
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
    .fhbs {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(114, 192, 129, 1);
      margin-left: 5px;
    }
    .bfhbs {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(255, 0, 0, 1);
      margin-left: 5px;

    }
    .img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>

<style lang="scss" scoped>
.program-details {
  .content-wrap{
    .flx1{
      font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-style: normal;
        color: #999999;
    }
    
    .mgr-15 {
    margin-right: 15px;
  }
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
  }
  
}
</style>