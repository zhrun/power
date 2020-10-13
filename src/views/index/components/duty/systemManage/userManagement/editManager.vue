<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-10
* @description 新增/修改用户
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data='breadcrumbData'></visBreadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <el-form ref="userForm" :model="model" :rules="rules" label-width="80px">
            <table width="100%">
              <tr>
                <td class="form_item">
                  <el-form-item label="所属单位" prop="unitName">
                    <div class="input_btn">
                      <el-input v-model="model.unitName" disabled></el-input>
                      <el-button type="primary" @click="selectUnit" v-if="!isEdit">选择</el-button>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks">人员所在单位。</td>
                <td class="remarks"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="姓名" prop="userName">
                    <el-input v-model.trim="model.userName" maxlength="10"></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">该人员中文姓名。</td>
                <td class="remarks">如：张三。</td>
              </tr>
              <tr>
                <td class="form_item" valign="middle">
                  <el-form-item label="用户名" prop="loginName">
                    <el-input v-model.trim="model.loginName" :disabled="isEdit"></el-input>
                    <!-- <span class="psd_tip">初始密码为a123456</span> -->
                  </el-form-item>
                </td>
                <td class="remarks">
                  用户名为系统自动生成，一般为人员姓名拼音。
                  <div class="tips">注：人员创建成功后，该项不可更改。</div>
                  初始密码为Aa123456
                </td>
                <td class="remarks">如：zhangsan</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="卡号" prop="cardNo">
                    <el-input v-model="model.cardNo" disabled></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">系统自动生成卡号，由单位所在的行政区划代码+001~999数字组成，卡号可以作为管理员后台登录名。</td>
                <td class="remarks"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="手机号码" prop="userMobile">
                    <el-input v-model.trim="model.userMobile" maxlength="11"></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">手机号码登录时需要接收短信验证码，必须为正确、真实号码。长度为11位数字。</td>
                <td class="remarks"></td>
              </tr>
            </table>
            <div class="footer_buttons">
              <el-button @click="back">返回</el-button>
              <el-button type="primary" @click="save">保存</el-button>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
    </main>
    <unit-tree-dialog
      :show="showUnitTree"
      :unitData="unitTreeData"
      :current-uid="currentUid"
      @close="closeUnitTreeDialog"
      @confirm="confirm"
    >
    </unit-tree-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import unitTreeDialog from "@/components/common/unitTreeDialog";
import { spelling } from "@/utils/pinyinUtil";
import {
  getZbTree,
  addUser,
  editUser,
  getUserDetails,
  generateCardNO,
  checkUserRename,
  checkName,
} from "@/views/index/api/onDuty/api.yy.js";
import _debounce from "lodash/debounce";
import _assign from "lodash/assign";
import _cloneDeep from "lodash/cloneDeep";

