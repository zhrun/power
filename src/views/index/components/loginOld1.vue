<template>
  <div class="login">
    <div class="login_container">
      <div class="left"></div>
      <div class="right">
        <div class="title"></div>
        <div class="tabs">
          <div class="tab" :class="{ 'actived': loginType === '2' }" @click="switchLoginType('2')">用户登录</div>
          <div class="tab" :class="{ 'actived': loginType === '1' }" @click="switchLoginType('1')">管理员登录</div>
        </div>
        <template v-if="loginType === '2'">
          <template v-if="composeType === '2'">
            <el-form ref="userLoginPsdForm" :model="userLoginPsdForm" :rules="userLoginPsdFormRules">
              <el-form-item prop="account">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="userLoginPsdForm.account" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="userLoginPsdForm.password" placeholder="密码" show-password></el-input>
              </el-form-item>
              <el-form-item prop="imgValidateCode">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="userLoginPsdForm.imgValidateCode" placeholder="请输入验证码"></el-input>
                <img :src="byteArrayImg" alt="" @click="reGetImg">
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="userLoginPsdForm.isRemember">记住用户名</el-checkbox>
                  <span @click="switchComposeType('1')">验证码登录</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <el-form ref="userLoginCodeForm" :model="userLoginCodeForm" :rules="userLoginCodeFormRules">
              <el-form-item prop="account">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="userLoginCodeForm.account" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item prop="validateCode">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="userLoginCodeForm.validateCode" placeholder="验证码">
                  <span slot="append" class="inline_button" @click="getValidateCode">获取验证码</span>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="userLoginCodeForm.isRemember">记住手机号</el-checkbox>
                  <span @click="switchComposeType('2')">密码登陆</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </template>
        <template v-else>
          <template v-if="composeType === '2'">
            <el-form ref="managerLoginPsdForm" :model="managerLoginPsdForm" :rules="managerLoginPsdFormRules">
              <el-form-item prop="account">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="managerLoginPsdForm.account" placeholder="用户名/卡号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="managerLoginPsdForm.password" placeholder="密码" show-password></el-input>
              </el-form-item>
              <el-form-item prop="imgValidateCode" class="validate_code">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="managerLoginPsdForm.imgValidateCode" placeholder="请输入验证码"></el-input>
                <img :src="byteArrayImg" alt="">
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="managerLoginPsdForm.isRemember">记住用户名</el-checkbox>
                  <span @click="switchComposeType('1')">验证码登录</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <el-form ref="managerLoginCodeForm" :model="managerLoginCodeForm" :rules="managerLoginCodeFormRules">
              <el-form-item prop="account">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="managerLoginCodeForm.account" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item prop="validateCode">
                <el-input @keyup.native.enter="loginSubmit" v-model.trim="managerLoginCodeForm.validateCode" placeholder="验证码">
                  <span slot="append" class="inline_button"  @click="getValidateCode">获取验证码</span>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="managerLoginCodeForm.isRemember">记住手机号</el-checkbox>
                  <span @click="switchComposeType('2')">密码登陆</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </template>
        <el-button class="login_button" @click="loginSubmit" :loading="loginBtnLoading">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePhone, validatePwd } from "@/utils/validator.js";
import {
  // login,
  loginNew,
  getAllDic,
  getLimitList,
  getPublicKey,
  imgValidateCode,
  getValidateCode,
} from "@/views/index/api/eas/api.eas.js";
import { proKey } from "@/config/config.js";
import _debounce from 'lodash/debounce'

