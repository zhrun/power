/dutyMange/editDuty/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:51:24 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-07 14:44:52
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
              <el-input v-model="formInline.keyword" placeholder="通知标题、发布人"></el-input>
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
            <el-table-column label="编号" width="80">
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
                <span>{{scope.row.effectiveStartTime.substr(0,10) + ' - ' + scope.row.effectiveEndTime.substr(0,10)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发布人"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.publisher || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建日期"  width="160">
              <template slot-scope="scope">
                <span>{{scope.row.createTime.substr(0,10) || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态"  width="80">
                <span>已撤销</span>
            </el-table-column>
            <el-table-column label="撤销时间"  width="160">
              <template slot-scope="scope">
                <span>{{scope.row.updateTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" v-if="scope.row.opUserId == userInfo.uid" @click="secondCom(scope.row)">删除</span>
                <span class="operation_btn" v-if="scope.row.sysAttachmentList && scope.row.sysAttachmentList.length>0"  @click="showFiles(scope.row)">查看附件</span>
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
            <span class="operation_btn" @click="download(scope.row.fileFullPath, scope.row.originalFileName)">下载</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getNoticeList,delNotice,getFileList  } from "@/views/index/api/onDuty/api.zr.js";
import { getLast3Month} from "@/utils/util.js";
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
      // 面包屑导航数据
      breadcrumbData: [{ name: "通知公告" }, { name: "查询撤销通知" }],
      formInline: {
        date: null,
        keyword: "",
      },
      // 表格数据
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      dialogTableVisible:false,
      versionLoading: false,
      fullscreenLoading: null,
      fileList:[],
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{}
      
    };
  },
  mounted() {
    this.formInline.date=[getLast3Month().last, getLast3Month().now]
    this.getNoticeList();
  },
  methods: {
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
        uid:d.uid
      }).then(res=>{
        if(res && res.code==='00000000'){
          this.fileList =  res.data
        }
      }).catch(e=>{
        console.error(e);
        
      })
    },
    //删除动作二次确认
    secondCom(val){
      let  str='您确认要删除此信息吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:val.uid
        }
         this.delNotice(params)  
        
      }).catch((e) => {
        console.log('e',e);
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
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
    //获取列表数据
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
      logdata["where.isCancelled"] = 1;  // 0正常  1 已经撤消
      logdata.pageNum = this.pageNum;
      logdata.pageSize = this.pageSize;
      logdata.orderBy="update_time"
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
      this.formInline.date=[getLast3Month().last, getLast3Month().now]
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.getNoticeList();
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