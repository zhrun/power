<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 退回原因组件.
-->
<template>
  <div>
    <el-dialog title="退回原因" width="40%" :close-on-click-modal="false" class="reason-dialog" v-bind="$attrs" v-on="$listeners">
      <div class="back-dialog scorll">
        <el-scrollbar style="width:100%; height:100%;">
          {{backContent}}
        </el-scrollbar>
      </div>   
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'back-reason',
  props:{
    backContent:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  mounted(){

  },
  methods:{
    
  }
}
</script>
<style lang="scss" scoped>
.back-dialog{
  width: 100%;
  height: 200px;
  padding: 0 30px;
}
</style>
<style lang="scss">
.back-dialog{
  .el-scrollbar__wrap{
    margin-right: -19px !important;
  }
}
</style>
