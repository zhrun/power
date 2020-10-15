<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
      <div class="boxBoder">
         <el-input placeholder="角色名称" v-model="keyword" class="input-with-select" style="width:400px;">
         
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
          <el-button type="primary" @click="addUnitGroup" style="margin-left:20px;" >添加权限组</el-button>
      </div>
               
      <div class="common_table" style="margin-top:20px;">
        <el-table class="table-comp" ref="versionTable" :data="orgTableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="序号" type="index"  width="50"></el-table-column>
          <el-table-column  label="角色名称" prop="roleName" ></el-table-column>
          <el-table-column  label="描述" prop="roleDesc" show-overflow-tooltip></el-table-column>
          <el-table-column  label="创建日期" >
             <template slot-scope="scope">
               {{scope.row.createTime | fmTimestamp}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" >
            <template slot-scope="scope">
              <span class="operation_btn" @click="seeRole(scope.row)">查看权限</span> 
              <span class="operation_btn" @click="updateVersion(scope.row)">删除</span> 
              <span class="operation_btn" @click="controlRole(scope.row)">编辑权限</span> 
              <!-- <span class="operation_btn" @click="delItem(scope.row)" v-if="!scope.row.isDefault">删除</span> -->
              <!-- <span class="operation_btn disabled"  v-else>删除</span> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="onPageChange"
          :current-page.sync="pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          class="pagination_comp"
        ></el-pagination>
      </div>
      </el-scrollbar>
    </div>    
    <!-- 新增编辑弹框 -->
    <el-dialog :title="addVersionTitle" :visible.sync="addVersionVisible" width="600px" :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="addFormData.roleName" :maxlength="20" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="所属系统">
          <el-select v-model="addFormData.systemCode" placeholder="请选择子系统">
            <el-option v-for="item in allLimitObj.A" :label="item.resourceName" :value="item.systemCode" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容"
            maxlength="100"
            :show-word-limit="true"
            v-model="addFormData.roleDesc">
          </el-input>
        </el-form-item>
    
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('addForm')">取 消</el-button>
        <el-button type="primary" class="btn-save" @click="onConfirm('addForm')" :loading="versionLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getResources,getRoleList, delRole,updateRole,createRole} from '@/views/index/api/system/api.zr.js';
import { proKey } from '@/config/config.js';
import { treeData } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      permission:JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" },{ name: "角色管理"}],
      orgTableData:[],
      keyword:"",
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionVisible:false,
      addVersionTitle:"新增",
      addRules:{
        roleName:[
          {required: true, message: '该项不可为空', trigger: 'blur'}
       
        ],        
        
      },
      addFormData:{
        roleName:"",
        proKey:proKey,
        roleDesc:""
      
      },
      versionLoading:false,
      proKey:proKey,
      allLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      terminalType:JSON.parse(localStorage.getItem('vis_user_info')).terminalType,
    };
  },
  mounted() {
    
    // this.getRoleList()
    this.getResources()
  },
  methods: {
 
    getResources(){
      this.allLimitObj.A = [];
      getResources({
         proKey :this.proKey
      }).then(res=>{
        if (res) {
            this.limitDataList = res.data;
            // console.log('data', res.data)
            this.allLimitObj.A=treeData(this.limitDataList)
            console.log(this.allLimitObj.A)
          }
      })
    },
    seeRole(item){
      this.$router.push({name:'seerole', params: { uid: item.uid,}})
    },
    addUnitGroup(item){
      this.$router.push({name:'unitGroup', params: { uid: item.uid,}})
    },
    
    //初始化数据 
    getRoleList(){
       let d={
          "where.proKey":this.proKey,
          "pageNum":this.pageNum,
          "where.roleName":this.keyword,
        }
      
      getRoleList(d).then(res=>{
        if(res && res.data){
          //  console.log('res',res);
          if(this.terminalType == 3 || this.terminalType==4){
            res.data.list.forEach(el=>{
              if(el.roleType=="LD_LEADER" || el.roleType=="LD_COMMON"){
                this.orgTableData.push(el)
              }
            })
            this.total =2
            this.pageNum = 1
          }else{
            this.orgTableData = res.data.list
            this.total = res.data.total
            this.pageNum = res.data.pageNum
          }
          
        }
      })
    },
   
    //新增
    // addVersion(){
    //   this.addFormData={
    //      roleName:"",
    //     proKey:proKey,
    //     roleDesc:""
    //   }
    //   this.addVersionVisible=true
      
    //   // this.$refs['addForm'].resetFields()
    // },
    //编辑
    // updateVersion(obj){
    //   // console.log(obj)
    //   this.addVersionTitle="编辑"
    //   this.addVersionVisible=true
    //   if(this.$refs['addForm']){
    //     this.$refs['addForm'].clearValidate()
    //   }
    //   this.addFormData={
    //     roleName:obj.roleName,
    //     proKey:this.proKey,
    //     roleDesc:obj.roleDesc,
    //     uid:obj.uid,
    //     systemCode:obj.systemCode
    //   }
    // },
    //删除
    delItem(obj){
      this.$confirm('确认删除？')
          .then(() => {
            delRole({
                uid:obj.uid,
                proKey :this.proKey
              }).then(res=>{
                if(res && res.code=="00000000"){
                  this.$message({
                    type:"success",
                    message:"角色删除成功"
                  })
                  this.getRoleList()
                }
              })
          })
          .catch(() => {
            console.log('取消删除');
            
          });
     
    },
  
    //取消
    onCancle () {
      // this.AEdialogVisible = false;
      //  this.$refs[formName].resetFields()
      // console.log(formName)
      this.addVersionVisible=false
    },
    //提交
    // onConfirm (formName) {
    //   // console.log(formName)
    //   this.$refs[formName].validate((valid) => {
    //     if(valid){
    //       //console.log("验证通过")
    //       let d = this.addFormData
    //       if(this.addVersionTitle=="新增"){
    //         createRole(d).then(res=>{
    //           if(res && res.code=="00000000"){
    //             this.$message({
    //               type:"success",
    //               message:"新增角色成功"
    //             })
    //             this.getRoleList()
    //             this.addVersionVisible=false
    //           }
    //         })
    //       }else if(this.addVersionTitle=="编辑"){
    //         updateRole(d).then(res=>{
    //           if(res && res.code=="00000000"){
    //             this.$message({
    //               type:"success",
    //               message:"修改角色成功"
    //             })
    //             this.getRoleList()
    //             this.addVersionVisible=false
    //           }
    //         })
    //       }
          
    //     }
    //   })
    // },
    
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getRoleList();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.statistics {
  // height: 100%;
  position: relative;
}
.boxBoder{
  border: solid 1px #f5f5f5;
  padding: 10px 10px;
}
.operation_btn{
  padding: 0px 3px;
}
.disabled{
  color: #999999;
}
</style>
<style>
.el-dialog__body{
  padding:30px 100px 0px 60px;
}
</style>