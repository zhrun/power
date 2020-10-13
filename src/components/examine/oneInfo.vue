<template>
  <div class="one-info">
      <div class="h-top">
        <p class="h-title">基本情况</p>
        <span v-show="receiveInfo.handleStatus=='1'" class="play-op">待审批</span>
        <span v-show="receiveInfo.handleStatus=='2'" class="play-op">待处理</span>
        <span v-show="receiveInfo.handleStatus=='99'" class="play-op">已结束</span>
      </div>
      <div class="sp-tween">
        <span>{{reportInfo.reporterName}}于{{reportInfo.reportTime}}上报</span>
        <span>联系电话：{{reportInfo.reporterPhone}}</span>
      </div>
      <div class="sp-tween" v-show="userEmergencyContactInfo && userEmergencyContactInfo.contactName && userEmergencyContactInfo.contantPhone">
        <span>紧急联系人：{{userEmergencyContactInfo.contactName}}（{{userEmergencyContactInfo.contantPhone}}）</span>
      </div>
      <p class="mid-line"></p>
      <div class="h-common">
        <span class="c666">事件编号：</span>
        <span>{{reportInfo.eventCode || "-"}}</span>
      </div>
      <div class="h-common">
        <span class="c666">事件名称：</span>
        <span>{{reportInfo.eventName || "-"}}</span>
      </div>
      <div class="h-common">
        <span class="c666">发生地点：</span>
        <span>{{reportInfo.eventAddress || "-"}}</span>
      </div>
      <div class="h-common h-play" v-show="autoLength>0 || (reportInfo.eventDesc && reportInfo.eventDesc.length>0)">
        <span class="c666">事件描述：</span>
        <div v-show="autoDataURl && autoDataURl.length>0 && autoLength>0">
          <audio controls style="height:30px; width:260px">
            <source :src="autoDataURl" type="audio/mpeg">
            您的浏览器不支持 audio 元素。
          </audio>
        </div>
        <div v-show="reportInfo.eventDesc && reportInfo.eventDesc.length>0" class="play-dec">
          {{reportInfo.eventDesc}}
        </div>
      </div>
      <div class="h-common" v-if="checkAttachments && checkAttachments.length>0">
        <div class="img-content clearfix">
          <div class="img-unit" v-for="(item, index) in checkAttachments" :key="index+6">
            <img class="img-fill" :src="item.fileType=='mp4'?videoPre:item.fileFullPath" @click="playVideo(index)">
          </div>
        </div>      
      </div>
      <p class="from-source">
        <span v-show="receiveInfo.receiveType==1">小程序接报</span>
        <span v-show="receiveInfo.receiveType==2">app接报</span>
        <span v-show="receiveInfo.receiveType==3">电话接报</span>
        <span v-show="receiveInfo.receiveType==4">上级督办</span>
        <span v-show="receiveInfo.receiveType==5">其他渠道</span>
      </p>
    <el-dialog :visible.sync="dialogVisible" class="enclosDialog">
      <div is="preview" :eData="checkAttachments" v-model="currentEnclosIndex"></div>
    </el-dialog>
  </div>
</template>
<script>
import preview from "_com/preview.vue"
export default {
  components: { preview },
  props:["reportInfo", "reportAttachments", "receiveInfo", "userEmergencyContactInfo"],
  data(){
    return{
      auPlay: require("../../assets/img/au-play.png"),
      videoPre: require("../../assets/img/videoPre.png"),
      videoDataURl: "",
      autoDataURl: "",
      autoLength:0,
      imgList:[],
      dialogVisible:false,
      dialogVisibleAuto:false,
      checkAttachments:[],
      currentEnclosIndex:-1
    }
  },
  mounted(){
    if(this.reportInfo.reporterPhone){
      this.reportInfo.reporterPhone=this.reportInfo.reporterPhone.substring(0,3) + "-" + this.reportInfo.reporterPhone.substring(3,7) + "-" + this.reportInfo.reporterPhone.substring(7)
    }
    if(this.userEmergencyContactInfo && this.userEmergencyContactInfo.contantPhone){
      this.userEmergencyContactInfo.contantPhone=this.userEmergencyContactInfo.contantPhone.substring(0,3) + "-" + this.userEmergencyContactInfo.contantPhone.substring(3,7) + "-" + this.userEmergencyContactInfo.contantPhone.substring(7)
    }
    if(this.reportAttachments && this.reportAttachments.length>0){
      this.reportAttachments.map((item)=>{
        if (item.fileType=="mp3"){
          this.autoDataURl=item.fileFullPath
          this.autoLength=parseInt(item.voiceTimeSpan/1000)
        }else if(item.fileType=="mp4" || item.fileType=="jpg" || item.fileType=="jpeg" || item.fileType=="png" || item.fileType=="gif" || item.fileType=="bmp"){
          let urlUnit={}
          urlUnit.fileType=item.fileType
          urlUnit.fileFullPath=item.fileFullPath
          this.checkAttachments.push(urlUnit)
        }
      })
    }
  },
  methods:{
    playVideo(index){
      this.currentEnclosIndex = index;
      this.dialogVisible = true;
    },
    playAuto(){
      this.dialogVisibleAuto=true
    }
  }
}
</script>
<style lang="scss" scoped>
.one-info{
  width: 100%;
  min-height: 100%;
  padding: 20px;
  position: relative;
  padding-bottom: 60px;
  .h-top{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
    .h-title{
      font-size:16px;
      color: #3776FF;
      font-family:Microsoft YaHei;
      font-weight:bold;
    }   
    .play-op{
      width: 43px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #FF6000;
      border-radius: 4px;
      margin-left: 10px;
      font-size: 10px !important;
      color: #ffffff;
    }
  }
  .h-common{
    margin-bottom: 20px;    
    font-size: 14px;
    color: #333333;     
    .clearfix::after {
      display: block;
      clear: both;
      content: "";
    }
    .img-content{
      width: 100%;
      .img-unit{
        width: 31%;
        height: 150px;
        margin-right: 2%;
        border-radius: 6px;
        overflow: hidden;
        margin-top: 10px;
        float: left;
        .img-fill{
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .img-unit:nth-child(3n){
        margin-right: 0;
      }
    }
    .c666{
      color: #666666;
    }
  }
  .sp-tween{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    span{
      color: #666666;
      font-size: 12px;
    }
  }
  .mid-line{
    width: 100%;
    height: 1px;
    background-color: #F1F1F1;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .h-play{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .play-dec{
      width: calc(100% - 72px);
    }
    .play-btn{
      width: 150px;
      height: 30px;
      background-color: #5188FF;
      border-radius:4px;
      border:1px solid rgba(87,139,255,1);
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      img{
        width: 20px;
        height: 15px;
        margin-left: 10px;
      }
      span{
        font-size: 14px;
        color: #ffffff;
        margin-left: 10px;
      }
    }
  }
  .from-source{
    width: 92%;
    margin-left: 4%;
    height: 1px;
    background-color: #999999;
    position: absolute;
    bottom: 30px;
    left: 0;
    span{
      display: inline-block;
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #ffffff;
      font-size: 12px;
      color: #999999;
      position: absolute;
      margin-left: 50%;
      top: -15px;
      left: -40px;
      z-index: 10;
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