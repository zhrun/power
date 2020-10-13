<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 标签打印.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <div class="top-switch">
        <div v-for="(item, index) in topSwitch" :key="index+8" class="switch-unit" :class="switchIndex==index?'':''" @click="switchTitle(index)">
          <span :class="switchIndex==index?'act':''">{{item.name}}</span>
          <span :class="switchIndex==index?'act-line':''"></span>
        </div>
      </div>
      <el-form :inline="true">
        <el-form-item :label="labelTitle">
          <el-date-picker v-model="mDate" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="typeFlag" style="width:120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务编号" v-show="switchIndex==0">
          <el-input type="text" v-model.trim="printCode" placeholder="请输入任务编号"></el-input>
        </el-form-item>
        <el-form-item label="内容" v-show="switchIndex==0">
          <el-input type="text" v-model.trim="queryStr" placeholder="物资名称、入库单编号、库位名称" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="二维码编号" v-show="switchIndex==1">
          <el-input type="text" v-model.trim="qrCode" placeholder="请输入二维码编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom:20px;" @click="switchIndex==0? addPrint(): addBuda()">{{switchIndex==0?"新增打印":"新增补打"}}</el-button>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading" v-show="switchIndex==0">
          <el-table-column label="任务编号" prop="printCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="标签类型" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
          <el-table-column label="打印总份数" prop="count" show-overflow-tooltip></el-table-column>
          <el-table-column label="打印时间" prop="printTime"  show-overflow-tooltip></el-table-column>
          <el-table-column label="打印人" prop="printer" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChange" :current-page.sync="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp" v-show="switchIndex==0"></el-pagination>

        <el-table :data="reprintList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading" v-show="switchIndex==1">
          <el-table-column label="任务编号" prop="printCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="标签类型" prop="typeName" show-overflow-tooltip></el-table-column>
          <el-table-column label="二维码编号" prop="qrCode" show-overflow-tooltip></el-table-column>
          <el-table-column label="补打原因" prop="remark" show-overflow-tooltip></el-table-column>
          <el-table-column label="补打时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作人" prop="opUserName" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChangebuda" :current-page.sync="pageNumbuda" :page-size="pageSizebuda" layout="total, prev, pager, next, jumper" :total="totalbuda" class="pagination_comp" v-show="switchIndex==1"></el-pagination>
      </div>
    </el-scrollbar>
  </div>
  <el-dialog title="新增补打" :visible.sync="budaVisible" top="20vh" @close="budaVisible = false" width="500px" :close-on-click-modal="false">
    <el-form inline :model="budaForm" ref="budaForm" :rules="budaRule" label-width="110px" class="buda-form">
      <el-form-item label="原二维码编号" prop="qrCode">
        <el-input type="text" v-model="budaForm.qrCode" placeholder="请输入原二维码编号" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="补打原因">
        <el-input type="textarea" :rows="4" placeholder="请输入补打原因" maxlength="100" show-word-limit v-model="budaForm.remark" style="width:300px;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="budaVisible = false">取 消</el-button>
      <el-button type="primary" @click="budaConfirm" :loading="budaLoading">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { getPrintPageList, getReprintPageList, postReprint } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "标签打印" }],
      topSwitch:[
        {
          name:"标签打印"
        },
        {
          name:"补打标签"
        },
      ],
      switchIndex:0,
      labelTitle:"打印日期",
      mDate:null,
      typeFlag:null,
      printCode:null,
      queryStr:null,
      qrCode:null,//二维码编码
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '物资标签'
        },
        {
          value: 2,
          label: '库位标签'
        },
      ],
      statusStr:{1:"物资标签", 2:"库位标签"},
      purchaseList:[],
      reprintList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      pageNumbuda:1,
      pageSizebuda:10,
      totalbuda:0,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        },
      },
      budaVisible:false,
      budaForm:{
        qrCode:"",
        remark:""
      },
      budaRule:{
        qrCode:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      budaLoading:false
    };
  },
  // mounted() {
  //   this.getPrintPageList()
  // },
  activated() {
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getPrintPageList()
    }else{
      this.resetForm()
    }
  },
  methods: {
    //打印标签分页
    getPrintPageList(){
      let that=this
      that.purchaseList=[]
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.typeFlag": that.typeFlag,
        "where.printCode": that.printCode,
        "where.queryStr": that.queryStr,
        "where.warehousingUid":JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid || null,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
        "orderBy":"print_time",
        "order":"desc"
      }
      getPrintPageList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          if(res.data.list && res.data.list.length>0){
            res.data.list.map((item)=>{
              let unit={}
              unit.printCode=item.printCode || "-"
              unit.typeFlag=item.typeFlag
              unit.typeName=that.statusStr[parseInt(item.typeFlag)]
              unit.count=item.count || "-"
              unit.content=item.content || "-"
              unit.printTime=item.printTime || "-"
              unit.printer=item.printer || "-"
              unit.uid=item.uid
              that.purchaseList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    //补打标签分页
    getReprintPageList(){
      let that=this
      that.reprintList=[]
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? that.mDate[0]: null
        endTime = that.mDate[1]? that.mDate[1]: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.typeFlag": that.typeFlag,
        "where.qrCode": that.qrCode,
        "where.warehousingUid":JSON.parse(localStorage.getItem('current_user_warehouse_list'))[0].uid || null,
        "pageNum": that.pageNumbuda,
        "pageSize": that.pageSizebuda,
      }
      getReprintPageList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.totalbuda=res.data.total
          if(res.data.list && res.data.list.length>0){
            res.data.list.map((item)=>{
              let unit={}
              unit.printCode=item.printCode || "-"
              unit.typeFlag=item.typeFlag
              unit.typeName=that.statusStr[parseInt(item.typeFlag)]
              unit.qrCode=item.qrCode || "-"
              unit.remark=item.remark || "-"
              unit.createTime=item.createTime || "-"
              unit.opUserName=item.opUserName || "-"
              unit.uid=item.uid
              that.reprintList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    switchTitle(i){
      this.switchIndex=i
      this.labelTitle= i==0? '打印日期': '补打日期'
      this.resetForm()
    },
    queryList(){
      if(this.switchIndex==0){
        this.getPrintPageList()
      }else{
        this.getReprintPageList()
      }
    },
    resetForm(){
      this.pageNum=1
      if(this.switchIndex==0){
        this.mDate=null
        this.typeFlag=null
        this.printCode=null
        this.queryStr=null
        this.queryList()
      }else{
        this.mDate=null
        this.typeFlag=null
        this.qrCode=null
        this.queryList()
      }
    },
    onPageChange(page){
      this.pageNum = page
      this.getPrintPageList()
    },
    onPageChangebuda(page){
      this.pageNumbuda = page
      this.getReprintPageList()
    },
    addPrint(){
      this.$router.push({ name: "addLabel" })
    },
    addBuda(){
      this.budaForm.qrCode=""
      this.budaForm.remark=""
      this.budaVisible=true
    },
    lookDetail(obj){
      this.$router.push({ name: "labelDetail", query:{uid: obj.uid} })
    },
    budaConfirm(){
      let that=this
      that.$refs.budaForm.validate(valid => {
        if(valid){
          that.budaLoading=true
          postReprint(that.budaForm).then((res)=>{
            that.budaLoading=false
            if(res && res.code==="00000000") {
              that.$message({
                message: "操作成功！",
                type: 'success'
              })
              that.getReprintPageList()
              that.budaVisible=false
            }
          }).catch((error)=>{
            that.budaLoading=false
            console.log("接口报错=>",error)
          })
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.top-switch{
  width: 100%;
  height:50px;
  border-bottom: 1px solid #E1E1E1;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  .switch-unit{
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position: relative;
    cursor: pointer;
    span:nth-of-type(1){
      font-size: 14px;
      color: #999999;
      font-weight: 500;
    }
    span:nth-of-type(2){
      display: inline-block;
      width:28px;
      height: 3px;
      background-color: #ffffff;
      border-radius: 2px;
      position: absolute;
      bottom: 0px;
      left: 25px;
      z-index: 10;
    }
    .act{
      color: #5458FE !important;
    }
    .act-line{
      background-color: #5458FE !important;
    }
  }
}
</style>
