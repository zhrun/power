<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 11:45:30
 * @LastEditTime: 2019-10-10 09:33:45
 * @LastEditors: Please set LastEditors
 -->
<template> 
  <div class="statistics usm">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
            <el-form-item label="手机号">
              <el-form-item prop="name">
                <el-input v-model="formInline.name" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="姓名">
              <el-form-item prop="keyword">
                <el-input v-model="formInline.keyword" placeholder="请输入仓库名称"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item class="rightButton">
              <el-button @click="showAdd()" icon="iconfont iconbianzu12"> 新增</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="common_table" style="margin-top:20px;" >
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="orgTableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="姓名" prop="userName" ></el-table-column>
            <el-table-column label="手机号" prop="userMobile" ></el-table-column>
            <el-table-column label="角色" show-overflow-tooltip >
              <template slot-scope="scope">
                <span v-for="item in scope.row.rmsUserRoleInfos" :key="'rId'+item.uid">{{item.roleName}} </span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作"  width="200" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="editUserMange(scope.row)">编辑</span>
                <span class="operation_btn" @click="resetUserPsd(scope.row)">重置密码</span>
                <span class="operation_btn" @click="deleleItem(scope.row)">删除</span>
                <!-- <span class="operation_btn disabled" >删除</span> -->
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
    <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="500px" :before-close="closed">
      <el-form :model="formData" ref="editForm" :rules="addRules">
        <el-form-item label="姓名" prop="userName" label-width="100px">
          <el-input v-model="formData.userName" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile"  label-width="100px">
          <el-input v-model="formData.userMobile" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleUid"  label-width="100px">
          <el-select v-model="formData.roleUid" placeholder="请选择角色" multiple collapse-tags class="wid20">
            <el-option v-for="(item,index) in jobList" :label="item.roleName" :value="item.uid" :key="'job'+index" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed('editForm')">取 消</el-button>
        <el-button type="primary" @click="onConfirm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <resetPsdDialog
      :show="showResetPsdDialog"
      @close="closeResetPsdDialog"
      @confirm="confirmResetPsd"
    ></resetPsdDialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { checkVersion } from '@/utils/validator.js';
