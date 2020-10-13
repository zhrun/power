<!-- 值班记录列表 -->

<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <div class="common_content">
      <el-scrollbar class="scroll" style="height:100%;">
        <el-form :inline="true" style="position:relative;" >
          <el-form-item label="值班人员">
            <el-select v-model="reportUnit" placeholder="全部">
              <el-option :key="-1" label="全部" value></el-option>
              <el-option v-for="item in usersList" :key="item.uid" :label="item.userName" :value="item.uid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值班日期">
            <el-date-picker v-model="formInlineData" type="daterange" unlink-panels range-separator="-"  value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="common_table">
          <el-table ref="versionTable" :data="problemData" tooltip-effect="dark" style="width: 100%" v-loading="loading">
            <el-table-column label="编号" type="index" width="50"></el-table-column>
            <el-table-column label="带班领导"  prop="_leader" show-overflow-tooltip></el-table-column>
            <el-table-column label="值班人员" prop="_member" show-overflow-tooltip></el-table-column>
            <el-table-column label="值班时间" width="430" >
              <template slot-scope="scope">
                {{scope.row.workScheduleInfo.startTime.substr(0,16)}}({{scope.row._sweek}})-
                {{scope.row.workScheduleInfo.endTime.substr(0,16)}}({{scope.row._eweek}})
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <span class="operation_btn" @click="openOffice(scope.row.uid)">预览</span>
                <span class="operation_btn" v-if="!scope.row.isHistory" @click="edit">编辑</span>
                <span class="operation_btn" v-if="!scope.row.isHistory" @click="secondCom(scope.row)">删除</span>
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
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getOnduyList,delOnduy,getUsersList} from "@/views/index/api/onDuty/api.zr.js";
import { getLast3Month } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "值班记录单" }, { name: "值班记录列表" }],
      weekDay:{
        0:'星期日',
        1:'星期一',
        2:'星期二',
        3:'星期三',
        4:'星期四',
        5:'星期五',
        6:'星期六',
      },
      usersList:[],
      formInlineData:[],
      reportUnit:"",
      problemData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{} || {},
      fullLoading:null
    };
  },
  mounted() {
    window.closePageoffice =  ()=>{
      this.closeFullScreen()
    }
    this.getOnduyList();
    this.getUsersList();
    this.formInlineData=[getLast3Month().last, getLast3Month().now]
  },
  methods: {
    //打开pageoffice 遮罩层
    openFullScreen() {
      this.fullLoading = this.$loading({
        lock: true,
        text: 'pageOffice打开中,暂时禁止操作...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
    },
    //关闭pageoffice 遮罩层
    closeFullScreen(){
      if(this.fullLoading){
        this.fullLoading.close();
      }
    },
    //查值班用户列表
    getUsersList(){
      getUsersList({
        unitId:this.userInfo.rmsUnitDto.uid
      }).then(res=>{
        if(res && res.code === '00000000'){
          this.usersList = res.data
        }
      }).catch(e=>{
        console.error(e);
        
      })
    },
    //打开pageoffice
    openOffice(id){
      let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType=1&uid=' + id
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //取得值班记录列表数据
    getOnduyList() {
      let startTime=null, endTime=null
      if (this.formInlineData) {
        startTime = this.formInlineData[0]? this.formInlineData[0] + " 00:00:00": null;
        endTime = this.formInlineData[1]? this.formInlineData[1] + " 23:59:59": null;
      } else {
        startTime = null;
        endTime = null;
      }
      this.loading = true;
      let params={
        "where.startTime": startTime,
        "where.endTime": endTime,
        "where.personUid": this.reportUnit || null,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        // orderBy:"create_time",
        // order:"desc"
      }
      getOnduyList(params).then(res => {
        if (res && res.data) {
          res.data.list && res.data.list.map(el=>{
            let ld = [] , mb = [];
             let start = new Date(el.workScheduleInfo.startTime)
            let end = new Date(el.workScheduleInfo.endTime)
            let  startWeek = start.getDay()
            let  endWeek = end.getDay()
            el.workScheduleInfo.personList && el.workScheduleInfo.personList.forEach(obj=>{
           
              if(obj.personRoleType ==1){
                ld.push(obj.personName)
              }else if(obj.personRoleType ==2){
                 mb.push(obj.personName)
              }
            })
            el._leader = ld.toString()
            el._member = mb.toString()
            el._sweek = this.weekDay[startWeek]
            el._eweek = this.weekDay[endWeek]

          })
          this.problemData = res.data.list;
          this.total = res.data.total;
          this.loading = false;
        }
      }).catch(e => {
          console.log(e);
          this.loading = false;
      })
    },
    //重置
    resetForm() {
      this.formInlineData=[getLast3Month().last, getLast3Month().now]
      this.reportUnit = ''
      this.pageNum = 1
      this.getOnduyList()
    },
    //查询
    onSubmit() {
      this.pageNum = 1;
      this.getOnduyList();
    },
    //编辑
    edit(){
      this.$router.push({ name: "ondutymain" });
    },
    //删除前二次确认
    secondCom(val){
      let  str='您确认要删除此信息吗？'
      let title = '提示'
    
      this.$confirm(str, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params={
          uid:val.uid
        }
        this.delOnduy(params)  
      }).catch((e) => {
        console.log('e',e);
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //删除操作
    delOnduy(d){
      delOnduy(d).then(res=>{
        if(res && res.code === '00000000'){
           this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getOnduyList();
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    /* 表格分页方法 */
    onPageChange(page) {
      this.pageNum = page;
      this.getOnduyList();
    },
  }
};
</script>
<style lang="scss" scoped>

</style>