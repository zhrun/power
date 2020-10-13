/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:19 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-17 17:08:19
 */
<template>
  <div class="dutylist">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      <el-scrollbar class="scroll" >
      <div class="flex">
        <div class="fleft">
          <el-form :inline="true" :model="formInline"  ref="ruleForm" class="demo-form-inline">
            <el-form-item label="供应商">
               <el-input v-model="formInline.user" placeholder="请输入供应商名称/编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="onSubmit">搜索</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="fright">
          <el-button type="default" icon="iconfont iconbianzu12" @click="toAddpage" class="min"> 新增</el-button>
          <el-button type="default" icon="iconfont iconbianzu26" class="min" @click="inputDuty"> 导入</el-button>
          <el-button type="default" @click="getExport" icon="iconfont iconbianzu15" class="min"> 导出</el-button>
        </div>
        
          
      </div>
      <div class="tables" >
        <el-table :data="doneData" class="eventtables">
          <el-table-column   label="供应商编号"  prop="supplierCode" width="150"></el-table-column>
          <el-table-column  label="供应商名称" prop="supplierName"  width="160">
          </el-table-column>
          <el-table-column   label="联系人" prop="contactPerson" width="160">
            <template slot-scope="scope">
              {{scope.row.contactPerson || '-'}}
            </template>
          </el-table-column>
          <el-table-column   show-overflow-tooltip prop="contactPhone" label="联系电话" >
            <template slot-scope="scope">
              {{scope.row.contactPhone || '-'}}
            </template>
          </el-table-column>
          <el-table-column  show-overflow-tooltip prop="address" label="联系地址" >
            <template slot-scope="scope">
              {{scope.row.address || '-'}}
            </template>
          </el-table-column>
          <el-table-column label="状态"  >
            <template slot-scope="scope">
              <span v-if="scope.row.useFlag==1">启用</span>
              <span v-if="scope.row.useFlag==0">禁用</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="200" >
            <template slot-scope="scope">
              <span class="operation_btn" @click="toDetail(scope.row)">查看</span>
              <span class="operation_btn" v-if="scope.row.useFlag==0" @click="openStatus(scope.row)">启用</span>
              <span class="operation_btn" @click="closeStatus(scope.row)" v-if="scope.row.useFlag==1">禁用</span>
              <span class="operation_btn" @click="toEditPage(scope.row.uid)">编辑</span>
              <span class="operation_btn" @click="delItem(scope.row.uid)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination  @current-change="onPageChange" :current-page.sync="pageNum" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
      </el-scrollbar>
    </div>
  
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { querySupplierPageList ,updateSupplier, deleteSupplier} from "@/views/index/api/supplies/api.zr.js";
import { exportFn,formatDate } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "基础信息"}, {name: "供应商管理"}],
      formInline:{
        user:''
      },
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      date1:'',
      postList:[],
      doneData:[],
      active:1,
      keyword:'',
      pageNum:1,
      pageSize:10,
      total:0,
      modyfiDuty:true,
      dialogFormVisible:false,
      selectList:[],
      longs:[],
      hasOver:false
      // checked:false
    };
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.pageNum = 1
      this.formInline.user = null
      this.querySupplierPageList({})
    }else{
      this.$route.meta.isBack = false;
       let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.keyword':this.formInline.user || null
      }
      this.querySupplierPageList(data)
     /*列表重新加载*/
    }
  },
  mounted() {
    this.querySupplierPageList({})
    // this.init()
  },
  methods: {
    async querySupplierPageList(d){
      d.orderBy="create_time"
      d.order="desc"
       const {code, data } = await querySupplierPageList(d)
       if(code ==='00000000'){
        this.doneData = data.list
        this.total=data.total
      }
    },
    toEditPage(d){
      this.$router.push({
        name: "editSupplier",
        query:{uid:d}
      });
    },
    toAddpage(){
      this.$router.push({
        name: "addSupplier",
      });
    },
    openStatus(obj){
      this.updateSupplier({
        uid:obj.uid,
        supplierName:obj.supplierName,
        useFlag:'1'
      })
    },
    closeStatus(obj){
      this.updateSupplier({
        uid:obj.uid,
        supplierName:obj.supplierName,
        useFlag:'0'
      })
    },
    async updateSupplier(d){
      const {code } = await updateSupplier(d)
      if(code === "00000000"){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.querySupplierPageList({
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.keyword':this.formInline.user || null
      })
      }
    },
    //重置
    resetForm() {
      this.formInline.user=''
      this.pageNum = 1;
      this.querySupplierPageList({})
    },
    toDetail(obj){
      this.$router.push({
        name:'detailSupplier',
        query:{
          uid:obj.uid
        }
      })
    },
  
    //添加跳转方法
    inputDuty(){
      this.$router.push({name:'inputSupplier'})
    },
    
    //搜索提交 
    onSubmit(){
      this.pageNum = 1
      let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.keyword':this.formInline.user
      }
      this.querySupplierPageList(data)
    },
    
    //分页方法
    onPageChange(v){
      this.pageNum = v
      let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
      }
      this.querySupplierPageList(data)
    },
    //删除值班二次确认
    delItem(uid){
      this.$confirm('您确认要删除此信息吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:uid
        }
        this.deleteSupplier(params)      
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //删除值班
    deleteSupplier(d){
      deleteSupplier(d).then(res=>{
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
   
    //导出
    getExport(){
       /**
     * 导出
     * @param {*} exportUrl 导出的url
     * @param {*} params  附带的参数 
     * @param {*} fileName 导出的文件标题
     * @param {*} extName 导出的后缀名
     */
    
      let key = this.formInline.user || null
      let exportUrl = ajaxCtx.rel+'/muem/resource/supplier-service/export'
      let params = {
        'where.keyword':key,
        'orderBy': 'create_time',
        'order': 'desc'
      }
      const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的供应商数据.xls`
      exportFn(exportUrl, params, null, null, downloadFullName)
    }
    
  }
};
</script>
<style lang="scss" scoped>
  .editBox{
    background: #ffffff;
    border-radius: 15px;
    padding: 20px;
    height: calc(100% - 60px);
    .flex{
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      height: auto;
    }
    /deep/ .el-form--inline .el-form-item{
      margin-bottom: 0px;
    }
   
   
  }
  /deep/ .el-button.min{
    padding: 0px 10px;
    min-width: 50px;
  }
  /deep/ .el-dialog__footer{
    text-align: center;
  }
  /deep/ .el-button.min:focus, .el-button.min:hover{
    background: #5458FD;
    border-color: #5458FD;
    color: #ffffff;
  }

.tables{
  .btn{
    color: $main_color;
    cursor: pointer;
    padding-right: 5px;
  }
  margin-top: 20px;
  /deep/ .el-table__header thead tr th{
    background: rgba(240,242,245,1);
    color: $font_333;
    &:first-child{
      border-top-left-radius: 6px;
    }
    &:nth-child(9) {
      border-top-right-radius: 6px;
    }
  }
}
</style>