export default {
  name: "editManager",
  components: { visBreadcrumb, unitTreeDialog },
  props: {
    uid: "",
    flag: "",
    unitUid: "",
    unitName: "",
  },
  data() {
    const _this = this;
    const validateName = async (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5]+(\d+)?$/;
      if (value && !reg.test(value)) {
        return callback(new Error("请正确输入姓名"));
      }
      if (value !== _this.initialData.userName) {
        const params = {
          unitId: this.model.unitUid,
          userName: value,
        };
        const { code, data } = await checkName(params);
        if (code === "00000000" && data) {
          return callback("姓名已存在，建议以姓名+后缀加以区分，如：张三1。");
        }
        return callback();
      }
      callback();
    };
    const checkLoginName = async (rule, value, callback) => {
      let reg = /^([a-zA-Z0-9]|[a-zA-Z]){0,18}$/;
      if (value && !reg.test(value)) {
        return callback(new Error("用户名为不超过18位的英文或英文+数字"));
      }
      if (value !== _this.initialData.loginName) {
        const params = {
          proKey: _this.proKey,
          loginName: value,
        };
        const { code, data } = await checkUserRename(params);
        if (code === "00000000" && data) {
          return callback("用户名已存在");
        }
      }
      callback();
    };
    const checkTelphone = async (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      let reg = /^1\d{10}$|^0\d{2,3}-?\d{7,8}$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      }
      if (value !== _this.initialData.userMobile) {
        const params = {
          proKey: _this.proKey,
          userMobile: value,
        };
        const { code, data } = await checkUserRename(params);
        if (code === "00000000" && data) {
          return callback("手机号码已存在");
        }
      }
      callback();
    };
    return {
      breadcrumbData: [
        { name: "系统管理" },
        { name: "用户管理", routerName: "userManagement" },
      ],
      model: {
        uid: "",
        admin: true,
        userType: 1,
        unitName: "",
        unitUid: "",
        loginName: "",
        userMobile: "",
        cardNo: "",
        userName: "",
      },
      showUnitTree: false,
      unitTreeData: [],
      rules: {
        unitName: [
          { required: true, message: "请选择所属单位", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ],
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkLoginName, trigger: "blur" },
        ],
        userMobile: [{ validator: checkTelphone, trigger: "blur" }],
      },
      currentUid: "",
      proKey: "",
      initialData: {},
    };
  },
  computed: {
    isEdit() {
      return this.flag === "edit";
    },
  },
  watch: {
    "model.userName": {
      handler(val) {
        // 根据用户姓名生成用户名
        if (this.isEdit) return;
        this.model.loginName = spelling(val);
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.proKey = userInfo.proKey;
      this.breadcrumbData.push({
        name: this.isEdit ? "管理员编辑" : "管理员新增",
      });
      this.model.unitUid = this.unitUid;
      this.model.unitName = this.unitName;
      this.getZbTree();
      if (this.isEdit) {
        this.getUserDetails();
      } else {
        this.generateCardNO();
      }
    },
    // 获取用户详情
    async getUserDetails() {
      try {
        const { code, data } = await getUserDetails({ uid: this.uid });
        if (code === "00000000") {
          _assign(this.model, data);
          this.initialData = data;
        }
      } catch {
        this.$message({
          message: "访问失败！",
          type: "error",
        });
      }
    },
    // 点击返回按钮
    back() {
      this.$confirm("是否确定要返回？", "提示")
        .then(() => {
          this.goback();
        })
        .catch();
    },
    // 回退
    goback() {
      this.$router.go(-1);
    },
    // 点击保存
    save: _debounce(function() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.validateSuccess();
        }
      });
    }, 500),
    // 校验通过后请求接口
    async validateSuccess() {
      const params = _cloneDeep(this.model);
      params.userMobile = params.userMobile || null;
      try {
        const { code } = await (this.isEdit
          ? editUser(params)
          : addUser(params));
        if (code === "00000000") {
          this.$message({
            message: `${this.isEdit ? "修改" : "新建"}管理员成功`,
            type: "success",
          });
          setTimeout(() => {
            this.goback();
          }, 1500);
        }
      } catch {
        this.$message({
          message: `${this.isEdit ? "修改" : "新建"}管理员失败`,
          type: "error",
        });
      }
    },
    // 打开机构选择弹框
    selectUnit() {
      this.currentUid = this.model.unitUid;
      this.showUnitTree = true;
    },
    // 关闭机构选择弹框
    closeUnitTreeDialog() {
      this.showUnitTree = false;
    },
    // 确认选择机构
    confirm({ uid, unitName }) {
      this.model.unitName = unitName;
      this.model.unitUid = uid;
      this.closeUnitTreeDialog();
      this.generateCardNO();
    },
    // 获取总后台机构树数据
    async getZbTree() {
      this.treeIsloading = true;
      try {
        const { code, data } = await getZbTree();
        if (code === "00000000") {
          this.unitTreeData = [data];
        }
      } catch {
        this.$message({
          message: "获取机构树失败!",
          type: "error",
        });
      }
      this.treeIsloading = false;
    },
    // 根据机构id生成卡号
    async generateCardNO() {
      try {
        const params = { unitId: this.model.unitUid };
        const { code, data } = await generateCardNO(params);
        if (code === "00000000") {
          this.model.cardNo = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
tr {
  border: 1px solid $border_color;
  td {
    padding: 20px;
    border-left: 1px solid $border_color;
    &:first-child {
      border-left: none;
    }
  }
  .form_item {
    color: #333333;
    .el-form-item {
      width: 100%;
      margin-bottom: 0px;
    }
    .el-button {
      margin-left: 10px;
    }
    .psd_tip {
      position: absolute;
      left: 0px;
      top: 40px;
      font-size: 12px;
      line-height: 12px;
      padding-top: 4px;
    }
    .input_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .remarks {
    width: 30%;
    font-size: 12px;
    color: #999999;
    .tips {
      color: #ff0000;
    }
  }
}
.footer_buttons {
  width: 100%;
  text-align: center;
  margin: 30px 0;
}
</style>
