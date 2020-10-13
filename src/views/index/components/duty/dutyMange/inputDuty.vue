/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:27 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-08 14:43:07
 */
<template>
  <div class="editduty">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="main">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="下载模板" >
          <span class="down" @click="setDown">
            <i class="el-icon-paperclip"></i>
            下载编排班模板
          </span>
          <!-- <el-button  style="width:300px" icon="el-icon-paperclip">新增值班信息模板</el-button> -->
          <span class="info">点击左侧“下载模板”按钮，下载模板到本地，并录入数据</span>
        </el-form-item>
        <el-form-item label="导入模板" >
          <el-upload
            style="width:300px;display:inline"
             ref="fileUpload"
          :on-success="handSuccess"
          :on-remove="handleRemove"
          :on-change="handleChange"
          with-credentials
          :limit="1"
          :on-exceed="handleExceed"
          action="#"
          :before-upload="beforeUploadFile"
          :http-request="uploadAvatarFile"
          :on-progress="onProgress"
          :auto-upload="false"
          accept=".xls, .xlsx"
          :file-list="fileList"
          v-model="fileList">
            <el-button size="small" type="primary" style="width:300px;font-size:14px">点击选择要导入的模板</el-button>
             <span class="info">选择下载的模板（录入数据后）再导入模板</span>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
       
          <!-- <el-button type="primary" style="width:300px" >点击选择要导入的模板</el-button> -->
         
        </el-form-item>
        <el-form-item label=" ">
         <div class="messages">
           <div v-if="!faildInfo">
            <p>模板规则</p>
            <p>1、红色为必填项</p>
            <p>2、开始时间必须小于结束时间，且小于区间24小时、开始时间时间必须为当日以后的日期</p>
            <p>3、多个人员用，或、分隔开</p>
            <p>4、如表格中的本身的数据有冲突，以先导入的为准</p>
            <p>5、如表格中的数据与列表数据有冲突，直接覆盖原数据</p>
           </div>
           <div v-else>
             <p>导入失败，查看原因：<a @click="toTodown">下载</a></p>
           </div>
         </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="goBack()">返 回</el-button>
          <el-button type="primary" @click="submitForm()">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
   
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { importDutyList} from "@/views/index/api/onDuty/api.zr.js";
import { ajaxCtx } from '@/config/config.js';
import { exportFn } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "编排班管理"}, {name: "浏览值班表",routerName:'browseDutyList'},{name:'导入'}],
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      downFile:ajaxCtx.uem+'/duty/work-schedule-service/download',
      fileList:[],
      upLoadSuccess:false,
      fileLoading:false,
      successInfo:{},
      faildInfo:null,

    };
  },
  mounted() {
    
  },
  methods: {
    // 附件相关
    handleChange(file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    //删除文件
    handleRemove() {
      this.fileList = [];
    },
    //成功
    handSuccess() {
      // this.dialogVisible = false; // 关闭模态框
      // this.$emit("importSuccess", res.data);
    },
    //文件上传个数限制
     handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //文件上传大小的限制
    beforeUploadFile(file) {
      
      let isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 50MB!");
      }
      return isLt50M;
    },
    //上传
    uploadAvatarFile(item) {
      this.fileLoading = true; // 打开加载效果
      this.upLoadSuccess = false;
      this.emptyUploadFile();
      const formData = new FormData();
      formData.append("file", item.file);
      importDutyList(formData).then(res => {
        this.fileLoading = false;
        this.upLoadSuccess = true;
        if (res && res.code == "00000000") {
          this.$message.success("导入成功");
          this.successInfo = res.data
          this.faildInfo = null
        } else {
          this.faildInfo= res.data
          // this.$message.success("导入失败");
        }
      }).catch((err)=>{
         this.faildInfo= err.data
        this.fileList = []
      });
    },
    //清除时
    emptyUploadFile() {
      const mainImg = this.$refs.fileUpload;
      if (mainImg) {
        if (mainImg.length) {
          mainImg.forEach(item => {
            item.clearFiles();
          });
        } else {
          this.$refs.fileUpload.clearFiles();
        }
      }
    },
    //上传进度
    onProgress(event) {
     
      this.upLoadSuccess = false;
      if (event.percent.toFixed(0) >= 100) {
        this.upLoadSuccess = true;
      }
    },
    //返回
    goBack(){
      this.$router.push({path:'/main/browsedutylist'})
    },
    //提交导入文件
    submitForm(){
      if (this.fileList.length > 0) {
        this.$nextTick(() => {
          this.$refs.fileUpload.submit();
          // this.dialogVisible = false;
        });
      } else {
        this.$message.warning("请上传文件");
      }
    },
    //下载模板
    setDown(){

      exportFn(this.downFile,null,'值班信息模板','xls')
      // window.location = this.downFile;
    },
    //下载错误信息
    toTodown(){
      window.location = this.faildInfo.fileUrl;
    }
    
  }
};
</script>
<style lang="scss" scoped>
  .main{
    background: #ffffff;
    border-radius: 15px;
    padding: 30px 20px 20px 20px ;
    height: calc(100% - 60px);
    justify-content: normal !important;
   .demo-ruleForm{
     width:830px;
   }
   .info{
     font-size: 14px;
     color: #999999;
     padding-left: 20px;
   }
   .messages{
     border:1px solid rgba(229,234,244,1);
    border-radius:6px;
    padding: 20px;
    p{
      color: #C3C9D8;
      font-size: 14px;
      a{
        color: $main_color;
        cursor: pointer;
      }
    }
   }
   .down{
      width: 300px;
      height:40px;
      display: inline-block;
      padding-left: 20px;
      background:rgba(240,242,245,1);
      border:1px solid rgba(229,234,244,1);
      border-radius:6px;
      text-align: left;
      position: relative;
      cursor: pointer;
      user-select: none;
      &:hover{
         background:rgba(230,232,235,1);
         color: $main_color;
      }
      i{
        font-size: 20px;
        vertical-align: middle;
        padding: 0px 5px 0 0;
      }
   }
}

</style>

