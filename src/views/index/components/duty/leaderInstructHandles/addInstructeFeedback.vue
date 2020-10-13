<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 新增批示反馈.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="back-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="100px" class="form-content">
          <div class="inline-form">
            <el-form-item label="编号">
              <el-input type="text" placeholder="可备注相关内容" v-model="expressForm.code" :disabled="allSetReady" readonly></el-input>
            </el-form-item>
            <el-form-item label="编发时间" prop="editTime" class="right-inline">
              <el-date-picker v-model="expressForm.editTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="编发时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
          </div>  
          <el-form-item label="标题" prop="title">
            <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.title" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.content" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="公文附件" v-loading="imgLoading">
            <el-upload class="upload-doc" action="#"  with-credentials  :before-upload="beforeUploadDocument" :on-exceed="onExceedDocument" :http-request="uploadAvatar" :on-remove="onRemoveDocument" multiple :limit="10" :file-list="fileList" :disabled="allSetReady">
              <el-button size="small" icon="el-icon-paperclip" :disabled="allSetReady">点击上传文件</el-button>
              <div slot="tip" class="el-upload__tip">附件不得大于10MB</div>
            </el-upload>
          </el-form-item>
          <div class="inline-form">
            <el-form-item label="经办人" prop="agent">
              <el-input type="text" maxlength="10" v-model="expressForm.agent" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="agentPhone" class="right-inline">
              <el-input type="text" maxlength="11" v-model="expressForm.agentPhone" placeholder="请输入联系电话" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item label="编辑" prop="editor">
              <el-input type="text" maxlength="10" v-model="expressForm.editor" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="签发" prop="signer" class="right-inline">
              <el-input type="text" maxlength="10" v-model="expressForm.signer" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" placeholder="请输入批示内容" maxlength="100" show-word-limit v-model="expressForm.remark" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
        </el-form>
        <div class="divide-line"></div>
        <el-form label-width="100px" class="form-content">
          <el-form-item label="简要描述" style="position:relative; margin-bottom:0px;">
            <span style="color:#C3C9D8">请确认填写完所有内容再填写简要描述</span>
            <el-checkbox v-model="briefChecked" class="check-style" @change="changeBrief"></el-checkbox>
            <span class="tip-req">*</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;" v-if="allSetReady">
            <el-radio-group v-model="expressForm.dutyWorkMattersEditDto.handleStatus">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="allSetReady">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.dutyWorkMattersEditDto.mattersDesc" style="width:70%"></el-input>
          </el-form-item>
          <div style="margin:40px 0px 40px 100px">
            <el-button @click="backPre">返回</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="!allSetReady" :loading="saveLoading">保存/预览</el-button>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { formatDate } from "@/utils/util.js";
