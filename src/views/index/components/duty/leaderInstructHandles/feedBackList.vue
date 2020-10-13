<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 批示反馈列表.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <div class="top-box">
          <div class="file-title">
            <span style="color:#333333">文件标题 ：</span>
            <span>{{fileTitle}}</span>
          </div>
          <div class="right-back">
            <el-button @click="backPre">返回</el-button>
          </div>
        </div>
        <div class="common_table">
          <el-table ref="versionTable" :data="feedbackTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="接收单位" prop="receiptUnit"></el-table-column>
            <el-table-column label="反馈状态">
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.statusNum==1"><i></i> 未反馈</span>
                <span class="y-finish" v-show="scope.row.statusNum==2 || scope.row.statusNum==3"><i></i> 已反馈</span>
                <span class="i-finish" v-show="scope.row.statusNum==4"><i></i> 已退回</span>
              </template>
            </el-table-column>
            <el-table-column label="反馈人" prop="feedbackPerson"></el-table-column>
            <el-table-column label="反馈时间" prop="feedbackTime"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="(scope.row.statusNum==3 || scope.row.statusNum==4) && scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="(scope.row.statusNum==3 || scope.row.statusNum==4) && scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="accept(scope.row)" v-if="scope.row.statusNum==2">接收</span>
                <span class="operation_btn" @click="beatBack(scope.row)" v-if="scope.row.statusNum==2 || scope.row.statusNum==3">退回</span>
                <span class="operation_btn" @click="receiptFunc(scope.row)" v-if="scope.row.statusNum==1">再次批示</span>
                <span class="operation_btn" @click="reasonForReturn(scope.row)" v-if="scope.row.statusNum==4">退回原因</span>
              </template>
            </el-table-column>
            <!-- 
              1.未反馈--再次批示
              2.已反馈未接收--接收、退回   
              3.已反馈已接收--预览、退回
              4.已退回--预览、退回原因
             -->
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <handle-back v-if="backVisible" :back-beat-id="backBeatId" @handleBackClose="handleBackClose" @handleConfirm="handleConfirm"></handle-back>
    <back-reason :visible.sync="showBackReason" :back-content="backContent"></back-reason>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import handleBack from "_com/onDuty/handle-back.vue";
import backReason from "_com/onDuty/back-reason.vue";
import { getIssueInstructionFeedbackPageList, putDutyFeedbackReceive, postDutyFeedbackRefuse, getReportDutyRefuse } from "@/views/index/api/onDuty/api.ps.js";
import { ajaxCtx } from '@/config/config.js';
// import { getLast3Month } from "@/utils/util.js";
export default {
  components: { visBreadcrumb, handleBack, backReason },
  data() {
    return {
      breadcrumbData: [{ name: "领导批示办理" }, { name: "查询批示下发", routerName: "queryInstructHairdown"}, { name: "批示反馈列表" }],
      fileTitle:"测试标题1",
      feedbackTableList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      backVisible:false,
      showBackReason:false,
      backBeatId:"",
      backContent:""
    };
  },
  mounted() {
    //监听pageOffice关闭窗口事件 
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    this.fileTitle=this.$route.query.title || "测试标题1"
    //获取页面初始化列表数据
    this.getIssueInstructionFeedbackPageList()
  },
  methods: {
    //打开pageOffice时，页面的遮罩层
    openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    //关闭pageOffice时，关闭页面的遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }      
      this.getIssueInstructionFeedbackPageList()
    },
    //获取页面初始化列表数据
    getIssueInstructionFeedbackPageList() {
      this.tableLoading = true;
      let params={
        "where.objUid":this.$route.query.uid,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
      }
      this.feedbackTableList=[]
      getIssueInstructionFeedbackPageList(params).then(res => {
        this.tableLoading = false
        if(res && res.code==="00000000") {
          this.total = res.data.total
          this.feedbackTableList = res.data.list
          this.feedbackTableList.map((item)=>{
            item.receiptUnit=item.receiptUnit || "-"
            item.feedbackTime=item.feedbackTime || "-"
            item.feedbackPerson=item.feedbackPerson || "-"
            if(item.feedbackPerson=='-'){//未反馈
              item.statusNum=1
            }else if(item.feedbackPerson && item.handleStatus==2){//已反馈未上报
              item.statusNum=2
            }else if(item.feedbackPerson && item.handleStatus==3){//已反馈已上报
              item.statusNum=3
            }else if(item.feedbackPerson && item.handleStatus==4){//已退回
              item.statusNum=4
            }
          })
        }
      }).catch(error => {
        this.tableLoading = false;
        console.log("接口报错=>",error)
      })
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=5&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //接收
    accept(obj){
      let that = this
      let params={
        uid: obj.uid
      }
      putDutyFeedbackReceive(params).then((res)=>{
        if(res && res.code==="00000000"){
          let objStr=ajaxCtx.uem + '/duty/page-office/view?wordType=5&uid=' + obj.uid
          window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
          that.openFullScreen()
        }
      }) 
    },
    //退回
    beatBack(obj){
      this.backBeatId=obj.uid
      this.backVisible=true
      this.reportUid=obj.feedbackUnit
    },
    handleBackClose(){
      this.backVisible=false
    },
    //提交退回原因
    handleConfirm(v){
      let that=this
      let params={
        objUid:that.backBeatId,
        returnReason:v.backContent || null,
        returnType:2,   //上报信息1，反馈信息2
        isCommon:v.isCommon,
        receiptUnit:this.reportUid
      }
      postDutyFeedbackRefuse(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.getIssueInstructionFeedbackPageList()
          that.backBeatId=""
          that.backVisible=false
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //再次批示
    receiptFunc(obj){
      if(obj.type==1){//值班信息
        this.$router.push({ name: "receiveExpress", query:{fromTxt:"add", uid:obj.objUid} })
      }else if(obj.type==2){//要情快报
        this.$router.push({ name: "instructeExpress", query:{fromTxt:"add", uid:obj.objUid} })
      }
    },
    //退回原因
    reasonForReturn(obj){
      let params={
        uid:obj.uid
      }
      getReportDutyRefuse(params).then((res)=>{
        if(res && res.code==="00000000") {
          this.backContent=res.data || "-"
          this.showBackReason=true
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //返回
    backPre(){
      this.$router.back(-1) 
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getIssueInstructionFeedbackPageList();
    },
  }
};
</script>
<style lang="scss" scoped>
.top-box{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .file-title{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0 30px 0;
    span{
      color: $font_999;
    }
  }
  .right-back{

  }
}
</style>