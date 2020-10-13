/* 核实小程序接报 */
<template>
  <div class="report-page program-verify">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 主体 -->
    <div class="content-wrap" style="margin-top:10px;margin-left:10px;">
      <!-- 上报信息 -->
      <div v-if="uid" class="layout_column report_column" is="programReoprt" :uid="uid"></div>
      <!-- 核实模块 -->
      <div class="layout_column two_right">
        <el-scrollbar style="height: 100%;">
          <p class="title_wrap">
            <span class="tit">核实情况</span>
            <span class="overtime" v-if="isOvertime==1">超时</span>
          </p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <!-- 核实方式 -->
            <el-form-item label="核实方式" prop="way">
              <el-radio-group v-model="ruleForm.way" @change="changeWay">
                <el-radio label="1">电话核实</el-radio>
                <el-radio label="3">网格员核实</el-radio>
                <el-radio label="4">其他渠道核实</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 电话核实 -->
            <el-form-item label="核实对象" prop="target" v-if="ruleForm.way == 1">
              <el-radio-group v-model="ruleForm.target">
                <el-radio label="1">上报人</el-radio>
                <el-radio label="2">上报人的紧急联系人</el-radio>
                <el-radio label="3">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              key="form_other"
              prop="other"
              v-if="ruleForm.way == 1 && ruleForm.target == 3"
            >
              <el-input v-model="ruleForm.other" placeholder="请记录核实对象的名称和联系方式，以便追溯" clearable></el-input>
            </el-form-item>
            <!-- 网格员核实 -->
            <el-form-item
              key="form_name"
              label="网格员姓名"
              required
              class="w50p"
              prop="name"
              v-if="ruleForm.way == 3"
            >
              <el-input v-model="ruleForm.name" placeholder="请输入姓名" :maxlength="10" clearable></el-input>
            </el-form-item>
            <el-form-item
              key="form_contact"
              label="联系方式"
              required
              class="w50p"
              prop="contact"
              v-if="ruleForm.way == 3"
            >
              <el-input v-model="ruleForm.contact" placeholder="请输入联系方式" clearable></el-input>
            </el-form-item>
            <!-- 其他渠道核实 -->
            <el-form-item
              key="form_channel"
              label="核实渠道"
              required
              prop="channel"
              v-if="ruleForm.way == 4"
            >
              <el-input
                v-model="ruleForm.channel"
                placeholder="请输入渠道信息及联系方式"
                clearable
                :maxlength="100"
              ></el-input>
            </el-form-item>
            <!-- 非必填选项 -->
            <el-form-item label="发生时间">
              <el-date-picker
                type="datetime"
                placeholder="请选择事件发生时间"
                v-model="ruleForm.time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="主要内容" prop="content">
              <el-input
                v-model="ruleForm.content"
                :maxlength="100"
                placeholder="请输入事件主要内容"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="事发原因" prop="cause">
              <el-input v-model="ruleForm.cause" :maxlength="100" placeholder="请输入事发原因" clearable></el-input>
            </el-form-item>
            <el-form-item label="处理措施" prop="measure">
              <el-input
                v-model="ruleForm.measure"
                :maxlength="100"
                placeholder="请输入当前处理措施"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="受影响情况">
              <el-form-item class="influence_item" label="受影响（人）" prop="affect" label-width="100px">
                <el-input v-model="ruleForm.affect" :maxlength="4" clearable></el-input>
              </el-form-item>
              <el-form-item class="influence_item" label="受伤（人）" prop="hurt" label-width="100px">
                <el-input v-model="ruleForm.hurt" :maxlength="4" clearable></el-input>
              </el-form-item>
              <el-form-item class="influence_item" label="死亡（人）" prop="dead" label-width="100px">
                <el-input v-model="ruleForm.dead" :maxlength="4" clearable></el-input>
              </el-form-item>
            </el-form-item>
            <!-- 分割线 -->
            <div class="hr_line"></div>
            <!-- 核实结论 -->
            <el-form-item label="核实结论" prop="result">
              <el-radio-group v-model="ruleForm.result" @change="changeResult">
                <el-radio label="1">符合报送标准</el-radio>
                <el-radio label="0">不符合报送标准</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 符合报送标准 -->
            <el-form-item label="核实附件" prop="enclos" v-if="ruleForm.result==1">
              <el-upload
              multiple
                :action="uploadUrl"
                accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP, .mp4"
                :file-list="fileList"
                :limit="9"
                :on-success="uploadSuccess"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :beforeUpload="beforeAvatarUpload"
              >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">
                  <span class="el-icon-info"></span> 最多9个图片
                </div>
              </el-upload>
            </el-form-item>

            <el-form-item label="附件来源" prop="source" v-if="ruleForm.result==1">
              <el-input v-model="ruleForm.source" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item
              key="form_receiver"
              label="报送对象"
              required
              prop="receiver"
              v-if="ruleForm.result==1"
            >
              <el-select v-model="ruleForm.receiver" placeholder="请选择报送对象">
                <el-option
                  v-for="item in supers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报送备注" prop="remark" v-if="ruleForm.result==1">
              <el-input type="textarea" v-model="ruleForm.remark" :maxlength="100"></el-input>
            </el-form-item>
            <!-- 不符合报送标准 -->
            <el-form-item
              key="form_reason"
              label="缘由说明"
              required
              prop="reason"
              v-if="ruleForm.result==0"
            >
              <el-input v-model="ruleForm.reason" :maxlength="100"></el-input>
            </el-form-item>
            <!-- 提交|返回 -->
            <el-form-item class="rule-form">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="goBack()">返回</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
    <!-- 放大图片 -->
    <el-dialog :visible.sync="dialogVisible" v-if="dialogObj" class="previewDialog" :close-on-click-modal="false"  style="text-align: center;margin-top:0;" @close="dialogObj=null">
      <video v-if="dialogObj.fileType=='mp4'" controls id="video_item" style="width:100%;height:600px">
        <source :src='dialogObj.fileFullPath' type="video/mp4">
      </video>
      <img v-else width="100%" :src="dialogObj.fileFullPath" />
    </el-dialog>
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      class="previewDialog"
      :before-close="beforClosePreview"
    >
      <video
        v-if="dialogObj.fileType=='mp4'"
        controls
        id="video_item"
        style="width:100%;height:600px"
      >
        <source :src="dialogObj.fileFullPath" type="video/mp4" />
      </video>
      <img v-else width="100%" :src="dialogObj.fileFullPath" />
    </el-dialog> -->
  </div>
