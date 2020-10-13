<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 标签详情.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData" ></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar class="cro"  >
      <div id="printBox">
      <!-- <p class="content-t">标签打印</p> -->
      <div class="qr-box clearfix"  ref="printBox" v-loading="printLoading">
        <div class="qr-code" v-for="(item, index) in Barcodes" :key="index+666">
          <div class="code-left">
            <div :id="item.barCodeUid" ref="qrcode" class="code-bor"></div>
            <span  class="bar-code">{{item.barCode}}</span>
          </div>
          <div class="code-right" v-if="typeFlag==1">
            <p class="code-title">名称：{{item.resourceName || '-'}}</p>
            <p class="code-unit">物资装备编号：{{item.resourceCode || '-'}}</p>
            <p class="code-unit">入库单号：{{item.warehousingCode || '-'}}</p>
            <p class="code-unit">单位：{{item.measuringUnitName || '-'}}</p>
            <p class="code-unit">规格：{{item.model || '-'}}</p>
            <p class="code-unit">生产日期：{{item.productionDate || '-'}}</p>
            <p class="code-unit">保质期：{{item.lifeFlag || '-'}}</p>
            <p class="code-unit">供应商：{{item.supplierName || '-'}}</p>
          </div>
          <div class="code-right" v-if="typeFlag==2">
            <p class="code-kw">库房：{{item.warehouseName || '-'}}</p>
            <p class="code-kw" v-if="item.locationFlag==2 || item.locationFlag==3">库区：{{item.reservoirAreaName || '-'}}</p>
            <p class="code-kw" v-if="item.locationFlag==3">货架：{{item.shelfName || '-'}}</p>
            <p class="code-unit">库位编号：{{item.locationCode || '-'}}</p>
          </div>
        </div>
      </div>
      </div>
    </el-scrollbar>
    <div class="bottom-btn">
      <el-button @click="backPre">返回</el-button>
      <el-button type="primary" @click="printQRCode">打印</el-button>
    </div>
  </div>
</div>
</template>
<script>
import QRCode from 'qrcodejs2'
import visBreadcrumb from "_com/breadcrumb.vue"
import { getBarcodeList, putLabelFinish } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "标签打印", routerName: "printLabel"}, { name: "二维码详情" }],
      typeObj:{1:"货物标签", 2:"库位标签"},
      Barcodes:[],
      lifeType:{1:"年",2:"月",3:"日"},
      typeFlag:1,
      printLoading:false
    };
  },
  mounted() {
    this.getBarcodeList()
  },
  methods: {
    getBarcodeList(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getBarcodeList(params).then((res)=>{
        let ids=[]
        this.typeFlag=res.data.typeFlag
        if(res.data.resourceBarcodes && res.data.resourceBarcodes.length>0){
          that.Barcodes=res.data.resourceBarcodes
          that.Barcodes.map((item)=>{
            item.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + this.lifeType[parseInt(item.shelfLifeUnitFlag)]
          })
          setTimeout(()=>{
            res.data.resourceBarcodes.map((item)=>{
              let qrText=""
              qrText=`${item.resourceName},${item.barCodeUid},${item.barCode},${item.categoryUid},${item.warehousingUid}`
              that.qrcode(item.barCodeUid, qrText)
              ids.push(item.barCodeUid)
            })
            that.putLabelFinish(ids)
          }, 300)
        }
        if(res.data.warehousingBarcodes && res.data.warehousingBarcodes.length>0){
          that.Barcodes=res.data.warehousingBarcodes
          setTimeout(()=>{
            res.data.warehousingBarcodes.map((item)=>{
              let qrText=""
              qrText=`${item.locationName},${item.barCodeUid},${item.barCode},${item.locationUid}`
              that.qrcode(item.barCodeUid, qrText)
              ids.push(item.barCodeUid)
            })
            that.putLabelFinish(ids)
          }, 300)
        }
      })
    },
    qrcode(uid, qrText){
      new QRCode(uid, {
        width: 140,
        height: 140, // 高度
        text:qrText, // 二维码内容
        render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',
        // foreground: '#ff0'
      })
    },
    putLabelFinish(ids){
      putLabelFinish(ids).then(()=>{
        // console.log("标签已打印=>",res)
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    backPre(){
      this.$router.push({ name: "labelDetail", query:{uid: this.$route.query.uid} })
    },
    printQRCode(){
      let obj = document.getElementById('printBox')
       var newWindow=window.open("打印窗口","_blank");
      var docStr = obj.innerHTML;
      newWindow.document.write(docStr);
      var nod = newWindow.document.createElement('style') 
     let str = `.qr-box{ display: flex;
    flex-direction: row;flex-wrap: wrap;     justify-content: space-between;} .qr-code{
    float: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 45%;
    padding: 20px 2%;
    border: 1px solid #333333;
    border-radius: 10px;
    margin-bottom: 26px;
  }
  .code-left{    
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    }
  .code-bor{
      width:150px;
      height:150px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    p{ margin:0px}
    .bar-code{
      font-size:13px;
      color:#333333;
      font-weight:bold;
    }
    .code-right{
    display: inline-flex;
    flex-direction: column;
    margin-left:10px;
          }
          .code-title{
      font-size:16px;
      color:#333333;
      font-weight:bold;
      margin-bottom:10px;
    }
      .code-kw{
      font-size:16px;
      color:#333333;
      font-weight:bold;
      margin-bottom:5px;
    }
    .code-unit{
      font-size:14px;
      color:#333333;
      line-height:20px;
    }`;  
     nod.type='text/css';  
     if (nod.styleSheet) { //ie下  
         nod.styleSheet.cssText = str;
     } else {
         nod.innerHTML = str; //或者写成 nod.appendChild(document.createTextNode(str))  
     }
       newWindow.document.getElementsByTagName('head')[0].appendChild(nod); 
      
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
     
    }
  },
}
</script>
<style lang="scss" scoped>
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .cro{
    height: calc(100% - 60px);
  }
}

.qr-box{  
  .qr-code{
    float: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 32%;
    padding: 20px 30px;
    border: 1px solid #333333;
    border-radius: 10px;
    margin-right: 2%;
    margin-bottom: 20px;
  }
  .qr-code:nth-of-type(3n){
    margin-right: 0px;
  }
  .code-left{    
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    .code-bor{
      width:150px;
      height:150px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .bar-code{
      font-size:13px;
      color:#333333;
      font-weight:bold;
    }
  }
  .code-right{
    display: inline-flex;
    flex-direction: column;
    margin-left:10px;
    .code-title{
      font-size:16px;
      color:#333333;
      font-weight:bold;
      margin-bottom:10px;
    }
    .code-kw{
      font-size:16px;
      color:#333333;
      font-weight:bold;
      margin-bottom:5px;
    }
    .code-unit{
      font-size:14px;
      color:#333333;
      line-height:20px;
    }
  }
}
</style>
