/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:19 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-08 14:42:27
 */
<template>
  <div class="dutylist">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      <el-scrollbar class="scroll" >
      <div class="flex">
        <div class="fleft">
          <el-form :inline="true" :model="formInline"  ref="ruleForm" class="demo-form-inline">
            <el-form-item label="值班日期">
              <el-date-picker
              style="width:260px"
                v-model="formInline.dateTime"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                :clearable="false"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
               <el-input v-model="formInline.user" placeholder="输入姓名查找"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="onSubmit">搜索</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="fright">
          <el-button type="default" icon="iconfont iconbianzu26" class="min" @click="inputDuty"> 导入</el-button>
          <el-button type="default" icon="iconfont iconbianzu14" @click="toCopy" class="min"> 复制</el-button>
          <el-button type="default" @click="deteleList" icon="iconfont iconbianzu13" class="min"> 删除</el-button>
          <el-button type="default" @click="exportDuty" icon="iconfont iconbianzu15" class="min"> 导出</el-button>
        </div>
        
          
      </div>
      <div class="tables" >
        <el-table :data="doneData" class="eventtables"  @selection-change="handleSelectionChange">
          <el-table-column  type="selection" width="45"></el-table-column>
          <el-table-column   label="序号"  type="index" width="50"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="160">
          </el-table-column>
          <el-table-column  prop="endTime" label="结束时间" width="160">
          </el-table-column>
          <el-table-column  prop="leader" show-overflow-tooltip label="带班领导" >
          </el-table-column>
          <el-table-column v-for="v in postList" :label="v.name" :key='v.uid' >
            <template slot-scope="scope">
              <span>{{scope.row[v.name]}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="120"  fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" v-if="!scope.row.isHistory"  @click="putDuty(scope.row.uid)">修改</span>
              <span class="disable" v-else>修改</span>
              <span class="operation_btn"  v-if="!scope.row.isHistory"  @click="delItem(scope.row.uid)">删除</span>
              <span class="disable" v-else>删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination  @current-change="onPageChange" :current-page.sync="pageNum" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
      </el-scrollbar>
    </div>
    <el-dialog title="选择排班开始日期" :visible.sync="dialogFormVisible" top="30vh" width="320px">
      <el-date-picker type="date"  value-format="yyyy-MM-dd" placeholder="选择日期" v-model="date1"  :picker-options="pickerOptionsStart" ></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCopy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {getDutyList,getPostionList,delSchedule,delMoreSchedule,copySchedule,getHasOverlapl} from "@/views/index/api/onDuty/api.zr.js";
import { formatDate,exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "编排班管理"}, {name: "浏览值班信息"}],
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 24*60*60*1000;
        }
      },
      formInline:{
        dateTime:[],
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
      this.resetForm()
      // this.init()
    }else{
      this.$route.meta.isBack = false;
      this.onPageChange(this.pageNum);
     /*列表重新加载*/
    }
  },
  mounted() {
    this.getPostionList()
    this.init()
  },
  methods: {
    //重置
    resetForm() {
      this.formInline.user=''
      this.pageNum = 1;
      this.init();
    },
    init(){
      //默认七天
      let data =  new Date()
      let dataSeven = data.getTime() + 6*24*60*60*1000
      this.formInline.dateTime =[formatDate(data, "yyyy-MM-dd"),formatDate(dataSeven, "yyyy-MM-dd")]
      let d = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.startTime':formatDate(data, "yyyy-MM-dd") +' 00:00:00',
        'where.endTime':formatDate(dataSeven, "yyyy-MM-dd") + ' 23:59:59',
        'orderBy':'start_time',
          'order':'desc'
      }
      this.getTabList(d)
    },
    //查询岗位信息
    getPostionList(){
      getPostionList({
        'where.type':3
      }).then(res=>{
        if(res && res.code === '00000000'){
          this.postList = res.data.list
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
    //添加跳转方法
    inputDuty(){
      this.$router.push({path:'/main/inputduty'})
    },
    //修改跳转
    putDuty(uid){
      this.$router.push({path:'/main/modifyduty',query:{uid:uid}})
    },
    //搜索提交 
    onSubmit(){
      this.pageNum = 1
      let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.startTime':this.formInline.dateTime[0] +' 00:00:00',
        'where.endTime':this.formInline.dateTime[1] + ' 23:59:59',
        'where.personName':this.formInline.user,
        'orderBy':'start_time',
          'order':'desc'
      }
      this.getTabList(data)
    },
    //查询值班列表
    getTabList(d){
      getDutyList(d).then(res=>{
        if(res && res.code==="00000000"){
          this.total = res.data.total
          if(res.data.list && res.data.list.length>0){
            res.data.list.map(el=>{
              this.postList.forEach(obj=>{
                let a= el.personList.filter(v=>v.personPostion==obj.uid)
                if(a && a.length>0){
                   a.forEach(p=>{
                    if(el[obj.name]){
                         el[obj.name] += "，" + p.personName
                      }else{
                        el[obj.name] = p.personName
                      }
                  })

                }else{
                   el[obj.name] = '-'
                }
              })
              let b = el.personList.filter(v=>v.personRoleType==1)
              if(b && b.length>0){
                 b.forEach(p=>{
                  if(el.leader){
                      el.leader += "，" + p.personName
                    }else{
                      el.leader = p.personName
                    }
                })
              }else{
                el.leader = '-'
              }
             
              
              //  el.leader = 
            })
          }
          this.doneData = res.data.list
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
    //select 表格选中动作
    handleSelectionChange(v){
      this.selectList =v 
    },
    //分页方法
    onPageChange(v){
      this.pageNum = v
      let data = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        'where.startTime':this.formInline.dateTime[0] +' 00:00:00',
        'where.endTime':this.formInline.dateTime[1] + ' 23:59:59',
        'personName':this.formInline.user,
        'orderBy':'start_time',
          'order':'desc'
      }
      this.getTabList(data)
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
        this.delSchedule(params)      
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    //删除值班
    delSchedule(d){
      delSchedule(d).then(res=>{
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
    //批量删除值班
    delMoreSchedule(d){
      delMoreSchedule(d).then(res=>{
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
    //复制值班前验证是否跨天
    toCopy(){
      if(this.selectList.length == 0){
        this.$message({
          type:'warning',
          message:'请先勾选要复制的值班信息'
        })
      }else{
        let today = true
        let first = null
        try{
          this.selectList.forEach(el=>{
            if(!first){
              first = el.startTime.substr(0,10)
            }else{
              if(el.startTime.substr(0,10) != first){
                today = false
                throw new Error('End')
              }
            }
          })
        }catch(e){
          if(e.message!='End') throw e
        }
        if(today){
          this.dialogFormVisible = true
        }else{
          this.$message({
            type:'warning',
            message:'勾选的排班信息不能跨天复制'
          })
        }
      }
    },
    //复制提交 
    confirmCopy(){
      
      
      // let d =false
      let ids = []
      this.selectList.forEach(el=>{
        ids.push(el.uid)
      })
      let date={
        copiedWorkSchedules:ids.toString(),
        copyToDate:this.date1,
        originDate:this.selectList[0].startTime.substr(0,10)
      }
      console.log('123146');
      try{
        this.selectList.forEach(el=>{
          let start = el.startTime.split(" ")
          let end = el.endTime.split(" ")
          let t = null
          if(end[0]>start[0]){
            let a = this.date1.substr(0,8)+(this.date1.substr(8,2)*1+1)
            t={
              startTime:this.date1+' '+start[1],
              endTime:a+ ' '+end[1]
            }
          }else{
            t={
              startTime:this.date1+' '+start[1],
              endTime:this.date1+ ' '+end[1]
            }
          }
          this.getHasOverlapl(t,date)
          
        })
        
      }catch(e){
        if(e.message!='End') throw e
      }
     
      
      // this.copyDuty(d)
    },
    //查询是否重复
    getHasOverlapl(d,prames){
       getHasOverlapl(d).then(res=>{
        if(res && res.code==="00000000"){
          // if(!this.hasOver){
          //   this.hasOver = res.data
          // }
          this.longs.push(res.data)
          if(this.selectList.length == this.longs.length){
            if(this.longs.indexOf(true)>-1){
              this.$confirm('时间段有重复，您确认要覆盖信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.copyDuty(prames)
              }).catch(() => {
                this.longs = []
                this.$message({
                  type: 'info',
                  message: '已取消'
                });          
              });
            }else{
               this.copyDuty(prames)
            }
          }
        }
      }).catch(e=>{
        console.error('ee=>',e);
        
      })
    },
    //复制排班
    copyDuty(d){
      
      copySchedule(d).then(res=>{
        if(res && res.code==="00000000"){
          this.$message({
            type:'success',
            message:'复制成功'
          })
          this.longs = []
          this.init()
          this.dialogFormVisible = false
        }
      }).catch(e=>{
        console.error('e',e);
        
      })
    },
    //删除排班
    deteleList(){
      // if()
      if(this.selectList.length == 0){
        this.$message({
          type:'warning',
          message:'请先勾选要删除的值班信息'
        })
      }else{
        this.$confirm('您确认要批量删除信息吗？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let lists = []
          this.selectList.forEach(ml=>{
            lists.push(ml.uid)
          })
          let params={
            uids :lists.toString()
          }
          this.delMoreSchedule(params)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        
        
      }
    },
    //导出排班
    exportDuty(){
       /**
     * 导出
     * @param {*} exportUrl 导出的url
     * @param {*} params  附带的参数 
     * @param {*} fileName 导出的文件标题
     * @param {*} extName 导出的后缀名
     */
      let start = this.formInline.dateTime[0] +' 00:00:00'
      let end = this.formInline.dateTime[1] +' 23:59:59'
      let key = this.formInline.user || null
      let exportUrl = ajaxCtx.uem+'/duty/work-schedule-service/export'
      let params = {
        startTime:start,
        endTime:end,
        personName:key
      }
      let fileName = this.userInfo.rmsUnitDto.unitName +'值班编排表'
      let extName="xls"
    
      exportFn(exportUrl,params,fileName,extName)
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
<style lang="scss">
.el-time-spinner__wrapper{
  max-height: 205px;
}
</style>

