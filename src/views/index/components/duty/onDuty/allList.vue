<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;" >
          <el-form-item label="类别">
            <el-select v-model="reportType" placeholder="全部" class="wid120" >
              <el-option :key="-1" label="全部" value></el-option>
              <el-option v-for="item in reportOptionUnit" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="reportStatus" placeholder="全部"  class="wid80">
              <el-option :key="-1" label="全部" value></el-option>
              <el-option v-for="item in handleStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建文日期">
            <el-date-picker v-model="formInlineData" type="daterange" unlink-panels range-separator="-"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button @click="outExport">导出</el-button>
          </el-form-item>
        </el-form>
        <div class="tables">
          <el-table ref="versionTable" :data="problemData" tooltip-effect="dark"  class="eventtables" v-loading="loading" style="width:99%">
            <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
            <el-table-column label="简要描述" show-overflow-tooltip prop="mattersDesc">
               <template slot-scope="scope">
                  <span  class="acolor" @click="goShow(scope.row)" v-if="scope.row.isContinue">{{scope.row.mattersDesc}}</span>
                  <span v-else>{{scope.row.mattersDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="建文时间" width="180" prop="createTime"></el-table-column>
            <el-table-column label="建文人" width="120">
               <template slot-scope="scope">
                <span>{{scope.row.createPersonName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="类别" width="120">
              <template slot-scope="scope">
                <span>{{mattersSourceType[scope.row.mattersSourceType] || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span>{{status[scope.row.handleStatus] || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.handleStatus==2 && !scope.row.isCurWorkSchedule" >查看</span>
                <span class="operation_btn" @click="hairDown(scope.row)" v-if="scope.row.handleStatus==1 && scope.row.opUserId==userInfo.uid && scope.row.mattersSourceType!=71 && scope.row.mattersSourceType!=72 && scope.row.mattersSourceType!=73">续办</span>
                <span class="operation_btn" @click="secondCom(scope.row,1)" v-if="scope.row.handleStatus==3">归档</span>
                <span class="operation_btn" @click="edit(scope.row)" v-if="scope.row.handleStatus!=2 || (scope.row.handleStatus==2 && scope.row.isCurWorkSchedule)" >编辑</span>
                <span class="operation_btn" @click="secondCom(scope.row,0)" v-if="owner==scope.row.createPerson && scope.row.isCurWorkSchedule">删除</span>
              </template>
            </el-table-column>
          </el-table>
            <el-pagination  @current-change="onPageChange" :current-page.sync="pageNum" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog title="查看" :visible.sync="showInfo"
      :close-on-click-modal="true"
      width="650px"
      top="30vh" class="receipt-dialog"  >
      <div class="infos">
        <h5>简要描述：</h5>
        <p>
          {{showObj.mattersDesc}}
        </p>
      </div>     
    </el-dialog>
    <operation v-if="operObj" :visible.sync="showOper" title="操作" @submitOper="submitForm" @closeOper="showOper = false" :eventData='operObj'></operation>
    <el-dialog title="关联业务" :visible.sync="dialogTableVisible" width="800px">
      <el-table :data="gridData">
        <el-table-column property="title" label="标题" show-overflow-tooltip >
          <template slot-scope="scope">
            <span class="acolor" @click="goPageOffice(scope.row)" >{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" >
          <template slot-scope="scope">
            {{mattersType[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" width="200"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import operation from "_com/onDuty/dutyOperation.vue";
import { getAllList,delEvent,putEvent,getRecordList} from "@/views/index/api/onDuty/api.zr.js";
import { getIssueInstructionDetail } from "@/views/index/api/onDuty/api.ps.js";
import { getLast3Month,exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb, operation },
  data() {
    return {
      breadcrumbData: [{ name: "值班记录单" }, { name: "所有工作记录" }],
      reportOptionUnit: [
        {
          label: "要情快报",
          value: "2"
        },
        {
          label: "值班信息",
          value: "3"
        },
        {
          label: "通知公告",
          value: "4"
        },
        {
          label: "来文拟办",
          value: "5"
        },
        {
          label: "来电拟办",
          value: "6"
        },
        {
          label: "电话记录",
          value: "7"
        },
        {
          label: "批示下发",
          value: "8"
        },{
          label: "批示反馈",
          value: "9"
        },
        {
          label: "其它",
          value: "1"
        }
      ],
      dialogTableVisible:false,
      gridData:[],
      handleStatus: [
        {
          label: "待办",
          value: "1"
        },
        {
          label: "已办",
          value: "2"
        },
        {
          label: "关注",
          value: "3"
        },
        {
          label: "归档",
          value: "4"
        }
      ],
      mattersType:{
        1:'其它',
        2:'要情快报',
        3:'值班信息',
        4:'通知公告',
        5:'来文拟办',
        6:'来电拟办',
        7:'电话记录',
        8:'批示下发',
        9:'批示反馈',
      },
      mattersSourceType:{
        11:'其它',
        12:'其它',
        13:'其它',
        21:'要情快报',
        22:'要情快报',
        23:'要情快报',
        31:'值班信息',
        32:'值班信息',
        33:'值班信息',
        41:'通知公告',
        42:'通知公告',
        43:'通知公告',
        51:'来文拟办',
        52:'来文拟办',
        53:'来文拟办',
        61:'来电拟办',
        62:'来电拟办',
        63:'来电拟办',
        71:'电话记录',
        72:'电话记录',
        73:'电话记录',
        81:'批示下发',
        82:'批示下发',
        83:'批示下发',
        91:'批示反馈',
        92:'批示反馈',
        93:'批示反馈',
      },
      status:{0:'',1:'待办',2:'已办',3:'关注',4:'归档'},
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{} ,
      formInlineData:[],
      reportType:"",
      reportStatus:"1",
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showReceipt:false,
      showInfo:false,
      showObj:{},
      showOper:false,
      operObj:null,
      owner:null
    };
  },
  mounted() {
    this.owner = this.userInfo.uid
    this.formInlineData=[getLast3Month().last, getLast3Month().now]
    this.getAllList();
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
  },
  methods: {
    //展示续办信息列表
    goShow(obj){
      this.dialogTableVisible = true
      this.getRecordList({
        uid:obj.uid
      })
    },
    getRecordList(d){
      getRecordList(d).then(res=>{
        if(res && res.code==='00000000'){
          this.gridData = res.data
        }
      }).catch(()=>{

      })
    },
     openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
    },
    //关闭pageoffice 遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
    },
     goPageOffice(obj){
      let atype = obj.type
        if(obj.type==2){atype = 3 }
        if(obj.type==3){atype = 4}
        if(obj.type==4){atype = 6}
        if(obj.type==5){atype = 7}
        if(obj.type==6){atype = 7}
        if(obj.type==7){atype = 7}
        if(obj.type==8){atype = 4}
        if(obj.type==9){atype = 5}
       let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType='+atype+'&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //提交操作
    submitForm(val){
      let params ={
        uid:val.uid,
        handleStatus:val.status,
        mattersDesc:val.mattersDesc
      }
      this.putEvent(params)  
    },
    //二次确认
    secondCom(val,type){
      let  str='您确认要删除此信息吗？'
      let title = '提示'
      if(type==0){
        title = '提示'
        str='您确认要删除此信息吗？'
      }
      if(type==1){
        title = '归档'
        str='您确认要归档此关注事项吗？'
      }
      this.$confirm(str, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:val.uid
        }
        // console.log('132');
        if(type==0){
          this.delEvent(params)  
        }
        if(type==1){
          params.handleStatus = 4
          params.mattersDesc = val.mattersDesc
          this.putEvent(params)  
        }
        
      }).catch((e) => {
        console.log('e',e);
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    
    // 删除记录
    delEvent(d){
      delEvent(d).then(res=>{
        if(res && res.code==='00000000'){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getAllList();
        }
        
      }).catch(e=>{
        console.error(e);
      })
    },
    //修改记录
    putEvent(d){
      putEvent(d).then(res=>{
        if(res && res.code==='00000000'){
          this.operObj = null
          this.showOper = false
          this.$message({
            type:'success',
            message:'操作成功'
          })
          this.getAllList();
          this.showOper = false
        }
        
      }).catch(e=>{
        console.error(e);
      })
    },
    //导出记录
    outExport() {
      
      let start = `${this.formInlineData[0]} 00:00:00`
      let end = `${this.formInlineData[1]} 23:59:59`
      let exportUrl = ajaxCtx.uem+'/duty/work-matters/export'
      let params = {
        startTime:start,
        endTime:end,
        handleStatus:this.reportStatus || null,
        mattersSourceType:this.reportType || null
      }
       // 本单位名称+工作记录
       let unitName = this.userInfo.rmsUnitDto && this.userInfo.rmsUnitDto.unitName
      // }).catch(e=>{console.log('e',e)})
      let fileName =unitName+'工作记录'
      let extName="xls"
    
      exportFn(exportUrl,params,fileName,extName)
    },
    //获取所有的工作记录
    getAllList() {
      let startTime=null, endTime=null
      if (this.formInlineData) {
        startTime = this.formInlineData[0]? this.formInlineData[0] + " 00:00:00": null;
        endTime = this.formInlineData[1]? this.formInlineData[1] + " 23:59:59": null;
      } else {
        startTime = null;
        endTime = null;
      }
      this.loading = true;
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.sourceType": this.reportType,
        "where.handleStatus": this.reportStatus,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        orderBy:"create_time",
        order:"desc"
      }
      
      getAllList(params).then(res => {
        if (res && res.data) {
        this.problemData = res.data.list;
        this.total = res.data.total;
        this.loading = false;
        }
      }).catch(e => {
          console.log(e);
          this.loading = false;
      })
    },
    //重置
    resetForm() {
      // this.formInlineData=[]
      this.reportType = ''
      this.reportStatus = '1'
      this.formInlineData=[getLast3Month().last, getLast3Month().now]
      this.pageNum = 1
      this.getAllList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getAllList();
    },
    //查看
    preInfo(obj){
      this.showObj = obj
      this.showInfo = true
    },
    //续办
    hairDown(val){
      let type = this.mattersSourceType[val.mattersSourceType]
      //   23:'要情快报',
        // 31:'值班信息',
        // 43:'通知公告',
        // 53:'来文拟办',
        // 63:'来电拟办',
        // 73:'电话记录',
        // 83:'批示下发',
        // 92:'批示反馈',
      if(type=='其它'){
        this.showOper = true
        this.operObj = val
      }else if(type=='通知公告'){
        this.$router.push({name:'addNotice',query:{
          recorduid:val.uid,
          eventUid:val.mattersSourceUid
        }})
      }else if(type=='要情快报'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addExpress", query:{fromTouch:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='值班信息'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='来文拟办'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "newCommunication", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='来电拟办'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "calCommunication", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='电话记录'){
        // if(val.mattersSourceUid){
        //   this.$router.push({ name: "newTelephoneRecord", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        // }
      }else if(type=='批示下发'){
        if(val.mattersSourceUid){
          let params={
            uid: val.mattersSourceUid
          }
          getIssueInstructionDetail(params).then((res)=>{
            if(res && res.code==="00000000") {
              if(res.data.eventDto){                
                if(res.data.eventDto.instructionType==1){//值班信息的批示
                  this.$router.push({ name: "receiveExpress", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
                }else if(res.data.eventDto.instructionType==2){//要情快报的批示
                  this.$router.push({ name: "instructeExpress", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
                }
              }
            }
          }).catch((error)=>{
            console.log("接口报错=>",error)
          })
        }
      }else if(type=='批示反馈'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addInstructeFeedback", query:{formTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }
    },
    //编辑
    edit(val){
      this.showOper = true
      this.operObj = JSON.parse(JSON.stringify(val))
       if(val.handleStatus == 4){
        this.operObj.handleStatus = 2
      }
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getAllList();
    },
  }
};
</script>
<style lang="scss" scoped>
.tables{
  .btn{
    color: $main_color;
    cursor: pointer;
    padding-right: 5px;
  }
  margin-top: 10px;
  /deep/ .el-table__header thead tr th{
    background: rgba(240,242,245,1);
    color: $font_333;
    &:first-child{
      border-top-left-radius: 6px;
    }
    &:nth-child(6) {
      border-top-right-radius: 6px;
    }
  }
}
/deep/ .el-dialog__body{
  padding: 20px;
  padding-top: 10px;
}
/deep/ .el-dialog .el-dialog__header .el-dialog__title{
  font-weight: normal;
}
.acolor{
  color: #5458FD;
  cursor: pointer;
}
</style>
<style lang="scss">
.wid120{
  width: 120px;
}
.wid80{
  width: 80px;
}
</style>