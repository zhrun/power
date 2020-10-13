<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 新增出库单.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <p class="content-t">基本信息</p>
      <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="120px" class="input-content clearfix">
        <el-form-item label="单据编号:" class="fl-unit" v-if="sourceType=='edit'">
          <el-input type="text" v-model="expressForm.outdeliveryCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="出库类型:" class="fl-unit">
          <el-select v-model="expressForm.typeFlag" @change="selectTypeFlag" :disabled="sourceType=='edit'">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据来源:" class="fl-unit" prop="sourceDesc" v-if="expressForm.typeFlag==1" style="position:relative">
          <el-input type="text" placeholder="请输入单据来源" maxlength="20" v-model="expressForm.sourceDesc" :disabled="sourceType=='edit' && statusFlag!='1'"  @blur="validSource"></el-input>
          <span class="po-tip" v-if="sourceType=='add'" :style="clientWidth>1750?(showSource?'bottom: -45px;':'bottom: -25px;'):(showSource?'bottom: -65px;':'bottom: -45px;')">（单据来源用于补充说明出库原因，例如：报废原因）</span>
        </el-form-item>
        <el-form-item label="单据来源:" class="fl-unit" prop="sourceotherDesc" v-if="expressForm.typeFlag==99" style="position:relative">
          <el-input type="text" placeholder="请输入单据来源" maxlength="20" v-model="expressForm.sourceotherDesc" :disabled="sourceType=='edit' && statusFlag!='1'"  @blur="validOtherSource"></el-input>
          <span class="po-tip" v-if="sourceType=='add'" :style="clientWidth>1750?(showOtherSource?'bottom: -45px;':'bottom: -25px;'):(showOtherSource?'bottom: -65px;':'bottom: -45px;')">（单据来源用于补充说明出库原因，例如：报废原因）</span>
        </el-form-item>
        <el-form-item label="出库仓库:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-input type="text" v-model="expressForm.warehouseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="出库仓库:" class="fl-unit" v-if="expressForm.typeFlag==99">
          <el-input type="text" v-model="expressForm.warehouseotherName" disabled></el-input>
        </el-form-item>
        <el-form-item label="出库日期:" class="fl-unit" prop="outdeliverDate" v-if="expressForm.typeFlag==1">
          <el-date-picker v-model="expressForm.outdeliverDate" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions1" :disabled="sourceType=='edit' && statusFlag!='1'" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库日期:" class="fl-unit" prop="outdeliverOtherDate" v-if="expressForm.typeFlag==99">
          <el-date-picker v-model="expressForm.outdeliverOtherDate" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions1" :disabled="sourceType=='edit' && statusFlag!='1'" :clearable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <p class="content-t">出库明细表</p>
      <div class="mid-btn" style="margin-bottom:20px" v-if="sourceType=='add' || (sourceType=='edit' && statusFlag=='1')">
        <el-button type="primary" @click="chooceGoods">选择物资</el-button>
        <el-button type="primary" @click="batchDel">批量删除</el-button>
      </div>
      <div class="common_table table-scr">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" v-if="sourceType=='add' || (sourceType=='edit' && statusFlag=='1')" key="selection"></el-table-column>
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" width="160"></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" width="80"></el-table-column>
            <el-table-column label="库存总数" prop="actualWarehouseResourceStorage" width="100"></el-table-column>
            <el-table-column label="可用库存" prop="actualAvailableStorage" width="100"></el-table-column>
            <el-table-column label="应出数量" width="200">
              <template slot-scope="scope">
                <span v-if="sourceType=='edit' && (statusFlag=='2' || statusFlag=='3' || statusFlag=='4')">{{scope.row.outdeliveryValue}}</span>
                <el-input type="text" v-model="scope.row.outdeliveryValue" placeholder="请输入应出数量" v-else></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right" v-if="sourceType=='add' || (sourceType=='edit' && statusFlag=='1')">
              <template slot-scope="scope">
                <span class="operation_btn" @click="delInStorge(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <p class="content-t" style="margin-bottom:40px">运输信息</p>
      <el-form label-width="120px" class="input-content clearfix" :rules="expressRule">
        <el-form-item label="接收单位:" class="fl-unit">
          <el-input type="text" v-model="expressForm.receivingUnit" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="运输目的地:" class="fl-unit">
          <el-input type="text" v-model="expressForm.receivingAddress" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="承运单位:" class="fl-unit">
          <el-input type="text" v-model="expressForm.transportUnit" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="运输方式:" class="fl-unit">
          <el-select v-model="expressForm.transportMode">
            <el-option v-for="item in transOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输线路:" class="fl-unit">
          <el-input type="text" v-model="expressForm.transportRoute" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="计划到达时间:" class="fl-unit">
          <el-date-picker v-model="expressForm.scheduledArrivalTime" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人:" class="fl-unit">
          <el-input type="text" v-model="expressForm.receivingContactPerson" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" class="fl-unit" prop="receivingContactPhone">
          <el-input type="text" v-model.number="expressForm.receivingContactPhone" maxlength="13"></el-input>
        </el-form-item>
        <el-form-item label="备注:" class="full-unit">
          <el-input type="textarea" :rows="4" placeholder="请输入备注" maxlength="100" show-word-limit v-model="expressForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="saveOutStorge">保存</el-button>
      </div>
    </el-scrollbar>
  </div>
  <select-goods :title="diaTitle" :goodsType="goodsType" :showSelectGoods="showSelectGoods" @closeDialog="closeDialog" :selectGoodsList="purchaseList" @selectGoodsConfirm="selectGoodsConfirm"></select-goods>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import selectGoods from "_com/supplies/selectGoods.vue"
