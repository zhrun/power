/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:19 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-08 14:41:57
 */
<template>
  <div class="dutylist">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      <el-scrollbar class="scroll" >
      <div class="flex">
        <div class="fleft">
          <el-form :inline="true" :model="formInline"  ref="ruleForm" class="demo-form-inline">
            <el-form-item label="创建时间">
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
            <el-form-item label="数据来源">
               <el-select v-model="formInline.roleId" style="width: 130px">
                    <el-option label="fdfd" value="dffd"></el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="类型名称">
               <el-input v-model="formInline.user" placeholder="请输入类型名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="onSubmit">搜索</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="fright">
          <el-button type="primary" @click="toAddpage" class="min">新 增</el-button>
          <el-button type="primary"  class="min" @click="inputDuty"> 批量删除</el-button>
        </div>
        
          
      </div>
      <div class="tables" >
        <el-table :data="doneData" class="eventtables">
          <el-table-column label="" type="selection"></el-table-column>
          <el-table-column   label="序号"  type="index" width="150"></el-table-column>
          <el-table-column prop="startTime" label="车辆类型名称" width="160">
          </el-table-column>
          <el-table-column  prop="endTime" label="数据来源" width="160">
          </el-table-column>
          <el-table-column  prop="leader" show-overflow-tooltip label="创建人" >
          </el-table-column>
          <el-table-column  prop="leader" show-overflow-tooltip label="创建时间" >
          </el-table-column>
          <el-table-column  label="操作" width="120"  fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn">编辑</span>
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
import {getDutyList,delSchedule} from "@/views/index/api/onDuty/api.zr.js";
import { exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "基础信息"}, {name: "车辆类型管理"}],
    
      formInline:{
        dateTime:[],
        user:''
      },
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      date1:'',
      postList:[],
      doneData:[{}],
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
      // this.resetForm()
      // this.init()
    }else{
      this.$route.meta.isBack = false;
      // this.onPageChange(this.pageNum);
     /*列表重新加载*/
    }
  },
  mounted() {
    // this.getPostionList()
    // this.init()
  },
  methods: {
    toAddpage(){
      this.$router.push({
        name: "addSupplier",
      });
    },
    //重置
    resetForm() {
      this.formInline.user=''
      this.pageNum = 1;
      // this.init();
    },
    toDetail(){
      this.$router.push({
        name:'detailSupplier'
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
      flex-direction: column;
    }
    /deep/ .el-form--inline .el-form-item{
      margin-bottom: 10px;
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


