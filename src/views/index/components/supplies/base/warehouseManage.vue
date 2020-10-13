<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
          <el-form-item label="仓库">
            <el-form-item prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="请输入仓库编号/名称"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item class="rightButton">
            <el-button @click="showAdd()" icon="iconfont iconbianzu12"> 新增</el-button>
          </el-form-item>
        </el-form>
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
            <el-table-column label="仓库编号" width="120" prop="warehouseCode"></el-table-column>
            <el-table-column label="仓库名称" width="180" prop="warehouseName"  show-overflow-tooltip></el-table-column>
            <el-table-column label="位置"  prop="address" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="责任人" width="120" prop="principal"></el-table-column>
            <el-table-column label="联系电话" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.contactPhone || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right">
              <template slot-scope="scope">
                <span class="operation_btn" @click="seeDetail(scope.row)">查看</span>
                <span class="operation_btn" @click="changeSon(scope.row)">更换责任人</span>
                <span class="operation_btn" @click="editDetail(scope.row)">编辑</span>
                <span class="operation_btn" @click="delObj(scope.row)">删除</span>
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
    <el-dialog title="更换责任人" :visible.sync="dialogChange" width="400px" :before-close="closed">
      <el-form :model="changeForm" ref="formRule" :rules="formRule">
        <el-form-item label="责任人姓名" label-width="120px" prop="name">
          <el-input v-model="changeForm.name" autocomplete="off" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" label-width="120px" prop="phone">
          <el-input v-model="changeForm.phone" autocomplete="off" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="changeSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {  queryWarehousePageList,deleteWarehouse,updatePrincipal,checkUserRename} from "@/views/index/api/supplies/api.zr.js";
// import { getIssueInstructionDetail } from "@/views/index/api/onDuty/api.ps.js";
// import { getLast3Month,exportFn } from "@/utils/util.js";
// import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    var checkMobile =async (rule, value, callback) => {
      if (value === "") {
        callback(new Error());
      } else {
        if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          if (this.changeForm.phone !== "") {
            let a = await this.checkUserRename({
              userMobile:value,
              proKey:this.userInfo.proKey 
            })
            if(!a){
              callback();
            }else{
              if(value==this.editObj.contactPhone){
                callback();
              }else{
                callback(new Error("该手机号账户已存在"));
              }
            }
            // this.$refs.ruleForm.validateField('checkPass');
            
          }
        }
      }
    };
    return {
      breadcrumbData: [{ name: "基础信息" }, { name: "仓库管理" }],
      formInline: {
        keyword: null,
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
        uid:'',
        name: "",
        phone: "",
      },
      formRule: {
        name: [{ required: true, message: "该项不可为空", trigger: "blur" }],
        phone: [{ required: true, message: "该项不可为空", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }],
      },
      dialogChange: false,
      editObj:null
    };
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.pageNum = 1
      this.formInline.keyword = null
      this.queryWarehousePageList()
      
    }else{
      this.$route.meta.isBack = false;
      let data = {
        "where.keyword":this.formInline.keyword || null,
        pageNum:this.pageNum
      }
      this.queryWarehousePageList(data)
      // this.onPageChange(this.pageNum);
     /*列表重新加载*/
    }
  },
  mounted() {
    // this.queryWarehousePageList()
  },
  methods: {
    async checkUserRename(d){
      const {data} = await checkUserRename(d)
      return data
    },
    seeDetail(obj){
      this.$router.push({
        name:'detailWarehouse',
        query:{uid:obj.uid}
      })
    },
    editDetail(obj){
      this.$router.push({
        name:'editWarehouse',
        query:{uid:obj.uid}
      })
    },
    changeSon(obj) {
      this.editObj= obj
      this.changeForm.uid=obj.uid
      this.changeForm.name=obj.principal
      this.changeForm.phone=obj.contactPhone
      this.dialogChange = true
    },
    changeSubmit(){
       this.$refs['formRule'].validate((valid) => {
          if (valid) {
            this.updatePrincipal(this.changeForm)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    closed() {
      this.$refs.formRule.clearValidate();
      this.$refs['formRule'] && this.$refs['formRule'].resetFields();
      this.dialogChange = false;
    },
    showAdd() {
      this.$router.push({
        name: "addWarehouse",
      });
    },
    //查询列表
    async queryWarehousePageList(d){
      const {code, data } = await queryWarehousePageList(d)
      if(code ==='00000000'){
        this.problemData = data.list
        this.total=data.total
      }
    },
    delObj(obj){
      this.$confirm(`是否确认删除该仓库信息？`, "提示")
        .then(() => {
          this.deleteWarehouse(obj);
        })
        .catch();
      
    },
    async deleteWarehouse(d){
      const {code } = await deleteWarehouse({
        uid:d.uid
      })
      if(code === "00000000"){
        this.$message({
          message: `删除成功`,
          type: "success",
        });
      }
      this.resetForm('ruleForm')
    },
    async updatePrincipal(d){
      const {code } = await updatePrincipal({
        uid:d.uid,
        principal:this.changeForm.name,
        contactPhone:this.changeForm.phone
      })
      if(code === "00000000"){
      
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.queryWarehousePageList()
        this.closed()
      }
    },
    onSubmit() {
      let data = {
        "where.keyword":this.formInline.keyword || null
      }
      this.queryWarehousePageList(data)
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.queryWarehousePageList({
        pageNum:page,
        "where.keyword":this.formInline.keyword || null
      })

    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.queryWarehousePageList()
    },
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
<style >
  .el-table__fixed-right{
    height: 100% !important;
  }
</style>
