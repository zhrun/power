<template>
  <div class="wrap">
    <div class="common-title">核实记录</div>
    <div class="common-time">
      <span>{{checkInfo.submitToName}}于{{checkInfo.checkTime}}提交</span> 
      <span>联系电话：{{checkInfo.submitToPhone}}</span>
    </div>
    <div class="common-affect" v-show="receiveInfo.affectedNumber!=null || receiveInfo.injuredNumber!=null || receiveInfo.deadNumber!=null">受影响情况：
      <span>
        <span v-show="receiveInfo.affectedNumber!=null" style="margin-right: 15px;">{{receiveInfo.affectedNumber}}人受影响</span>
        <span v-show="receiveInfo.injuredNumber!=null" style="margin-right: 15px;">{{receiveInfo.injuredNumber}}人受伤</span>
        <span v-show="receiveInfo.deadNumber!=null">{{receiveInfo.deadNumber}}人死亡</span>
      </span>
      </div>
    <div class="common-css">
      <span>核实方式：</span>
      <span v-show="checkInfo.checkType==1">电话核实</span>
      <span v-show="checkInfo.checkType==2">app视频核实</span>
      <span v-show="checkInfo.checkType==3">网格员核实</span>
      <span v-show="checkInfo.checkType==4">其它渠道核实</span>
    </div>
    <div class="common-css" v-show="checkInfo.checkType==1">
      <span>核实对象：</span>
      <span v-show="checkInfo.checkToType==1">上报人</span>
      <span v-show="checkInfo.checkToType==2">上报人紧急联系人</span>
      <span v-show="checkInfo.checkToType==3">{{ (checkInfo.checkToRemark || '-') }}</span>
    </div>
    <div class="common-css" v-show="checkInfo.checkType==3">
       <span>网格员姓名：</span>
        <span>{{checkInfo.gridMamangerName}}({{checkInfo.gridMamangerPhone}})</span>
    </div>
    <div class="common-css" v-show="checkInfo.checkType==4">
       <span>核实渠道：</span>
        <span>{{checkInfo.checkChannel}}</span>
    </div>
    <div class="common-css">
      <span>发生时间：</span>
      <span>{{receiveInfo.eventTime || "-"}}</span>
    </div>
    <div class="common-css">
      <span>主要内容：</span>
      <span>{{receiveInfo.eventContent || "-"}}</span>
    </div>
    <div class="common-css">
      <span>事发原因：</span>
      <span>{{receiveInfo.eventReason || "-"}}</span>
    </div>
    <div class="common-css">
      <span>处理措施：</span>
      <span>{{receiveInfo.handlingMethod || "-"}}</span>
    </div>
    <div class="common-css">
      <span>核实结论：</span>
      <span v-show="checkInfo.checkResultFlag==0" style="color:#FF0000">不符合报送</span>
      <span v-show="checkInfo.checkResultFlag==1" style="color:#72C081;font-size:14px;">符合报送</span>
    </div>
    <div class="common-css" style="margin-bottom:20px">
      <span>核实附件：<span v-if="checkAttachments && checkAttachments.length==0">-</span></span>
    </div>
    <div class="common-img clearfix" v-if="checkAttachments && checkAttachments.length>0">
      <div class="img-unit" v-for="(item, index) in checkAttachments" :key="index+6">
        <img class="img-fill" :src="item.fileType=='mp4'?videoPre:item.fileFullPath" @click="playVideo(index)">
      </div>
    </div>
    <div class="common-css">
      <span>附件来源：</span>
      <span>{{checkInfo.fileSourceDesc || "-"}}</span>
    </div>
    <div class="common-css">
      <span>报送对象：</span>
      <span>{{approveInfo.submitToName || "-"}}</span>
    </div>
    <div class="common-css">
      <span>报送备注：</span>
      <span>{{approveInfo.submitRemark || "-"}}</span>
    </div>
    <el-dialog :visible.sync="dialogVisible" class="enclosDialog">
      <div is="preview" :eData="checkAttachments" v-model="currentEnclosIndex"></div>
    </el-dialog>
  </div>
</template>

<script>
import preview from "_com/preview.vue"
export default {
  components: { preview },
  props:["checkInfo","receiveInfo","checkAttachments", "approveInfo"],
  data(){
    return{
      videoPre:require("../../assets/img/videoPre.png"),
      videoUrl:"",
      imgList:[],
      dialogVisible:false,
      currentEnclosIndex:-1
    }
  },
  mounted(){
    if(this.checkInfo.submitToPhone){
      this.checkInfo.submitToPhone=this.checkInfo.submitToPhone.substring(0,3) + "-" + this.checkInfo.submitToPhone.substring(3,7) + "-" + this.checkInfo.submitToPhone.substring(7)
    }
    if(this.checkInfo.gridMamangerPhone){
      this.checkInfo.gridMamangerPhone=this.checkInfo.gridMamangerPhone.substring(0,3) + "-" + this.checkInfo.gridMamangerPhone.substring(3,7) + "-" + this.checkInfo.gridMamangerPhone.substring(7)
    }
  },
  methods:{
    playVideo(index){
      this.currentEnclosIndex = index;
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  width: 100%;
  height: 100%;
  padding: 20px;
  .common-title{
    margin-bottom: 30px;
    font-size:16px;
    color: #3776FF;
    font-family:Microsoft YaHei;
    font-weight:bold;
  }
  .common-time{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    span{
      font-size:12px;
      color: #666666;
    }
  }
  .common-affect{
    font-size:16px;
    font-weight:bold;
    color: #FF0000;
    margin-bottom: 15px;
  }  
  .clearfix::after {
      display: block;
      clear: both;
      content: "";
  }
  .common-img{
    width: 100%;
    margin-bottom: 15px;
    .img-unit{
      width: 32%;
      height: 150px;
      float: left;
      margin-right: 2%;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 10px;
      cursor: pointer;
      position: relative;
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