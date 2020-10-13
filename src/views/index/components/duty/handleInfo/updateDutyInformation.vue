<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 上报值班信息.
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
            <el-input type="text" v-model="queryStr" placeholder="值班信息标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item class="position-right">
            <el-button icon="iconfont iconbianzu12" @click="addExpress"> 新增</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="reportDutyTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="编号" prop="code" width="70"></el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="编发时间" prop="editTime" width="170"></el-table-column>
            <el-table-column label="状态" width="110">
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.txtStatus=='未上报'"><i></i> {{scope.row.txtStatus}}</span>
                <span class="y-finish" v-show="scope.row.txtStatus=='已上报'"><i></i> {{scope.row.txtStatus}}</span>
                <span class="i-finish" v-show="scope.row.txtStatus=='已退回'"><i></i> {{scope.row.txtStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接收人" prop="receiptPersonName" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="接收时间" prop="receiptTime" width="170"></el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="resubmit(scope.row.uid)" v-if="scope.row.handleStatus!=4 && scope.row.type!=2 && scope.row.authUserId==userInfo.uid">续报</span>
                <span class="operation_btn" @click="report(scope.row.uid)" v-if="scope.row.handleStatus==null && scope.row.authUserId==userInfo.uid && scope.row.canView==1">上报</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==null && scope.row.authUserId==userInfo.uid && scope.row.canView!=1" style="color:#666666">上报</span>
                <span class="operation_btn" @click="revoke(scope.row.reportUid)" v-if="scope.row.handleStatus==1 && scope.row.authUserId==userInfo.uid">撤销</span>
                <span class="operation_btn" @click="receiptFunc(scope.row.uid)" v-if="scope.row.handleStatus==1 || scope.row.handleStatus==3 || scope.row.handleStatus==5 || scope.row.handleStatus==6 || scope.row.handleStatus==7">回执</span>
                <span class="operation_btn" @click="reasonForReturn(scope.row)" v-if="scope.row.handleStatus==4">退回原因</span>
                <span class="operation_btn" @click="edit(scope.row.uid)" v-if="(scope.row.handleStatus==null || scope.row.handleStatus==4) && scope.row.authUserId==userInfo.uid">编辑</span>
                <span class="operation_btn" @click="del(scope.row.uid)" v-if="scope.row.handleStatus==null && scope.row.authUserId==userInfo.uid">删除</span>
                <span class="operation_btn" @click="down(scope.row)" v-if="scope.row.canView==1">下载</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">下载</span>
                <!-- 
                  1、未上报：预览 | 续报 | 上报 | 编辑 | 删除 | 下载			null/2

                  2、已上报（无人接收）：预览 | 撤销 | 续报 | 回执 | 下载			1

                  3、已上报（有人接收）：预览	| 续报 | 回执 | 下载			3

                  4、已上报（已退回）：操作栏显示按钮：预览 | 退回原因 | 编辑| 下载			4

                  5、不是本人创建的、没有编辑和删除权限

                  预览		all
                  续报		!4
                  上报		null
                  撤销		1
                  编辑		NULL/4
                  删除		null
                  回执		!(null/4)
                  退回原因	4
                  下载		all

                  (1待收/2撤销/3已收/4退回/5批示未下发/6批示已下发/7转上报)
                 -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <receipt :visible.sync="showReceipt" :receipt-list="receiptList"></receipt>
    <back-reason :visible.sync="showBackReason" :back-content="backContent"></back-reason>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import receipt from "_com/onDuty/receipt-sth.vue";
import backReason from "_com/onDuty/back-reason.vue";
import { getLast3Month, exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getReportDutyList, putReportDutyReport, deleteReportDuty, putReceipt, putUndo, getReportDutyRefuse } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb, receipt, backReason },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" }, { name: "上报值班信息" }],
      commonData:[],
      queryStr:null,
      reportDutyTableList: [],  // 表格数据
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo:null,
      showReceipt:false,
      receiptList:[],
      showBackReason:false,
      backContent:"",
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取页面初始化列表数据
    this.getReportDutyList()
  },
  activated() {
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getReportDutyList()
    }else{
      this.resetForm()
    }
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
  },
  methods: {
    //打开pageOffice时，开启遮罩层
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
    getReportDutyList() {
      this.tableLoading=true
      let startTime="", endTime=""
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: ""
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: ""
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.queryStr": this.queryStr,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"operation.edit_time",
        "order":"desc"
      }
      this.reportDutyTableList=[]
      getReportDutyList(params).then((res)=>{
        this.tableLoading=false
        if(res && res.code==="00000000") {
          this.total = res.data.total;
          this.reportDutyTableList=res.data.list
          this.reportDutyTableList.map((item)=>{
            if(item.handleStatus==null){
              item.txtStatus="未上报"
            }else if(item.handleStatus==4){
              item.txtStatus="已退回"
            }else{
              item.txtStatus="已上报"
            }
            item.receiptPersonName=item.receiptPersonName || "-"
            item.receiptTime=item.receiptTime || "-"
            item.isOneSelf=item.authUserId==this.userInfo.uid? true: false
          })
        }
      }).catch((error)=>{
        this.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData = [getLast3Month().last, getLast3Month().now]
      this.queryStr = null
      this.pageNum = 1
      this.getReportDutyList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getReportDutyList();
    },
    //新增
    addExpress(){
      this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"新增"} })
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //续报
    resubmit(uid){
      this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"续报", uid:uid} })
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
              uid:uid
            }
            putReportDutyReport(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getReportDutyList()
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
    //撤销
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
            putUndo(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getReportDutyList()
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
    //回执
    receiptFunc(uid){
      let params={
        uid:uid
      }
      putReceipt(params).then((res)=>{
        if(res && res.code==="00000000"){
          this.receiptList=res.data
          this.receiptList.map((item)=>{            
            item.receiptPerson=item.receiptPerson || "-"
            item.receiptTime=item.receiptTime || "-"
            item.receiptUnit=item.receiptUnit || "-"
          })
          this.showReceipt=true
        }else{
          console.log("接口报错=>",res)
        }
      }) 
    },
    //退回原因
    reasonForReturn(obj){
      let params={
        uid:obj.reportUid
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
    //编辑
    edit(uid){
      this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"编辑", uid:uid}})
    },
    //删除
    del(uid){       
      let that = this      
      that.$alert('您确认要删除此信息吗？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            deleteReportDuty(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getReportDutyList()
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
    //下载
    down(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/download'
      let params={
        wordType:2,
        uid:obj.uid
      }
      let unitName=`${this.userInfo.rmsUnitDto.unitName}值班信息`
      exportFn(objStr, params, unitName, 'docx')
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getReportDutyList();
    },
  }
};
</script>

<style lang="scss" scoped>
.position-right{
  position: absolute;
  top: 0px;
  right: -20px;
}
</style>
<style lang="scss">
.el-message-box__title{
  span{
    font-weight: bold;
  }
}
</style>