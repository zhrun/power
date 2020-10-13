/*
 * @Author: zhou.run
 * @Date: 2020-07-07 10:51:46 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-24 14:34:08
 */
<template>
  <div class="program-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline" @submit.native.prevent>
           
           
            <el-form-item label="搜索" prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="单位名称" @keyup.enter.native="onSubmit" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="FeedbackExport">导出</el-button>
            </el-form-item> -->
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
            
            <el-table-column label="单位名称">
              <template slot-scope="scope">
                <span>{{  scope.row.unitName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="事件快报文头"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.title || '-'}}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <span class="operation_btn" @click="editPost(scope.row)">编辑</span>
                <!-- <span class="operation_btn" @click="deletePost(scope.row)">删除</span> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
    
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editVersionVisible"
      width="600px"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="部门全称" prop="unitName">
          <el-input disabled v-model="addFormData.unitName" ></el-input>
        </el-form-item>
        <el-form-item label="事件快报文头" prop="title">
          <el-input v-model="addFormData.title"  :maxlength="10" placeholder="请输入事件快报文头"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('addForm')">取 消</el-button>
        <el-button
          type="primary"
          class="btn-save"
          @click="onConfirm('addForm')"
          :loading="versionLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getNewflashList,putNewflash} from "@/views/index/api/onDuty/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
export default {
  name: "eventExpressSetting",

  components: { visBreadcrumb },
  data() {
    return {
      // 面包屑导航数据
      breadcrumbData: [{ name: "系统设置" }, { name: "事件快报设置" }],
      formInline: {
        keyword: "",
      },
      // 表格数据
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      editVersionVisible:false,
      versionLoading: false,
      addRules: {
        title: [
          { required: true, message: "请输入事件快报文头", trigger: "blur" }
        ]
      },
      addFormData: {
        title: "要情快报",
        unitName: "",
        uid:''
      },
    };
  },
  mounted() {
    this.getNewflashList();
  },
  methods: {
    //查询列表
    getNewflashList() {
      this.loading = true;
      // this.pageNum = 1;
      let logdata = {};
      

      if (this.formInline.keyword) {
        logdata["where.unitName"] = this.formInline.keyword;
      }
      logdata.pageNum = this.pageNum;
      logdata.pageSize = this.pageSize;
      logdata.orderBy = "ut.sort_id";
      logdata.order = "asc";

      getNewflashList(logdata)
        .then(res => {
          if (res && res.code === '00000000') {
            this.problemData = res.data.list;
            this.total = res.data.total;
            this.loading = false;
          }
        })
        .catch(e => {
          console.error('e',e);
          this.loading = false;
        });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.getNewflashList();
    },
    // 编辑
    editPost(row){
      this.editVersionVisible = true;
      this.$nextTick(()=>{
        this.$refs['addForm'].clearValidate()
      })
      this.addFormData= {
        title: row.title,
        unitName: row.unitName,
        uid:row.uid
      }
    },
      //取消
    onCancle() {
      this.editVersionVisible = false;
    },
    //修改事件快报文头
    putNewflash(d){
      putNewflash(d).then(res=>{
        if(res && res.code === '00000000'){
           this.$message({
            type:'success',
            message:'编辑成功'
          })
          this.getNewflashList();
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    // 编辑提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          this.editVersionVisible = false;
          this.putNewflash({
            title:this.addFormData.title,
            uid:this.addFormData.uid
          })
          this.versionLoading = false;
        } else {
          _this.versionLoading = false;
        }
      });
    },
   

    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getNewflashList();
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getNewflashList();
    },
  }
};
</script>

<style lang="scss" scoped>
.program-up {
  height: calc(100% - 60px );
  position: relative;
}
.rightButton{
  position: absolute;
  right: 0;
}
.addDialog{
  border-radius:15px;
}
</style>