<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 新增入库单.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <p class="content-t">基本信息</p>
      <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="120px" class="input-content clearfix">
        <el-form-item label="单据编号:" class="fl-unit" v-if="sourceType=='edit'">
          <el-input type="text" v-model="expressForm.warehousingCode" readonly></el-input>
        </el-form-item>
        <el-form-item label="入库类型:" class="fl-unit">
          <el-select v-model="expressForm.typeFlag" @change="selectTypeFlag" :disabled="sourceType=='edit' || fromPurchase">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" :readonly="sourceType=='edit'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购单编号:" class="fl-unit" prop="listCode" v-if="expressForm.typeFlag==1">
          <el-autocomplete placeholder="请输入采购单编号" v-model="expressForm.listCode" :fetch-suggestions="querySearchAsync" @select="handleSelect" :disabled="fromPurchase" @blur="handleInput"></el-autocomplete>
        </el-form-item>
        <el-form-item label="供应商:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-input type="text" placeholder="" v-model="expressForm.supplierName" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系人:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-input type="text" placeholder="" v-model="expressForm.contactPerson" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-input type="text" placeholder="" v-model="expressForm.contactPhone" readonly></el-input>
        </el-form-item>
        <el-form-item label="交货日期:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-date-picker v-model="expressForm.deliveryDate" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions2" readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库仓库:" class="fl-unit" v-if="expressForm.typeFlag==1">
          <el-input type="text" placeholder="" v-model="expressForm.warehouseName" readonly></el-input>
        </el-form-item>
        <el-form-item label="入库日期:" class="fl-unit" prop="warehousingDate" v-if="expressForm.typeFlag==1">
          <el-date-picker v-model="expressForm.warehousingDate" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions2" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据来源:" class="fl-unit" prop="sourceDesc" v-if="expressForm.typeFlag==99" style="position:relative">
          <el-input type="text" placeholder="请输入单据来源" maxlength="20" v-model="expressForm.sourceDesc"></el-input>
          <span class="po-tip">（单据来源用于补充说明入库原因，例如：上级调拨入库）</span>
        </el-form-item>
        <el-form-item label="入库仓库:" class="fl-unit" prop="warehouseotherName" v-if="expressForm.typeFlag==99">
          <el-input type="text" v-model="expressForm.warehouseotherName" readonly></el-input>
        </el-form-item>
        <el-form-item label="入库日期:" class="fl-unit" prop="warehousingotherDate" v-if="expressForm.typeFlag==99">
          <el-date-picker v-model="expressForm.warehousingotherDate" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions2" :clearable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <p class="content-t">入库明细表</p>
      <div class="mid-btn" style="margin-bottom:20px" v-show="expressForm.typeFlag==99">
        <el-button type="primary" @click="chooceGoods">选择物资</el-button>
        <el-button type="primary" @click="batchDel">批量删除</el-button>
      </div>
      <div class="common_table table-scr" v-show="expressForm.typeFlag==1">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" style="margin-bottom:20px;padding-bottom:20px;">
            <el-table-column label="物资名称" prop="resourceName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" width="180"></el-table-column>
            <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="采购单价（元）" prop="commonPrice" width="150"></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="应到数量" prop="dueQuantity" width="100"></el-table-column>
            <el-table-column label="保质期" prop="lifeFlag" width="100"></el-table-column>            
            <el-table-column label="生产日期" width="200">
              <template slot-scope="scope">
                <span v-show="scope.row.lifeFlag=='-'">-</span>
                <div v-show="scope.row.lifeFlag!='-'" class="manu-date">
                  <el-date-picker v-model="scope.row.manufactureDate" type="date" placeholder="选择日期" @change="changeManuDate(scope.row)" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="保质期至" prop="closingDate" width="100"></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>      
      <div class="common_table table-scr" v-show="expressForm.typeFlag==99">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark" @selection-change="handleSelectionChange" style="margin-bottom:20px;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="物资名称" prop="resourceName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" width="180"></el-table-column>
            <!-- <el-table-column label="物资编号" prop="categoryUid" width="180"></el-table-column> -->
            <el-table-column label="规格型号" prop="model" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="采购单价（元）" prop="commonPrice" width="150"></el-table-column>
            <el-table-column label="单位" prop="measuringUnit" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="应到数量" width="200">
              <template slot-scope="scope">
                <el-input type="text" v-model.number="scope.row.dueQuantity" placeholder="请输入应到数量"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="保质期" prop="lifeFlag" width="100"></el-table-column>
            <el-table-column label="生产日期" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.lifeFlag=='-'">-</span>
                <div v-else class="manu-date">
                  <el-date-picker v-model="scope.row.manufactureDate" type="date" placeholder="选择日期" @change="changeManuDate(scope.row)" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="保质期至" prop="closingDate" width="100"></el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="delInStorge(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="saveInStorge" :loading="saveLoading">保存</el-button>
      </div>
    </el-scrollbar>
  </div>
  <select-goods :goodsType="goodsType" :showSelectGoods="showSelectGoods" :title="diaTitle" :selectGoodsList="purchaseList" @closeDialog="closeDialog" @selectGoodsConfirm="selectGoodsConfirm"></select-goods>
