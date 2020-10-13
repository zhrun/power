<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 选择单位组件.
-->
<template>
  <div>
    <el-dialog title="选择" :visible.sync="showSelectUnit" width="800px" :close-on-click-modal="false" @close="callFunc" class="unit-dialog">
      <div class="unit-box">
        <div class="unit-left">
          <div class="com-content">            
            <el-scrollbar class="scorll" style="height:100%; width:100%">
              <el-checkbox v-model="allChecked" @change="selectAll">全选</el-checkbox>
              <div class="com-left-unit" v-for="(item, index) in unitList" :key="index+999">
                <el-checkbox v-model="item.unitChecked" class="com-check" @change="orderSelectUnit(item,index)">{{item.unitName}}</el-checkbox>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="unit-right">
          <div class="com-content">
            <el-scrollbar class="scorll" style="height:100%; width:100%">
              <p class="right-total">已选：<span>{{selectList.length}}</span></p>
              <div class="com-right-unit" v-for="(item, index) in selectList" :key="index+999">
                <p>{{item.unitName}}<i class="el-icon-error" @click="delUnit(item, index)"></i></p>                
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div slot="footer" size="small">
        <el-button @click="callFunc()">取 消</el-button>
        <el-button type="primary"  @click="onConfirm" :loading="unitLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'select-unit',
  props:{
    unitList:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showSelectUnit:true,
      unitLoading:false,
      allChecked:false,
      selectList:[]
    }
  },
  mounted(){
    this.unitList.map((item)=>{
      if(item.unitChecked){
        this.selectList.push(item)
      }
    })    
    if(this.selectList.length==this.unitList.length){
      this.allChecked=true
    }
  },
  methods:{
    //全选
    selectAll(v){
      this.$emit("selectAll", v)
      if(v){
        this.selectList = JSON.parse(JSON.stringify(this.unitList))
      }else{
        this.selectList=[]
      }
    },
    //选择
    orderSelectUnit(item){
      if(item.unitChecked){
        this.selectList.push(item)
        if(this.selectList.length==this.unitList.length){
          this.allChecked=true
        }
      }else{
        let oi=-1
        this.selectList.map((obj, index)=>{
          if(obj.uid==item.uid){
            oi=index
          }
        })
        this.selectList.splice(oi,1)
        this.allChecked=false
      }
    },
    //删除
    delUnit(item, i){
      let oi=-1
      this.unitList.map((obj, index)=>{
        if(obj.uid==item.uid){
          oi=index
        }
      })
      this.selectList.splice(i, 1)
      this.$emit("selectorderUnit", {index:oi})
      this.allChecked=false
    },
    callFunc(){
      this.$emit("selectUnitClose")
    },
    //保 存
    onConfirm(){
      let selectStr=""
      let selectUid=[]
      this.selectList.map((item)=>{
        selectStr += item.unitName+"，"
        selectUid.push(item.uid)
      })
      this.$emit("selectUnitConfirm", {names:selectStr.substring(0, selectStr.length-1), uids: selectUid})
    },
  }
}
</script>
<style lang="scss" scoped>
.unit-box{
  width: 100%;
  height: 450px;
  border: 1px solid #E5EAF4;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .unit-left{
    width: 60%;
    height: 450px;
  }
  .unit-right{
    width: calc(40% - 1px);
    height: 450px;
    border-left: 1px solid #E5EAF4;
  }
  .com-content{
    width: 100%;
    height: 450px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .com-left-unit{
      width: 6px;
      height: 30px;
      border-left: 1px dashed #999999;
      border-bottom: 1px dashed #999999;
      position: relative;
      margin-left: 5px;
      .com-check{
        position: absolute;
        bottom: -8px;
        left: 10px;
        z-index: 10;
      }
    }
    .right-total{
      margin-bottom: 20px;
      span{
        color: #5458FE;
        margin-left: 5px;
      }
    }
    .com-right-unit{
      p{
        display: inline-block;
        padding: 2px 6px;
        border-radius: 3px;
        background-color: #F4F4F5;
        border: 1px solid #E5EAF4;
        font-size: 14px;
        margin-bottom: 10px;
        i{
          color: #999999;
          margin-left: 6px;
          cursor: pointer;
        }
      }
    }
    .com-right-unit:hover{
      i{
        color: $waring_color;
      }
    }
  }
}
</style>
<style lang="scss">
.unit-dialog{
  .el-dialog__body{
    padding: 10px 20px;
  }
}
.com-content{
  .el-scrollbar__wrap{
    margin-right: -19px !important;
  }
}
</style>
