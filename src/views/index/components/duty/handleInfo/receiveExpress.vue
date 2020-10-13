
<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 值班信息批示.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="rece-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <div class="receive-info">
          <p class="receive-title">{{instructeInfo.title}}</p>
          <div class="receive-line">
              <span class="receive-code">编号：{{instructeInfo.code}}</span>
              <span class="receive-date">编发日期：{{instructeInfo.editTime}}</span>
          </div>
        </div>
        <div class="divide-line"></div>
        <div class="add-new-instructe">
          <span>相关批示</span>
          <i class="el-icon-circle-plus-outline" @click="showInstructe"></i>
        </div>
        <div class="common_table" style="margin-top:20px">
          <el-table ref="multipleTable" :data="instructeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column label="批示人" prop="instructionPerson" width="120"></el-table-column>
            <el-table-column label="批示内容" prop="instructionContent" show-overflow-tooltip></el-table-column>
            <el-table-column label="批示时间" prop="instructionTime" width="170"></el-table-column>
            <el-table-column label="录入人" prop="opUserId" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="录入时间" prop="createTime" width="170"></el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <span class="operation_btn" @click="edit(scope.row)">修改</span>
                <span class="operation_btn" @click="del(scope.row.uid)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div> 
        <div style="margin:40px 0px 40px 0px">
          <el-button @click="backPre">返回</el-button>
          <el-button type="primary" @click="leadMoveDown">批示下发</el-button>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog title="批示" :visible.sync="instructeVisible" v-if="instructeVisible" width="700px" :close-on-click-modal="false">
      <el-form :model="instructeForm" ref="instructeForm" :rules="instructeRule" label-width="100px">
        <div class="inline-form">          
          <el-form-item label="批示人" prop="instructionPerson">
            <el-input v-model="instructeForm.instructionPerson" maxlength="10" placeholder="请输入批示人姓名" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="批示时间" prop="instructionTime">
            <el-date-picker v-model="instructeForm.instructionTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="批示内容" prop="instructionContent">
          <el-input type="textarea" :rows="4" placeholder="请输入批示内容" maxlength="200" show-word-limit v-model="instructeForm.instructionContent" style="width:96%"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" size="small">
        <el-button @click="onCancle()">取 消</el-button>
        <el-button type="primary"  @click="onConfirm('instructeForm')" :loading="instructeLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { formatDate } from "@/utils/util.js";
