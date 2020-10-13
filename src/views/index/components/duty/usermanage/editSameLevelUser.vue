<!-- 
* @module user-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 新增/编辑本级用户
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data='breadcrumbData'></vis-breadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <el-form ref="userForm" :model="model" :rules="rules" label-width="80px" v-loading="loading">
            <table width="100%">
              <tr>
                <td class="form_item">
                  <el-form-item label="用户角色" prop="unitName">
                    <el-checkbox-group v-model="model.roles" @change="changeRoles">
                      <el-checkbox :label="roleName" v-for="roleName in roleNameList" :key="'role' + roleName"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </td>
                <td class="remarks">选择对应的系统用户角色，一个人员可同时存在多种角色。</td>
                <td class="remarks">如张三是带班领导 ，也是系统管理员，此处同时应勾选“带班领导”和“管理员”。</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="姓名" prop="userName">
                    <el-input v-model.trim="model.userName"></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">该人员中文姓名。</td>
                <td class="remarks">如：张三。</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="用户名" prop="loginName">
                    <el-input v-model.trim="model.loginName" :disabled="isEdit"></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">
                  用户名为系统自动生成，一般为人员姓名拼音。
                  <div class="tips">注：人员创建成功后，该项不可更改。</div>
                </td>
                <td class="remarks">如：zhangsan</td>
              </tr>
              <tr v-if="model.roles.includes('单位管理员')">
                <td class="form_item">
                  <el-form-item label="卡号" prop="cardNo">
                    <el-input v-model="model.cardNo" disabled></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">系统自动生成卡号，由单位所在的行政区划代码+001~999数字组成，卡号可以作为管理员后台登录名。</td>
                <td class="remarks">如：431200001</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item
                    label="手机号码"
                    prop="userMobile"
                  >
                    <el-input v-model.trim="model.userMobile" maxlength="11"></el-input>
                  </el-form-item>
                </td>
                <td class="remarks">手机号码登录时需要接收短信验证码，必须为正确、真实号码。长度为11位数字。</td>
                <td class="remarks">如：15000000001。</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="职务" prop="titleUid" ref="titleUid" :required="titleRequired">
                    <div class="title_td">
                      <div class="select_input">
                        <el-select v-model="model.titleUid">
                          <el-option
                            v-for="(item, index) in titleOptions"
                            :key="'title' + index"
                            :value="item.uid"
                            :label="item.name"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-model.trim="model.titleNameEx"
                          :disabled="model.titleUid && model.titleUid !== '99'"
                          @blur="handleTitleBlur"
                        ></el-input>
                      </div>
                      <el-checkbox
                        v-if="model.titleUid === '99'"
                        v-model="model.titleShow"
                        class="checkbox_tip"
                      >
                        是否把你输入的职务加入到常见职务列中
                      </el-checkbox>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks">该人员的所在单位的行政职务，菜单包含省长、副省长、秘书长、副秘书长、市长、副市长、厅长、副厅长、主任、副主任、处长、副处长、其他，可以由人工录入。</td>
                <td class="remarks">如：市长。</td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="级别" prop="levelUid" ref="levelUid" :required="levelRequired">
                    <div class="title_td">
                      <div class="select_input">
                        <el-select v-model="model.levelUid">
                          <el-option
                            v-for="(item, index) in levelOptions"
                            :key="'level' + index"
                            :value="item.uid"
                            :label="item.name"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-model.trim="model.levelNameEx"
                          :disabled="model.levelUid && model.levelUid !== '99'"
                          @blur="handleLevelBlur"
                        ></el-input>
                      </div>
                      <el-checkbox
                        v-if="model.levelUid === '99'"
                        v-model="model.levelShow"
                        class="checkbox_tip"
                      >
                        是否把你输入的级别加入到常见级别列中
                      </el-checkbox>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks">该人员的级别，包括正部级、副部级、正厅级、副厅级、正处级、副处级、正科级、副科级、其它（请注明），依据于《中国行政级别划分和行政人员工资表》。</td>
                <td class="remarks">如：正科级。</td>
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
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { spelling } from "@/utils/pinyinUtil";
import { getPostionList } from "@/views/index/api/onDuty/api.zr.js";
import {
  addUser,
  editUser,
  getUserDetails,
  getUserRoles,
  generateCardNO,
  checkUserRename,
  checkName,
} from "@/views/index/api/onDuty/api.yy.js";
import _assign from "lodash/assign";
import _cloneDeep from "lodash/cloneDeep";