</div>
</template>
<script>
import _xorBy from "lodash/xorBy";
import visBreadcrumb from "_com/breadcrumb.vue"
import selectGoods from "_com/supplies/selectGoods.vue"
import { formatDate, qualityPeriod } from "@/utils/util.js";
import { getPurchaseServiceListForWarehousing, getPurchaseServiceDetail, postStorageWarehousing, putStorageWarehousing, getStorageWarehousingDetail } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, selectGoods },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "入库管理", routerName: "inStorageManage"}, { name: "新增入库单" }],
      expressForm:{
        uid:null,
        warehousingCode:null,
        listUid:null,
        listCode:null,
        typeFlag:1,
        supplierName:null,
        contactPerson:null,
        contactPhone:null,
        deliveryDate:null,
        warehouseUid:null,
        warehouseName:null,
        warehousingDate:null,
        sourceDesc:null,
        warehouseotherUid:JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid,
        warehouseotherName:JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].warehouseName,
        warehousingotherDate:null
      },
      expressRule:{
        listCode:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        warehousingDate:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        sourceDesc:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        warehouseotherName:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        warehousingotherDate:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      typeOptions:[
        {
          value: 1,
          label: '采购入库'
        },
        {
          value: 99,
          label: '其他入库'
        },
      ],
      sourceType:'add',
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()-24*60*60*1000
        },
      },
      purchaseList:[],
      showSelectGoods:false,
      diaTitle:"选择入库物资",
      goodsType:"入库",
      selectGoodsUnit:[],
      saveLoading:false,
      lifeType:{1:"年",2:"月",3:"日"},
      editCode:null,
      editArr:[],
      fromPurchase:false,
      purList:[]
    };
  },
  mounted() {
    let that=this
    that.sourceType=that.$route.query.type || 'add'
    if(that.sourceType=="edit"){
      that.breadcrumbData=[{ name: "仓储管理" },{ name: "入库管理", routerName: "inStorageManage"}, { name: "编辑入库单" }],
      that.getStorageWarehousingDetail()
    }
    if(that.$route.query && that.$route.query.purchaseUid){
      that.fromPurchase=true
      //获取采购单详情信息
      let params={
        uid:that.$route.query.purchaseUid
      }
      getPurchaseServiceDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.typeFlag==1
          that.expressForm.listUid=res.data.uid
          that.expressForm.listCode=res.data.purchaseCode
          that.expressForm.supplierName=res.data.supplierName
          that.expressForm.contactPerson=res.data.contactPerson
          that.expressForm.contactPhone=res.data.contactPhone
          that.expressForm.deliveryDate=res.data.deliveryDate
          that.expressForm.warehouseUid=res.data.warehouseUid
          that.expressForm.warehouseName=res.data.warehouseName
          if(res.data.resourceList && res.data.resourceList.length>0){
            res.data.resourceList.map((item)=>{
              let unit={}
              unit.purchaseResourceUid=item.uid
              unit.resourceName=item.resourceName || "-"
              unit.resourceCode=item.resourceCode || "-"
              unit.categoryUid=item.categoryUid
              unit.model=item.model || "-"
              unit.brand=item.brand || "-"
              unit.commonPrice=item.purchaseUnitPrice || "-"
              unit.measuringUnit=item.measuringUnit || "-"
              unit.dueQuantity=item.purchaseNum || "-"
              unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + this.lifeType[parseInt(item.shelfLifeUnitFlag)]
              unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":null
              unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":"-"
              unit.shelfLifeValue=item.shelfLifeValue
              unit.shelfLifeFlag=item.shelfLifeFlag
              unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
              that.purchaseList.push(unit)
            })
            this.editArr=JSON.parse(JSON.stringify(that.purchaseList))
          }          
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    }
  },
  methods: {
    //编辑获取详情
    getStorageWarehousingDetail(){
      let that=this
      let params={
        uid:that.$route.query.uid
      }
      getStorageWarehousingDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.uid=res.data.uid
          that.expressForm.warehousingCode=res.data.warehousingCode
          that.expressForm.listUid=res.data.listUid
          that.expressForm.listCode=res.data.listCode
          that.expressForm.typeFlag=parseInt(res.data.typeFlag)
          if(that.expressForm.typeFlag==1){
            that.expressForm.supplierName=res.data.supplierName
            that.expressForm.contactPerson=res.data.contactPerson
            that.expressForm.contactPhone=res.data.contactPhone
            that.expressForm.deliveryDate=res.data.deliveryDate
            that.expressForm.warehouseUid=res.data.warehouseUid
            that.expressForm.warehouseName=res.data.warehouseName
            that.expressForm.warehousingDate=res.data.warehousingDate
          }else{
            that.expressForm.sourceDesc=res.data.sourceDesc
            that.expressForm.warehouseotherUid=res.data.warehouseUid
            that.expressForm.warehouseotherName=res.data.warehouseName
            that.expressForm.warehousingotherDate=res.data.warehousingDate
          }
          res.data.resourceList.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.categoryUid=item.categoryUid || "-"
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.commonPrice=item.unitPrice || "-"
            unit.measuringUnit=item.measuringUnit || "-"
            unit.dueQuantity=item.dueQuantity || "-"
            unit.shelfLifeValue=item.shelfLifeValue || "-"
            unit.shelfLifeFlag=item.shelfLifeFlag
            // unit.actualQuantity=item.actualQuantity || "-"
            unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + that.lifeType[parseInt(item.shelfLifeUnitFlag)]
            unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":item.productionDate
            unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":formatDate(item.expireDate, "yyyy-MM-dd")
            that.purchaseList.push(unit)
          })
          this.editCode=that.expressForm.listCode
          this.editArr=JSON.parse(JSON.stringify(that.purchaseList))
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //查询采购单列表
    querySearchAsync(queryString, cb){
      let params={
        "where.listCode": queryString,
        "pageNum": 1,
        "pageSize": 10000,
      }
      getPurchaseServiceListForWarehousing(params).then((res)=>{
        if(res && res.code==="00000000") {
          let purList=[]
          res.data.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.value=item.purchaseCode
            purList.push(unit)
          })
          this.purList=purList
          cb(purList)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //选择采购单编号获取采购单详情
    handleSelect(item){
      this.$refs.expressForm.clearValidate('listCode')
      this.expressForm.listUid=item.uid
      this.expressForm.listCode=item.value
      if(this.sourceType=="edit" && this.editCode==item.value){
        this.purchaseList=this.editArr
      }else{
        let params={
          uid:item.uid
        }
        this.purchaseList=[]
        getPurchaseServiceDetail(params).then((res)=>{
          if(res && res.code==="00000000") {
            this.expressForm.supplierName=res.data.supplierName
            this.expressForm.contactPerson=res.data.contactPerson
            this.expressForm.contactPhone=res.data.contactPhone
            this.expressForm.deliveryDate=res.data.deliveryDate
            this.expressForm.warehouseUid=res.data.warehouseUid
            this.expressForm.warehouseName=res.data.warehouseName
            if(res.data.resourceList&& res.data.resourceList.length>0){
              res.data.resourceList.forEach((item)=>{
                let unit={}
                unit.purchaseResourceUid=item.uid
                unit.resourceName=item.resourceName || "-"
                unit.resourceCode=item.resourceCode || "-"
                unit.model=item.model || "-"
                unit.brand=item.brand || "-"
                unit.commonPrice=item.purchaseUnitPrice || "-"
                unit.measuringUnit=item.measuringUnit || "-"
                unit.dueQuantity=item.purchaseNum || "-"
                unit.categoryUid=item.categoryUid || "-" 
                unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + this.lifeType[parseInt(item.shelfLifeUnitFlag)]
                unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":null
                unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":"-"
                unit.shelfLifeValue=item.shelfLifeValue
                unit.shelfLifeFlag=item.shelfLifeFlag
                unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
                this.purchaseList.push(unit)
              })
            }                  
          }
        }).catch((error)=>{
          console.log("接口报错=>",error)
        })
      }
    },
    handleInput(){
      const that=this
      setTimeout(() => {
        if(that.purList && that.purList.length>0){
          let purValidat=false
          that.purList.map((item)=>{
            if(item.value==that.expressForm.listCode){
              purValidat=true
            }
          })
          if(that.expressForm.listCode==null || that.expressForm.listCode==""){
            this.expressForm.supplierName=null
            this.expressForm.contactPerson=null
            this.expressForm.contactPhone=null
            this.expressForm.deliveryDate=null
            this.expressForm.warehouseUid=null
            this.expressForm.warehouseName=null
            this.purchaseList=[]
          }else if(that.expressForm.listCode.length>0 && !purValidat){
            this.expressForm.supplierName=null
            this.expressForm.contactPerson=null
            this.expressForm.contactPhone=null
            this.expressForm.deliveryDate=null
            this.expressForm.warehouseUid=null
            this.expressForm.warehouseName=null
            this.purchaseList=[]
            that.$message({
              message: "请输入正确的采购单编号",
              type: 'warning'
            })
          }
        }        
      }, 500);
    },
    //选择物资明细生产日期
    changeManuDate(obj){
      obj.closingDate=qualityPeriod(formatDate(obj.manufactureDate, "yyyy-MM-dd"), obj.shelfLifeValue, parseInt(obj.shelfLifeUnitFlag))
    },
    //切换入库类型
    selectTypeFlag(){
      this.expressForm.listUid=null
      this.expressForm.listCode=null
      this.expressForm.supplierName=null
      this.expressForm.contactPerson=null
      this.expressForm.contactPhone=null
      this.expressForm.deliveryDate=null
      this.expressForm.warehouseName=null
      this.expressForm.warehousingDate=null
      this.expressForm.sourceDesc=null
      this.expressForm.warehouseotherUid=JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid
      this.expressForm.warehouseotherName=JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].warehouseName
      this.expressForm.warehousingotherDate=null
      this.purchaseList=[]
    },
    chooceGoods(){
      this.showSelectGoods=true
    },
    closeDialog(){
      this.showSelectGoods=false
    },
    //选择物资提交
    selectGoodsConfirm(v){
      const that=this
      let tempList=JSON.parse(JSON.stringify(that.purchaseList))
      this.purchaseList=[]
      if(v && v.length>0){
        v.map((item)=>{
          let unit={}
          unit.resourceName=item.resourceName || "-"
          unit.resourceCode=item.resourceCode || "-"
          unit.model=item.model || "-"
          unit.brand=item.brand || "-"
          unit.commonPrice=item.unitPrice || "-"
          unit.measuringUnit=item.measuringUnitName || "-"
          unit.categoryUid=item.uid || null
          unit.dueQuantity=null
          unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + that.lifeType[parseInt(item.shelfLifeUnitFlag)]
          unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":null
          unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":"-"
          unit.shelfLifeValue=item.shelfLifeValue
          unit.shelfLifeFlag=item.shelfLifeFlag
          unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
          that.purchaseList.push(unit)
        })
        if(that.sourceType=='edit'){
          that.purchaseList.map((item)=>{
            tempList.map((obj)=>{
              if(item.resourceCode==obj.resourceCode){
                item.uid=obj.uid
                item.dueQuantity=obj.dueQuantity
                item.lifeFlag=obj.lifeFlag
                item.model=obj.model
                item.brand=obj.brand
                item.measuringUnit=obj.measuringUnit
                item.manufactureDate=obj.manufactureDate
                item.closingDate=obj.closingDate
                item.commonPrice=obj.commonPrice
                item.categoryUid=obj.categoryUid
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
    //多项选择
    handleSelectionChange(v){
      this.selectGoodsUnit=v
    },
    //列表删除
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
    backPre(){
      this.$router.push({ name: "inStorageManage" })
    },
    saveInStorge(){
      let that=this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          let purchaseValid=false, numValid=false, numReg = /^\d+$/
          //判断“生产日期”必填
          if(that.purchaseList.length==0){
            that.$message({
              message: "入库明细不能为空",
              type: 'warning'
            })
            return
          }
          that.purchaseList.map((item)=>{
            if(parseInt(item.shelfLifeFlag)!=0 && item.closingDate=='-'){
              purchaseValid=true
            }
            if(that.expressForm.typeFlag==99){
              if(!item.dueQuantity || !parseInt(item.dueQuantity) || !numReg.test(item.dueQuantity)){
                numValid=true
              }
            }
          })
          if(purchaseValid){
            that.$message({
              message: "物资生产日期不能为空",
              type: 'warning'
            })
            return
          }
          if(numValid){
            that.$message({
              message: "物资应到数量范围为1~9999",
              type: 'warning'
            })
            return
          }
          if(that.sourceType=="edit" && that.editArr.length>0){
            that.purchaseList.map((item)=>{
              that.editArr.map((obj)=>{
                if(item.resourceCode==obj.resourceCode){
                  item.uid=obj.uid
                }
              })
            })
          }
          let resourceList=[]
          that.purchaseList.map((item)=>{
            let unit={}
            unit.uid=that.sourceType=='edit'?item.uid:null
            unit.purchaseResourceUid=item.purchaseResourceUid?item.purchaseResourceUid:null
            unit.categoryUid=item.categoryUid
            unit.dueQuantity=item.dueQuantity=='-'? null: item.dueQuantity
            unit.productionDate=parseInt(item.shelfLifeFlag)==0?null:formatDate(item.manufactureDate, "yyyy-MM-dd")
            resourceList.push(unit)
          })
          let warehousingDate = that.expressForm.warehousingDate || that.expressForm.warehousingotherDate
          let params={}
          params.uid=that.expressForm.uid || null
          params.typeFlag=that.expressForm.typeFlag
          params.listUid=that.expressForm.listUid || null
          params.warehouseUid	=that.expressForm.warehouseUid || that.expressForm.warehouseotherUid
          params.warehousingDate= warehousingDate? formatDate(warehousingDate, "yyyy-MM-dd"): null
          params.sourceDesc=that.expressForm.sourceDesc || null
          params.resourceList=resourceList
          that.saveLoading=true
          if(that.sourceType=='add'){
            postStorageWarehousing(params).then((res)=>{
              that.saveLoading=false
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                this.$router.push({ name: "inStorageManage", query:{refresh:true} })
              }
            }).catch((error)=>{
              that.saveLoading=false
              console.log("接口报错=>",error)
            })
          }else if(that.sourceType=='edit'){
            putStorageWarehousing(params).then((res)=>{
              that.saveLoading=false
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                that.$router.push({ name: "inStorageManage" })
              }
            }).catch((error)=>{
              that.saveLoading=false
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
  /deep/ .el-autocomplete{
    width: 100%;
  }
}
.manu-date{
  /deep/ .el-date-editor.el-input{
    width: 160px;
    height: 40px;
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
  /deep/ .el-scrollbar{
    overflow:auto;
    overflow-y: hidden !important; 
    overflow-x: hidden;
  }
  /deep/ .el-table{
    padding-bottom: 0px !important;
  }
}
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
