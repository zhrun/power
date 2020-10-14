<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input type="text" v-model.trim="queryInfo" placeholder="用户名/姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryForm">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="common_table">
        <el-table :data="commonList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="用户姓名" prop="com"></el-table-column>
          <el-table-column label="手机号" prop="com"></el-table-column>
          <el-table-column label="所属单位" prop="com"></el-table-column>
          <el-table-column label="角色" prop="com"></el-table-column>
          <el-table-column label="岗位" prop="com"></el-table-column>
          <el-table-column label="创建日期" prop="com"></el-table-column>
          <el-table-column label="最近登录时间" prop="com"></el-table-column>
          <el-table-column label="状态" prop="com"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn">编辑</span>
              <span class="operation_btn">重置密码</span>
              <span class="operation_btn" @click="lookDetail(scope.row)">删除</span>
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
import { getOrgan } from "@/views/index/api/system/api.xy.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "系统管理" }, { name: "用户管理" }],
      queryInfo:"",
      commonList:[{com:"123"}],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  mounted() {
    this.getOrgan()
  },
  methods: {    
    getOrgan(){
      let that=this
      that.tableLoading=true
      that.commonList=[]
      getOrgan().then((res)=>{
        that.tableLoading=false
        console.log("res=>", res)
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    queryForm(){

    },
    resetForm(){

    },
    onPageChange(){

    }
  },
};
</script>
<style lang="scss" scoped>

</style>
