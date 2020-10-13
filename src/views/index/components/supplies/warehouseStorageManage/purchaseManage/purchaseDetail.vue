<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 采购详情.
-->
<template>
<div style="position:relative; overflow:hidden;">
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <div>
      <div class="su-com-basic">
        <div class="com-mid-left">
          <div class="su-com-title">
            <span class="title">基本信息</span>
            <span class="time" v-if="purchaseObj!=null">创建于{{purchaseObj.createTime}}，最近更新于{{purchaseObj.updateTime}}</span>
          </div>
          <div class="clearfix">
            <p class="com-mid-unit">
              <span>采购单编号：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.purchaseCode || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>采购类型：</span>
              <span v-if="purchaseObj!=null">{{typeName[parseInt(purchaseObj.purchaseTypeFlag)]}}</span>
            </p>
            <p class="com-mid-unit">
              <span>联系人：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.contactInfo}}</span>
            </p>
            <p class="com-mid-unit">
              <span>采购员：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.purchaser || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>交货日期：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.deliveryDate || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>供应商：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.supplierName || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>存放仓库：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.warehouseName || "-"}}</span>
            </p>
            <p class="com-mid-unit">
              <span>相关采购计划：</span>
              <span v-if="purchaseObj!=null">{{purchaseObj.purchasePlanName || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="purchaseObj && purchaseObj.statusFlag==3">
              <span>入库时间：</span>
              <span>{{purchaseObj.warehousingDate || "-"}}</span>
            </p>
          </div>
        </div>
        <div class="com-mid-right">
          <img :src="daicaigou" v-show="purchaseObj && purchaseObj.statusFlag==1">
          <img :src="caigouzhong" v-show="purchaseObj && purchaseObj.statusFlag==2">
          <img :src="yiruku" v-show="purchaseObj && purchaseObj.statusFlag==3">
        </div>
      </div>
      <p class="content-t">采购明细表</p>
      <div class="common_table table-scr" v-if="purchaseObj!=null">
        <el-scrollbar style="height:100%;">
          <el-table :data="resourceList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="物资装备名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资装备编号" prop="resourceCode" width="180"></el-table-column>
            <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" show-overflow-tooltip></el-table-column>
            <el-table-column label="采购数量" prop="purchaseNum" width="80"></el-table-column>
            <el-table-column label="采购单价（元）" prop="purchaseUnitPrice" show-overflow-tooltip width="120"></el-table-column>
            <el-table-column label="合计（元）" prop="totalPrice" width="100"></el-table-column>
            <el-table-column label="入库数量" prop="actualQuantity" width="100" v-if="purchaseObj && purchaseObj.statusFlag==3"></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>        
      </div>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="proTo" v-if="purchaseObj && purchaseObj.statusFlag==2">生成入库单</el-button>
      </div>
    </el-scrollbar>
  </div>
  <div class="print-content" v-if="purchaseObj!=null" ref="printContent">
    <div class="pur-pri-info">
      <p class="info-title">采购单</p>
      <div class="clearfix">
        <p class="info-unit w33">No.{{purchaseObj.purchaseCode}}</p>
        <p class="info-unit w33">采购类型：{{typeName[parseInt(purchaseObj.purchaseTypeFlag)]}}</p>
        <p class="info-unit w33">交货日期：{{purchaseObj.deliveryDate || "-"}}</p>
        <p class="info-unit w33">供应商：{{purchaseObj.supplierName || "-"}}</p>
        <p class="info-unit w33">联系人：{{purchaseObj.contactInfo || "-"}}</p>
        <p class="info-unit w33">采购员：{{purchaseObj.purchaser || "-"}}</p>
        <p class="info-unit w33">存放仓库：{{purchaseObj.warehouseName || "-"}}</p>
        <p class="info-unit w66">关联计划：{{purchaseObj.purchasePlanName || "-"}}</p>
      </div>
    </div>
    <el-table :data="resourceList" border style="width: 100%; border:1px solid #EBEEF5; border-color: #868686">
      <el-table-column label="序号" type="index" width="70"></el-table-column>
      <el-table-column label="物资装备名称" prop="resourceName" show-overflow-tooltip></el-table-column>
      <el-table-column label="物资装备编号" prop="resourceCode" width="180"></el-table-column>
      <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="measuringUnit" show-overflow-tooltip></el-table-column>
      <el-table-column label="采购数量" prop="purchaseNum" width="80"></el-table-column>
      <el-table-column label="采购单价（元）" prop="purchaseUnitPrice" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="合计（元）" prop="totalPrice" width="100"></el-table-column>
    </el-table>
    <div class="t-bottom clearfix">
      <p class="info-unit w33">审核（签字)：</p>
      <p class="info-unit w33">仓库（签字）：</p>
      <p class="info-unit w33">归档（签字）：</p>
    </div>
  </div>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import print from 'print-js'
import html2canvas from 'html2canvas'
import { getPurchaseServiceDetail } from "@/views/index/api/supplies/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "采购管理", routerName: "purchaseManage"}, { name: "采购单详情" }],
      daicaigou: require("@/assets/img/supplies/daicaigou.png"),
      caigouzhong: require("@/assets/img/supplies/caigouzhong.png"),
      yiruku: require("@/assets/img/supplies/yiruku.png"),
      purchaseObj:null,
      resourceList:[],
      typeName:{1:"计划采购", 2:"临时采购"},
      printLoading:false
    };
  },
  mounted() {
    this.getPurchaseServiceDetail()
  },
  methods: {
    //获取采购单详情信息
    getPurchaseServiceDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getPurchaseServiceDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.purchaseObj=res.data
          that.purchaseObj.contactInfo="-"
          if(that.purchaseObj.contactPerson && that.purchaseObj.contactPhone){
            that.purchaseObj.contactInfo=`${that.purchaseObj.contactPerson}（${that.purchaseObj.contactPhone}）`
          }else if(that.purchaseObj.contactPerson && !that.purchaseObj.contactPhone){
            that.purchaseObj.contactInfo=that.purchaseObj.contactPerson
          }
          if(res.data.resourceList && res.data.resourceList.length>0){
            res.data.resourceList.map((item)=>{
              let unit={}
              unit.resourceName=item.resourceName || "-"
              unit.resourceCode=item.resourceCode || "-"
              unit.model=item.model || "-"
              unit.brand=item.brand || "-"
              unit.measuringUnit=item.measuringUnit || "-"
              unit.purchaseNum=item.purchaseNum || "-"
              unit.purchaseUnitPrice=item.purchaseUnitPrice || "-"
              unit.totalPrice=item.purchaseNum && item.purchaseUnitPrice? parseInt(item.purchaseNum)*parseInt(item.purchaseUnitPrice):"-"
              unit.actualQuantity=item.actualQuantity || "-"
              that.resourceList.push(unit)
            })
          }          
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //返回
    backPre(){
      this.$router.back(-1)
    },
    //生成入库单
    proTo(){
      this.$router.push({ name: "addInStorage", query:{purchaseUid: this.$route.query.uid} })
    },
    //打印
    print(){
			this.printLoading = true // 打印的时候loading
			// 保存当前滚动位置
			const scrollY = window.scrollY
			const scrollX = window.scrollX
			// 滚动到顶部，生成图片后还原
			window.scroll(0, 0)
			html2canvas(this.$refs.printContent, {
				backgroundColor: null,
				useCORS: true,
				windowHeight: this.$refs.printContent.scrollHeight, // 转成的canvas的高度
			}).then(canvas => {
        // 还原滚动位置
        window.scroll(scrollX, scrollY)
        // let url = canvas.toDataURL('image/jpeg', 1.0)
        const url = canvas.toDataURL()
        print({
          printable: url,
          type: 'image',
          // documentTitle: "采购单", // 打印的标题，显示在打印的上方
        })
        console.log(url)
        this.printLoading = false
      })
      .catch(() => {
        this.printLoading = false
      })
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