import { checkUserRename, getJoblist,resetPwd } from "@/views/index/api/supplies/api.zr.js";
import { queryUsersList,createUsers,updateUsersList} from '@/views/index/api/system/api.zr.js';
import resetPsdDialog from "@/components/common/resetPsdDialog";
import { getPublicKey } from "@/views/index/api/eas/api.eas.js";
import { proKey } from '@/config/config.js';
export default {
  components: { visBreadcrumb ,resetPsdDialog},
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
              proKey:this.userInfo.proKey 
            })
            if(this.formData.uid){
              a = false
            }
            if(!a){
              callback();
            }else{
              callback(new Error("该手机已经注册"));
            }
            // this.$refs.ruleForm.validateField('checkPass');
            
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
              proKey:this.userInfo.proKey 
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
      userInfo:JSON.parse(localStorage.getItem('vis_user_info')),
      // permission: JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" }, { name: "用户管理" }],
      orgTableData: [],
      formInline: {
        name:'',
        keyword:''
      },
      showResetPsdDialog: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionVisible: false,
      addVersionTitle: "新增用户",
      addRules: {
        userMobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {validator: checkName, trigger: "blur" }
        ],
        userJob: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      formData: {
        userName: "",
        userMobile: "",
        roleUid: [],
        uid: "",
      },
      jobList:[],
      JSEncryptKey:null,
      changeObj:null,
    };
  },
  mounted() {
    this.getPublicKey();
    this.getJobList();
    this.getUserList();
    //  console.log(this.$store.state.userInfo, 'userInfo',this.$store.state.userInfo.rmsOrganInfo.uid)
  },
  methods: {
    async checkUserRename(d){
      const {data} = await checkUserRename(d)
      return data
    },
    // 加密
    getPublicKey() {
      getPublicKey().then((res) => {
        if (res && res.code == "00000000") {
          this.JSEncryptKey = res.data;
        }
      });
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
    resetUserPsd(obj) {
      this.changeObj = obj
      this.showResetPsdDialog = true;
    },
  
    showAdd() {
      this.addVersionVisible = true
      this.addVersionTitle= "新增用户"
      console.log(123465);
    },
    async getJobList(){
      const {code, data} = await getJoblist({
        'where.proKey':this.userInfo.proKey
      })
      if(code==='00000000'){
        this.jobList = data.list
      }
    },
    //初始化数据 列表分页查询
    async getUserList(d) {
      if(!d){
        d={
          "where.proKey":proKey
        }
      }else{
        d['where.proKey'] = proKey
      }
      // d.proKey = this.proKey 
      // console.log('dd');
      
      const {code , data} = await queryUsersList(d)
      if(code ==='00000000'){
        this.orgTableData = data.list
        this.total = data.total
        
      }
    },
  //重置密码
   // 重置密码请求
    async resetPsd(newPsd) {
       
        let encrypt = new window.JSEncrypt();
        encrypt.setPublicKey(this.JSEncryptKey);
        const params = {
          uid:this.changeObj.uid,
          password: encrypt.encrypt(newPsd),
          proKey: this.userInfo.proKey,
        };
        const { code } = await resetPwd(params);
        if (code === "00000000") {
          this.$message({
            message: "重置密码成功",
            type: "success",
          });
          this.closeResetPsdDialog();
          // this.$refs.table.clearSelection();
        }
    },
    //编辑
    editUserMange(obj) {
      let roleId = obj.rmsUserRoleInfos.map(v=>{
        return v.uid
      })
      
      this.addVersionTitle= "编辑用户"
    
      this.addVersionVisible=true
      this.formData.roleUid = roleId
      this.formData.uid = obj.uid
      this.formData.userName = obj.userName
      this.formData.userMobile = obj.userMobile
    },
    onSubmit(){
      let data ={
        "where.userName":this.formInline.keyword || null,
        "where.userMobile":this.formInline.name || null,
        "pageNum":this.pageNum
      }
      this.getUserList(data)
    },
    
    //新添 编辑 提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("验证通过"); //
          if(this.addVersionTitle == '新增用户'){
            this.addUser()
          }else{
            this.onEditorSava()
          }
          
        } else {
          _this.versionLoading = false;
        }
      });
    },
    closed() {
      this.$refs['editForm'] && this.$refs['editForm'].clearValidate();
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
      this.addVersionVisible = false;
    },
    async addUser() {
      const {code} = await createUsers({
        "userMobile": this.formData.userMobile,
        "roleIds": this.formData.roleUid.toString(),
        "userName": this.formData.userName,
        "proKey":proKey
      })
      if(code === '00000000'){
        this.$message({
          message: `添加成功`,
          type: "success",
        });
      this.$refs.editForm.resetFields();
      this.addVersionVisible = false
      this.pageNum = 1
      this.getUserList();
        // this.$refs.formRule.clearValidate();
      }
    },
    //编辑提交
    async onEditorSava() {
      const {code} = await updateUsersList({
        "userMobile": this.formData.userMobile,
        "roleIds": this.formData.roleUid.toString(),
        "userName": this.formData.userName,
        "uid": this.formData.uid,
        "proKey":proKey
      })
      if(code==='00000000'){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.closed('editForm')
        let data ={
          "where.userName":this.formInline.keyword || null,
          "where.userMobile":this.formInline.name || null,
          "pageNum":this.pageNum,
          "pageSize":this.pageSize
        }
        this.getUserList(data);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.getUserList()
    },

    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
       let data ={
        "where.userName":this.formInline.keyword || null,
        "where.userMobile":this.formInline.name || null,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize
      }
      this.getUserList(data);
    },
   
  }
};
</script>
<style lang="scss" scoped>
.rightButton {
  position: absolute;
  right: 0;
}
.wid20{
  width:280px
}
.statistics {
  // height: 100%;
  position: relative;
}
.boxBoder {
  position: relative;
  // border: solid 1px #f5f5f5;
  padding: 10px 0px;
}
.operation_btn {
  padding: 0px 3px;
}
.operation_btn[me="yes"] {
  cursor: not-allowed;
  color: #999;
}
.disabled {
  color: #999999;
}
</style>
