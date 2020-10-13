<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 要情快报.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;">
          <el-form-item label="编发日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="事件等级">
            <el-select v-model="levelUnit" @change="selectLevel">
              <el-option-group v-for="group in levelOption" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input type="text" v-model="queryStr" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item class="position-right">
            <el-button icon="iconfont iconbianzu12" @click="addExpress"> 新增</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="eventPageList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="编号" prop="code" width="70"></el-table-column>
            <el-table-column label="标题" prop="eventTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="事件等级" prop="levelTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="编发时间" prop="editTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">预览</span>
                <span class="operation_btn" @click="resubmit(scope.row.uid)" v-if="scope.row.eventType==1 && scope.row.isOneSelf">续报</span>
                <span class="operation_btn" @click="instructe(scope.row.uid)" v-if="scope.row.isOneSelf && reportOptionUnit>0 && scope.row.isIssue==0 && scope.row.canView==1">批示</span>
                <span class="operation_btn" style="color:#666666" v-if="scope.row.isOneSelf && reportOptionUnit>0 && scope.row.isIssue==0 && scope.row.canView!=1">批示</span>
                <span class="operation_btn" @click="instructe(scope.row.uid)" v-if="scope.row.isOneSelf && reportOptionUnit>0 && scope.row.isIssue!=0">再次批示</span>
                <span class="operation_btn" @click="edit(scope.row.uid)" v-if="scope.row.isOneSelf">编辑</span>
                <span class="operation_btn" @click="del(scope.row.uid)" v-if="scope.row.isToday && scope.row.isOneSelf">删除</span>
                <span class="operation_btn" @click="down(scope.row)" v-if="scope.row.canView==1">下载</span>
                <span class="operation_btn" v-if="scope.row.canView!=1" style="color:#666666">下载</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
            :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getLast3Month, handleLevelInfo, judgeIsToday, exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getEventPageList, delEventReport } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" }, { name: "要情快报" }],
      levelOption: [
        {
        label: '一般事件',
          options: [{
            value: -1,
            label: '一般事件'
          }]
        }, 
        {
          label: '突发事件',
          options: [{
              value: 1,
              label: 'Ⅳ级(一般)'
            }, {
              value: 2,
              label: 'Ⅲ级(较大)'
            }, {
              value: 3,
              label: 'Ⅱ级(重大)'
            }, {
              value: 4,
              label: 'Ⅰ级（特别重大）'
            }]
          }
        ],
      reportOptionUnit: 0,
      commonData:[],
      levelUnit: null,
      levelType:null,
      queryStr:null,
      eventPageList: [],
      tableLoading: false,
      userInfo: null,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    this.reportOptionUnit=parseInt(localStorage.getItem("ChildrenNum")) 
    //获取页面初始化列表数据
    this.getEventPageList();
  },
  activated() {
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getEventPageList()
    }else{
      this.resetForm()
    }
  },
  methods: {
    selectLevel(v){
      console.log("vvvvvvvvvvvvvvvvvvv=>", v)
      if(v==-1){
        this.levelUnit=v
        this.levelType=2
      }else{
        this.levelUnit=v
        this.levelType=1
      }
    },
    //打开pageOffice时，页面的遮罩层
    openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });      
    },
    //关闭pageOffice时，关闭页面的遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
    },
    //获取页面初始化列表数据
    getEventPageList() {
      this.tableLoading=true
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.eventLevel":this.levelUnit==-1?null:this.levelUnit,
        "where.eventType":this.levelType,
        "where.queryStr": this.queryStr,
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "orderBy":"a.edit_time",
        "order":"desc"
      }
      this.eventPageList=[]
      getEventPageList(params).then(res => {
        this.tableLoading = false
        if(res && res.code==="00000000") {
          this.total = res.data.total
          this.eventPageList = res.data.list
          this.eventPageList.map((item)=>{
            item.editTime=item.editTime || "-"
            item.eventTitle=item.eventTitle || "-"
            item.levelTitle=handleLevelInfo(item.eventLevel, item.eventType)
            item.isToday=item.createTime?judgeIsToday(item.createTime):false
            item.isOneSelf=item.authUserId==this.userInfo.uid? true: false
          })
        }
      }).catch(error => {
        this.tableLoading = false
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.levelUnit= null
      this.levelType= null
      this.queryStr= null
      this.pageNum = 1
      this.getEventPageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getEventPageList();
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=3&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //下载
    down(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/download'
      let params={
        wordType:3,
        uid:obj.uid
      }
      let unitName=`${this.userInfo.rmsUnitDto.unitName}要情快报`
      exportFn(objStr, params, unitName, 'docx')
    },
    //新增
    addExpress(){
      this.$router.push({ name: "addExpress", query:{fromTouch:"新增"} });
    },
    //续报
    resubmit(uid){
      this.$router.push({ name: "addExpress", query:{fromTouch:"续报", uid:uid} });
    },
    //编辑
    edit(uid){
      this.$router.push({ name: "addExpress", query:{fromTouch:"编辑", uid:uid} });
    },
    //批示
    instructe(uid){
      this.$router.push({ name: "instructeExpress", query:{fromTxt:"add", uid:uid} });
    },
    //删除
    del(uid){           
      let that = this      
      that.$alert('您确认要删除此信息吗？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:uid
            }
            delEventReport(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getEventPageList()
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            }) 
          }
          if(action==='cancel'){
            that.$message({
              type: 'info',
              message: '已取消'
            })
          }
        }
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getEventPageList();
    },
  }
};
</script>

<style lang="scss" scoped>
.position-right{
  position: absolute;
  top: 0px;
  right: -20px;
}
</style>