</template>

<script>
import { proKey } from "@/config/config.js";
import visBreadcrumb from "_com/breadcrumb.vue";
import programReoprt from "_com/common/programReport.vue";
import { getCheckinfo, setCheckInfo, fileUrl, getDutyPerson } from "@/views/index/api/eas/api.eas.js";
import "_assets/css/module_report.scss";
export default {
  name: "programVerify",
  components: { visBreadcrumb, programReoprt },
  data() {
    var checkOther = (rule, value, callback) => {
      if (this.ruleForm.way == 1 && this.ruleForm.target == 3) {
        if (!value) {
          return callback(new Error("核实对象不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    var checkNumber = (rule, value, callback) => {
      const reg = /^[0-9]\d*$/;
      console.log(reg.test(value));
      if (!value || reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确人数"));
      }
    };
    var checkName = (rule, value, callback) => {
      if (this.ruleForm.way == 3) {
        if (!value) {
          return callback(new Error("姓名不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    var checkContact = (rule, value, callback) => {
      if (this.ruleForm.way == 3) {
        if (!value) {
          return callback(new Error("联系方式不能为空"));
        } else {
          const reg = /^((0\d{2,3}-\d{7,8})|(1[3568749]\d{9}))$/;
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error("请输入正确的手机号或者座机号"));
          }
        }
        callback();
      } else {
        callback();
      }
    };
    var checkChannel = (rule, value, callback) => {
      if (this.ruleForm.way == 4) {
        if (!value) {
          return callback(new Error("核实渠道不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    // var checkRceiver = (rule, value, callback) => {
    //   if (this.ruleForm.result == 1) {
    //     if (!value) {
    //       return callback(new Error("报送对象不能为空"));
    //     }
    //     callback();
    //   } else {
    //     callback();
    //   }
    // };
    var checkReason = (rule, value, callback) => {
      if (this.ruleForm.result == 0) {
        if (!value) {
          return callback(new Error("缘由说明不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    return {
      // 突发事件信息
      uid: "",
      // 面包屑导航数据
      breadcrumbData: [
        { name: "突发接报" },
        { name: "小程序接报", routerName: "programUp" },
        { name: "核实情况" }
      ],
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        }
      },
      /* 核实表单相关 */
      supers: [], // 报送对象集合
      handles: [], // 督办单位集合
      checkList: {},
      // 表单数据
      ruleForm: {
        way: "1", // 核实方式
        target: "1", // 核实对象
        other: "", // 核实对象-其他
        name: "", // 网格员姓名
        contact: "", // 联系方式
        channel: "", // 核实渠道
        time: "", // 发生时间
        content: "", // 主要内容
        cause: "", // 事发原因
        measure: "", // 处理措施
        affect: "", // 受影响
        hurt: "", // 受伤
        dead: "", // 死亡
        result: "1", // 核实结论
        enclos: [], // 核实附件
        source: "", // 附件来源
        receiver: "", // 报送对象
        receiverName: "",
        receiverPhone: "",
        remark: "", // 报送备注
        reason: "", // 缘由说明
        eventReportUid: "", //上报uid
        eventReceiveUid: "" //接报uid
      },

      // 表单校验
      rules: {
        way: [{ required: true, message: "请选择核实方式", trigger: "change" }],
        target: [
          { required: true, message: "请选择核实对象", trigger: "change" }
        ],
        other: [{ validator: checkOther, trigger: ["blur", "change"] }],
        name: [{ validator: checkName, trigger: ["blur", "change"] }],
        contact: [{ validator: checkContact, trigger: ["blur", "change"] }],
        channel: [{ validator: checkChannel, trigger: ["blur", "change"] }],
        result: [
          { required: true, message: "请选择核实结论", trigger: "change" }
        ],
        receiver: [
          { required: true, message: "请选择报送对象", trigger: "change" }
        ],

        reason: [{ validator: checkReason, trigger: ["blur"] }],
        affect: [{ validator: checkNumber, trigger: ["blur"] }],
        hurt: [{ validator: checkNumber, trigger: ["blur"] }],
        dead: [{ validator: checkNumber, trigger: ["blur"] }]
      },
      /* 附件相关 */
      fileList: [], // 附件列表
      uploadUrl: fileUrl,
      dialogObj: {},
      dialogVisible: false,
      isOvertime: 0
    };
  },
  mounted() {
    // 获取uid和核实信息详情
    this.uid = this.$route.query.uid;
    this.getCheckinfo(this.$route.query.uid);
    // console.log(this.ruleForm.way);
    // this.ruleForm.way=1;
    this.getDutyPerson();
  },
  methods: {
    // 获取值班员和领导列表
    getDutyPerson() {
      let params1 = {
        proKey: proKey,
        roleId: "32hxupGKa9Wci4Q0wnZ4jl"
      };
      let params2 = {
        proKey: proKey,
        roleId: "4ETnBg2GC3TLcllgLoLxIF"
      };
      getDutyPerson(params1).then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.map(item => {
            let unit = {};
            unit.value = item.uid;
            if (item.userMobile) {
              unit.label = item.userName + "(" + item.userMobile + ")";
            } else {
              unit.label = item.userName;
            }
            this.handles.push(unit);
          });
        }
      });
      getDutyPerson(params2).then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.map(item => {
            let unit = {};
            unit.value = item.uid;
            if (item.userMobile) {
              unit.label = item.userName + "(" + item.userMobile + ")";
            } else {
              unit.label = item.userName;
            }
            unit.phone = item.userMobile;
            this.supers.push(unit);
          });
        }
      });
    },
    // 上传附件
    uploadSuccess(res, file, fileList) {
      let edata = [];
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response) {
          edata.push(fileList[i].response.data);
        } else {
          edata.push(fileList[i]);
        }
      }
      this.ruleForm.enclos = edata;
      this.fileList = fileList;
      if (res.data.fileType == "mp4") {
        file.url = "./static/img/videoPre.png";
      }
      console.log("current file", file);
      console.log("current fileList", this.fileList);
      console.log("current form enclos", this.ruleForm.enclos);
    },
    // 限制上传个数
    handleExceed() {
      this.$message.warning(`当前限制选择 9 个文件`);
    },
    // 附件限制
    beforeAvatarUpload(file) {
      console.log("beforeAvatarUpload", file);
      if (file.type.substr(0, 5) == "image") {
        if (file.size / 1024 / 1024 > 20) {
          this.$message({
            message: "上传图片大小不能超过 20MB!",
            type: "warning"
          });
          return false;
        }
      } else if (file.type.substr(0, 5) == "video") {
        if (file.size / 1024 / 1024 > 50) {
          this.$message({
            message: "上传视频大小不能超过 50MB!",
            type: "warning"
          });
          return false;
        }
      } else {
        this.$message({
          message: "只能上传视频和图片",
          type: "warning"
        });
        return false;
      }
    },
    // 移除附件
    handleRemove(file, fileList) {
      let edata = [];
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response) {
          edata.push(fileList[i].response.data);
        } else {
          edata.push(fileList[i]);
        }
      }
      this.ruleForm.enclos = edata;
      console.log("current fileList", this.fileList);
      console.log("current form enclos", this.ruleForm.enclos);
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogObj = file.response.data;
      this.dialogVisible = true;
    },
    // 关闭预览之前
    beforClosePreview(done) {
      let videoEle = document.getElementById("video_item");
      videoEle.pause();
      done();
    },
    // 获取核实信息详情
    getCheckinfo(uid) {
      console.log(uid);
      let d = {
        uid: uid,
        type: 1
      };
      console.log(d);
      getCheckinfo(d).then(res => {
        if (res && res.data) {
          console.log("res", res);
          this.checkList = res.data;
          if (res.data.checkInfo.checkType) {
            this.ruleForm.way = String(res.data.checkInfo.checkType);
          }

          if (res.data.checkInfo.checkResultFlag) {
            this.ruleForm.result = String(res.data.checkInfo.checkResultFlag);
          }
          this.ruleForm.channel = res.data.checkInfo.checkChannel;
          if (res.data.checkInfo.checkToType) {
            this.ruleForm.target = String(res.data.checkInfo.checkToType);
          }
          if (res.data.reportInfo.reportTime) {
            this.ruleForm.time = res.data.reportInfo.reportTime;
          }
          this.ruleForm.other = res.data.checkInfo.checkToRemark;
          this.ruleForm.name = res.data.checkInfo.gridMamangerName;
          this.ruleForm.contact = res.data.checkInfo.gridMamangerPhone;
          this.ruleForm.source = res.data.checkInfo.fileSourceDesc;
          // this.ruleForm.receiver = res.data.checkInfo.submitToUid;
          // this.ruleForm.receiverName = res.data.checkInfo.submitToName;
          // this.ruleForm.receiverPhone = res.data.checkInfo.receiverPhone;
          this.ruleForm.remark = res.data.checkInfo.submitRemark;
          if (res.data.receiveInfo) {
            
            this.ruleForm.content = res.data.receiveInfo.eventContent;
            this.ruleForm.cause = res.data.receiveInfo.eventReason;
            this.ruleForm.measure = res.data.receiveInfo.handlingMethod;
            this.ruleForm.hurt = res.data.receiveInfo.injuredNumber;
            this.ruleForm.dead = res.data.receiveInfo.deadNumber;
            this.ruleForm.affect = res.data.receiveInfo.affectedNumber;
          }

          this.ruleForm.eventReceiveUid = res.data.checkInfo.eventReceiveUid;
          this.ruleForm.eventReportUid = res.data.checkInfo.eventReportUid;
          this.isOvertime = res.data.checkInfo.isOvertime;
          // this.$set(this.ruleForm,'result',String(res.data.checkInfo.checkResultFlag))

          console.log(this.ruleForm);
        }
      });
    },
    setCheckInfo() {
      if (this.supers) {
        for (var i = 0; i < this.supers.length; i++) {
          if (this.supers[i].value == this.ruleForm.receiver) {
            this.ruleForm.receiverName = this.supers[i].label;
            this.ruleForm.receiverPhone = this.supers[i].phone;
          }
        }
      }
      var checkList = this.checkList;
      if (this.checkList.checkInfo == null) {
        checkList.checkInfo = {};
      }
      if (this.checkList.receiveInfo == null) {
        checkList.receiveInfo = {};
      }
      if (this.checkList.approveInfo == null) {
        checkList.approveInfo = {};
      }
      // 附件
      checkList.checkAttachments = this.ruleForm.enclos;
      // 核实相关
      checkList.checkInfo.uid = this.$route.query.uid;
      checkList.checkInfo.checkType = this.ruleForm.way;
      checkList.checkInfo.checkChannel = this.ruleForm.channel;
      checkList.checkInfo.checkToType = this.ruleForm.target;
      checkList.checkInfo.checkToRemark = this.ruleForm.other;
      checkList.checkInfo.gridMamangerName = this.ruleForm.name;
      checkList.checkInfo.gridMamangerPhone = this.ruleForm.contact;
      checkList.checkInfo.fileSourceDesc = this.ruleForm.source;
      checkList.checkInfo.checkResultFlag = this.ruleForm.result;
      checkList.checkInfo.checkRemark = this.ruleForm.reason;
      checkList.checkInfo.eventReceiveUid = this.ruleForm.eventReceiveUid;
      checkList.checkInfo.eventReportUid = this.ruleForm.eventReportUid;
      // 事件相关
      checkList.receiveInfo.eventTime = this.ruleForm.time;
      checkList.receiveInfo.receiveType = "1";
      checkList.receiveInfo.eventContent = this.ruleForm.content;
      checkList.receiveInfo.eventReason = this.ruleForm.cause;
      checkList.receiveInfo.handlingMethod = this.ruleForm.measure;
      checkList.receiveInfo.affectedNumber = this.ruleForm.affect;
      checkList.receiveInfo.injuredNumber = this.ruleForm.hurt;
      checkList.receiveInfo.deadNumber = this.ruleForm.dead;
      // 报送相关
      checkList.approveInfo.submitToUid = this.ruleForm.receiver;
      checkList.approveInfo.submitToName = this.ruleForm.receiverName;
      checkList.approveInfo.submitToPhone = this.ruleForm.receiverPhone;
      checkList.approveInfo.submitRemark = this.ruleForm.remark;

      console.log(this.ruleForm.enclos);
      setCheckInfo(checkList).then(res => {
        if (res && res.data) {
          console.log("res", res);
          this.$message({
            message: "核实成功",
            type: "success"
          });
          this.$router.push({ name: "programUp" });
        } else {
          this.$message.error("核实失败");
        }
      });
    },
    // 返回
    goBack() {
      this.$router.push({ name: "programUp" });
      // this.$router.go(-1);
    },
    // 改变核实方式
    changeWay(val) {
      this.ruleForm.target = "";
      this.ruleForm.other = "";
      this.ruleForm.name = "";
      this.ruleForm.contact = "";
      this.ruleForm.channel = "";
      if (val == 1) {
        this.ruleForm.target = "1";
      }
    },
    // 改变核实结论
    changeResult() {
      this.ruleForm.enclos = [];
      this.ruleForm.source = "";
      this.ruleForm.receiver = "";
      this.ruleForm.remark = "";
      this.ruleForm.reason = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setCheckInfo(this.$route.query.uid);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss">
.program-verify {
  .previewDialog {
    .el-dialog__body {
      text-align: center;
    }
  }
}
.rule-form{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .el-form-item__content{
    margin-left: 0px !important;
  }
}
</style>