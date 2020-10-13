<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 入库详情.
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
              <span>{{storageDetail.warehousingCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>入库类型：</span>
              <span>{{levelObj[storageDetail.typeFlag]}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==1">
              <span>采购单编号：</span>
              <span>{{storageDetail.listCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==1">
              <span>联系人：</span>
              <span>{{storageDetail.contactPerson || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==1">
              <span>联系电话：</span>
              <span>{{storageDetail.contactPhone || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==1">
              <span>供应商：</span>
              <span>{{storageDetail.supplierName || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==1">
              <span>交货日期：</span>
              <span>{{storageDetail.deliveryDate || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==99">
              <span>单据来源：</span>
              <span>{{storageDetail.sourceDesc || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==2">
              <span>盘点单编号：</span>
              <span>{{storageDetail.listCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==3">
              <span>组装单编号：</span>
              <span>{{storageDetail.listCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail && storageDetail.typeFlag==4">
              <span>拆卸单编号：</span>
              <span>{{storageDetail.listCode || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>入库仓库：</span>
              <span>{{storageDetail.warehouseName || "-"}}</span>
            </p>
            <p class="com-mid-unit" v-if="storageDetail">
              <span>入库日期：</span>
              <span>{{storageDetail.warehousingDate || "-"}}</span>
            </p>
          </div>
        </div>
        <div class="com-mid-right">
          <img :src="dairuku" v-show="storageDetail && storageDetail.statusFlag==1">
          <img :src="rukuzhong" v-show="storageDetail && storageDetail.statusFlag==2">
          <img :src="daishenhe" v-show="storageDetail && storageDetail.statusFlag==3">
          <img :src="yiruku" v-show="storageDetail && storageDetail.statusFlag==4">
        </div>
      </div>
      <p class="content-t">采购明细表</p>
      <div class="common_table table-scr">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" width="160"></el-table-column>
            <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="采购单价（元）" prop="unitPrice" width="120" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <el-table-column label="标准单价（元）" prop="unitPrice" width="120" v-if="storageDetail && parseInt(storageDetail.typeFlag)==2"></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" show-overflow-tooltip></el-table-column>
            <el-table-column label="应到数量" prop="dueQuantity" width="100" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2" show-overflow-tooltip></el-table-column>
            <el-table-column label="入库数量" prop="actualQuantity" width="100" v-if="storageDetail && parseInt(storageDetail.typeFlag)==2" show-overflow-tooltip></el-table-column>
            <el-table-column label="实到数量" prop="actualQuantity" width="100" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <el-table-column label="存放库位" prop="locationFullName" width="100" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2" show-overflow-tooltip></el-table-column>
            <el-table-column label="保质期" prop="lifeFlag" width="100" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <el-table-column label="生产日期" prop="manufactureDate" width="180" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <el-table-column label="保质期至" prop="closingDate" width="180" v-if="storageDetail && parseInt(storageDetail.typeFlag)!=2"></el-table-column>
            <el-table-column label="操作" width="120" fixed="right" v-if="storageDetail && (storageDetail.statusFlag==3 || storageDetail.statusFlag==4) && parseInt(storageDetail.typeFlag)!=2">
              <template slot-scope="scope">
                <span class="operation_btn" @click="lookCodeReCord(scope.row)">查看扫码记录</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <p class="content-t" v-if="examineList.length>0">审核日志</p>
      <examine :examineList="examineList" v-if="examineList.length>0"></examine>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="editInStorge" v-if="storageDetail && storageDetail.statusFlag==1">编辑</el-button>
        <el-button type="primary" @click="toExamine" v-if="storageDetail && storageDetail.statusFlag==3">审核</el-button>
      </div>
    </el-scrollbar>
    <scan-code v-if="showScanCode" :showScanCode="showScanCode" :fromPage="'inStorage'" :codeUid="codeUid" :categoryUid="categoryUid" @closeCode="closeCode"></scan-code>
  </div>
  <el-dialog title="审核" :visible.sync="examineVisible" top="20vh" @close="examineVisible = false" width="470px" :close-on-click-modal="false">
    <el-form inline :model="examineForm" ref="examineForm" :rules="examineRule" label-width="100px" class="examine-form">
      <el-form-item label="审核结果" prop="examineRadio">
        <el-radio v-model="examineForm.examineRadio" label="1">通过</el-radio>
        <el-radio v-model="examineForm.examineRadio" label="2">不通过</el-radio>
      </el-form-item>
      <el-form-item label="原因" v-if="examineForm.examineRadio=='2'">
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
  <div class="print-content" v-if="storageDetail!=null" ref="printContent">
    <div class="pur-pri-info">
      <p class="info-title">入库单</p>
      <div class="clearfix">
        <p class="info-unit w33">No.{{storageDetail.warehousingCode}}</p>
        <p class="info-unit w33">入库类型：{{levelObj[storageDetail.typeFlag]}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==1">入库单编号：{{storageDetail.listCode || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==1">供应商：{{storageDetail.supplierName || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==1">联系人：{{storageDetail.contactPerson || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==1">联系电话：{{storageDetail.contactPhone || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==1">交货日期：{{storageDetail.deliveryDate || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==99">单据来源：{{storageDetail.sourceDesc || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==2">盘点单编号：{{storageDetail.listCode || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==3">组装单编号：{{storageDetail.listCode || "-"}}</p>
        <p class="info-unit w33" v-if="storageDetail.typeFlag==4">拆卸单编号：{{storageDetail.listCode || "-"}}</p>
        <p class="info-unit w33">入库仓库：{{storageDetail.warehouseName || "-"}}</p>
        <p class="info-unit w33">入库日期：{{storageDetail.warehousingDate || "-"}}</p>
      </div>
    </div>
    <el-table :data="purchaseList" border style="width: 100%; border:1px solid #EBEEF5; border-color: #868686">
      <el-table-column label="序号" type="index" width="70"></el-table-column>
      <el-table-column label="物资装备名称" prop="resourceName" show-overflow-tooltip></el-table-column>
      <el-table-column label="物资装备编号" prop="resourceCode" width="180"></el-table-column>
      <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="measuringUnit" show-overflow-tooltip></el-table-column>
      <el-table-column label="应到数量" prop="dueQuantity" width="100"></el-table-column>
      <el-table-column label="采购单价" prop="unitPrice" show-overflow-tooltip width="120"></el-table-column>
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
import visBreadcrumb from "_com/breadcrumb.vue"
import examine from "_com/supplies/examine.vue"
import scanCode from "_com/supplies/scanCode.vue"
import { formatDate } from "@/utils/util.js";
import print from 'print-js'
import html2canvas from 'html2canvas'
import { getStorageWarehousingDetail, putStorageWarehousingVerify } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, examine, scanCode },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "入库管理", routerName: "inStorageManage"}, { name: "入库单详情" }],
      dairuku: require("@/assets/img/supplies/dairuku.png"),
      rukuzhong: require("@/assets/img/supplies/rukuzhong.png"),
      daishenhe: require("@/assets/img/supplies/daishenhe.png"),
      yiruku: require("@/assets/img/supplies/yiruku.png"),
      storageDetail:null,
      purchaseList:[],
      examineList:[],
      examineRule:{
        examineRadio:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      levelObj:{1:"采购入库",2:"盘盈入库",3:"组装入库",4:"拆卸入库",99:"其他入库"},
      lifeType:{1:"年",2:"月",3:"日"},
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
          label: '入库物资存在误收情况'
        },
        {
          value: 2,
          label: '入库物资数量有误'
        },
        {
          value: 3,
          label: '入库物资存放位置有误'
        },
        {
          value: 4,
          label: '其他情况'
        },
      ],
      reasonStr:{1:"入库物资存在误收情况", 2:"入库物资数量有误", 3:"入库物资存放位置有误"},
      showScanCode:false,
      codeUid:null,
      categoryUid:null,
      printLoading:false
    }
  },
  mounted() {
    this.getStorageWarehousingDetail()
  },
  methods: {
    //入库详情信息
    getStorageWarehousingDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getStorageWarehousingDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.storageDetail=res.data
          if(res.data.resourceList && res.data.resourceList.length>0){
            that.purchaseList=[]
            res.data.resourceList.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.categoryUid=item.categoryUid
              unit.resourceName=item.resourceName || "-"
              unit.resourceCode=item.resourceCode || "-"
              unit.model=item.model || "-"
              unit.brand=item.brand || "-"
              unit.unitPrice=item.unitPrice || "-"
              unit.measuringUnit=item.measuringUnit || "-"
              unit.dueQuantity=item.dueQuantity || "-"
              unit.shelfLifeValue=item.shelfLifeValue || "-"
              unit.actualQuantity=item.actualQuantity || "-"
              unit.locationFullName=item.locationFullName || "-"
              unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + that.lifeType[parseInt(item.shelfLifeUnitFlag)]
              unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":item.productionDate
              unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":formatDate(item.expireDate, "yyyy-MM-dd")
              unit.totalPrice=item.dueQuantity*item.unitPrice || "-"
              that.purchaseList.push(unit)
            })
          }
          if(res.data.checkList && res.data.checkList.length>0){
            that.examineList=[]
            res.data.checkList.map((obj)=>{
              let unit={}
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
    //查看扫码记录
    lookCodeReCord(obj){
      this.codeUid=obj.uid
      this.categoryUid=obj.categoryUid      
      this.showScanCode=true
    },
    //关闭扫码记录
    closeCode(){
      this.showScanCode=false
    },
    backPre(){
      this.$router.push({ name: "inStorageManage" })
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
    //编辑
    editInStorge(){
      this.$router.push({ name: "addInStorage", query:{uid: this.$route.query.uid, type:'edit'} })
    },
    //显示审核弹窗
    toExamine(){
      this.examineVisible=true
    },
    //审核提交
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
        warehousingUid:that.$route.query.uid,
        checkResultFlag:that.examineForm.examineRadio,
        remark:parseInt(that.examineForm.mReason)!=4? that.reasonStr[parseInt(that.examineForm.mReason)]:that.examineForm.remark
      }
      putStorageWarehousingVerify(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.getStorageWarehousingDetail()
          that.examineVisible=false
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
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
/deep/ .el-dialog__header {
  background: #5458fe;
  border-radius: 8px 8px 0px 0px;
  padding: 15px 30px;
  .el-dialog__title {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
  }
  .el-dialog__headerbtn {
    .el-dialog__close {
      color: #ffffff;
    }
    &:hover {
      .el-dialog__close {
        color: #ffffff;
      }
    }
  }
}
// .examine-form{
//   /deep/ .el-form-item__content{
//     width: calc(100% - 100px);
//   }
// }
</style>
