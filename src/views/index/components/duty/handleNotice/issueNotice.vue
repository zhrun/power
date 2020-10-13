/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:51:15 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-31 10:47:50
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
            <el-form-item label="发布时间" prop="data">
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
              <el-input v-model="formInline.keyword" placeholder="标题、发布人"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item class="rightButton">
              <el-button  @click="showAdd()"  icon="iconfont iconbianzu12"> 新增</el-button>
              
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="FeedbackExport">导出</el-button>
            </el-form-item> -->
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
            <el-table-column label="编号" width="60">
              <template slot-scope="scope">
                <span>{{scope.row.code || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="通知标题" width="200" show-overflow-tooltip="">
              <template slot-scope="scope">
                <span>{{scope.row.title || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="查阅状态">
              <template slot-scope="scope">
                <span v-if="scope.row.handleStatus == 2">{{scope.row.dutyNoticeSendDtoList | fiter}}/{{ scope.row.dutyNoticeSendDtoList.length}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="发布人"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.publisher || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200" >
              <template slot-scope="scope">
                <span>{{scope.row.createTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <span>{{turnStatus[scope.row.handleStatus] || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260px" fixed="right">
              <template slot-scope="scope" >
                <span class="operation_btn" v-if="scope.row.handleStatus == 1 && scope.row.opUserId == userInfo.uid" @click="editNotice(scope.row)">编辑</span>
                <span v-if="scope.row.handleStatus == 1 && scope.row.opUserId == userInfo.uid && scope.row.createTime.substr(0,10)==tody" class="operation_btn" @click="secondCom(scope.row,'del')">删除</span>
                <span class="disable" v-if="scope.row.canView==0" >预览</span>
                <span class="operation_btn" v-else @click="preInfo(scope.row)">预览</span>
                <span v-if="scope.row.handleStatus == 1 && scope.row.opUserId == userInfo.uid  && lowList.length>0 && scope.row.canView==1" class="operation_btn" @click="secondCom(scope.row,'next')">下发</span>
                <span v-if="scope.row.handleStatus == 2" class="operation_btn" @click="showBack(scope.row)">回执</span>
                <span class="operation_btn" v-if="scope.row.sysAttachmentList && scope.row.sysAttachmentList.length>0" @click="showFiles(scope.row)">查看附件</span>
                <span v-if="scope.row.handleStatus == 2 && scope.row.opUserId == userInfo.uid" class="operation_btn" @click="secondCom(scope.row,'put')">撤销</span>
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
     <!-- 回执弹框 -->
    <receipt :visible.sync="showBacklag" :receiptList="tableData"></receipt>

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
import { getNoticeList ,delNotice,putNoticeUndo,putNoticeNext,getFileList,getReceipt,getLowUint} from "@/views/index/api/onDuty/api.zr.js";
import { ajaxCtx } from '@/config/config.js';
import { getLast3Month,formatDate} from "@/utils/util.js";
import receipt from "_com/onDuty/receipt.vue";
export default {
  name: "notice",
  components: { visBreadcrumb ,receipt},
  
  data() {
   
    return {
      tody:'',
       tableData: [],
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      },
      lowList:[],
      turnStatus:{
        1:'待下发',
        2:'已下发',
      },
      // 面包屑导航数据
      breadcrumbData: [{ name: "通知公告" }, { name: "下发通知公告" }],
      formInline: {
        date: null,
        keyword: "",
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionTitle:'回执',
      showBacklag:false,
      versionLoading: false,
      dialogTableVisible: false,
      fullscreenLoading: null,
      addFormData: {
      postName:'',
      position:''
      },
      fileList:[],
      fullLoading:null,
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{}
    };
  },
  mounted() {
    this.tody = formatDate(new Date(),'yyyy-MM-dd')
    window.sendNotice = ()=>{
      this.pageOfficeSend()
    }
    this.formInline.date=[getLast3Month().last, getLast3Month().now]
    this.getLowUint({
      parentUid:this.userInfo.dutyUserInfo.unitUid,
      unitType:1
    })
  },
  activated() {
    
    if (!this.$route.meta.isBack) {
      if(this.$route.params.uid){
        this.openPageOffice(this.$route.params.uid)
      }
      this.resetForm('ruleForm');/*清空查询条件*/
    }else{
      this.$route.meta.isBack = false;
      this.getNoticeList();/*列表重新加载*/
    }
    window.closePageoffice = ()=>{
      this.closeFullScreen()
      this.resetForm('ruleForm');
    }
  },
  methods: {
     //查询当前单位是否有下级单位
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
    //打开office时打开遮罩层
    openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
    },
    //关闭office时关闭遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
    },
    //pageoffice下发时下发 公告
      pageOfficeSend(){
        this.$confirm('您确认要下发此信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.putNoticeNext({
          uid:this.$route.params.uid
        })
          
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
  
      
    },
    //通过 pageoffice打开并保存 word
    openPageOffice(d){
      let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=6&uid=' + d
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')  
      this.openFullScreen()
    },
    //下载
    download(url, filename) {
      this.fullscreenLoading = this.$loading({
          lock: true,
          text: '下载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.6)'
        });
      let _this = this;
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
        uid:d.uid
      }).then(res=>{
        if(res && res.code==='00000000'){
          this.fileList =  res.data
        }
      }).catch(e=>{
        console.error(e);
        
      })
    },
    //查看回执
    showBack(val){
      this.showBacklag = true
      let d ={
        uid:val.uid
      }
      getReceipt(d).then(res=>{
        if(res && res.code === '00000000'){
          this.tableData = []
          res.data.forEach(el=>{
            this.tableData.push({
              receiptUnit: el.unitName,
              receiptTime: el.receiptName?el.receiptTime:'',
              receiptPerson: el.receiptName,
            })
          })
        }
      }).catch((e)=>{
        console.error(e);
      })
    },
    //pageoffice预览公告
    preInfo(obj){
      let uid = obj.uid
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=6&uid=' + uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //删除 撤回  下发时的二次确认方法
    secondCom(val,type){
      let str = ''
      if(type=='del'){
        str='您确认要删除此信息吗？'
      }else if(type=='put'){
        str='您确认要撤回此信息吗？'
      }else if(type=='next'){
        str='您确认要下发此信息吗？'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:val.uid
        }
        if(type=='del'){
          this.delNotice(params)  
        }else if(type=='put'){
          params.isCancelled  = 1
          this.putNoticeUndo(params)  
        }else if(type=='next'){
         this.putNoticeNext(params)  
        }
        
      }).catch((e) => {
        console.log('e',e);
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //下发
    putNoticeNext(d){
      return putNoticeNext(d).then(res=>{
        if(res && res.code==='00000000'){
          this.$message({
            type:'success',
            message:'下发成功'
          })
           this.getNoticeList();
           return 'yes'
        }
        
      }).catch(e=>{
        console.error(e);
        return 'false'
      })
    },
    //撤消
    putNoticeUndo(d){
      putNoticeUndo(d).then(res=>{
        if(res && res.code==='00000000'){
          this.$message({
            type:'success',
            message:'撤消成功'
          })
           this.$router.push({ name: "querryNotice" });
        }
        
      }).catch(e=>{
        console.error(e);
      })
    },
    // 删除
    delNotice(d){
      delNotice(d).then(res=>{
        if(res && res.code==='00000000'){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getNoticeList();
        }
        
      }).catch(e=>{
        console.error(e);
      })
    },
    //获取公告列表数据 
    getNoticeList() {
      this.loading = true;
      // this.pageNum = 1;
      let logdata = {};
      if (this.formInline.date) {
        logdata["where.startTime"] = this.formInline.date[0]
          ? this.formInline.date[0] + " 00:00:00"
          : null;
        logdata["where.endTime"] = this.formInline.date[1]
          ? this.formInline.date[1] + " 23:59:59"
          : null;
      } else {
        logdata["where.startTime"] = null;
        logdata["where.endTime"] = null
      }

      if (this.formInline.keyword) {
        logdata["where.title"] = this.formInline.keyword;
      }
      logdata["where.isCancelled"] = 0
      logdata.pageNum = this.pageNum;
      logdata.pageSize = this.pageSize;
      logdata.orderBy="create_time"
      logdata.order="desc"

      getNoticeList(logdata)
        .then(res => {
          if (res && res.data) {
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
      this.$refs[formName].resetFields();
      this.formInline.date=[getLast3Month().last, getLast3Month().now]
      this.pageNum = 1;
      this.getNoticeList();
    },
    //跳转新添加公告页面
    showAdd(){
      this.$router.push({name:'addNotice'})
    },
    //编辑公告页面
    editNotice(obj){
      
      let data= {
        uid : obj.uid
      }
      let dataObj = JSON.stringify(obj)
      localStorage.setItem(obj.uid,dataObj)
      this.$router.push({name:'editNotice', query: data})
    },
      //取消
    onCancle() {
      // this.$refs[formName].clearValidate()
      // console.log(formName)
      if (this.editorVersionVisible) {
        this.editorVersionVisible = false;
      }
      if (this.addVersionVisible) {
        this.addVersionVisible = false;
      }
    },
    //新添提交
    onConfirm() {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      this.addVersionVisible = false;
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getNoticeList();
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getNoticeList();
    },
  },
  filters: {
   fiter(val) {
     if(!val){ return}
     let obj = val.filter(h=>h.handleStatus==3)
     if(obj && obj.length>0){
      return obj.length
     }else{
       return '0'
     }
      
   }
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