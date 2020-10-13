<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 接收上级批示.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;">
          <el-form-item label="下发日期">
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
          <el-table :data="acceptData" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <!-- <el-table-column label="序号" type="index" width="70"></el-table-column> -->
            <el-table-column label="文件标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="发布单位" prop="ownerOrgName" show-overflow-tooltip></el-table-column>
            <el-table-column label="类型" prop="typeTxt" width="100"></el-table-column>
            <el-table-column label="下发时间" prop="sendTime" width="170"></el-table-column>
            <el-table-column label="接收状态" width="100">
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.acceptTxt=='未接收'"><i></i> {{scope.row.acceptTxt}}</span>
                <span class="y-finish" v-show="scope.row.acceptTxt=='已接收'"><i></i> {{scope.row.acceptTxt}}</span>
              </template>
            </el-table-column>
            <el-table-column label="反馈状态" width="120">
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.feedbackTxt=='未反馈'"><i></i> {{scope.row.feedbackTxt}}</span>
                <span class="y-finish" v-show="scope.row.feedbackTxt=='已反馈'"><i></i> {{scope.row.feedbackTxt}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.handleStatus!=1 && scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==1" @click="accept(scope.row)">接收</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==2 || scope.row.handleStatus==3" @click="feedback(scope.row)">反馈</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==4" @click="feedback(scope.row)">再次反馈</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.isHandle==0" @click="handle(scope.row)">办理</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.isHandle!=0" @click="handle(scope.row)">再次办理</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getLast3Month } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getReceivePageList, putDutyReceive } from "@/views/index/api/onDuty/api.ps.js";
import { mapState } from "vuex";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "领导批示办理" }, { name: "接收上级批示" }],
      commonData:[],
      queryStr:null,
      acceptData: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    //获取页面初始化列表数据
    this.getReceivePageList()
  },
  computed: {
    ...mapState(["immediateMessage"])
  },
  watch:{
    immediateMessage:function(val){
      if(val.immediateMessage=='acceptLeaderInstructions'){
        this.resetForm()
      }
    }
  },
  activated() {
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getReceivePageList()
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
      this.getReceivePageList()
    },
    //获取页面初始化列表数据
    getReceivePageList() {
      this.tableLoading = true
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.queryStr": this.queryStr,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "orderBy":"b.send_time",
      }
      this.acceptData=[]
      getReceivePageList(params).then(res => {
        this.tableLoading = false
        if(res && res.code==="00000000") {
          this.total = res.data.total
          this.acceptData = res.data.list
          this.acceptData.map((item)=>{
            if(item.type==1){
              item.typeTxt="值班信息"
            }else if(item.type==2){
              item.typeTxt="要情快报"
            }
            if(item.handleStatus==1){
              item.acceptTxt="未接收"
            }else{
              item.acceptTxt="已接收"
            }
            if(item.handleStatus==4){
              item.feedbackTxt="已反馈"
            }else{
              item.feedbackTxt="未反馈"
            }
            item.sendTime=item.sendTime || "-"
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
      this.queryStr= null
      this.pageNum = 1
      this.getReceivePageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1
      this.getReceivePageList()
    },
    //接收
    accept(obj){
      let that = this
      let params={
        uid:obj.uid
      }
      putDutyReceive(params).then((res)=>{
        if(res && res.code==="00000000"){
          let objStr=ajaxCtx.uem + '/duty/page-office/view?wordType=4&uid=' + obj.objUid
          window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
          that.openFullScreen()
        }
      }) 
    },
    //预览
    preInfo(obj){
      let objStr=ajaxCtx.uem + '/duty/page-office/view?wordType=4&uid=' + obj.objUid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //反馈
    feedback(obj){
      this.$router.push({ name: "addInstructeFeedback", query:{formTxt:"add", uid: obj.uid, objUid:obj.objUid, ownerOrgId: obj.ownerOrgId, type: obj.type} })
    },
    //办理
    handle(obj){
      this.$router.push({ name: "newCommunication", query:{ fromTxt:"updateEdit", objUid:obj.uid, happenTime:obj.sendTime}})
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page
      this.getReceivePageList()
    },
  }
};
</script>
<style lang="scss" scoped>

</style>