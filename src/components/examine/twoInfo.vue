<template>
  <div class="wrap">
    <div class="common-title">
      <span>基本情况</span>
      <span v-show="receiveInfo.handleStatus=='1'" class="play-op">待审批</span>
      <span v-show="receiveInfo.handleStatus=='2'" class="play-op">待处理</span>
      <span v-show="receiveInfo.handleStatus=='99'" class="play-op">已结束</span>
    </div>
    <div class="common-time">
      <span>{{checkInfo.submitToName}}于{{checkInfo.createTime}}录入</span> 
      <span v-show="checkInfo.submitToPhone && checkInfo.submitToPhone.length>0">联系电话：{{checkInfo.submitToPhone}}</span>
    </div>
    <div class="common-css" v-show="receiveInfo.affectedNumber!=null || receiveInfo.injuredNumber!=null || receiveInfo.deadNumber!=null">
      <span class="common-affect">受影响情况：</span>
      <span v-show="receiveInfo.affectedNumber!=null" class="common-affect" style="margin-right: 15px;">{{receiveInfo.affectedNumber}}人受影响</span>
      <span v-show="receiveInfo.injuredNumber!=null" class="common-affect" style="margin-right: 15px;">{{receiveInfo.injuredNumber}}人受伤</span>
      <span v-show="receiveInfo.deadNumber!=null" class="common-affect">{{receiveInfo.deadNumber}}人死亡</span>
    </div>
    <p class="ge-line"></p>
    <div class="common-css">
      <span>编号：</span>
      <span>{{receiveInfo.eventCode ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>事件名称：</span>
      <span>{{receiveInfo.eventName ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>发生时间：</span>
      <span>{{receiveInfo.eventTime ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>发生地点：</span>
      <span>{{receiveInfo.eventAddress ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>主要内容：</span>
      <span>{{receiveInfo.eventContent ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>事发原因：</span>
      <span>{{receiveInfo.eventReason ||"-"}}</span>
    </div>
    <div class="common-css">
      <span>处理措施：</span>
      <span>{{receiveInfo.handlingMethod ||"-"}}</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==3">
      <span>来电人员：</span>
      <span>{{receiveInfo.reporterName}}（{{receiveInfo.contactPhone}}）</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==3">
      <span>来电时间：</span>
      <span>{{receiveInfo.callTime ||"-"}}</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==4">
      <span>督办单位：</span>
      <span>{{receiveInfo.supervisionUnit ||"-"}}</span>
      <span v-show="receiveInfo.contactPhone">（{{receiveInfo.contactPhone}}）</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==4">
      <span>督办下发时间：</span>
      <span>{{receiveInfo.supervisionTime ||"-"}}</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==4">
      <span>督办要求：</span>
      <span>{{receiveInfo.supervisionRemark ||"-"}}</span>
    </div>
    <div class="common-css" v-show="receiveInfo.receiveType==5">
      <span>消息渠道：</span>
      <span>{{receiveInfo.eventChannel ||"-"}}</span>
      <span>({{receiveInfo.contactPhone ||"-"}})</span>
    </div>
    <p class="from-source">
      <span v-show="receiveInfo.receiveType==1">小程序接报</span>
      <span v-show="receiveInfo.receiveType==2">app接报</span>
      <span v-show="receiveInfo.receiveType==3">电话接报</span>
      <span v-show="receiveInfo.receiveType==4">上级督办</span>
      <span v-show="receiveInfo.receiveType==5">其他渠道</span>
    </p>
  </div>
</template>
<script>
export default {
  props:["receiveInfo","checkInfo"],
  data(){
    return{
    }
  },
  mounted(){
    this.checkInfo.submitToPhone=this.checkInfo.submitToPhone.substring(0,3) + "-" + this.checkInfo.submitToPhone.substring(3,7) + "-" + this.checkInfo.submitToPhone.substring(7)
    this.receiveInfo.contactPhone=this.receiveInfo.contactPhone.substring(0,3) + "-" + this.receiveInfo.contactPhone.substring(3,7) + "-" + this.receiveInfo.contactPhone.substring(7)
  },
}
</script>
<style lang="scss" scoped>
.wrap{
  width: 100%;
  min-height: 100%;
  padding: 20px;
  position: relative;
  padding-bottom: 60px;
  .common-affect{
    font-size:16px !important;
    color: #FF0000 !important;
    font-weight: bold;
  } 
  .common-title{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
    span:nth-child(1){
      font-size:16px;
      color: #3776FF;
      font-weight: bold;
    }
    .play-op{
      width: 43px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #FF6000;
      border-radius: 4px;
      margin-left: 10px;
      font-size: 10px;
      color: #ffffff;
    }
  } 
  .common-time{
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span{
      font-size:12px;
      color: #666666;
    }
  }
  .ge-line{
    width: 100%;
    height: 1px;
    background-color: #F1F1F1;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .common-css{
    margin-bottom: 20px;
    span:nth-child(1){
      font-size:14px;
      color: #666666;
    }
    span:nth-child(2){
      font-size:14px;
      color: #333333;
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