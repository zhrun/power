<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 新增组装和拆卸.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <p class="content-t">基本信息</p>
      <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="120px" class="input-content clearfix">
        <el-form-item label="单据类型:" class="fl-unit" prop="typeFlag">
          <el-select v-model="expressForm.typeFlag" :disabled="sourceType=='edit'" @change="changeTypeFlag">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作日期:" class="fl-unit" v-if="expressForm.typeFlag==2" prop="operationTime">
          <el-date-picker v-model="expressForm.operationTime" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions1" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作日期:" class="fl-unit" v-if="expressForm.typeFlag==1" prop="operationotherTime">
          <el-date-picker v-model="expressForm.operationotherTime" type="date" format="yyyy-MM-dd" placeholder="年/月/日"  :picker-options="pickerOptions1" :clearable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="su-com-title" style="margin-bottom:20px;">
        <span class="title">组合件物资</span>
        <span class="time">{{expressForm.typeFlag==2?"（出库物资）":"（入库物资）"}}</span>
      </div>
      <div class="mid-btn" style="margin-bottom:20px">
        <el-button type="primary" @click="expressForm.typeFlag==2?outStrange('组合'):putInDtrange('组合')">选择物资</el-button>
      </div>
      <div class="common_table table-scr" style="height:150px">
        <el-scrollbar style="height:100%;">
        <el-table :data="zuheList" tooltip-effect="dark" v-if="expressForm.typeFlag==1">
          <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用数量">1</el-table-column>
          <el-table-column label="保质期" prop="lifeFlag"></el-table-column>
          <el-table-column label="生产日期" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.lifeFlag=='-'">-</span>
              <div v-else class="manu-date">
                <el-date-picker v-model="scope.row.manufactureDate" type="date" placeholder="选择日期" @change="changeManuDate(scope.row)" :picker-options="pickerOptions2" :clearable="false"></el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="保质期至" prop="closingDate" width="100"></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="delZuhe(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="zuheList" tooltip-effect="dark" v-if="expressForm.typeFlag==2">
          <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="可用库存" prop="availableStorage" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用数量">1</el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="delZuhe(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
      </div>
      <div class="su-com-title" style="margin-bottom:20px;">
        <span class="title">子件物资</span>
        <span class="time">{{expressForm.typeFlag==1?"（出库物资）":"（入库物资）"}}</span>
      </div>
      <div class="mid-btn" style="margin-bottom:20px">
        <el-button type="primary" @click="expressForm.typeFlag==1?outStrange():putInDtrange()">选择物资</el-button>
      </div>
      <div class="common_table table-scr">
        <el-scrollbar style="height:100%;">
        <el-table :data="zijianList" tooltip-effect="dark" v-if="expressForm.typeFlag==1">
          <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用数量" width="200">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.goodsNum" placeholder="请输入使用数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="可用库存" prop="availableStorage"></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="delZijian(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="zijianList" tooltip-effect="dark" v-if="expressForm.typeFlag==2">
          <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用数量" width="200">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.goodsNum" placeholder="请输入使用数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="保质期" prop="lifeFlag"></el-table-column>
          <el-table-column label="生产日期" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.lifeFlag=='-'">-</span>
              <div v-else class="manu-date">
                <el-date-picker v-model="scope.row.manufactureDate" type="date" placeholder="选择日期" @change="changeZiManuDate(scope.row)" :picker-options="pickerOptions2" :clearable="false"></el-date-picker>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="保质期至" prop="closingDate" width="100"></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="delZijian(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
      </div>
      <div class="bottom-btn">
        <el-button @click="backPre">返回</el-button>
        <el-button type="primary" @click="saveConfirm" :loading="saveLoading">保存</el-button>
      </div>
    </el-scrollbar>
  </div>
  <select-goods :goodsType="goodsType" :showSelectGoods="showSelectGoods" :title="diaTitle" @closeDialog="closeDialog" :selectGoodsList="commonList" @selectGoodsConfirm="selectGoodsConfirm"></select-goods>
</div>
</template>
<script>
import _xorBy from "lodash/xorBy"
import visBreadcrumb from "_com/breadcrumb.vue"
import selectGoods from "_com/supplies/selectGoods.vue"
import { formatDate, qualityPeriod } from "@/utils/util.js";
import { getCombineOrder, postCombineOrder, putCombineOrder } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, selectGoods },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "组装和拆卸管理", routerName: "aAndDManage"}, { name: "新增组装和拆卸" }],
      expressForm:{
        uid:null,
        combineCode:null,
        typeFlag:2,
        operationTime:null,
        operationotherTime:null,
      },
      expressRule:{
        typeFlag:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        operationTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        operationotherTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      typeOptions:[
        {
          value: 1,
          label: '组装单'
        },
        {
          value: 2,
          label: '拆卸单'
        },
      ],
      sourceType:null,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()-24*60*60*1000
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        },
      },
      zuheList:[],
      zijianList:[],
      showSelectGoods:false,
      diaTitle:"",
      goodsType:"",
      selectGoodsUnit:[],
      lifeType:{1:"年",2:"月",3:"日"},
      saveLoading:false,
      commonList:[]
    };
  },
  mounted() {
    this.sourceType=this.$route.query.type || 'add'
    if(this.$route.query.type=="edit"){
      this.breadcrumbData=[{ name: "仓储管理" },{ name: "组装和拆卸管理", routerName: "aAndDManage"}, { name: "编辑组装和拆卸" }]
      this.getCombineOrder()
    }
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
        that.expressForm.uid=res.data.uid
        that.expressForm.combineCode=res.data.combineCode
        that.expressForm.typeFlag=parseInt(res.data.typeFlag)
        that.expressForm.operationTime=res.data.operationTime
        that.expressForm.operationotherTime=res.data.operationTime
        if(res.data.resourceList && res.data.resourceList.length>0){
          res.data.resourceList.map((item)=>{
            let unit={}
            unit.typeFlag=item.typeFlag
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.categoryUid=item.categoryUid
            unit.combineUid=item.combineUid
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.measuringUnitName=item.measuringUnitName || "-"
            unit.availableStorage=item.availableStorage || "-"
            unit.goodsNum=item.goodsNum || "-"
            unit.manufactureDate=item.productionDate || null
            unit.lifeFlag=item.expireDesc || "-"
            unit.shelfLifeValue=item.shelfLifeValue
            unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
            unit.shelfLifeFlag=item.shelfLifeFlag
            unit.closingDate=item.expireDate?formatDate(item.expireDate, "yyyy-MM-dd"):"-"
            if(item.typeFlag==1){
              that.zuheList.push(unit)
            }else{
              that.zijianList.push(unit)
            }
          })
        }
      })
    },
    outStrange(t){
      this.diaTitle= t=='组合'? "选择组合件物资": "选择子件物资"
      this.goodsType = t=='组合'? "组合出库": "出库"
      this.commonList= t=='组合'? this.zuheList: this.zijianList
      this.showSelectGoods=true
    },
    putInDtrange(t){
      this.diaTitle= t=='组合'? "选择组合件物资": "选择子件物资"
      this.goodsType = t=='组合'? "组合入库": "入库"
      this.commonList= t=='组合'? this.zuheList: this.zijianList
      this.showSelectGoods=true
    },
    changeTypeFlag(){
      this.zuheList=[]
      this.zijianList=[]
    },
    closeDialog(){
      this.showSelectGoods=false
    },
    selectGoodsConfirm(v){
      const that=this
      if(v && v.length>0){
        if(that.diaTitle.indexOf('组合')>-1){
          let tempZuhe=JSON.parse(JSON.stringify(that.zuheList))
          that.zuheList=[]
          v.map((item)=>{
            let unit={}
            unit.uid=item.uid || item.categoryUid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.categoryUid=item.uid || item.categoryUid
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.measuringUnitName=item.measuringUnitName || "-"
            unit.availableStorage=item.availableStorage || "-"
            unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + this.lifeType[parseInt(item.shelfLifeUnitFlag)]
            unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":null//生产日期
            unit.shelfLifeValue=item.shelfLifeValue
            unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
            unit.shelfLifeFlag=item.shelfLifeFlag
            unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":"-"//保质期至
            that.zuheList.push(unit)
          }) 
          if(that.sourceType=="edit" && that.expressForm.typeFlag==1){
            that.zuheList.map((item)=>{
              tempZuhe.map((obj)=>{
                if(item.resourceCode==obj.resourceCode){
                  item.manufactureDate=obj.manufactureDate
                }
              })
            })
          }
        }else if(that.diaTitle.indexOf('子件')>-1){
          let tempZijian=JSON.parse(JSON.stringify(that.zijianList))
          that.zijianList=[]
          v.map((item)=>{
            let unit={}
            unit.uid=item.uid || item.categoryUid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.categoryUid=item.uid || item.categoryUid
            unit.model=item.model || "-"
            unit.brand=item.brand || "-"
            unit.measuringUnitName=item.measuringUnitName || "-"
            unit.availableStorage=item.availableStorage || "-"
            unit.goodsNum=null
            unit.lifeFlag=parseInt(item.shelfLifeFlag)==0? "-": item.shelfLifeValue + this.lifeType[parseInt(item.shelfLifeUnitFlag)]
            unit.manufactureDate=parseInt(item.shelfLifeFlag)==0?"-":null//生产日期
            unit.closingDate=parseInt(item.shelfLifeFlag)==0?"-":"-"//保质期至
            unit.shelfLifeValue=item.shelfLifeValue
            unit.shelfLifeFlag=item.shelfLifeFlag
            unit.shelfLifeUnitFlag=item.shelfLifeUnitFlag
            that.zijianList.push(unit)
          }) 
          if(that.sourceType=="edit"){
            that.zijianList.map((item)=>{
              tempZijian.map((obj)=>{
                if(item.resourceCode==obj.resourceCode){
                  item.goodsNum=obj.goodsNum
                  item.manufactureDate=obj.manufactureDate
                }
              })
            })
          }
        }
      }
    },
    changeManuDate(obj){
      obj.closingDate=qualityPeriod(formatDate(obj.manufactureDate, "yyyy-MM-dd"), obj.shelfLifeValue, parseInt(obj.shelfLifeUnitFlag))
    },
    changeZiManuDate(obj){
      obj.closingDate=qualityPeriod(formatDate(obj.manufactureDate, "yyyy-MM-dd"), obj.shelfLifeValue, parseInt(obj.shelfLifeUnitFlag))
    },
    delZuhe(obj){
      let that = this
      let objArr=[obj]
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.zuheList=_xorBy(that.zuheList, objArr, 'resourceCode')
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },    
    delZijian(obj){
      let that = this
      let objArr=[obj]
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.zijianList=_xorBy(that.zijianList, objArr, 'resourceCode')
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    backPre(){
      this.$router.push({ name: "aAndDManage" })
    },
    saveConfirm(){
      let that=this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(that.zuheList.length==0){
            that.$message({
              message: "组合件物资不能为空",
              type: 'warning'
            })
            return
          }
          if(that.zijianList.length==0){
            that.$message({
              message: "子件物资不能为空",
              type: 'warning'
            })
            return
          }
          let params={}, resourceList=[]
          let numValid=false, purchaseValid=false, numReg = /^\d+$/
          if(that.expressForm.typeFlag==2){
            that.zijianList.map((item)=>{
              if(!item.goodsNum || !parseInt(item.goodsNum) || !numReg.test(item.goodsNum)){
                numValid=true
              }
              if(parseInt(item.shelfLifeFlag)!=0 && item.closingDate=='-'){
                purchaseValid=true
              }
            })
            if(numValid){
              that.$message({
                message: "物资使用数量范围为1~9999",
                type: 'warning'
              })
              return
            }
            if(purchaseValid){
              that.$message({
                message: "物资生产日期不能为空",
                type: 'warning'
              })
              return
            }
            params.uid=that.expressForm.uid || null
            params.combineCode=that.expressForm.combineCode || null
            params.typeFlag=that.expressForm.typeFlag
            params.operationTime=formatDate(that.expressForm.operationTime, "yyyy-MM-dd")
            that.zuheList.map((item)=>{
              let unit={}
              unit.categoryUid=item.categoryUid
              unit.availableStorage=item.availableStorage
              unit.goodsNum=1
              unit.typeFlag='1'
              unit.combineUid=that.expressForm.uid || null
              resourceList.push(unit)
            })
            that.zijianList.map((item)=>{
              let unit={}
              unit.categoryUid=item.categoryUid
              unit.goodsNum=parseInt(item.goodsNum)
              unit.productionDate=parseInt(item.shelfLifeFlag)==0?null:formatDate(item.manufactureDate, "yyyy-MM-dd")
              unit.typeFlag='2'
              unit.combineUid=that.expressForm.uid || null
              resourceList.push(unit)
            })
            params.resourceList=resourceList
          }else{
            that.zuheList.map((item)=>{
              if(parseInt(item.shelfLifeFlag)!=0 && item.closingDate=='-'){
                purchaseValid=true
              }
            })
            that.zijianList.map((item)=>{
              if(!item.goodsNum || !parseInt(item.goodsNum) || !numReg.test(item.goodsNum)){
                numValid=true
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
                message: "物资使用数量范围为1~9999",
                type: 'warning'
              })
              return
            }
            params.uid=that.expressForm.uid || null
            params.combineCode=that.expressForm.combineCode || null
            params.typeFlag=that.expressForm.typeFlag
            params.operationTime=formatDate(that.expressForm.operationotherTime, "yyyy-MM-dd")
            that.zuheList.map((item)=>{
              let unit={}
              unit.categoryUid=item.categoryUid
              unit.goodsNum=1
              unit.productionDate=parseInt(item.shelfLifeFlag)==0?null:formatDate(item.manufactureDate, "yyyy-MM-dd")
              unit.typeFlag="1"
              unit.combineUid=that.expressForm.uid || null
              resourceList.push(unit)
            })
            that.zijianList.map((item)=>{
              let unit={}
              unit.categoryUid=item.categoryUid
              unit.availableStorage=item.availableStorage
              unit.goodsNum=parseInt(item.goodsNum)
              unit.typeFlag="2"
              unit.combineUid=that.expressForm.uid || null
              resourceList.push(unit)
            })
            params.resourceList=resourceList
          }
          that.saveLoading=true
          if(that.sourceType=='add'){
            postCombineOrder(params).then((res)=>{
              that.saveLoading=false
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                this.$router.push({ name: "aAndDManage", query:{refresh:true} })
              }
            }).catch((error)=>{
              that.saveLoading=false
              console.log("接口报错=>",error)
            })
          }else if(that.sourceType=='edit'){
            putCombineOrder(params).then((res)=>{
              that.saveLoading=false
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                that.$router.push({ name: "aAndDManage" })
              }
            }).catch((error)=>{
              that.saveLoading=false
              console.log("接口报错=>",error)
            })
          }
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
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
.manu-date{
  /deep/ .el-date-editor.el-input{
    width: 160px;
    height: 40px;
  }
}
</style>
