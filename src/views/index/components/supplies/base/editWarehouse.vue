<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <!-- <p>基本信息</p> -->
      <div class="inform">
        <el-form
          label-width="100px"
          :model="formData"
          ref="formData"
          :rules="formRule">
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库编号" prop="wUid">
                <el-input
                  type="text"
                  readonly
                  disabled
                  v-model="formData.wUid"
                  style="width:70%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库名称" prop="wName">
                <el-input
                  type="text"
                  maxlength="20"
                  placeholder="请输入仓库名，唯一"
                  v-model="formData.wName"
                  style="width:70%"
                ></el-input>
              </el-form-item>
            </el-col>
            
          </el-row>
          <el-row>
           
            <el-col :span="12">
              <el-form-item label="仓库地址" prop="wAddress">
                <el-input
                  type="text"
                  placeholder="请选择仓库位置"
                  maxlength="100"
                  v-model="formData.wAddress"
                  style="width:70%"
                >
                 <i slot="suffix" class="el-input__icon el-icon-map-location" @click="showMap"></i>
                </el-input>
              </el-form-item>
            </el-col>
             <el-col :span="12">
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
import {  updateWarehouse,queryWarehouse} from "@/views/index/api/supplies/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
// import { validatePhone } from '@/utils/validator.js';
export default {
  components: { visBreadcrumb,mapPoint },
  data() {
    return {
      breadcrumbData: [
        { name: "基础信息" },
        { name: "仓库管理", routerName: "warehouseManage" },
        { name: "编辑" },
      ],
      // 选择经纬度模态框配置
      open: false,
      oConfig: {},
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      detailData:null,
      formData: {
          wUid:'',
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
        wAddress:[
          {required: true, message: '该项不可为空', trigger: 'blur'},
        ],
       
      },
      loading: false,
    };
  },
  mounted() {
    this.queryWarehouse({
      uid:this.$route.query.uid
    })
  },
  methods: {
    async queryWarehouse(d){
      const {code, data } = await queryWarehouse(d)
      if(code ==='00000000'){
        this.detailData = data
        this.formData.wUid=data.warehouseCode
        this.formData.wName=data.warehouseName
        this.formData.wPerson=data.principal
        this.formData.wPhone=data.contactPhone
        this.formData.wAddress=data.address
        this.formData.longitude=data.longitude
        this.formData.latitude=data.latitude
      }
    },
    mapPointSubmit(lal, addressInfo) {
      this.formData.wAddress = addressInfo
      this.formData.longitude = lal.split(",")[0]
      this.formData.latitude = lal.split(",")[1]
        
    },
    showMap() {
      this.oConfig.center= [this.detailData.longitude, this.detailData.latitude],
      this.open = !this.open
        
    },
    submitForm() {
      this.updateWarehouse()
    },
    async updateWarehouse(){
      const {code } = await updateWarehouse({
        uid:this.detailData.uid,
        principal:this.formData.principal,
        contactPhone:this.formData.contactPhone,
        address:this.formData.wAddress,
        latitude:this.formData.latitude,
        longitude:this.formData.longitude,
        warehouseCode:this.formData.warehouseCode,
        warehouseName:this.formData.wName,
      })
      if(code === "00000000"){
      
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.$router.push({
          name:'warehouseManage'
        })
      }
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
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
