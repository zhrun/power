<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 出库详情.
-->
<template>
<div style="position:relative; overflow:hidden;">
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <div class="su-com-basic">
        <div class="com-mid-left">
          <div class="su-com-title">
            <span class="title">基本信息</span>
          </div>
          <div class="clearfix">
            <p class="com-mid-unit" v-if="storageDetail">
              <span>单据编号：</span>
              <span>{{storageDetail.outdeliveryCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>出库类型：</span>
              <span>{{storageDetail.typeName}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>单据来源：</span>
              <span>{{storageDetail.sourceDesc || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>出库仓库：</span>
              <span>{{storageDetail.warehouseName || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>出库日期：</span>
              <span>{{storageDetail.outdeliverDate || "-"}}</span>
            </p>
            <!-- <p class="com-mid-unit" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=99"> -->
            <p class="com-mid-unit" v-if="storageDetail">
              <span>出库人：</span>
              <span>{{storageDetail.outdeliveryPersonName || "-"}}</span>
            </p>
          </div>
        </div>
        <div class="com-mid-right">
          <img :src="daichuku" v-show="storageDetail && storageDetail.statusFlag==1">
          <img :src="chukuzhong" v-show="storageDetail && storageDetail.statusFlag==2">
          <img :src="daishenhe" v-show="storageDetail && storageDetail.statusFlag==3">
          <img :src="yichuku" v-show="storageDetail && storageDetail.statusFlag==4">
        </div>
      </div>
      <p class="content-t">出库明细表</p>
      <div class="common_table table-scr">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" width="160"></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" width="100"></el-table-column>
            <el-table-column label="库存总数" prop="warehouseResourceStorage" width="100" v-if="storageDetail && (storageDetail.statusFlag==1 || storageDetail.statusFlag==2)"></el-table-column>
            <el-table-column label="可用库存" prop="availableStorage" width="100" v-if="storageDetail && (storageDetail.statusFlag==1 || storageDetail.statusFlag==2)"></el-table-column>
            <el-table-column label="应出数量" prop="outdeliveryValue" width="100" v-if="storageDetail && storageDetail.typeFlag!=2"></el-table-column>
            <el-table-column label="实出数量" prop="savedNum" width="100" v-if="storageDetail && storageDetail.statusFlag==3"></el-table-column>
            <el-table-column label="出库数量" prop="savedNum" width="100" v-if="storageDetail && storageDetail.statusFlag==4 && storageDetail.typeFlag!=2"></el-table-column>
            <el-table-column label="出库数量" prop="outdeliveryValue" width="100" v-if="storageDetail && storageDetail.statusFlag==4 && storageDetail.typeFlag==2"></el-table-column>
            <el-table-column label="存放库位" prop="locationNames" show-overflow-tooltip v-if="storageDetail && (storageDetail.statusFlag==3 || storageDetail.statusFlag==4) && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <!-- <el-table-column label="操作" width="120">              
              <template slot-scope="scope">
                <span @click="lookScanCode(scope.row)" class="operation_btn">查看二维码</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="120" fixed="right" v-if="storageDetail && (storageDetail.statusFlag==3 || storageDetail.statusFlag==4) && parseInt(storageDetail.typeFlag)!=2">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookCodeReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <p class="content-t" v-if="storageDetail && (parseInt(storageDetail.typeFlag)==1 || parseInt(storageDetail.typeFlag)==99)">运输信息</p>
      <div class="clearfix" v-if="storageDetail && (parseInt(storageDetail.typeFlag)==1 || parseInt(storageDetail.typeFlag)==99)" style="margin-bottom:40px;">
        <p class="com-mid-unit">
          <span>接收单位：</span>
          <span>{{storageDetail.receivingUnit || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>运输目的地：</span>
          <span>{{storageDetail.receivingAddress || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>承运单位：</span>
          <span>{{storageDetail.transportUnit || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>运输方式：</span>
          <span>{{storageDetail.transportName}}</span>
        </p>
        <p class="com-mid-unit">
          <span>运输线路：</span>
          <span>{{storageDetail.transportRoute || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>计划到达时间：</span>
          <span>{{storageDetail.scheduledArrivalTime || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>联系人：</span>
          <span>{{storageDetail.receivingContactPerson || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>联系方式：</span>
          <span>{{storageDetail.receivingContactPhone || "-"}}</span>
        </p>
        <p class="com-mid-unit">
          <span>备注：</span>
          <span>{{storageDetail.remark || "-"}}</span>
        </p>
      </div>
      <p class="content-t" style="margin-top:20px;margin-bottom:30px" v-if="examineList.length>0 && (parseInt(storageDetail.typeFlag)==1 || parseInt(storageDetail.typeFlag)==99)">审核日志</p>
      <examine :examineList="examineList" v-if="examineList.length>0 && (parseInt(storageDetail.typeFlag)==1 || parseInt(storageDetail.typeFlag)==99)"></examine>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="editInStorge" v-if="storageDetail && (parseInt(storageDetail.typeFlag)==1 || parseInt(storageDetail.typeFlag)==99)">编辑</el-button>
        <el-button type="primary" @click="toExamine" v-if="storageDetail && storageDetail.statusFlag==3">审核</el-button>
      </div> 
      <div class="qr-box clearfix">
        <div class="qr-code" v-for="(item, index) in Barcodes" :key="index+666">
          <p :id="item.barCodeUid" ref="qrcode"></p>
        </div>
      </div>
    </el-scrollbar>   
  </div>
  <el-dialog title="审核" :visible.sync="examineVisible" top="20vh" @close="examineVisible = false" width="470px" :close-on-click-modal="false">
    <el-form inline :model="examineForm" ref="examineForm" :rules="examineRule" label-width="100px" class="examine-form">
      <el-form-item label="审核结果" prop="examineRadio">
        <el-radio v-model="examineForm.examineRadio" label="1">通过</el-radio>
        <el-radio v-model="examineForm.examineRadio" label="2">不通过</el-radio>
      </el-form-item>
      <el-form-item label="原因" v-if="examineForm && examineForm.examineRadio==2">
        <el-select v-model="examineForm.mReason" style="width:300px;">
          <el-option v-for="item in reasonOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" " v-if="examineForm.mReason==4">
        <el-input type="textarea" :rows="4" placeholder="请再次输入其他情况" maxlength="100" show-word-limit v-model="examineForm.remark" style="width:300px;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="examineVisible = false">取 消</el-button>
      <el-button type="primary" @click="examineConfirm">确 定</el-button>
    </span>
  </el-dialog>
  <scan-code v-if="showScanCode" :showScanCode="showScanCode" :fromPage="'outStorage'" :codeUid="codeUid" :categoryUid="categoryUid" @closeCode="closeCode"></scan-code>
  <div class="print-content" v-if="storageDetail!=null" ref="printContent">
    <div class="pur-pri-info">
      <p class="info-title">出库单</p>
      <div class="clearfix">
        <p class="info-unit w33">No.{{storageDetail.outdeliveryCode}}</p>
        <p class="info-unit w33">出库类型：{{storageDetail.typeName}}</p>
        <p class="info-unit w33">出库单编号：{{storageDetail.listCode || "-"}}</p>
        <p class="info-unit w33">单据来源：{{storageDetail.sourceDesc || "-"}}</p>
        <p class="info-unit w33">出库仓库：{{storageDetail.warehouseName || "-"}}</p>
        <p class="info-unit w33">出库日期：{{storageDetail.outdeliverDate || "-"}}</p>
        <p class="info-unit w33">出库人：{{storageDetail.outdeliveryPersonName || "-"}}</p>
      </div>
    </div>
    <el-table :data="purchaseList" border style="width: 100%; border:1px solid #EBEEF5; border-color: #868686">
      <el-table-column label="序号" type="index" width="70"></el-table-column>
      <el-table-column label="物资装备名称" prop="resourceName" show-overflow-tooltip></el-table-column>
      <el-table-column label="物资装备编号" prop="resourceCode" width="180"></el-table-column>
      <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="measuringUnit" show-overflow-tooltip></el-table-column>
      <el-table-column label="应出数量" prop="outdeliveryValue" width="100"></el-table-column>
      <el-table-column label="标准单价" prop="unitPrice" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="合计金额" prop="totalPrice" width="100"></el-table-column>
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
import QRCode from 'qrcodejs2'
import print from 'print-js'
import html2canvas from 'html2canvas'
import visBreadcrumb from "_com/breadcrumb.vue"
import examine from "_com/supplies/examine.vue"
import scanCode from "_com/supplies/scanCode.vue"
import { getOutDeliveryOrderDetail, putOutDeliveryOrderCheck, getLabelTest } from "@/views/index/api/supplies/api.ps.js";
export default {
  components: { visBreadcrumb, examine, scanCode },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "出库管理", routerName: "outStorageManage"}, { name: "出库单详情" }],
      daichuku: require("@/assets/img/supplies/daichuku.png"),
      chukuzhong: require("@/assets/img/supplies/chukuzhong.png"),
      daishenhe: require("@/assets/img/supplies/daishenhe.png"),
      yichuku: require("@/assets/img/supplies/yichuku.png"),
      storageDetail:null,
      purchaseList:[],
      examineList:[],
      examineRule:{
        examineRadio:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      typeObj:{1:"报废出库",2:"盘亏出库",3:"组装出库",4:"拆卸出库", 99:"其他出库"},
      transportObj:{1:"汽车", 2:"火车", 3:"空运"},
      examineVisible:false,
      examineForm:{
        examineRadio:"1",
        mReason:null,
        remark:""
      },   
      reasonOptions:[
        {
          value: null,
          label: '请选择'
        },
        {
          value: 1,
          label: '出库物资批号有误'
        },
        {
          value: 2,
          label: '出库物资数量有误'
        },
        {
          value: 4,
          label: '其他情况'
        },
      ],
      reasonStr:{1:"出库物资批号有误", 2:"出库物资数量有误"},
      Barcodes:[],
      showScanCode:false,
      codeUid:null,
      categoryUid:null,
      printLoading:false
    }
  },
  mounted() {
    this.getOutDeliveryOrderDetail()
  },
  methods: {
    getOutDeliveryOrderDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getOutDeliveryOrderDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.storageDetail=res.data
          that.storageDetail.typeName=that.typeObj[parseInt(that.storageDetail.typeFlag)]
          that.storageDetail.transportName=that.transportObj[parseInt(that.storageDetail.transportMode)]
          if(res.data.resourceList && res.data.resourceList.length>0){
            that.purchaseList=[]
            res.data.resourceList.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.resourceName=item.resourceName || "-"
              unit.resourceCode=item.resourceCode || "-"
              unit.outdeliveryUid=item.outdeliveryUid
              unit.categoryUid=item.categoryUid
              unit.model=item.model || "-"
              unit.brand=item.brand || "-"
              unit.measuringUnit=item.measuringUnitName || "-"
              unit.warehouseResourceStorage=item.warehouseResourceStorage || "-"
              unit.availableStorage=item.availableStorage || "-"
              unit.outdeliveryValue=item.outdeliveryValue || "-"
              unit.savedNum=item.savedNum==null? "-": item.savedNum
              unit.locationNames=item.locationNames || "-"
              unit.unitPrice=item.unitPrice || "-"
              unit.totalPrice=item.outdeliveryValue*item.unitPrice || "-"
              that.purchaseList.push(unit)
            })
          }
          if(res.data.checkList && res.data.checkList.length>0){
            that.examineList=[]
            res.data.checkList.map((obj)=>{
              let unit={}
              unit.uid=obj.uid
              unit.checkerName=obj.checkerName
              unit.flagName=obj.checkResultFlag==1?"通过":"不通过"
              unit.checkTime=obj.checkTime
              unit.remark=obj.remark
              that.examineList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    backPre(){
      this.$router.push({ name: "outStorageManage" })
    },
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
    editInStorge(){
      this.$router.push({ name: "addOutStorage", query:{uid: this.$route.query.uid, type:'edit'} })
    },
    //审核
    toExamine(){
      this.examineForm.examineRadio="1"
      this.examineVisible=true
    },
    examineConfirm(){
      let that=this
      if(that.examineForm.examineRadio==2&&!that.examineForm.mReason){
        that.$message({
          message: "请选择具体原因！",
          type: 'warning'
        })
        return
      }
      let params={
        outdeliverUid:that.$route.query.uid,
        checkResultFlag:that.examineForm.examineRadio,
        remark:parseInt(that.examineForm.mReason)!=4? that.reasonStr[parseInt(that.examineForm.mReason)]:that.examineForm.remark
      }
      putOutDeliveryOrderCheck(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.getOutDeliveryOrderDetail()
          this.examineVisible=false
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //查看扫码记录
    lookCodeReCord(obj){
      this.codeUid=obj.outdeliveryUid
      this.categoryUid=obj.categoryUid
      this.showScanCode=true
    },
    closeCode(){
      this.showScanCode=false
    },
    lookScanCode(obj){
      let that=this
      let params={
        uid:obj.categoryUid,
        count:obj.outdeliveryValue
      }
      that.Barcodes=[]
      getLabelTest(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.length>0){
            that.Barcodes=res.data
            setTimeout(()=>{
              res.data.map((item)=>{
                let qrText=""
                qrText=`${item.resourceName},${item.barCodeUid},${item.barCode},${item.categoryUid}`
                that.qrScancode(item.barCodeUid, qrText)
              })
            }, 500)
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    qrScancode(uid, qrText){
      new QRCode(uid, {
        width: 100,
        height: 100, // 高度
        text:qrText, // 二维码内容
        render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',
        // foreground: '#ff0'
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
.qr-box{  
  .qr-code{
    width: 100px;
    height: 100px;
    margin: 10px;
    float: left;
  }
}
</style>
