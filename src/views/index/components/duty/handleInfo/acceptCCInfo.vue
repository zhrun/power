<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 接收抄送信息.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true">
          <el-form-item label="抄送日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
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
          <el-table :data="copyTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <!-- <el-table-column label="编号" prop="code" width="70"></el-table-column> -->
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="抄送时间" prop="copyTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="抄送单位" prop="copyUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="类型" prop="typeTxt" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="statusTxt" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="n-finish" v-show="scope.row.statusTxt=='未接收'"><i></i> {{scope.row.statusTxt}}</span>
                <span class="y-finish" v-show="scope.row.statusTxt=='已接收'"><i></i> {{scope.row.statusTxt}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <span class="operation_btn" @click="accept(scope.row)" v-if="scope.row.handleStatus==1">接收</span>
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.handleStatus!=1 && scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="down(scope.row)" v-if="scope.row.handleStatus!=1 && scope.row.canView==1">下载</span>
                <span class="operation_btn" v-if="scope.row.handleStatus!=1 && scope.row.canView!=1" style="color:#666666">下载</span>
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
import { getLast3Month, exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getCopyPageList, putCopyReceive } from "@/views/index/api/onDuty/api.ps.js";
import { mapState } from "vuex";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" }, { name: "接收抄送信息" }],
      commonData:[],
      queryStr:null,
      copyTableList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      fullLoading:null,
      userInfo:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    //获取页面初始化列表数据
    this.getCopyPageList();
  },
  computed: {
    ...mapState(["immediateMessage"])
  },
  watch:{
    immediateMessage:function(val){
      if(val.immediateMessage=='acceptCCInfo'){
        this.resetForm()
      }
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
      this.getCopyPageList()
    },
    //获取页面初始化列表数据
    getCopyPageList() {
      let that = this
      that.tableLoading = true;
      let startTime=null, endTime=null
      if (that.commonData) {
        startTime = that.commonData[0]? `${this.commonData[0]} 00:00:00`: null;
        endTime = that.commonData[1]? `${this.commonData[1]} 23:59:59`: null;
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.queryStr": this.queryStr,
        pageNum:that.pageNum,
        pageSize:that.pageSize,
      }
      that.copyTableList=[]
      getCopyPageList(params).then(res => {
        that.tableLoading = false
        if(res && res.code==="00000000") {
          if(res.data && res.data.list.length>0){
            that.total = res.data.total
            that.copyTableList = res.data.list
            that.copyTableList.map((item)=>{
              item.statusTxt=item.handleStatus==1?"未接收":"已接收"
              item.typeTxt=item.type==1?"突发事件":"一般事件"
              item.copyTime=item.copyTime || "-"
              item.copyUnit=item.copyUnit || "-"
            })
          }          
        }
      }).catch(error => {
        that.tableLoading = false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.queryStr= null
      this.pageNum = 1
      this.getCopyPageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1
      this.getCopyPageList()
    },
    //接收
    accept(obj){
      let that = this
      let params={
        uid:obj.uid
      }
      putCopyReceive(params).then((res)=>{
        if(res && res.code==="00000000"){
          let objStr=""
          if(obj.type==1){    //值班信息
            objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&uid=' + obj.objUid
          }else if(obj.type==2){    //要情快报
            objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=3&uid=' + obj.objUid
          }
          window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
          that.openFullScreen()
        }
      }) 
    },
    //预览
    preInfo(obj){
      let objStr=""
      if(obj.returnType==1){    //值班信息
        objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=2&uid=' + obj.objUid
      }else if(obj.returnType==2){    //要情快报
        objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=3&uid=' + obj.objUid
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
        unitName=`${obj.copyUnitName}值班信息`
      }else if(obj.returnType==2){    //要情快报
        params.wordType=3
        unitName=`${obj.copyUnitName}要情快报`
      }
      params.uid=obj.objUid
      exportFn(objStr, params, unitName, 'docx')
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page
      this.getCopyPageList()
    },
  }
};
</script>
<style lang="scss" scoped>

</style>