<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 查询批示下发.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;">
          <el-form-item label="发文日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="statusUnit" placeholder="全部">
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="queryStr" placeholder="文件标题" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="instructionTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="文件标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="文件类型" width="170">
              <template slot-scope="scope">
                <span v-if="scope.row.type==1">值班信息 第{{scope.row.code}}期</span>
                <span v-if="scope.row.type==2">要情快报 第{{scope.row.code}}期</span>
              </template>
            </el-table-column>
            <el-table-column label="接收单位" prop="receiveUnit" show-overflow-tooltip></el-table-column>
            <el-table-column label="发文时间" prop="createTime" width="170"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.handleStatus==1" class="n-finish"><i></i>未下发</span>
                <span v-if="scope.row.handleStatus!=1" class="y-finish"><i></i>已下发</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="hairDown(scope.row.uid)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf && scope.row.canView==1">下发</span>
                <span class="operation_btn" style="color:#666666" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf && scope.row.canView!=1">下发</span>
                <span class="operation_btn" @click="revoke(scope.row.uid)" v-if="scope.row.handleStatus==2 && scope.row.isOneSelf && !scope.row.receivePerson">撤销</span>
                <span class="operation_btn" @click="edit(scope.row)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf">编辑</span>
                <span class="operation_btn" @click="del(scope.row.uid)" v-if="scope.row.handleStatus==1 && scope.row.isOneSelf">删除</span>
                <span class="operation_btn" @click="receiptFunc(scope.row.uid)" v-if="scope.row.handleStatus==2">回执</span>
                <span class="operation_btn" @click="viewFeedBack(scope.row)" v-if="scope.row.handleStatus==2">查看反馈</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <receipt :visible.sync="showReceipt" :receipt-list="receiptList"></receipt>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import receipt from "_com/onDuty/receipt-sth.vue";
import { ajaxCtx } from '@/config/config.js';
import { getInstructionSendPageList, getIssueInstructionReceipt, putIssueInstructionIssue, putIssueInstructionUndo,  deleteSaveIssueInstruction } from "@/views/index/api/onDuty/api.ps.js";
import { getLast3Month } from "@/utils/util.js";
export default {
  components: { visBreadcrumb, receipt },
  data() {
    return {
      breadcrumbData: [{ name: "领导批示办理" }, { name: "查询批示下发" }],
      statusOption: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "未下发"
        },
        {
          value: 1,
          label: "已下发"
        },
      ],
      commonData:[],
      statusUnit:null,
      queryStr:null,
      instructionTableList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showReceipt:false,
      userInfo:null,
      receiptList:[],
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取页面初始化列表数据
    this.getInstructionSendPageList()    
  },
  activated() {
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getInstructionSendPageList()
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
    getInstructionSendPageList() {
      this.tableLoading = true;
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null;
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null;
      }
      let statusUnit=null
      if(this.statusUnit==-1){
        statusUnit=null
      }else if(this.statusUnit==0){
        statusUnit=1
      }else if(this.statusUnit==1){
        statusUnit=2
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.handleStatus":statusUnit,
        "where.queryStr":this.queryStr,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "orderBy":"temp.createTime",
      }
      this.instructionTableList=[]
      getInstructionSendPageList(params).then(res => {
        this.tableLoading = false;
        if(res && res.code==="00000000") {
          if(res.data && res.data.list && res.data.list.length>0){
            this.instructionTableList = res.data.list;
            this.total = res.data.total;
            this.instructionTableList.map((item)=>{
              item.title=item.title || "-"
              item.receiveUnit=item.receiveUnit || "-"
              item.createTime=item.createTime || "-"
              item.isOneSelf=item.opUserId==this.userInfo.uid? true: false
            })
          }         
        }
      }).catch(error => {
        this.tableLoading = false;
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.statusUnit=null
      this.queryStr= null
      this.pageNum = 1
      this.getInstructionSendPageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getInstructionSendPageList();
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=4&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //下发
    hairDown(uid){      
      let that = this
      that.$alert('您确认要下发此信息吗？', '下发', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            putIssueInstructionIssue(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getInstructionSendPageList()
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
            putIssueInstructionUndo(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getInstructionSendPageList()
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
      if(obj.type==1){//值班信息
        this.$router.push({ name: "receiveExpress", query:{fromTxt:"edit", uid:obj.uid} })
      }else if(obj.type==2){//要情快报
        this.$router.push({ name: "instructeExpress", query:{fromTxt:"edit", uid:obj.uid} })
      }      
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
            deleteSaveIssueInstruction(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getInstructionSendPageList()
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
      this.receiptList=[]
      getIssueInstructionReceipt(params).then((res)=>{
        if(res && res.code==="00000000"){
          if(res.data && res.data.length>0){
            res.data.map((item)=>{
              let unit={}
              unit.receiptUnit=item.receiptUnit || "-"
              unit.receiptTime=item.receiptTime || "-"
              unit.receiptPerson=item.receiptPerson || "-"
              this.receiptList.push(unit)
            })
          }
          this.showReceipt=true
        }
      }) 
    },
    //查看反馈
    viewFeedBack(obj){
      this.$router.push({ name: "feedBackList", query:{uid:obj.uid, title:obj.title} })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page
      this.getInstructionSendPageList()
    },
  }
};
</script>
<style lang="scss" scoped>

</style>