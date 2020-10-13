<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 选择模板事件组件.
-->
<template>
  <div>
    <el-dialog title="选择" :visible.sync="showModule" width="45%" :close-on-click-modal="false" @close="callFunc" class="unit-dialog">
      <div class="common_content" style="width:100%; height:400px;">
        <el-scrollbar style="width:100%;height:100%;">
          <el-form :inline="true" style="position:relative;" label-width="80px">
            <el-form-item>
              <el-input type="text" v-model="queryStr" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="common_table">
            <el-table ref="versionTable" :data="reportDutyTableList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
              <el-table-column width="80" label="选择">
                <template slot-scope="scope">
                  <el-radio v-model="selectRadio" :label="scope.row.i" @change="selectEvent(scope.row.i)" class="u-radio"></el-radio>
                </template>
              </el-table-column>
              <el-table-column label="编号" prop="code" width="80"></el-table-column>
              <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
              <el-table-column label="编发时间" prop="editTime" width="170"></el-table-column>
            </el-table>
            <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
              :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" size="small">
        <el-button @click="callFunc()">取 消</el-button>
        <el-button type="primary" @click="onConfirm" :loading="unitLoading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getReportDutyList, getReceiveDutyList, getEventPageList } from "@/views/index/api/onDuty/api.ps.js";
export default {
  name: 'select-module-event',
  props:{
    moduleType:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      showModule:true,
      queryStr:null,
      reportDutyTableList:[],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      unitLoading:false,
      selectRadio:'-1'
    }
  },
  mounted(){
    if(this.moduleType=="update"){
    //上报值班信息
      this.getReportDutyList()
    }else if(this.moduleType=="accept"){
    //接收值班信息
      this.getReceiveDutyList()
    }else if(this.moduleType=="event"){
    //要情快报
      this.getEventPageList()
    }
  },
  methods:{
    //上报值班信息
    getReportDutyList() {
      this.tableLoading=true
      let params={
        "where.queryStr": this.queryStr,
        "where.type":1,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"operation.create_time",
        "order":"desc"
      }
      this.reportDutyTableList=[]
      getReportDutyList(params).then((res)=>{
        this.tableLoading=false
        if(res && res.code==="00000000") {
          // this.reportDutyTableList=res.data.list.filter((item)=>{
          //   return item.type==1
          // })
          this.reportDutyTableList=res.data.list
          this.reportDutyTableList.map((item, index)=>{
            item.i=index
            item.receiptTime=(item.receiptTime && item.receiptTime!="0001-01-01 00:00:00")? item.receiptTime: "-"
          })
          this.total = res.data.total;
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
        this.tableLoading=false
      })
    },
    //接收值班信息
    getReceiveDutyList(){
      this.tableLoading=true
      let params={
        "where.queryStr": this.queryStr,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"report.create_time",
        "order":"desc"
      }
      this.reportDutyTableList=[]
      getReceiveDutyList(params).then((res)=>{
        this.tableLoading=false
        if(res && res.code==="00000000") {
          this.reportDutyTableList=res.data.list
          this.reportDutyTableList.map((item, index)=>{
            item.i=index
            item.editTime=item.reportTime || "-"
          })
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
        this.tableLoading=false
      })
    },
    //要情快报
    getEventPageList() {
      this.tableLoading=true
      let params={
        "where.queryStr": this.queryStr,
        "where.eventType":1,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"create_time",
        "order":"desc"
      }
      getEventPageList(params).then(res => {
        this.tableLoading = false
        if(res && res.code==="00000000") {
          this.total = res.data.total
          // this.reportDutyTableList = res.data.list.filter((item)=>{
          //   return item.eventLevel!=null
          // })
          this.reportDutyTableList = res.data.list
          this.reportDutyTableList.map((item, index)=>{
            item.i=index
            item.eventTitle=item.eventTitle?item.eventTitle:"-"
            item.title=item.eventTitle
          })
        }
      }).catch(error => {
        console.log("接口报错=>",error)
        this.tableLoading = false
      })
    },
    //重置
    resetForm() {
      this.queryStr= null
      this.pageNum = 1
      if(this.moduleType=="update"){
        this.getReportDutyList()
      }else if(this.moduleType=="accept"){
        this.getReceiveDutyList()
      }else if(this.moduleType=="event"){
        this.getEventPageList()
      }
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      if(this.moduleType=="update"){
        this.getReportDutyList()
      }else if(this.moduleType=="accept"){
        this.getReceiveDutyList()
      }else if(this.moduleType=="event"){
        this.getEventPageList()
      }
    },
    callFunc(){
      this.$emit("closeModule")
    },
    onConfirm(){
      if(this.moduleType=="accept"){
        this.$emit("setNewEventInfo", this.reportDutyTableList[this.selectRadio].objUid)
      }else{
        this.$emit("setNewEventInfo", this.reportDutyTableList[this.selectRadio].uid)
      }      
    },
    selectEvent(i){
      this.selectRadio=i
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      if(this.moduleType=="update"){
        this.getReportDutyList()
      }else if(this.moduleType=="accept"){
        this.getReceiveDutyList()
      }else if(this.moduleType=="event"){
        this.getEventPageList()
      }
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
.u-radio{
  .el-radio__label{
    position: relative;
    left: -1000px;
  }
}
</style>
