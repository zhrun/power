<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
      <p>基本信息</p>
      <div class="inform">
        <table>
          <tr>
            <td>盘点单编号：{{detailData && detailData.checkListCode || '-'}}</td>
            <td>盘点单名称：{{detailData.checkListName}}</td>
            <td>计划盘点日期：{{detailData.checkStartTime+'-'+detailData.checkEndTime}}</td>
          </tr>
          <tr>
            <td>盘点人员：{{detailData.checkerName}}</td>
            <td>发布时间：{{detailData.publishTime || '-'}}</td>
            <td>盘点开始时间：{{detailData.statusFlag==3 ?detailData.beginTime:'-'}}</td>
          </tr>
          <tr>
            <td>盘点完成时间：{{detailData.statusFlag==4 ?detailData.completeTime:'-'}}</td>
            <td  colspan="2">备注：{{detailData.remark}}</td>
          </tr>
        </table>
        <div :class="'sign ' + 'status'+detailData.statusFlag"></div>
      </div>
      <!-- <div class="ltbox">
        <el-button @click="toBack">返 回</el-button>
        <el-button type="primary" @click="submitForm('formData')">更换责任人</el-button>
        <el-button type="primary" @click="toEdit">编 辑</el-button>
      </div> -->
      <p class="pdword">盘点范围</p>
      <div class="tables">
        <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
          <el-form-item label="盘点库位" prop="wareName">
            <el-select v-model="formInline.wareName" style="width: 160px">
              <el-option v-for="(item,index) in areaList" :label="item.locationFullName" :value="item.uid" :key="'key_'+index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物资装备名称">
            <el-form-item prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="请输入物资装备名称"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="querySubmit">查询</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item class="rightButton" v-if="detailData.statusFlag == 4">
              <el-button  type="primary"  @click="getExport"> 导出</el-button>
            </el-form-item>
        </el-form>
        <p v-if="detailData.statusFlag == 4"><span class="orange">盘点物资装备总计{{detailData.checkResultList && detailData.checkResultList.length}}种</span>    盘盈：<i class="red">{{up.length}}</i> 种    盘亏：<i class="green">{{down.length}}</i> 种</p>
        <p v-if="detailData.statusFlag == 3 || detailData.statusFlag == 4" class="des">说明：红色表示盘点数量大于盘点前数量（盘盈）的物资装备，绿色代表盘点数量小于盘点前数量（盘亏）的物资装备。</p>
        <el-table
            ref="versionTable"
            :data="problemData"
            tooltip-effect="dark"
            class="eventtables"
            v-loading="loading"
            style="width:99%"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="物资装备名称"  show-overflow-tooltip prop="resourceName"></el-table-column>
            <el-table-column label="编号" width="180" prop="resourceCode" show-overflow-tooltip></el-table-column>
            <el-table-column label="所属库位" width="120" show-overflow-tooltip >
              <template slot-scope="scope">
                <span>{{scope.row.locationFullName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格型号"  show-overflow-tooltip>
              <template slot-scope="scope">
                 <span>{{scope.row.model || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="品牌"  prop="brand" show-overflow-tooltip>
              <template slot-scope="scope">
                 <span>{{scope.row.brand || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位" width="120" prop="measuringUnitName">
              <template slot-scope="scope">
                 <span>{{scope.row.measuringUnitName || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存数量" width="80" prop="storage"></el-table-column>
            <el-table-column v-if="detailData.statusFlag == 3 || detailData.statusFlag == 4" label="盘点数量" width="80" >
              <template slot-scope="scope">
                 <span>{{scope.row.actualStorage}}</span>
              </template>
            </el-table-column>
            <el-table-column  v-if="detailData.statusFlag == 3 || detailData.statusFlag == 4" label="盈亏数量" width="80" >
              <template slot-scope="scope">
                 <span :class="(scope.row.actualStorage-scope.row.storage)>0?'red':((scope.row.actualStorage-scope.row.storage)<0?'green':'')" v-if="scope.row.actualStorage>=0">{{scope.row.actualStorage-scope.row.storage}}</span>
                 <!-- <span v-else>0</span> -->
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
          <div>
             <el-button @click="toBack()">返回</el-button>
            <el-button type="primary" v-if="detailData.statusFlag == 1" @click="toEdit(detailData)">编辑</el-button>
            <el-button type="primary" v-if="detailData.statusFlag == 1"  @click="editItem(detailData)" >发布</el-button>
            <el-button type="primary" v-if="detailData.statusFlag == 4"  @click="toCope(detailData)" >复用</el-button>
          </div>
      </div>
      </el-scrollbar>
    </div>
    <!-- <div is="tables" v-show="false"></div> -->
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { queryCheck,queryCheckPageList,updatePublish} from "@/views/index/api/supplies/api.zr.js";
// import { getAllList,delEvent,putEvent,getRecordList} from "@/views/index/api/onDuty/api.zr.js";
import { exportFn ,formatDate} from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [
        { name: "仓储管理" },
        { name: "盘点管理", routerName: "inventoryManage" },
        { name: "查看详情" },
      ],
      detailData:{},
      problemData:[],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      formInline: {
        wareName:'',
        keyword:'',
      },
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      loading: false,
      up:[],
      down:[],
      areaList:[]
    };
  },
  mounted() {
    let d ={
      uid:this.$route.query.uid
    }
    this.queryCheck(d)
    this.queryCheckPageList({
        "where.checkListUid":this.$route.query.uid
      })
  },
  methods: {
    toCope(obj) {
      this.$router.push({
        name: "addInventory",
        query:{
          uid:obj.uid
        }
      });
    },
    async updatePublish(d){
        const {code } = await updatePublish(d)
        if(code === "00000000"){
          this.$message({
            message: `发布成功`,
            type: "success",
          });
          let d ={
            uid:this.$route.query.uid
          }
          this.queryCheck(d)
        }
      
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
    toEdit(obj) {
      this.$router.push({
        name: "addInventory",
        query:{
          edit:obj.uid
        }
      });
    },
     toBack() {
      this.$router.back(-1)
    },
    async queryCheck(d){
       const {code, data } = await queryCheck(d)
       if(code ==='00000000'){
        this.detailData = data
        if(this.detailData.checkResultList && this.detailData.checkResultList.length>0){
           this.up = this.detailData.checkResultList.filter(el=>el.actualStorage>el.storage)
           this.down = this.detailData.checkResultList.filter(el=>el.actualStorage<el.storage)
        }
        this.areaList = this.detailData.areaList
       
      }
    },
    async queryCheckPageList(d){
       const {code, data } = await queryCheckPageList(d)
       if(code ==='00000000'){
        this.problemData = data.list
        this.total=data.total
      }
    },
    querySubmit(){
      this.queryCheckPageList({
        "where.checkListUid":this.$route.query.uid,
        "where.areaUid":this.formInline.wareName || null,
        "where.resourceName":this.formInline.keyword || null,
      })
    },
    
 
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.queryCheckPageList({
        "where.checkListUid":this.$route.query.uid,
        "where.areaUid":this.formInline.wareName || null,
        "where.resourceName":this.formInline.keyword || null,
        "pageNum":this.pageNum
      })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
      this.queryCheckPageList({
        "where.checkListUid":this.$route.query.uid
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
    
      // let key = this.formInline.user || null
      let exportUrl = ajaxCtx.rel+'/muem/resource/storage-check-service/export-check-result'
      let params ={
         "where.checkListUid":this.$route.query.uid,
        "where.areaUid":this.formInline.wareName || null,
        "where.resourceName":this.formInline.keyword || null,
        "pageSize":0
      }
    
       const downloadFullName = `${formatDate(
        new Date(),
        'yyyyMMdd'
      )}盘点单结果数据.xls`
      exportFn(exportUrl, params, null, null, downloadFullName)
    }
  },
};
</script>
<style lang="scss" scoped>
.des{
  color: #999;
  padding-bottom: 10px;
}
.orange{
  color:#FF6600 ;
}
.red{
  color: #FF0000;
  font-style: normal;
}
.green{
  font-style: normal;
  color: #00b822;
}
.rightButton {
  position: absolute;
  right: 0;
}
.inform{
  position: relative;
  margin-top: 20px;
  line-height: 22px;
  table,table tr th, table tr td { border:1px solid #D3D3D3;line-height: 22px; padding: 10px 10px; width: 33.33%;}
  table { width: 100%;  text-align: left; border-collapse: collapse; padding:2px;}   
  .sign{
    position: absolute;
    right: -10px;
    top: -60px;
    width: 160px;
    height: 160px;
    
  }
  .status1{
    background: url("../../../../../../assets/img/supplies/pd1.png") center no-repeat;
    background-size: contain;
  }
  .status2{
    background: url("../../../../../../assets/img/supplies/pd2.png") center no-repeat;
    background-size: contain;
  }
  .status3{
    background: url("../../../../../../assets/img/supplies/pd3.png") center no-repeat;
    background-size: contain;
  }
  .status4{
    background: url("../../../../../../assets/img/supplies/pd4.png") center no-repeat;
    background-size: contain;
  }
}
.ltbox{
  margin: 20px auto;
  text-align: center;
}
.pdword{
  padding: 20px 0px;
}
</style>
