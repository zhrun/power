<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="content-box">
      <div class="content-unit" style="width: calc(33.3333% - 10px);margin-right: 10px;" :style="{height:getHeight}">
        <el-scrollbar style="height:100%; width:101%">
          <div v-if="receiveInfo.receiveType==1 || receiveInfo.receiveType==2" style="height:100%; width:100%">
              <one-info :reportInfo="reportInfo" :reportAttachments="reportAttachments" :receiveInfo="receiveInfo" :userEmergencyContactInfo="userEmergencyContactInfo"></one-info> 
          </div>   
          <div v-if="receiveInfo.receiveType==3 || receiveInfo.receiveType==4 || receiveInfo.receiveType==5" style="height:100%; width:100%">
            <two-info :receiveInfo="receiveInfo"  :checkInfo="checkInfo"></two-info> 
          </div>           
        </el-scrollbar>
      </div>
      <div class="content-unit" style="width: calc(33.3333% - 10px);margin-right: 10px;" :style="{height:getHeight}"> 
        <el-scrollbar style="height:100%; width:101%"> 
          <div v-if="receiveInfo.receiveType==1 || receiveInfo.receiveType==2" style="height:100%; width:100%">
            <examine-record :receiveInfo="receiveInfo" :checkInfo="checkInfo" :checkAttachments="checkAttachments" :approveInfo="approveInfo"></examine-record>
          </div>
          <div v-if="receiveInfo.receiveType==3 || receiveInfo.receiveType==4 || receiveInfo.receiveType==5" style="height:100%; width:100%">
            <examine-info :checkInfo="checkInfo" :checkAttachments="checkAttachments" :approveInfo="approveInfo"></examine-info>
          </div>
        </el-scrollbar>
      </div>
      <div class="content-unit" style="width: calc(33.3333% - 10px)" :style="{height:getHeight}">      
        <el-scrollbar style="height:100%; width:101%">
          <check-record :approveInfo="approveInfo" :handleInfo="handleInfo" :receiveInfo="receiveInfo" v-if="approveInfo"></check-record>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import oneInfo from "_com/examine/oneInfo.vue";
import twoInfo from "_com/examine/twoInfo.vue";
import examineRecord from "_com/examine/examineRecord.vue";
import examineInfo from "_com/examine/examineInfo.vue";
import checkRecord from "_com/examine/checkRecord.vue";
import { getApproveDetail } from "_api/eas/api.ps.js";
export default {
  components: { visBreadcrumb, oneInfo, twoInfo, examineRecord, examineInfo, checkRecord },
  data(){
    return{
      breadcrumbData:[{name: "上级通知"}, { name: "审批不通过",routerName: "failedUp"}, { name: "查看详情" }],
      getHeight:0,
      examineUid:"",
      receiveInfo:{},
      reportInfo:{},
      reportAttachments:[],
      checkInfo:{},
      checkAttachments:[],
      approveInfo:null,
      handleInfo:{},
      userEmergencyContactInfo:{},
      videoDataURl:"",
      dialogVisible:false,
      dialogVisibleAuto:false,
      audioUrl:""
    }
  },
  mounted(){
    this.getHeight = (document.body.clientHeight-140) + "px"
    if(this.$route.query && this.$route.query.uid){
      this.examineUid=this.$route.query.uid
      this.getCheck()
    }
  },
  methods:{
    getCheck(){
      let params={
        approveUid:this.examineUid
      }
      getApproveDetail(params).then((res)=>{
        if(res && res.data){
          this.receiveInfo=res.data.receiveInfo || {}
          this.receiveInfo.receiveType=parseInt(this.receiveInfo.receiveType)
          this.reportInfo=res.data.reportInfo || {}
          this.reportAttachments=res.data.reportAttachments || []
          this.checkInfo=res.data.checkInfo || {}
          this.checkAttachments=res.data.checkAttachments || []
          this.approveInfo=res.data.approveInfo || {}
          this.handleInfo=res.data.handleInfo || {}
          this.userEmergencyContactInfo=res.data.userEmergencyContactInfo || {}
        }
      }).catch(()=>{
        console.log("接口报错！！！")
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.content-box{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  .content-unit{
    background-color: #ffffff;
    position: relative;
  }
}
</style>
<style lang="scss">
.content-box{
  .el-scrollbar__wrap{
    overflow-x: hidden !important;
    margin-right: -19px !important;
  }
  .el-scrollbar__thumb{
    background-color: rgba(87,139,255,0);
  }
  .content-unit{
    .el-scrollbar__view{
      height: 100%;
    }
  }
}
</style>