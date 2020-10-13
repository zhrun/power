<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
          <el-form-item label="预警类型" prop="warningType">
            <el-select v-model="formInline.warningType" style="width: 130px">
              <el-option label="到期提醒" value="1"></el-option>
              <el-option label="过期预警" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物资名称">
            <el-form-item prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="请输入物资编号/名称"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div> <el-button type="primary" @click="getExport()" :loading="btnloading"> 导出</el-button>
        <!-- <div class="qrcode" ref="qrCodeUrl"></div> -->
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
            <el-table-column label="物资名称" show-overflow-tooltip prop="resourceName"></el-table-column>
            <el-table-column label="编号" width="180" prop="resourceCode"></el-table-column>
            <el-table-column label="规格型号" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.model || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="品牌" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.brand || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="计量单位" width="100" prop="measuringUnitName">
              <template slot-scope="scope">
                <span>{{scope.row.measuringUnitName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="入库单编号" width="120" prop="warehousingCode"></el-table-column>
            <el-table-column label="库存总数" width="120" prop="storage"></el-table-column>
            <el-table-column label="保质期" width="120" >
              <template slot-scope="scope">
                <span>{{scope.row.shelfLifeValueStr || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" width="120" prop="productionDate"></el-table-column>
            <el-table-column label="有效期至" width="120" prop="expireDate"></el-table-column>
            <el-table-column label="到/过期天数" width="120" prop="overdueDay"></el-table-column>
            <el-table-column label="预警类型" width="120" prop="warningTypeName">
            </el-table-column>
            <el-table-column label="存放库位" width="180" prop="locationName">
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="onPageChange"
            :current-page.sync="pageNum"
            :page-sizes="[10, 20, 30, 50]"
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
import { queryWarningList } from "@/views/index/api/supplies/api.zr.js";
import { exportFn,formatDate} from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import _debounce from "lodash/debounce";
// import QRCode from 'qrcodejs2'
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" }, { name: "保质期预警" }],
      formInline: {
        keyword: null,
        warningType:''
      },
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      problemData: [],
      warningType:{
        1:'过期预警',
        2:'过期预警'
      },
      loading: false,
      btnloading: false,
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
      isFromMsg:true
    };
  },
  mounted() {
    
    this.onSubmit()
    // this.creatQrCode()
  },
  methods: {
    // creatQrCode() {
    //     var qrcode = new QRCode(this.$refs.qrCodeUrl, {
    //         text: '{name:zhourun}', // 需要转换为二维码的内容
    //         width: 100,
    //         height: 100,
    //         colorDark: '#000000',
    //         colorLight: '#ffffff',
    //         correctLevel: QRCode.CorrectLevel.H
    //     })
    // },
    //导出
    getExport:_debounce(function(){
       /**
     * 导出
     * @param {*} exportUrl 导出的url
     * @param {*} params  附带的参数 
     * @param {*} fileName 导出的文件标题
     * @param {*} extName 导出的后缀名
     */
      this.btnloading = true
      // let key = this.formInline.user || null
      let exportUrl = ajaxCtx.rel+'/muem/resource/storage-service/expiry-date-warning-page/export'
      let params = {
         "where.warningType":this.formInline.warningType || null,
        "where.resourceName":this.formInline.keyword || null
      }
    
      // exportFn(exportUrl,params,fileName,extName)
       const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}导出的保质期预警数据.xls`
      exportFn(exportUrl, params, null, null, downloadFullName)
      this.btnloading=false
    },500),
   
    async queryWarningList(d){
       const {code, data } = await queryWarningList(d) 
       if(code ==='00000000'){
        this.problemData = data.list
        this.total=data.total
        if(this.problemData.length==0 && this.isFromMsg && this.$route.query.uid){
          this.$message({
            message: "该记录已被消除",
            type: 'warning'
          })
        }
        this.isFromMsg=false
      }
    },
    closed() {
      this.$refs.formRule.clearValidate();
      this.dialogChange = false;
    },
    showAdd() {
      this.$router.push({
        name: "addWarehouse",
      });
    },
    onSubmit() {
      this.pageNum = 1
      let dt={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "where.warningType":this.formInline.warningType || null,
        "where.keyword":this.formInline.keyword || null,
        "where.warningUid":(this.$route.query && this.$route.query.uid) && this.isFromMsg?this.$route.query.uid:null
      }
      this.queryWarningList(dt)
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      let dt={
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        "where.warningType":this.formInline.warningType || null,
        "where.keyword":this.formInline.keyword || null
      }
      this.queryWarningList(dt)
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.onSubmit()
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
