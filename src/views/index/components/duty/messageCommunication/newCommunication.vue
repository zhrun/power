<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 新增来文拟办.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="commun-content">
      <el-scrollbar  class="scorll" style="height:100%; width:100%">
        <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="100px" class="form-content">
          <div class="inline-form">
            <el-form-item label="编号">
              <el-input type="text" placeholder="可备注相关内容" v-model="expressForm.code" :disabled="allSetReady" readonly></el-input>
            </el-form-item>
            <el-form-item label="来文时间" prop="happenTime" class="right-inline">
              <el-date-picker v-model="expressForm.happenTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="来文时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
          </div>  
          <el-form-item label="来文单位" prop="originUnitName" class="inst-unit">
            <el-select v-model="expressForm.originUnitName" placeholder="请选择" style="width:70%" :disabled="allSetReady" @change="selectUnit">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" :disabled="allSetReady"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来文标题" prop="title">
            <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.title" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="内容摘要" prop="summary">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.summary" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="拟办意见" prop="suggestion">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.suggestion" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <div class="inline-form">
            <el-form-item label="承办人" prop="undertake">
              <el-input type="text" maxlength="10" v-model="expressForm.undertake" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="principal" class="right-inline">
              <el-input type="text" maxlength="10" v-model="expressForm.principal" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" maxlength="100" show-word-limit v-model="expressForm.remark" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
        </el-form>
        <div class="divide-line"></div>
        <el-form label-width="100px" class="form-content">
          <el-form-item label="简要描述" style="position:relative;margin-bottom:0px;">
            <span style="color:#C3C9D8">请确认填写完所有内容再填写简要描述</span>
            <el-checkbox v-model="briefChecked" class="check-style" @change="changeBrief"></el-checkbox>
            <span class="tip-req">*</span>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;" v-if="allSetReady">
            <el-radio-group v-model="expressForm.dutyWorkMattersInfo.handleStatus">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="allSetReady">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.dutyWorkMattersInfo.mattersDesc" style="width:70%"></el-input>
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
import visBreadcrumb from "_com/breadcrumb.vue"
import { formatDate } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { queryzbPageList,getDutyHandleDetails,postDutyHandle,putDutyHandle,getGenerateNo,putReceiveNoticeHandle } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "文电拟办" },{ name: "来文拟办", routerName: "proposedCommunication"}, { name: "新增来文拟办" }],
      expressForm:{
        uid:"",
        code:0,
        happenTime:null,
        originUnitName:"",
        originUnit:"",
        title:"",
        summary:"",
        suggestion:"",
        undertake:"",
        principal:"",
        remark:"",
        dutyWorkMattersInfo:{
          handleStatus:2,
          mattersDesc:"",
          mattersSourceType:51
        }
      },
      expressRule:{
        happenTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        originUnitName:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        title:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        summary:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        suggestion:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        undertake:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        principal:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      briefChecked:false,
      allSetReady:false,
      unitList:[],
      userInfo:null,
      objUid:null,
      saveLoading:false,
      isXuban:false,
      fullLoading:null
    };
  },
  mounted() {
    this.expressForm.happenTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    //获取所有单位
    this.queryzbPageList()
    if(this.$route.query.fromTxt=="add"){
      this.getGenerateNo()
    }else if(this.$route.query.fromTxt=="edit"){
      this.expressForm.dutyWorkMattersInfo.mattersSourceType=52
      this.breadcrumbData=[{ name: "文电拟办" },{ name: "来文拟办", routerName: "proposedCommunication"}, { name: "编辑来文拟办" }]
      this.getDutyHandleDetails()
    }else if(this.$route.query.fromTxt=="续办"){
      this.isXuban=true
      this.getGenerateNo()
      this.getDutyHandleDetails()
    }else if(this.$route.query.fromTxt=="updateEdit" || this.$route.query.fromTxt=="noticeEdit" ){
      this.getGenerateNo()
      if(this.$route.query.objUid){
        this.objUid=this.$route.query.objUid
      }
      if(this.$route.query.happenTime){
        this.expressForm.happenTime=this.$route.query.happenTime.replace(/-/g, "/")
      }
      this.expressForm.originUnitName=this.userInfo.rmsUnitDto.parentUnitName?this.userInfo.rmsUnitDto.parentUnitName:""
      this.expressForm.originUnit=this.userInfo.rmsUnitDto.parentUid?this.userInfo.rmsUnitDto.parentUid:""
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
      this.$router.push({ name: "proposedCommunication", query:{refresh:true} })
    },
    //获取编号
    getGenerateNo(){
      let that = this
      let params={
        type: 5
      }
      getGenerateNo(params).then((res)=>{
        if(res && res.data) {
          that.expressForm.code = parseInt(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取所有单位
    queryzbPageList(){
      let params={
        "where.unitType":1
      }
      queryzbPageList(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.list && res.data.list.length>0){
            res.data.list.map((item)=>{
              let unit={}
              unit.label=item.unitName
              unit.value=item.uid
              this.unitList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取详情
    getDutyHandleDetails(){
      let that = this
      let params={
        uid:that.$route.query.uid
      }
      getDutyHandleDetails(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.uid=that.isXuban?null:res.data.uid
          that.expressForm.code=that.isXuban?that.expressForm.code:res.data.code
          that.expressForm.happenTime=res.data.happenTime.replace(/-/g, "/")
          that.expressForm.title=that.isXuban?`【续办】${res.data.title}`:res.data.title
          that.expressForm.summary=res.data.summary
          that.expressForm.suggestion=res.data.suggestion
          that.expressForm.undertake=res.data.undertake
          that.expressForm.principal=res.data.principal
          that.expressForm.remark=res.data.remark
          that.expressForm.originUnitName=res.data.originUnitName
          that.expressForm.originUnit=res.data.originUnit
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    selectUnit(v){
      this.unitList.map((item)=>{
        if(item.value==v){
          this.expressForm.originUnit=item.value
          this.expressForm.originUnitName=item.label
        }
      })
    },
    //勾选简要描述
    changeBrief(){
      let that = this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(that.briefChecked){
            that.allSetReady=true
            this.expressForm.dutyWorkMattersInfo.mattersDesc=`${this.expressForm.undertake}承办${this.expressForm.originUnitName}第${this.expressForm.code}号`
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
            this.$router.push({ name: "proposedCommunication" })
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    //保存/预览
    onSubmit(){
      if(this.expressForm.dutyWorkMattersInfo.mattersDesc==""){
        this.$message({
          message: "简要描述不能为空",
          type: 'warning'
        })
        return
      }
      this.saveLoading=true
      let dutyWorkMattersInfo={}
      dutyWorkMattersInfo.handleStatus=this.expressForm.dutyWorkMattersInfo.handleStatus
      dutyWorkMattersInfo.mattersDesc=this.expressForm.dutyWorkMattersInfo.mattersDesc
      dutyWorkMattersInfo.mattersSourceType=this.expressForm.dutyWorkMattersInfo.mattersSourceType
      dutyWorkMattersInfo.uid=this.$route.query.banUid || null
      let sourceType=3
      if(this.$route.query.fromTxt=="add" || this.$route.query.fromTxt=="edit" || this.$route.query.fromTxt=="续办"){
        sourceType=3
      }else if(this.$route.query.fromTxt=="updateEdit"){
        sourceType=1
      }else if(this.$route.query.fromTxt=="noticeEdit"){
        sourceType=2
      }
      let params={
        uid: this.expressForm.uid?this.expressForm.uid:null,
        code: this.expressForm.code,
        happenTime: formatDate(this.expressForm.happenTime),
        originUnit: this.expressForm.originUnit,
        originUnitName: this.expressForm.originUnitName,
        title: this.expressForm.title,
        summary: this.expressForm.summary,
        suggestion: this.expressForm.suggestion,
        undertake: this.expressForm.undertake,
        principal: this.expressForm.principal,
        remark: this.expressForm.remark,
        dutyWorkMattersInfo: dutyWorkMattersInfo,
        objUid:this.objUid?this.objUid:null,
        infoType:1,
        sourceType:sourceType,
      }
      if(this.$route.query.fromTxt=="add" || this.$route.query.fromTxt=="updateEdit" || this.$route.query.fromTxt=="noticeEdit" || this.$route.query.fromTxt=="续办"){
        postDutyHandle(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            if(this.$route.query.fromTxt=="noticeEdit"){
              this.putReceiveNoticeHandle()
            }            
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=7&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
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
      }else if(this.$route.query.fromTxt=="edit"){
        putDutyHandle(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=7&uid=' + this.$route.query.uid
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
            this.openFullScreen()
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }
    },
    putReceiveNoticeHandle(){
      let params={
        uid:this.objUid
      }
      putReceiveNoticeHandle(params).then((res)=>{
        if(res && res.code==="00000000") {
          console.log("办理接口=>",res)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.commun-content{
  width: 100%;
  height: calc(100% - 60px);
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
    .inst-unit{
      position: relative;
      i{
        position: absolute;
        top: 5px;
        right: 26%;
        font-size: 30px;
        color: $Secondary4_color;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.commun-content{
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