<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 组装和拆卸详情.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <div class="su-com-basic">
        <div class="com-mid-left" v-if="oDetail">
          <div class="su-com-title">
            <span class="title">基本信息</span>
          </div>
          <div class="clearfix">
            <p class="com-mid-unit">
              <span>单据编号：</span>
              <span>{{oDetail.combineCode || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>单据类型：</span>
              <span>{{oDetail.typeFlagName}}</span>
            </p>
            <p class="com-mid-unit">
              <span>制单人：</span>
              <span>{{oDetail.creator || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>操作日期：</span>
              <span>{{oDetail.operationTime || "-"}}</span>
            </p>
          </div>
        </div>
        <div class="com-mid-right">
          <img :src="dzx" v-show="oDetail && oDetail.statusFlag==1">
          <img :src="zxz" v-show="oDetail && oDetail.statusFlag==2">
          <img :src="ywc" v-show="oDetail && oDetail.statusFlag==3">
        </div>
      </div>
      <div class="su-com-title" style="margin-bottom:20px;">
        <span class="title">组合件物资</span>
        <span class="time">{{oDetail && oDetail.typeFlag==2?"（出库物资）":"（入库物资）"}}</span>
      </div>
      <div class="common_table table-scr" style="height:150px">
        <el-scrollbar style="height:100%;">
          <el-table :data="zuheList" tooltip-effect="dark" v-if="oDetail && oDetail.typeFlag==1">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="使用数量" prop="goodsNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="保质期" prop="expireDesc" show-overflow-tooltip></el-table-column>
            <el-table-column label="生产日期" prop="productionDate" show-overflow-tooltip></el-table-column>
            <el-table-column label="保质期至" prop="expireDate" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120" fixed="right" v-if="oDetail && oDetail.statusFlag==3">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookInReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="zuheList" tooltip-effect="dark" v-if="oDetail && oDetail.typeFlag==2">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="可用库存" prop="availableStorage" show-overflow-tooltip></el-table-column>
            <el-table-column label="使用数量" prop="goodsNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120" fixed="right" v-if="oDetail && oDetail.statusFlag==3">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookOutReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="su-com-title" style="margin-bottom:20px;">
        <span class="title">子件物资</span>
        <span class="time">{{oDetail && oDetail.typeFlag==1?"（出库物资）":"（入库物资）"}}</span>
      </div>
      <div class="common_table table-scr" style="height:250px">
        <el-scrollbar style="height:100%;">
          <el-table :data="zijianList" tooltip-effect="dark" v-if="oDetail && oDetail.typeFlag==1">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="使用数量" prop="goodsNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="可用库存" prop="availableStorage" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120" fixed="right" v-if="oDetail && oDetail.statusFlag==3">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookOutReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="zijianList" tooltip-effect="dark" v-if="oDetail && oDetail.typeFlag==2">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="使用数量" prop="goodsNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="保质期" prop="expireDesc" show-overflow-tooltip></el-table-column>
            <el-table-column label="生产日期" prop="productionDate" show-overflow-tooltip></el-table-column>
            <el-table-column label="保质期至" prop="expireDate" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="120" fixed="right" v-if="oDetail && oDetail.statusFlag==3">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookInReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="printGoodsLabel" v-if="oDetail && oDetail.statusFlag==2">打印物资标签</el-button>
      </div>
    </el-scrollbar>
    <scan-code v-if="showScanCode" :showScanCode="showScanCode" :fromPage="fromPage" :codeUid="codeUid" :categoryUid="categoryUid" @closeCode="closeCode"></scan-code>
  </div>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { formatDate } from "@/utils/util.js";
import scanCode from "_com/supplies/scanCode.vue"
import { getCombineOrder } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, scanCode },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "组装和拆卸管理", routerName: "aAndDManage"}, { name: "组装和拆卸详情" }],
      dzx: require("@/assets/img/supplies/dzx.png"),
      zxz: require("@/assets/img/supplies/zxz.png"),
      ywc: require("@/assets/img/supplies/ywc.png"),
      oDetail:null,
      aObj:{1:"组装单", 2:"拆卸单"},
      zuheList:[],
      zijianList:[],
      fromPage:'inStorages',
      showScanCode:false,
      codeUid:null,
      categoryUid:null
    };
  },
  mounted() {
    this.getCombineOrder()
  },
  methods: {
    getCombineOrder(){
      let that=this
      let params={
        combineUid:that.$route.query.uid
      }
      that.zuheList=[]
      that.zijianList=[]
      getCombineOrder(params).then((res)=>{
        that.oDetail=res.data
        that.oDetail.typeFlagName=that.aObj[parseInt(that.oDetail.typeFlag)]
        if(res.data.resourceList && res.data.resourceList.length>0){
          res.data.resourceList.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.typeFlag=item.typeFlag
            unit.categoryUid=item.categoryUid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.measuringUnitName=item.measuringUnitName || "-"
            unit.availableStorage=item.availableStorage || "-"
            unit.goodsNum=item.goodsNum || "-"
            unit.listUid=item.listUid
            unit.listCode=item.listCode
            unit.productionDate=item.productionDate || "-"
            unit.expireDesc=item.expireDesc || "-"
            unit.expireDate=item.expireDate?formatDate(item.expireDate, "yyyy-MM-dd"):"-"
            if(item.typeFlag==1){
              that.zuheList.push(unit)
            }else{
              that.zijianList.push(unit)
            }
          })
        }
      })
    },
    backPre(){
      this.$router.push({ name: "aAndDManage" })
    },
    printGoodsLabel(){
      this.$router.push({ name: "addLabel", query:{listUid: this.oDetail.typeFlag=='2'?this.zijianList[0].listUid:this.zuheList[0].listUid, listCode: this.oDetail.typeFlag=='2'?this.zijianList[0].listCode:this.zuheList[0].listCode, type:'组装和拆卸'} })
    },
    //查看扫码记录
    lookOutReCord(obj){
      this.fromPage='outStorage'
      this.codeUid=obj.listUid
      this.categoryUid=obj.categoryUid
      this.showScanCode=true
    },
    lookInReCord(obj){
      this.fromPage='inStorages'
      this.codeUid=obj.listUid
      this.categoryUid=obj.categoryUid
      this.showScanCode=true
    },
    //关闭扫码记录
    closeCode(){
      this.showScanCode=false
    },
  },
};
</script>
<style lang="scss" scoped>
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
