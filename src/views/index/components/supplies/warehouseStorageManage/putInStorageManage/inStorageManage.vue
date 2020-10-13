<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 入库管理.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="入库日期">
          <el-date-picker v-model="mDate" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库类型">
          <el-select v-model="mLevel" style="width:120px">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="mStatus" style="width:120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库单编号">
          <el-input type="text" v-model.trim="warehousingCode" placeholder="请输入入库单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getStorageWarehousingList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="opt-btn">
        <el-button type="primary" @click="addInStorge" style="margin-bottom:20px;">新增</el-button>
        <el-button type="primary" @click="exportFile" style="margin-bottom:20px;">导出</el-button>
      </div>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="单据编号" prop="warehousingCode" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="入库类型" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="关联单编号" prop="listCode" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="入库仓库" prop="warehouseName" show-overflow-tooltip></el-table-column>
          <el-table-column label="入库日期" prop="warehousingDate" show-overflow-tooltip></el-table-column>
          <el-table-column label="制单人" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="parseInt(scope.row.typeFlag)==1 || parseInt(scope.row.typeFlag)==99">{{scope.row.createName}}</span>
              <span v-else>系统</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="statusName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看</span>
              <span class="operation_btn" @click="editInStorge(scope.row)" v-if="scope.row.statusFlag==1 && (parseInt(scope.row.typeFlag)==1 || parseInt(scope.row.typeFlag)==99)">编辑</span>
              <span class="operation_btn" @click="delInStorge(scope.row)" v-if="scope.row.statusFlag==1 && (parseInt(scope.row.typeFlag)==1 || parseInt(scope.row.typeFlag)==99)">删除</span>
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
import { getStorageWarehousingList, exportStorageUrl, deleteStorageWarehousing } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "入库管理" }],
      mDate:null,
      mLevel:null,
      levelOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '采购入库'
        },
        {
          value: 2,
          label: '盘盈入库'
        },
        {
          value: 3,
          label: '组装入库'
        },
        {
          value: 4,
          label: '拆卸入库'
        },
        {
          value: 99,
          label: '其他入库'
        },
      ],
      levelObj:{1:"采购入库",2:"盘盈入库",3:"组装入库",4:"拆卸入库",99:"其他入库"},
      mStatus:null,
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '待入库'
        },
        {
          value: 2,
          label: '入库中'
        },
        {
          value: 3,
          label: '待审核'
        },
        {
          value: 4,
          label: '已入库'
        },
      ],
      statusObj:{1:"待入库",2:"入库中",3:"待审核",4:"已入库"},
      warehousingCode:"",
      purchaseList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  // mounted() {
  //   this.getStorageWarehousingList()
  // },
  activated() {
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getStorageWarehousingList()
    }else{
      this.resetForm()
    }
  },
  methods: {
    // 入库列表数据
    getStorageWarehousingList(){      
      let that=this
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.warehousingStartDate": startTime,
        "where.warehousingEnDate": endTime,
        "where.typeFlag": that.mLevel,
        "where.statusFlag": that.mStatus,
        "where.warehousingCode": that.warehousingCode,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.purchaseList=[]
      getStorageWarehousingList(params).then((res)=>{
        that.total=res.data.total
        that.tableLoading=false
        if(res && res.code==="00000000") {
          res.data.list.map((item)=>{
            let unit={}
            unit.uid=item.uid
            unit.warehousingCode=item.warehousingCode || "-"
            unit.typeFlag=item.typeFlag
            unit.typeName=that.levelObj[parseInt(item.typeFlag)]
            unit.listCode=item.listCode || "-"
            unit.warehouseName=item.warehouseName || "-"
            unit.warehousingDate=item.warehousingDate?item.warehousingDate.substring(0,10):"-"
            unit.createName=item.createName || "-"
            unit.createTime=item.createTime || "-"
            unit.statusFlag=item.statusFlag
            unit.statusName=that.statusObj[parseInt(item.statusFlag)] || "-"
            that.purchaseList.push(unit)
          })
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    // 重置
    resetForm(){
      this.pageNum=1
      this.mDate=null
      this.mLevel=null
      this.mStatus=null
      this.warehousingCode=""
      this.getStorageWarehousingList()
    },
    // 导出
    exportFile(){
      let that=this
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.warehousingStartDate": startTime,
        "where.warehousingEnDate": endTime,
        "where.typeFlag": that.mLevel,
        "where.statusFlag": that.mStatus,
        "where.warehousingCode": that.warehousingCode,
        "pageSize": that.total,
      }
			const downloadFullName = `${formatDate(new Date(), 'yyyyMMdd')}导出的入库单数据.xls`
      exportFn(exportStorageUrl, params, null, null, downloadFullName)
    },
    //换页
    onPageChange(page){
      this.pageNum = page;
      this.getStorageWarehousingList();
    },
    addInStorge(){
      this.$router.push({ name: "addInStorage", query:{type:'add'}})
    },
    editInStorge(obj){
      this.$router.push({ name: "addInStorage", query:{uid: obj.uid, type:'edit'} })
    },
    lookDetail(obj){
      this.$router.push({ name: "inStorageDetail", query:{uid: obj.uid} })
    },
    delInStorge(obj){
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
            deleteStorageWarehousing(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.getStorageWarehousingList()
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
              if(error.code=="10020004"){
                that.getStorageWarehousingList()
              }
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
