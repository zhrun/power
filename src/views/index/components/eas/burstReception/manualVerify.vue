/* 新增或编辑人工录入 */
<template>
  <div class="report-page manual-verify">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <!-- 主体 -->
    <div class="content-wrap">
      <!-- 新增 -->
      <div class="layout_column">
        <el-scrollbar style="height: 100%;">
          <p class="title_wrap">
            <span class="tit">基本情况</span>
          </p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
            <el-form-item label="事件名称" prop="eventName">
              <el-input v-model="ruleForm.eventName" placeholder="请输入事件的名称" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="发生时间" prop="eventTime" class="w50p">
              <el-date-picker
                type="datetime"
                placeholder="请选择事件发生时间"
                v-model="ruleForm.eventTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="发生地点" prop="eventAddress">
              <el-input v-model="ruleForm.eventAddress" placeholder="请输入事件发生地点" :maxlength="100"></el-input>
            </el-form-item>
            <!-- 非必填选项 -->
            <el-form-item label="受影响情况">
              <el-form-item class="influence_item" label="受影响（人）" prop="affect" label-width="120px">
                <el-input v-model="ruleForm.affect" :maxlength="4"></el-input>
              </el-form-item>
              <el-form-item class="influence_item" label="受伤（人）" prop="hurt" label-width="120px">
                <el-input v-model="ruleForm.hurt" :maxlength="4"></el-input>
              </el-form-item>
              <el-form-item class="influence_item" label="死亡（人）" prop="dead" label-width="120px">
                <el-input v-model="ruleForm.dead" :maxlength="4"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="主要内容" prop="content">
              <el-input type="textarea" v-model="ruleForm.content" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="事发原因" prop="cause">
              <el-input v-model="ruleForm.cause" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="处理措施" prop="measure">
              <el-input v-model="ruleForm.measure" :maxlength="100"></el-input>
            </el-form-item>
            <!-- 不同渠道 -->
            <!-- 电话接报 -->
            <el-form-item
              v-if="channelType=='phone'"
              key="form_reporterName"
              label="来电人姓名"
              required
              class="w50p"
              prop="reporterName"
            >
              <el-input v-model="ruleForm.reporterName" placeholder="请输入来电人姓名" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item
              v-if="channelType=='phone'"
              key="form_reporterContact"
              label="联系方式"
              required
              class="w50p"
              prop="contact"
            >
              <el-input v-model="ruleForm.contact" placeholder="请输入来电人联系方式" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item
              v-if="channelType=='phone'"
              label="来电时间"
              key="form_reportTime"
              class="w50p"
              required
              prop="reportTime"
            >
              <el-date-picker
                type="datetime"
                placeholder="请选择来电时间"
                v-model="ruleForm.reportTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <!-- 上级督办 -->
            <el-form-item
              v-if="channelType=='super'"
              key="form_superName"
              label="督办单位"
              required
              class="w50p"
              prop="superName"
            >
              <el-select
                v-model="ruleForm.superName"
                filterable
                 @change="selectDepts(ruleForm.superName)"
                allow-create
                default-first-option
                placeholder="请录入/选择督办单位"
              >
                <el-option
                  v-for="item in depts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="channelType=='super'"
              key="form_superContact"
              label="联系方式"
              required
              class="w50p"
              prop="contact"
            >
              <el-input v-model="ruleForm.contact" placeholder="请输入督办单位的联系方式" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item
              v-if="channelType=='super'"
              key="form_superTime"
              label="督办下发时间"
              required
              class="w50p"
              prop="superTime"
              label-width="120px"
            >
              <el-date-picker
                type="datetime"
                placeholder="请选择来电时间"
                v-model="ruleForm.superTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="channelType=='super'"
              key="form_superRequire"
              label="督办要求"
              prop="superRequire"
            >
              <el-input type="textarea" v-model="ruleForm.superRequire" placeholder="请描述督办要求"></el-input>
            </el-form-item>
            <!-- 其他渠道 -->
            <el-form-item
              v-if="channelType=='other'"
              key="form_otherChannel"
              label="消息渠道"
              required
              class="w50p"
              prop="otherChannel"
            >
              <el-input v-model="ruleForm.otherChannel" placeholder="请输入消息渠道"></el-input>
            </el-form-item>
            <el-form-item
              v-if="channelType=='other'"
              key="form_otherContact"
              label="联系方式"
              required
              class="w50p"
              prop="contact"
            >
              <el-input v-model="ruleForm.contact" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <!-- 分割线 -->
            <div class="hr_line"></div>
            <!-- 核实情况 -->
            <p class="title_wrap">
              <span class="tit">核实情况</span>
            </p>
            <el-form-item label="核实附件" prop="enclos">
              <el-upload
                :action="uploadUrl"
                accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP, .mp4"
                :file-list="fileList"
                :limit="9"
                :on-success="uploadSuccess"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :class="{hide:hideUpload}"
                :on-exceed="handleExceed"
                multiple
                :beforeUpload="beforeAvatarUpload"
              >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">
                  <span class="el-icon-info"></span> 最多9个图片或视频
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="附件来源" prop="source">
              <el-input v-model="ruleForm.source" :maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="报送对象" prop="receiver" class="w50p">
              <el-select v-model="ruleForm.receiver" placeholder="请选择报送对象">
                <el-option
                  v-for="item in supers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
                <!-- <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>-->
              </el-select>
            </el-form-item>
            <el-form-item label="报送备注" prop="remark">
              <el-input type="textarea" v-model="ruleForm.remark" :maxlength="100"></el-input>
            </el-form-item>
            <!-- 提交|返回 -->
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="goBack">返回</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </div>
  
    <!-- 放大图片 -->
    <el-dialog :visible.sync="dialogVisible" v-if="dialogObj" class="previewDialog" :close-on-click-modal="false"  style="text-align: center;width:100vw;" @close="dialogObj=null">
      <video v-if="dialogObj.fileType=='mp4'" controls id="video_item" style="width:100%;height:600px">
        <source :src='dialogObj.fileFullPath' type="video/mp4">
      </video>
      <img v-else width="100%" :src="dialogObj.fileFullPath" />
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { proKey } from "@/config/config.js";
import "_assets/css/module_report.scss";
import {
  manualDetails,
  manualAdd,
  manualUpdate,
  fileUrl,
  getDutyPerson,
  getDepts
} from "@/views/index/api/eas/api.eas.js";
export default {
  name: "programVerify",
  components: { visBreadcrumb },
  data() {
    var contact = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系方式不能为空"));
      } else {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3568749]\d{9}))$/;
        console.log(reg.test(value));
        if (!value ||reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号或者座机号"));
        }
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
    var reportTimeCheck = (rule, value, callback) => {
      console.log(value);
      if (this.channelType == "phone") {
        if (!value) {
          return callback(new Error("来电时间不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    var reportNameCheck = (rule, value, callback) => {
      console.log(value);
      if (this.channelType == "phone") {
        if (!value) {
          return callback(new Error("来电人姓名不能为空"));
        } else {
          let reg = /^[\u4E00-\u9FA5]+$/;
          if (value && !reg.test(value)) {
            callback(new Error("请正确输入姓名"));
          } else {
            callback();
          }
        }
        callback();
      } else {
        callback();
      }
    };
    var superNameCheck = (rule, value, callback) => {
      if (this.channelType == "super") {
        if (!value) {
          return callback(new Error("督办单位不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    var superTimeCheck = (rule, value, callback) => {
      if (this.channelType == "super") {
        if (!value) {
          return callback(new Error("督办下发时间不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    var otherChannelCheck = (rule, value, callback) => {
      if (this.channelType == "other") {
        if (!value) {
          return callback(new Error("消息渠道不能为空"));
        }
        callback();
      } else {
        callback();
      }
    };
    return {
      channelType: "", // 录入渠道类型
      // 面包屑导航数据
      breadcrumbData: [
        { name: "突发接报" },
        { name: "人工录入", routerName: "manualUp" },
        { name: "录入" }
      ],
      hideUpload: false,
      // 详情数据
      detailsData: {},
      // 时间拾取器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        }
      },
      /* 核实表单相关 */
      supers: [], // 报送对象集合
      handles: [], // 值班员集合
      depts: [], //督办单位集合
      // 表单数据
      ruleForm: {
        /* 基本情况 */
        eventName: "", // 事件名称
        eventTime: "", // 发生时间
        eventAddress: "", // 发生地点
        affect: "", // 受影响
        hurt: "", // 受伤
        dead: "", // 死亡
        content: "", // 主要内容
        cause: "", // 事发原因
        measure: "", // 处理措施
        contact: "", // 来电人/督办单位/消息渠道的联系方式
        /* 电话接报 */
        reporterName: "", // 来电人姓名
        reportTime: "", // 来电时间
        /* 督办单位接报 */
        superName: "", // 督办单位
        superTime: "", // 督办下发时间
        superRequire: "", // 督办要求
        /* 其他渠道 */
        otherChannel: "", // 消息渠道
        /* 核实情况 */
        enclos: [], // 核实附件
        source: "", // 附件来源
        receiver: "", // 报送对象
        receiverName: "",
        receiverPhone: "",
        remark: "" // 报送备注
      },
      // 表单校验
      rules: {
        eventName: [
          { required: true, message: "请输入事件名称", trigger: "blur" }
        ],
        eventTime: [
          {
            required: true,
            message: "请选择事件发生时间",
            trigger: ["blur", "change"]
          }
        ],
        eventAddress: [
          { required: true, message: "请输入事件发生地点", trigger: "blur" }
        ],
        contact: [{ validator: contact, trigger: ["blur", "change"] }],
        reporterName: [
          {
            validator: reportNameCheck,
            trigger: ["blur", "change"]
          }
        ],
        reportTime: [
          { validator: reportTimeCheck, trigger: ["blur", "change"] }
        ],
        superName: [{ validator: superNameCheck, trigger: ["blur", "change"] }],
        superTime: [{ validator: superTimeCheck, trigger: ["blur", "change"] }],
        otherChannel: [{ validator: otherChannelCheck, trigger: "blur" }],
        receiver: [
          { required: true, message: "请选择报送对象", trigger: "change" }
        ],
        affect: [{ validator: checkNumber, trigger: "blur" }],
        hurt: [{ validator: checkNumber, trigger: "blur" }],
        dead: [{ validator: checkNumber, trigger: "blur" }]
      },

      /* 附件相关 */
      fileList: [], // 附件列表
      uploadUrl: fileUrl,
      dialogObj: null,
      dialogVisible: false
      
    };
  },
  mounted() {
    console.log(this.$route);
    this.channelType = this.$route.query.channelType;
    if (this.$route.query.channelType == "phone") {
      this.breadcrumbData = [
        { name: "突发接报" },
        { name: "人工录入", routerName: "manualUp" },
        { name: "电话接报" }
      ];
    } else if (this.$route.query.channelType == "super") {
      this.breadcrumbData = [
        { name: "突发接报" },
        { name: "人工录入", routerName: "manualUp" },
        { name: "上级督办" }
      ];
    } else if (this.$route.query.channelType == "other") {
      this.breadcrumbData = [
        { name: "突发接报" },
        { name: "人工录入", routerName: "manualUp" },
        { name: "其他渠道" }
      ];
    }
    //获取值班员和带班领导
    this.getDutyPerson();
    // 获取督办列表
    this.getDepts();

   
    // 如果是编辑
    if (this.$route.query.eventId) {
      this.getDetails(() => {
        this.ruleForm.eventName = this.detailsData["receiveInfo"]["eventName"];
        this.ruleForm.eventTime = this.detailsData["receiveInfo"]["eventTime"];
        this.ruleForm.eventAddress = this.detailsData["receiveInfo"][
          "eventAddress"
        ];
        this.ruleForm.affect = this.detailsData["receiveInfo"][
          "affectedNumber"
        ];
        this.ruleForm.hurt = this.detailsData["receiveInfo"]["injuredNumber"];
        this.ruleForm.dead = this.detailsData["receiveInfo"]["deadNumber"];
        this.ruleForm.content = this.detailsData["receiveInfo"]["eventContent"];
        this.ruleForm.cause = this.detailsData["receiveInfo"]["eventReason"];
        this.ruleForm.measure = this.detailsData["receiveInfo"][
          "handlingMethod"
        ];
        this.ruleForm.contact = this.detailsData["receiveInfo"]["contactPhone"];
        this.ruleForm.enclos = this.detailsData["checkAttachments"];
        this.ruleForm.source = this.detailsData["checkInfo"]["fileSourceDesc"];
        this.ruleForm.receiver = this.detailsData["approveInfo"]["submitToUid"];
        // this.ruleForm.receiver = this.detailsData["approveInfo"]["submitToUid"];

        this.ruleForm.remark = this.detailsData["approveInfo"]["submitRemark"];
        this.fileList = this.detailsData["checkAttachments"];
        for (let i = 0; i < this.fileList.length; i++) {
          let item = this.fileList[i];
          item.name = item.originalFileName;
          if(item.fileType == "mp4"){
            item.url = './static/img/videoPre.png';
            
          }else{
            item.url = item.fileFullPath;
          }
          
        }
        if (this.channelType == "phone") {
          this.ruleForm.reporterName = this.detailsData["receiveInfo"][
            "reporterName"
          ];
          this.ruleForm.reportTime = this.detailsData["receiveInfo"][
            "callTime"
          ];
        } else if (this.channelType == "super") {
          this.ruleForm.superName = this.detailsData["receiveInfo"][
            "supervisionUnit"
          ];
          this.ruleForm.superTime = this.detailsData["receiveInfo"][
            "supervisionTime"
          ];
          this.ruleForm.superRequire = this.detailsData["receiveInfo"][
            "supervisionRemark"
          ];
        } else if (this.channelType == "other") {
          this.ruleForm.otherChannel = this.detailsData["receiveInfo"][
            "eventChannel"
          ];
        }
      });
    }
  },
  methods: {
    // 获取督办列表
    getDepts() {
      getDepts().then(res => {
        if (res && res.data && res.data.length > 0) {
          res.data.map(item => {
            let unit = {};
            unit.value = item.supervisionUnit;
            if(item.contactPhone){
              unit.contactPhone = item.contactPhone;
            }
            
            unit.label = item.supervisionUnit;
            this.depts.push(unit);
          });
        }
      });
    },
   selectDepts(item){
     console.log("item",item)

     for (let i = 0; i < this.depts.length; i++) {

        if (this.depts[i].value == item) {
          this.ruleForm.contact = this.depts[i].contactPhone
          
        }else{
          // this.ruleForm.contact = ""
        }
        console.log(this.ruleForm.contact)
      }
     
    },
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
      // res.data.name = res.data.originalFileName;
      // res.data.url = res.data.fileFullPath;
      // this.ruleForm.enclos.push(res.data);
      console.log(fileList);
     

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
      if(res.data.fileType=='mp4') {
        file.url = './static/img/videoPre.png';
      }
      console.log('current file', file)
      console.log("current fileList", this.fileList);
      console.log("current form enclos", this.ruleForm.enclos);
    },
    // 限制上传个数
    handleExceed() {
      this.$message.warning(`当前限制选择 9 个文件`);
    },
    // 移除附件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
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
      console.log(file)
      if(file.response){
        
        this.dialogObj = file.response.data;
        console.log(this.dialogObj)
        
      }else{
        this.dialogObj = file;
        console.log(this.dialogObj)
      }
      
      this.dialogVisible = true;
    },
    // 附件限制
    beforeAvatarUpload(file) {
      console.log(file);
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
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          if (this.$route.query.eventId) {
            this.update();
          } else {
            this.add();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 返回
    goBack() {
      this.$router.push({
        name: "manualUp",
        query: { channelType: this.channelType }
      });
    },

    // 新增
    add() {
      if (this.supers) {
        for (var i = 0; i < this.supers.length; i++) {
          if (this.supers[i].value == this.ruleForm.receiver) {
            this.ruleForm.receiverName = this.supers[i].label;
            this.ruleForm.receiverPhone = this.supers[i].phone;
          }
        }
      }

      let params = {
        receiveInfo: {
          eventName: this.ruleForm.eventName,
          eventTime: this.ruleForm.eventTime,
          eventAddress: this.ruleForm.eventAddress,
          affectedNumber: this.ruleForm.affect,
          injuredNumber: this.ruleForm.hurt,
          deadNumber: this.ruleForm.dead,
          eventContent: this.ruleForm.content,
          eventReason: this.ruleForm.cause,
          handlingMethod: this.ruleForm.measure,
          contactPhone: this.ruleForm.contact
        },
        checkAttachments: this.ruleForm.enclos,
        checkInfo: {
          checkResultFlag: "1",
          fileSourceDesc: this.ruleForm.source,
          submitToUid: this.$store.state.userInfo.uid,
          submitToName: this.$store.state.userInfo.userName,
          submitToPhone: this.$store.state.userInfo.userMobile
        },
        approveInfo: {
          submitToUid: this.ruleForm.receiver,
          submitToName: this.ruleForm.receiverName,
          submitToPhone: this.ruleForm.receiverPhone,
          submitRemark: this.ruleForm.remark
        }
      };
      if (this.channelType == "phone") {
        params["receiveInfo"]["reporterName"] = this.ruleForm.reporterName;
        params["receiveInfo"]["callTime"] = this.ruleForm.reportTime;
        params["receiveInfo"]["receiveType"] = 3;
      } else if (this.channelType == "super") {
        params["receiveInfo"]["supervisionUnit"] = this.ruleForm.superName;
        params["receiveInfo"]["supervisionTime"] = this.ruleForm.superTime;
        params["receiveInfo"]["supervisionRemark"] = this.ruleForm.superRequire;
        params["receiveInfo"]["receiveType"] = 4;
      } else if (this.channelType == "other") {
        params["receiveInfo"]["eventChannel"] = this.ruleForm.otherChannel;
        params["receiveInfo"]["receiveType"] = 5;
      }
      console.log("add params", params);
      manualAdd(params)
        .then(res => {
          if (res) {
            console.log("add", res);
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.$router.push({
              name: "manualUp",
              query: { channelType: this.channelType }
            });
          }
        })
        .catch(() => {});
    },
    // 编辑
    update() {
      if (this.supers) {
        for (var i = 0; i < this.supers.length; i++) {
          if (this.supers[i].value == this.ruleForm.receiver) {
            this.ruleForm.receiverName = this.supers[i].label;
            this.ruleForm.receiverPhone = this.supers[i].phone;
          }
        }
      }
      let params = { ...this.detailsData };
      params["receiveInfo"]["eventName"] = this.ruleForm.eventName;
      params["receiveInfo"]["eventTime"] = this.ruleForm.eventTime;
      params["receiveInfo"]["eventAddress"] = this.ruleForm.eventAddress;
      params["receiveInfo"]["affectedNumber"] = this.ruleForm.affect;
      params["receiveInfo"]["injuredNumber"] = this.ruleForm.hurt;
      params["receiveInfo"]["deadNumber"] = this.ruleForm.dead;
      params["receiveInfo"]["eventContent"] = this.ruleForm.content;
      params["receiveInfo"]["eventReason"] = this.ruleForm.cause;
      params["receiveInfo"]["handlingMethod"] = this.ruleForm.measure;
      params["receiveInfo"]["contactPhone"] = this.ruleForm.contact;
      params["checkAttachments"] = this.ruleForm.enclos;
      params["checkInfo"]["fileSourceDesc"] = this.ruleForm.source;
      params["checkInfo"]["checkResultFlag"] = "1";

      params["approveInfo"]["submitToUid"] = this.ruleForm.receiver;
      params["approveInfo"]["submitToName"] = this.ruleForm.receiverName;
      params["approveInfo"]["submitToPhone"] = this.ruleForm.receiverPhone;

      params["approveInfo"]["submitRemark"] = this.ruleForm.remark;
      if (this.channelType == "phone") {
        params["receiveInfo"]["reporterName"] = this.ruleForm.reporterName;
        params["receiveInfo"]["callTime"] = this.ruleForm.reportTime;
        params["receiveInfo"]["receiveType"] = 3;
      } else if (this.channelType == "super") {
        params["receiveInfo"]["supervisionUnit"] = this.ruleForm.superName;
        params["receiveInfo"]["supervisionTime"] = this.ruleForm.superTime;
        params["receiveInfo"]["supervisionRemark"] = this.ruleForm.superRequire;
        params["receiveInfo"]["receiveType"] = 4;
      } else if (this.channelType == "other") {
        params["receiveInfo"]["eventChannel"] = this.ruleForm.otherChannel;
        params["receiveInfo"]["receiveType"] = 5;
      }
      console.log("update params", params);
      manualUpdate(params)
        .then(res => {
          if (res) {
            console.log("update", res);
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.$router.push({
              name: "manualUp",
              query: { channelType: this.channelType }
            });
          }
        })
        .catch(() => {});
    },
    // 获取详情数据
    getDetails(callback) {
      let params = {
        uid: this.$route.query.eventId
      };
      manualDetails(params)
        .then(res => {
          if (res && res.data) {
            console.log("manualDetails", res);
            this.detailsData = res.data;
            if (callback) {
              callback();
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
.previewDialog{
  .el-dialog{
    background: transparent;
    box-shadow:none;
  }
  .el-dialog__headerbtn .el-dialog__close{
    color: #ffffff;
    border: solid 1px #ffffff;
    border-radius: 50%;
  }
}
.manual-verify {
  .content-wrap {
    .layout_column {
      .el-scrollbar {
        .el-scrollbar__wrap {
          .el-scrollbar__view {
            padding-right: 30%;
          }
        }
      }
    }
  }
  .el-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>