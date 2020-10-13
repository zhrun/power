<template>
  <div class="vlb_header">
    <div class="left_header">
      <div class="riqi">
        <span class="riqi-month">{{month}}月</span>
        <span class="riqi-day">{{day}}</span>
      </div> 
      <div  style="height:46px; width:200px">
        <el-carousel height="46px" direction="vertical" :autoplay="true">
          <el-carousel-item v-for="item in daysList" :key="item.uid" class="minganri">
             <span class="minganri-title" :class="[{'yellow':item.type==1}]">{{item.name}}</span>
              <span class="minganri-time" :class="[{'yellow':item.type==1}]">{{item.startTime | fmTimestamp('MM-dd')}} 至 {{item.endTime | fmTimestamp('MM-dd')}} <i>{{dayType[item.type]}}</i></span>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- <div class="minganri" v-if="daysList.length>0">
        <el-carousel height="46px" direction="vertical" :autoplay="true">
          <el-carousel-item v-for="item in daysList" :key="item.uid">
              <span class="minganri-title" :class="[{'yellow':item.type==1}]">{{item.name}}</span>
              <span class="minganri-time" :class="[{'yellow':item.type==1}]">{{item.startTime | fmTimestamp('MM-dd')}} 至 {{item.endTime | fmTimestamp('MM-dd')}} <i>{{dayType[item.type]}}</i></span>
          </el-carousel-item>
        </el-carousel>
      </div> -->
      
    </div>
    <div class="right_header">
      <div class="supply-tip" @click="toSupplyMsg">
        <img :src="newTips">
        <span></span>
      </div>
      <div class="news-box" @click="toJumpObject" v-if="newList.length>0">
        <p class="news-info">
          <span>{{newList[0].title}}</span>
        </p>
        <div class="news-img">
          <img :src="newTips">
          <span></span>
        </div>
      </div>
      <img :src="userImg" class="user-img" />
      <el-popover v-model="showUserPopover" placement="bottom" width="100" trigger="click">
        <div class="mmb">
          <ul>
            <li v-if="isUnitAdmin" @click="modifyUnitInfo">修改单位信息</li>
            <li @click="dialogFormVisible=true">修改密码</li>
            <li @click="loginOut">退出登录</li>
          </ul>
        </div>
        <div slot="reference" style="cursor: pointer;">
          <span class="user-name">{{userInfo.userName}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </el-popover>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px" @close="closePwd" :close-on-click-modal="false" style="margin-top:17vh">
      <p class="top-pwd" v-show="vPwd">{{pwdTip}}</p>
      <el-form :model="form" ref="form" :rules="forgetFormRules">
        <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPass">
          <el-input type="password" v-model="form.oldPass"  minlength="6" maxlength="16" :key="'mdoldpass'" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPass" >
          <el-input v-model="form.newPass" type="password" minlength="6" maxlength="16" :key="'mdnewpass'" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="newPass2" >
          <el-input v-model="form.newPass2" :key="'mdnewpass2'" type="password" minlength="6" maxlength="16" placeholder="请确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePwd">取 消</el-button>
        <el-button type="primary" @click="getPublicKey" :loading="formLoading">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import {
  logout,
  updatePass,
  getPublicKey,
} from "@/views/index/api/eas/api.eas.js";
import { getSenDayList } from "@/views/index/api/onDuty/api.zr.js";
import { formatDate } from "@/utils/util.js";
import _get from 'lodash/get';

export default {
  props: ["newList"],
  data() {
    const _this = this;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length > 16 || value.length < 6) {
        callback(new Error("密码长度为6到16位"));
      } else if (
        !/[a-z]+/.test(value) ||
        !/[A-Z]+/.test(value) ||
        !/[0-9]+/.test(value)
      ) {
        callback(new Error("密码应包含大小写字母和数字"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!_this.form.newPass) return callback(new Error("请再次输入密码"));
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== _this.form.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      JSEncryptKey: "",
      gis_child: "gisgis_del",
      userInfo: JSON.parse(localStorage.getItem("vis_user_info")) || {
        userName: "张三（管理员）",
      },
      dialogFormVisible: false,
      form: {
        oldPass: "",
        newPass: "",
        newPass2: "",
      },
      forgetFormRules: {
        oldPass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPass: [{required: true, validator: validatePass, trigger: "blur" }],
        newPass2: [{ required: true,validator: validatePass2, trigger: "blur" }],
      },
      formLabelWidth: "120px",
      formLoading: false,
      userImg: "",
      logo: require("../assets/img/logo.png"),
      newTips: require("../assets/img/new-tips.png"),
      currentNum: 0,
      tipInter: null,
      month: "",
      day: "",
      daysList: [],
      dayType: {
        1: "节假日",
        2: "敏感日",
      },
      proKey: "",
      pwdTip:"您的密码安全级别过低，为了账户安全建议修改！",
      vPwd:false,
      showUserPopover: false,
    };
  },
  computed: {
    nowpath() {
      return this.$route.name;
    },
    // 是否是后台管理员
    isUnitAdmin() {
      const { roleList } = this.userInfo;
      const loginType = JSON.parse(localStorage.getItem("loginType") || "{}").loginType;
      return roleList && roleList.find(role => role.roleType === 'ADMIN') && loginType === "1";
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
      }
    },
  },
  mounted() {
    const { proKey, roleList, userImagePath } = JSON.parse(localStorage.getItem("vis_user_info") || "{}");
    this.proKey = proKey;
    this.userImg = userImagePath || require("../assets/img/user-img.png"); 
    const isCjadmin = roleList && roleList.find(role => role.roleType === 'CJADMIN');
    let da = new Date();
    this.month = da.getMonth() + 1;
    this.day = da.getDate();
    // 超级管理员登录总后台不请求敏感日数据
    if (isCjadmin) return false;
    let d = formatDate(new Date(), "yyyy-MM-dd");
    this.getSenDayList({
      "where.startTime": d + " 00:00:00",
      "where.endTime": d + " 23:59:59",
    });
    this.$nextTick(() => {
      if(parseInt(localStorage.getItem("admin_initialPasswordFlag"))==1 && !localStorage.getItem("admin_Pwd")){
        this.pwdTip="为保障您的账户安全，请修改您的初始密码！"
        this.dialogFormVisible=true
        this.vPwd=true
        localStorage.setItem("admin_Pwd", 1);
        setTimeout(()=>{
          this.$refs.form.clearValidate();
        },300)
      }else if(parseInt(localStorage.getItem("admin_initialPasswordFlag"))==2 && !localStorage.getItem("admin_Pwd")){
        this.pwdTip="您的密码安全级别过低，为了账户安全建议修改！"
        this.dialogFormVisible=true
        this.vPwd=true
        localStorage.setItem("admin_Pwd", 1);
        setTimeout(()=>{
          this.$refs.form.clearValidate();
        },300)
        
      }
    });
    // this.getPublicKey();
  },
  methods: {
    closePwd(){
      this.$refs.form.clearValidate();
      this.dialogFormVisible = false
      this.vPwd=false
    },
    getSenDayList(d) {
      getSenDayList(d)
        .then((res) => {
          if (res && res.code == "00000000") {
            this.daysList = res.data.list;
          }
        })
        .catch((er) => {
          console.error(er);
        });
    },
    getPublicKey() {
      getPublicKey().then((res) => {
        if (res && res.code == "00000000") {
          this.JSEncryptKey = res.data;
          this.upDate();
        }
      });
    },
    upDate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let encrypt = new window.JSEncrypt();
          encrypt.setPublicKey(this.JSEncryptKey);
          console.log(this.JSEncryptKey);
          let ad = {
            newPwd: encrypt.encrypt(this.form.newPass),
            oldPwd: encrypt.encrypt(this.form.oldPass),
            proKey: this.proKey,
            uid: this.userInfo.uid,
          };
          this.formLoading = true;
          updatePass(ad)
            .then((res) => {
              this.formLoading = false;
              if (res && res.code == "00000000") {
                this.$message({
                  type: "success",
                  message: "修改成功，请重新登录",
                });
                localStorage.clear();
                sessionStorage.clear();
                this.$router.push({ name: "login" });
              }
            })
            .catch(() => {
              this.formLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    modifyUnitInfo() {
      this.showUserPopover = false;
      this.$router.push({
        name: "modifyUnitInfo",
        query: {
          unitUid: _get(this.userInfo, "dutyUserInfo.unitUid", ""),
        }
      });
    },
    loginOut() {
      this.$confirm("退出登录？")
        .then(() => {
          logout({
            userMobile: this.userInfo.userMobile,
          }).then((res) => {
            if (res && res.code == "00000000") {
              localStorage.removeItem("vis_user_info");
              localStorage.removeItem("permission");
              sessionStorage.clear();
              this.$router.push({ name: "login" });
            }
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    toJumpObject() {
      if (
        this.newList[0].newType == "值班信息" &&
        window.location.href.indexOf("receiveDutyInformation") == -1
      ) {
        this.$router.push({ name: "receiveDutyInformation" });
      } else if (
        this.newList[0].newType == "通知公告" &&
        window.location.href.indexOf("receiveNotice") == -1
      ) {
        this.$router.push({ name: "receiveNotice" });
      } else if (
        this.newList[0].newType == "要情快报批示" &&
        window.location.href.indexOf("acceptLeaderInstructions") == -1
      ) {
        this.$router.push({ name: "acceptLeaderInstructions" });
      } else if (
        this.newList[0].newType == "值班信息批示" &&
        window.location.href.indexOf("acceptLeaderInstructions") == -1
      ) {
        this.$router.push({ name: "acceptLeaderInstructions" });
      } else if (
        this.newList[0].newType == "抄送信息" &&
        window.location.href.indexOf("acceptCCInfo") == -1
      ) {
        this.$router.push({ name: "acceptCCInfo" });
      }
    },
    toSupplyMsg(){
      this.$router.push({ name: "messageList" });
    }
  },
};
</script>
<style lang="scss" scoped>
.vlb_header {
  width: 100%;
  height: 68px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 9px 25px 1px rgba(106, 106, 106, 0.09);
  border-radius: 15px;
  .left_header {
    display: flex;
    flex-direction: row;
    align-items: center;
    .riqi {
      width: 46px;
      height: 46px;
      background-image: url("../assets/img/date-back.png");
      background-repeat: no-repeat;
      background-position: left top;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      .riqi-month {
        font-size: 12px;
        font-family: Microsoft YaHei;
        color: rgba(150, 147, 181, 1);
        margin-top: 6px;
      }
      .riqi-day {
        font-size: 16px;
        font-weight: bold;
        color: rgba(250, 69, 58, 1);
      }
    }
    .minganri {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 0 5px;
      .minganri-title {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(250, 69, 58, 1);
        &.yellow {
          color: #feae4d;
        }
      }
      .minganri-time {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(250, 69, 58, 1);
        &.yellow {
          color: #feae4d;
          i {
            font-style: normal;
            display: inline-block;
            padding: 0px 3px;
            border-radius: 3px;
            border: solid 1px #feae4d;
          }
        }
        i {
          font-style: normal;
          display: inline-block;
          padding: 0px 3px;
          border-radius: 3px;
          border: solid 1px rgba(250, 69, 58, 1);
        }
      }
    }
  }
  .right_header {
    display: flex;
    flex-direction: row;
    align-items: center;
    .user-img {
      width: 35px;
      height: 35px;
      margin-right: 10px;
    }
    .user-name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #656565;
      margin-right: 10px;
    }
    .news-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 20px;
      border-right: 1px solid #e5e9f3;
      padding-right: 20px;
      cursor: pointer;
      .news-info {
        width: 260px;
        span {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #656565;
          text-align: right;
        }
      }
      .news-img {
        width: 18px;
        height: 20px;
        position: relative;
        margin-left: 10px;
        animation: tipbell 1s infinite alternate;
        -webkit-animation: tipbell 1s infinite alternate; /* Safari and Chrome */
        @keyframes tipbell {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @-webkit-keyframes tipbell {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
        span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #f9453a;
          position: absolute;
          border: 1px solid #ffffff;
          top: 2px;
          left: 12px;
        }
      }
    }
  }
}

.mmb {
  li {
    line-height: 30px;
    cursor: pointer;
  }
  li:hover {
    color: #178cfd;
  }
}
.top-pwd{
  font-size: 14px;
  color: #e6a23c;
  margin-bottom: 20px;
}
.supply-tip{
  width: 18px;
  height: 20px;
  position: relative;
  margin-left: 10px;
  cursor: pointer;
  animation: tipbell 1s infinite alternate;
  -webkit-animation: tipbell 1s infinite alternate; /* Safari and Chrome */
  @keyframes tipbell {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes tipbell {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #f9453a;
    position: absolute;
    border: 1px solid #ffffff;
    top: 2px;
    left: 12px;
  }
}
</style>
<style lang="scss">
.right_header {
  .el-popover__reference {
    color: #9b9fc3;
  }
}
</style>
