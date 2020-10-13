<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <p>基本信息</p>
      <div class="inform">
        <table v-if="detailData">
          <tr>
            <td>仓库编号：{{detailData.warehouseCode}}</td>
            <td>仓库名称：{{detailData.warehouseName}}</td>
            <td>责任人：{{detailData.principal}}</td>
          </tr>
          <tr>
            <td>手机号：{{detailData.contactPhone}}</td>
            <td>仓库地址：{{detailData.address}}</td>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="ltbox">
        <el-button @click="toBack">返 回</el-button>
        <el-button type="primary" @click="changeSon">更换责任人</el-button>
        <el-button type="primary" @click="toEdit">编 辑</el-button>
      </div>
    </div>
    <el-dialog title="更换责任人" :visible.sync="dialogChange" width="400px">
      <el-form :model="changeForm" ref="formRule" :rules="formRule">
        <el-form-item label="责任人姓名" label-width="120px" prop="name">
          <el-input v-model="changeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px" prop="phone">
          <el-input v-model="changeForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {  queryWarehouse,updatePrincipal} from "@/views/index/api/supplies/api.zr.js";
// import { getAllList,delEvent,putEvent,getRecordList} from "@/views/index/api/onDuty/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
// import { validatePhone } from '@/utils/validator.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [
        { name: "基础信息" },
        { name: "仓库管理", routerName: "warehouseManage" },
        { name: "仓库详情" },
      ],
      // 选择经纬度模态框配置
      changeForm: {
        uid:'',
        name:'',
        phone:'',
      },
      detailData:null,
      formRule:{
        name:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        phone:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
      
      },
      dialogChange:false,
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
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
      }
    },
    closed(){
      this.$refs.formRule.clearValidate();
      this.dialogChange  = false
    },
    toBack() {
      this.$router.back(-1)
    },
    toEdit() {
      this.$router.push({
        name:'editWarehouse',
        query:{
          uid:this.$route.query.uid
        }
      })
        
    },
    changeSon() {
      this.changeForm.uid=this.detailData.uid
      this.changeForm.name=this.detailData.principal
      this.changeForm.phone=this.detailData.contactPhone
      this.dialogChange = true
    },
    submitForm() {
      this.updatePrincipal(this.changeForm)
    },
     async updatePrincipal(d){
      const {code } = await updatePrincipal({
        uid:d.uid,
        principal:this.changeForm.name,
        contactPhone:this.changeForm.phone
      })
      if(code === "00000000"){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.queryWarehouse({
          uid:this.$route.query.uid
        })
        this.closed()
      }
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.inform{
  margin-top: 20px;
  line-height: 42px;
  table,table tr th, table tr td { border:1px solid #D3D3D3;line-height: 42px; padding: 0px 10px; }
  table { width: 100%;  text-align: left; border-collapse: collapse; padding:2px;}   

}
.ltbox{
  margin: 20px auto;
  text-align: center;
}
.ment_center{
  text-align: center;
}
</style>
