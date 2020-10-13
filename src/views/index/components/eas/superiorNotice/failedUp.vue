<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <el-form :inline="true" :model="recordForm" ref="recordForm">
          <el-form-item label="审批时间">
            <el-date-picker clearable v-model="recordForm.searchDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="上报渠道">
            <el-select v-model="recordForm.receiveType">
              <el-option v-for="item in organizeOpration" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值班员">
            <el-autocomplete
              v-model="recordForm.dutyPersonLable"
              placeholder="请输入姓名或手机号"
              value-key="label"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="搜索">
            <el-input class="width190" v-model="recordForm.queryStr" placeholder="输入编号/事件名称搜索"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="query('1')">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetInfo()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">          
          <el-table class="table-comp" ref="examineTable" v-loading="examineLoading" :data="examineData" tooltip-effect="dark" highlight-current-row max-height="600">
            <el-table-column  label="序号" type="index" width="50"></el-table-column>
            <el-table-column  label="事件编号" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.eventCode || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="事件名称" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.eventName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="发生地点" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.eventAddress || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="上报渠道" width="100">
              <template slot-scope="scope">
                <span v-show="scope.row.receiveType==null">-</span>
                <span v-show="scope.row.receiveType==1">小程序接报</span>
                <span v-show="scope.row.receiveType==2">app接报</span>
                <span v-show="scope.row.receiveType==3">电话接报</span>
                <span v-show="scope.row.receiveType==4">上级督办</span>
                <span v-show="scope.row.receiveType==5">其他渠道</span>
              </template>
            </el-table-column>
            <el-table-column  label="上报/录入时间" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.reportTime || "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="核实值班员" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.duty }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审批人" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.dutyLeaderName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审批不通过说明" min-width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.approveRemark || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column  label="审批时间" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.approveTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="optionBtn(scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="onPageChange" :current-page.sync="pageNum" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { proKey } from '@/config/config.js';
import visBreadcrumb from "_com/breadcrumb.vue";
import { getApprovePageList, getUsersByRole } from "_api/eas/api.ps.js";
export default {
  components: { visBreadcrumb },
  data(){
    return{
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
      },
      breadcrumbData:[{name: "上级通知"}, {name: "审批不通过"}],
      recordForm:{
        searchDate:"",
        receiveType:null,
        dutyPersonId:null,
        dutyPersonLable:null,
        queryStr:""
      },
      examineData:[],
      examineLoading:false,
      showTooltip: true,
      pageNum:1,
      pageSize:10,
      total:0,
      dutyOpration:[
        {value: null,label: "全部"},
      ],
      organizeOpration:[
        {value: null,label: "全部"},
        {value: 1,label: "小程序接报"},
        // {value: 2,label: "app接报"},
        {value: 3,label: "电话接报"},
        {value: 4,label: "上级督办"},
        {value: 5,label: "其他渠道"}
      ]
    }
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.resetInfo();/*清空查询条件*/
    }else{
      this.$route.meta.isBack = false;
      this.query();/*列表重新加载*/
    }
  },
  mounted(){
    this.query('1')
  },
  methods:{
    //搜索负责人提示信息
    querySearch(queryString, cb) {
      let params={
        proKey:proKey,
        roleId:"32hxupGKa9Wci4Q0wnZ4jl",
         keyword:queryString || null
      }
      getUsersByRole(params).then((res)=>{
        this.dutyOpration = [];
        if(res && res.data && res.data.length>0){
          res.data.map((item)=>{
            let dutyUnit={}
            dutyUnit.value=item.uid
            if(item.userMobile){
              dutyUnit.label=item.userName + "(" + item.userMobile + ")"
            }else{
              dutyUnit.label=item.userName
            }            
            this.dutyOpration.push(dutyUnit)
          })
          cb(this.dutyOpration);
        } else {
          cb([]);
        }
      })
    },
    handleSelect(item){
      this.recordForm.dutyPersonId = item.value
    },
    query(type){
      if(this.recordForm.dutyPersonLable!=null && this.recordForm.dutyPersonLable.length==0){
        this.recordForm.dutyPersonId=null
      }else if(this.recordForm.dutyPersonLable && this.recordForm.dutyPersonLable.length>0){
        let lab=this.recordForm.dutyPersonLable.split("(")[0]
        let labTrue=true
        this.dutyOpration.map((item)=>{
          if(item.label.indexOf(lab)>-1){
            labTrue=false
          }
        })
        if(labTrue){
          this.recordForm.dutyPersonId=null
        }
      }
      this.examineLoading=true
      if(type && type=='1'){
        this.pageNum=1
      }
      let params={
        "where.approveStartTime":this.recordForm.searchDate && this.recordForm.searchDate[0]?this.recordForm.searchDate[0] + " 00:00:00": null,
        "where.approveEndTime":this.recordForm.searchDate && this.recordForm.searchDate[1]?this.recordForm.searchDate[1] + " 23:59:59": null,
        "where.dutyPersonId":this.recordForm.dutyPersonId || this.recordForm.dutyPersonLable,
        "where.approveResultFlag":0,
        "where.handleStatus":99,
        "where.receiveType":this.recordForm.receiveType || null,
        "where.eventCode":this.recordForm.queryStr || null,
        "where.eventName":this.recordForm.queryStr || null,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize
      }
      this.examineData=[]
      getApprovePageList(params).then((res)=>{
        this.examineLoading=false
        this.total=res.data.total
        if(res && res.code==="00000000") {
          this.examineData=res.data.list
          this.examineData.map((item)=>{
            if(item.dutyPersonName!=null && item.dutyPersonPhone!=null){  
              item.duty=item.dutyPersonName + "(" + item.dutyPersonPhone + ")"
            }else if(item.dutyPersonName==null && item.dutyPersonPhone!=null){
              item.duty=item.dutyPersonPhone
            }else if(item.dutyPersonName!=null && item.dutyPersonPhone==null){
              item.duty=item.dutyPersonName
            }else{
              item.duty="-"
            }  
            if(item.dutyLeaderName!=null && item.dutyLeaderPhone!=null){
              item.checker=item.dutyLeaderName + "(" + item.dutyLeaderPhone + ")"
            }else if(item.dutyLeaderName==null && item.dutyLeaderPhone!=null){
              item.checker=item.dutyLeaderPhone
            }else if(item.dutyLeaderName!=null && item.dutyLeaderPhone==null){
              item.checker=item.dutyLeaderName
            }else{
              item.duty="-"
            }
          })
        }        
      }).catch(()=>{
        this.examineLoading=false
      })
    },
    resetInfo(){
      this.recordForm.searchDate=""
      this.recordForm.receiveType=null
      this.recordForm.dutyPersonId=null
      this.recordForm.queryStr=""
      this.recordForm.dutyPersonLable=null
      this.query('1')
    },
    /* 表格方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.query()  
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    },
    optionBtn(obj){
      this.$router.push({ name: "failDetail", query: {uid: obj.uid}})
    },
  }
}
</script>

<style lang="scss" scoped>
.table-comp{
  width: 100%;
  margin-top: 20px;
}
</style>