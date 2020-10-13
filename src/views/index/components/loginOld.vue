<template>
  <div class="vl_login">
    <div class="vl_content">
      <div class="lg_main">
        <div class="left">
          <img src="../../../assets/img/login_1.png" alt />
        </div>
        <div class="right_form">
          <div class="form_wrap">
            <p class="form_title">突发事件接报警系统</p>
            <el-form :inline="false" ref="loginForm" :model="loginForm" :rules="loginFormRules" class="lg_form">
              <el-form-item prop="userMobile" class="login_form_item">
                <el-input v-model="loginForm.userMobile" maxlength="11" placeholder="请输入手机号">
                  <p slot="prefix" class="phone_icon"></p>
                </el-input>
                <i class="vl_icon vl_icon_lg_01"></i>
              </el-form-item>
              <el-form-item prop="userPassword" class="login_form_item">
                <el-input v-model="loginForm.userPassword" :type="pwdShow ? 'text' : 'password'" placeholder="请输入密码" maxlength="16">
                  <p slot="prefix" class="password_icon"></p>
                </el-input>
                <i class="vl_icon vl_icon_lg_02"></i>
                <i class="vl_icon vl_icon_lg_03" @click="pwdShow = !pwdShow" :class="{'vl_icon_sed': !pwdShow}"></i>
              </el-form-item>
              <el-form-item prop="imgValidateCode">
                <el-row :gutter="20">
                  <el-col :span="14" class="validate-code">
                    <span class="code-img"></span>
                    <el-input v-model="loginForm.imgValidateCode" placeholder="验证码"></el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="byteArrayImg" @click="byteImg()" alt />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-checkbox @change="remember" v-model="loginForm.isRemember">记住手机号</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getPublicKey()" :loading="loginBtnLoading" class="log_commit">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { validatePhone, validatePwd } from "@/utils/validator.js";
import { login, getAllDic, getLimitLIst, getPublicKey, imgValidateCode } from "@/views/index/api/eas/api.eas.js";
import { proKey } from "@/config/config.js";
export default {
  data() {
    return {
      byteArrayImg: "",
      loginForm: {
        userMobile: "",
        userPassword: "",
        isRemember: false,
        imgValidateCode: "",
        proKey: proKey
      },
      loginBtnLoading: false,
      isRemember: false, // 是否记住用户名
      loginFormRules: {
        userMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" }
        ]
      },
      pwdShow: false,
      JSEncryptKey: "",
    }
  },
  mounted() {
    // 页面一进来就将字典信息全部存入本地
    if (localStorage.getItem("remberPhone")) {
      this.loginForm.userMobile = localStorage.getItem("remberPhone");
      this.loginForm.isRemember = true;
    } else {
      this.loginForm.isRemember = false;
    }
    
    this.byteImg();
  },
  methods: {
    getPublicKey() {
      getPublicKey().then(res => {
        if (res && res.code == "00000000") {
          this.JSEncryptKey = res.data;
          this.loginSubmit()
        }
      });
    },
    byteImg() {
      let params = {
        proKey: proKey
      };
      imgValidateCode(params).then(res => {
        this.loginForm.imgUid = res.data.imgUid;
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
    loginSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登陆中 登录按钮不可用
          this.loginBtnLoading = true;
          let encrypt = new window.JSEncrypt();
          encrypt.setPublicKey(this.JSEncryptKey);
          let aForm = {
            userMobile: this.loginForm.userMobile,
            userPassword: encrypt.encrypt(this.loginForm.userPassword),
            imgValidateCode: this.loginForm.imgValidateCode,
            imgUid: this.loginForm.imgUid,
            isRemember: this.loginForm.isRemember,
            proKey: proKey
          };
          login(aForm).then(res => {
            if (res) {
              localStorage.setItem("vis_user_info", JSON.stringify(res.data));
              sessionStorage.setItem("vis_userId", res.data.uid);
              this.getLimitLIst(res.data);
            } else {
              this.loginBtnLoading = false;
            }
          }).catch(err => {
            console.log(err);
            this.loginBtnLoading = false;
          });
        }
      });
    },
    getLimitLIst(data) {
      let d = {
        userId: data.uid,
        proKey: proKey
      }
      getLimitLIst(d).then(res => {
        if (res && res.data) {
          localStorage.setItem("permission", JSON.stringify(res.data));
          let _permissions = res.data;
          this.loginBtnLoading = false;
          if (!_permissions || _permissions.length < 1) {
            this.$message.error("该账号未分配角色，无法进入系统，请联系管理员！");
            return false;
          } else {
            this.$message.success("登录成功");
          }
          this.$nextTick(() => {
            getAllDic().then(res => {
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
            }).catch(() => {
              this.$message.error("获取字典失败");
            });
          });
        }
      }).catch(err => {
        console.log("接口报错：", err);
        this.loginBtnLoading = false;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.vl_login {
  height: 100vh;
  position: relative;
  .vl_content {
    width: 100vw;
    position: relative;
    height: 100%;
    min-height: 520px;
    padding-top: 110px;
    background: url("../../../assets/img/bg.png") center no-repeat;
    background-size: cover;
  }
  .lg_main {
    margin: 0 auto;
    height: 100%;
    width: 1200px;
    animation: fadeIn 0.5s ease-out 0.2s both;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    > div {
      float: left;
    }
    .left {
      height: 600px;
      width: 710px;
      position: relative;
      margin-top: -10%;
      > img {
        display: block;
        margin: 0 auto;
        margin-top: 100px;
        width: 100%;
        height: auto;
      }
    }
    .right_form {
      width: 480px;
      height: auto;
      position: relative;
      margin-top: -10%;
      .form_wrap {
        margin: 0 auto;
        margin-top: 0px;
        width: 270px;
        .form_title {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          padding-bottom: 40px;
          text-align: center;
        }
        .password_icon {
          width: 16px;
          height: 20px;
          background: url("../../../assets/img/pass.png") center no-repeat;
          background-size: contain;
        }
        .phone_icon {
          width: 16px;
          height: 20px;
          background: url("../../../assets/img/user.png") center no-repeat;
          background-size: contain;
        }
        .log_commit {
          width: 270px;
          height: 46px;
          border-radius: 23px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.vl_login {
  .el-form-item.is-error .el-input__inner {
    background: transparent;
  }
  .el-input__inner {
    background: transparent;
    color: #fff;
  }
  .el-button--primary {
    border-color: #ffffff;
    background: #ffffff;
    color: #178cfd;
  }
  .el-checkbox {
    color: #fff;
  }
  .el-input__inner {
    border-radius: 0px;
    border-left: none;
    border-right: none;
    border-top: none;
  }
  .el-input__prefix,
  .el-input__suffix {
    top: 10px;
  }

  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #ededed !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
  }
  input {
    background-color: transparent;
  }
}
</style>
