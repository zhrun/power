<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 11:45:30
 * @LastEditTime: 2019-09-29 11:37:44
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
      <div class="boxBoder">
         <el-input placeholder="用户组名称" v-model="keyword" class="input-with-select" style="width:400px;">
         
            <el-button slot="append" icon="el-icon-search" @click="getUserGroups"></el-button>
          </el-input>
          <el-button type="primary" @click="addVersion" style="margin-left:20px;">添加用户组</el-button> 
      </div>
               
      <div class="common_table" style="margin-top:20px;">
        <el-table class="table-comp" ref="versionTable" :data="orgTableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="序号" type="index"  width="50"></el-table-column>
          <el-table-column  label="用户组名称" prop="groupName" ></el-table-column>
          <el-table-column  label="用户数量" prop="userCount"></el-table-column>
          <el-table-column  label="角色" show-overflow-tooltip>
            <template slot-scope="scope" >
              <span  v-for="item in scope.row.roleList"  :key="item.uid"> {{item.roleName +" "}}</span> 
            </template>
          </el-table-column>
          <el-table-column  label="所属单位" prop="organName"></el-table-column>
          <el-table-column  label="创建人" prop="opUserName"></el-table-column>
          <el-table-column  label="创建日期">
            <template slot-scope="scope">
               {{scope.row.createTime | fmTimestamp}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" >
            <template slot-scope="scope">
              <span class="operation_btn" @click="updateVersion(scope.row)">编辑</span> 
              <span class="operation_btn" @click="delOrange(scope.row)" v-if="!scope.row.isDefault">删除</span>
              <span class="operation_btn disabled"  v-else>删除</span>
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
    <!-- 新增编辑弹框 -->
    <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="600px" :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="addFormData.groupName" placeholder="请输入组名"></el-input>
        </el-form-item>
        <el-form-item label="配置角色" prop="roleIds" >
           <el-select v-model="addFormData.roleIds"  placeholder="请选择角色" style="width: 100%;">
             <el-option v-for="item in allRoleList" :key="item.uid" :label="item.roleName" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组内用户" prop="userIds" >
          <el-select v-model="addFormData.userIds" filterable  multiple  placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in allUser"
              :key="item.uid"
              :label="item.userName"
              :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
    
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('addForm')">取 消</el-button>
        <el-button type="primary" class="btn-save" @click="onConfirm('addForm')" :loading="versionLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { checkVersion } from '@/utils/validator.js';
// import { getUserGroups, delUserGroup,getUserList,getRoleList,createUserGroups ,updateUserGroups} from '@/views/index/system/api.zr.js';
import { getUserGroups, delUserGroup,getUserList,getRoleList,createUserGroups ,updateUserGroups} from '@/views/index/api/system/api.zr.js';
import { proKey } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      permission:JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" },{ name: "用户管理"}],
      orgTableData:[],
      statusType:{
        1:"组织单位",
        2:"联动单位"
      },
      keyword:"",
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionVisible:false,
      addVersionTitle:"新增",
      addRules:{
        groupName:[
          {required: true, message: '该项不可为空', trigger: 'blur'}
        ],        
        
      },
      addFormData:{
        "groupName": "",
        "organId": "",
        "organName": "",
        "proKey": localStorage.getItem("common_proKey"),
        "roleIds": "",
        "userIds": ""
      },
      
      versionLoading:false,
      proKey: proKey,//localStorage.getItem("common_proKey"),
      allUser:[],
      allRoleList:[],
      userInfo:{}
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("vis_user_info"))
    this.getUserGroups()
    this.getUserList()
    this.getRoleList()
  },
  methods: {
     getUserList(){
       let d={
          "where.proKey":this.proKey,
          "pageNum":0 
        }
 
      getUserList(d).then(res=>{
        if(res && res.data){
          this.allUser = res.data.list
          
        }
      })
    },
    getRoleList(){
      let d={
          "where.proKey":this.proKey,
          "pageNum":0
        }
      getRoleList(d).then(res=>{
        if(res && res.data){
          this.allRoleList = res.data.list
        }
      })
    },
    
    //初始化数据 
    getUserGroups(){
       let d={
          "where.proKey":this.proKey,
          "pageNum":this.pageNum,
          "where.groupName":this.keyword,
        }
      
      getUserGroups(d).then(res=>{
        if(res && res.data){
          //  console.log('res',res);
          this.orgTableData = res.data.list
          this.total = res.data.total
          this.pageNum = res.data.pageNum
          
        }
      })
    },
   
    //新增
    addVersion(){
      this.addVersionVisible=true
      this.addFormData={
        "groupName": "",
        "organId": "",
        "organName": "",
        "proKey": this.proKey,
        "roleIds": "",
        "userIds": ""
      }
    },
    //编辑
    updateVersion(obj){
      console.log(obj)
      this.addVersionTitle="编辑"
      this.addVersionVisible=true
      let ids = ''
      let uds = []
      if(obj.roleList && obj.roleList.length>0){
        ids = obj.roleList[0].uid
        // obj.roleList.forEach(el=>{
        //   ids.push(el.uid)
        // })
      }
      if(obj.userList.length>0){
        obj.userList.forEach(el=>{
          uds.push(el.uid)
        })
      }
      
      this.addFormData={
        "groupName": obj.groupName,
        "organId": obj.organId,
        "organName": obj.organName,
        "proKey": this.proKey,
        "roleIds":ids,
        "userIds": uds,
        "uid":obj.uid
      }
    },
    //删除
    delOrange(obj){
       this.$confirm('确认删除？')
          .then(() => {
            // done();
            delUserGroup({
              uid:obj.uid, 
              proKey :this.proKey
            }).then(res=>{
              if(res && res.code=="00000000"){
                this.getUserGroups()
                this.$message({
                  type:"success",
                  message:"删除成功"
                })
              }
            })
          })
          .catch(() => {
            console.log('取消删除');
            
          });
      
    },
  
    //取消
    onCancle (formName) {
      // this.AEdialogVisible = false;
      // this.$refs[formName].clearValidate()
      console.log(formName)
      this.addVersionVisible=false
    },
    //提交
    onConfirm (formName) {
      this.versionLoading = true
      this.$refs[formName].validate((valid) => {
        if(valid){
          console.log("验证通过")
          if(this.addVersionTitle=="新增"){
            this.createUserGroups()
          }else{
            this.editerUserGroups()
          }
          // this.addVersionVisible = false
        }
      })
    },
    editerUserGroups(){
      let d = this.addFormData
      // d.organId = this.userInfo.rmsOrganInfo.uid
      // d.organName = this.userInfo.rmsOrganInfo.organName
      d.roleIds = this.addFormData.roleIds.toString()
      d.userIds =  this.addFormData.userIds.toString()
      updateUserGroups(d).then(res=>{
          if(res && res.code=="00000000"){
          this.addVersionVisible=false
          this.$message({
            type:"success",
            message:"修改成功"
          })
          this.getUserGroups();
          
        }
        this.versionLoading = false
      })
    },
    //新加
    createUserGroups(){
      // console.log('dd', this.userInfo);
      
      let d = this.addFormData
      d.organId = this.userInfo.rmsOrganInfo?this.userInfo.rmsOrganInfo.uid:null
      d.organName = this.userInfo.rmsOrganInfo?this.userInfo.rmsOrganInfo.organName:null
      d.roleIds = this.addFormData.roleIds.toString()
      d.userIds =  this.addFormData.userIds.toString()
      createUserGroups(d).then(res=>{
        if(res && res.code=="00000000"){
          this.addVersionVisible=false
          this.$message({
            type:"success",
            message:"添加成功"
          })
          this.getUserGroups();
          
        }
        this.versionLoading = false
      }).catch(error=>{
        this.versionLoading = false
        console.error(error.debugMsg);
        
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getUserGroups();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.statistics {
  // height: 100%;
  position: relative;
}
.boxBoder{
  border: solid 1px #f5f5f5;
  padding: 10px 10px;
}
.operation_btn{
  padding: 0px 3px;
}
.disabled{
  color: #999999;
}
</style>
<style>
.el-dialog__body{
  padding:30px 100px 0px 60px;
}
</style>