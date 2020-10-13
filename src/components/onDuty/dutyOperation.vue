<!-- 操作 -->

<template>
  <div>
    <el-dialog  width="700px" :close-on-click-modal="false" class="receipt-dialog"   v-bind="$attrs" v-on="$listeners" @close="closed('ruleForm')">
      <div class="common_form">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
              <el-radio :label="3">关注</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="简要描述" :label-width="formLabelWidth" prop="mattersDesc">
            <el-input type="textarea" :rows="4" placeholder="请输入描述" maxlength="100" show-word-limit v-model="form.mattersDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>    
      <div slot="footer" class="dialog-footer">
        <el-button @click="oncal">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="subBtnLoading">确 定</el-button>
      </div> 
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'operation',
  props:["eventData"],
  data() {
    return {
      subBtnLoading:false,
      form: {
        uid:'',
        status:1,
        mattersDesc:''
      },
      formLabelWidth:'120px',
       rules: {
          mattersDesc: [
            { required: true, message: '请输入描述', trigger: 'blur' },
          ],
          
        }
    }
  },
  watch:{
    eventData() {
      this.form.uid = this.eventData.uid
      this.form.status = this.eventData.handleStatus
      this.form.mattersDesc = this.eventData.mattersDesc
    }
  },
  mounted(){
    this.form.uid = this.eventData.uid
    this.form.status = this.eventData.handleStatus
    this.form.mattersDesc = this.eventData.mattersDesc
  },
  methods:{
    /* 表格分页方法 */
    submitForm(formName) {
      this.subBtnLoading = true
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit("submitOper",this.form)
          } else {
            this.subBtnLoading = false
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    oncal() {
      this.$emit("closeOper")
    //  this.$parent.showOper = false
    },
    closed(formName){
      this.subBtnLoading = false
       this.$refs[formName].resetFields();
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
