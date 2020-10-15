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
          <el-form-item label="">
            <el-input type="text" v-model.trim="roleName" placeholder="角色名称" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getAuthUserRoles">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="addRole">新增</el-button>
      </div>
      <div class="common_table">
        <el-table :data="commonList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="描述" prop="roleDesc"></el-table-column>
          <el-table-column label="创建日期" prop="createTime"></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookPower(scope.row)">查看权限</span>
              <span class="operation_btn" @click="disPower(scope.row)">权限配置</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
    </el-scrollbar>
  </div>
  
  <!-- 新增编辑弹框 -->
  <el-dialog title="新增角色" :visible.sync="addVersionVisible" width="600px" :close-on-click-modal="false">
    <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="100px">
      <el-form-item label="角色名称" prop="roleName" style="width:95%">
        <el-input v-model="addFormData.roleName" :maxlength="20" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc" style="width:95%">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" maxlength="100" :show-word-limit="true" v-model="addFormData.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" size="small">
      <el-button @click="onCancle()">取 消</el-button>
      <el-button type="primary" class="btn-save" @click="onConfirm()" :loading="versionLoading">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { formatDate } from "@/utils/util.js";
import { getAuthUserRoles, postUserRole } from "@/views/index/api/power/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "系统管理" }, { name: "角色管理" }],
      proKey:null,
      roleName:null,
      commonList:[{com:"123"}],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      addVersionVisible:false,
      addFormData:{
        roleName:null,
        roleDesc:null
      },
      addRules:{
        roleName:[
          {required: true, message: '该项不可为空', trigger: 'blur'}       
        ],
      },
      versionLoading:false
    };
  },
  mounted() {
    this.proKey = JSON.parse(localStorage.getItem("vis_user_info")).proKey;
    this.getAuthUserRoles()
  },
  methods: {    
    getAuthUserRoles(){
      let that=this
      that.tableLoading=true
      that.commonList=[]
      let params={
        "where.roleName":this.roleName,
        "where.proKey":this.proKey
      }
      getAuthUserRoles(params).then((res)=>{
        that.tableLoading=false
        that.total=res.data.total
        that.commonList=res.data.list
        that.commonList.map((item)=>{
          item.roleName=item.roleName || "-"
          item.roleDesc=item.roleDesc || "-"
          item.createTime=formatDate(item.createTime, "yyyy-MM-dd HH:mm:ss")
        })
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    resetForm(){
      this.pageNum=1
      this.roleName=null
      this.getAuthUserRoles()
    },
    addRole(){
      this.addFormData.roleName=null
      this.addFormData.roleDesc=null
      this.addVersionVisible=true
    },
    lookPower(obj){
      this.$router.push({name:'lookPower', params: { uid: obj.uid,name:obj.roleName,desc:obj.roleDesc }})
    },
    disPower(obj){
      this.$router.push({name:'distPower', params: { uid: obj.uid,name:obj.roleName,desc:obj.roleDesc  }})
    },
    onCancle(){
      this.addVersionVisible=false
    },
    onConfirm(){
      const that=this
      that.$refs.addForm.validate((valid) => {
        if(valid){
          that.versionLoading=true
          let params={}
          params.roleName=that.addFormData.roleName
          params.roleDesc=that.addFormData.roleDesc
          params.proKey=that.proKey
          params.systemCode=localStorage.getItem('systemCode') || null
          postUserRole(params).then((res)=>{
            that.versionLoading=false
            that.addVersionVisible=false
            that.getAuthUserRoles()
          }).catch((error)=>{
            that.versionLoading=false
            console.log("接口报错=>",error)
          })
        }
      })
    },
    onPageChange(page){
      this.pageNum = page
      this.getAuthUserRoles()
    },
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
