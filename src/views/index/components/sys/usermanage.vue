<!-- 
* @author  ps_gen
* @Date: 2020-10-9 09:52:34
* @description 用户管理.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <div class="bw-form">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input type="text" v-model.trim="userName" placeholder="用户姓名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input type="text" v-model.trim="userMobile" placeholder="用户手机号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="geAuthServicesUsers">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addUser">新增</el-button>
      </div>
      <div class="common_table">
        <el-table :data="commonList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="姓名" prop="userName"></el-table-column>
          <el-table-column label="手机号" prop="userMobile"></el-table-column>
          <el-table-column label="角色" prop="roleName"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="editUser(scope.row)">编辑</span>
              <span class="operation_btn" @click="resetPassword(scope.row)">重置密码</span>
              <span class="operation_btn" @click="delUser(scope.row)">删除</span>
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
import { formatDate } from "@/utils/util.js";
import { geAuthServicesUsers } from "@/views/index/api/power/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "系统管理" }, { name: "角色管理" }],
      proKey:null,
      userName:null,
      userMobile:null,
      commonList:[{com:"123"}],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  mounted() {
    this.proKey = JSON.parse(localStorage.getItem("vis_user_info")).proKey;
    this.geAuthServicesUsers()
  },
  methods: {    
    geAuthServicesUsers(){
      let that=this
      that.tableLoading=true
      that.commonList=[]
      let params={
        "where.keyWord":this.userName,
        "where.userMobile":this.userMobile,
        "where.proKey":this.proKey
      }
      geAuthServicesUsers(params).then((res)=>{
        that.tableLoading=false
        that.commonList=res.data.list
        that.commonList.map((item)=>{
          item.userName=item.userName || "-"
          item.userMobile=item.userMobile || "-"
          item.roleName=item.rmsUserRoleInfos[0].roleName || "-"
        })
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    resetForm(){
      this.pageNum=1
      this.userName=null
      this.userMobile=null
      this.geAuthServicesUsers()
    },
    addUser(){

    },
    editUser(obj){

    },
    resetPassword(obj){

    },
    delUser(obj){

    },
    onPageChange(){

    }
  },
};
</script>
<style lang="scss" scoped>
.bw-form{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