import _xorBy from "lodash/xorBy"
import {validatePhone} from '@/utils/validator.js'
import { formatDate } from "@/utils/util.js";
import { postOutDeliveryOrder, putOutDeliveryOrder, getOutDeliveryOrderDetail } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, selectGoods },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "出库管理", routerName: "outStorageManage"}, { name: "新增出库单" }],
      expressForm:{
        uid:null,
        outdeliveryCode:null,
        typeFlag:99,
        sourceDesc:null,
        sourceotherDesc:null,
        warehouseUid:null,
        warehouseName:null,
        warehouseotherUid:null,
        warehouseotherName:null,
        outdeliverDate:null,
        outdeliverOtherDate:null,
        receivingUnit:null,//接收单位
        receivingAddress:null,//运输目的地
        transportUnit:null,//承运单位
        transportMode:1,//运输方式(1汽车 2火车 3空运)
        transportRoute:null,//运输路线
        scheduledArrivalTime:null,//计划到达时间
        receivingContactPerson:null,//联系人
        receivingContactPhone:null,//联系人电话
        remark:null   //备注
      },
      expressRule:{
        sourceDesc:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        sourceotherDesc:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        outdeliverDate:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        outdeliverOtherDate:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        receivingContactPhone:[
          // {required: true, message: '此项为必填项', trigger: 'blur'},
          {validator: validatePhone, message: '电话号码格式错误', trigger: 'blur' }
        ]
      },
      typeOptions:[
        {
          value: 1,
          label: '报废出库'
        },
        {
          value: 99,
          label: '其他出库'
        }
      ],
      showSelectGoods:false,
      diaTitle:"选择报废物资",
      goodsType:"出库",
      selectGoodsUnit:[],
      sourceType:null,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()-24*60*60*1000
        },
      },
      purchaseList:[],
      showModule:false,
      transOptions: [
        {
          value: 1,
          label: '汽车'
        },
        {
          value: 2,
          label: '火车'
        },
        {
          value: 3,
          label: '空运'
        }
      ],
      statusFlag:null,
      detailList:[],
      clientWidth:null,
      showSource:false,
      showOtherSource:false
    };
  },
  mounted() {
    this.clientWidth=parseInt(document.body.clientWidth)
    this.sourceType=this.$route.query.type || 'add'
    let warehouseList=localStorage.getItem('current_user_warehouse_list')? JSON.parse(localStorage.getItem('current_user_warehouse_list')): null
    if(warehouseList && warehouseList.length>0){      
      this.expressForm.warehouseUid=warehouseList[0].uid
      this.expressForm.warehouseName=warehouseList[0].warehouseName
      this.expressForm.warehouseotherUid=warehouseList[0].uid
      this.expressForm.warehouseotherName=warehouseList[0].warehouseName
    }
    if(this.sourceType=="edit"){
      this.breadcrumbData=[{ name: "仓储管理" },{ name: "出库管理", routerName: "outStorageManage"}, { name: "编辑出库单" }]
      this.getOutDeliveryOrderDetail()
    }
  },
  methods: {
    //获取出库详情信息
    getOutDeliveryOrderDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getOutDeliveryOrderDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.uid=res.data.uid
          that.expressForm.outdeliveryCode=res.data.outdeliveryCode
          that.expressForm.typeFlag=parseInt(res.data.typeFlag)
          that.expressForm.sourceDesc=that.expressForm.typeFlag==1?res.data.sourceDesc:null
          that.expressForm.sourceotherDesc=that.expressForm.typeFlag==1?null:res.data.sourceDesc
          that.expressForm.warehouseUid=that.expressForm.typeFlag==1?res.data.warehouseUid:null
          that.expressForm.warehouseotherUid=that.expressForm.typeFlag==1?null:res.data.warehouseUid
          that.expressForm.warehouseName=that.expressForm.typeFlag==1?res.data.warehouseName:null
          that.expressForm.warehouseotherName=that.expressForm.typeFlag==1?null:res.data.warehouseName
          that.expressForm.outdeliverDate=that.expressForm.typeFlag==1?res.data.outdeliverDate:null
          that.expressForm.outdeliverOtherDate=that.expressForm.typeFlag==1?null:res.data.outdeliverDate
          //运输信息
          that.expressForm.receivingUnit=res.data.receivingUnit
          that.expressForm.receivingAddress=res.data.receivingAddress
          that.expressForm.transportUnit=res.data.transportUnit
          that.expressForm.transportMode=parseInt(res.data.transportMode)
          that.expressForm.transportRoute=res.data.transportRoute
          that.expressForm.scheduledArrivalTime=res.data.scheduledArrivalTime
          that.expressForm.receivingContactPerson=res.data.receivingContactPerson
          that.expressForm.receivingContactPhone=res.data.receivingContactPhone
          that.expressForm.remark=res.data.remark
          that.statusFlag=res.data.statusFlag
          res.data.resourceList.map((item)=>{
            let unit={}
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.categoryUid=item.categoryUid || "-"
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.measuringUnit=item.measuringUnit || "-"
            unit.actualWarehouseResourceStorage=item.actualWarehouseResourceStorage || "-"
            unit.actualAvailableStorage=item.actualAvailableStorage || "-"
            unit.outdeliveryValue=item.outdeliveryValue || "-"
            that.purchaseList.push(unit)
          })
          that.detailList=JSON.parse(JSON.stringify(that.purchaseList)) 
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    selectTypeFlag(v){
      this.expressForm.typeFlag=v
      // this.expressForm.sourceDesc=null
      // this.expressForm.sourceotherDesc=null
      // this.expressForm.outdeliverDate=null
      // this.expressForm.outdeliverOtherDate=null
      this.purchaseList=[]
    },
    validSource(){
      if(this.expressForm.sourceDesc==null || this.expressForm.sourceDesc==""){
        this.showSource=true
      }else{
        this.showSource=false
      }
    },
    validOtherSource(){
      if(this.expressForm.sourceotherDesc==null || this.expressForm.sourceotherDesc==""){
        this.showOtherSource=true
      }else{
        this.showOtherSource=false
      }
    },
    chooceGoods(){
      this.showSelectGoods=true
    },
    closeDialog(){
      this.showSelectGoods=false
    },
    selectGoodsConfirm(v){
      const that=this
      let tempList=JSON.parse(JSON.stringify(that.purchaseList))
      that.purchaseList=[]
      if(v && v.length>0){
        v.map((item)=>{
          let unit={}
          unit.categoryUid=item.uid
          unit.resourceName=item.resourceName || "-"
          unit.resourceCode=item.resourceCode || "-"
          unit.model=item.model || "-"
          unit.brand=item.brand || "-"
          unit.measuringUnit=item.measuringUnitName || "-"
          unit.storage=item.storage || "-" 
          unit.actualWarehouseResourceStorage=item.resourceStorage || "-" 
          unit.actualAvailableStorage=item.availableStorage || "-" 
          unit.outdeliveryValue=null
          that.purchaseList.push(unit)
        })
        if(that.sourceType=='edit' && that.statusFlag=='1'){
          that.purchaseList.map((item)=>{
            tempList.map((obj)=>{
              if(item.resourceCode==obj.resourceCode){
                item.outdeliveryValue=obj.outdeliveryValue
              }
            })
          })
        }
      }
    },
    //批量删除
    batchDel(){
      let that = this
      if(that.selectGoodsUnit.length==0){
        that.$message({
          message: "请选择物资！",
          type: 'warning'
        })
        return
      }
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.purchaseList=_xorBy(that.purchaseList, that.selectGoodsUnit, 'resourceCode')
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    delInStorge(obj){
      let that = this
      let objArr=[obj]
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.purchaseList=_xorBy(that.purchaseList, objArr, 'resourceCode')
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    handleSelectionChange(v){
      this.selectGoodsUnit=v
    },
    backPre(){
      this.$router.push({ name: "outStorageManage" })
    },
    saveOutStorge(){
      let that=this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(that.purchaseList.length==0){
            that.$message({
              message: "出库明细不能为空",
              type: 'warning'
            })
            return
          }
          if(that.sourceType=='edit' && that.statusFlag=='1'){

            if(that.expressForm.typeFlag==1){
              if(new Date(that.expressForm.outdeliverDate).getTime()<new Date().getTime()-24*60*60*1000){
                that.$message({
                  message: "出库日期必须为今天或今天以后！",
                  type: 'warning'
                })
                return
              }
            }else{
              if(new Date(that.expressForm.outdeliverOtherDate).getTime()<new Date().getTime()-24*60*60*1000){
                that.$message({
                  message: "出库日期必须为今天或今天以后！",
                  type: 'warning'
                })
                return
              }
            }
            if(that.expressForm.scheduledArrivalTime && new Date(that.expressForm.scheduledArrivalTime).getTime()<new Date().getTime()-24*60*60*1000){
              that.$message({
                message: "计划到达时间必须为今天或今天以后！",
                type: 'warning'
              })
              return
            }
          }
          let numValid=false, isBigTotal=false, numReg = /^\d+$/
          that.purchaseList.map((item)=>{
            if(!item.outdeliveryValue || !parseInt(item.outdeliveryValue) || !numReg.test(item.outdeliveryValue)){
              numValid=true
            }
            if(item.outdeliveryValue && item.actualAvailableStorage<item.outdeliveryValue){
              isBigTotal=true
            }
          })
          if(numValid){
            that.$message({
              message: "物资应出数量范围为1~9999",
              type: 'warning'
            })
            return
          }
          if(isBigTotal){
            that.$message({
              message: "物资应出数量不能大于可用库存",
              type: 'warning'
            })
            return
          }
          let resourceList=[]
          that.purchaseList.map((item)=>{
            let unit={}
            // unit.uid=item.uid?item.uid:null
            unit.categoryUid=item.categoryUid
            unit.availableStorage=item.actualAvailableStorage
            unit.outdeliveryValue=parseInt(item.outdeliveryValue)
            resourceList.push(unit)
          })
          let outdeliverDate=that.expressForm.outdeliverDate || that.expressForm.outdeliverOtherDate
          let params={}
          params.uid=that.expressForm.uid || null          
          params.outdeliveryCode=that.expressForm.outdeliveryCode || null
          params.typeFlag=that.expressForm.typeFlag.toString()
          params.sourceDesc=that.expressForm.sourceDesc || that.expressForm.sourceotherDesc
          params.warehouseUid=that.expressForm.warehouseUid || that.expressForm.warehouseotherUid
          params.outdeliverDate=outdeliverDate?formatDate(outdeliverDate, "yyyy-MM-dd"):null
          params.resourceList=resourceList
          //运输信息
          params.receivingUnit=that.expressForm.receivingUnit || null
          params.receivingAddress=that.expressForm.receivingAddress || null
          params.transportUnit=that.expressForm.transportUnit || null
          params.transportMode=that.expressForm.transportMode || null
          params.transportRoute=that.expressForm.transportRoute || null
          params.scheduledArrivalTime=that.expressForm.scheduledArrivalTime? formatDate(that.expressForm.scheduledArrivalTime, "yyyy-MM-dd"):null
          params.receivingContactPerson=that.expressForm.receivingContactPerson || null
          params.receivingContactPhone=that.expressForm.receivingContactPhone || null
          params.remark=that.expressForm.remark || null  
          if(this.sourceType=="add"){
            postOutDeliveryOrder(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                this.$router.push({ name: "outStorageManage", query:{refresh:true} })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
            })
          }else{
            putOutDeliveryOrder(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                that.$router.push({ name: "outStorageManage" })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
            })
          }
        }else{
          return
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.fl-unit{
  /deep/ .el-select{
    width: 100%;
  }
  /deep/ .el-date-editor.el-input{
    width: 100%;
  }
}
.po-tip{
  position: absolute;
  bottom: -45px;
  left: 0px;
  z-index: 10;
  font-size: 12px;
  color: #999999;
  line-height: 20px;
}
.mid-btn{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.table-scr{
  /deep/ .el-scrollbar__wrap{
    margin-bottom: 0px !important;
  }
}
.input-content{
    border-bottom: 0px solid #E1E1E1;
}
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
