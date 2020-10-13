<!-- 
* @author  ps_gen
* @Date: 2020-08-13 20:52:34
* @description 审核日志.
-->
<template>
  <div>
    <div class="ex-box" :class="index==examineList.length-1?'':'bor-left'" v-for="(item, index) in examineList" :key="index+666">
        <span class="ex-content">{{item.remark}}</span>
        <div class="ex-top-info">
            <span :class="index==0?'ba-font':''"></span>
            <span :class="index==0?'co-font':''">【{{item.checkerName}}】{{item.flagName}}</span>
            <span>{{item.checkTime}}</span>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"examine",
  props:{
    examineList:{
      type: Array,
      required: true
    }
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.ex-box{
    width: 100%;
    height: 70px;
    text-align: left;
    padding-left: 24px;
    padding-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    margin-left: 10px;
    .ex-content{
        font-size:14px;
        color: #666666;
    }
    .ex-top-info{
        position: absolute;
        left: -5px;
        top: 0px;
        z-index: 10;
        span:nth-of-type(1){
            display: inline-block;
            width: 10px;
            height:10px;
            border-radius: 50%;
            background-color: #999999;
        }
        span:nth-of-type(2){
            font-size:14px;
            color: #333333;
            margin-left: 6px;
            margin-right: 10px;
            font-weight: bold;
        }
        span:nth-of-type(3){
            font-size:12px;
            color: #666666;
        }
    }
}
.bor-left{      
    border-left: 1px dashed #D3D3D3;
}
.co-font{
  color: #5458FE !important;
}
.ba-font{
  background-color: #5458FE !important;
}
</style>
