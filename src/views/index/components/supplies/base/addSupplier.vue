<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <!-- <p>基本信息</p> -->
      <div class="inform">
        <el-form label-width="100px" :model="formData" ref="formData" :rules="formRule">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input
                  type="text"
                  placeholder="请输入供应商名称"
                  v-model="formData.supplierName"
                  :maxlength="20"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系地址" prop="address">
                <el-input
                  type="text"
                  placeholder="请输入联系地址"
                  v-model="formData.address"
                  :maxlength="100"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人" prop="contactPerson">
                <el-input
                  type="text"
                  placeholder="请输入联系人"
                  v-model="formData.contactPerson"
                  :maxlength="10"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input
                  type="text"
                  placeholder="请输入联系电话"
                  v-model="formData.contactPhone"
                  class="maxfull"
                  :maxlength="11"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座机" prop="telephone">
                <el-input
                  type="text"
                  placeholder="请输入座机号"
                 
                  v-model="formData.telephone"
                  class="maxfull"
                  :maxlength="13"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  type="text"
                  placeholder="请输入邮箱"
                
                  v-model="formData.email"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        
          <el-form-item label="供应商资质" v-loading="imgLoading">
            <el-upload 
            class="upload-doc" 
            action="#" 
            :before-upload="beforeUploadDocument"  
            :on-exceed="onExceedDocument" 
            :http-request="uploadAvatar" 
            with-credentials 
            :on-remove="onRemoveDocument"  
            :limit="9" 
            :file-list="fileList" 
            :show-file-list="true" 
            :before-remove="beforeRemoveFile" 
            multiple  
            :accept="acceptFile"  
            list-type="picture-card"  >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">最多9张，大小不超过10M，支持JPG、GIF、PNG等格式</div>
            </el-upload>
         
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" class="wid50" placeholder="请输入备注"   maxlength="100" v-model="formData.remark"></el-input>
          </el-form-item>
          <el-form-item label-width="0px" class="ment_center">
            <el-button @click="resetForm('formData')">取消</el-button>
            <el-button type="primary" @click="submitForm('formData')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {createSupplier,batchUpload} from "@/views/index/api/supplies/api.zr.js";
// import { ajaxCtx } from '@/config/config.js';
// import { validatePhone } from '@/utils/validator.js';
export default {
  components: { visBreadcrumb },
  data() {
    var checkMobile =async (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          if (this.formData.contactPhone !== "") {
            callback();
          }
        }
      }
    };
    var checkTel =async (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)) {
          callback(new Error("请输入正确的座机号"));
        } else {
          if (this.formData.telephone !== "") {
            callback();
          }
        }
      }
    };
    var checkMail =async (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
          callback(new Error("请输入正确的邮箱地址"));
        } else {
          if (this.formData.email !== "") {
            callback();
          }
        }
      }
    };
    return {
      breadcrumbData: [
        { name: "基础信息" },
        { name: "供应商管理", routerName: "supplierManage" },
        { name: "新增" },
      ],
      acceptFile:'.jpg,.gif,.png',
      fileList:[],
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
        imgLoading:false,
      formData: {
        address: "",
        contactPerson: "",
        contactPhone: "",
        email: "",
        telephone: "",
        supplierName: "",
        remark: "",
        useFlag:'1',
        unitUid:'',
        imageList:[]
      },
      imageList:[],
      formRule: {
        supplierName: [{ required: true, message: "此项为必填项", trigger: "blur" }],
        contactPhone:[
           { validator: checkMobile, trigger: "blur" }
        ],
        telephone:[
           { validator: checkTel, trigger: "blur" }
        ],
        email:[
           { validator: checkMail, trigger: "blur" }
        ],
      },
      loading: false,
      listCount:0,
      comCount:0
    };
  },
  mounted() {
    this.formData.unitUid = this.userInfo.rmsUnitDto.uid || null
  },
  methods: {
    
    //删除上传的文件前处理方法
    beforeRemoveFile(file){
      let index = this.fileList.findIndex(el=>(el.name == file.name && el.url == file.url))
      let a = this.imageList.findIndex(el=>(el.originalFileName == file.name && el.fileFullPath == file.url))
      this.fileList.splice(index,1)
      this.imageList.splice(a,1)
    },
    //上传文件时大小控制
    beforeUploadDocument(file){
      let isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      let testmsg=file.name.substring(file.name.lastIndexOf('.')+1) 
      const extension = this.acceptFile.indexOf(testmsg)           
      // const isLt2M = file.size / 1024 / 1024 < 10            
     if(extension==-1) {                
         this.$message({                    
             message: '请上传正确文件格式!',                    
            type: 'warning'               
        });            
     }
      return (isLt10M && extension!=-1);
    },
    //上传文件时数量控制
    onExceedDocument(){
      this.$message.warning("最多可上传9个文件")
    },
    //文件上传提交到后端
    uploadAvatar(item){
      this.listCount +=1
      this.imgLoading = true; // 打开加载效果
      const formData = new FormData();
      formData.append("file", item.file);
      batchUpload(formData).then(res => {
        this.comCount +=1
        if(this.comCount == this.listCount){
          this.imgLoading = false;
        }
        if (res && res.code == "00000000") {
          if(res.data.length>0){
            res.data.map((item,index)=>{
              let unit={}
              //判断是否为IE浏览器的文件名，IE浏览器下文件名会带有盘符信息
                // Check for Unix-style path
              let unixSep = item.originalFileName.lastIndexOf('/');
              // Check for Windows-style path
              let winSep = item.originalFileName.lastIndexOf('\\');
              // Cut off at latest possible point
              let pos = (winSep > unixSep ? winSep : unixSep);
              if (pos != -1)  {
                  // Any sort of path separator found...
                  item.originalFileName = item.originalFileName.substring(pos + 1);
              }
              unit.uid=index
              unit.url=item.fileFullPath
              unit.name=item.originalFileName
              this.fileList.push(unit)
              this.imageList.push(item)
            })
          }
        }else{          
          this.$message.error("上传失败，请重新上传");
        }
      }).catch(()=>{
        this.comCount +=1
        if(this.comCount == this.listCount){
          this.imgLoading = false;
        }
        if(this.fileList.length==0){
          this.fileList = []
        }else{
          let ars = JSON.stringify(this.fileList)
          this.fileList = JSON.parse(ars)
        }
      })
    },
    //删除文件列表时的相关操作
    onRemoveDocument(){
      //查询操作文件，并在列表内删除当前文件
    },
    submitForm(formName) {
      this.formData.imageList=this.imageList
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createSupplier()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    async createSupplier(){
      const {code } = await createSupplier(this.formData)
      if(code === "00000000"){
        this.$message({
          message: `添加成功`,
          type: "success",
        });
        this.$router.push({
          name:'supplierManage'
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
      this.$router.back(-1)
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list--picture-card .el-upload-list__item{
  width: 80px;
  height: 80px;
}
/deep/ .el-upload--picture-card{
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.inform {
  padding-top: 20px;
}
.maxfull{
  width: 100%;
}
.wid50{
  width: 50%;
}
.ment_center {
  text-align: center;
}
</style>
