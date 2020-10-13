<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 新增批示下发.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="exp-content">
      <el-scrollbar  class="scorll" style="height:100%; width:100%">
        <el-form label-width="100px" :model="instructeInfo" ref="instructeInfo" :rules="instructeRule">
          <el-form-item label="编号">
            <span>{{instructeInfo.code}}</span>
          </el-form-item>
          <el-form-item label="发文日期" prop="releaseTime">
            <el-date-picker v-model="instructeInfo.releaseTime" placeholder="选择日期" style="width:70%" :disabled="allSetReady" :picker-options="pickerOptions1" type="datetime" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="文件标题" prop="title">
            <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="instructeInfo.title" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="报">
            <el-input type="text" placeholder="请输入人员" maxlength="100" v-model="instructeInfo.reportRecord" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="接收单位" prop="receiptUnits" class="inst-unit">
            <el-select v-model="instructeInfo.receiptUnits" style="width:70%" :disabled="allSetReady" multiple placeholder="下一级单位，可多选">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" :disabled="allSetReady"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="100" show-word-limit v-model="instructeInfo.remark" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
        </el-form>
        <div class="divide-line"></div>
        <el-form label-width="100px" class="form-content">
          <el-form-item label="简要描述" style="position:relative">
            <span style="color:#C3C9D8">请确认填写完所有内容再填写简要描述</span>
            <el-checkbox v-model="briefChecked" class="check-style" @change="changeBrief"></el-checkbox>
            <span class="tip-req">*</span>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="instructeInfo.handleStatus" v-if="allSetReady">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="instructeInfo.mattersDesc" style="width:70%" v-if="allSetReady"></el-input>
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
import { ajaxCtx } from '@/config/config.js';
import { querySortList, postSaveIssueInstruction, getGenerateNo, putIssueInstructionIssue, putSaveIssueInstruction } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" },{ name: "要情快报", routerName: "importantExpress"}, { name: "新增批示下发" }],
      instructeInfo:{
        code: "0", 
        releaseTime : "", 
        title: "",
        reportRecord: "",
        receiptUnits:"",
        remark:"",
        handleStatus:2,
        mattersDesc:""
      },
      instructeRule:{
        releaseTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        title:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        receiptUnits:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
      },
      briefChecked:false,
      showVisibleUnit:false,
      allSetReady:false,
      receiveUid:"",
      unitList:[],
      pickerOptions1: null,
      userInfo:null,
      eventDto:null,
      fullLoading:null,
      saveLoading:false,
      isPageOffice:false,
      sendDutyInstructionUid:null
    };
  },
  mounted() {
    this.instructeInfo.releaseTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取单位
    this.querySortList()
    //监听pageOffice关闭窗口事件
    //监听pageOffice要情快报下发事件
    window.sendDutyInstruction = ()=>{
      this.isPageOffice=true
      this.sendDutyInstructions()
    }
    window.closePageoffice = ()=>{
      if(!this.isPageOffice){
        this.closeFullScreen()
        this.isPageOffice=false
      }
    }
    //设置发文日期不早于编发日期
    if(this.$route.query && this.$route.query.eventDto){
      this.eventDto = JSON.parse(this.$route.query.eventDto)
      let editTime = new Date(this.eventDto.editTime).getTime()
      this.pickerOptions1= {
        disabledDate(time) {
          return time.getTime() <= editTime
        }
      }
    }
    if(this.$route.query.transmitInfo){
      let transmitInfo=JSON.parse(this.$route.query.transmitInfo)
      this.receiveUid=transmitInfo.uid
      this.instructeInfo.title=transmitInfo.title
      this.instructeInfo.remark=transmitInfo.remark
      this.instructeInfo.reportRecord=transmitInfo.reportRecord
      this.instructeInfo.releaseTime=transmitInfo.releaseTime.replace(/-/g, "/")
      this.instructeInfo.receiptUnits=transmitInfo.receiptUnits
      if(this.$route.query && this.$route.query.banUid){
        this.getGenerateNo()
      }else{
        this.instructeInfo.code=transmitInfo.eventDto.code
      }
    }else{
      this.getGenerateNo()
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
      this.$router.push({ name: "queryInstructHairdown", query:{refresh:true} });
    },
    //事件下发
    sendDutyInstructions(){
      let that = this
      that.fullLoading.close();
      that.$alert('您确认要下发此信息吗？', '下发', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:this.sendDutyInstructionUid
            }
            putIssueInstructionIssue(params).then((res)=>{
              if(res && res.code==="00000000"){
                this.$router.push({ name: "queryInstructHairdown", query:{refresh:true} })
              }
            }) 
          }
          if(action==='cancel'){
            this.$router.push({ name: "queryInstructHairdown", query:{refresh:true} });
          }
        }
      })
    },
    //获取编号
    getGenerateNo(){
      let that = this
      let params={
        type: 3
      }
      getGenerateNo(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.instructeInfo.code = parseInt(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取单位
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
              this.unitList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //勾选简要描述
    changeBrief(){
      let that = this
      that.$refs.instructeInfo.validate(valid => {
        if(valid){
          if(that.briefChecked){
            that.allSetReady=true
            if(that.instructeInfo.receiptUnits && that.instructeInfo.receiptUnits.length>1){
              that.instructeInfo.mattersDesc=`${that.instructeInfo.title}，${that.eventDto.title}${that.$route.query.selectName}批示，${that.userInfo.userName}发至各单位（未下发）`
            }else{
              let receiptNames=""
              this.unitList.map((item)=>{
                if(item.value==that.instructeInfo.receiptUnits[0]){
                  receiptNames=item.label
                }
              })
              that.instructeInfo.mattersDesc=`${that.instructeInfo.title}，${that.eventDto.title}${that.$route.query.selectName}批示，${that.userInfo.userName}发至"${receiptNames}（未下发）。`
            }
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
    //保存\预览
    onSubmit(){
      if(this.instructeInfo.mattersDesc==""){
        this.$message({
          message: "简要描述不能为空",
          type: 'warning'
        })
        return
      }
      this.saveLoading=true
      let dutyWorkMattersEditDto={}
      dutyWorkMattersEditDto.mattersDesc=this.instructeInfo.mattersDesc?this.instructeInfo.mattersDesc:null
      dutyWorkMattersEditDto.handleStatus=this.instructeInfo.handleStatus?this.instructeInfo.handleStatus:null
      dutyWorkMattersEditDto.uid=this.$route.query.banUid || null
      let params={
        uid:this.receiveUid?this.receiveUid:null,
        code: this.instructeInfo.code,
        releaseTime: this.instructeInfo.releaseTime.replace(/\//g, "-"),
        title: this.instructeInfo.title,
        reportRecord: this.instructeInfo.reportRecord || null,
        receiptUnits: this.instructeInfo.receiptUnits,
        remark: this.instructeInfo.remark || null,
        instructionUids: JSON.parse(this.$route.query.instructionUids),
        dutyWorkMattersEditDto:dutyWorkMattersEditDto,
        eventDto:this.eventDto
      }
      if(this.$route.query.transmitInfo && !this.$route.query.banUid){
        putSaveIssueInstruction(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=4&uid=' + JSON.parse(this.$route.query.transmitInfo).uid
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.sendDutyInstructionUid=JSON.parse(this.$route.query.transmitInfo).uid
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
      }else{
        postSaveIssueInstruction(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=4&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.sendDutyInstructionUid=res.data
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
.exp-content{
  width: 100%;
  height: calc(100% - 60px);
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px 40px;
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
  .check-style{
    position: absolute;
    top: 0px;
    left: -98px;
    z-index: 5;
  }
}
.form-content{
  .tip-req{
    color: #F56C6C;
    position: absolute;
    top: 0px;
    left: -78px;
    z-index: 5;
  }
}
</style>
<style lang="scss">
.exp-content{

}
</style>