export default {
  name: "Login",
  data() {
    return {
      loginType: "2", // 1-管理员 2-普通用户
      composeType: "2", // 1-短信验证码登录 2-账号密码登录
      byteArrayImg: "",
      loginForm: {
        account: "", // 用户名
        userMobile: "",
        userPassword: "",
        isRemember: false,
        imgValidateCode: "",
        imgUid: "",
        proKey: proKey,
      },
      loginBtnLoading: false,
      isRemember: false, // 是否记住用户名
      userLoginPsdFormRules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
        imgValidateCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
      userLoginCodeFormRules: {
        account: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        validateCode: [
          { required: true, message: "请输入手机验证码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
      },
      managerLoginPsdFormRules: {
        account: [
          { required: true, message: "请输入用户名或卡号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
        imgValidateCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
      managerLoginCodeFormRules: {
        account: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
        validateCode: [
          { required: true, message: "请输入手机验证码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
      },
      pwdShow: false,
      JSEncryptKey: "",
      userLoginPsdForm: {
        account: "", // 用户名
        password: "",
        imgValidateCode: "",
        imgUid: "",
      },
      userLoginCodeForm: {
        account: "",
        validateCode: "",
        isRemember: false,
      },
      managerLoginPsdForm: {
        account: "",
        password: "",
        imgValidateCode: "",
        imgUid: "",
      },
      managerLoginCodeForm: {
        account: "",
        validateCode: "",
        isRemember: false,
      },
    };
  },
  computed: {
    curFormName() {
      return `${this.loginType === "2" ? "user" : "manager"}LoginPsdForm`;
    },
  },
  mounted() {
    // 页面一进来就将字典信息全部存入本地
    if (localStorage.getItem("remberPhone")) {
      this.loginForm.userMobile = localStorage.getItem("remberPhone");
      this.loginForm.isRemember = true;
    } else {
      this.loginForm.isRemember = false;
    }

    if (localStorage.getItem("loginType")) {
      const { loginType, composeType } = JSON.parse(
        localStorage.getItem("loginType")
      );
      this.loginType = loginType;
      this.composeType = composeType;
    }

    this.byteImg();
    this.getPublicKey();
  },
  methods: {
    async getValidateCode() {
      const userMobile = this[this.curFormName].account;
      const params = {
        msgType: 6,
        proKey: proKey,
        userMobile,
      };
      try {
        const { code } = await getValidateCode(params);
        if (code === "00000000") {
          this.$message({
            message: "短信验证码已发送至您的手机",
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 切换登录用户类型
    switchLoginType(type) {
      if (this.loginType !== type) this.loginType = type;
      this.$nextTick(() => {
        this.byteImg();
        this.$refs[this.curFormName].clearValidate();
      });
    },
    // 切换登录类型
    switchComposeType(type) {
      if (this.composeType !== type) this.composeType = type;
      this.$nextTick(() => {
        this.$refs[this.curFormName].clearValidate();
      });
    },
    getPublicKey() {
      getPublicKey().then((res) => {
        if (res && res.code == "00000000") {
          this.JSEncryptKey = res.data;
        }
      });
    },
    reGetImg() {
      this.byteImg();
    },
    byteImg() {
      let params = {
        proKey: proKey,
      };
      imgValidateCode(params).then((res) => {
        this[this.curFormName].imgUid = res.data.imgUid;
        this.byteArrayImg = "data:image/png;base64," + res.data.byteArray;
      });
    },
    remember(flag) {
      if (flag) {
        localStorage.setItem("remberPhone", this.loginForm.userMobile);
      } else {
        localStorage.removeItem("remberPhone");
      }
    },
    loginSubmit: _debounce(function() {
      // 当前登录方式存入本地缓存
      const type = {
        composeType: this.composeType,
        loginType: this.loginType,
      };
      localStorage.setItem("loginType", JSON.stringify(type));
      // 密码登录刷新验证码图片
      if (this.composeType === "2") this.byteImg();
      this.$refs[this.curFormName].validate((valid) => {
        if (valid) {
          this.validateSuccess();
        }
      });
    }, 100),
    getLimitList(data) {
      let d = {
        userId: data.uid,
        proKey: proKey,
      };
      getLimitList(d)
        .then((res) => {
          if (res && res.data) {
            localStorage.setItem("permission", JSON.stringify(res.data));
            let _permissions = res.data;
            this.loginBtnLoading = false;
            if (!_permissions || _permissions.length < 1) {
              this.$message.error(
                "该账号未分配角色，无法进入系统，请联系管理员！"
              );
              return false;
            } else {
              this.$message.success("登录成功");
            }
            this.$nextTick(() => {
              getAllDic()
                .then((res) => {
                  if (res) {
                    localStorage.setItem("dic", JSON.stringify(res.data));
                    for (let i = 0; i < _permissions.length; i++) {
                      if (_permissions[i].resourceLayer == 3) {
                        this.$router.push({ name: _permissions[i].routeName });
                        break;
                      }
                    }
                  } else {
                    this.$message.error("获取字典失败");
                  }
                })
                .catch(() => {
                  this.$message.error("获取字典失败");
                });
            });
          }
        })
        .catch((err) => {
          console.log("接口报错：", err);
          this.loginBtnLoading = false;
        });
    },
    async validateSuccess() {
      try {
        // 登陆中 登录按钮不可用
        this.loginBtnLoading = true;
        let encrypt = new window.JSEncrypt();
        encrypt.setPublicKey(this.JSEncryptKey);
        const formName = this.curFormName;
        let params = {
          account: this[formName].account,
          composeType: this.composeType,
          imgValidateCode: this[formName].imgValidateCode || "",
          imgUid: this[formName].imgUid || "",
          loginType: this.loginType,
          password: encrypt.encrypt(this[formName].password || ""),
          validateCode: this[formName].validateCode || "",
        };
        const { code, data } = await loginNew(params);
        if (code === "00000000") {
          localStorage.setItem("vis_user_info", JSON.stringify(data));
          sessionStorage.setItem("duty_userId", data.uid);
          this.$router.push({
            path: "/main/ondutymain",
          });
        }
        this.loginBtnLoading = false;
      } catch (error) {
        this.loginBtnLoading = false;
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(49, 32, 202, 1) 0%,
    rgba(69, 52, 224, 1) 100%
  );
}
.login_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .left {
    width: 45%;
    height: 80%;
    background-image: url("../../../assets/img/login.png");
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .right {
    width: 500px;
    background: #ffffff;
    box-shadow: 0px 17px 33px 2px rgba(18, 9, 92, 0.28);
    border-radius: 15px;
    padding: 30px 50px;
    .title {
      width: 100%;
      height: 35px;
      background: url("../../../assets/img/title.png") no-repeat;
      background-size: contain;
      background-position: center;
      margin-bottom: 50px;
    }
    .tabs {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 20px;
      .tab {
        cursor: pointer;
        font-size: 16px;
        font-family: "PingFang SC";
        font-weight: 500;
        color: #9ca0c3;
        text-align: center;
        &.actived {
          color: #5458fe;
        }
      }
    }
  }
}
/deep/ .el-form {
  .el-input__inner {
    border-radius: 6px;
  }
  .el-form-item__content {
    display: flex;
    align-items: center;
    span {
      cursor: pointer;
    }
    .el-input__inner + .el-input-group__append {
      margin-left: 10px;
    }
  }
  .remember_box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  img {
    cursor: pointer;
    margin-left: 10px;
    height: 40px;
  }
}
.login_button {
  width: 100%;
  background-color: #f6f8fc;
  border: 1px solid #e5eaf4;
  border-radius: 6px;
  color: #9ca0c3;
  margin-top: 50px;
}
</style>
