<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input type="text" v-model.trim="organName" placeholder="用户名/姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrgan">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item class="rightButton">
              <el-button @click="showAdd()" icon="iconfont iconbianzu12"> 新增</el-button>
            </el-form-item>
      </el-form>
      <div class="common_table">
        <el-table :data="orgTableData" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="70">
          </el-table-column>
          <el-table-column label="单位名称" prop="com">
            <template slot-scope="scope">
                  <span>{{ scope.row.organName || '-' }}</span>
                </template>
          </el-table-column>
          <el-table-column label="负责人姓名" prop="com">
            <template slot-scope="scope">
                  <span>{{ scope.row.chargeUserName || '-' }}</span>
                </template>
          </el-table-column>
          <el-table-column label="负责人手机号码" prop="com">
            <template slot-scope="scope">
                  <span>{{ scope.row.chargeUserMobile || '-' }}</span>
                </template>
          </el-table-column>
          <el-table-column label="单位类型" prop="com">
            <template slot-scope="scope">
                  <span>{{ scope.row.organType || '-' }}</span>
                </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="editUserMange(scope.row)">编辑</span>
              <span class="operation_btn" @click="handleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
    </el-scrollbar>
  </div>
  <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="500px" :before-close="closed">
      <el-form :model="formData" ref="editForm">
        <el-form-item label="单位名称" prop="organName" label-width="100px">
          <el-input v-model="formData.organName" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="单位类型" prop="organType" label-width="100px">
          <el-select
                  placeholder="请选择单位类型"
                  class="wid20"
                  v-model="formData.organType"
                >
                  <el-option
                    v-for="item in OraganFlagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
        </el-form-item>
        <el-form-item label="负责人姓名" prop="chargeUserName" label-width="100px">
          <el-input v-model="formData.chargeUserName" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机号" prop="chargeUserMobile"  label-width="100px">
          <el-input v-model="formData.chargeUserMobile" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed('editForm')">取 消</el-button>
        <el-button type="primary" @click="onConfirm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
</div>

</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { getOrgan,createOrgan,delOrgan,updateOrganList } from "@/views/index/api/system/api.xy.js";
import { proKey } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      systemCode:localStorage.getItem('systemCode'),
      formData: {
        chargeUserName: "",
        chargeUserMobile: "",
        organName:"",
        organType:"",
      },
      OraganFlagList: [
        {
          value: '1',
          label: '组织单位',
        },
        {
          value: '2',
          label: '联动单位',
        },
      ],
      addVersionTitle: "新增单位",
      addVersionVisible: false,
      breadcrumbData: [{ name: "系统管理" }, { name: "单位管理" }],
      queryInfo:"",
      organName:"",
      orgTableData:[],
      proKey: proKey,
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
    };
  },
  mounted() {
    this.getOrgan()
  },
  methods: {    
    //初始化数据 列表分页查询
    async getOrgan() {
      let d={
          "where.proKey":this.proKey,
          "pageNum":this.pageNum,
          "where.organName":this.organName,
        }
      // if(!d){
      //   d={
      //     "where.proKey":proKey
      //   }
      // }else{
      //   d['where.proKey'] = proKey
      // }
      
      // d.proKey = this.proKey 
      // console.log('dd');
      
      const {code , data} = await getOrgan(d)
      if(code ==='00000000'){
        this.orgTableData = data.list
        this.total = data.total
      }
    },
    showAdd() {
      this.addVersionVisible = true
      this.addVersionTitle= "新增用户"
      console.log(123465);
    },
    onSubmit(){
      let data ={
        "organType":this.formData.organType,
        "organName":this.formData.organName,
        "chargeUserMobile": this.formData.chargeUserMobile,
        "chargeUserName": this.formData.chargeUserName,
      }
      this.getOrgan(data)
    },
    
    //新添 编辑 提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("验证通过"); //
          if(this.addVersionTitle == '新增用户'){
            this.addOrgan()
          }else{
            this.onEditorSava()
          }
          
        } else {
          _this.versionLoading = false;
        }
      });
    },
    //编辑提交
    async onEditorSava() {
      const {code} = await updateOrganList({
        "uid": this.formData.uid,
        "organType":this.formData.organType,
        "organName":this.formData.organName,
        "chargeUserMobile": this.formData.chargeUserMobile,
        "chargeUserName": this.formData.chargeUserName,
        "proKey":proKey,
        "systemCode":this.systemCode
      })
      if(code==='00000000'){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.closed('editForm')
        let data ={
        "organType":this.formData.organType,
        "organName":this.formData.organName,
        "chargeUserMobile": this.formData.chargeUserMobile,
        "chargeUserName": this.formData.chargeUserName,
        }
        this.getOrgan(data);
      }
    },
    closed() {
      this.$refs['editForm'] && this.$refs['editForm'].clearValidate();
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
      this.addVersionVisible = false;
    },
    async addOrgan() {
      const {code} = await createOrgan({
        "organType":this.formData.organType,
        "organName":this.formData.organName,
        "chargeUserMobile": this.formData.chargeUserMobile,
        "chargeUserName": this.formData.chargeUserName,
        "proKey":proKey,
        "systemCode":this.systemCode
      })
      if(code === '00000000'){
        this.$message({
          message: `添加成功`,
          type: "success",
        });
      this.$refs.editForm.resetFields();
      this.addVersionVisible = false
      this.pageNum = 1
      this.getOrgan();
        // this.$refs.formRule.clearValidate();
      }
    },
    // 点击删除
    handleDelete(row){
       this.$confirm('确认删除？')
          .then(() => {
            // done();  
            delOrgan({
              uid:row.uid, 
              proKey :this.proKey
            }).then(res=>{
              if(res && res.code=="00000000"){
                this.getOrgan()
                this.$message({
                  type:"success",
                  message:"删除成功"
                })
              }
            })
          })
          .catch(() => {
            console.log('取消删除');
          });
      
    },
    //编辑
    editUserMange(row) {
      this.addVersionTitle= "编辑用户"
      this.addVersionVisible=true
      // this.formData.roleUid = row.roleUid.split(",")
      this.formData.organType = row.organType
      this.formData.organName = row.organName
      this.formData.uid = row.uid
      this.formData.chargeUserMobile = row.chargeUserMobile
      this.formData.chargeUserName = row.chargeUserName
    },
    queryForm(){

    },
    resetForm(){
      this.pageNum = 1;
      this.organName = "";
      this.getOrgan();
    },
    onPageChange(){

    }
  },
};
</script>
<style lang="scss" scoped>
.rightButton {
  position: absolute;
  right: 0;
}
.wid20{
  width:280px
}
</style>
