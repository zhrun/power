<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 已退回信息.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true">
          <el-form-item label="上报日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="上报单位">
            <el-select v-model="reportUnit" placeholder="全部">
              <el-option :key="-1" label="全部" value></el-option>
              <el-option v-for="item in reportOptionUnit" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="queryStr" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="refuseTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="上报时间" prop="reportTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="上报单位" prop="reportUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="100" show-overflow-tooltip>已退回</el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="down(scope.row)" v-if="scope.row.canView==1">下载</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">下载</span>
                <span class="operation_btn" @click="receiptFunc(scope.row.uid)">回执</span>
                <span class="operation_btn" @click="backReasonFunc(scope.row.objUid)">退回原因</span>
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
import { ajaxCtx } from '@/config/config.js';
import { querySortList, getRefusePageList, getRefuseInfoReceipt, getRefuseInfoReason } from "@/views/index/api/onDuty/api.ps.js";
import { getLast3Month, exportFn } from "@/utils/util.js";
export default {
  components: { visBreadcrumb, receipt, backReason },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" }, { name: "已退回信息" }],
      reportOptionUnit: [],
      commonData:[],
      reportUnit: null,
      queryStr:null,
      refuseTableList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showReceipt:false,
      showBackReason:false,
      userInfo:null,
      backContent:"",
      receiptList:[],
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取上报单位
    this.querySortList()
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    //获取页面初始化列表数据
    this.getRefusePageList()
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
    //获取上报单位
    querySortList(){
      let params={
        parentUid:this.userInfo.rmsUnitDto.uid,
        unitType:1
      }
      querySortList(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.length>0){
            res.data.map((item)=>{
              let unit={}
              unit.label=item.unitName
              unit.value=item.uid
              this.reportOptionUnit.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取页面初始化列表数据
    getRefusePageList() {
      this.tableLoading = true;
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null;
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null;
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.reportUnit":this.reportUnit?this.reportUnit:null,
        "where.queryStr":this.queryStr?this.queryStr:null,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "orderBy":"b.report_time",
        "order":"desc"
      }
      this.refuseTableList=[]
      getRefusePageList(params).then(res => {
        if(res && res.code==="00000000") {
          this.refuseTableList = res.data.list
          this.total = res.data.total
          this.tableLoading = false
          this.refuseTableList.map((item)=>{
            item.reportUnitName=item.reportUnitName || "-"
            item.reportTime=item.reportTime || "-"
            item.title=item.title || "-"
          })
        }
      }).catch(error => {
        this.tableLoading = false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.reportUnit= null
      this.queryStr= null
      this.pageNum = 1
      this.getRefusePageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1
      this.getRefusePageList()
    },
    //预览
    preInfo(obj){
      let objStr=""
      if(obj.returnType==1){
        objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&uid=' + obj.dutyUid
      }else if(obj.returnType==2){
        objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=3&uid=' + obj.dutyUid
      }      
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //下载
    down(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/download'
      let params={}
      let unitName=""
      if(obj.returnType==1){    //值班信息
        params.wordType=2
        unitName=`${obj.reportUnitName}值班信息`
      }else if(obj.returnType==2){    //要情快报
        params.wordType=3
        unitName=`${obj.reportUnitName}要情快报`
      }
      params.uid=obj.dutyUid
      exportFn(objStr, params, unitName, 'docx')
    },
    //回执
    receiptFunc(uid){
      let params={
        uid:uid
      }
      this.receiptList=[]
      getRefuseInfoReceipt(params).then((res)=>{
        if(res && res.code==="00000000") {
          let unit={}
          unit.receiptUnit=res.data.receiptUnit || "-"
          unit.receiptTime=res.data.receiptTime || "-"
          unit.receiptPerson=res.data.receiptPerson || "-"
          this.receiptList.push(unit)
          this.showReceipt=true
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //退回原因
    backReasonFunc(uid){
      let params={
        uid:uid
      }
      getRefuseInfoReason(params).then((res)=>{
        if(res && res.code==="00000000") {
          this.backContent=res.data || "-"
          this.showBackReason=true
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getRefusePageList();
    },
  }
};
</script>

<style lang="scss" scoped>

</style>