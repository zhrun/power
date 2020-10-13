<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 组装和拆卸管理.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="创建日期">
          <el-date-picker v-model="mDate" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单据类型">
          <el-select v-model="typeFlag" style="width:120px">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="mStatus" style="width:120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input type="text" v-model.trim="listCode" placeholder="请输入单据编号"></el-input>
        </el-form-item>
        <el-form-item label="物资名称">
          <el-input type="text" v-model.trim="keyword" placeholder="请输入物资名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCombineOrderList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="opt-btn">
        <el-button type="primary" @click="addDA" style="margin-bottom:20px;">新增</el-button>
        <el-button type="primary" @click="exportFile" style="margin-bottom:20px;">导出</el-button>
      </div>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="单据编号" prop="combineCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="单据类型" prop="typeFlagName" show-overflow-tooltip></el-table-column>
          <el-table-column label="组合件物资" prop="combineResourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="子件物资" prop="looseResourceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="制单人" prop="createUserName"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="statusFlagName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看</span>
              <span class="operation_btn" @click="editDA(scope.row)" v-if="scope.row.statusFlagName=='待执行'">编辑</span>
              <span class="operation_btn" @click="delDA(scope.row)" v-if="scope.row.statusFlagName=='待执行'">删除</span>
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
import { getCombineOrderList, deleteCombineOrder, exportCombineOrderUrl } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "组装和拆卸管理" }],
      mDate:null,
      typeFlag:null,
      typeOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '组装单'
        },
        {
          value: 2,
          label: '拆卸单'
        },
      ],
      mStatus:null,
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '待执行'
        },
        {
          value: 2,
          label: '执行中'
        },
        {
          value: 3,
          label: '已完成'
        },
      ],
      listCode:"",
      keyword:"",
      purchaseList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  // mounted() {
  //   this.getCombineOrderList()
  // },
  activated() {
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getCombineOrderList()
    }else{
      this.resetForm()
    }
  },
  methods: {
    //获取组装和拆卸列表数据
    getCombineOrderList(){
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
        "where.statusFlag": that.mStatus,
        "where.listCode": that.listCode,
        "where.keyword": that.keyword,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      that.purchaseList=[]
      getCombineOrderList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          if(res.data.list && res.data.list.length>0){
            res.data.list.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.combineCode=item.combineCode || "-"
              unit.typeFlagName=item.typeFlagName
              unit.combineResourceName=item.combineResourceName || "-"
              unit.looseResourceName=item.looseResourceName || "-"
              unit.createUserName=item.createUserName || "-"
              unit.createTime=item.createTime || "-"
              unit.statusFlagName=item.statusFlagName
              that.purchaseList.push(unit)
            })
          }
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
      this.mStatus=null
      this.listCode=""
      this.keyword=""
      this.getCombineOrderList()
    },
    exportFile(){
			const downloadFullName = `${formatDate(new Date(), 'yyyyMMdd')}导出的组装拆卸单数据.xls`
      let startTime=null, endTime=null
      if (this.mDate) {
        startTime = this.mDate[0]? this.mDate[0]: null
        endTime = this.mDate[1]? this.mDate[1]: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.typeFlag": this.typeFlag,
        "where.statusFlag": this.mStatus,
        "where.listCode": this.listCode,
        "where.keyword": this.keyword,
        "pageSize": this.total,
      }
      exportFn(exportCombineOrderUrl, params, null, null, downloadFullName)

    },
    onPageChange(page){
      this.pageNum = page
      this.getCombineOrderList()
    },
    lookDetail(obj){
      this.$router.push({ name: "aAndDDetail", query:{uid: obj.uid} })
    },
    addDA(){
       this.$router.push({ name: "addaAndD", query:{type:'add'} })
    },
    editDA(obj){
      this.$router.push({ name: "addaAndD", query:{uid: obj.uid, type:'edit'} })
    },
    delDA(obj){
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
            deleteCombineOrder(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.getCombineOrderList()
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
