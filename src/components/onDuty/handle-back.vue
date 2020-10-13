<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 退回组件.
-->
<template>
  <div>
    <el-dialog title="退回" :visible.sync="showHandleBack" width="40%" :close-on-click-modal="false" class="back-dialog" @close="callFunc">
      <el-form label-width="68px" class="back-top">
        <el-form-item label="退回原因">
          <el-input type="textarea" :rows="4" placeholder="请输入退回原因" maxlength="200" show-word-limit v-model="backContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checkedBack" class="back-check">列入常见退回选项</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="divide-line" style="margin-top:30px;margin-bottom:30px"></div>
      <p class="back-p">常见退回选项</p>
      <div class="history-content">        
        <el-scrollbar style="width:100%;height:100%;">
          <div class="back-history-content">
            <span v-for="(item, index) in backHistoryList" :key="index+666" @click="handleHistory(item, index)" :class="indexHistory==index?'his-active':''">{{item}}</span>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" size="small">
        <el-button @click="callFunc()">取 消</el-button>
        <el-button type="primary"  @click="onConfirm" :loading="backLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCommonCauses } from "@/views/index/api/onDuty/api.ps.js";
export default {
  name: 'handle-back',
  props:{
    backBeatId:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      showHandleBack:true,
      backVisible:false,
      backLoading:false,
      checkedBack:false,
      backContent:"",
      backHistoryList: [],
      indexHistory:-1
    }
  },
  mounted(){
    if(this.backBeatId){
      //获取历史提交记录
      getCommonCauses().then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.length>0){
            this.backHistoryList=res.data
          }          
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    }
  },
  methods:{
    //取消/关闭
    callFunc(){
      this.$emit("handleBackClose")
    },
    //选择历史记录作为提交信息
    handleHistory(item, i){
      this.indexHistory=i
      this.backContent=item
    },
    //退回的保存
    onConfirm(){
      this.$emit("handleConfirm",{backContent: this.backContent, isCommon: this.checkedBack? 1: 0})
    },
  }
}
</script>
<style lang="scss" scoped>
.back-dialog{
  .back-top{
    .back-check{
      color: #222222;
    }
  }
  .back-p{
    color: $font_333;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .history-content{
      width: 100%;
      height: 200px;
      padding: 10px 0px;
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
      padding-right: 0px;
    }
    .back-history-content{
      display: flex;
      flex-direction: column;
      span{
        line-height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        color: $font_666;
        margin-bottom: 10px;
        background-color: #F4F6FB;
        border-radius: 6px;
        cursor: pointer;
      }
      span:hover{
        background-color: $Secondary4_color;
        color: #ffffff;
      }
      .his-active{
        background-color: $Secondary4_color;
        color: #ffffff; 
      }
    }

  }
}
</style>
<style lang="scss">
.back-dialog{
  .el-dialog{
    border-radius: 15px;
  }
  .el-dialog__header{
    padding: 20px 40px 10px;
  }
  .el-dialog__body{
    padding:  20px 40px 30px 40px;
    .el-form-item{
      margin-bottom: 10px;
    }
  }
  .el-dialog__footer{
    padding: 10px 40px 20px;
  }
  .el-dialog__headerbtn{
    top: 30px;
    right: 40px;
  }
}
</style>
