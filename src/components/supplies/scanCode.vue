<!-- 
* @author  ps_gen
* @Date: 2020-08-22 10:52:34
* @description 查看扫码记录.
-->

<template>
  <el-dialog title="扫码记录" :visible.sync="showCode" top="10vh" @close="closeCode" :close-on-click-modal="false" class="scans-box">
    <el-form inline>
      <div class="space_between">
        <div>
          <el-form-item label="二维码编号">
            <el-input v-model.trim="qrCode" placeholder="请输入二维码编号"></el-input>
          </el-form-item>
          <el-form-item label="存放库位">
            <el-input v-model.trim="locationFullName" placeholder="请输入库房-库区-货架"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fromPage=='inStorage'?getScanCodeList():getOutDeliveryOrderScanList()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table :data="scanCodeList" @selection-change="onPageChange" :reserve-selection="true" v-loading="tableLoading">
      <el-table-column label="物资名称" prop="resourceName" show-overflow-tooltip></el-table-column>
      <el-table-column label="物资编号" prop="resourceCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="二维码编号" prop="qrCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="存放库位" prop="locationFullName" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
      :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
  </el-dialog>
</template>
<script>
import { getScanCodeList, getOutDeliveryOrderScanList } from "@/views/index/api/supplies/api.ps.js"
export default {
  name: "scanCode",
  props: {
    showScanCode: {
      type: Boolean,
      required: true,
    },
    codeUid: {
      type: String,
      required: true,
    },
    categoryUid: {
      type: String,
    },
    fromPage:{
      type: String,
      required: true,
    }
  },
  data() {
    return {
      qrCode:"",
      locationFullName:"",
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      scanCodeList: [],
      showCode:false
    };
  },
  mounted() {
    this.showCode=this.showScanCode
    if(this.fromPage=='inStorage' || this.fromPage=='inStorages'){
      this.getScanCodeList()
    }else if(this.fromPage=='outStorage'){
      this.getOutDeliveryOrderScanList()
    }
  },
  watch:{
    showScanCode:function(val){
      console.log("val=>", val)
      this.showCode=val
    }
  },
  methods: {
    getScanCodeList() {
      let that=this
      let params=null
      if(this.fromPage=='inStorage'){
        params={
          "where.historyCategoryUid": that.codeUid,
          "where.qrCode":that.qrCode,
          "where.locationFullName":that.locationFullName,
          "pageNum": that.pageNum,
          "pageSize": that.pageSize,
        }
      }else{
        params={
          "where.warehousingUid": that.codeUid,
          "where.categoryUid":that.categoryUid,
          "where.qrCode":that.qrCode,
          "where.locationFullName":that.locationFullName,
          "pageNum": that.pageNum,
          "pageSize": that.pageSize,
        }
      }
      that.tableLoading=true
      that.scanCodeList=[]
      getScanCodeList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          res.data.list.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.qrCode=item.qrCode || "-"
            unit.locationFullName=item.locationFullName || "-"
            that.scanCodeList.push(unit)
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    getOutDeliveryOrderScanList() {
      let that=this
      let params={
        "where.outdeliveryUid": that.codeUid,
        "where.categoryUid":that.categoryUid,
        "where.qrCode":that.qrCode,
        "where.locationFullName":that.locationFullName,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.tableLoading=true
      that.scanCodeList=[]
      getOutDeliveryOrderScanList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          res.data.list.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.resourceName=item.resourceName || "-"
            unit.resourceCode=item.resourceCode || "-"
            unit.qrCode=item.qrCode || "-"
            unit.locationFullName=item.locationFullName || "-"
            that.scanCodeList.push(unit)
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    reset(){
      this.pageNum=1
      this.qrCode=""
      this.locationFullName=""
      if(this.fromPage=='inStorage' || this.fromPage=='inStorages'){
        this.getScanCodeList()
      }else if(this.fromPage=='outStorage'){
        this.getOutDeliveryOrderScanList()
      }
    },
    onPageChange(page){
      this.pageNum = page;
      if(this.fromPage=='inStorage' || this.fromPage=='inStorages'){
        this.getScanCodeList()
      }else if(this.fromPage=='outStorage'){
        this.getOutDeliveryOrderScanList()
      }
    },
    closeCode(){
      this.$emit("closeCode")
    }
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
.clear-deep{
  /deep/ .el-table {
    /deep/ .el-table__header {
      width: 100% !important;
    }
    /deep/ .el-table__body {
      width: 100% !important;
    }
  }
}
.scans-box{
  /deep/ .el-table__header {
    width: 100% !important;
  }
  /deep/ .el-table__body {
    width: 100% !important;
  }
}
</style>
