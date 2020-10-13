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
            <!-- <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button> -->
          </el-input>
          <el-button type="primary"  style="margin-left:20px;">查询</el-button>
          <el-button icon="iconfont iconbianzu12" class="rightButton" @click="addVersionVisible=true"> 新增用户</el-button>
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
            <el-table-column label="用户姓名" prop="userName"  width="100"></el-table-column>
            <el-table-column label="手机号" prop="userMobile"></el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-for="item in scope.row.rmsUserRoleInfos"
                  :key="item.uid"
                >{{item.roleName +" "}}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="judgeUserMange(scope.row,1)">编辑</span>
                <span class="operation_btn" @click="updatePassword(scope.row)">重置密码</span>
                <span class="operation_btn disabled" >删除</span>
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
    <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="500px">
      <el-form :model="formData" ref="editForm" :rules="addRules">
        <el-form-item label="姓名" prop="userName" label-width="100px">
          <el-input v-model="formData.userName" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile"  label-width="100px">
          <el-input v-model="formData.userMobile" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userJob"  label-width="100px">
          <el-select v-model="formData.region" placeholder="请选择活动区域" class="wid20">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVersionVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVersionVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { checkVersion } from '@/utils/validator.js';
import { proKey } from "@/config/config.js";
// import {} from "@/views/index/api/eas/api.eas.js";
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
      breadcrumbData: [{ name: "基础信息" }, { name: "用户管理" }],
      orgTableData: [],
      keyword: "",
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
          { required: true, message: "请输入用户姓名", trigger: "blur" }
        ],
        userJob: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      formData: {
        userName: "",
        userMobile: "",
        userJob: "",
        // proKey: this.proKey,
        uid: "",
      },
      proKey: proKey,
    };
  },
  mounted() {
    // this.getAllList();
    // this.getUserList();
    // this.addFormData.organId = this.$store.state.userInfo?this.$store.state.userInfo.rmsOrganInfo.uid:''
    //  console.log(this.$store.state.userInfo, 'userInfo',this.$store.state.userInfo.rmsOrganInfo.uid)
  },
  methods: {
   
    handleSelect(item) {
      this.addFormData.positionId = item.uid
      // console.log(item);
    },
    
    //初始化数据 组织机构列表分页查询
    getUserList() {
      
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
    updatePassword() {
      // let d = {
      //   proKey: this.proKey,
      //   uid: obj.uid,
      //   userMobile: obj.userMobile
      // };
      this.$confirm("确认修改密码？")
        .then(() => {
          // resetPwd(d).then(res => {
          //   if (res) {
          //     // console.log(res);
          //     this.$message({
          //       message: "密码重置成功，已经将密码发送到手机。",
          //       type: "success"
          //     });
          //   }
          // });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //编辑
    updateVersion() {
     
    },
    delUser(){

    },
    //删除
    delOrange(obj) {
      if (obj.uid == this.$store.state.userInfo.uid) {
        // this.$message.error('禁止删除当前账号')
        return;
      }
      this.$confirm("确认删除？")
        .then(() => {
          
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
         
          
        } else {
          _this.versionLoading = false;
        }
      });
    },
    addUser() {
      
    },
    //编辑提交
    onEditorConfirm() {
    
    },
    editUser() {
      
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
