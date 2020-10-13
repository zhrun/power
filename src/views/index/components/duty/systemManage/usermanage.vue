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
          <el-input
            placeholder="根据用户姓名/手机号查询"
            v-model="keyword"
            class="input-with-select"
            style="width:400px;"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
          <el-button type="primary" @click="addVersion" style="margin-left:20px;">添加用户</el-button>
        </div>

        <div class="common_table" style="margin-top:20px;" v-if="orgTableData && orgTableData.length>0">
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="orgTableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="用户姓名" prop="userName"  width="100"></el-table-column>
            <el-table-column label="账号/手机号" prop="userMobile"></el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-for="item in scope.row.rmsUserRoleInfos"
                  :key="item.uid"
                >{{item.roleName +" "}}</span>
              </template>
            </el-table-column>
            <el-table-column  label="所属单位">
              <template slot-scope="scope">
                <span v-if="scope.row.rmsOrganInfo">{{scope.row.rmsOrganInfo.organName || '-'}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column  label="岗位/职级">
             <template slot-scope="scope">
               <span v-if="scope.row.rmsPositionInfo">{{scope.row.rmsPositionInfo.positionName || '-'}}</span>
               <span v-else>-</span>
            </template>
          </el-table-column>
            <el-table-column label="创建日期" width="160px">
              <template slot-scope="scope">{{scope.row.createTime | fmTimestamp}}</template>
            </el-table-column>
            <el-table-column label="最近登录时间" width="160px">
              <template slot-scope="scope">{{scope.row.lastLoginTime | fmTimestamp}}</template>
            </el-table-column>
            <el-table-column label="状态" width="60">
              <template slot-scope="scope">
                <span v-if="!scope.row.isForce">启用</span>
                <span v-else>禁用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="judgeUserMange(scope.row,1)">编辑</span>
                <span class="operation_btn" @click="updatePassword(scope.row)">重置密码</span>
                <span
                  class="operation_btn"
                  @click="judgeUserMange(scope.row,2)"
                  v-if="!scope.row.isDefault"
                  :me="scope.row.uid==$store.state.userInfo.uid?'yes':'no'"
                >删除</span>
                <span class="operation_btn disabled" v-else>删除</span>
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
    <el-dialog
      :title="addVersionTitle"
      :visible.sync="addVersionVisible"
      width="600px"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="手机号" prop="userMobile">
          <el-input maxlength="11" v-model="addFormData.userMobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="addFormData.userName"  :maxlength="4" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop="organId" >
           <el-select v-model="addFormData.organId" placeholder="请选择单位"  style="width: 100%;" :disabled="usInfo.terminalType == 3 || usInfo.terminalType == 4">
            <el-option v-for="item in allOrganList" :key="item.uid" :label="item.organName" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="positionId" >
          <el-autocomplete
          class="inline-input"
          v-model="addFormData.positionName"
          value="uid"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
           :maxlength="10"
          value-key="positionName"
          @select="handleSelect"
          style="width:100%;"
        >
        <template slot-scope="{ item }">
          <div class="name pdr">{{ item.positionName }} <i class="el-icon-error postin" @click.stop="delPosb(item)"></i> </div>
        </template>
        </el-autocomplete>
        </el-form-item>
        <el-form-item label="配置角色" prop="roleIds">
          <el-select v-model="addFormData.roleIds" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in allRoleList"
              :key="item.uid"
              :label="item.roleName"
              :value="item.uid"
              
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="isForce">
          <el-radio-group v-model="addFormData.isForce">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
          <!-- <el-input v-model="addFormData.isForce" placeholder="请输入单位负责人"></el-input> -->
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

    <el-dialog
      title="编辑"
      :visible.sync="editorVersionVisible"
      width="600px"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="手机号" prop="userMobile">
          <el-input maxlength="11" v-model="addFormData.userMobile" disabled placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="addFormData.userName"  :maxlength="4" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop="organId" >
           <el-select v-model="addFormData.organId" :disabled="addFormData.uid==$store.state.userInfo.uid || usInfo.terminalType == 3 || usInfo.terminalType == 4" placeholder="请选择单位"  style="width: 100%;">
            <el-option v-for="item in allOrganList" :key="item.uid" :label="item.organName" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="positionId" >
          <el-autocomplete
          class="inline-input"
          v-model="addFormData.positionName"
          value="uid"
           :maxlength="10"
          
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          value-key="positionName"
          @select="handleSelect"
          style="width:100%;"
        >
        <template slot-scope="{ item }">
          <div class="name pdr">{{ item.positionName }} <i class="el-icon-error postin" @click.stop="delPosb(item)"></i> </div>
        </template>
        </el-autocomplete>
        </el-form-item>
        <el-form-item label="配置角色" prop="roleIds">
          <el-select v-model="addFormData.roleIds" placeholder="请选择" style="width: 100%;">
            <template v-for="item in allRoleList">
              <el-option
                :key="item.uid"
                :label="item.roleName"
                :value="item.uid"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="isForce">
          <el-radio-group v-model="addFormData.isForce">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
          <!-- <el-input v-model="addFormData.isForce" placeholder="请输入单位负责人"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('addForm')">取 消</el-button>
        <el-button
          type="primary"
          class="btn-save"
          @click="onEditorConfirm('addForm')"
          :loading="versionLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { checkVersion } from '@/utils/validator.js';
import { proKey } from "@/config/config.js";
import {
  getUserList,
  delUser,
  judgeUser,
  getDepartmentList,
  getJob,
  getRoleList,
  addJob,
  createUser,
  resetPwd,
  updateUser,
  judgeUserMange,
  deleteJob,
  getUserDetail
} from "@/views/index/api/eas/api.eas.js";
export default {
  components: { visBreadcrumb },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error());
      } else {
        if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
          callback(new Error("手机格式错误，请输入正确的手机号"));
        } else {
          if (this.addFormData.userMobile !== "") {
            callback();
            // this.$refs.ruleForm.validateField('checkPass');
            
          }
        }
      }
    };
    return {
      usInfo:JSON.parse(localStorage.getItem('vis_user_info')),
      // permission: JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" }, { name: "用户管理" }],
      orgTableData: [],
      danwei: "",
      statusType: {
        1: "组织单位",
        2: "联动单位"
      },
      keyword: "",
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionVisible: false,
      addVersionTitle: "新增",
      addRules: {
        userMobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" }
        ],
        roleIds: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      addFormData: {
        isForce: false,
        organId: "",
        positionId: "",
        positionName: "",
        proKey: this.proKey,
        roleIds: "",
        // userGroupIds: "",
        userName: "",
        userMobile: ""
      },
      versionLoading: false,
      editorVersionVisible: false,
      proKey: proKey,
      allOrganList: [],
      allJobList: [],
      allRoleList: [],
      defaultRoles: {}
    };
  },
  mounted() {
    this.getAllList();
    this.getUserList();
    // this.addFormData.organId = this.$store.state.userInfo?this.$store.state.userInfo.rmsOrganInfo.uid:''
    //  console.log(this.$store.state.userInfo, 'userInfo',this.$store.state.userInfo.rmsOrganInfo.uid)
  },
  methods: {
    delPosb(v) {
      // console.log(v);
      let d = {
        proKey: proKey,
        uid: v.uid
      };
      deleteJob(d).then(res => {
        if (res) {
          // console.log('res',res);
          let a = this.allJobList.findIndex(el => el.uid == v.uid);
          this.allJobList.splice(a, 1);
        }
      });
    },
    judgeUserMange(obj, index) {
      judgeUserMange({
        proKey: proKey,
        userMobile: obj.userMobile
      })
        .then(res => {
          if (res && res.code == "00000000") {
            if (!res.data) {
              if (index == 1) {
                this.updateVersion(obj);
              } else if (index == 2) {
                this.delOrange(obj);
              }
            } else {
              this.$message({
                type: "warning",
                message: "该用户是单位负责人，禁止该操作"
              });
            }
          }
        })
        .catch(() => {});
    },
    //一次性查询所有单位 岗位  角色  组
    getAllList() {
      let d = {
        "where.proKey": this.proKey,
        pageNum: 0,
        pageSize: 0
      };
      getDepartmentList(d).then(res=>{
        if(res && res.data){
          this.allOrganList = res.data.list
          
        }
      })
      getJob(d).then(res=>{
        if(res && res.data){
          this.allJobList = res.data.list
        }
      })
      getRoleList(d).then(res => {
        if (res && res.data) {
          this.allRoleList = res.data.list;
          // console.log('this.allRoleList',this.allRoleList);
          
          // this.defaultRoles = this.allRoleList.find(el=>el.roleName=="处置人员")
          // console.log(this.defaultRoles);
        }
      });
    },
    querySearch(queryString, cb) {
      var restaurants = this.allJobList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.positionName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    updateJob(){
      let d={
          "where.proKey":this.proKey,
          "pageNum":0
        }
      getJob(d).then(res=>{
        if(res && res.data){
          this.allJobList = res.data.list
        }
      })
    },
    handleSelect(item) {
      this.addFormData.positionId = item.uid
      // console.log(item);
    },
    addJob(callback){
      let d = {
        "positionName": this.addFormData.positionName,
        "proKey": this.proKey
      }
      addJob(d).then(res=>{
        if(res && res.code == "00000000"){
          this.addFormData.positionId = res.data
          if(callback) {
            this.updateJob()
            callback();
          }
        }
      })
    },
    //初始化数据 组织机构列表分页查询
    getUserList() {
      let d = {
        "where.proKey": this.proKey,
        pageNum: this.pageNum,
        "where.keyWord": this.keyword
      };
      getUserList(d).then(res => {
        if (res && res.data) {
          this.orgTableData = res.data.list
          //.filter(el=>el.rmsUserRoleInfos[0].roleType!=null);
          // console.log('this',this.orgTableData);
          
          this.total = res.data.total;//this.orgTableData.length;
          this.pageNum = res.data.pageNum;
        }
      });
    },

    //新增
    addVersion() {
      this.addVersionVisible = true;
      this.addVersionTitle = "新增";
      this.addFormData= {
        isForce: false,
        organId: "",
        positionId: "",
        positionName: "",
        proKey: this.proKey,
        roleIds: "",
        userName: "",
        userMobile: ""
      }
      // let _this = this;
    
    },
    //重置密码
    updatePassword(obj) {
      let d = {
        proKey: this.proKey,
        uid: obj.uid,
        userMobile: obj.userMobile
      };
      this.$confirm("确认修改密码？")
        .then(() => {
          resetPwd(d).then(res => {
            if (res) {
              // console.log(res);
              this.$message({
                message: "密码重置成功，已经将密码发送到手机。",
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //编辑
    updateVersion(obj) {
     
      
      // this.editorVersionVisible="编辑"
      let ids = "";
        // uds = [];
      if (obj.rmsUserRoleInfos && obj.rmsUserRoleInfos.length > 0) {
        ids = obj.rmsUserRoleInfos[0].uid;
      }
      this.addFormData = {
        isForce: obj.isForce,
        organId:obj.rmsOrganInfo && obj.rmsOrganInfo.uid || null,
        positionId:obj.rmsPositionInfo?obj.rmsPositionInfo.uid:'',
        positionName:obj.rmsPositionInfo?obj.rmsPositionInfo.positionName:'',
        proKey: this.proKey,
        roleIds: ids,
        userName: obj.userName,
        userMobile: obj.userMobile,
        uid: obj.uid
      };
      this.editorVersionVisible = true;
    },
    //删除
    delOrange(obj) {
      if (obj.uid == this.$store.state.userInfo.uid) {
        // this.$message.error('禁止删除当前账号')
        return;
      }
      this.$confirm("确认删除？")
        .then(() => {
          delUser({
            uid: obj.uid,
            proKey: this.proKey
          }).then(res => {
            if (res && res.code == "00000000") {
              // console.log('res=》',res);
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },

    //取消
    onCancle() {
      // this.$refs[formName].clearValidate()
      // console.log(formName)
      if (this.editorVersionVisible) {
        this.editorVersionVisible = false;
      }
      if (this.addVersionVisible) {
        this.addVersionVisible = false;
      }
    },
    //新添提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("验证通过"); //
          judgeUser({
              userMobile: this.addFormData.userMobile,
              proKey: this.proKey
            }).then(res => {
              if (res) {
                if (res.data) {
                  // 该手机账户已存在 修改用户信息
                  getUserDetail({
                    proKey:_this.proKey,
                    userMobile:_this.addFormData.userMobile
                  }).then(user=>{
                    if(user && user.data){
                      _this.addFormData.uid = user.data.uid
                      _this.editUser()
                    }else{
                      console.log('查询用户信息失败');
                      
                    }
                  })

                } else {
                  let a = _this.addFormData.positionName
                  let b = _this.allJobList.findIndex(el=>el.positionName == a)
                  if(b==-1){
                    _this.addJob(()=>{
                      _this.addUser()
                    })
                  }else{
                    _this.addUser()
                  }
                }
              }
            });
          
        } else {
          _this.versionLoading = false;
        }
      });
    },
    addUser() {
      // this.addFormData
      let d = {
        isForce: this.addFormData.isForce,
        proKey: this.proKey,
        organId:this.addFormData.organId,
        positionId:this.addFormData.positionId,
        positionName:this.addFormData.positionName,
        roleIds: this.addFormData.roleIds.toString(),
        userName: this.addFormData.userName,
        userMobile: this.addFormData.userMobile
      };
      createUser(d).then(res => {
        if (res && res.code == "00000000") {
          // console.log(res);
          this.addVersionVisible = false;
          this.$message({
            message: "新增用户成功",
            type: "success"
          });
          this.getUserList();
          this.versionLoading = false;
        } else {
          this.versionLoading = false;
        }
      });
    },
    //编辑提交
    onEditorConfirm() {
      let _this = this;
      _this.versionLoading = true;
      let a = _this.addFormData.positionName
      let b = _this.allJobList.findIndex(el=>el.positionName == a)
      if(b==-1){
        _this.addJob(()=>{
          _this.editUser()
        })
      }else{
        _this.addFormData.positionId =_this.allJobList[b].uid
        _this.editUser()
      }
    },
    editUser() {
      
      let d = {
        isForce: this.addFormData.isForce,
        proKey: this.proKey,
        organId:this.addFormData.organId,
        positionId:this.addFormData.positionId,
        positionName:this.addFormData.positionName,
        roleIds: this.addFormData.roleIds.toString(),
        userName: this.addFormData.userName,
        userMobile: this.addFormData.userMobile,
        uid: this.addFormData.uid
      };
       let duserName = this.addFormData.userName.trim()
      if(duserName==""){
        this.versionLoading = false;
        return 
      }
      updateUser(d)
        .then(res => {
          if (res && res.code == "00000000") {
            // console.log(res);
            this.editorVersionVisible = false;
            this.addVersionVisible = false;
            this.$message({
              message: "操作用户信息成功",
              type: "success"
            });
            this.getUserList();
          }
          this.versionLoading = false;
        })
        .catch(() => {
          this.versionLoading = false;
        });
    },

    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getUserList();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.pdr {
  position: relative;
}
.postin {
  position: absolute;
  z-index: 2;
  right: 20px;
  top: 12px;
}
.statistics {
  // height: 100%;
  position: relative;
}
.boxBoder {
  border: solid 1px #f5f5f5;
  padding: 10px 10px;
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
<style>
.usm .el-dialog__body {
  padding: 30px 100px 0px 60px;
}
</style>