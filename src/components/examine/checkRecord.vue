<template>
  <div class="wrap">
    <div class="common-title">审批记录</div>
    <div class="common-time" v-show="approveInfo && approveInfo.approveTime && approveInfo.approveTime.length>0">
      <span>
        <span v-show="approveInfo.submitToName && roleId=='32hxupGKa9Wci4Q0wnZ4jl'">{{approveInfo.submitToName}}于</span>
        <span v-show="approveInfo.approveTime">{{approveInfo.approveTime}}提交</span>
      </span>
      <span v-if="approveInfo.submitToPhone && roleId=='32hxupGKa9Wci4Q0wnZ4jl'">联系电话：{{approveInfo.submitToPhone}}</span>
    </div>
    <div class="common-css">
      <span>审批结论：</span>
      <span v-show="approveInfo.approveResultFlag==1">通过</span>
      <span v-show="approveInfo.approveResultFlag==0">不通过</span>
    </div>
    <div class="common-css" v-show="approveInfo.approveResultFlag==1">
      <span>事件类型：</span>
      <span v-show="receiveInfo.eventType==1">自然灾害</span>
      <span v-show="receiveInfo.eventType==2">事故灾难</span>
      <span v-show="receiveInfo.eventType==3">社会安全</span>
      <span v-show="receiveInfo.eventType==4">公共卫生</span>
      <span v-show="receiveInfo.eventType==9">其他</span>
    </div>
    <div class="common-css" v-show="approveInfo.approveResultFlag==1">
      <span>事件等级：</span>
      <span v-show="receiveInfo.eventLevel==0">非应急事件</span>
      <span v-show="receiveInfo.eventLevel==1">Ⅰ级（特别重大）</span>
      <span v-show="receiveInfo.eventLevel==2">Ⅱ级(重大)</span>
      <span v-show="receiveInfo.eventLevel==3">Ⅲ级(较大)</span>
      <span v-show="receiveInfo.eventLevel==4">Ⅳ级(一般)</span>
    </div>
    <div class="common-css" v-show="approveInfo.approveResultFlag==1">
      <span>处理单位：</span>
      <span>{{handleInfo.submitToName || "-"}}</span>
    </div>
    <div class="common-css" v-show="approveInfo.approveResultFlag==1">
      <span>备注：</span>
      <span>{{approveInfo.approveRemark || "-"}}</span>
    </div>
    <div class="common-css" v-show="approveInfo.approveResultFlag==0">
      <span>说明：</span>
      <span>{{approveInfo.approveRemark || "-"}}</span>
    </div>
    <div class="check-status">
      <img :src="checkStatus" v-if="approveInfo.approveResultFlag==1">
      <img :src="checkNoStatus" v-else>
    </div>
    <div class="option-btn">
      <el-button type="info" @click="cancelBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:["approveInfo", "handleInfo", "receiveInfo"],
  data(){
    return{
      checkStatus: require("../../assets/img/sh-success.png"),
      checkNoStatus: require("../../assets/img/sh-failed.png"),
      roleId:"",
    }
  },
  mounted(){
    this.approveInfo.approveResultFlag=parseInt(this.approveInfo.approveResultFlag)
    this.roleId=this.$store.state.userInfo.roleList[0].uid
    if(this.approveInfo.submitToPhone){
      this.approveInfo.submitToPhone=this.approveInfo.submitToPhone.substring(0,3) + "-" + this.approveInfo.submitToPhone.substring(3,7) + "-" + this.approveInfo.submitToPhone.substring(7)
    }
  },
  methods:{
    cancelBack(){
      this.$router.back(-1)
    },
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
  .common-title{
    font-size:16px;
    color: #3776FF;
    margin-bottom: 30px;
    font-family:Microsoft YaHei;
    font-weight:bold;
  }
  .common-time{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span{
      font-size:12px;
      color: #666666;
      margin-bottom: 15px;
    }    
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
  .check-status{
    width: 124px;
    height: 102px;
    position: absolute;
    top: 15px;
    right: 15px;
    img{
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }
  }
  .option-btn{  
    width: 100%;  
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 30px;
  }
}
</style>