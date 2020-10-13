<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 来文拟办.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <el-form :inline="true" style="position:relative;">
          <el-form-item label="来文日期">
            <el-date-picker v-model="commonData" type="daterange" unlink-panels range-separator="-" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input type="text" v-model="queryStr" placeholder="标题、编号" style="width:320px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item class="position-right">
            <el-button icon="iconfont iconbianzu12" @click="addCommunication"> 新增</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table :data="dutyPageList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
            <el-table-column label="编号" prop="code" width="70"></el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="来文时间" prop="happenTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <span class="operation_btn" @click="preInfo(scope.row)" v-if="scope.row.canView==1">预览</span>
                <span class="operation_btn" v-if="scope.row.canView==0" style="color:#666666">预览</span>
                <span class="operation_btn" @click="edit(scope.row)" v-if="scope.row.isToday && scope.row.isOneSelf">编辑</span>
                <span class="operation_btn" @click="del(scope.row)" v-if="scope.row.isToday && scope.row.isOneSelf">删除</span>
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
import { getLast3Month, judgeIsToday } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getDutyHandlePageList,deleteDutyHandle } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "文电拟办" }, { name: "来文拟办" }],
      commonData:[],
      queryStr:null,
      dutyPageList: [],
      tableLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo:null,
      fullLoading:null
    };
  },
  mounted() {
    this.commonData=[getLast3Month().last, getLast3Month().now]
    this.userInfo=JSON.parse(localStorage.getItem("vis_user_info")) || {}
    //获取页面初始化列表数据
    this.getDutyHandlePageList()
  },
  activated() {
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    if(this.$route.meta.isBack && typeof(this.$route.query.refresh)=='undefined'){
      this.getDutyHandlePageList()
    }else{
      this.resetForm()
    }
  },
  methods: {
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
    getDutyHandlePageList() {
      this.tableLoading = true;
      let startTime=null, endTime=null
      if (this.commonData) {
        startTime = this.commonData[0]? `${this.commonData[0]} 00:00:00`: null;
        endTime = this.commonData[1]? `${this.commonData[1]} 23:59:59`: null;
      }
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.queryStr":this.queryStr,
        "where.infoType":1,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        orderBy:"create_time",
        order:"desc"
      }
      this.dutyPageList=[]
      getDutyHandlePageList(params).then(res => {
        this.tableLoading = false;
        if(res && res.code==="00000000") {
          this.total = res.data.total;
          this.dutyPageList = res.data.list;
          this.dutyPageList.map((item)=>{
            item.isToday=item.createTime?judgeIsToday(item.createTime):false
            item.isOneSelf=item.opUserId==this.userInfo.uid?true:false
            item.happenTime=item.happenTime || "-"
            item.title=item.title || "-"
          })
        }
      }).catch(error => {
        this.tableLoading = false;
        console.log("接口报错=>",error)
      })
    },
    //重置
    resetForm() {
      this.commonData=[getLast3Month().last, getLast3Month().now]
      this.queryStr= null
      this.pageNum = 1
      this.getDutyHandlePageList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getDutyHandlePageList();
    },
    //增加
    addCommunication(){
      this.$router.push({ name: "newCommunication", query:{fromTxt:"add"} });
    },
    //预览
    preInfo(obj){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=7&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //编辑
    edit(obj){
      this.$router.push({ name: "newCommunication", query:{fromTxt:"edit", uid:obj.uid} });
    },
    //删除
    del(obj){
      let that = this      
      that.$alert('您确认要删除此信息吗？', '删除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:obj.uid
            }
            deleteDutyHandle(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.getDutyHandlePageList()
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
      this.getDutyHandlePageList();
    },
  }
};
</script>
<style lang="scss" scoped>
.position-right{
  position: absolute;
  top: 0px;
  right: -18px;
}
</style>