import { getDutyDetail, postIssueInstruction, getInstructionPageList, putIssueInstruction, deleteIssueInstruction, getIssueInstructionDetail } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" },{ name: "接报值班信息", routerName: "receiveDutyInformation"}, { name: "值班信息批示" }],
      instructeInfo:{
        uid:"", 
        title:"",  
        code:"", 
        editTime:"",
        instructionType:1
      },
      instructeList:[],
      instructeForm:{
        uid:"",
        instructionPerson:"",
        instructionTime:"",
        instructionContent:"",
      },
      instructeRule:{
        instructionPerson:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        instructionTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        instructionContent:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      instructeVisible:false,
      instructeLoading:false,
      selectUid:null,
      selectName:"",
      dutyUid:"",
      receiveobjUid:"",
      transmitInfo:"",
      userInfo:null
    };
  },
  mounted() {
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    if(this.$route.query.fromTxt=="add"){
      this.dutyUid=this.$route.query.uid
      this.receiveobjUid=this.$route.query.uid
      this.getDutyDetail()
      this.getInstructionPageList()
    }else if(this.$route.query.fromTxt=="edit" || this.$route.query.fromTxt=="续办"){
     this.getIssueInstructionDetail(this.$route.query.uid)
    }
  },
  methods: {
    //获取编辑详情
    getIssueInstructionDetail(uid){
      let that = this
      let params={
        uid: uid
      }
      getIssueInstructionDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data.eventDto && res.data.eventDto.uid){
            that.dutyUid=res.data.eventDto.uid
            that.getDutyDetail()
            that.getInstructionPageList()
          }
          that.selectUid=JSON.stringify(res.data.instructionUids)
          res.data.title=that.$route.query.fromTxt=="续办"? `【续办】${res.data.title}`: res.data.title
          that.transmitInfo=JSON.stringify(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取值班信息详情
    getDutyDetail(){
      let that = this
      let params={
        uid: this.dutyUid
      }
      getDutyDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.instructeInfo.uid = res.data.uid
          that.instructeInfo.code = res.data.code
          that.instructeInfo.title = res.data.title
          that.instructeInfo.editTime = res.data.editTime
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取相关批示列表
    getInstructionPageList(){
      let that=this
      let listParams={
        "where.objUid":that.dutyUid,
        "pageSize":1000,
        "orderBy":"a.create_time"
      }
      getInstructionPageList(listParams).then((res)=>{
        if(res && res.code==="00000000") {
          that.instructeList=res.data.list
          if(that.transmitInfo && JSON.parse(that.transmitInfo)){
            let orderUid=JSON.parse(that.transmitInfo).instructionUids
            if(that.$route.query.fromTxt=="edit" && orderUid && orderUid.length>0){
              that.$nextTick(()=>{
                that.instructeList.map((item)=>{
                  orderUid.map((obj)=>{
                    if(item.uid==obj){
                      that.$refs.multipleTable.toggleRowSelection(item)
                    }
                  })
                })
              })
            }
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //多选框选择
    handleSelectionChange(v){
      this.selectUid=""
      this.selectName=""
      if(v && v.length>0){
        let ordList=[]
        v.map((item)=>{
          ordList.push(item.uid)
          this.selectName+=item.instructionPerson+"，"
        })
        this.selectUid=JSON.stringify(ordList)
        this.selectName=this.selectName.substring(0,this.selectName.length-1)
      }
    },
    //编辑相关批示
    edit(obj){
      this.instructeVisible=true
      this.instructeForm.uid = obj.uid
      this.receiveobjUid=obj.objUid
      this.instructeForm.instructionPerson = obj.instructionPerson
      this.instructeForm.instructionTime = obj.instructionTime.replace(/-/g, "/")
      this.instructeForm.instructionContent = obj.instructionContent
    },
    //删除相关批示
    del(uid){    
      let that = this      
      that.$alert('您确认要删除此信息吗？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            deleteIssueInstruction(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getInstructionPageList()
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            }) 
          }
          if(action==='cancel'){
            that.$message({
              type: 'info',
              message: '已取消'
            })
          }
        }
      })
    },
    //新增相关批示
    showInstructe(){
      this.instructeVisible=true
      this.instructeForm.uid = ""
      this.instructeForm.instructionPerson = ""
      this.instructeForm.instructionTime = ""
      this.instructeForm.instructionContent = ""
    },
    onCancle(){
      this.instructeVisible=false
    },
    //提交相关批示
    onConfirm(){
      let that = this
      that.$refs.instructeForm.validate(valid => {
        if(valid){ 
          this.instructeLoading=true         
          let params={
            "instructionContent":that.instructeForm.instructionContent,
            "instructionPerson":that.instructeForm.instructionPerson,
            "instructionTime":formatDate(that.instructeForm.instructionTime),
            "instructionType":1,
            "instructionUnit":that.userInfo.rmsUnitDto.uid,
            "objUid":that.receiveobjUid || that.dutyUid,
            "uid":that.instructeForm.uid?that.instructeForm.uid:null
          }
          if(that.instructeForm.uid){
            putIssueInstruction(params).then((res)=>{
              this.instructeLoading=false
              if(res && res.code==="00000000") {
                that.getInstructionPageList()
                that.instructeVisible=false
              }
            }).catch((error)=>{
              this.instructeLoading=false
              console.log("接口报错=>",error)
            })
          }else{
            postIssueInstruction(params).then((res)=>{
              this.instructeLoading=false
              if(res && res.code==="00000000") {
                that.getInstructionPageList()
                that.instructeVisible=false
              }
            }).catch((error)=>{
              this.instructeLoading=false
              console.log("接口报错=>",error)
            })
          }
        }else{          
          this.instructeLoading=false
        }
      })
    },
    //提交批示下发
    leadMoveDown(){
      if(this.selectUid && this.selectUid.length>1){
        this.$router.push({ name: "receiveAddExpress",query:{instructionUids:this.selectUid,selectName:this.selectName,eventDto: JSON.stringify(this.instructeInfo), transmitInfo:this.transmitInfo, banUid:this.$route.query.banUid || null} })
      }else{
        this.$message('请选择相关批示信息');
      }
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
  }
};
</script>

<style lang="scss" scoped>
.rece-content{
  width: 100%;
  height: calc(100% - 60px);
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px 40px;
  .receive-info{
    display: flex;
    flex-direction: column;
    .receive-title{
      font-size:24px;
      font-weight:bold;
      color: $font_333;
    }
    .receive-line{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 20px;
      .receive-code{
        font-size:14px;
        color: #003333; 
        margin-right: 80px;       
      }
      .receive-date{
        font-size:14px;
        color: #003333;         
      }      
    }
  }
  .add-new-instructe{
    display: flex;
    flex-direction: row;
    align-items: center;
    span{
      color: $font_333;
      margin-right: 10px;
    }
    i{
      font-size: 30px;
      color: $Secondary4_color;
      cursor: pointer;
    }
  }
}

.inline-form{
  display: flex;
  flex-direction: row;
  align-items: center;  
}
</style>