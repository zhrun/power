<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 新增标签.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="supply-content">
    <el-scrollbar style="height:100%;">
      <p class="content-t">基本信息</p>
      <el-form :model="expressForm" ref="expressForm" :rules="expressRule" label-width="120px" class="input-content clearfix">
        <el-form-item label="标签类型:" class="fl-unit" :required="true">
          <el-select v-model="expressForm.typeFlag" :disabled="fromAD">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库单编号:" class="fl-unit" prop="warehousingCode" v-show="expressForm.typeFlag==1">
          <el-autocomplete placeholder="请输入入库单编号" v-model="expressForm.warehousingCode" :fetch-suggestions="querySearchAsync" @select="handleSelect" :disabled="fromAD" @blur="handleInput"></el-autocomplete>
        </el-form-item>
      </el-form>
      <p class="content-t">打印明细</p>
      <div class="mid-btn" style="margin-bottom:20px" v-show="expressForm.typeFlag==1">
        <el-button type="primary" @click="chooceGoods">选择</el-button>
      </div>
      <div class="common_table table-scr" v-show="expressForm.typeFlag==1">
        <el-scrollbar style="height:100%;">
          <el-table :data="purchaseList" tooltip-effect="dark">
            <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
            <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
            <el-table-column label="入库数量" prop="dueQuantity" show-overflow-tooltip></el-table-column>
            <el-table-column label="已打印份数" prop="printCount" show-overflow-tooltip></el-table-column>
            <el-table-column label="本次打印份数" width="200">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.count" placeholder="请输入打印份数"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="delLabel(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <el-tree :data="Warehousedata" show-checkbox default-expand-all node-key="id+666" ref="tree" highlight-current :props="defaultProps" v-show="expressForm.typeFlag==2" :check-strictly="true"></el-tree>
      <div class="bottom-btn">
        <el-button @click="backPre">取消</el-button>
        <el-button type="primary" @click="onConfirm">提交</el-button>
      </div>
    </el-scrollbar>
  </div>
  <select-goods :showSelectGoods="showSelectGoods" :goodsType="goodsType" :title="diaTitle" :selectGoodsdata="selectGoodsdata"  :selectGoodsList="purchaseList" @closeDialog="closeDialog" @selectGoodsConfirm="selectGoodsConfirm"></select-goods>
</div>
</template>
<script>
import _xorBy from "lodash/xorBy"
import visBreadcrumb from "_com/breadcrumb.vue"
import selectGoods from "_com/supplies/selectGoods.vue"
import { postPrint, getStorageWarehousingList, getStorageWarehousingDetail, getLocationTree } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb, selectGoods },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "标签打印", routerName: "printLabel"}, { name: "新增打印任务" }],
      expressForm:{
        typeFlag:1,
        warehousingUid:null,
        warehousingCode:null
      },
      expressRule:{
        warehousingCode:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      typeOptions:[
        {
          value: 1,
          label: '物资标签'
        },
        {
          value: 2,
          label: '库位标签'
        }
      ],
      purchaseList:[],
      Warehousedata: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      diaTitle:"选择物资",
      goodsType:"标签",
      showSelectGoods:false,
      selectGoodsdata: [],
      fromAD:false,
      purList:[]
    };
  },
  mounted() {
    this.getLocationTree()
    if(this.$route.query && this.$route.query.type=='组装和拆卸'){
      this.fromAD=true
      let obj={}
      obj.uid=this.$route.query.listUid
      obj.value=this.$route.query.listCode
      this.handleSelect(obj)
    }
  },
  methods: {
    //获取库位列表
    getLocationTree(){
      let that=this
      let params={
        warehouseUid:JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid
      }
      getLocationTree(params).then((res)=>{
        if(res.data && res.data.length>0) {
          that.Warehousedata=that.deepClone(res.data)
          console.log("objClone=>", that.Warehousedata)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    deepClone(obj){
      let objClone = []
      obj.map((item)=>{
        let unit={}
        unit.id = item.uid
        unit.disabled = item.locationFlag=='1'? true: item.labelFlag
        unit.locationName = item.locationName
        unit.locationFullName = item.locationFullName
        unit.label = `${item.locationName}【${item.locationCode}】`
        if(item.childList && item.childList.length>0){
          unit.children = this.deepClone(item.childList)
        }
        objClone.push(unit)
      })
      return objClone
    },
    //查询入库单列表
    querySearchAsync(queryString, cb){
      let params={
        "forPrint":"yes",
        "where.warehousingCode": queryString,
        "pageNum": 1,
        "pageSize": 0,
      }
      getStorageWarehousingList(params).then((res)=>{
        if(res && res.code==="00000000") {
          let purList=[]
          res.data.list.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.value=item.warehousingCode
            purList.push(unit)
          })
          this.purList=purList
          cb(purList)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //选择采购单编号获取入库单详情
    handleSelect(obj){
      this.$refs.expressForm.clearValidate('warehousingCode')
      this.expressForm.warehousingUid=obj.uid
      this.expressForm.warehousingCode=obj.value
      this.purchaseList=[]
      let params={
        uid:obj.uid
      }
      this.selectGoodsdata=[]
      getStorageWarehousingDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data.resourceList&& res.data.resourceList.length>0){
            res.data.resourceList.forEach((item)=>{
              let unit={}
              unit.uid=item.categoryUid
              unit.resourceName=item.resourceName || "-"
              unit.resourceCode=item.resourceCode || "-"
              unit.model=item.model || "-"
              unit.brand=item.brand || "-"
              unit.measuringUnitName=item.measuringUnit || "-"//计量单位
              unit.dueQuantity=item.dueQuantity || "-" //入库数量
              unit.availableStorage=item.availableStorage || "-" //可用库存
              unit.printCount=item.printCount || "-"//已打印份数
              unit.count=null
              this.selectGoodsdata.push(unit)
            })
          }                  
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    handleInput(){
      const that=this
      setTimeout(() => {
        if(that.purList && that.purList.length>0){
          let purValidat=false
          that.purList.map((item)=>{
            if(item.value==this.expressForm.warehousingCode){
              purValidat=true
            }
          })
          if(!purValidat){
            that.selectGoodsdata=[]
            that.purchaseList=[]
            that.$message({
              message: "请输入正确的入库单编号",
              type: 'warning'
            })
          }
        }        
      }, 500);
    },
    chooceGoods(){
      if(this.selectGoodsdata.length==0){
        this.$message({
          message: "请选择正确的入库单编号",
          type: 'warning'
        })
        return
      }
      this.showSelectGoods=true
    },
    closeDialog(){
      this.showSelectGoods=false
    },
    selectGoodsConfirm(v){
      const that=this
      this.purchaseList=[]
      if(v && v.length>0){
        v.map((item)=>{
          let unit={}
          unit.uid=item.uid
          unit.resourceName=item.resourceName || "-"
          unit.resourceCode=item.resourceCode || "-"
          unit.model=item.model || "-"
          unit.brand=item.brand || "-"
          unit.measuringUnitName=item.measuringUnitName || "-"//计量单位
          unit.dueQuantity=item.dueQuantity || "-" //入库数量
          unit.printCount=item.printCount || "-"//已打印份数
          unit.count=null
          that.purchaseList.push(unit)
        }) 
      }
    },
    backPre(){
      this.$router.push({ name: "printLabel" })
    },
    delLabel(obj){
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
    onConfirm(){
      let that=this
      if(that.expressForm.typeFlag==1){
        that.$refs.expressForm.validate(valid => {
          if(valid){
            if(that.purchaseList.length==0){
              that.$message({
                message: "打印明细不能为空",
                type: 'warning'
              })
              return
            }
            let numValid=false, numReg = /^\d+$/
            // let outNum=false
            that.purchaseList.map((item)=>{
              if(!item.count || !parseInt(item.count) || !numReg.test(item.count)){
                numValid=true
              }
              // if(parseInt(item.count)+parseInt(item.printCount) > parseInt(item.dueQuantity)){
              //   outNum=true
              // }
            })
            if(numValid){
              that.$message({
                message: "打印份数数量范围为1~9999",
                type: 'warning'
              })
              return
            }
            // if(outNum){
            //   that.$message({
            //     message: "本次打印份数与已打印份数之和不得大于入库数量",
            //     type: 'warning'
            //   })
            //   return
            // }
            let params={}, resStorageBarcodeInfoDtos=[], resStr=""
            that.purchaseList.map((item)=>{
              let unit={}
              unit.objUid=item.uid
              unit.warehousingUid=that.expressForm.warehousingUid
              unit.typeFlag=that.expressForm.typeFlag
              unit.count=parseInt(item.count)
              resStorageBarcodeInfoDtos.push(unit)
              resStr+=item.resourceName + "、"
            })
            resStr=resStr.substring(0, resStr.length-1)
            params.typeFlag=that.expressForm.typeFlag
            params.warehousingUid=that.expressForm.warehousingUid
            params.resStorageBarcodeInfoDtos=resStorageBarcodeInfoDtos
            params.content=`${that.expressForm.warehousingCode}:${resStr}`
            postPrint(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
                that.$router.push({ name: "printLabel", query:{refresh:true} })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
            })
          }
        })
      }else{
        let CheckedNodes=this.$refs.tree.getCheckedNodes()
        if(CheckedNodes && CheckedNodes.length>0){
          let params={}, resStorageBarcodeInfoDtos=[], resStr=""
          CheckedNodes.map((item)=>{
            let unit={}
            unit.objUid=item.id
            unit.resourceName=item.locationName
            unit.typeFlag='2'
            unit.count=1
            resStorageBarcodeInfoDtos.push(unit)
            resStr+=item.locationFullName+"，"
          })
          resStr=resStr.substring(0, resStr.length-1)
          params.typeFlag='2'
          params.resStorageBarcodeInfoDtos=resStorageBarcodeInfoDtos
          params.content=resStr
          params.warehousingUid=JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid || null
          postPrint(params).then((res)=>{
            if(res && res.code==="00000000") {
              that.$message({
                message: "操作成功！",
                type: 'success'
              })
              that.$router.push({ name: "printLabel", query:{refresh:true} })
            }
          }).catch((error)=>{
            console.log("接口报错=>",error)
          })
        }else{
          that.$message({
            message: "请选择库房信息",
            type: 'warning'
          })
          return
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.fl-unit{
  /deep/ .el-select{
    width: 100%;
  }
}
.supply-content{
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>
