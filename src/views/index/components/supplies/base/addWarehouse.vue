<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <p>基本信息</p>
      <div class="inform">
        <el-form
          label-width="100px"
          :model="formData"
          ref="formData"
          :rules="formRule">
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库名称" prop="wName">
                <el-input
                  type="text"
                  placeholder="请输入仓库名，唯一"
                  maxlength="20"
                  v-model="formData.wName"
                  style="width:70%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="责任人" prop="wPerson">
                <el-input
                  type="text"
                  placeholder="请输入责任人姓名"
                  maxlength="10"
                  v-model="formData.wPerson"
                  style="width:70%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号" prop="wPhone">
                <el-input
                  type="text"
                  placeholder="请输入手机号"
                  maxlength="11"
                  v-model="formData.wPhone"
                  style="width:70%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库地址" prop="wAddress">
                <el-input
                  type="text"
                  placeholder="请选择仓库位置"
                  maxlength="100"
                  v-model="formData.wAddress"
                  style="width:70%"
                >
                 <i slot="suffix" class="el-input__icon el-icon-date" @click="showMap"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item  label-width="0px" class="ment_center">
            <el-button @click="resetForm('formData')">取消</el-button>
            <el-button type="primary" @click="submitForm('formData')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div is="mapPoint" @mapPointSubmit="mapPointSubmit" :open="open" :oConfig="oConfig"></div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import mapPoint from "@/components/common/mapPoint.vue";
import {  createWarehouse} from "@/views/index/api/supplies/api.zr.js";
export default {
  components: { visBreadcrumb,mapPoint },
  data() {
    var checkMobile =async (rule, value, callback) => {
      if (value === "") {
        callback(new Error());
      } else {
        if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          if (this.formData.wPhone !== "") {
            callback();
          }
        }
      }
    };
    return {
      
      breadcrumbData: [
        { name: "基础信息" },
        { name: "仓库管理", routerName: "warehouseManage" },
        { name: "新增" },
      ],
      // 选择经纬度模态框配置
      open: false,
      oConfig: {},
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      formData: {
          wName:'',
          wPerson:'',
          wPhone:'',
          wAddress:'',
          longitude:0,
          latitude:0,
      },
      formRule:{
        wName:[
          {required: true, message: '该项不可为空', trigger: 'blur'},
        ],
        wPerson:[
          {required: true, message: '该项不可为空', trigger: 'blur'},
        ],
        wPhone:[
          {required: true, message: '该项不可为空', trigger: 'blur'},
           { validator: checkMobile, trigger: "blur" }
        ],
        wAddress:[
          {required: true, message: '该项不可为空', trigger: 'blur'},
        ],
      
      },
      loading: false,
    };
  },
  mounted() {},
  methods: {
      
    mapPointSubmit(lal, addressInfo) {
      this.formData.wAddress = addressInfo
      this.formData.longitude = lal.split(",")[0]
      this.formData.latitude = lal.split(",")[1]
      this.$refs['formData'].clearValidate("wAddress")
    },
    showMap() {
        this.open = !this.open
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createWarehouse()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    async createWarehouse(){
      const {code } = await createWarehouse({
        "address": this.formData.wAddress,
        "contactPhone": this.formData.wPhone,
        "latitude": this.formData.latitude,
        "longitude": this.formData.longitude,
        "principal": this.formData.wPerson,
        "warehouseName": this.formData.wName,
        "unitUid": this.userInfo.rmsUnitDto.uid
      })
      if(code === "00000000"){
      
        this.$message({
          message: `添加成功`,
          type: "success",
        });
        this.resetForm('formData')
      }
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({
        name:'warehouseManage'
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.inform{
    padding-top: 20px;
}
.ment_center{
    text-align: center;
}
</style>
