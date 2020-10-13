<!-- 
* @author  ps_gen
* @Date: 2020-08-22 10:52:34
* @description 物资列表.
-->

<template>
  <el-dialog :title="title" :visible.sync="showGoods" top="5vh" @close="closeDialog" :close-on-click-modal="false">
    <div class="goods-box">
      <el-scrollbar style="height:100%;">
        <el-form inline>
          <div class="space_between">
            <div v-show="goodsType=='标签'"></div>
            <div v-show="goodsType!='标签'">
              <el-form-item label="物资装备">
                <el-input v-model.trim="queryStr" placeholder="请输入物资名称或编号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getResourcePageList">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </div>
            <el-form-item style="margin-right: 0">
              <el-button type="primary" @click="onConfirm">确定选择</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table ref="goodsTable" :data="suppliesList" @selection-change="handleSelectionChange" row-key="resourceCode" v-loading="tableLoading" v-show="goodsType.indexOf('组合')>-1">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio :label="scope.row.number" v-model="radioNum" @change.native="getCurrentRow(scope.row)" class="label-number"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="物资装备名称" prop="resourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资装备编号" prop="resourceCode" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="计量单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="当前库存" prop="storage" show-overflow-tooltip v-if="goodsType=='入库'"></el-table-column>
          <el-table-column label="可用库存" prop="availableStorage" show-overflow-tooltip v-if="goodsType=='出库' || goodsType.indexOf('组合')>-1"></el-table-column>
          <el-table-column label="入库数量" prop="dueQuantity" show-overflow-tooltip v-if="goodsType=='标签'"></el-table-column>
          <el-table-column label="已打印份数" prop="printCount" show-overflow-tooltip v-if="goodsType=='标签'"></el-table-column>
        </el-table>
        <el-table ref="goodsTable" :data="suppliesList" @selection-change="handleSelectionChange" row-key="resourceCode" v-loading="tableLoading" v-show="goodsType.indexOf('组合')==-1">
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column label="物资装备名称" prop="resourceName" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column label="物资装备编号" prop="resourceCode" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column label="规格型号" prop="model" show-overflow-tooltip></el-table-column>
          <el-table-column label="品牌" prop="brand" show-overflow-tooltip></el-table-column>
          <el-table-column label="计量单位" prop="measuringUnitName" show-overflow-tooltip></el-table-column>
          <el-table-column label="当前库存" prop="storage" show-overflow-tooltip v-if="goodsType=='入库'"></el-table-column>
          <el-table-column label="可用库存" prop="availableStorage" show-overflow-tooltip v-if="goodsType=='出库'"></el-table-column>
          <el-table-column label="入库数量" prop="dueQuantity" show-overflow-tooltip v-if="goodsType=='标签'"></el-table-column>
          <el-table-column label="已打印份数" prop="printCount" width="100" show-overflow-tooltip v-if="goodsType=='标签'"></el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp" v-if="goodsType!='标签'"></el-pagination>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import _cloneDeep from 'lodash/cloneDeep'
