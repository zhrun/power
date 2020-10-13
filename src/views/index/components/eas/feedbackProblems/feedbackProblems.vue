<template>
  <div class="program-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
            <el-form-item label="反馈时间" prop="data">
              <el-date-picker
                v-model="formInline.data"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                @change="logTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="问题类型" prop="opUserId">
              <el-select v-model="formInline.opUserId" placeholder="全部">
                <el-option :key="-1" label="全部" value></el-option>
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="搜索" prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="输入编号/名称搜索"></el-input>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="FeedbackExport">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 分页表格 -->
        <div class="common_table">
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="problemData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="问题类型" width="120">
              <template slot-scope="scope">
                <span>{{turnStatus(scope.row.type)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="问题内容" prop="content" show-overflow-tooltip></el-table-column>
            <el-table-column label="反馈用户" prop="userName" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.userName==null&&scope.row.userMobile==null">-</span>
                <span v-else>{{scope.row.userName || '-'}}({{scope.row.userMobile || '-'}})</span>
              </template>
            </el-table-column>
            <el-table-column label="反馈时间" prop="feedbackTime" width="220"></el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="operation_btn" @click="verify(scope.row)">核实</span>
                <span class="operation_btn" @click="check(scope.row)">查看</span>
              </template>
            </el-table-column>-->
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
import { getFeedbackData, getFeedbackExport } from "@/views/index/api/eas/api.eas.js";
export default {
  name: "feedbackProblems",

  components: { visBreadcrumb },
  data() {
    return {
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
      // 问题类型集合
      type: [
        {
          label: "操作问题",
          value: "1"
        },
        {
          label: "内容质量",
          value: "2"
        },
        {
          label: "美观问题",
          value: "3"
        },
        {
          label: "系统bug",
          value: "4"
        },
        {
          label: "其他问题",
          value: "5"
        }
      ],
      // 面包屑导航数据
      breadcrumbData: [{ name: "问题反馈" }, { name: "问题反馈" }],
      formInline: {
        date: null,
        opUserId: "",
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20
    };
  },
  mounted() {
    this.getFeedbackData();
  },
  methods: {
    // 打印时间（调试用）
    logTime(val) {
      this.formInline.data = val;
    },
    // 状态转化
    turnStatus(val) {
      switch (val) {
        case 1:
          return "操作问题";
        case 2:
          return "内容质量";
        case 3:
          return "美观问题";
        case 4:
          return "系统bug";
        case 5:
          return "其他问题";
        default:
          return "-";
      }
    },

    getFeedbackData() {
      this.loading = true;
      // this.pageNum = 1;
      let logdata = {};
      
      if (this.formInline.data) {
        logdata["where.startTime"] = this.formInline.data[0]
          ? this.formInline.data[0] + " 00:00:00"
          : null;
        logdata["where.endTime"] = this.formInline.data[1]
          ? this.formInline.data[1] + " 23:59:59"
          : null;
      } else {
        logdata["where.startTime"] = "";
        logdata["where.endTime"] = "";
      }

      if (this.formInline.opUserId) {
        logdata["where.type"] = this.formInline.opUserId;
      }
      logdata.pageNum = this.pageNum;
      logdata.pageSize = this.pageSize;
      logdata.orderBy = "create_time";
      logdata.order = "desc";

      getFeedbackData(logdata)
        .then(res => {
          if (res && res.data) {
            this.problemData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    // 导出
    FeedbackExport() {
      let logdata = {};

      if (this.formInline.data) {
        logdata["where.startTime"] = this.formInline.data[0]? this.formInline.data[0] + " 00:00:00"
          : null;
        logdata["where.endTime"] = this.formInline.data[1] ? this.formInline.data[1] + " 23:59:59"
          : null;
      } else {
        logdata["where.startTime"] = "";
        logdata["where.endTime"] = "";
      }

      if (this.formInline.opUserId) {
        logdata["where.type"] = this.formInline.opUserId;
      }
      logdata.pageNum = this.formInline.pageNum;
      logdata.pageSize = 0;

      getFeedbackExport(logdata).then(res => {
        if (res && res.data) {
          window.location = res.data.fileUrl;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.getFeedbackData();
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getFeedbackData();
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getFeedbackData();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getFeedbackData();
    }
  }
};
</script>

<style lang="scss" scoped>
.program-up {
  height: 100%;
  position: relative;
}
</style>
