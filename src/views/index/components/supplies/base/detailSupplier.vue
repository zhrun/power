<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <p>基本信息</p>
      <div class="inform">
        <table v-if="detailData">
          <tr>
            <td>供应商编号：{{detailData.supplierCode}}</td>
            <td><label>是否启用：</label><span><el-radio v-model="detailData.useFlag" label="1" disabled>是</el-radio>
  <el-radio v-model="detailData.useFlag" label="0" disabled>否</el-radio></span></td>
            <td>供应商名称：{{detailData.supplierName}}</td>
          </tr>
          <tr>
            <td>联系地址：{{detailData.address || "-"}}</td>
            <td>联系人：{{detailData.contactPerson || "-"}}</td>
            <td>联系电话：{{detailData.contactPhone || "-"}}</td>
          </tr>
          <tr>
            <td>座机：{{detailData.telephone || "-"}}</td>
            <td>邮箱：{{detailData.email || "-"}}</td>
            <td>备注：{{detailData.remark || "-" }}</td>
          </tr>
        </table>
      </div>
      <!-- <div class="inform">
        <ul>
          <li><label>采购单编号：</label><span>GYS000001</span></li>
          <li><label>是否启用：</label><span><el-radio v-model="radio" label="1">是</el-radio>
  <el-radio v-model="radio" label="2">否</el-radio></span></li>
          <li><label>供应商名称：</label><span>长沙联通装备公司长沙联通装备公司长沙联通</span></li>
          <li><label>联系地址：</label><span>二十个字二十个字二十个字二十个字二十个字</span></li>
          <li><label>联系人：</label><span>张飒</span></li>
          <li><label>联系电话：</label><span>13600000001</span></li>
          <li><label>座机：</label><span>0712-28736192</span></li>
          <li><label>邮箱：</label><span>majwidrne@127 .com</span></li>
        </ul>
      </div> -->
      <p v-if="imgList && imgList.length>0">供应商资质</p>
      <div class="inform">
       <div class="img-unit" v-for="(item, index) in imgList" :key="index+6">
          <img
            class="img-fill"
            :src="item.fileType=='mp4'?videoPre:item.fileFullPath"
            @click="playVideo(index)"
          />
        </div>
      </div>
     
      <div class="ltbox">
        <el-button @click="toBack">返 回</el-button>
        <!-- <el-button type="primary" @click="submitForm('formData')">更换责任人</el-button> -->
        <el-button type="primary" @click="toEdit">编 辑</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" class="enclosDialog">
      <div is="preview" :eData="imgList" v-model="currentEnclosIndex"></div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import preview from "_com/preview.vue";
// import { querySupplier } from "@/views/index/api/supplier/api.zr.js";
import { querySupplier} from "@/views/index/api/supplies/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
// import { validatePhone } from '@/utils/validator.js';
export default {
  components: { visBreadcrumb ,preview},
  data() {
    return {
      breadcrumbData: [
        { name: "基础信息" },
        { name: "供应商管理", routerName: "supplierManage" },
        { name: "供应商详情" },
      ],
      currentEnclosIndex: -1,
      imgList:[],
      radio: '1',
      // 选择经纬度模态框配置
      detailData:null,
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      loading: false,
      dialogVisible: false
    };
  },
  mounted() {
    this.querySupplier({
      uid:this.$route.query.uid
    })
  },
  methods: {
    async querySupplier(d){
      const {code, data } = await querySupplier(d)
      if(code ==='00000000'){
        this.detailData = data
        this.detailData.imageList.forEach(el=>{
          this.imgList.push({
            fileType:el.fileType,
            fileFullPath:el.fileFullPath
          })
        })
      }
    },
    playVideo(index) {
      this.currentEnclosIndex = index;
      this.dialogVisible = true;
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
        name:'editSupplier',
        query:{
          uid:this.$route.query.uid
        }
      })
        
    },
    submitForm() {
      this.dialogChange = true
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
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 42px;
  table,table tr th, table tr td { border:1px solid #D3D3D3;line-height: 22px; padding: 10px 10px; width: 33.33%; }
  table { width: 100%;  text-align: left; border-collapse: collapse; padding:2px;}  
  &:after{
        clear: both;
        content: "";
        display: block;
        width: 0;
        height: 0;
    }
 
}
.img-unit {
  width: 100px;
  height: 100px;
  margin-right: 2%;
  margin-top: 10px;
  float: left;
  .img-fill {
    width: 100%;
    height: 100%;
    cursor: pointer;
    // border-radius: 8px;
  }
  video {
    width: 100%;
    height: 100%;
  }
}
.ltbox{
  margin: 20px auto;
  text-align: center;
}
.common_content{
  p{
    font-weight: bold;
  }
}
</style>
