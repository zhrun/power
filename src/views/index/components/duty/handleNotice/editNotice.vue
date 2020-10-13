<!--/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:50:14 
 * @Last Modified by:   zhou.run 
 * @Last Modified time: 2020-07-07 10:50:14 
 */
  新增通知公告 
 -->


<template>
  <div class="addNotice">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="exp-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <el-form label-width="100px" :model="instructeInfo" ref="instructeInfo" :rules="instructeRule">
          <el-row class="widthadd">
            <div  class="widthadd70">
              <el-col :span="8">
                <el-form-item label="编号">
                  <span>{{instructeInfo.code}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="有效期限" prop="releaseTime">
                  <el-date-picker
                      v-model="instructeInfo.releaseTime"
                      type="daterange"
                      range-separator="-"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" style="width:100%" :disabled="allSetReady">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </div>
            
          </el-row>
         
          
          <el-form-item label="通知标题" prop="title">
            <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="instructeInfo.title" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="接收单位" prop="receiptNames" class="inst-unit">
            <el-input type="text" placeholder="请选择接收单位" v-model="instructeInfo.receiptNames" style="width:70%" :disabled="allSetReady"></el-input>
            <i class="el-icon-circle-plus-outline" @click="showUnit" :style="allSetReady?'color:#999999':''"></i>
          </el-form-item>
          <el-form-item label="通知附件" v-loading="imgLoading">
            <el-upload class="upload-doc" action="#" :before-upload="beforeUploadDocument" :on-exceed="onExceedDocument" :http-request="uploadAvatar" :on-remove="onRemoveDocument"  :limit="10" :file-list="fileList" :disabled="allSetReady" :before-remove="beforeRemoveFile" :accept="acceptFile">
              <el-button size="small" icon="el-icon-paperclip" :disabled="allSetReady">点击上传文件</el-button>
              <div slot="tip" class="el-upload__tip">附件不得大于200MB</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="发布人" prop="publisher">
            <el-input type="text" placeholder="请输入人员" maxlength="10" v-model="instructeInfo.publisher" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input type="text" placeholder="请输入人员" maxlength="10" v-model="instructeInfo.principal" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" placeholder="请输入备注" maxlength="100" show-word-limit v-model="instructeInfo.remark" style="width:70%" :disabled="allSetReady"></el-input>
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
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="instructeInfo.matterDesc" style="width:70%" v-if="allSetReady"></el-input>
          </el-form-item>
          <div style="margin:40px 0px 40px 100px">
            <el-button @click="backPre">返回</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="!allSetReady">保存/预览</el-button>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <select-unitnew v-if="showVisibleUnit" :unitList="unitList" @selectUnitClose="selectUnitClose"    @selectUnitConfirm="selectUnitConfirm" ></select-unitnew>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import selectUnitnew from "_com/onDuty/selectUnitnew.vue";
import { formatDate } from "@/utils/util.js";
import { querySortList} from "@/views/index/api/onDuty/api.ps.js";
import { putNotice,getNoticeDetail,batchUpload} from "@/views/index/api/onDuty/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb, selectUnitnew },
  data() {
    return {
      breadcrumbData: [{ name: "通知公告" },{ name: "下发通知公告", routerName: "issueNotice"}, { name: "编辑通知公告" }],
      imgLoading:false,
      acceptFile:'.jpg,.gif,.png,.mp4,.mp3,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf',
      objdata:null,
      fileList:[],
      instructeInfo:{
        code: "0", 
        releaseTime : "", 
        title: "",
        receiptNames:"",
        receiptUnits:"",
        remark:"",
        handleStatus:2,
        matterDesc:"",
        publisher:'', //发布人
        principal:'',  //负责人
        sysAttachmentList:[]
      },
      instructeRule:{
        releaseTime:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        title:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        receiptNames:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        publisher:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        principal:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
      },
      briefChecked:false,
      showVisibleUnit:false,
      allSetReady:false,
      receiveUid:"",
      unitList:[],
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{}
    };
  },
  mounted() {
    
    let uid = this.$route.query.uid
    this.getNoticeDetail({
      uid:uid
    })
  },
  methods: {
    //当转下发时，带入部分信息,查上级公告详情
    getNoticeDetail(data){
      getNoticeDetail(data).then(res=>{
        if(res && res.code==="00000000"){
          // this.objdata
          this.objdata = res.data
          this.instructeInfo.releaseTime =  [formatDate(this.objdata.effectiveStartTime, "yyyy-MM-dd"), formatDate(this.objdata.effectiveEndTime, "yyyy-MM-dd")]
          let obj = this.objdata
          obj.sysAttachmentList && obj.sysAttachmentList.forEach((el,j)=>{
            this.fileList.push({
              name:el.originalFileName,
              uid:j,
              url:el.fileFullPath,
            })
          })
          this.instructeInfo={
              code: obj.code, 
              releaseTime :  [formatDate(obj.effectiveStartTime, "yyyy-MM-dd"), formatDate(obj.effectiveEndTime, "yyyy-MM-dd")], 
              title: obj.title,
              receiptNames:"",
              receiptUnits:[],
              remark:obj.remark,
              handleStatus:2,
              matterDesc:"",
              publisher:obj.publisher, //发布人
              principal:obj.principal,  //负责人
              sysAttachmentList:obj.sysAttachmentList,
              uid:obj.uid
            }
          this.querySortList()
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    //删除文件列表时，删除相应的提交数据表单
    beforeRemoveFile(file){
      let index = this.instructeInfo.sysAttachmentList.findIndex(el=>(el.originalFileName == file.name && el.fileFullPath == file.url))
       this.instructeInfo.sysAttachmentList.splice(index,1)
    },
     //上传文件时大小控制
    beforeUploadDocument(file){
      let isLt10M = file.size / 1024 / 1024 < 200;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      return isLt10M;
    },
     //上传文件时数量控制
    onExceedDocument(){
      this.$message.warning("最多可上传10个文件")
    },
    //文件上传提交到后端
    uploadAvatar(item){
      this.imgLoading = true; // 打开加载效果
      const formData = new FormData();
      formData.append("file", item.file);
      batchUpload(formData).then(res => {
        this.imgLoading = false;
        if (res && res.code == "00000000") {
          if(res.data.length>0){
            res.data.map((item,index)=>{
              let unit={}
              //判断是否为IE浏览器的文件名，IE浏览器下文件名会带有盘符信息
                // Check for Unix-style path
              let unixSep = item.originalFileName.lastIndexOf('/');
              // Check for Windows-style path
              let winSep = item.originalFileName.lastIndexOf('\\');
              // Cut off at latest possible point
              let pos = (winSep > unixSep ? winSep : unixSep);
              if (pos != -1)  {
                  // Any sort of path separator found...
                  item.originalFileName = item.originalFileName.substring(pos + 1);
              }
              unit.uid=index
              unit.url=item.fileFullPath
              unit.name=item.originalFileName
              this.fileList.push(unit)
              this.instructeInfo.sysAttachmentList.push(item)
            })
          }
        }else{          
          this.$message.error("上传失败，请重新上传");
        }
      }).catch(()=>{
        this.imgLoading = false;
        if(this.fileList.length==0){
          this.fileList = []
        }else{
          let ars = JSON.stringify(this.fileList)
          this.fileList = JSON.parse(ars)
        }
      })
    },
    //删除文件列表时的相关操作
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
      if(this.instructeInfo.sysAttachmentList.length>0){
        let eIndex=-1
        this.instructeInfo.sysAttachmentList.map((item, index)=>{
          if(item.name==file.name){
            eIndex=index
          }
        })
        if(eIndex>=0){
          this.instructeInfo.sysAttachmentList.splice(eIndex, 1)
        }
      }
    },
    //查询当前单位下的下级单位
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
              unit.unitName=item.unitName
              unit.uid=item.uid
              unit.unitChecked=false
              this.unitList.push(unit)
            })
            let obj = this.objdata , names = [];
            obj.dutyNoticeSendDtoList && obj.dutyNoticeSendDtoList.map(el=>{
              let d = el.receiptUnit
              let a  = this.unitList.findIndex(o=>o.uid == d)
              if(a!=-1){
                this.unitList[a].unitChecked = true
                names.push(this.unitList[a].unitName)
                this.instructeInfo.receiptUnits.push(this.unitList[a].uid)
              }
            })
            this.instructeInfo.receiptNames = names.toString()
            
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //打开下级单位列表
    showUnit(){
      if(!this.allSetReady){
        this.showVisibleUnit=true
      }      
    },
    //关闭下级单位列表 弹层
    selectUnitClose(){
      this.showVisibleUnit=false
    },
     //取消选中下级单位
    // selectorderUnit(v){
    //   this.unitList[v.index].unitChecked=false
    // },
    //确认选中下级单位
    selectUnitConfirm(v){
      let ids = v.uids
      this.unitList.map((item)=>{
        if(ids.indexOf(item.uid)!=-1){
          item.unitChecked = true
        }
      })
      this.instructeInfo.receiptNames=v.names
      this.instructeInfo.receiptUnits=v.uids
      this.showVisibleUnit=false
    },
    //提交前确认填写数据，并生成自动方案内容
    changeBrief(){
      let that = this
      that.$refs.instructeInfo.validate(valid => {
        if(valid){
          if(that.briefChecked){
            this.instructeInfo.matterDesc=`${this.instructeInfo.title}，《通知公告》第${this.instructeInfo.code}号，${this.userInfo.userName}已编发。`
            that.allSetReady=true
          }else{
            that.allSetReady=false
          }   
        }else{
          that.allSetReady=false
          that.briefChecked=false
        }
      })   
    },
    //返回上一页
    backPre(){
      this.$confirm('是否确定要返回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$router.back(-1)
      }).catch((e) => {
        console.log('e',e);
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //提交修改公告
    onSubmit(){
      let params={
        effectiveEndTime: this.instructeInfo.releaseTime[1] + " 23:59:59",
        effectiveStartTime: this.instructeInfo.releaseTime[0] + " 00:00:00",
        // handleStatus:this.instructeInfo.handleStatus,
        // matterDesc:this.instructeInfo.matterDesc,
        noticeNo: this.instructeInfo.code,
        principal: this.instructeInfo.principal,
        publisher: this.instructeInfo.publisher,
        receiptUnit: this.instructeInfo.receiptUnits,
        remark: this.instructeInfo.remark,
        sysAttachmentList:this.instructeInfo.sysAttachmentList,
        title: this.instructeInfo.title,
        uid:this.objdata.uid,
        dutyWorkMattersEditDto:{}
      }
      params.dutyWorkMattersEditDto.mattersDesc=this.instructeInfo.matterDesc,
      params.dutyWorkMattersEditDto.handleStatus=this.instructeInfo.handleStatus
      putNotice(params).then((res)=>{
        if(res && res.code==="00000000") {
          // let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=6&uid=' + this.objdata.uid
          // POBrowser.openWindowModeless(objStr,'width=1200px;height=800px;')  
          this.$message({
            type:'success',
            message:'编辑成功'
          })
          // localStorage.removeItem(uid)
          this.$router.push({ name: "issueNotice" ,params:{uid:this.objdata.uid}});
          // this.$router.push({ name: "issueNotice" ,});
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.widthadd{
  width: calc(100% - 100px);
}
.widthadd70{
  width: calc(70% + 100px);
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