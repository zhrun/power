<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 出库管理.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="出库日期">
          <el-date-picker v-model="mDate" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库类型">
          <el-select v-model="typeFlag" style="width:120px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="statusFlag" style="width:120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库单编号">
          <el-input type="text" v-model.trim="outdeliveryCode" placeholder="请输入出库单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOutDeliveryOrderPageList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="opt-btn">
        <el-button type="primary" @click="addOutStorage" style="margin-bottom:20px;">新增</el-button>
        <el-button type="primary" @click="exportFile" style="margin-bottom:20px;">导出</el-button>
      </div>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="单据编号" prop="outdeliveryCode" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="出库类型" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="关联单编号" prop="objCode" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="出库仓库" prop="warehouseName" show-overflow-tooltip></el-table-column>
          <el-table-column label="出库日期" prop="outdeliverDate" show-overflow-tooltip></el-table-column>
          <el-table-column label="制单人" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.typeFlag=='2' || scope.row.typeFlag=='3' || scope.row.typeFlag=='4'">系统</span>
              <span v-else>{{scope.row.createUserName}}</span>
              <span></span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="statusName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看</span>
              <span class="operation_btn" @click="editOutStorage(scope.row)" v-if="scope.row.typeFlag==1 || scope.row.typeFlag==99">编辑</span>
              <span class="operation_btn" @click="delOutStorage(scope.row)" v-if="scope.row.statusFlag==1">删除</span>
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
import { getOutDeliveryOrderPageList, exportOutDeliveryUrl, deleteOutDeliveryOrder } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "出库管理" }],
      mDate:null,
      typeFlag:null,
      typeOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '报废出库'
        },
        {
          value: 2,
          label: '盘亏出库'
        },
        {
          value: 3,
          label: '组装出库'
        },
        {
          value: 4,
          label: '拆卸出库'
        },
        {
          value: 99,
          label: '其他出库'
        },
      ],
      typeStr:{1:'报废出库',2:'盘亏出库',3:'组装出库',4:'拆卸出库',99:'其他出库',},
      statusFlag:null,
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '待出库'
        },
        {
          value: 2,
          label: '出库中'
        },
        {
          value: 3,
          label: '待审核'
        },
        {
          value: 4,
          label: '已出库'
        },
      ],
      statusStr:{1:'待出库',2:'出库中',3:'待审核',4:'已出库'},
      outdeliveryCode:null,
      purchaseList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  // mounted() {
  //   this.getOutDeliveryOrderPageList()
  // },
  activated() {
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getOutDeliveryOrderPageList()
    }else{
      this.resetForm()
    }
  },
  methods: {
    //获取出库列表信息
    getOutDeliveryOrderPageList(){
      let that=this
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.startDate": startTime,
        "where.endDate": endTime,
        "where.typeFlag": that.typeFlag,
        "where.statusFlag": that.statusFlag,
        "where.outdeliveryCode": that.outdeliveryCode,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.purchaseList=[]
      getOutDeliveryOrderPageList(params).then((res)=>{
        that.tableLoading=false
        that.total=res.data.total
        if(res.data.list && res.data.list.length>0) {
          res.data.list.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.outdeliveryCode=item.outdeliveryCode || "-"
            unit.objUid=item.objUid
            unit.objCode=item.objCode || "-"
            unit.typeFlag=item.typeFlag
            unit.typeName=that.typeStr[parseInt(item.typeFlag)]
            unit.warehouseName=item.warehouseName
            unit.outdeliverDate=item.outdeliverDate?formatDate(item.outdeliverDate, "yyyy-MM-dd"): "-"
            unit.createUserName=item.createUserName || "-"
            unit.createTime=item.createTime || "-"
            unit.statusFlag=item.statusFlag
            unit.statusName=that.statusStr[parseInt(item.statusFlag)]
            that.purchaseList.push(unit)
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    resetForm(){
      this.pageNum=1
      this.mDate=null
      this.typeFlag=null
      this.statusFlag=null
      this.outdeliveryCode=null
      this.getOutDeliveryOrderPageList()
    },
    exportFile(){
      let that=this
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.startDate": startTime,
        "where.endDate": endTime,
        "where.typeFlag": that.typeFlag,
        "where.statusFlag": that.statusFlag,
        "where.outdeliveryCode": that.outdeliveryCode,
        "pageSize": that.total,
      }
			const downloadFullName = `${formatDate(new Date(), 'yyyyMMdd')}导出的出库单数据.xls`
      exportFn(exportOutDeliveryUrl, params, null, null, downloadFullName)
    },
    onPageChange(page){
      this.pageNum = page;
      this.getOutDeliveryOrderPageList();
    },
    lookDetail(obj){
      this.$router.push({ name: "outStorageDetail", query:{uid: obj.uid} })
    },
    addOutStorage(){
      this.$router.push({ name: "addOutStorage", query:{type: 'add'} })
    },
    editOutStorage(obj){
      this.$router.push({ name: "addOutStorage", query:{uid: obj.uid, type:'edit'} })
    },
    delOutStorage(obj){
      let that = this
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid: obj.uid
            }
            deleteOutDeliveryOrder(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.getOutDeliveryOrderPageList()
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
            })
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.opt-btn{
  display: flex;
  flex-direction: row;
}
</style>
