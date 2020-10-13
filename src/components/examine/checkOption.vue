<template>
  <div class="wrap">
    <div class="common-title">审批记录</div>
    <el-form ref="checkForm" :rules="checkRules" :model="checkData" label-width="80px" class="form-box">
      <el-form-item label="审批结论" prop="checkResult">
        <el-radio v-model="checkData.checkResult" label="1">通过</el-radio>
        <el-radio v-model="checkData.checkResult" label="2">不通过</el-radio>
      </el-form-item>
      <el-form-item label="事件类型" prop="eventType" v-if="checkData.checkResult=='1'">
        <el-select v-model="checkData.eventType" placeholder="请选择">
          <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件等级" prop="eventLevel" v-if="checkData.checkResult=='1'">
        <el-select v-model="checkData.eventLevel" placeholder="请选择">
          <el-option v-for="item in optionsGrade" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理单位" prop="handleUnit" v-if="checkData.checkResult=='1'">
        <el-select v-model="checkData.handleUnit" placeholder="请选择" >
          <el-option v-for="item in handleUnitOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="eventDesc" v-if="checkData.checkResult=='1'" class="event-desc">
        <el-input type="textarea" :rows="4" placeholder="可备注相关内容" maxlength="100" show-word-limit v-model="checkData.eventDesc" style="width:350px;"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="explain" v-if="checkData.checkResult=='2'">
        <el-input type="textarea" :rows="4" placeholder="可补充说明理由" maxlength="100" show-word-limit v-model="checkData.explain" style="width:350px;"></el-input>
      </el-form-item>
      <div class="option-btn">
        <el-button type="info" @click="cancelBack()">返回</el-button>
        <el-button type="primary" @click="confirmData('checkForm')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getHandleUnit, putApproveDetail } from "_api/eas/api.ps.js";
export default {
  props:["approveInfo", "checkInfo"],
  data(){
    return{
      checkData:{
        checkResult:"1",
        eventType:"",
        eventLevel:"",
        handleName:"",
        handleUnit:"",
        eventDesc:"",
        explain:""
      },
      checkRules:{
        checkResult:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        eventType:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        eventLevel:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        handleUnit:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        explain:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },      
      optionsType:[
        {
          value: 1,
          label: "自然灾害"
        },
        {
          value: 2,
          label: "事故灾难"
        },
        {
          value: 3,
          label: "社会安全"
        },
        {
          value: 4,
          label: "公共卫生"
        },
        {
          value: 9,
          label: "其他"
        }
      ],
      optionsGrade:[
        {
          value: 1,
          label: "Ⅰ级（特别重大）"
        },
        {
          value: 2,
          label: "Ⅱ级(重大)"
        },
        {
          value: 3,
          label: "Ⅲ级(较大)"
        },
        {
          value: 4,
          label: "Ⅳ级(一般)"
        },
      ],
      handleUnitOption:[]
    }
  },
  mounted(){
    this.getHandleUnit()
  },
  methods:{
    getHandleUnit(){
      getHandleUnit().then((res)=>{
        if(res && res.data && res.data.length>0){
          res.data.map((item)=>{
            let unit={}
            unit.value=item.unitId
            unit.label=item.unitName
            this.handleUnitOption.push(unit)
          })
        }
      })
    },
    confirmData(formName){
      if(this.checkData.checkResult=="1"){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.handleUnitOption.map((item)=>{
              if(item.value==this.checkData.handleUnit){
                this.checkData.handleName=item.label
              }
            })
            let params={
              "approveRemark": this.checkData.eventDesc,
              "approveResultFlag": 1,
              "approveTime": this.approveInfo.approveTime,
              "authUserId": this.approveInfo.authUserId,
              "createTime": this.approveInfo.createTime,
              "delFlag": this.approveInfo.delFlag,
              "eventLevel": this.checkData.eventLevel,
              "eventReceiveUid": this.approveInfo.eventReceiveUid,
              "eventType": this.checkData.eventType,
              "handleRemark": "",
              "handleUnitName": this.checkData.handleName,
              "handleUnitUid": this.checkData.handleUnit,
              "isRead": this.approveInfo.isRead,
              "opUserId": this.approveInfo.opUserId,
              "ownerGroupId": this.approveInfo.ownerGroupId,
              "ownerOrgId": this.approveInfo.ownerOrgId,
              "submitRemark": this.approveInfo.submitRemark,
              "submitToName": this.approveInfo.submitToName,
              "submitToPhone": this.approveInfo.submitToPhone,
              "submitToUid": this.approveInfo.submitToUid,
              "uid": this.approveInfo.uid,
              "updateTime": this.approveInfo.updateTime,
            }
            putApproveDetail(params).then((res)=>{
              if(res && res.code && res.code==="00000000"){
                this.$router.push({ name: "peApproval"})
                this.$message({
                  message: "操作成功",
                  type: 'success'
                })
              }else{
                return
              }
            }).catch(()=>{
              console.log("78787878787878")
            })
          }else{
            this.$message({
              message: "必填项有误！",
              type: 'error'
            })
          }
        })
      }else{
        this.$refs[formName].validate((valid) => {
          if(valid){
            let params={
              "approveRemark": this.checkData.explain,
              "approveResultFlag": 0,
              "approveTime": this.approveInfo.approveTime,
              "authUserId": this.approveInfo.authUserId,
              "createTime": this.approveInfo.createTime,
              "delFlag": this.approveInfo.delFlag,
              "eventReceiveUid": this.approveInfo.eventReceiveUid,
              "handleRemark": "",
              "isRead": this.approveInfo.isRead,
              "opUserId": this.approveInfo.opUserId,
              "ownerGroupId": this.approveInfo.ownerGroupId,
              "ownerOrgId": this.approveInfo.ownerOrgId,
              "submitRemark": this.approveInfo.submitRemark,
              "submitToName": this.approveInfo.submitToName,
              "submitToPhone": this.approveInfo.submitToPhone,
              "submitToUid": this.approveInfo.submitToUid,
              "uid": this.approveInfo.uid,
              "updateTime": this.approveInfo.updateTime,
            }
            putApproveDetail(params).then((res)=>{
              if(res && res.code && res.code==="00000000"){
                this.$router.push({ name: "peApproval"})
                this.$message({
                  message: "操作成功",
                  type: 'success'
                })
              }else{
                return
              }
            }).catch(()=>{
              console.log("78787878787878")
            })
          }else{
            this.$message({
              message: "必填项有误！",
              type: 'error'
            })
          }
        })
      }
    },
    cancelBack(){
      // this.$router.back(-1)
      this.$router.push({ name: "peApproval"})
    },
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  width: 100%;
  height: 100%;
  padding: 20px;
  .common-title{
    font-size:16px;
    color: #3776FF;
    margin-bottom: 18px;
    font-family:Microsoft YaHei;
    font-weight:bold;
  }
  .form-box{
    height: calc(100% - 21px);
    position: relative;
    padding-bottom: 80px;
    .option-btn{ 
      width: 100%;   
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 20px;
      left: 0;
    }
  }
}
</style>
<style lang="scss">
.event-desc{
  .el-form-item__error{
    display: none !important;
  }
  .el-textarea__inner{
    border-color: #C0C4CC !important;
  }
}
</style>