import _xorBy from 'lodash/xorBy'
import _remove from 'lodash/remove'
import _intersectionBy from 'lodash/intersectionBy'
import { getResourcePageList } from "@/views/index/api/supplies/api.ps.js"
export default {
  name: "selectGoods",
  props: {
    showSelectGoods: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    goodsType: {
      type: String,
      required: true,
    },
    selectGoodsdata:{
      type:Array
    },
    selectGoodsList:{
      type:Array
    },
  },
  data() {
    return {
      queryStr:"",
      pageNum:1,
      pageSize:10,
      total:0,
      suppliesList: [],
      selectedSupplies: [],
      selectGoodsArr:[],
      radioNum:-1,
      tableLoading:false,
      showGoods:false
    };
  },
  mounted() {
    this.showGoods=this.showSelectGoods
    if(this.goodsType=="入库" || this.goodsType=="出库" || this.goodsType=="组合入库" || this.goodsType=="组合出库"){
      this.getResourcePageList()
    }
  },
  watch:{
    showSelectGoods:function(val){
      let that=this
      that.showGoods=val
      if (!val) return
      this.selectGoodsArr=JSON.parse(JSON.stringify(this.selectGoodsList))
      if(that.selectGoodsdata && that.selectGoodsdata.length>0){
        that.suppliesList=that.selectGoodsdata
        that.total=that.selectGoodsdata.length
      }
			that.$nextTick(() => {
        // 清空选中
        that.$refs.goodsTable.clearSelection()
        // 根据外部传入的数据选中
        if(that.goodsType.indexOf('组合')>-1){
          let radioObj=_intersectionBy(that.suppliesList, that.selectGoodsArr, 'resourceCode')
          that.radioNum=radioObj && radioObj.length>0? radioObj[0].number: -1
          setTimeout(() => {
            that.selectGoodsArr=radioObj
          }, 1000)
        }else{          
          if(that.selectGoodsList && that.selectGoodsList.length>0){
            that.selectGoodsArr.map(item => {
              that.$refs.goodsTable.toggleRowSelection(item, true)
            })
            setTimeout(() => {
              that.selectGoodsArr=_intersectionBy(that.suppliesList,that.selectGoodsArr, 'resourceCode')
            }, 1000)
          }
        }
				// 更新当前页，暂时解决第一页选不中的问题
        if(this.goodsType=="入库" || this.goodsType=="出库" || this.goodsType=="组合入库" || this.goodsType=="组合出库"){
          that.reset()
        }else{
          that.suppliesList=[]
          that.total=0
          that.suppliesList=JSON.parse(JSON.stringify(that.selectGoodsdata))
          that.total=JSON.parse(JSON.stringify(that.selectGoodsdata)).length
        }
			})
    }, 
  },
  methods: {
    getResourcePageList() {
      let that=this
      let params={
        "where.queryStr": that.queryStr,
        "where.warehouseUid":that.goodsType=="出库" || that.goodsType=="组合出库"?JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid:null,
        "where.type":that.goodsType=="出库" || that.goodsType=="组合出库"? 1: null,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.tableLoading=true
      that.suppliesList=[]
      getResourcePageList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          that.suppliesList=res.data.list
          that.suppliesList.map((item, index)=>{
            item.uid=item.uid
            item.number=index+1
            item.resourceName=item.resourceName || "-"
            item.resourceCode=item.resourceCode || "-"
            item.model=item.model || "-"
            item.brand=item.brand || "-"
            item.measuringUnitName=item.measuringUnitName || "-"
            item.storage=item.storage || "-"
            item.availableStorage=item.availableStorage || "-"
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    getCurrentRow(val){
      this.radioNum=val.number
      this.selectedSupplies = [val]
    },
    reset() {
      this.queryStr=""
      this.pageNum = 1
      this.getResourcePageList()
    },
    //列表选择
    handleSelectionChange(val) {
      this.selectedSupplies = val
    },
    //列表换页
    handleCurrentChange(val) {
      this.pageNum = val
      this.getResourcePageList()
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    onConfirm() {
			// 目前已选中的数据 和 最初传入的选中数据 对比的差值
			const difList = _xorBy(this.selectedSupplies, this.selectGoodsArr, "resourceCode")
			// 初始化暴露出去的选中数据
			const newList = _cloneDeep(this.selectGoodsArr)
			difList.map(difItem => {
				const isExist = newList.some(({resourceCode}) => difItem.resourceCode === resourceCode)
				if (isExist) {
					_remove(newList, ({resourceCode}) => difItem.resourceCode === resourceCode)
				} else {
					newList.push(difItem)
				}
			})
      this.$emit("selectGoodsConfirm", _cloneDeep(newList))
      this.$emit("closeDialog")
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/ .el-dialog {
  width: 60%;
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
/deep/ .el-dialog__body {
  min-height: 70vh;
}
.space_between {
  display: flex;
  justify-content: space-between;
}
.pagination {
  margin-top: 40px;
  text-align: center;
}
.label-number{
  /deep/ .el-radio__label{
    position: absolute;
    left: 10000px;
  }
}
.goods-box{
  height:550px;
  /deep/ .el-scrollbar__wrap{
    overflow-x: hidden;
    margin-right: -19px;
  }
}
.goods-box{
  /deep/ .el-table__header {
    width: 100% !important;
  }
  /deep/ .el-table__body {
    width: 100% !important;
  }
}
</style>
