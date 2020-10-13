<template>
  <div class="wrap">
    <div class="common-title">核实情况</div>
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
  props:["checkInfo", "checkAttachments", "approveInfo"],
  data(){
    return{
        videoPre:require("../../assets/img/videoPre.png"),
        videoUrl:"",
        imgList:[],
        showBg:-1,
        imgIndex:0, 
        dialogVisible:false,
        currentEnclosIndex:-1       
    }
  },
  mounted(){
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
    font-size:16px;
    color: #3776FF;
    margin-bottom: 30px;
    font-family:Microsoft YaHei;
    font-weight:bold;
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
        position: relative;
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