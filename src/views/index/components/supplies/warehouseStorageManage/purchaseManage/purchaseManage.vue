<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 采购管理.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="交货日期">
          <el-date-picker v-model="mDate" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="mStatus" style="width:120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购单编号">
          <el-input type="text" v-model.trim="purchaseCode" placeholder="请输入采购单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPurchaseServiceList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="opt-btn">
        <el-button type="primary" @click="exportFile" style="margin-bottom:20px;">导出</el-button>
      </div>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="采购单编号" prop="purchaseCode" width="160"></el-table-column>
          <el-table-column label="状态" prop="statusFlag" width="80"></el-table-column>
          <el-table-column label="采购类型" prop="purchaseTypeFlag" width="100"></el-table-column>
          <el-table-column label="关联采购计划" prop="purchasePlanName" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="供应商" prop="supplierName" show-overflow-tooltip></el-table-column>
          <el-table-column label="交货日期" prop="deliveryDate" width="120"></el-table-column>
          <el-table-column label="存放仓库" prop="warehouseName" show-overflow-tooltip></el-table-column>
          <el-table-column label="采购物资装备(种)" prop="categoryCount" width="160"></el-table-column>
          <el-table-column label="采购金额（元）" prop="totalAmount" width="130"></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
    </el-scrollbar>
  </div>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { exportFn, formatDate } from '@/utils/util'
import { getPurchaseServiceList, exportPurchaseUrl } from "@/views/index/api/supplies/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "采购管理" }],
      mDate:null,
      mStatus:null,
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 2,
          label: '采购中'
        },
        {
          value: 3,
          label: '已入库'
        },
      ],
      purchaseCode:"",
      purchaseList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  // mounted() {
  //   this.getPurchaseServiceList()
  // },
  activated() {
    this.getPurchaseServiceList()
  },
  methods: {
    // 采购列表数据
    getPurchaseServiceList(){
      let that=this
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.deliveryStartDate": startTime,
        "where.deliveryEndDate": endTime,
        "where.statusFlag": that.mStatus,
        "where.purchaseCode": that.purchaseCode,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.purchaseList=[]
      getPurchaseServiceList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          that.purchaseList=res.data.list
          that.purchaseList.map((item)=>{
            item.purchaseCode=item.purchaseCode || "-"
            item.purchaseTypeFlag=item.purchaseTypeFlag || "-"
            item.purchasePlanName=item.purchasePlanName || "-"
            item.supplierName=item.supplierName || "-"
            item.deliveryDate=item.deliveryDate?item.deliveryDate.substring(0,10):"-"
            item.categoryCount=item.categoryCount || "-"
            item.totalAmount=item.totalAmount || "-"
            item.statusFlag=item.statusFlag==2? "采购中": "已入库"
            item.warehouseName=item.warehouseName || "-"
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm(){
      this.pageNum=1
      this.mDate=null
      this.mStatus=null
      this.purchaseCode=""
      this.getPurchaseServiceList()
    },
    //导出
    exportFile(){
      let startTime=null, endTime=null
      if (this.mDate) {
        startTime = this.mDate[0]? this.mDate[0]: null
        endTime = this.mDate[1]? this.mDate[1]: null
      }
      let params={
        "where.deliveryStartDate": startTime,
        "where.deliveryEndDate": endTime,
        "where.statusFlag": this.mStatus,
        "where.purchaseCode": this.purchaseCode,
        "pageSize": this.total,
      }
			const downloadFullName = `${formatDate(new Date(), 'yyyyMMdd')}导出的采购单数据.xls`
      exportFn(exportPurchaseUrl, params, null, null, downloadFullName)
    },
    //换页
    onPageChange(page){
      this.pageNum = page;
      this.getPurchaseServiceList();
    },
    //跳转详情
    lookDetail(obj){
      this.$router.push({ name: "purchaseDetail", query:{uid: obj.uid} })
    }
  },
};
</script>
<style lang="scss" scoped>
.opt-btn{
  display: flex;
  flex-direction: row;
}
</style>
