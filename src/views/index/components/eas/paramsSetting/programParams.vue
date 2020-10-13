/* 小程序参数设置 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form ref="form" :model="form" label-width="100px" class="programParams" :rules="rules">
          <div class="title">回执设置</div>
          <el-form-item label="回执内容">
            <div>
              {{form.nickname}}
            </div>
            <el-input v-model="form.content" maxlength="100" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="落款署名">
            <el-input v-model="form.name" maxlength="20"></el-input>
          </el-form-item>
          <div class="title">评价设置</div>
          <el-form-item label="满意度评价">
            <el-switch v-model="form.delivery" @change="changeSwitch1(form.delivery)"></el-switch>
          </el-form-item>
          <el-form-item label="评价指标" v-show="isDelivery">
            1.
            <el-input v-model="form.desc" style="width:120px;margin-right:20px;margin-left:10px" maxlength="6"></el-input>2.
            <el-input v-model="form.desc1" style="width:120px;margin-right:20px;margin-left:10px" maxlength="6"></el-input>3.
            <el-input v-model="form.desc2" style="width:120px;margin-right:20px;margin-left:10px" maxlength="6"></el-input>4.
            <el-input v-model="form.desc3" style="width:120px;margin-right:20px;margin-left:10px" maxlength="6"></el-input>5.
            <el-input v-model="form.desc4" style="width:120px;margin-right:20px;margin-left:10px" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="有效时间" prop="usetime" v-show="isDelivery">
            收到回执后的
            <el-input v-model="form.usetime" style="width:60px" maxlength="3" ></el-input>天内上报人可评价，超时后系统将关闭评价入口。
          </el-form-item>
          <div class="title">热线设置</div>
          <el-form-item label="热线通道">
            <el-switch v-model="form.hotway" @change="changeSwitch(form.hotway)"></el-switch>
          </el-form-item>
          <el-form-item label="电话" prop="phone" v-show="isHotway">
            <el-input v-model="form.phone" maxlength="15" style="width:180px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">保存</el-button>
            <el-button @click="resetForm('form')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { setprogramParams, getprogramParams } from "@/views/index/api/eas/api.eas.js";
export default {
  name: "programParams",

  components: { visBreadcrumb },
  data() {
    var checkPhone = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error("电话号不能为空"));
      } else {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3568749]\d{9}))$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号或者座机号"));
        }
      }
    };
    var checkTime = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        return callback(new Error("有效时间不能为空"));
      } else {
        const reg = /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/;
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入1-999的整数"));
        }
      }
    };

    return {
      // 面包屑导航数据
      breadcrumbData: [{ name: "参数设置" }, { name: "小程序设置" }],
      isHotway:true,
      isDelivery:true,
      form: {
        nickname:"",
        name: "",
        content: "",
        delivery: true,
        type: [],
        desc: "",
        desc1: "",
        desc2: "",
        desc3: "",
        desc4: "",
        usetime: "",
        hotway: true,
        phone: ""
      },
      rules: {
        phone: [{ validator: checkPhone, trigger: "blur" }],
        usetime: [{ validator: checkTime, trigger: "blur" }]
      },
      setdata: [
       
      ]
    };
  },
  mounted() {
    this.getprogramParams();
  },
  methods: {
    getprogramParams() {
      getprogramParams().then(res => {
        if (res && res.data) {
          this.setdata = res.data;
          console.log(res.data);
          this.form.nickname = res.data[0].paramContent;
          this.form.content = res.data[1].paramContent;
          this.form.name = res.data[2].paramContent;
          if (res.data[3].paramContent == 1) {
            this.form.delivery = true;
            this.isDelivery =true
          } else {
            this.form.delivery = false;
            this.isDelivery =false
          }
          this.form.desc = res.data[4].paramContent;
          this.form.desc1 = res.data[5].paramContent;
          this.form.desc2 = res.data[6].paramContent;
          this.form.desc3 = res.data[7].paramContent;
          this.form.desc4 = res.data[8].paramContent;
          this.form.usetime = res.data[9].paramContent;
          if (res.data[10].paramContent == 1) {
            this.form.hotway = true;
            this.isHotway = true;
          } else {
            this.form.hotway = false;
            this.isHotway = false;
          }
          this.form.phone = res.data[11].paramContent;
        }
      });
    },
    changeSwitch(data){
      if(data){
        this.isHotway = true
      }else{
        this.isHotway = false
      }
    },
    changeSwitch1(data){
      if(data){
        this.isDelivery = true
      }else{
        this.isDelivery = false
      }
    },
    submitForm(formName) {
      
      this.setdata[0].keyCode = "1";
      this.setdata[0].keyDescription = "回执设置";
      this.setdata[0].paramContent = "尊敬的xxx先生/女士";
      this.setdata[0].paramType = "1";
      this.setdata[1].keyCode = "2";
      this.setdata[1].keyDescription = "回执设置-回执内容";
      this.setdata[1].paramContent = this.form.content;
      this.setdata[1].paramType = "1";
      this.setdata[2].keyCode = "3";
      this.setdata[2].keyDescription = "回执设置-落款署名";
      this.setdata[2].paramContent = this.form.name;
      this.setdata[2].paramType = "1";
      this.setdata[3].keyCode = "1";
      this.setdata[3].keyDescription = "满意度评价";
      this.setdata[3].paramContent = this.form.delivery == true ? "1" : "0";
      this.setdata[3].paramType = "2";
      this.setdata[4].keyCode = "2";
      this.setdata[4].keyDescription = "评价指标";
      this.setdata[4].paramContent = this.form.desc;
      this.setdata[4].paramType = "2";
      this.setdata[5].keyCode = "3";
      this.setdata[5].keyDescription = "评价指标";
      this.setdata[5].paramContent = this.form.desc1;
      this.setdata[5].paramType = "2";
      this.setdata[6].keyCode = "4";
      this.setdata[6].keyDescription = "评价指标";
      this.setdata[6].paramContent = this.form.desc2;
      this.setdata[6].paramType = "2";
      this.setdata[7].keyCode = "5";
      this.setdata[7].keyDescription = "评价指标";
      this.setdata[7].paramContent = this.form.desc3;
      this.setdata[7].paramType = "2";
      this.setdata[8].keyCode = "6";
      this.setdata[8].keyDescription = "评价指标";
      this.setdata[8].paramContent = this.form.desc4;
      this.setdata[8].paramType = "2";
      this.setdata[9].keyCode = "7";
      this.setdata[9].keyDescription = "有效时间";
      this.setdata[9].paramContent = this.form.usetime;
      this.setdata[9].paramType = "2";
      this.setdata[10].keyCode = "1";
      this.setdata[10].keyDescription = "热线设置";
      this.setdata[10].paramContent = this.form.hotway == true ? "1" : "0";
      this.setdata[10].paramType = "3";
      this.setdata[11].keyCode = "2";
      this.setdata[11].keyDescription = "电话";
      this.setdata[11].paramContent = this.form.phone;
      this.setdata[11].paramType = "3";
      console.log(this.setdata);
      let paramList = this.setdata;
    
      this.$refs[formName].validate(valid => {
        console.log("3333",valid)
        if (valid) {
          setprogramParams(paramList).then(res => {
            if (res && res.data) {
              console.log("res", res.data);
              this.$message({
                message: "保存成功",
                type: "success"
              });
            } else {
              this.$message.error("保存失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getprogramParams();
    }
  }
};
</script>

<style lang="scss" scoped>
.programParams {
  .title {
    width: 58px;
    height: 15px;
    margin-left: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(55, 118, 255, 1);
  }
}
</style>