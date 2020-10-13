<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 标签详情.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <div class="su-com-basic">
        <div class="com-mid-left" style="width:100%">
          <div class="su-com-title">
            <span class="title">基本信息</span>
          </div>
          <div class="clearfix" v-if="labelDetail">
            <p class="com-mid-unit">
              <span>任务编号：</span>
              <span>{{labelDetail.printCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="labelDetail">
              <span>标签类型：</span>
              <span>{{labelDetail.typeName || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="labelDetail && labelDetail.typeFlag==1">
              <span>入库单编号：</span>
              <span>{{labelDetail.warehousingCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="labelDetail">
              <span>操作人：</span>
              <span>{{labelDetail.printer || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="labelDetail">
              <span>打印时间：</span>
              <span>{{labelDetail.printTime || "-"}}</span>
            </p>
          </div>
        </div>
      </div>
      <p class="content-t">打印明细</p>
      <div class="common_table table-scr" v-if="labelDetail && labelDetail.typeFlag==1">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="入库数量" prop="inputCount" show-overflow-tooltip></el-table-column>
            <el-table-column label="本次打印份数" prop="count" show-overflow-tooltip></el-table-column>
            <el-table-column label="累计打印份数" prop="total" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="common_table table-scr" v-if="labelDetail && labelDetail.typeFlag==2">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="库位名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="库位编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="库位类型" prop="locationFlag" show-overflow-tooltip></el-table-column>
            <el-table-column label="本次打印份数" prop="count" show-overflow-tooltip></el-table-column>
            <el-table-column label="累计打印份数" prop="total" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="showQR">打印</el-button>
      </div>
    </el-scrollbar>
  </div>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { getPrintDetail } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "标签打印", routerName: "printLabel"}, { name: "打印标签详情" }],
      labelDetail:null,
      purchaseList:[],
      typeObj:{1:"货物标签", 2:"库位标签"},
    };
  },
  mounted() {
    this.getPrintDetail()
  },
  methods: {
    getPrintDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getPrintDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.labelDetail=res.data
          that.labelDetail.typeName=that.typeObj[parseInt(that.labelDetail.typeFlag)]
          if(res.data.resStorageBarcodeInfoDtos && res.data.resStorageBarcodeInfoDtos.length>0){
            res.data.resStorageBarcodeInfoDtos.map((item)=>{
              let unit={}
              if(parseInt(that.labelDetail.typeFlag)==1){
                unit.resourceName=item.resourceName || "-"
                unit.resourceCode=item.resourceCode || "-"
                unit.model=item.model || "-"
                unit.brand=item.brand || "-"
                unit.measuringUnitName=item.measuringUnitName || "-"
                unit.inputCount=item.inputCount || "-"  //入库数量
                unit.count=item.count || "-"  //本次打印份数
                unit.total=item.total || "-"  //累计打印份数
                that.purchaseList.push(unit)
              }else{
                unit.resourceName=item.resourceName || "-"
                unit.resourceCode=item.resourceCode || "-"
                unit.locationFlag=item.locationFlag || "-"
                unit.count=item.count || "-"
                unit.total=item.total || "-"
                that.purchaseList.push(unit)
              }              
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    backPre(){
      this.$router.push({ name: "printLabel" })
    },
    showQR(){
      this.$router.push({ name: "qrcodePage", query:{uid: this.$route.query.uid} })
    }
  },
}
</script>
<style lang="scss" scoped>
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
