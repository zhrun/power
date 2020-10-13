
<template>
  <div>
    <div class="alarm-box" v-show="reportTip">
      <div class="top">
        <span>消息提示</span>
        <i class="el-icon-close" @click="cancleOp"></i>
      </div>
      <p class="acontent">
        <span>您收到一条新的<span v-show="msgType==8">上报</span><span v-show="msgType==9">待审批</span>消息：</span><br />
        <span>
          <span>【{{eventReceiveName}}】</span>
          <span v-show="affectedNumber!=null || injuredNumber!=null || deadNumber!=null">，其中</span>
          <span v-show="affectedNumber!=null" style="margin-right: 15px;">{{affectedNumber}}人受影响</span>
          <span v-show="injuredNumber!=null" style="margin-right: 15px;">{{injuredNumber}}人受伤</span>
          <span v-show="deadNumber!=null">{{deadNumber}}人死亡</span>
        </span>
      </p>
      <div class="op-btn">
        <span @click="cancleOp">取消</span>
        <span @click="confirmOp">去查看</span>
      </div>
    </div>
    <div class="duty-tip" v-if="dutyTip" @mouseenter="timeStop()" @mouseleave="timeOn()">
      <div class="duty-top">
        <p>您有<span>{{newList.length}}</span>条推送消息</p>
        <i class="el-icon-close" @click="colseDuty"></i>
      </div>
      <div class="duty-content">
        <span class="title" v-if="newList[currentNewIndex] && newList[currentNewIndex].newType">{{newList[currentNewIndex].newType}}</span>
        <span class="dcontent" v-if="newList[currentNewIndex] && newList[currentNewIndex].title">{{newList[currentNewIndex].title}}</span>
        <span class="look" @click="toJumpObject">查看</span>
        <span class="time">{{newTime}}秒后自动关闭</span>
      </div>
      <div class="duty-bottom">
        <span class="common-btn" style="margin-left:30px; color:#999999;" v-show="currentNewIndex==0">上一条</span>
        <span class="common-btn" style="margin-left:30px" v-show="currentNewIndex>0" @click="preNews">上一条</span>
        <span class="common-btn" style="margin-right:30px; color:#999999;" v-show="currentNewIndex==newList.length-1">下一条</span>
        <span class="common-btn" style="margin-right:30px" v-show="currentNewIndex<newList.length-1"  @click="nextNews">下一条</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { wsApprovalConfig } from "@/config/config.js";
// import _get from "lodash/get"

