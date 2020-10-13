<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 所有机构中选择单位.
-->
<template>
  <div>
    <el-dialog title="选择" :visible.sync="showSelectUnit" width="30%" :close-on-click-modal="false" @close="callFunc" class="unit-dialog">
      <div class="unit-box">
        <div class="unit-left">
          <div class="com-content">            
            <el-scrollbar class="scorll" style="height:100%; width:100%">
              <el-radio-group v-model="rIndex" class="com-left-unit">
                <el-radio v-for="(item, index) in unitList" :key="index+999" :label="index" class="unit-cont" @change="orderSelectUnit(index)">{{item.unitName}}</el-radio>
              </el-radio-group>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div slot="footer" size="small">
        <el-button @click="callFunc()">取 消</el-button>
        <el-button type="primary"  @click="onConfirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'radio-unit',
  props:{
    unitList:{
      type: Array,
      required: true
    },
    radioIndex:{
      type: Number,
      default:-1
    }
  },
  data() {
    return {
      showSelectUnit:true,
      rIndex:-1
    }
  },
  mounted(){
    this.rIndex=this.radioIndex
  },
  methods:{
    //选择单位
    orderSelectUnit(i){
      this.rIndex=i
      this.$emit("selectorderUnit", {index:i})
    },
    //取消/关闭
    callFunc(){
      this.$emit("selectUnitClose")
    },
    //保存
    onConfirm(){
      if(this.rIndex>=0){
        this.$emit("selectUnitConfirm")
      }else{
        this.$message("请选择相关机构")
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.unit-box{
  width: 100%;
  height: 400px;
  border: 1px solid #E5EAF4;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .unit-left{
    width: 100%;
    height: 400px;
  }
  .com-content{
    width: 100%;
    height: 400px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .com-left-unit{
      width: 6px;
      height: 30px;
      margin-left: 5px;
      display: flex;
      flex-direction: column;
      .unit-cont{
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 30px;
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
    margin-right: -23px !important;
  }
}
</style>
