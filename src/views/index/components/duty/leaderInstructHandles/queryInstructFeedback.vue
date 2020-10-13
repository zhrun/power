<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 查询批示反馈.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;">
          <el-form-item label="编发日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="queryStr" placeholder="标题" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="feedbackData" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <!-- <el-table-column label="序号" type="index" width="70"></el-table-column> -->
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="编发时间" prop="editTime" width="170"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span v-show="scope.row.handleStatus==1" class="n-finish"><i></i>未上报</span>
                <span v-show="scope.row.handleStatus==2 || scope.row.handleStatus==3" class="y-finish"><i></i>已上报</span>
                <span v-show="scope.row.handleStatus==4" class="i-finish"><i></i>已退回</span>
              </template>
            </el-table-column>
            <el-table-column label="接收人" prop="receiptPersonName" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="接收时间" prop="receiptTime" width="170"></el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="report(scope.row.uid)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf && scope.row.canView==1">上报</span>
                <span class="operation_btn" style="color:#666666" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf && scope.row.canView!=1">上报</span>
                <span class="operation_btn" @click="revoke(scope.row.uid)" v-if="scope.row.handleStatus==2 && scope.row.isOneSelf">撤销</span>
                <span class="operation_btn" @click="edit(scope.row)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf">编辑</span>
                <span class="operation_btn" @click="del(scope.row.uid)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf">删除</span>
                <span class="operation_btn" @click="viewAttachments(scope.row.uid)" v-if="scope.row.existFile>0">查看附件</span>
                <span class="operation_btn" @click="backReason(scope.row.uid)" v-if="scope.row.handleStatus==4">退回原因</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 
            未上报	预览、上报、查看附件（如果反馈时有上传附件）、编辑、删除
            已上报未接收	预览、撤销、查看附件（如果反馈时有上传附件）按钮
            已下发已接收	预览、查看附件（如果反馈时有上传附件）按钮
            已下发已退回	预览、查看附件（如果反馈时有上传附件）、退回原因
          -->
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <back-reason :visible.sync="showBackReason" :back-content="backContent"></back-reason>
    <view-attach :visible.sync="showViewAttach" :attach-list="attachList"></view-attach>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import backReason from "_com/onDuty/back-reason.vue";
import viewAttach from "_com/onDuty/view-attach.vue";
import { getLast3Month } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getFeedbackPageList, putReportFeedback, putUndoFeedback, deleteFeedback, getRefuseInfoReason, getFeedbackDetail } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb, backReason, viewAttach },
  data() {
    return {
      breadcrumbData: [{ name: "领导批示办理" }, { name: "查询批示反馈" }],
      commonData:[],
      queryStr:null,
      feedbackData: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showBackReason:false,
      showViewAttach:false,
      backContent:"",
      attachList:[],
      userInfo:null,
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取页面初始化列表数据
    this.getFeedbackPageList()  
  },
  activated() {
    //监听pageOffice关闭窗口事件 
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getFeedbackPageList()
    }else{
      this.resetForm()
    }
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
    },
    //获取页面初始化列表数据
    getFeedbackPageList() {
      this.tableLoading = true;
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null;
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null;
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.queryStr": this.queryStr,
        "where.orgId":this.userInfo.rmsUnitDto.uid,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "orderBy":"a.edit_time",
      }
      this.feedbackData=[]
      getFeedbackPageList(params).then(res => {
        this.tableLoading = false;
        if(res && res.code==="00000000") {
          this.total = res.data.total;
          this.feedbackData = res.data.list;
          this.feedbackData.map((item)=>{
            item.receiptPersonName=item.receiptPersonName || "-"
            item.receiptTime=item.receiptTime || "-"
            item.title=item.title || "-"
            item.editTime=item.editTime || "-"
            item.isOneSelf=item.authUserId==this.userInfo.uid? true: false
          })
        }
      }).catch(error => {
        this.tableLoading = false;
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.queryStr= null
      this.pageNum = 1
      this.getFeedbackPageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getFeedbackPageList();
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=5&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //上报
    report(uid){
      let that = this
      that.$alert('您确认要上报此信息吗？', '上报', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid: uid
            }
            putReportFeedback(params).then((res)=>{
              if(res && res.code==="00000000"){
                this.getFeedbackPageList()
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            }) 
          }
          if(action==='cancel'){
            that.$message({
              type: 'info',
              message: '已取消'
            })
          }
        }
      })
    },
    //撤回
    revoke(uid){
      let that = this
      that.$alert('您确认要撤销此信息吗？', '撤销', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            putUndoFeedback(params).then((res)=>{
              if(res && res.code==="00000000"){
                this.getFeedbackPageList()
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            }) 
          }
          if(action==='cancel'){
            that.$message({
              type: 'info',
              message: '已取消'
            })
          }
        }
      })      
    },
    //编辑
    edit(obj){
      this.$router.push({ name: "addInstructeFeedback", query:{formTxt:"edit", uid:obj.uid} });
    },
    //删除
    del(uid){
      let that = this
      that.$alert('您确认要删除此信息吗？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            deleteFeedback(params).then((res)=>{
              if(res && res.code==="00000000"){
                this.getFeedbackPageList()
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            }) 
          }
          if(action==='cancel'){
            that.$message({
              type: 'info',
              message: '已取消'
            })
          }
        }
      })      
    },
    //查看附件
    viewAttachments(uid){
      this.attachList=[]
      let params={
        uid:uid
      }
      getFeedbackDetail(params).then((res)=>{
        if(res && res.code==="00000000"){
          if(res.data && res.data.sysAttachmentList && res.data.sysAttachmentList.length>0){
            res.data.sysAttachmentList.map((item)=>{
              let unt={}
              unt.uid=item.uid
              unt.originalFileName=item.originalFileName
              unt.fileFullPath=item.fileFullPath
              this.attachList.push(unt)
            }) 
          }
          this.showViewAttach=true
        }
      })      
    },
    //撤回原因
    backReason(uid){
      let params={
        uid:uid
      }
      getRefuseInfoReason(params).then((res)=>{
        if(res && res.code==="00000000"){
          this.backContent=res.data || "-"
          this.showBackReason=true
        }
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page
      this.getFeedbackPageList()
    },
  }
};
</script>
<style lang="scss" scoped>

</style>