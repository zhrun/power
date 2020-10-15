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
  <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="500px" :close-on-click-modal="false">
    <el-form :model="formData" ref="editForm" :rules="addRules">
      <el-form-item label="姓名" prop="userName" label-width="100px">
        <el-input v-model="formData.userName" autocomplete="off" class="wid20"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="userMobile"  label-width="100px">
        <el-input v-model="formData.userMobile" autocomplete="off" class="wid20"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleUid" label-width="100px">
        <el-select v-model="formData.roleUid" placeholder="请选择角色" multiple collapse-tags class="wid20" @change="selRole">
          <el-option v-for="(item,index) in jobList" :label="item.roleName" :value="item.uid" :key="'job'+index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancle()">取 消</el-button>
      <el-button type="primary" @click="onConfirm()"  :loading="versionLoading">确 定</el-button>
    </div>
  </el-dialog>  
  <resetPsdDialog :show="showResetPsdDialog" @close="closeResetPsdDialog" @confirm="confirmResetPsd"></resetPsdDialog>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import resetPsdDialog from "@/components/common/resetPsdDialog";
import { formatDate } from "@/utils/util.js";
import { geAuthServicesUsers, postUserService, putUserService, deleteUserService } from "@/views/index/api/power/api.ps.js";
import { checkUserRename, getJoblist, resetPwd  } from "@/views/index/api/supplies/api.zr.js";
export default {
  components: { visBreadcrumb, resetPsdDialog },
  data() {
    var checkMobile =async (rule, value, callback) => {
      if (value === "") {
        callback(new Error());
      } else {
        if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          if (this.formData.userMobile !== "") {
            let a = await this.checkUserRename({
              userMobile:value,
              proKey:this.proKey 
            })
            if(this.formData.uid){
              a = false
            }
            if(!a){
              callback();
            }else{
              callback(new Error("该手机已经注册"));
            }
          }
        }
      }
    };
    var checkName =async (rule, value, callback) => {
      if (value === "") {
        callback(new Error());
      } else {
        if (this.formData.userName !== "") {
          let a = await this.checkUserRename({
            userName:value,
            proKey:this.proKey 
          })
          if(this.formData.uid){
            a = false
          }
          if(!a){
            callback();
          }else{
            callback(new Error("该用户名已经注册"));
          }            
        }
      }
    };
    return {
      breadcrumbData: [{ name: "系统管理" }, { name: "用户管理" }],
      proKey:null,
      userName:null,
      userMobile:null,
      commonList:[{com:"123"}],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      addVersionTitle:"新增用户",
      addVersionVisible:false,
      formData:{
        uid:null,
        userName:null,
        userMobile:null,
        roleUid:null,
      },
      addRules:{
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {validator: checkName, trigger: "blur" }
        ],
        userMobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        roleUid: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]        
      },
      jobList:[],
      versionLoading:false,
      roleIds:'',
      showResetPsdDialog: false,
      JSEncryptKey:null,
      changeObj:null,
    };
  },
  mounted() {
    this.proKey = JSON.parse(localStorage.getItem("vis_user_info")).proKey;
    this.geAuthServicesUsers()
    this.getJobList()
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
    async getJobList(){
      const {code, data} = await getJoblist({'where.proKey':this.proKey})
      if(code==='00000000'){
        this.jobList = data.list
      }
    },
    async checkUserRename(d){
      const {data} = await checkUserRename(d)
      return data
    },
    resetForm(){
      this.pageNum=1
      this.userName=null
      this.userMobile=null
      this.geAuthServicesUsers()
    },
    selRole(v){
      this.roleIds=''
      if(v && v.length>0){
        v.map(o=>{
          this.roleIds+=o + ','
        })
        this.roleIds=this.roleIds.substring(0,this.roleIds.length-1)
      }
    },
    addUser(){
      this.addVersionTitle="新增用户"
      this.formData.uid=null
      this.formData.userName=null
      this.formData.userMobile=null
      this.formData.roleUid=null
      this.roleIds=''
      this.addVersionVisible=true
    },
    editUser(obj){
      this.addVersionTitle="编辑用户"
      let roleId = obj.rmsUserRoleInfos.map(v=>{
        return v.uid
      })
      this.formData.uid=obj.uid
      this.formData.userName=obj.userName
      this.formData.userMobile=obj.userMobile
      this.formData.roleUid=roleId
      this.addVersionVisible=true
      this.roleIds=''
      if(roleId && roleId.length>0){
        roleId.map(o=>{
          this.roleIds+=o + ','
        })
        this.roleIds=this.roleIds.substring(0,this.roleIds.length-1)
      }
    },
    // 关闭重置密码弹框
    closeResetPsdDialog() {
      this.showResetPsdDialog = false;
    },
    // 确认重置密码
    confirmResetPsd(psd) {
      this.resetPsd(psd);
    },
     // 重置密码
    resetPassword(obj) {
      this.changeObj = obj
      this.showResetPsdDialog = true;
    },
   // 重置密码请求
    async resetPsd(newPsd) {       
      let encrypt = new window.JSEncrypt();
      encrypt.setPublicKey(this.JSEncryptKey);
      const params = {
        uid:this.changeObj.uid,
        password: encrypt.encrypt(newPsd),
        proKey: this.proKey,
      };
      const { code } = await resetPwd(params);
      if (code === "00000000") {
        this.$message({
          message: "重置密码成功",
          type: "success",
        });
        this.closeResetPsdDialog();
      }
    },
    delUser(obj){
      let that = this
      that.$alert('是否确定要删除？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid: obj.uid,
              proKey:that.proKey
            }
            deleteUserService(params).then((res)=>{
              if(res && res.code==="00000000") {
                that.geAuthServicesUsers()
                that.$message({
                  message: "操作成功！",
                  type: 'success'
                })
              }
            }).catch((error)=>{
              console.log("接口报错=>",error)
            })
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    onCancle(){
      this.addVersionVisible=false
    },
    onConfirm(){
      const that=this
      that.$refs.editForm.validate((valid) => {
        if(valid){
          that.versionLoading=true
          let params={}
          params.uid=that.formData.uid || null
          params.userName=that.formData.userName
          params.userMobile=that.formData.userMobile
          params.roleIds=that.roleIds
          params.proKey=that.proKey
          params.systemCode=localStorage.getItem('systemCode') || null
          if(this.addVersionTitle=="新增用户"){
            postUserService(params).then((res)=>{
              that.versionLoading=false
              that.addVersionVisible=false
              that.geAuthServicesUsers()
            }).catch((error)=>{
              that.versionLoading=false
              console.log("接口报错=>",error)
            })
          }else{
            putUserService(params).then((res)=>{
              that.versionLoading=false
              that.addVersionVisible=false
              that.geAuthServicesUsers()
            }).catch((error)=>{
              that.versionLoading=false
              console.log("接口报错=>",error)
            })
          }
        }
      })
    },
    onPageChange(page){
      this.pageNum = page
      this.geAuthServicesUsers()
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
.wid20{
  width:280px
}
</style>
