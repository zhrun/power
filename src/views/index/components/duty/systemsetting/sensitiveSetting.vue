/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:09 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-27 14:17:18
 */
<template> 
  <div class="program-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
            <el-form-item >
              <el-button @click="showAdd()"  icon="iconfont iconbianzu12"> 新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 分页表格 -->
        <div class="common_table">
          <el-table
            class="table-comp"
            ref="versionTable"
            :data="postionList"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading"
          
          >
            <el-table-column label="名称" width="150px"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.name || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="80px">
              <template slot-scope="scope">
                <span>{{types[scope.row.type] || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" >
              <template slot-scope="scope">
                <span>{{scope.row.startTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" >
              <template slot-scope="scope">
                <span>{{scope.row.endTime || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.description || '-'}}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <span class="operation_btn" @click="editPost(scope.row)">编辑</span>
                <span class="operation_btn"   @click="deletePost(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
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
     <!-- 新增弹框 -->
    <el-dialog
      :title="addVersionTitle"
      :visible.sync="addVersionVisible"
      width="560px"
      @close="onCancle('addForm')"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm"  :rules="addRules" label-width="120px">
        <el-form-item label="名称" prop="postName">
          <el-input maxlength="10" v-model="addFormData.postName" class="wid260"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="postType">
          <el-select v-model="addFormData.postType" placeholder="请选择" class="wid260">
            <el-option label="节假日" :value="1"></el-option>
            <el-option label="敏感日" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="postStartDate" >
          <el-date-picker
            v-model="addFormData.postStartDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            :picker-options="pickerOptionsStart"
            placeholder="选择日期" class="wid260"  >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="postEndDate">
          <el-date-picker
            v-model="addFormData.postEndDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            :picker-options="pickerOptionsEnd"
            placeholder="选择日期" class="wid260" >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述" prop="postDes">
          <el-input type="textarea" maxlength="100" show-word-limit :rows="5" v-model="addFormData.postDes" class="wid300" ></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('addForm')">取 消</el-button>
        <el-button
          type="primary"
          class="btn-save"
          @click="onConfirm('addForm')"
          :loading="versionLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editVersionVisible"
      width="560px"
      @close="onCancle('editForm')"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="editForm"   :rules="addRules"  label-width="120px">
        <el-form-item label="名称" prop="postName" >
          <el-input maxlength="10" v-model="addFormData.postName" class="wid260"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="postType">
          <el-select v-model="addFormData.postType" placeholder="请选择" class="wid260">
            <el-option label="节假日" :value="1"></el-option>
            <el-option label="敏感日" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="postStartDate" >
          <el-date-picker
            v-model="addFormData.postStartDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
             :picker-options="pickerOptionsStart"
            placeholder="选择日期" class="wid260">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="postEndDate">
          <el-date-picker
            v-model="addFormData.postEndDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            :picker-options="pickerOptionsEnd"
           
            placeholder="选择日期" class="wid260">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述" prop="postDes">
          <el-input type="textarea" :rows="5"  maxlength="100" show-word-limit  v-model="addFormData.postDes" class="wid300"></el-input>
        </el-form-item>
        
        
      </el-form>
      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="onCancle('editForm')">取 消</el-button>
        <el-button
          type="primary"
          class="btn-save"
          @click="onConfirm('editForm')"
          :loading="versionLoading"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {getSenDayList, createSenDay,putSenDay,delSenDay} from "@/views/index/api/onDuty/api.zr.js";
// import { getPostionList, getFeedbackExport } from "@/views/index/api/on/api.zr.js";
export default {
  name: "jobManagement",

  components: { visBreadcrumb },
  data() {
    
    return {
       pickerOptionsStart: {
          disabledDate: time => {
            return time.getTime() < new Date().getTime() - 24*60*60*1000;
          }
      },
      pickerOptionsEnd: {
          disabledDate: time => {
          let beginDateVal = this.addFormData.postStartDate;
          if (beginDateVal) { 
            return (time.getTime()<new Date(beginDateVal).getTime()) ;
          }else{
            return time.getTime() < new Date().getTime() - 24*60*60*1000;
          }
        }
      },
      // 面包屑导航数据
      breadcrumbData: [{ name: "系统设置" }, { name: "敏感日设置" }],
      types:{
        1:'节假日',
        2:'敏感日',
      },
      formInline: {
        date: null,
        opUserId: "",
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      postionList: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 20,
      addVersionTitle:'新增',
      addVersionVisible:false,
      editVersionVisible:false,
      versionLoading: false,
      addRules: {
        postName: [
          { required: true, message: "该项必填", trigger: "blur" }
          
        ],
        postType: [
          { required: true, message: "该项必填", trigger:"change"},
        ],
        postStartDate: [
          { required: true, message: "该项必填", trigger:"blur"},
        ],
        postEndDate: [
          { required: true, message: "该项必填", trigger:"blur"},
        ],
      },
      addFormData: {
        postName: "",
        postType: "",
        postStartDate: "",
        postEndDate: "",
        postDes: "",
      },
      selectList:[]
    };
    
  },
  mounted() {
    this.getSenDayList();
  },
  methods: {
    //查询特殊日子
    getSenDayList(d){
      getSenDayList(d).then(res=>{
        if(res && res.code === '00000000'){
          // res.data.list.map((el,i)=>{
          //   el.index = i
          // })
          this.postionList = res.data.list
          this.pageNum= res.data.pageNum
          this.total= res.data.total
        }
      }).catch(er=>{
        console.error(er);
      })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onPageChange(1);
    },
     //新增按钮事件方法
    showAdd(){
      this.addVersionVisible = true;
      this.$nextTick(()=>{
      this.$refs['addForm'].clearValidate()
      })
      this.addVersionTitle = "新增";
      this.addFormData= {
        postName: "",
        postType: "",
        postStartDate: "",
        postEndDate: "",
        postDes: "",
      }
      
    },
    // 编辑
    editPost(row){
      this.editVersionVisible = true;
      this.$nextTick(()=>{
        this.$refs['editForm'].clearValidate()
      })
      this.addFormData= {
        postType: row.type,
        postStartDate: row.startTime,
        postEndDate: row.endTime,
        postDes: row.description,
        postName: row.name,
        uid:row.uid
      }
    },
  
    // 删除二次确认
    deletePost(row){
      // console.log(row)
      this.$confirm('您确认要删除信息吗？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
         
          let params={
            uid :row.uid
          }
          this.delSenDay(params)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    //删除
    delSenDay(d){
      delSenDay(d).then(res=>{
        if(res && res.code==="00000000"){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.onSubmit()
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
      //取消
    onCancle(formName) {
      this.$refs[formName].clearValidate()
      // console.log(formName)
      this.addVersionVisible = false;
      this.editVersionVisible = false;
      
    },
    //新添提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log("验证通过"); //
          let a = new Date(this.addFormData.postStartDate).getTime()
          let b = new Date(this.addFormData.postEndDate).getTime()
          if(b<a){
            this.$message({
              type:'warning',
              message:'结束时间不能小于开始时间'
            })
            this.versionLoading = false;
            return
          }
          if(!this.addFormData.postName.trim()){
            this.$message({
              type:'warning',
              message:'名称不能为空'
            })
            this.versionLoading = false;
            return
          }
          if(this.addVersionVisible){
            this.createSenDay({
              "name": this.addFormData.postName,
              "endTime": this.addFormData.postEndDate.replace("00:00:00","23:59:59"),
              "startTime": this.addFormData.postStartDate,
              "description": this.addFormData.postDes,
              "type": this.addFormData.postType
            })
          }else if(this.editVersionVisible){
            this.putSenDay({
              "name": this.addFormData.postName,
              "endTime": this.addFormData.postEndDate.replace("00:00:00","23:59:59"),
              "startTime": this.addFormData.postStartDate,
              "description": this.addFormData.postDes,
              "type": this.addFormData.postType,
              "uid":this.addFormData.uid
            })
          }
          this.editVersionVisible = false;
          this.addVersionVisible = false;
          this.versionLoading = false;
        } else {
          _this.versionLoading = false;
        }
      });
    },
    //创建新的特殊日子
    createSenDay(d){
      createSenDay(d).then(res=>{
        if(res && res.code === '00000000'){
         this.$message({
            type:'success',
            message:'新增成功'
          })
          this.onSubmit()
        }
      }).catch(er=>{
        console.error(er);
      })
    },
    // 编辑提交
    putSenDay(d){
      putSenDay(d).then(res=>{
        if(res && res.code === '00000000'){
         this.$message({
            type:'success',
            message:'编辑成功'
          })
          this.onPageChange(this.pageNum)
        }
      }).catch(er=>{
        console.error(er);
      })
    },
    //查询
    onSubmit() {
      this.onPageChange(1);
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getSenDayList();
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-textarea .el-input__count{
  background: none;
}
/deep/ .el-dialog__body{
  padding-bottom: 0px;
  padding-top: 10px;
}
.program-up {
  height: calc(100% - 60px );
  position: relative;
}
.rightButton{
  position: absolute;
  right: 0;
}
.addDialog{
  border-radius:15px;
}
.wid300{
  width: 320px;
}
.wid260{
  width: 320px;
}
</style>