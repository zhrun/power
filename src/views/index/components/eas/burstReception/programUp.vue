/* 小程序接报 */
<template>
  <div class="program-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 主体 -->
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="上报时间" prop="date">
              <el-date-picker
                v-model="formInline.date"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="logTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="处理状态" prop="handleStatus">
              <el-select v-model="formInline.handleStatus" placeholder="请选择处理状态">
                <el-option :key="-1" label="全部" value></el-option>
                <el-option
                  v-for="item in levels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值班员" prop="dutyPersonUid">
              <el-autocomplete
              v-model="formInline.dutyPersonLable"
              placeholder="请输入姓名或手机号"
              value-key="label"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
            ></el-autocomplete>
              <!-- <el-select v-model="formInline.dutyPersonUid" placeholder="请输入姓名或者手机号">
                <el-option :key="-1" label="全部" value></el-option>
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="核实结论" prop="checkResultFlag">
              <el-select v-model="formInline.checkResultFlag" placeholder="请选择核实结论">
                <el-option :key="-1" label="全部" value></el-option>
                <el-option
                  v-for="item in conclusions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
            <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
            <el-table-column label="序号"  width="60" align="center">
              <template slot-scope="scope">
                <span class="dot-red" v-show="scope.row.isCheckRead==0"></span>
                <span>{{ scope.row.rowIndex }}</span>
              </template>
            </el-table-column>
            <el-table-column label="事件编号" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.eventCode || '-'}}<span class="overTime" v-if="scope.row.isOvertime==1">超时</span></template>
            </el-table-column>
            <el-table-column label="事件名称" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.eventName || '-'}}</template>
            </el-table-column>
            <el-table-column label="发生地点" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.eventAddress || '-'}}</template>
            </el-table-column>
            <el-table-column label="上报人" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.reporterName || '-'}}({{scope.row.contactPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="上报时间" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.recordTime || '-'}}</template>
            </el-table-column>
            <el-table-column label="处理状态" width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.handleStatus==0 || scope.row.handleStatus==null">待核实</span>
                <span v-if="scope.row.handleStatus==1">待审批</span>
                <span v-if="scope.row.handleStatus==2">待处理</span>
                <span v-if="scope.row.handleStatus==99">已结束</span>
              </template>
            </el-table-column>
            <el-table-column label="核实值班员" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.checkResultFlag==null">-</span>
                <span
                  v-if="scope.row.checkResultFlag==0||scope.row.checkResultFlag==1"
                >{{scope.row.dutyUserName || '-'}}({{scope.row.dutyUserPhone || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="核实结论" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.checkResultFlag==1">符合报送</span>
                <span v-else-if="scope.row.checkResultFlag==0">不符合报送</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <span
                  class="operation_btn"
                  @click="verify(scope.row)"
                  v-if="scope.row.checkResultFlag==null"
                >核实</span>
                <span
                  class="operation_btn"
                  @click="check(scope.row)"
                  v-if="scope.row.checkResultFlag==0||scope.row.checkResultFlag==1"
                >查看</span>
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
// 引入mapState
import { mapState } from "vuex";
import visBreadcrumb from "_com/breadcrumb.vue";
import { getLogs, getDutyPerson } from "@/views/index/api/eas/api.eas.js";
import { proKey } from "@/config/config.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      // 面包屑导航数据
      breadcrumbData: [{ name: "突发接报" }, { name: "小程序接报" }],
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          let nowY = new Date().getFullYear();
          let nowM = new Date().getMonth()+1;
          let nowD = new Date().getDate();
          let nowL = new Date(`${nowY}-${nowM}-${nowD} 23:59:59`)
          return time.getTime() > nowL.getTime();
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
      // 处理状态集合
      levels: [
        {
          label: "待核实",
          value: "0"
        },
        {
          label: "待审批",
          value: "1"
        },
        {
          label: "待处理",
          value: "2"
        },
        {
          label: "已结束",
          value: "99"
        }
      ],
      // 值班员集合
      status: [
        
      ],
      // 核实结论集合
      conclusions: [
        {
          label: "符合报送",
          value: "1"
        },
        {
          label: "不符合报送",
          value: "0"
        }
      ],
      // 查询条件表单
      formInline: {
        date: null,
        handleStatus: "",
        dutyPersonUid: "",
        dutyPersonLable: "",
        checkResultFlag: "",
        keyword: "",
        "where.startTime": "",
        "where.endTime": "",
        "where.handleStatus": "",
        "where.dutyPersonUid": "",
        "where.checkResultFlag": "",
        "where.eventCode": "",
        "where.eventName": "",
        order: "",
        orderBy: "",
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      orgTableData: [],
      examineLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      proKey: proKey,
      dutyOpration:[]
    };
  },
  activated() {
    if (!this.$route.meta.isBack) {
      console.log("222要清空")
      this.resetForm('ruleForm');/*清空查询条件*/
    }else{
      console.log("333不清空")
      this.$route.meta.isBack = false;
      this.getLogs();/*列表重新加载*/
    }
  },
  computed: {
    ...mapState(["programNum"])
  },
  mounted() {
    this.getLogs();
    // this.getUnreadCheckCount();
    this.getDutyPerson();
  },
  methods: {
    //搜索负责人提示信息
    querySearch(queryString, cb) {
      let params={
        proKey:proKey,
        roleId:"32hxupGKa9Wci4Q0wnZ4jl",
        keyword:queryString || null
      }
      getDutyPerson(params).then((res)=>{
        this.dutyOpration = [];
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
      this.formInline.dutyPersonUid = item.value
    },
        // 获取值班员和领导列表
    getDutyPerson() {
       let params1={
        proKey:proKey,
        roleId:"32hxupGKa9Wci4Q0wnZ4jl"
      }
       let params2={
        proKey:proKey,
        roleId:"4ETnBg2GC3TLcllgLoLxIF"
      }
      getDutyPerson(params1).then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.map(item => {
            let unit = {};
            unit.value = item.uid;
            if (item.userMobile) {
              unit.label = item.userName + "(" + item.userMobile + ")";
            } else {
              unit.label = item.userName;
            }
            this.status.push(unit);
            console.log(this.status)
          });
        }
      });
      getDutyPerson(params2).then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.map(item => {
            let unit = {};
            unit.value = item.uid;
            if (item.userMobile) {
              unit.label = item.userName + "(" + item.userMobile + ")";
            } else {
              unit.label = item.userName;
            }
            unit.phone = item.userMobile;
            // this.supers.push(unit);
          });
        }
      });
    },
    
    // 打印时间（调试用）
    logTime(val) {
      console.log(val);
    },
    //初始化数据
    getLogs() {
      this.examineLoading = true;
      let d = {
        "where.receiveType": "1",
        // "where.checkType": "1",
        pageNum: this.pageNum,
        pageSize: 10,
        order:"desc",
        orderBy:"ere.record_time"
        // proKey: this.proKey
      };

      if (this.formInline.date) {
        d["where.reportStartTime"] = this.formInline.date[0];
        d["where.reportEndTime"] = this.formInline.date[1];
      }
      if (this.formInline.keyword) {
        d["where.eventCode"] = this.formInline.keyword;
        d["where.eventName"] = this.formInline.keyword;
      }
      if (this.formInline.handleStatus) {
        d["where.handleStatus"] = this.formInline.handleStatus;
      }
      if (this.formInline.dutyPersonUid) {
        d["where.dutyPersonUid"] = this.formInline.dutyPersonUid;
      }
      if (this.formInline.checkResultFlag) {
        d["where.checkResultFlag"] = this.formInline.checkResultFlag;
      }
      console.log(d);
      getLogs(d)
        .then(res => {
          if (res && res.data) {
            console.log("res", res);
            this.orgTableData = res.data.list;
            this.orgTableData.map((item, index)=>{
              item.rowIndex=index + 1
            })
            this.total = res.data.total;
            this.examineLoading = false;
          }
        })
        .catch(() => {
          this.examineLoading = false;
        });
    },

    //重置
    resetForm(formName) {
      this.pageNum = 1;
      this.$refs[formName].resetFields();
      this.formInline.dutyPersonLable = "";
      this.getLogs();
    },
    //提交
    onSubmit() {
      this.pageNum = 1;
      if(this.formInline.dutyPersonLable == ""){
        this.formInline.dutyPersonUid = this.formInline.dutyPersonLable
      }
      this.getLogs();
    },

    /* 表格操作 */
    // 核实
    verify(row) {
      this.$router.push({ name: "programVerify", query: { uid: row.uid } });
      if(row.isCheckRead==0){
        this.$store.dispatch('updateProgramNumAsync', this.programNum-1)
      }
    },
    // 查看
    check(row) {
      this.$router.push({ name: "programDetails", query: { uid: row.uid } });
      if(row.isCheckRead==0){
        this.$store.dispatch('updateProgramNumAsync', this.programNum-1)
      }
    },

    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getLogs();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getLogs();
    },
    // 加载更新未处理小红点数量    
    // getUnreadCheckCount() {
    //   let that = this;
    //   getUnreadCheckCount().then(res => {
    //     if (res && parseInt(res.data)>=0) {
    //       this.$store.dispatch('updateProgramNumAsync', res.data)
    //     }
    //   });
    // },
  }
};
</script>
<style lang="scss" scoped>
.boxBoder {
  .el-form {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .el-select {
    width: 160px;
  }
  .el-input {
    width: 160px;
  }
}
.operation_btn {
  padding: 0px 3px;
}
.disabled {
  color: #999999;
}

.dot-red{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #FB9400;
  position: relative;
  top: 0px;
  right: 5px;
  z-index: 5;
}
</style>
<style lang="scss">
.program-up {
  .el-date-editor {
    width: 320px;
    .el-range-separator {
      width: 30px;
    }
  }
  .overTime {
    color: red;
    margin-left: 10px;
  }
}
</style>