/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:46 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-31 10:14:30
 */
<template>
  <div class="lower">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_left">
          <org-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
          ></org-tree>
        </el-scrollbar>
        <el-scrollbar class="main_right">
          <p class="host">温馨提示：只显示今天的值班人员信息</p>
          <div class="tables">
            <el-table :data="tableData" class="eventtables" >
              <el-table-column   label="序号"  type="index" width="100"></el-table-column>
              <el-table-column prop="unitName" label="单位名称">
              </el-table-column>
              <el-table-column  prop="startTime" label="开始时间"  show-overflow-tooltip >
              </el-table-column>
              <el-table-column  prop="endTime" label="结束时间"  show-overflow-tooltip >
              </el-table-column>
              <el-table-column  prop="_leader" label="带班领导"   show-overflow-tooltip >
              </el-table-column>
              <el-table-column  prop="_members" label="值班人员" show-overflow-tooltip  >
              </el-table-column>
              <el-table-column  label="操作" width="100">
                <template slot-scope="scope">
                  <span class="btn" @click="showDetaile(scope.row)">详情</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <el-pagination  @current-change="onPageChange" :current-page.sync="pageNum" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
          </div>
        </el-scrollbar>
      </div>
    </main>
    <el-dialog
      :visible.sync="lookDuty"
      :close-on-click-modal="false"
      width="850px"
      class="modyfi">
      <div class="title" slot="title">
        <b>值班详情</b>
        <!-- <span>2020-04-15 16:00 - 2020-04-15 16:00</span> -->
      </div>
      <div class="conment">
        <div class="dutyTable" v-if="detailDate">
          <div style="height:100%">
            <el-scrollbar class="scroll" style="height:100%">
              <div class="time">
                <span  class="lable">值班时间</span>
                <div>
                  <span>
                    {{detailDate.startTime.substr(0,16)}}   至   {{detailDate.endTime.substr(0,16)}}
                    <i class="red" v-if="senDays && senDays[today] && senDays[today]._red">敏感日</i>
                    <i class="yel" v-if="senDays && senDays[today] && senDays[today]._war">节假日</i>
                  </span>
                </div>
              </div>
              <div class="leader">
                <span  class="lable">带班领导</span>
                <div>
                    <template v-for="v in detailDate.personList"  >
                      <span  v-if="v.personRoleType==1" :key="'l'+v.uid">{{v.personName}} <b>({{v.personTelephone}})</b></span>
                    </template>
                </div>
              </div>
              <div class="members">
                <span class="lable">值班员</span>
                <div>
                  <template v-for="v in detailDate.personList" >
                    <span v-if="v.personRoleType==2" :key="'m'+v.uid">{{v.personName}} <b>({{v.personPositionName}})</b><b> {{v.personTelephone}}</b></span>
                  </template>
                  
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
     
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import orgTree from "@/components/common/orgTree";
import { formatDate } from "@/utils/util.js";
import {getLowUint,getDutyList,getIsDay} from "@/views/index/api/onDuty/api.zr.js";
export default {
  components: { visBreadcrumb ,orgTree},
  data() {
    return {
      breadcrumbData:[{name: "编排班查询"}, {name: "下级值班表"}],
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      pageNum:1,
      pageSize:10,
      total:0,
      lookDuty:false,
      detailDate:null,
      treeData: [{
        unitName: "全部",
        id: "1",
        children: []
      }],
      tableData: [],
      defaultProps: {
        children: "children",
        label: "unitName",
      },
      today:'',
      uids:[],
      senDays:null
    };
  },
  mounted() {
    this.today = formatDate(new Date(), "yyyy-MM-dd")
    this.getLowUint({
      parentUid:this.userInfo.dutyUserInfo.unitUid,
      unitType:1
    })
  },
  methods: {
    //查询是否是特殊日子
    getIsDay(d){
      getIsDay(d).then(res=>{
        if(res && res.code==="00000000"){
             this.senDays = {}
            res.data.forEach(el => {
              //red 敏感日  war 节假日
              let keys = el.date.substr(0,10)
              if(!this.senDays[keys]){
                
                if(el.count){
                  this.senDays[keys]={}
                  if(el.type==1){
                    this.senDays[keys]['_war']=1
                  }
                  if(el.type==2){
                    this.senDays[keys]['_red']=1
                  }
                }
              }else{
                if(el.count){
                  if(el.type==1){
                    this.senDays[keys]['_war']=1
                  }
                  if(el.type==2){
                    this.senDays[keys]['_red']=1
                  }
                }
              }
              
            });
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
    //展示详情
    showDetaile(obj){
      this.getIsDay({
        'startDate':this.today + " 00:00:00",
        'endDate':this.today + " 23:59:59"
      })
      this.detailDate = obj
      this.lookDuty = true
    },
    //单击树结构单位时方法
    handleNodeClick(v) {
      if(v.id ==1){
        let start = this.today + " 00:00:00"
        let end = this.today + " 23:59:59"
        this.getDutyList({
          "where.startTime":start,
          "where.endTime":end,
          "where.unitUids":this.uids.toString(),
          "orderBy":"ws.start_time,ut.sort_id",
          "order":"desc,asc"

        })
      }else{
        let start = this.today + " 00:00:00"
        let end = this.today + " 23:59:59"
        this.getDutyList({
          "where.startTime":start,
          "where.endTime":end,
          "where.unitUids":v.uid,
          "orderBy":"ws.start_time,ut.sort_id",
          "order":"desc,asc"
        })
      }
    
   },
   //取得当前单位下级单位 
   getLowUint(d){
     getLowUint(d).then(res=>{
        if(res && res.code==="00000000"){
          if(res.data && res.data.length>0){
            this.treeData[0].children = res.data
            let uids = []
            res.data.forEach(el=>{
              uids.push(el.uid)
            })
            this.uids = uids
            let start = this.today + " 00:00:00"
            let end = this.today + " 23:59:59"
            this.getDutyList({
              "where.startTime":start,
              "where.endTime":end,
              "where.unitUids":uids.toString(),
              "orderBy":"ws.start_time,ut.sort_id",
              "order":"desc,asc"
            })
          }
        }
      }).catch(e=>{
        console.error('error',e);
      })
   },
   //查询当前单位下的下级单位的当天 值班信息
   getDutyList(d){
     getDutyList(d).then(res=>{
        if(res && res.code==="00000000"){
         if(res.data && res.data.list && res.data.list.length>0){
           res.data.list.map(el=>{
             let ld = [],mem=[];
             el.personList && el.personList.forEach(o=>{
                if(o.personRoleType==1){
                  ld.push(o.personName)
                }else if(o.personRoleType==2){
                  mem.push(o.personName)
                }
             })
             el._members = mem.toString()
             el._leader = ld.toString()
           })
            this.tableData = res.data.list
            this.total = res.data.total
          }else{
            this.tableData = []
            this.total = 0
          }
        }
      }).catch(e=>{
        console.error('error',e);
      })
   },
   //分页方法
   onPageChange(v){
    this.pageNum = v 
    let start = this.today + " 00:00:00"
    let end = this.today + " 23:59:59"
    this.getDutyList({
      "pageNum":this.pageNum,
      "pageSize":this.pageSize,
      "where.startTime":start,
      "where.endTime":end,
      "where.unitUids":this.uids.toString(),
      "orderBy":"ws.start_time,ut.sort_id",
      "order":"desc,asc"
    })
   }
    
  }
};
</script>
<style lang="scss" scoped>
.host{
  color: $waring_color;
  padding-left: 20px;
  margin-bottom: 20px;
}
.tables{
  .btn{
    color: $main_color;
    cursor: pointer;
    padding-right: 5px;
  }
  margin-top: 0px;
  margin-left: 10px;
  /deep/ .el-table__header thead tr th{
    background: rgba(240,242,245,1);
    color: $font_333;
    &:first-child{
      border-top-left-radius: 6px;
    }
    &:nth-child(7) {
      border-top-right-radius: 6px;
    }
  }
}
  .conment{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .dutyTable{
      border-top: solid 1px  #E5EAF4;
      // border-bottom: none;
      margin-bottom: 20px;
      height: 52vh;
      .time,.leader,.members{
        border-left: solid 1px  #E5EAF4;
        border-right: solid 1px  #E5EAF4;
        border-bottom: solid 1px  #E5EAF4;
        display: flex;
        flex-direction: row;
        line-height: 35px;
        // padding: 10px 0px;
        .lable{
          width: 120px;
          border-right: solid 1px  #E5EAF4;
          text-align: center;
          padding: 10px 0;
        }
        div{
          padding:10px 20px;
          display: flex;
          flex-direction: column;
          span{
            line-height: 35px;
            color: #222222;
            b{
              font-weight: normal;
              color: $font_666;
            }
            .red{
              font-style: normal;
              font-size: 12px;
              border: solid 1px #FA453A;
              border-radius: 6px;
              color: #FA453A;
              padding:  0 3px;
            }
             .yel{
              font-style: normal;
              font-size: 12px;
              border: solid 1px #FFBB00;
              border-radius: 6px;
              color: #FFBB00;
              padding:  0 3px;
              margin: 0px 5px;
            }

          }
        }
      }
    }
  }
  
</style>
<style lang="scss">
</style>