export default {
  name: "editSameLevelUser",
  components: { visBreadcrumb },
  props: {
    uid: "",
    flag: "",
  },
  data() {
    const _this = this;
    const validateName = async (rule, value, callback) => {
      if (value && !/^[\u4E00-\u9FA5]+(\d+)?$/.test(value)) {
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
      }
      callback();
    };
    const checkLoginName = async (rule, value, callback) => {
      if (!_this.isEdit) return callback;
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
    const checkUserMobile = async (rule, value, callback) => {
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
        { name: "用户管理" },
        { name: "本级用户", routerName: "sameLevelUser" },
      ],
      proKey: "",
      loading: false,
      model: {
        roles: ["值班人员"],
        unitUid: "",
        unitName: "",
        uid: "",
        userName: "",
        userMobile: "",
        cardNo: "",
        loginName: "",
        titleUid: "",
        titleName: "",
        titleNameEx: "",
        titleShow: false,
        levelUid: "",
        levelName: "",
        levelNameEx: "",
        levelShow: false,
        userType: "2",
      },
      titleRequired: false,
      titleOptions: [],
      levelRequired: false,
      levelOptions: [],
      rules: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ],
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkLoginName, trigger: "blur" },
        ],
        userMobile: [{ validator: checkUserMobile, trigger: "blur" }],
      },
      roleList: [],
      roleNameList: [],
      rolesHistory: ["值班人员"],
      initialData: {},
    };
  },
  computed: {
    isEdit() {
      return this.flag === "edit";
    },
  },
  watch: {
    "model.roles": {
      handler(val) {
        const checkTitle = (rule, value, callback) => {
          if (!value) {
            return callback(new Error("请选择职务"));
          } else if (value === "99" && !this.model.titleNameEx) {
            return callback(new Error("请输入职务"));
          }
          callback();
        };
        const checkLevel = (rule, value, callback) => {
          if (!value) {
            return callback(new Error("请选择级别"));
          } else if (value === "99" && !this.model.levelNameEx) {
            return callback(new Error("请输入级别"));
          }
          callback();
        };
        // 带班领导或者值班人员 手机号码、职务、级别 必填
        if (val.includes("带班领导") || val.includes("值班人员")) {
          this.rules.userMobile.push({
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          });
          this.titleRequired = true;
          this.levelRequired = true;
          this.rules.titleUid = [{ validator: checkTitle, trigger: "blur" }];
          this.rules.levelUid = [{ validator: checkLevel, trigger: "blur" }];
        } else {
          if (this.rules.userMobile.length > 1) {
            this.rules.userMobile.pop();
          }
          this.titleRequired = false;
          this.levelRequired = false;
          this.rules.titleUid = [];
          this.rules.levelUid = [];
        }
        this.$nextTick(() => {
          this.$refs["userForm"].clearValidate();
        });
      },
      immediate: true,
    },
    "model.userName": {
      handler(val) {
        // 根据姓名生成用户名
        if (this.isEdit) return;
        this.model.loginName = spelling(val);
      },
    },
  },
  created() {
    this.init();
    this.$nextTick(() => {
      this.$refs["userForm"].clearValidate();
    });
  },
  methods: {
    // 初始化
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.proKey = userInfo.proKey;
      this.model.unitUid = userInfo.dutyUserInfo.unitUid;
      this.breadcrumbData.push({
        name: this.isEdit ? "编辑本级用户" : "新增本级用户",
      });
      if (!this.isEdit) {
        this.generateCardNO(this.model.unitUid);
      }
      this.getTitleList();
      this.getLevelList();
      this.getUserRoles();
    },
    // 点击返回
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
    // 跳转到本级用户路由
    goToList() {
      this.$router.push({
        path: "/main/sameLevelUser",
      });
    },
    // 点击保存按钮
    save() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.validateSuccess();
        }
      });
    },
    // 切换用户角色
    changeRoles(val) {
      if (!val.length) {
        this.$message({
          message: "至少选择一个用户角色!",
          type: "error",
        });
        this.model.roles = this.rolesHistory;
        // 没有选择单位管理员时，卡号为空
        // if (!val.includes("单位管理员")) {
        //   this.model.cardNo = "";
        // }
        return;
      }
      this.rolesHistory = val;
    },
    handleTitleBlur() {
      this.$refs["userForm"].validateField("titleUid");
    },
    handleLevelBlur() {
      this.$refs["userForm"].validateField("levelUid");
    },
    // 切换职务
    changeTitle(val) {
      if (!val) return;
      this.model.titleUid = val;
      this.model.titleName = this.titleOptions.filter(
        (item) => item.uid === val
      )[0].name;
    },
    // 初始化用户角色
    initRoles(data) {
      const roleList = (this.roleList = data.filter(
        (it) => it.roleName !== "超级管理员"
      ));
      this.roleNameList = roleList.reduce((pre, cur) => {
        return [...pre, cur.roleName];
      }, []);
      this.initSetSystemData();
      if (this.isEdit) {
        this.getUserDetails();
      }
    },
    // 从人员通讯录跳转过来携带的人员信息
    initSetSystemData() {
      const data = localStorage.getItem("setSystem");
      if (data) {
        _assign(this.model, JSON.parse(data));
        const { name, telephone } = JSON.parse(data);
        this.model.userName = name;
        this.model.userMobile = telephone;
      }
    },
    // 组装参数
    buildParams() {
      const params = _cloneDeep(this.model);
      params.unitUid = this.model.unitUid;
      // 角色列表
      params.roleInfoList = this.model.roles.reduce((pre, cur) => {
        const filtList = this.roleList.filter((item) => item.roleName === cur);
        return [...pre, ...filtList];
      }, []);
      // 没有选择单位管理员时，不传入卡号
      if (!this.model.roles.includes("单位管理员")) {
        params.cardNo = "";
      }
      // 职务
      if (params.titleUid === "99") {
        params.titleName = params.titleNameEx;
        params.titleUid = "";
      }
      // 是否添加新增的职务到常用列表
      params.titleShow = params.titleShow ? "1" : "0";
      // 级别
      if (params.levelUid === "99") {
        params.levelName = params.levelNameEx;
        params.levelUid = "";
      }
      // 是否添加新增的级别到常用列表
      params.levelShow = params.levelShow ? "1" : "0";
      params.unitType = !params.interUnitUid && !params.interOfficeUid ? 1 : "";
      params.unitType = params.interUnitUid ? 2 : "";
      params.unitType = params.interOfficeUid ? 3 : "";
      // 删除不需要的参数
      delete params.titleNameEx;
      delete params.levelNameEx;
      delete params.roles;
      return params;
    },
    // 校验通过后调接口
    async validateSuccess() {
      try {
        const params = this.buildParams();
        const { code } = await (this.isEdit
          ? editUser(params)
          : addUser(params));
        if (code === "00000000") {
          this.$message({
            type: "success",
            message: `${this.isEdit ? "修改" : "新建"}用户成功`,
          });
          // 回到列表页
          this.goToList();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取用户详情
    async getUserDetails() {
      this.loading = true;
      try {
        const params = { uid: this.uid };
        const { code, data } = await getUserDetails(params);
        if (code === "00000000") {
          _assign(this.model, data);
          this.initialData = data;
          // 初始化职务、级别
          if (
            !this.titleOptions.find((it) => it.uid === data.titleUid) &&
            data.titleName
          ) {
            this.model.titleNameEx = data.titleName;
            this.model.titleUid = "99";
          }
          if (
            !this.levelOptions.find((it) => it.uid === data.levelUid) &&
            data.levelName
          ) {
            this.model.levelNameEx = data.levelName;
            this.model.levelUid = "99";
          }
          // 初始化用户角色
          this.model.roles = data.rmsUserRoleInfos.reduce((pre, cur) => {
            return [...pre, cur.roleName];
          }, []);
          this.rolesHistory = this.model.roles;
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    // 获取职务列表
    async getTitleList() {
      try {
        const params = {
          unitUid: this.model.unitUid,
          "where.type": 1,
          "where.ifShow": 1,
          pageSize: 0, // 查询全部
        };
        const { code, data } = await getPostionList(params);
        if (code === "00000000") {
          this.titleOptions = [...data.list, { name: "其他", uid: "99" }];
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取级别列表
    async getLevelList() {
      try {
        const params = {
          "where.type": 2,
          "where.ifShow": 1,
          pageSize: 0, // 查询全部
        };
        const { code, data } = await getPostionList(params);
        if (code === "00000000") {
          this.levelOptions = [...data.list, { name: "其他", uid: "99" }];
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取用户角色列表
    async getUserRoles() {
      const params = {
        "where.roleName": this.searchKey,
        "where.proKey": this.proKey,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      try {
        const { code, data } = await getUserRoles(params);
        if (code === "00000000") {
          this.initRoles(data.list);
        }
      } catch {
        this.$message({
          message: "查询角色列表失败",
          type: "error",
        });
      }
    },
    // 根据机构id生成卡号
    async generateCardNO(unitId) {
      try {
        const params = { unitId };
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item {
      width: 100%;
      margin-bottom: 0px;
    }
    .el-button {
      margin-left: 10px;
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
  /deep/ .el-form-item__content {
    .el-select + .el-input {
      margin-left: 10px;
      width: 60%;
    }
    .title_td {
      .select_input {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
.footer_buttons {
  width: 100%;
  text-align: center;
  margin: 30px 0;
}
</style>
