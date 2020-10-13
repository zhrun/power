/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:04 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-24 14:34:26
 */
<template>
  <div class="program-up">
    <!-- 面包屑导航 -->
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <!-- 筛选条件 -->
        <div class="boxBoder">
          <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline" @submit.native.prevent>
           
           
            <el-form-item label="搜索" prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="级别名称" @keyup.enter.native="onSubmit" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            <el-form-item class="rightButton">
              <el-button @click="showAdd()"  icon="iconfont iconbianzu12"> 新增</el-button>
              <el-button @click="deleteList" icon="iconfont iconbianzu13"> 删除</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="FeedbackExport">导出</el-button>
            </el-form-item> -->
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="" type="selection" ddisabled='true' :selectable='checkboxT'>

            </el-table-column>
            <!-- <el-table-column label="序号" type="index"></el-table-column> -->
            <el-table-column label="级别"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.name || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="位次" >
              <template slot-scope="scope">
                <span>{{scope.row.sortId || '-'}}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                <span class="operation_btn" v-if="scope.row.isUserCreated == 1" @click="editPost(scope.row)">编辑</span>
                <span class="disable" @click="noClick" v-else>编辑</span>
                <span class="operation_btn"  v-if="scope.row.isUserCreated == 1"  @click="deletePost(scope.row)">删除</span>
                <span class="disable" @click="noClick" v-else>删除</span>
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
      width="400px"
      @close="onCancle('addForm')"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="级别名称" prop="postName">
          <el-input maxlength="10" v-model="addFormData.postName" placeholder="请输入级别名称"></el-input>
        </el-form-item>
        <el-form-item label="位次" prop="position">
          <el-input v-model="addFormData.position"  :maxlength="6" placeholder="请输入位次"></el-input>
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
      width="400px"
      @close="onCancle('addForm')"
      :close-on-click-modal="false">
      <el-form :model="addFormData" ref="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="级别名称" prop="postName">
          <el-input maxlength="11" v-model="addFormData.postName" placeholder="请输入级别名称"></el-input>
        </el-form-item>
        <el-form-item label="位次" prop="position">
          <el-input v-model="addFormData.position"  :maxlength="6" placeholder="请输入位次"></el-input>
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
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {getPostionList, createUnitJob,putUnitJob,delUnitJob,delUnitJobList,getSortId} from "@/views/index/api/onDuty/api.zr.js";
// import { getPostionList, getFeedbackExport } from "@/views/index/api/on/api.zr.js";
export default {
  name: "jobManagement",

  components: { visBreadcrumb },
  data() {
    var validateSolt = (rule, value, callback) => {
        if (!value) {
            callback(new Error('请输入位次'));
        } else {
          // let reg = /^([1-9][0-9]{0,2})(\.\d{1,2})?$/
            let reg = /^(?!0)\d{1,3}(\.\d{1,2})?$/;
            if (!reg.test(value)) {
                callback(new Error('位次为大于等于1小于1000的数字且最多两位小数'));
            } else {
                callback();
            }
        }
    };
    return {
     
      // 面包屑导航数据
      breadcrumbData: [{ name: "系统设置" }, { name: "级别管理" }],
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
          { required: true, message: "请输入级别名称", trigger: "blur" }
          
        ],
        position: [
          { required: true, message: "请输入位次", trigger:"blur"},
          { validator: validateSolt, trigger: 'blur' }
        ]
      },
      addFormData: {
        position: "",
        postName: ""
      },
      selectList:[],
      maxId:''
    };
    
  },
  mounted() {
    this.getPostionList({
      "where.type":2
    });
  },
  methods: {
    noClick(){
      this.$message({
        type:'warning',
        message:'系统初始化数据禁止操作'
      })
    },
    //查询当前最大位次
    getSortId(){
      getSortId({
        type:2
      }).then(res=>{
        if(res && res.code ==='00000000'){
          this.maxId = res.data
          this.addFormData= {
            position: this.maxId,
            postName: ""
          }
        }
      })
    },
  //表格头select 是否禁用控制
    checkboxT(row){
      if(row.isUserCreated == 1){
        return 1
      }else {
        return 0
      }
    },
    //列表查询
    getPostionList(d){
      getPostionList(d).then(res=>{
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
      this.addVersionTitle = "新增";
      this.getSortId()
    },
    // 编辑
    editPost(row){
      this.editVersionVisible = true;
      this.addFormData= {
        position: row.sortId,
        postName: row.name,
        uid:row.uid
      }
    },
    //批量删除前
    deleteList(){
      if(this.selectList.length == 0){
        this.$message({
          type:'warning',
          message:'请先勾选要操作的信息'
        })
      }else{
        let first = []
        this.selectList.forEach(el=>{
          first.push(el.uid)
        })
        this.$confirm('您确认要删除信息吗？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.delUnitJobList({
            uids:first.toString()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        
        
        
      }
    },
    //选中事件
    handleSelectionChange(v){
      this.selectList =v 
    },
    //批量刪除
    delUnitJobList(d){
      delUnitJobList(d).then(res=>{
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
          this.delUnitJob(params)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    //删除 
    delUnitJob(d){
      delUnitJob(d).then(res=>{
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
      if (this.editVersionVisible) {
        this.editVersionVisible = false;
      }
      if (this.addVersionVisible) {
        this.addVersionVisible = false;
      }
    },
    //新添提交
    onConfirm(formName) {
      let _this = this;
      // console.log(formName)
      _this.versionLoading = true;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          if(!this.addFormData.postName.trim()){
            this.$message({
              type:'warning',
              message:"名称不能为空格"
            })
            _this.versionLoading = false;
            this.addFormData.postName =this.addFormData.postName.trim()
            return
          }
          if(this.addVersionVisible){

            this.createUnitJob({
              "name": this.addFormData.postName,
              "sortId": this.addFormData.position,
              "type": 2
            })
          }else if(this.editVersionVisible){
            this.putUnitJob({
              "name": this.addFormData.postName,
              "sortId": this.addFormData.position,
              "type": 2,
              "uid":this.addFormData.uid
            })
          }
         
          this.versionLoading = false;
        } else {
          _this.versionLoading = false;
        }
      });
    },
    //新建
    createUnitJob(d){
      createUnitJob(d).then(res=>{
        if(res && res.code === '00000000'){
         this.$message({
            type:'success',
            message:'新增成功'
          })
          this.addVersionVisible = false;
          this.onSubmit()
        }
      }).catch(er=>{
        console.error(er);
      })
    },
    // 编辑提交
    putUnitJob(d){
      putUnitJob(d).then(res=>{
        if(res && res.code === '00000000'){
         this.$message({
            type:'success',
            message:'编辑成功'
          })
           this.editVersionVisible = false;
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
      this.getPostionList({
        "where.type":2,
        'pageNum':this.pageNum,
        "where.name":this.formInline.keyword  || null

      });
    },
  }
};
</script>

<style lang="scss" scoped>
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
</style>