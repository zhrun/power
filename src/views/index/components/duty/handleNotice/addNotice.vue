<!-- 
新增通知公告 
/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:45:41 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-08-05 20:00:55
 */
-->

<template>
  <div class="addNotice">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="exp-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <el-form label-width="100px" :model="instructeInfo" ref="instructeInfo" :rules="instructeRule">
          <el-row class="widthadd">
            <div  class="widthadd70">
              <el-col :span="12">
                <el-form-item label="编号">
                  <span>{{instructeInfo.code}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期限" prop="releaseTime">
                  <el-date-picker
                      v-model="instructeInfo.releaseTime"
                      type="daterange"
                      range-separator="-"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" style="width:100%;" :disabled="allSetReady">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </div>
            
          </el-row>
         
          
          <el-form-item label="通知标题" prop="title">
            <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="instructeInfo.title" style="width:70%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="接收单位" prop="receiptUnits" class="inst-unit">
            <!-- <el-input type="text" placeholder="请选择接收单位"  v-model="instructeInfo.receiptNames" style="width:70%" :disabled="allSetReady"></el-input> -->
            <el-select v-model="instructeInfo.receiptUnits" style="width:70%" :disabled="allSetReady" multiple placeholder="请选择接收单位" @change="changeItem">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-circle-plus" @click="showUnit" :style="allSetReady?'color:#999999':''"></i>
          </el-form-item>
          <el-form-item label="通知附件" v-loading="imgLoading">
            <el-upload class="upload-doc" action="#" :before-upload="beforeUploadDocument" :on-exceed="onExceedDocument" :http-request="uploadAvatar" :on-remove="onRemoveDocument"  :limit="10" :file-list="fileList" :disabled="allSetReady" :before-remove="beforeRemoveFile"  :accept="acceptFile" :list-type="acceptFile" >
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
    <select-unit v-if="showVisibleUnit" :unitList="unitList" @selectUnitClose="selectUnitClose" @selectorderUnit="selectorderUnit" @selectUnitConfirm="selectUnitConfirm" @selectAll="selectAll"></select-unit>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import selectUnit from "_com/onDuty/select-unit.vue";
import { formatDate } from "@/utils/util.js";
import { querySortList,getGenerateNo} from "@/views/index/api/onDuty/api.ps.js";
import { addNotice,getNoticeDetail,batchUpload} from "@/views/index/api/onDuty/api.zr.js";

export default {
  components: { visBreadcrumb, selectUnit },
  data() {
    return {
      breadcrumbData: [{ name: "通知公告" },{ name: "下发通知公告", routerName: "issueNotice"}, { name: "新增通知公告" }],
      imgLoading:false,
      acceptFile:'.jpg,.gif,.png,.mp4,.mp3,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf',
      userInfo:null,
      fileList:[],
      instructeInfo:{
        code: null, 
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
        receiptUnits:[
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
      options:[],
      detailData:null,
      newUid:null,
      newCode:null,
      objdata:null,
      str:'',
    };
  },
  mounted() {
    
    let uid = this.$route.query.uid
    if(this.$route.query.recorduid){
      this.getEventDetail({
        uid:this.$route.query.eventUid
      })
    }
    if(!uid){
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 10);
      this.instructeInfo.releaseTime =  [formatDate(start, "yyyy-MM-dd"), formatDate(end, "yyyy-MM-dd")]
    }else{
      this.getNoticeDetail({
        uid:uid
      })
    }
    this.getGenerateNo({
      type:6
    })
    if(localStorage.getItem("vis_user_info")){
      this.userInfo=JSON.parse(localStorage.getItem("vis_user_info"))
    }
    this.querySortList()
    this.instructeInfo.publisher = this.userInfo.userName
  },
  methods: {
    getEventDetail(d){
      getNoticeDetail(d).then(res=>{
        if(res && res.code==="00000000"){
         this.instructeInfo.title='【续办】'+res.data.title
          let obj = res.data
          this.objdata = obj
         this.instructeInfo.releaseTime =  [formatDate(obj.effectiveStartTime, "yyyy-MM-dd"), formatDate(obj.effectiveEndTime, "yyyy-MM-dd")]
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
              // handleStatus:2,
              // matterDesc:"",
              publisher:obj.publisher, //发布人
              principal:obj.principal,  //负责人
              sysAttachmentList:obj.sysAttachmentList,
              // uid:obj.uid
            }
            this.querySortList()
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    changeItem(v){
      this.unitList.map(el=>{
        if(v.indexOf(el.uid)!=-1){
          el.unitChecked = true
        }else{
          el.unitChecked = false
        }
      })
    },
    //删除上传的文件前处理方法
    beforeRemoveFile(file){
      let index = this.instructeInfo.sysAttachmentList.findIndex(el=>(el.originalFileName == file.name && el.fileFullPath == file.url))
      this.instructeInfo.sysAttachmentList.splice(index,1)
    },
    //当转下发时，带入部分信息,查上级公告详情
    getNoticeDetail(data){
      getNoticeDetail(data).then(res=>{
        if(res && res.code==="00000000"){
          this.detailData = res.data
          this.instructeInfo.title = res.data.title
          this.instructeInfo.releaseTime = [res.data.effectiveStartTime.substr(0,10),res.data.effectiveEndTime.substr(0,10)]
          this.instructeInfo.publisher = res.data.publisher
          this.instructeInfo.principal = res.data.principal
          this.instructeInfo.remark = res.data.remark
          this.instructeInfo.sysAttachmentList = res.data.sysAttachmentList
          res.data.sysAttachmentList.forEach((el,j)=>{
            this.fileList.push({
              uid:j,
              url:el.fileFullPath,
              name:el.originalFileName
            })
          })
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    //生成编号
    async getGenerateNo(d){
     await getGenerateNo(d).then(res=>{
        if(res && res.code === '00000000'){
          if(!this.instructeInfo.code){
            this.instructeInfo.code= res.data
          }else{
            this.newCode = res.data
            this.str=`编号${this.instructeInfo.code}已存在，是否确定更新为${this.newCode}再提交'`
              //编号N已存在，是否确定更新为M再提交 
            let str= this.str
            this.$confirm(str, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.instructeInfo.matterDesc=`${this.instructeInfo.title}，《通知公告》第${this.newCode}号，${this.userInfo.userName}已编发。`
              this.instructeInfo.code= this.newCode
              this.onSubmit()
              
            }).catch((e) => {
              console.log('e',e);
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
          }
        }
      }).catch(er=>{
        console.error(er);
      })
    },
    //上传文件时大小控制
    beforeUploadDocument(file){
      let isLt10M = file.size / 1024 / 1024 < 200;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      let testmsg=file.name.substring(file.name.lastIndexOf('.')+1) 
      const extension = this.acceptFile.indexOf(testmsg)           
      // const isLt2M = file.size / 1024 / 1024 < 10            
     if(extension==-1) {                
         this.$message({                    
             message: '请上传正确文件格式!',                    
            type: 'warning'               
        });            
     }
      return (isLt10M && extension!=-1);
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
              console.log(this.fileList);
              console.log(item);
              
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
      //查询操作文件，并在列表内删除当前文件
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
      //在提交的表单数据内查询当前文件，并删除文件
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
              this.options.push({
                value:item.uid,
                label:item.unitName
              })
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
    selectorderUnit(v){
      this.unitList[v.index].unitChecked=false
    },
    //确认选中下级单位
    selectUnitConfirm(v){
      this.instructeInfo.receiptNames=v.names
      this.instructeInfo.receiptUnits=v.uids
      this.showVisibleUnit=false
    },
    //全选下级单位
    selectAll(v){
      if(v){
        this.unitList.map((obj)=>{
          obj.unitChecked=true
        })
      }else{
        this.unitList.map((obj)=>{
          obj.unitChecked=false
        })
      }
    },
    //确认填写数据，并生成自动方案内容
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
    //提交新添公告
    onSubmit(){
      let params={
        noticeNo: this.instructeInfo.code,
        effectiveStartTime: this.instructeInfo.releaseTime[0] + " 00:00:00",
        effectiveEndTime: this.instructeInfo.releaseTime[1] + " 23:59:59",
        title: this.instructeInfo.title,
        publisher: this.instructeInfo.publisher,
        principal: this.instructeInfo.principal,
        receiptUnit: this.instructeInfo.receiptUnits,
        remark: this.instructeInfo.remark,
        sysAttachmentList:this.instructeInfo.sysAttachmentList,
        dutyWorkMattersEditDto:{}
      }
      params.dutyWorkMattersEditDto['mattersDesc']=this.instructeInfo.matterDesc,
      params.dutyWorkMattersEditDto['handleStatus']=this.instructeInfo.handleStatus
      params.dutyWorkMattersEditDto.uid=this.$route.query.recorduid?this.$route.query.recorduid:null
      addNotice(params).then((res)=>{
        if(res && res.code==="00000000") {
         
          this.$router.push({ name: "issueNotice" ,params:{uid:res.data}});
        }else if(res.code == '10060007'){
          this.getGenerateNo({ type:6 })
          //编号重复，更新编号再提交 
         
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