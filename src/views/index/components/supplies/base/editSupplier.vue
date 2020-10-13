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
              <el-form-item label="供应商编号" prop="wUid">
                <el-input type="text" readonly disabled v-model="formData.supplierCode" class="maxfull"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否启用">
                <span><el-radio v-model="formData.useFlag" label="1">是</el-radio>
  <el-radio v-model="formData.useFlag" label="0">否</el-radio></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input
                  type="text"
                  placeholder="请输入供应商名称"
                   :maxlength="20"
                  v-model="formData.supplierName"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="联系地址" prop="address">
                <el-input
                  type="text"
                  placeholder="请输入联系地址"
                  :maxlength="100"
                  v-model="formData.address"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人" prop="contactPerson">
                <el-input
                  type="text"
                  placeholder="请输入联系人"
                  :maxlength="10"
                  v-model="formData.contactPerson"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input
                  type="text"
                  placeholder="请输入联系电话"
                  :maxlength="11"
                  v-model="formData.contactPhone"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="座机" prop="telephone">
                <el-input
                  type="text"
                  placeholder="请输入座机"
                  :maxlength="13"
                  v-model="formData.telephone"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  type="text"
                  placeholder="请输入邮箱"
                  :maxlength="100"
                  v-model="formData.email"
                  class="maxfull"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          <el-form-item label="供应商资质"  v-loading="imgLoading">
            <el-upload 
            class="upload-doc" 
            action="#" 
            :before-upload="beforeUploadDocument"  
            :on-exceed="onExceedDocument" 
            :http-request="uploadAvatar" 
            with-credentials 
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
            <!-- <el-upload class="upload-doc" action="#" :before-upload="beforeUploadDocument" :on-exceed="onExceedDocument" :http-request="uploadAvatar" with-credentials   :limit="9" :file-list="fileList" :before-remove="beforeRemoveFile" multiple  :accept="acceptFile" list-type="picture-card" >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">最多9张，大小不超过10M，支持JPG、GIF、PNG等格式</div>
            </el-upload> -->
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" class="wid50" v-model="formData.desc"></el-input>
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
import { querySupplier,batchUpload,updateSupplier } from "@/views/index/api/supplies/api.zr.js";
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
      imgLoading:false,
      breadcrumbData: [
        { name: "基础信息" },
        { name: "供应商管理", routerName: "supplierManage" },
        { name: "编辑" },
      ],
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      formData: {
        uid:'',
        supplierCode:'',
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
      fileList:[],
      acceptFile:'.jpg,.gif,.png',
      formRule: {
        supplierName: [{ required: true, message: "此项为必选项", trigger: "blur" }],
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
    this.querySupplier({
      uid:this.$route.query.uid
    })
  },
  methods: {
    
    async querySupplier(d){
      const {code, data } = await querySupplier(d)
      if(code ==='00000000'){
        this.formData = data
        this.imageList=this.formData.imageList
        this.formData.imageList.forEach(el=>{
          this.fileList.push({
            name:el.originalFileName,
            url:el.fileFullPath
          })
        })
      }
    },
    async updateSupplier(d){
      const {code } = await updateSupplier(d)
      if(code === "00000000"){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.$router.push({
          name:'supplierManage'
        })
      }
    },
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
    submitForm(formName) {
      this.formData.imageList=this.imageList
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateSupplier(this.formData)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },

    //重置
    resetForm() {
      this.$router.push({
        name:'supplierManage'
      })
    },

  },
};
</script>
<style lang="scss" scoped>
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
