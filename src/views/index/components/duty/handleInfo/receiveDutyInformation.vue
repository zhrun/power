<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 接报值班信息.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="width:100%;height:100%;">
        <el-form :inline="true">
          <el-form-item label="上报日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="上报单位">
            <el-select v-model="reportUnit" placeholder="全部" style="width:180px">
              <el-option :key="-1" label="全部" value></el-option>
              <el-option v-for="item in reportOptionUnit" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="queryStr" placeholder="标题、值班信息内容" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item :class="clientWidth>1500?'position-right':''">
            <el-button type="warning" @click="haveBackInfo">已退回信息</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="receiveList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="上报时间" prop="reportTime" width="170"></el-table-column>
            <el-table-column label="上报单位" prop="reportUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="期号" width="120">
              <template slot-scope="scope">
                <span>第{{scope.row.code}}期</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="txtStatus" width="100">
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.txtStatus=='未接收'"><i></i> {{scope.row.txtStatus}}</span>
                <span class="y-finish" v-show="scope.row.txtStatus=='已接收'"><i></i> {{scope.row.txtStatus}}</span>
                <span class="i-finish" v-show="scope.row.txtStatus=='已退回'"><i></i> {{scope.row.txtStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <span class="operation_btn" v-if="scope.row.handleStatus==1" @click="accept(scope.row)">接收</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView==1" @click="preInfo(scope.row)">预览</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && userInfo.rmsUnitDto.parentUid" @click="changeReport(scope.row.objUid)">转为上报</span>
                <span class="operation_btn" v-if="(scope.row.handleStatus==3 || scope.row.handleStatus==5) && reportOptionUnit.length>0" @click="instructe(scope.row.objUid)">批示</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==6  && reportOptionUnit.length>0" @click="instructe(scope.row.objUid)">再次批示</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1" @click="beatBack(scope.row)">退回</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView==1" @click="down(scope.row)">下载</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView!=1" style="color:#666666">下载</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <handle-back v-if="backVisible" :back-beat-id="backBeatId" @handleBackClose="handleBackClose" @handleConfirm="handleConfirm"></handle-back>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import handleBack from "_com/onDuty/handle-back.vue";
import { getLast3Month, exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getReceiveDutyList, querySortList, putReceiveDutyReceive, postReceiveDutyRefuse } from "@/views/index/api/onDuty/api.ps.js";
import { mapState } from "vuex";
export default {
  components: { visBreadcrumb, handleBack },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" }, { name: "接报值班信息" }],
      reportOptionUnit: [],
      commonData:[],
      reportUnit: "",
      queryStr: null, 
      receiveList: [],// 表格数据
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      backVisible:false,
      userInfo:null,
      backBeatId:"",
      fullLoading:null,
      reportDutyInfoAgainUid:null,
      isPageOffice:false,
      reportUid:null,
      clientWidth:0
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取上报单位
    this.querySortList()
    //获取页面初始化列表数据
    this.getReceiveDutyList()
    this.clientWidth=document.body.clientWidth
  },
  computed: {
    ...mapState(["immediateMessage"])
  },
  watch:{
    immediateMessage:function(val){
      if(val.immediateMessage=='receiveDutyInformation'){
        this.resetForm()
      }
    }
  },
  activated() {
    let that = this
    if(that.$route.meta.isBack && that.$route.query.refresh==undefined){
      that.getReceiveDutyList()
    }else{
      that.resetForm()
    }
    //监听pageOffice转为上报事件
    window.reportDutyInfoAgain = ()=>{
      that.isPageOffice=true
      if(that.fullLoading){
        that.fullLoading.close();
      }
      that.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"转为上报", uid:that.reportDutyInfoAgainUid, noClose:true}});
    }
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      if(!that.isPageOffice){
        that.closeFullScreen()
        that.isPageOffice=false
      }
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
    //关闭pageOffice时，关闭遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
      this.pageNum = 1;
      this.getReceiveDutyList();
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
    getReceiveDutyList(){
      this.tableLoading=true
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.reportUnit":this.reportUnit?this.reportUnit:null,
        "where.queryStr": this.queryStr,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"report.report_time",
        "order":"desc"
      }
      this.receiveList=[]
      getReceiveDutyList(params).then((res)=>{
        this.tableLoading=false
        if(res && res.code==="00000000") {
          this.total = res.data.total
          this.receiveList=res.data.list
          this.receiveList.map((item)=>{
            //(1待收/2撤销/3已收/4退回/5批示未下发/6批示已下发/7转上报)
            if(item.handleStatus==1){
              item.txtStatus="未接收"
            }else if(item.handleStatus==3 || item.handleStatus==5 || item.handleStatus==6 || item.handleStatus==7){
              item.txtStatus="已接收"
            }else if(item.handleStatus==4){
              item.txtStatus="已退回"
            }
            item.reportUnitName=item.reportUnitName || "-"
            item.reportTime=item.reportTime || "-"
          })
        }
      }).catch((error)=>{
        this.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.reportUnit= ""
      this.queryStr= null
      this.pageNum = 1
      this.getReceiveDutyList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getReceiveDutyList();
    },
    //接收
    accept(obj){
      let that = this
      let hasParent=this.userInfo.rmsUnitDto.parentUid?1:0
      let params={
        uid:obj.uid
      }
      putReceiveDutyReceive(params).then((res)=>{
        if(res && res.code==="00000000") {
          let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&from=2&hasParent=' + hasParent + '&uid=' + obj.objUid
          window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
          that.openFullScreen()
          that.reportDutyInfoAgainUid=obj.objUid
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&uid=' + obj.objUid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //下载
    down(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/download'
      let params={
        wordType:2,
        uid:obj.objUid
      }
      let unitName=`${obj.reportUnitName}值班信息`
      exportFn(objStr, params, unitName, 'docx')
    },
    //已退回信息
    haveBackInfo(){
      this.$router.push({ name: "alreadyBackInfo" });
    },
    //转为上报
    changeReport(uid){
      this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"转为上报", uid:uid}});
    },
    //批示
    instructe(uid){
      this.$router.push({ name: "receiveExpress", query:{fromTxt:"add", uid:uid} });
    },
    //退回
    beatBack(obj){
      this.backBeatId=obj.uid
      this.backVisible=true
      this.reportUid=obj.reportUnit
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
        returnType:1,   //上报信息1，反馈信息2
        isCommon:v.isCommon,
        receiptUnit:this.reportUid
      }
      postReceiveDutyRefuse(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.getReceiveDutyList()
          that.backBeatId=""
          that.backVisible=false
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page
      this.getReceiveDutyList()
    },
  }
};
</script>

<style lang="scss" scoped>
.position-right{
  position: absolute;
  top: 0px;
  right: -8px;
}
</style>