/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:51:33 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-08-05 14:26:05
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <!-- <el-scrollbar style="height:100%;width:30%">
      </el-scrollbar> -->
      <el-scrollbar style="height:100%;flex:1">
        <!-- 筛选条件 -->

        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="发文日期" prop="data">
              <el-date-picker
                v-model="formInline.date"
                type="daterange"
                :editable ="false"
                :clearable="false"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                style="width:260px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item  prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="通知标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 分页表格 -->
        <div class="common_table">
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="problemData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column label="编号"  width="80">
              <template slot-scope="scope">
                <span>{{scope.row.code || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="通知标题" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.title || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效日期" width="220">
              <template slot-scope="scope">
                <span v-if="scope.row.effectiveStartTime && scope.row.effectiveEndTime">{{scope.row.effectiveStartTime.substr(0,10) + ' - ' + scope.row.effectiveEndTime.substr(0,10)}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="发布单位"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.unitName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发文时间"  width="160">
              <template slot-scope="scope">
                <span>{{scope.row.sendTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态"  width="80">
              <template slot-scope="scope">
                <span>{{status[scope.row.handleStatus] || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="250">
              <template slot-scope="scope">
                <span class="operation_btn" v-if="scope.row.handleStatus==2" @click="getNoticeReceive(scope.row)">接收</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==3"  @click="preInfo(scope.row)">预览</span>
                <span class="operation_btn"  v-if="scope.row.handleStatus==3"  @click="goInfo(scope.row)">办理</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==3 && lowList.length>0"  @click="changeNext(scope.row)">转为下发</span>
                <span class="operation_btn" v-if="scope.row.handleStatus==5"  @click="goInfo(scope.row)">再次办理</span>
                <span class="operation_btn" v-if="scope.row.sysAttachmentList && scope.row.sysAttachmentList.length>0 "  @click="showFiles(scope.row)">查看附件</span>
                <!-- <span class="operation_btn" @click="editPost(scope.row)">撤销</span>
                <span class="operation_btn" @click="editPost(scope.row)">无</span> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="onPageChange"
            :current-page.sync="pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            class="pagination_comp"
          ></el-pagination>
        </div>
      </el-scrollbar>
    </div>
   
    <!-- 查看附件 -->
    <el-dialog title="查看附件" :visible.sync="dialogTableVisible"  width="700px" :close-on-click-modal="false" class="receipt-dialog"   >
      <el-table :data="fileList">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column property="originalFileName" label="附件名称" width="500">
        </el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope" >
            <span class="operation_btn" @click="download(scope.row.fileFullPath, scope.row.originalFileName)"  >下载</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getNoticePage,getNoticeReceive,getFileList,getLowUint  } from "@/views/index/api/onDuty/api.zr.js";
import { getLast3Month } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { mapState } from "vuex";
export default {
  components: { visBreadcrumb },
  data() {
    
    return {
      
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      },
      status:{2:'未接收',3:'已接收'},
      // 面包屑导航数据
      breadcrumbData: [{ name: "通知公告" }, { name: "接收通知公告" }],
      formInline: {
        date: null,
        keyword: ""
      },
      // 表格数据
      problemData: [],
      fileList: [],
      loading: false,
      dialogTableVisible: false,
      fullscreenLoading: null,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      versionLoading: false,
      fullLoading:null,
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      lowList:[]
    };
  },
  mounted() {
    this.formInline.date=[getLast3Month().last, getLast3Month().now]
    this.getNoticePage();
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    this.getLowUint({
      parentUid:this.userInfo.dutyUserInfo.unitUid,
      unitType:1
    })
    
  },
  computed: {
    ...mapState(["immediateMessage"])
  },
  watch:{
    immediateMessage:function(val){
      if(val.immediateMessage=='receiveNotice'){
        this.resetForm('ruleForm')
      }
    }
  },
  methods: {
    //获得当前单位的下级单位 
    getLowUint(d){
     getLowUint(d).then(res=>{
        if(res && res.code==="00000000"){
          if(res.data && res.data.length>0){
            this.lowList = res.data
          }
        }
      }).catch(e=>{
        console.error('error',e);
      })
   },
   //pageoffice打开遮罩层
    openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
    },
    //关闭遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
    },
    //办理再次办理
    goInfo(obj){
      this.$router.push({
        name:'newCommunication',
        query:{
          fromTxt:"noticeEdit",
          objUid:obj.uid,
          happenTime:obj.sendTime,
        }
      })
    },
    //转为下发
    changeNext(obj){
      // this.addNotice()
      this.$router.push({name:'addNotice',query:{uid:obj.noticeUid}})
    },
    //下载
    download(url, filename) {
      let _this = this;
      this.fullscreenLoading = this.$loading({
          lock: true,
          text: '下载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.6)'
        });
      this.getBlob(url, function(blob) {
        _this.saveAs(blob, filename);
      });
    },
    getBlob(url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (xhr.status === 200) {
          cb(xhr.response);
        }
      };
      xhr.send();
    },
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        var body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
      this.fullscreenLoading.close();
    },
    //查看附件
    showFiles(d){
      this.dialogTableVisible =true
      getFileList({
        uid:d.noticeUid
      }).then(res=>{
        if(res && res.code==='00000000'){
          this.fileList =  res.data
        }
      }).catch(e=>{
        console.error(e);
        
      })
    },
    //预览
    preInfo(obj){
      let uid = obj.noticeUid
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=6&uid=' + uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //接收
    getNoticeReceive(d){
      getNoticeReceive({
        uid:d.uid
      }).then(res=>{
        if(res && res.code === '00000000'){
          this.getNoticePage();
          this.preInfo(d)
        }
      }).catch((e)=>{
        console.error(e);
      })
    },
    //获得列表数据
    getNoticePage() {
      this.loading = true;
      // this.pageNum = 1;
      let logdata = {};
      // console.log('this.formInline.date',this.formInline.date);
      
      if (this.formInline.date) {
        logdata["where.startTime"] = this.formInline.date[0]
          ? this.formInline.date[0] + " 00:00:00"
          : null;
        logdata["where.endTime"] = this.formInline.date[1]
          ? this.formInline.date[1] + " 23:59:59"
          : null;
      } else {
        logdata["where.startTime"] = "";
        logdata["where.endTime"] = "";
      }

      if (this.formInline.keyword) {
        logdata["where.title"] = this.formInline.keyword;
      }
      logdata.pageNum = this.pageNum;
      logdata.pageSize = this.pageSize;
      logdata.orderBy = "create_time";
      logdata.order = "desc";

      // console.log(logdata);
      getNoticePage(logdata)
        .then(res => {
          if (res && res.data) {
            // console.log("res", res);
            this.problemData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    //重置
    resetForm(formName) {
      this.formInline.date=[getLast3Month().last, getLast3Month().now]
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.getNoticePage();
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getNoticePage();
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getNoticePage();
    },
  }
};
</script>

<style lang="scss" scoped>
.common_content{
  display: flex;
  justify-content: space-between;
}
.program-up {
  height: 100%;
  position: relative;
}
.rightButton{
  position: absolute;
  right: 0;
}
.addDialog{
  border-radius:15px;
}

</style>