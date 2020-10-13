/* 其他参数设置 */
<template>
<div>
<!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
<div class="common_content">
      <el-scrollbar style="height:100%;">

  <el-form ref="form" :model="form" label-width="100px" class="otherParams" :rules="rules"> 
    <div class="title">核实时效</div>
    <el-form-item label="超时限制">
      <el-switch v-model="form.hotway" @change="changeSwitch(form.hotway)"></el-switch>
    </el-form-item>
    <el-form-item label="时效设置" prop="usetime" v-show="isHotway">
      事件上报后的
      <el-input v-model="form.usetime" style="width:60px" maxlength="3" ></el-input>
      <el-select v-model="form.region" placeholder="时" style="width:80px">
        <el-option label="小时" value="1"></el-option>
        <el-option label="分钟" value="2"></el-option>
      </el-select>内需进行核实，否则将判为超时。超时情况可作为工作绩效评定的参考。
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
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
    var checkTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("时效设置不能为空"));
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
      rules: {
        usetime: [{ validator: checkTime, trigger: "blur" }]
      },
        // 面包屑导航数据
      breadcrumbData: [{ name: "参数设置" }, { name: "其他参数" }],
      isHotway:true,
      form: {
        hotway: true,
        region: "2",
        usetime: ""
      },
      setdata: [
        {
          keyCode: 1,
          keyDescription: "回执设置",
          paramContent: "尊敬的xxx先生/女士",
          paramType: 1
        },
        {
          keyCode: 2,
          keyDescription: "回执设置-回执内容",
          paramContent: "您上报的事件已收到，并已派相关人员进行处理，请知悉!",
          paramType: 1
        },
        {
          keyCode: 3,
          keyDescription: "回执设置-落款署名",
          paramContent: "应急指挥中心",
          paramType: 1
        },
        {
          keyCode: 1,
          keyDescription: "满意度评价",
          paramContent: "open",
          paramType: 2
        },
        {
          keyCode: 2,
          keyDescription: "评价指标",
          paramContent: "1：不满意；2：一般；3：满意",
          paramType: 2
        },
        {
          keyCode: 3,
          keyDescription: "评价指标",
          paramContent: "1：不满意；2：一般；3：满意",
          paramType: 2
        },
        {
          keyCode: 4,
          keyDescription: "评价指标",
          paramContent: "1：不满意；2：一般；3：满意",
          paramType: 2
        },
        {
          keyCode: 5,
          keyDescription: "评价指标",
          paramContent: "1：不满意；2：一般；3：满意",
          paramType: 2
        },
        {
          keyCode: 6,
          keyDescription: "评价指标",
          paramContent: "1：不满意；2：一般；3：满意",
          paramType: 2
        },
        {
          keyCode: 7,
          keyDescription: "有效时间",
          paramContent: "7",
          paramType: 2
        },
        {
          keyCode: 1,
          keyDescription: "热线设置",
          paramContent: "open/true/1/其他方式",
          paramType: 3
        },
        {
          keyCode: 2,
          keyDescription: "电话",
          paramContent: "13800000001",
          paramType: 3
        },
        {
          keyCode: 1,
          keyDescription: "超时设置",
          paramContent: "open/true/1/其他方式",
          paramType: 4
        },
        {
          keyCode: 2,
          keyDescription: "时效设置",
          paramContent: "2；hourse/3;minutes",
          paramType: 4
        },
        {
          keyCode: 3,
          keyDescription: "时效设置",
          paramContent: "时",
          paramType: 4
        }
      ]
    };
  },
  mounted() {
    this.getprogramParams();

  },
  methods: {
    getprogramParams(){
      getprogramParams().then(res => {
        if (res && res.data) {
          console.log(res.data);
          this.setdata = res.data;
          this.form.usetime = res.data[13].paramContent;
       
          if (res.data[12].paramContent == 1) {
            this.form.hotway = true;
            this.isHotway = true;
          } else {
            this.form.hotway = false;
            this.isHotway = false;
          }
          this.form.region = res.data[14].paramContent;
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
    onSubmit() {
      this.setdata[13].paramContent = this.form.usetime;
      this.setdata[14].paramContent = this.form.region;
      this.setdata[12].paramContent = this.form.hotway == true ? "1" : "0";
      let paramList = this.setdata;
      setprogramParams(paramList).then(res => {
        if (res && res.data) {
          console.log("res", res.data);
          this.$message({
                message: "保存成功",
                type: "success"
              });
        }else{
          this.$message.error("保存失败");
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
.otherParams {
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