import {validatePhone} from '@/utils/validator.js';
import { ajaxCtx } from '@/config/config.js';
import { batchUpload, postReceiveInstructionFeedback, putFeedback, getFeedbackDetail, getGenerateNo, putReportFeedback, getIssueInstructionDetail, } from "@/views/index/api/onDuty/api.ps.js";
import { getOnduy } from "@/views/index/api/onDuty/api.zr.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "领导批示办理" },{ name: "接收上级批示", routerName: "acceptLeaderInstructions"}, { name: "新增批示反馈" }],
      expressForm:{
        objUid:"",
        code:0,
        editTime:"",
        title:"",
        content:"",
        sysAttachmentList:[],
        agent:"",
        agentPhone:"",
        editor:"",
        signer:"",
        remark:"",
        dutyWorkMattersEditDto:{
          handleStatus:2,
          mattersDesc:"",
        },
        receiptUnit:""
      },
      expressRule:{
        editTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        title:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        content:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        agent:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        agentPhone:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
          { validator: validatePhone, trigger: 'blur' }
        ],
        editor:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        signer:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      briefChecked:false,
      allSetReady:false,
      currentObj:{},
      imgLoading:false,
      userInfo:{},
      fileList:[],
      fullLoading:null,
      saveLoading:false,
      isPageOffice:false,
      reportDutyFeedbackUid:null,
      backfeedUid:null,
      isXuban:false,
      commonType:1
    };
  },
  mounted() {
    this.expressForm.editTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    if(localStorage.getItem("vis_user_info")){
      this.userInfo=JSON.parse(localStorage.getItem("vis_user_info"))
      this.expressForm.editor=this.userInfo.userName
    }
    //监听pageOffice上报事件
    window.reportDutyFeedback = ()=>{
      this.isPageOffice=true
      this.reportDutyFeedbacks()
    }
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      if(!this.isPageOffice){
        this.closeFullScreen()
        this.isPageOffice=false
      }
    }
    if(this.$route.query.formTxt && this.$route.query.formTxt=="add"){
      this.currentObj.uid=this.$route.query.uid
      this.currentObj.receiptUnit=this.$route.query.ownerOrgId
      this.commonType=this.$route.query.type
      this.getGenerateNo()
      this.getIssueInstructionDetail(this.$route.query.objUid)
      this.getOnduy()
    }else if(this.$route.query.formTxt && this.$route.query.formTxt=="edit"){
      this.getFeedbackDetail(this.$route.query.uid)
      this.backfeedUid=this.$route.query.uid
    } else if(this.$route.query.formTxt && this.$route.query.formTxt=="续办"){
      this.isXuban=true
      this.getGenerateNo()
      this.getFeedbackDetail(this.$route.query.uid)
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
      this.$router.push({ name: "queryInstructFeedback", query:{refresh:true} });
    },
    //上报事件
    reportDutyFeedbacks(){
      let that = this
      that.fullLoading.close();
      that.$alert('您确认要上报此信息吗？', '上报', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:that.reportDutyFeedbackUid
            }
            putReportFeedback(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.$router.push({ name: "queryInstructFeedback", query:{refresh:true} })
              }
            }) 
          }
          if(action==='cancel'){
            that.$router.push({ name: "queryInstructFeedback", query:{refresh:true} })
          }
        }
      })
    },
    //获取编号
    getGenerateNo(){
      let that = this
      let params={
        type: 4
      }
      getGenerateNo(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.code = parseInt(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取批示反馈详情
    getFeedbackDetail(uid){
      let that = this
      let params={
        uid:uid
      }
      getFeedbackDetail(params).then((res)=>{
        if(res && res.code==="00000000"){
          that.expressForm.objUid=res.data.objUid
          if(that.$route.query.formTxt && that.$route.query.formTxt=="edit"){
            that.expressForm.code=res.data.code
          }          
          that.expressForm.editTime=res.data.editTime.replace(/-/g, "/")
          that.expressForm.title=that.isXuban? `【续办】${res.data.title}`: res.data.title
          that.expressForm.content=res.data.content
          that.expressForm.sysAttachmentList=res.data.sysAttachmentList
          that.expressForm.agent=res.data.agent
          that.expressForm.agentPhone=res.data.agentPhone
          that.expressForm.editor=res.data.editor
          that.expressForm.signer=res.data.signer
          that.expressForm.remark=res.data.remark
          that.expressForm.receiptUnit=res.data.receiptUnit
          that.currentObj.title=res.data.instructionTitle
          that.currentObj.code=res.data.instructionCode
          that.commonType=res.data.eventDto && res.data.eventDto.instructionType?res.data.eventDto.instructionType:1
          if(that.expressForm.sysAttachmentList && that.expressForm.sysAttachmentList.length>0){
            that.expressForm.sysAttachmentList.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.url=item.fileFullPath
              unit.name=item.originalFileName
              this.fileList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取批示详情
    getIssueInstructionDetail(uid){
      let that = this
      let params={
        uid: uid
      }
      getIssueInstructionDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.eventDto && res.data.eventDto.code){
            let type=that.commonType==1?"《值班信息》":"《要情快报》"
            that.expressForm.title=`${that.userInfo.rmsUnitDto.unitName}关于落实领导${type}${res.data.eventDto.code}期上批示的情况报告`
            that.currentObj.code=res.data.eventDto.code
          }          
          that.currentObj.title=res.data.title
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取系统当前班次带班领导姓名
    getOnduy(){
      getOnduy().then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.workScheduleInfo && res.data.workScheduleInfo.personList && res.data.workScheduleInfo.personList.length>0){
            let dutyList=res.data.workScheduleInfo.personList
            dutyList.map((item)=>{
              if(item.personRoleType==1){
                this.expressForm.signer=item.personName
              }
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //上传文件大小校验
    beforeUploadDocument(file){
      let isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return isLt10M;
    },
    //上传文件数量校验
    onExceedDocument(){
      this.$message.warning("最多可上传10个文件")
    },
    //上传文件
    uploadAvatar(item){
      this.imgLoading = true; // 打开加载效果
      const formData = new FormData();
      formData.append("file", item.file);
      batchUpload(formData).then(res => {
        this.imgLoading = false;
        if (res && res.code == "00000000") {
          if(res.data.length>0){
            res.data.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.url=item.fileFullPath
              unit.name=item.originalFileName
              this.fileList.push(unit)
              this.expressForm.sysAttachmentList.push(item)
            })
          }
        }else{
          this.$message.error("上传失败，请重新上传");
        }
      }).catch((error)=>{
        this.fileList=JSON.parse(JSON.stringify(this.fileList))
        this.imgLoading = false;
        console.log("上传接口报错=>",error)
      })
    },
    //移除文件
    onRemoveDocument(file){
      if(this.fileList.length>0){
        let curIndex=-1
        this.fileList.map((item, index)=>{
          if(item.name==file.name){
            curIndex=index
          }
        })
        if(curIndex>=0){
          this.fileList.splice(curIndex, 1)
        }
      }
      if(this.expressForm.sysAttachmentList.length>0){
        let eIndex=-1
        this.expressForm.sysAttachmentList.map((item, index)=>{
          if(item.name==file.name){
            eIndex=index
          }
        })
        if(eIndex>=0){
          this.expressForm.sysAttachmentList.splice(eIndex, 1)
        }
      }
    },
    //勾选简要描述
    changeBrief(){
      let that = this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(that.briefChecked){
            that.allSetReady=true            
            let type=that.commonType==1?"《值班信息》":"《要情快报》"
            that.expressForm.dutyWorkMattersEditDto.mattersDesc=`${that.currentObj.title}，${type}第${this.currentObj.code}号，${that.userInfo.userName}已编发。`
          }else{
            that.allSetReady=false
          }   
        }else{
          that.allSetReady=false
          that.briefChecked=false
        }
      })   
    },
    //返回
    backPre(){
      let that = this
      that.$alert('是否确定要返回？', '返回', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.$router.back(-1)
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    //保存/预览
    onSubmit(){
      if(this.expressForm.dutyWorkMattersEditDto.mattersDesc==""){
        this.$message({
          message: "简要描述不能为空",
          type: 'warning'
        })
        return
      }
      this.saveLoading=true
      let dutyWorkMattersEditDto={}
      dutyWorkMattersEditDto.handleStatus=this.expressForm.dutyWorkMattersEditDto.handleStatus
      dutyWorkMattersEditDto.mattersDesc=this.expressForm.dutyWorkMattersEditDto.mattersDesc
      dutyWorkMattersEditDto.uid=this.$route.query.banUid || null
      let params={
        code:this.expressForm.code,
        editTime:formatDate(this.expressForm.editTime),
        title:this.expressForm.title,
        content:this.expressForm.content,
        sysAttachmentList:this.expressForm.sysAttachmentList || null,
        agent:this.expressForm.agent,
        agentPhone:this.expressForm.agentPhone,
        editor:this.expressForm.editor,
        signer:this.expressForm.signer,
        remark:this.expressForm.remark || null,
        handleStatus:this.expressForm.handleStatus,
        mattersDesc:this.expressForm.mattersDesc,
        objUid:this.currentObj.uid || this.expressForm.objUid,
        receiptUnit:this.currentObj.receiptUnit || this.expressForm.receiptUnit,
        feedbackPerson:this.userInfo.uid,
        feedbackUnit:this.userInfo.rmsUnitDto.uid,
        dutyWorkMattersEditDto:dutyWorkMattersEditDto,
        uid:this.backfeedUid?this.backfeedUid:null
      }
      if(this.$route.query.formTxt && (this.$route.query.formTxt=="add" || this.$route.query.formTxt=="续办" )){
        postReceiveInstructionFeedback(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=5&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.reportDutyFeedbackUid=res.data
            this.openFullScreen()
          }else if(res && res.code=="10060007"){
            this.$alert(res.viewMsg, '提示', {
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              callback: action => {
                if(action==='confirm'){
                  this.getGenerateNo()
                }
                if(action==='cancel'){
                  return
                }
              }
            })
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }else if(this.$route.query.formTxt && this.$route.query.formTxt=="edit"){
        putFeedback(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=5&uid=' + this.$route.query.uid
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.reportDutyFeedbackUid=this.$route.query.uid
            this.openFullScreen()          
          }else if(res && res.code=="10060007"){
            this.$alert(res.viewMsg, '提示', {
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              callback: action => {
                if(action==='confirm'){
                  this.getGenerateNo()
                }
                if(action==='cancel'){
                  return
                }
              }
            })
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.back-content{
  width: 100%;
  height: calc(100% - 40px);
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px 40px 30px 40px;
  .form-content{
    .inline-form{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;  
      width: calc(70% + 30px);
      .address-detail{
        width: calc(100% - 660px);
      }
      .right-inline{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;  
      }
    }
    .check-style{
      position: absolute;
      top: 0px;
      left: -98px;
      z-index: 5;
    }
    .tip-req{
      color: #F56C6C;
      position: absolute;
      top: 0px;
      left: -78px;
      z-index: 5;
    }
  }
}
</style>
<style lang="scss">
.back-content{
  .inline-form{
    .el-form-item{
      width: calc(50% - 0px);
    }
    .el-form-item__content{
      margin-left: 0px !important;
      width: 75%;
    }
    .el-form-item{
      display: flex;
      flex-direction: row;
      align-items: center; 
    }
    .el-form-item__label{
      width: 100px !important;
      display: inline-block;
    }
    .el-date-editor.el-input{
      width: 100% !important;
    }
  }
  .upload-doc{
    position: relative;
    .el-upload__tip{
      color: #C3C9D8;
      position: absolute;
      top: -6px;
      left:140px;
      z-index: 10;
    }
  }
  .el-upload-list .el-upload-list__item{
    width: 20%;
  }
}
</style>