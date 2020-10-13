/* 人工录入 */
<template>
  <div class="manual-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 标签 -->
    <ul class="tabs">
      <li :class="[activeTab == 'phone'?'active':'']" @click="changeTab('phone')">电话接报（{{phoneNum}}）</li>
      <li :class="[activeTab == 'super'?'active':'']" @click="changeTab('super')">上级督办（{{superNum}}）</li>
      <li :class="[activeTab == 'other'?'active':'']" @click="changeTab('other')">其他渠道（{{otherNum}}）</li>
    </ul>
    <!-- 主体 -->
    <div class="common_content" style="margin-top:0px">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="录入时间" prop="date">
              <el-date-picker
                v-model="formInline.date"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="pickerOptions"
               
                value-format="yyyy-MM-dd"
                
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="督办单位" prop="supervisionUnit" key="dept" v-show="activeTab=='super'">
              <el-select v-model="formInline.supervisionUnit" placeholder="请选择督办单位">
                <el-option :key="-1" label="全部" value></el-option>
                <el-option
                  v-for="item in depts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->

          <el-form-item label="督办单位" prop="supervisionUnit" key="dept" v-show="activeTab=='super'">
              <el-autocomplete
              v-model="formInline.supervisionUnit"
              placeholder="请输入姓名或手机号"
              value-key="label"
              :fetch-suggestions="querySearch1"
              @select="handleSelect1"
            ></el-autocomplete>
            </el-form-item>

            <el-form-item label="值班员" prop="platformType">
              <el-autocomplete
              v-model="formInline.dutyPersonLable"
              placeholder="请输入姓名或手机号"
              value-key="label"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
            ></el-autocomplete>
            </el-form-item>
            <el-form-item label="搜索" prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="输入编号/名称搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" style="margin-bottom: 22px" @click="add">新增</el-button>
        <!-- 分页表格 -->
        <div class="common_table">
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="orgTableData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="examineLoading"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="事件编号" type="eventCode" width="130">
              <template slot-scope="scope">
                <span>{{scope.row.eventCode || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="事件名称" prop="eventName" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.eventName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发生时间" width="180">
              <template slot-scope="scope">
                <span>{{scope.row.eventTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发生地点" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.eventAddress || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="来电人员" width="180" show-overflow-tooltip v-if="this.activeTab=='phone'">
              <template slot-scope="scope">
                <span>{{scope.row.reporterName || '-'}}({{scope.row.contactPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="督办单位" width="180" show-overflow-tooltip v-if="this.activeTab=='super'">
              <template slot-scope="scope">
               <span v-if="scope.row.supervisionUnit==null&&scope.row.contactPhone==null">-</span>
                <span v-else>{{scope.row.supervisionUnit || '-'}}({{scope.row.contactPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="消息渠道" width="180" show-overflow-tooltip v-if="this.activeTab=='other'">
              <template slot-scope="scope">
                <span>{{scope.row.eventChannel || '-'}}({{scope.row.contactPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="值班员" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.dutyUserName || '-'}}({{scope.row.dutyUserPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="录入时间" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.recordTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="处理状态" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{turnStatus(scope.row.handleStatus)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.handleStatus == '1'"
                  class="operation_btn"
                  @click="verify(scope.row)"
                >编辑</span>
                <span class="operation_btn" @click="check(scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="onPageChange"
            :current-page.sync="pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            class="pagination_comp"
          ></el-pagination>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { proKey } from '@/config/config.js';
import {
  manualList,
  getDutyPerson,
  getDepts
} from "@/views/index/api/eas/api.eas.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      // 面包屑导航数据
      breadcrumbData: [{ name: "突发接报" }, { name: "人工录入" }],
      // 当前标签页
      activeTab: "phone",
      phoneNum: "0",
      superNum: "0",
      otherNum: "0",
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
        // shortcuts: [
          
        //   {
        //     text: "最近一周",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近一个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "最近三个月",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   }
        // ]
      },
      // 督办单位集合
      depts: [],
      // 值班员集合
      persons: [],
      // 查询条件表单
      formInline: {
        date: null,
        opUserId: "",
        dutyPersonLable: null,
        supervisionUnit:"",
        superId: "",
        keyword: ""
      },
      // 表格数据
      orgTableData: [],
      examineLoading:false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      dutyOpration:[]

    };
  },
   activated() {
    if (!this.$route.meta.isBack) {
      this.resetForm('ruleForm');/*清空查询条件*/
    }else{
      this.$route.meta.isBack = false;
      this.getManualList();/*列表重新加载*/
    }
  },
  mounted() {
    
    // this.channelType = this.$route.query.channelType;.
    this.getNum();
    if (this.$route.query.channelType) {
      this.changeTab(this.$route.query.channelType);
      this.getManualList();
    } else {
      this.changeTab("phone");
      this.getManualList();
    }
    // 获取督办列表
    // this.getDepts();
    // 获取值班员列表
    // this.getDutyPerson();
  },
  methods: {
    //搜索负责人提示信息
    querySearch(queryString, cb) {
      let params={
        proKey:proKey,
        roleId:"32hxupGKa9Wci4Q0wnZ4jl",
        keyword:queryString || null
      }
      console.log(this.formInline.dutyPersonLable)
      getDutyPerson(params).then((res)=>{
        this.dutyOpration = [];
        this.formInline.opUserId = ""
        if(res && res.data && res.data.length>0){
          res.data.map((item)=>{
            let dutyUnit={}
            dutyUnit.value=item.uid
            if (item.userMobile) {
              dutyUnit.label = item.userName + "(" + item.userMobile + ")";
            } else {
              dutyUnit.label = item.userName;
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
      this.formInline.opUserId = item.value
    },
     //搜索督办人提示信息
    querySearch1(queryString, cb) {
      
      getDepts().then((res)=>{
        this.depts = [];
        if(res && res.data && res.data.length>0){
          res.data.map((item)=>{

            let dutyUnit={}
            dutyUnit.value=item.supervisionUnit
            dutyUnit.label=item.supervisionUnit

            console.log(dutyUnit)
            this.depts.push(dutyUnit)
          })
          cb(this.depts);
        } else {
          cb([]);
        }
      })
    },
    handleSelect1(item){
      
      this.formInline.supervisionUnit = item.value
    },
     // 获取督办列表
    // getDepts() {
    //   getDepts().then(res => {
    //     if (res && res.data && res.data.length > 0) {
    //       res.data.map(item => {
    //         let unit = {};
    //         unit.value = item;
    //         unit.label = item;
    //         this.depts.push(unit);
    //       });
    //     }
    //   });
    // },

    getNum(){
      let d = {};
      if (this.formInline.date) {
        d["where.reportStartTime"] = this.formInline.date[0]?this.formInline.date[0] + " 00:00:00": null;
        d["where.reportEndTime"] = this.formInline.date[1]?this.formInline.date[1] + " 23:59:59": null;
      }
      if (this.formInline.opUserId) {
        d["where.dutyPersonUid"] = this.formInline.opUserId;
      }
      if (this.formInline.dutyPersonLable) {
        d["where.dutyPersonUid"] = this.formInline.opUserId;
      }
      if (this.formInline.keyword) {
        d["where.eventCode"] = this.formInline.keyword;
        d["where.eventName"] = this.formInline.keyword;
      }
      d["pageNum"] = this.pageNum;
      d["pageSize"] = this.pageSize;
      d["where.receiveType"] = 3
      manualList(d).then(res => {
        if (res && res.data) {
              this.phoneNum = res.data.total;
          }
        }
      );
      let d1 = {};
      if (this.formInline.date) {
        d1["where.reportStartTime"] = this.formInline.date[0]?this.formInline.date[0] + " 00:00:00": null;
        d1["where.reportEndTime"] = this.formInline.date[1]?this.formInline.date[1] + " 23:59:59": null;
      }
      if (this.formInline.supervisionUnit) {
        d1["where.supervisionUnit"] = this.formInline.supervisionUnit;
      }
      if (this.formInline.keyword) {
        d1["where.eventCode"] = this.formInline.keyword;
        d1["where.eventName"] = this.formInline.keyword;
      }
      d1["pageNum"] = this.pageNum;
      d1["pageSize"] = this.pageSize;
      d1["where.receiveType"] = 4
      manualList(d1).then(res => {
        if (res && res.data) {
              this.superNum = res.data.total;
          }
        }
      );
      let d2 = {};
      if (this.formInline.date) {
        d2["where.reportStartTime"] = this.formInline.date[0]?this.formInline.date[0] + " 00:00:00": null;
        d2["where.reportEndTime"] = this.formInline.date[1]?this.formInline.date[1] + " 23:59:59": null;
      }
      if (this.formInline.opUserId) {
        d2["where.dutyPersonUid"] = this.formInline.opUserId;
      }
      if (this.formInline.keyword) {
        d2["where.eventCode"] = this.formInline.keyword;
        d2["where.eventName"] = this.formInline.keyword;
      }
      d2["pageNum"] = this.pageNum;
      d2["pageSize"] = this.pageSize;
      d2["where.receiveType"] = 5
      manualList(d2).then(res => {
        if (res && res.data) {
              this.otherNum = res.data.total;
          }
        }
      );
    },
    //初始化数据
    getManualList() {
      this.examineLoading=true
      let d = {};

      if (this.formInline.date) {

        d["where.reportStartTime"] = this.formInline.date[0]?this.formInline.date[0] + " 00:00:00": null;
        d["where.reportEndTime"] = this.formInline.date[1]?this.formInline.date[1] + " 23:59:59": null;
      }
      if (this.formInline.opUserId) {
        d["where.dutyPersonUid"] = this.formInline.opUserId;
      }
      if (this.formInline.supervisionUnit) {
        d["where.supervisionUnit"] = this.formInline.supervisionUnit;
      }
      if (this.formInline.keyword) {
        d["where.eventCode"] = this.formInline.keyword;
        d["where.eventName"] = this.formInline.keyword;
      }
      d["pageNum"] = this.pageNum;
      d["pageSize"] = this.pageSize;
      d["order"] = "desc";
      d["orderBy"] = "ere.record_time"

      switch (this.activeTab) {
        case "phone":
          d["where.receiveType"] = 3;
          break;
        case "super":
          d["where.receiveType"] = 4;
          break;
        case "other":
          d["where.receiveType"] = 5;
          break;
        default:
          d["where.receiveType"] = 3;
          break;
      }
      console.log(d);
      manualList(d).then(res => {
        
        if (res && res.data) {
          console.log("manualList", res);
          this.orgTableData = res.data.list;
          this.total = res.data.total;
          switch (this.activeTab) {
            case "phone":
              this.phoneNum = res.data.total;
              break;
            case "super":
              this.superNum = res.data.total;

              break;
            case "other":
              this.otherNum = res.data.total;
              break;
            default:
              this.phoneNum = res.data.total;

              break;
          }
          this.examineLoading=false
          
        }
      }).catch(()=>{
        this.examineLoading=false
      });
    },

    // 切换
    changeTab(type) {
      this.activeTab = type;
      this.resetForm("ruleForm");
      this.pageNum = 1;
      // this.getManualList();
    },

    //重置
    resetForm(formName) {
      this.pageNum = 1;
      this.$refs[formName].resetFields();
      this.formInline.dutyPersonLable = "";
      this.formInline.supervisionUnit = "";
      this.formInline.opUserId = ""
      this.getManualList();
    },
    //提交
    onSubmit() {
      if(this.formInline.dutyPersonLable == ""){
        this.formInline.opUserId = ""
      }
      
      console.log(222222222222,this.formInline.opUserId)
      this.pageNum = 1;
      this.getManualList();
    },

    // 新增
    add() {
      this.$router.push({
        name: "manualVerify",
        query: { channelType: this.activeTab, eventId: "" }
      });
    },

    /* 表格操作 */
    // 编辑
    verify(row) {
      this.$router.push({
        name: "manualVerify",
        query: { channelType: this.activeTab, eventId: row.uid }
      });
    },
    // 查看
    check(row) {
      this.$router.push({
        name: "manualDetails",
        query: { channelType: this.activeTab, eventId: row.uid }
      });
    },

    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getManualList();
    },
    handleSizeChange(val) {
      this.resetForm("ruleForm");
      this.pageNum = 1;
      this.pageSize = val;
      this.getManualList();
    },

    /* 数据转化 */
    // 状态转化
    turnStatus(val) {
      switch (val) {
        case 0:
          return "待核实";
        case 1:
          return "待审批";
        case 2:
          return "已审批";
        case 99:
          return "已结束";
        default:
          return "-";
      }
    }
  }
};
</script>
<style lang="scss">
.manual-up {
  height: 100%;
  position: relative;
  .common_content {
    height: calc(100% - 90px);
  }
  .tabs {
    height: 40px;
    margin-top: 5px;
    margin-left: 10px;
    li {
      display: inline-block;
      vertical-align: top;
      height: 28px;
      margin: 6px 6px auto auto;
      padding: 0 10px;
      background: rgba(139, 157, 196, 1);
      border-radius: 4px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
      user-select: none;
      cursor: pointer;
      &.active {
        height: 34px;
        line-height: 34px;
        background: rgba(255, 255, 255, 1);
        border-radius: 0;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(55, 118, 255, 1);
      }
    }
  }
  .boxBoder {
    .el-form {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
  
  }
  .operation_btn {
    padding: 0px 3px;
  }
  .el-date-editor {
    width: 320px;
    .el-range-separator {
      width: 30px;
    }
  }
}
</style>