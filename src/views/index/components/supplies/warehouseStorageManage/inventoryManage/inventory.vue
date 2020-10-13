<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
          <el-form-item label="创建日期" prop="dateTime1">
               <el-date-picker
              style="width:260px"
                v-model="formInline.dateTime1"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                :clearable="false"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划盘点日期" prop="dateTime2">
               <el-date-picker
              style="width:260px"
                v-model="formInline.dateTime2"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                :clearable="false"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formInline.status" style="width: 120px">
                  <el-option label="待发布" value="1"></el-option>
                  <el-option label="待盘点" value="2"></el-option>
                  <el-option label="盘点中" value="3"></el-option>
                  <el-option label="已盘点" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="盘点人员" prop="name">
              <el-select v-model="formInline.name" filterable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.userUid"
                  :label="item.userName"
                  :value="item.userUid">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="盘点单名称" prop="keyword">
            <el-form-item prop="keyword">
              <el-input v-model.trim="formInline.keyword" placeholder="请输入盘点单名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="showAdd()">新增</el-button>
          <el-button  @click="getExport" > 导出</el-button>
        </div>
        <div class="tables">
          <el-table
            ref="versionTable"
            :data="problemData"
            tooltip-effect="dark"
            class="eventtables"
            v-loading="loading"
            style="width:99%"
          >
            <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
            <el-table-column label="盘点单编号" width="180" show-overflow-tooltip prop="checkListCode"></el-table-column>
            <el-table-column label="盘点单名称"  width="150" show-overflow-tooltip  prop="checkListName"></el-table-column>
            <el-table-column label="计划盘点日期">
              <template slot-scope="scope">
                <span v-if="scope.row.checkStartTime">{{scope.row.checkStartTime + '-' + scope.row.checkEndTime}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="盘点人员" width="120" prop="checkerName">
              <template slot-scope="scope">
                <span >{{ scope.row.checkerName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="盘点范围"  prop="checkScope" show-overflow-tooltip>
              <template slot-scope="scope">
                <span >{{ scope.row.checkScope || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态"  width="80">
              <template slot-scope="scope">
                <span >{{ status[scope.row.statusFlag]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间"  prop="createTime"></el-table-column>
            <el-table-column label="操作" width="190"  fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="toPage(scope.row)">查看</span>
                <span class="operation_btn" v-if="scope.row.statusFlag==1" @click="editItem(scope.row)">发布</span>
                <span class="operation_btn" v-if="scope.row.statusFlag==1" @click="toEdit(scope.row)">编辑</span>
                <!--  v-if="scope.row.statusFlag==4" -->
                <span class="operation_btn" v-if="scope.row.statusFlag==4" @click="toCope(scope.row)" >复用</span>
                <span class="operation_btn" @click="delItem(scope.row.uid)" v-if="scope.row.statusFlag==1 || scope.row.statusFlag==2">删除</span>
              
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
        <el-button type="primary" @click="dialogChange = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { queryCheckList, deleteCheck ,updatePublish,queryWareUserList} from "@/views/index/api/supplies/api.zr.js";
import { exportFn,formatDate } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "盘点管理" }],
      formInline: {
        keyword: null,
        dateTime1:[],
        dateTime2:[],
        status:'',
        name:''
      },
      userList:[],
        status:{
          1:'待发布',
          2:'待盘点',
          3:'盘点中',
          4:'已盘点',
        },
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      changeForm: {
        name: "",
        phone: "",
      },
      formRule: {
        name: [{ required: true, message: "此项为必选项", trigger: "blur" }],
        phone: [{ required: true, message: "此项为必选项", trigger: "blur" }],
      },
      dialogChange: false,
    };
  },
  mounted() {
    
    this.queryWareUserList()
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.pageNum = 1
      this.formInline.keyword = null
      this.queryCheckList()
      
    }else{
      this.$route.meta.isBack = false;
      let data ={
        "where.createStartTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[0],
        "where.createEndTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[1],
        "where.checkStartTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[0],
        "where.checkEndTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[1],
        "where.checkerUid":this.formInline.name || null,
        "where.statusFlag":this.formInline.status || null,
        "where.checkListName":this.formInline.keyword || null,
        pageNum:this.pageNum
      }
      this.queryCheckList(data)
      // this.onPageChange(this.pageNum);
     /*列表重新加载*/
    }
  },
  methods: {
    //查询所有员工用户
    async queryWareUserList(){
      let wUid = JSON.parse(localStorage.getItem("current_user_warehouse_list"))[0]
      let d={
        'roleId':"64I8Eemfyr38rwIaIUP96Y",
        'warehouseUid':wUid.uid
      }
       const {code, data } = await queryWareUserList(d)
       if(code ==='00000000'){
        this.userList = data
      }
    },
    //查询列表
    async queryCheckList(d){
      const {code, data } = await queryCheckList(d)
      if(code ==='00000000'){
        this.problemData = data.list
        this.total=data.total
      }
    },
    toPage(obj) {
      this.$router.push({
        name: "inventoryDetail",
        query:{
          uid:obj.uid
        }
      });
    },
    toCope(obj) {
      this.$router.push({
        name: "addInventory",
        query:{
          uid:obj.uid
        }
      });
    },
    toEdit(obj) {
      this.$router.push({
        name: "addInventory",
        query:{
          edit:obj.uid
        }
      });
    },
    closed() {
      this.$refs.formRule.clearValidate();
      this.dialogChange = false;
    },
    showAdd() {
      this.$router.push({
        name: "addInventory",
      });
    },
    editItem(obj){
      this.$confirm('是否发布盘点单任务，发布后，不可撤回？', '发布', {
        confirmButtonText: '发布',
        cancelButtonText: '取消',
      }).then(() => {
        this.updatePublish({
          uid:obj.uid
        })  
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
    },
    //删除二次确认
    delItem(uid){
      this.$confirm('您确认要删除此信息吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:uid
        }
        this.deleteCheck(params)      
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //删除
    async deleteCheck(d){
      const {code } = await deleteCheck(d)
      if(code ==='00000000'){
        this.$message({
          type:'success',
          message:'删除成功'
        })
        this.pageNum = 1
        this.queryCheckList()
      }
      
    },
     async updatePublish(d){
       try{
         const {code } = await updatePublish(d)
         if(code === "00000000"){
           this.$message({
             message: `修改成功`,
             type: "success",
           });
           this.pageNum = 1
           this.queryCheckList()
         }
       }catch (e){
        if(e.code==='10060008'){
           this.$confirm(e.viewMsg+'发布后，不可撤回。', '确认', {
               confirmButtonText: '发布',
               cancelButtonText: '取消',
             }).then(() => {
               d.publishFlag = 1
               this.updatePublish(d)      
             }).catch(() => {
               this.$message({
                 type: 'info',
                 message: '已取消'
               });          
             });
         }
       }
    },
    onSubmit() {
      let d ={
        "where.createStartTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[0],
        "where.createEndTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[1],
        "where.checkStartTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[0],
        "where.checkEndTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[1],
        "where.checkerUid":this.formInline.name || null,
        "where.statusFlag":this.formInline.status || null,
        "where.checkListName":this.formInline.keyword || null,
      }
      this.pageNum = 1
      this.queryCheckList(d)
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      let d ={
        "where.createStartTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[0],
        "where.createEndTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[1],
        "where.checkStartTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[0],
        "where.checkEndTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[1],
        "where.checkerUid":this.formInline.name || null,
        "where.statusFlag":this.formInline.status || null,
        "where.checkListName":this.formInline.keyword || null,
      }
      d.pageNum = this.pageNum
      this.queryCheckList(d)
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.queryCheckList()
    },
    
    //导出
    getExport(){
       /**
     * 导出
     * @param {*} exportUrl 导出的url
     * @param {*} params  附带的参数 
     * @param {*} fileName 导出的文件标题
     * @param {*} extName 导出的后缀名
     */
    
      // let key = this.formInline.user || null
      let exportUrl = ajaxCtx.rel+'/muem/resource/storage-check-service/export'
      let params ={
        "where.createStartTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[0],
        "where.createEndTime":this.formInline.dateTime1.length==0?null:this.formInline.dateTime1[1],
        "where.checkStartTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[0],
        "where.checkEndTime":this.formInline.dateTime2.length==0?null:this.formInline.dateTime2[1],
        "where.checkerUid":this.formInline.name || null,
        "where.statusFlag":this.formInline.status || null,
        "where.checkListName":this.formInline.keyword || null,
        "pageSize":0
      }
    
      // exportFn(exportUrl,params,fileName,extName)
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的盘点单数据.xls`
      exportFn(exportUrl, params, null, null, downloadFullName)
    }
  },
};
</script>
<style lang="scss" scoped>
.tables {
  .btn {
    color: $main_color;
    cursor: pointer;
    padding-right: 5px;
  }
  margin-top: 10px;
  /deep/ .el-table__header thead tr th {
    background: rgba(240, 242, 245, 1);
    color: $font_333;
    &:first-child {
      border-top-left-radius: 6px;
    }
    &:nth-child(6) {
      border-top-right-radius: 6px;
    }
  }
}
/deep/ .el-dialog__body {
  padding: 20px;
  padding-top: 10px;
}
/deep/ .el-dialog .el-dialog__header .el-dialog__title {
  font-weight: normal;
}

.rightButton {
  position: absolute;
  right: 0;
}
</style>
