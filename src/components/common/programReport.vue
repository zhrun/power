<template>
  <div class="programreport">
    <el-scrollbar style="height: 100%;">
      <div class="top">
        <p class="reporter_wrap title_wrap">
          <span class="tit flx1">
            基本情况
            <span class="remark1" v-if="handleStatus==0">待核实</span>
            <span class="remark1" v-if="handleStatus==1">待审批</span>
            <span class="remark1" v-if="handleStatus==2">待处理</span>
            <span class="remark1" v-if="handleStatus==99">已结束</span>
          </span>
          <!-- <span class="tit flx1">
            上报的信息
            <i class="remark">({{reportInfo.eventCode}})</i>
          </span>-->
        </p>
        <p class="reporter_wrap">
          <span class="phone">{{reportInfo.reporterName}}{{reportInfo.reportTime}}上报</span>
          <span class="phone" style="margin-left: 50px;">联系电话：{{reportInfo.reporterPhone}}</span>
        </p>
        <p class="reporter_wrap">
          <span
            class="phone"
            v-if="this.userEmergencyContactInfo.contactName!=undefined"
          >紧急联系人：{{userEmergencyContactInfo.contactName}}({{userEmergencyContactInfo.contantPhone}})</span>
        </p>
      </div>
      <div class="bottom">
        <ul class="info_list">
          <li>
            <span class="label">事件编号：</span>
            <span class="value">{{reportInfo.eventCode}}</span>
          </li>
          <li>
            <span class="label">事件名称：</span>
            <span class="value">{{reportInfo.eventName}}</span>
          </li>
          <li>
            <span class="label">发生地点：</span>
            <span class="value">{{reportInfo.eventAddress}}</span>
          </li>
          <li
            class="h-common h-play"
            v-show="autoLength>0 || (reportInfo.eventDesc && reportInfo.eventDesc.length>0)"
          >
            <span class="label">事件描述：</span>
            <div v-if="autoDataURl && autoDataURl.length>0 && autoLength>0">
              <audio controls style="height:30px; width:260px">
                <source :src="autoDataURl" type="audio/mpeg">
                您的浏览器不支持 audio 元素。
              </audio>
            </div>
            <div
              v-show="reportInfo.eventDesc && reportInfo.eventDesc.length>0" class="play-dec"
            >{{reportInfo.eventDesc}}</div>
          </li>
          <li class="h-common">
            <div class="img-content clearfix">
              <div class="img-unit" v-for="(item, index) in imgList" :key="index+6">
                <img
                  class="img-fill"
                  :src="item.fileType=='mp4'?videoPre:item.fileFullPath"
                  @click="playVideo(index)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-scrollbar>
    <el-dialog :visible.sync="dialogVisible" class="enclosDialog">
      <div is="preview" :eData="imgList" v-model="currentEnclosIndex"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getCheckinfo } from "@/views/index/api/eas/api.eas.js";
import preview from "_com/preview.vue";
export default {
  name: "programReport",
  components: { preview },
  data() {
    return {
      auPlay: require("../../assets/img/au-play.png"),
      videoPre: require("../../assets/img/videoPre.png"),
      videoDataURl: "",
      autoDataURl: "",
      autoLength: 0,
      imgList: [],
      // 查看附件弹窗显隐开关
      enclosVisible: false,
      // 当前查看的附件的路径
      enclosUrl: "",
      reportInfo: {},
      handleStatus: {},
      reportAttachments: {},
      userEmergencyContactInfo: {},
      dialogVisible: false,
      dialogVisibleAuto: false,
      currentEnclosIndex: -1
    };
  },
  props: ["uid"],
  mounted() {
    console.log("111", this.uid);
    this.getCheckinfo(this.uid);
  },
  methods: {
    playVideo(index) {
      this.currentEnclosIndex = index;
      this.dialogVisible = true;
    },
    playAuto() {
      this.dialogVisibleAuto = true;
    },
    getCheckinfo(uid) {
      console.log(uid);
      let d = {
        uid: uid
      };
      getCheckinfo(d).then(res => {
        if (res && res.data) {
          console.log("res", res);
          if (res.data.reportInfo && res.data.reportInfo.reporterPhone) {
            console.log(res.data.reportInfo.reporterPhone);
            // res.data.reportInfo.reporterPhone =
            //   res.data.reportInfo.reporterPhone.substring(0, 3) +
            //   "-" +
            //   res.data.reportInfo.reporterPhone.substring(3, 7) +
            //   "-" +
            //   res.data.reportInfo.reporterPhone.substring(7);

            this.reportInfo = res.data.reportInfo;
          }
          if (
            res.data.userEmergencyContactInfo &&
            res.data.userEmergencyContactInfo.contantPhone
          ) {
            res.data.userEmergencyContactInfo.contantPhone =
              res.data.userEmergencyContactInfo.contantPhone.substring(0, 3) +
              "-" +
              res.data.userEmergencyContactInfo.contantPhone.substring(3, 7) +
              "-" +
              res.data.userEmergencyContactInfo.contantPhone.substring(7);
            this.userEmergencyContactInfo = res.data.userEmergencyContactInfo;
          }

          if (res.data.reportAttachments) {
            this.reportAttachments = res.data.reportAttachments;
            if (this.reportAttachments && this.reportAttachments.length > 0) {
              this.reportAttachments.map(item => {
                if (item.fileType == "mp3") {
                  this.autoDataURl = item.fileFullPath;
                  this.autoLength = parseInt(item.voiceTimeSpan / 1000);
                } else if (
                  item.fileType == "mp4" ||
                  item.fileType == "jpg" ||
                  item.fileType == "jpeg" ||
                  item.fileType == "png" ||
                  item.fileType == "gif" ||
                  item.fileType == "bmp"
                ) {
                  let urlUnit = {};
                  urlUnit.fileType = item.fileType;
                  urlUnit.fileFullPath = item.fileFullPath;
                  this.imgList.push(urlUnit);
                }
              });
            }
          }
          if (res.data.receiveInfo) {
            this.handleStatus = res.data.receiveInfo.handleStatus;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.programreport {
  .top {
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
    }
    .reporter_wrap {
      .phone {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-style: normal;
        color: #999999;
      }
    }
  }
  .bottom {
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
          }
        }
      }
      .h-play {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .play-dec{
      width: calc(100% - 72px);
    }
        .play-btn {
          width: 150px;
          height: 30px;
          background-color: #5188ff;
          border-radius: 4px;
          border: 1px solid rgba(87, 139, 255, 1);
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          .img {
            width: 20px;
            height: 15px;
            margin-left: 10px;
            margin-top: 10px;
          }
          span {
            font-size: 14px;
            color: #ffffff;
            margin-left: 10px;
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