export default {
  props: ['newList'],
  data() {
    return {
      vis_userId:"",
      wsObj: {
        stompHeaders: null,
        stompClient: null,
        approvalMsg: null,
        wsTimeout: null
      },
      reportTip:false,
      dutyTip:false,
      eventReceiveName:"",
      affectedNumber:null,
      injuredNumber:null,
      deadNumber:null,
      approveUid:"",
      checkUid:"",
      msgType:0,
      //值班值守
      currentNewIndex:0,
      newTime:15,
      newTimer:null,
      msgsType:null,
      supplyType:null
    }
  },
  computed: {
    ...mapState(["unverifyNum", "programNum"])
  },
  watch:{
    newList:{
      handler(newVal){
        let that = this
        if(newVal && newVal.length>0 && this.msgsType!=8){
          clearInterval(that.newTimer) || null
          that.newTime=15
          that.dutyTip=true
          that.commonTimer()
        }else{
          this.dutyTip=false
        }
      },
      deep:true
    }
  },
  mounted() {
    let that = this
    if(that.newList && that.newList.length>0){
      that.dutyTip=true
      that.commonTimer()
    }
    setTimeout(()=>{
      that.wsInit()
    }, 1000)
  },
  beforeDestroy(){
    clearInterval(this.newTimer)
  },
  methods: {
    //鼠标移入
    timeStop(){
      clearInterval(this.newTimer);
    },
    //鼠标移出
    timeOn(){
      if (this.newTime>0) {
        this.commonTimer();
      }
    },
    commonTimer(){
      let that = this
      if(that.newTime>0){
        that.newTimer=setInterval(() => {
          that.newTime--
          if(that.newTime==0){
            that.dutyTip=false
            clearInterval(that.newTimer)
          }
        }, 1000)
      }
    },
    wsInit() {
      let _this = this;
      let stompHeaders = {};
      let stompClient = window.Stomp.client(
        wsApprovalConfig.wsUrl + "?token=" + JSON.parse(localStorage.getItem('vis_user_info')).uid
      );
      stompClient.connect(
        stompHeaders,
        function() {
          _this.wsObj.stompClient = stompClient;
          //突发接报即时信息
          // let approvalMsg = stompClient.subscribe(
          //   wsApprovalConfig.apis.approvalMsg,
          //   _this.wsApprovalCallback
          // );
          // _this.wsObj.approvalMsg = approvalMsg;
          //值班值守即时信息
          // let datyUrl=wsApprovalConfig.apis.dutyMsg + _get(JSON.parse(localStorage.getItem("vis_user_info")), "rmsUnitDto.uid", "")
          // let dutyMsg = stompClient.subscribe(
          //   datyUrl,
          //   _this.wsdutyCallback
          // );
          // _this.wsObj.dutyMsg = dutyMsg;
          // 救援资源即时信息
          // let supplyUrl=wsApprovalConfig.apis.dutyMsg + _get(JSON.parse(localStorage.getItem("vis_user_info")), "uid", "")
          // let supplyMsg = stompClient.subscribe(
          //   supplyUrl,
          //   _this.wssupplyCallback
          // );
          // _this.wsObj.supplyMsg = supplyMsg;
        },
        function(error) {
          console.log("websocket报错信息：", error)
          // 取消订阅
          if (_this.wsObj.approvalMsg) {
            _this.wsObj.approvalMsg.unsubscribe();
            _this.wsObj.approvalMsg = null;
          }
          // 重连ws
          _this.wsObj.wsTimeout = window.setTimeout(() => {
            console.log("重新连接websocket");
            _this.wsReInit();
          }, 3000);
        }
      );
    },
    wsReInit() {
      // 关闭ws定时器
      if (this.wsObj.wsTimeout) {
        window.clearTimeout(this.wsObj.wsTimeout);
      }
      this.wsInit();
    },
    //突发接报
    wsApprovalCallback(msg){
      let msgInfo=JSON.parse(msg.body)
      if(msgInfo.msgType=="9"){
        this.msgType=9
        this.$store.dispatch('updateUnverifyNumAsync', this.unverifyNum+1)
        this.eventReceiveName=msgInfo.message.eventReceiveName
        this.affectedNumber=msgInfo.message.affectedNumber
        this.injuredNumber=msgInfo.message.injuredNumber
        this.deadNumber=msgInfo.message.deadNumber
        this.approveUid=msgInfo.message.approveUid
        this.reportTip=true
      }
      if(msgInfo.msgType=="8"){
        this.msgType=8
        this.$store.dispatch('updateProgramNumAsync', this.programNum+1)
        this.eventReceiveName=msgInfo.message.eventName
        this.checkUid=msgInfo.message.eventReportUid
        this.reportTip=true
      }
    },
    //值班值守
    wsdutyCallback(msg){
      let msgInfo=JSON.parse(msg.body)
      this.msgsType=msgInfo.msgType
      this.$emit("newNotice")
    },
    wssupplyCallback(msg){
      let supplyInfo=JSON.parse(msg.body)
      this.supplyType=supplyInfo.supplyInfo
      // this.$emit("newNotice")
    },
    // getUnreadApproveCount() {
    //   let that = this;
    //   getUnreadApproveCount().then(res => {
    //     if (res && parseInt(res.data)>=0) {
    //       this.$store.dispatch('updateUnverifyNumAsync', res.data)
    //     }
    //   });
    // },
    // getUnreadCheckCount() {
    //   let that = this;
    //   getUnreadCheckCount().then(res => {
    //     if (res && parseInt(res.data)>=0) {
    //       this.$store.dispatch('updateProgramNumAsync', res.data)
    //     }
    //   });
    // },
    cancleOp(){
      this.reportTip=false
    },
    colseDuty(){
      this.dutyTip=false
    },
    confirmOp(){
      if(this.approveUid){
        if(window.location.href.indexOf("prOpration")>-1){
          this.$router.push({ name: "prOpration", query: {uid: this.approveUid}})
          this.$store.dispatch('updateUnverifyNumAsync', this.unverifyNum-1)
          this.reportTip=false
          window.location.reload()
        }else{
          this.$router.push({ name: "prOpration", query: {uid: this.approveUid}})
          this.$store.dispatch('updateUnverifyNumAsync', this.unverifyNum-1)
          this.reportTip=false
        }        
      }else if(this.checkUid){
        if(window.location.href.indexOf("programVerify")>-1){
          this.$router.push({ name: "programVerify", query: {uid: this.checkUid}})
          this.$store.dispatch('updateProgramNumAsync', this.programNum-1)
          this.reportTip=false
          window.location.reload()
        }else{
          this.$router.push({ name: "programVerify", query: {uid: this.checkUid}})
          this.$store.dispatch('updateProgramNumAsync', this.programNum-1)
          this.reportTip=false
        }
      }
    },
    preNews(){
      this.currentNewIndex=this.currentNewIndex-1
    },
    nextNews(){
      this.currentNewIndex=this.currentNewIndex+1
    },
    toJumpObject(){
      if(this.newList[this.currentNewIndex].newType=="值班信息" && window.location.href.indexOf("receiveDutyInformation")==-1){
        this.$router.push({ name: "receiveDutyInformation"})
      } else if(this.newList[this.currentNewIndex].newType=="通知公告" && window.location.href.indexOf("receiveNotice")==-1){
        this.$router.push({ name: "receiveNotice"})
      } else if(this.newList[this.currentNewIndex].newType=="要情快报批示" && window.location.href.indexOf("acceptLeaderInstructions")==-1){
        this.$router.push({ name: "acceptLeaderInstructions"})
      } else if(this.newList[this.currentNewIndex].newType=="值班信息批示" && window.location.href.indexOf("acceptLeaderInstructions")==-1){
        this.$router.push({ name: "acceptLeaderInstructions"})
      } else if(this.newList[this.currentNewIndex].newType=="抄送信息" && window.location.href.indexOf("acceptCCInfo")==-1){
        this.$router.push({ name: "acceptCCInfo"})
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.alarm-box{
  width: 320px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  // border: 1px solid #333333;
  box-shadow: 0 0 5px 1px #dddddd;
  background-color: #ffffff;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  .top{
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    span{
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    i{
      position: absolute;
      top: 18px;
      right: 15px;
      font-size: 20px;
      cursor: pointer;
    }
  }
  .acontent{
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
    margin-bottom: 70px;
    span{    
      line-height: 30px;  
      font-size: 16px;
      color: #333333;
    }
  }
  .op-btn{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    bottom: 0px;
    span:nth-child(1){
      width: 50%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #ffffff;
      border-top: 1px solid #dddddd;
      letter-spacing: 2px;
      font-size: 16px;
      color: #333333;
      cursor: pointer;
    }
    span:nth-child(2){
      width: 50%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #178CFD;
      letter-spacing: 2px;
      font-size: 16px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
.duty-tip{
  width: 360px;
  height: 240px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow:0px 11px 17px 1px rgba(174,174,174,0.38);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 1000;
  .duty-top{
    width: 100%;
    height: 52px;
    line-height: 54px;
    text-align: center;
    background: linear-gradient(215deg,rgba(93,108,255,1) 0%,rgba(84,104,255,1) 100%);
    position: relative;
    border-bottom: 3px solid #FFBB00;
    p{
      color: #ffffff;
      font-size: 14px;
      span{
        font-size: 14px;
        font-weight: bold;
        color: #FFBB00;
      }
    }
    i{
      font-size: 20px;
      color: #A4A6FE;
      position: absolute;
      right: 18px;
      top: 16px;
      z-index: 1001;
      cursor: pointer;
    }
  }
  .duty-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title{
      color: #5458FE;
      margin-top: 24px;
      margin-bottom: 10px;
    }
    .dcontent{
      width: 80%;
      text-align: center;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .look{
      display: inline-block;
      width:100px;
      height:30px;
      line-height: 30px;
      text-align: center;
      background:rgba(84,88,254,1);
      box-shadow:0px 10px 18px 0px rgba(84,88,254,0.16);
      border-radius:6px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #ffffff;
      cursor: pointer;
    }
    .time{
      color: #C3C9D8;
    }
  }
  .duty-bottom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .common-btn{
      color: #5458FE;
      margin-top: 15px;
      cursor: pointer;
    }
  }
}
</style>