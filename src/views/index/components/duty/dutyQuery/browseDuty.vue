/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:42 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-09-08 14:42:22
 */
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="dutyBox">
      <div class="timeTitle">
        <div>
          <span class="redDay">敏感日</span>
          <span class="yelDay">节假日</span>
        </div>
        <div>
            <el-button class="min" @click="changeMonth(-1)" icon="el-icon-arrow-left">上月</el-button>
             <el-date-picker
              v-model="yearMonth"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择年月" @change="changeYM" class="minWidth">
            </el-date-picker>
            <el-button class="min" @click="changeMonth(1)">下月<i class="el-icon-arrow-right el-icon--right" ></i></el-button>
        </div>
        <div>
          <el-button type="default" class="min"  icon="iconfont iconbianzu26" @click="exportDuty = true"> 导出</el-button>
        </div>
      </div>
      <div class="dayBox">
        <el-scrollbar class="scroll" >
          <div class="weeks">
            <span>星期一</span>
            <span>星期二</span>
            <span>星期三</span>
            <span>星期四</span>
            <span>星期五</span>
            <span class="red">星期六</span>
            <span class="red">星期日</span>
          </div> 
          <div class="dateBox" v-if="doneData && dateTable">
            <div class="dates" v-for="(item,o) in dateTable"  :key="'fbd'+o"> <!-- hot war -->
                <div class="itembox" v-for="(v,j) in item.index" :class="[{'light':v.isToday},{'blank':!v.isCurmonth}]"  @click="showDetail(v)" :key="'bd'+j">
                  <div class="tile">
                    <i class="hotpoint" v-if="senDays[v.date] && senDays[v.date]._red"><i>敏感日</i></i>
                    <i class="warpoint" v-if="senDays[v.date] && senDays[v.date]._war"><i>节假日</i></i>
                  <span v-if="v.code!=0" :class="{'red':v.weekDay==0 || v.weekDay==6}">{{v.code}} <i>({{v.oldCode}})</i></span>
                  </div>
                  
                  <div class="blists" v-if="doneData && doneData[v.date]">
                    <!-- <template v-for="(t,j) in doneData[v.date]" v-if="j < 1 ">
                      <p ><b v-for="(o,p) in t" v-if="o.personRoleType == 1">{{o.personName}}</b><i v-for="(o,p) in t" v-if="o.personRoleType == 2">{{t.personName}}</i> </p>
                    </template> -->
                    <template v-for="(t,j) in doneData[v.date]" >
                      <p  v-if="j < 1 " :key="'ld'+j">
                        <b >带班领导</b>{{ t | findLeader(1)}}
                      </p>
                    </template>
                    <template v-for="(t,j) in doneData[v.date]" >
                      <p  v-if="j < 1 " :key="'md'+j">
                        <b >值班人员</b>{{ t | findLeader(2)}}
                      </p>
                    </template>
                    <!-- <p v-for="(t,j) in v.data" v-if="j < 2 "><b>{{t.dutyPersonPosition}}</b>{{t.dutyPersonName}} </p> -->
                  </div>
                  <div class="nomes" v-else>未安排值班</div>
                </div>
                
              </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
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
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane  v-for="(item,j) in detailData" :key="'time'+j" :label="(j+1)+'班'" :name="'tab'+j">
            <div class="dutyTable">
              <div style="height:100%">
                <el-scrollbar class="scroll" style="height:100%">
                  <div class="time">
                    <span  class="lable">值班时间</span>
                    <div>
                      <span>
                        {{item.startTime.substr(0,16)}}   至   {{item.endTime.substr(0,16)}}
                        <i class="red" v-if="senDays[click_date] && senDays[click_date]._red">敏感日</i>
                        <i class="yel" v-if="senDays[click_date] && senDays[click_date]._war">节假日</i>
                      </span>
                    </div>
                  </div>
                  <div class="leader">
                    <span  class="lable">带班领导</span>
                    <div>
                      <template v-for="v in item.personList">
                        <span :key="'ld'+v.uid"  v-if="v.personRoleType==1">{{v.personName}} <b>({{v.personTelephone}})</b></span>
                      </template>
                      <span v-if="item.personList.filter(v=>v.personRoleType==1).length==0">-</span>
                    </div>
                  </div>
                  <div class="members">
                    <span class="lable">值班人员</span>
                    <div>
                      <template v-for="v in item.personList">
                      <span :key="'mb'+v.uid" v-if="v.personRoleType==2">{{v.personName}} <b>({{v.personPositionName}})</b><b> {{v.personTelephone}}</b></span>
                      </template>
                      <!-- <span v-for="v in 15">周三 <b>(值班领导)</b><b > 13400000001</b></span> -->
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
     
    </el-dialog>
    <el-dialog
      :visible.sync="exportDuty"
      :close-on-click-modal="true"
      title="选择导出的时间"
      width="450px"
      top="30vh"
      class="modyfi">
      <div>
        <el-date-picker
          v-model="Exportdate"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期" style="width:100%">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportDuty = false">取 消</el-button>
        <el-button type="primary" @click="confirmDuty">确 定</el-button>
      </span>
    </el-dialog>
   
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { formatDate } from "@/utils/util.js";
import {getDutyList,getIsDay} from "@/views/index/api/onDuty/api.zr.js";
import { exportFn } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
export default {
   components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "编排班查询"}, {name: "浏览值班表"}],
      value:'2020',
      yearMonth:'',
      dateTable:[],
      row:0,
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      hightBox:[],
      today:'',
      lookDuty:false,
      exportDuty:false,
      activeName:'tab0',
      Exportdate:[],
      startDate:null,
      endDate:null,
      doneData:null,
      detailData:[],
      senDays:{},
      click_date:''
    };
  },
  mounted() {
     let day = new Date()
    this.searchDate  = day.getFullYear()+'-'+((day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1))
    this.today = day.getFullYear()+'-'+((day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1))+'-' + (day.getDate()>9?day.getDate():'0'+day.getDate())
    this.yearMonth = day.getFullYear()+'-'+((day.getMonth()+1)>9?(day.getMonth()+1):'0'+(day.getMonth()+1))
    this.drawTable(this.searchDate)
  },
  methods: {
    //确认导出
    confirmDuty(){
     
      let start = this.Exportdate[0] +' 00:00:00'
      let end = this.Exportdate[1] +' 23:59:59'
      let key =  null
      let exportUrl = ajaxCtx.uem+'/duty/work-schedule-service/export'
      let params = {
        startTime:start,
        endTime:end,
        personName:key
      }
      // getExportSchedule(params).then(res=>{
      //   console.log(res);
        
      // }).catch(e=>{console.log('e',e)})
      let fileName = this.userInfo.dutyUserInfo.unitName +'值班编排表'
      let extName="xls"
    
      exportFn(exportUrl,params,fileName,extName)
       this.exportDuty = false
      // 导出
    },
    //查询是否是特殊日子
    getIsDay(d){
      getIsDay(d).then(res=>{
        if(res && res.code==="00000000"){
             this.senDays = {}
            res.data.forEach(el => {
              //red 敏感日  war 节假日
              if(!this.senDays[el.date]){
                
                if(el.count){
                  this.senDays[el.date]={}
                  if(el.type==1){
                    this.senDays[el.date]['_war']=1
                  }
                  if(el.type==2){
                    this.senDays[el.date]['_red']=1
                  }
                }
              }else{
                if(el.count){
                  if(el.type==1){
                    this.senDays[el.date]['_war']=1
                  }
                  if(el.type==2){
                    this.senDays[el.date]['_red']=1
                  }
                }
              }
              
            });

        }
        
      }).catch(e=>{
        console.error('error',e);
      })
    },
    //选择不同年月方法
    changeYM(){
      this.row = 0
      this.drawTable(this.yearMonth)
    },
    //更改月份
    changeMonth(v){
      let year = this.yearMonth.substr(0,4)
      let month = this.yearMonth.substr(5,2)
      month = parseInt(month)+v
      if(month == 13){
        month =1
        year = parseInt(year)+v
      }
      if(month == 0){
        month = 12
        year = parseInt(year)+v
      }
      this.yearMonth = year + '-'+( month>9?month:'0'+month)
      this.row = 0
      this.drawTable(this.yearMonth)
    },
    //制作日历表格
    drawTable(date){
      this.dateTable=[]
      let cur_date = new Date(); //当天
      let cur_month = cur_date.getMonth(); //当月
      cur_date.setDate(1);
      let pre_date = new Date();
        pre_date.setDate(1);
      if(date){
        cur_date = new Date(date+'-01')
        pre_date = new Date(date+'-01')
        cur_month = cur_date.getMonth(); //当月
      }
       //当月一号
      if(cur_date.getDay()!=1){//如果1号不是星期一
      //输出1号前面空白的星期
        this.dateTable.push({
          index:[]
        })
        for (let i = 1; i < (cur_date.getDay() || 7); i++) {
          pre_date.setDate(pre_date.getDate() - 1);
          let oldobj=this.sloarToLunar(pre_date.getFullYear(),(pre_date.getMonth()+1),pre_date.getDate())
          let y = pre_date.getFullYear()
        let m = (pre_date.getMonth()+1)>9?(pre_date.getMonth()+1):('0'+(pre_date.getMonth()+1))
        let d = (pre_date.getDate())>9?(pre_date.getDate()):('0'+pre_date.getDate())
        let key = y + "-"+ m + "-" + d
          this.dateTable[this.row].index.unshift({
            date:key,
            code:pre_date.getDate(),
            oldCode:oldobj.lunarDay,
            weekDay:pre_date.getDay(),
            isToday:key==this.today,
            isHotday:false,
            isCurmonth:this.yearMonth == (y + "-"+ m ),
          })
          
        }
      }
      
      
      while(cur_date.getMonth()== cur_month || cur_date.getMonth() == cur_month+1 || cur_date.getMonth()==0){
        if (cur_date.getDay() == 1) {//星期一时换行<tr>
          if(this.dateTable.length>0){
            this.row +=1 
          }
          if(this.row>5){
            break
          }
          this.dateTable.push({
            index:[]
          })
        }
         
        let y = cur_date.getFullYear()
        let m = (cur_date.getMonth()+1)>9?(cur_date.getMonth()+1):('0'+(cur_date.getMonth()+1))
        let d = (cur_date.getDate())>9?(cur_date.getDate()):('0'+cur_date.getDate())
        let key = y + "-"+ m + "-" + d
        let oldobj=this.sloarToLunar(y,m,d)
        this.dateTable[this.row].index.push({
            date:key,
            code:cur_date.getDate(),
            oldCode:oldobj.lunarDay,
            weekDay:cur_date.getDay(),
            isToday:key==this.today,
            isHotday:false,
            isCurmonth:this.yearMonth == (y + "-"+ m ),
          })
        cur_date.setDate(cur_date.getDate() + 1);
       
      }
      
      this.startDate = this.dateTable[0].index[0].date +' 00:00:00'
      this.endDate =this.dateTable[5].index[6].date +' 23:59:59'
      this.getTabList({
        "where.startTime":this.startDate,
        "where.endTime":this.endDate,
        "pageNum":1,
        "pageSize":168,
        'orderBy':'start_time',
        'order':'asc'
      })
      this.getIsDay({
        'startDate':this.dateTable[0].index[0].date,
        'endDate':this.dateTable[5].index[6].date
      })
      
    },
    //取得值班信息数据
    getTabList(d){
      getDutyList(d).then(res=>{
        if(res && res.code==="00000000"){
          let dateKeys={}
          if(res.data.list && res.data.list.length>0){
            res.data.list.map(el=>{
              let key = el.startTime.substr(0,10)
              if(dateKeys[key]){
                dateKeys[key].push(el)
              }else{
                dateKeys[key] = []
                dateKeys[key].push(el)
              }
            })
          }
          
          this.doneData = dateKeys
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
    //展示详情方法
    showDetail(obj){
      // console.log('obj',obj);
      this.click_date = obj.date
      if(this.doneData[obj.date] && this.doneData[obj.date].length>0){
        this.lookDuty = true
        this.activeName = "tab0"
        this.detailData = this.doneData[obj.date]
      }else{
        if (document.getElementsByClassName('el-message').length === 0) {
          this.$message({
            type: 'info',
            message: '该日没有值班信息'
          });  
        }
        
      }
      
      
    }
    
  },
  filters: {
    //过滤器 过滤出一个领导 一个值班人员
   findLeader(val,index) {
     if(!val){ return}
     let obj = val.personList.filter(h=>h.personRoleType==index)
     if(obj && obj.length>0){
       let newb = obj[0]
      return newb.personName
     }else{
       return '-'
     }
      
   }
  }
};
</script>
<style lang="scss" scoped>

.modyfi{
  .conment{
    height: auto;
  }
  .title{
    b{
      font-size: 18px;
    }
    span{
      font-size: 14px;
      color: $font_666;
      padding-left: 20px;
    }
  }
  .conment{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .dutyTable{
      border-top: solid 1px  #E5EAF4;
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
  
  /deep/ .el-dialog__body{
    padding: 10px 20px 20px 20px;
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
    border: 1px solid #E4E7ED;
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item {
    border: 1px solid #E4E7ED !important;
     margin-right: 10px;
     border-top-left-radius: 10px;
     border-top-right-radius: 10px;
     width: 100px;
     text-align: center;
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    // border-bottom-color: #FFF;
    color: #ffffff;
    background: $main_color;
   
  }
  /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border: none;
  }
}
.dutyBox{
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  height: calc(100% - 60px);
  .dayBox{
     height: calc(100% - 40px);
  }
  .timeTitle{
    display: flex;
    justify-content: space-between;
  }
  .minWidth{
    width: 120px;
    margin: 0px 10px;
  }
  .redDay{
    line-height: 40px;
    display: inline-block;
    font-size: 14px;
    position: relative;
    padding-left: 20px;
    padding-right: 30px;
    &::before{
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      content: '';
      background: #FA453A;
      border-radius: 50%;
      top: 15px;
      left: 0;
    }
  }
  .yelDay{
     line-height: 40px;
    display: inline-block;
    font-size: 14px;
    position: relative;
    padding-left: 20px;
    padding-right: 30px;
    &::before{
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      content: '';
      background: #FFBB00;
      border-radius: 50%;
      top: 15px;
      left: 0;
    }
  }
  .weeks{
    margin-top: 20px;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    text-align: center;
    background: #F0F2F5;
    padding: 10px 0px;
    color: #232426;
    span{
      flex: 1;
    }
    .red{
      color: #FA453A;
    }
  }

.dateBox{
   margin-top: 20px;
  border-left: solid 1px #E5EAF4;
  border-top: solid 1px #E5EAF4;
  border-radius: 6px;
  .dates:first-child{
    .itembox:first-child{
      border-top-left-radius:6px ;
    }
    .itembox:last-child{
      border-top-right-radius:6px ;
    }
  }
  .dates:last-child{
    .itembox:first-child{
      border-bottom-left-radius:6px ;
    }
    .itembox:last-child{
      border-bottom-right-radius:6px ;
    }
  }
}
.dates{
  .nomes{
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 25px);
  }
 .blists{
  //  margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: 14px 0px;
    justify-content: space-between;
    // align-items: center;

    p{
      text-align: left;
      font-size: 12px;
      line-height: 22px;
      padding-left: 15%;
      height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      b{
        font-weight: normal;
        border: solid 1px #C3C9D8;
        border-radius: 12px;
        height: 18px;
        line-height: 16px;
        display: inline-block;
        width: 60px;
        text-align: center;
        margin-right: 5px;
        
        // color: #ffffff;
      }
    }
  }
  display: flex;
  flex-direction: row;
  text-align: center;
  background: #ffffff;
  padding: 0px;
  height: 100px;
  color: $font_666 ;
  border-radius: 6px;
  
  .itembox{
    cursor: default;
    user-select: none;
    flex: 1;
    position: relative;
    cursor:initial;
    border-right: solid 1px #E5EAF4;
    border-bottom: solid 1px #E5EAF4;
    width: 14.28%;
    &:hover{
      cursor: pointer;
    }
    .tile{
      height: 25px;
      // text-align: left;
      position: relative;
    }
    .hotpoint{
      z-index: 1;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #FA453A;
      border-radius: 50%;
      margin: 10px 0px 0px 18px;
      float: left;
      position: relative;
      &+i{
        margin-left: 5px;
      }
      i{
        display: none;
        // padding: 2px 6px;
        font-size: 12px;
        border: solid 1px #FA453A;
        border-radius: 4px;
        color: #FA453A;
        position: absolute;
        width: 45px;
        text-align: center;
        font-style: normal;
        top: -22px;
        background: #ffffff;
        left: -18px;
      }
      &::before{
        position: absolute;
        content: '';
        display: none ;
        width: 5px;
        height: 5px;
        top: -7px;
        left: 3px;
        z-index: 1;
        background: #ffffff;
        transform:rotate(-45deg);
        border-left: solid 1px #FA453A;
         border-bottom: solid 1px #FA453A;
      }
      &:hover{
        i{
          display: inline-block;
        }
        &::before{
          display: inline-block;
        }
      }
    }
    .warpoint{
      z-index: 1;
      border-radius: 50%;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #FFB400;
      margin: 10px 0px 0 18px;
      float: left;
      position: relative;
       i{
        display: none;
        // padding: 2px 6px;
        font-size: 12px;
        border: solid 1px #FFB400;
        border-radius: 4px;
        color: #FFB400;
        position: absolute;
        width: 45px;
        text-align: center;
        font-style: normal;
        top: -22px;
        background: #ffffff;
        left: -18px;
      }
      &::before{
        position: absolute;
        content: '';
        display: none ;
        width: 5px;
        height: 5px;
        top: -7px;
        left: 3px;
        z-index: 1;
        background: #ffffff;
        transform:rotate(-45deg);
        border-left: solid 1px #FFB400;
         border-bottom: solid 1px #FFB400;
      }
      &:hover{
        i{
          display: inline-block;
        }
        &::before{
          display: inline-block;
        }
      }
    }
    span{
      position: absolute;
      right: 0px;
      left: 0px;
      top: 5px;
      color: $font_333 ;
      font-size: 16px;
      font-weight: bold;
      i{
        font-size: 12px;
        color: $font_666;
        font-style: normal;
        font-weight: normal;
      }
      &.red{
      color: #FA453A;
      }
    }
    
  }
  .itembox:hover{
    // .moreList{
    //   display: block;
    // }
    // p{
    //   color: #ffffff;
    // }
    box-shadow: 0px 0px 2px 3px $main_color inset;
    // background:$main_color;
  }
  .hot{
    background:#FFF2F1;
  }
  .war{
    background:#FFFCEF;
  }
  .blank{
    color: #BFBFBF;
    span{
      color: #BFBFBF;
      i{
        color:#BFBFBF ;
      }
    }
    .red{
      color: #BFBFBF !important;
    }
  }
  .light{
    background:$main_color;
    color: #ffffff;
    span{
      color: #ffffff;
      i{
        color:#EDEDFF ;
      }
    }
    .blists{
      p b{
         background:rgba(255,255,255,0.3);
         border: none;
         font-size: 12px;
      }
    }
  }
  
}
// .dates:nth-child(2n-1){
//   background: #14407D;
// }
  /deep/ .el-button.min:focus, .el-button.min:hover{
    background: #5458FD;
    border-color: #5458FD;
    color: #ffffff;
  }
  /deep/ .el-button.min{
    border-color: #DCDFE6;
    background: #ffffff;
    color: $font_999;
  }
}
/deep/ .dutyTable .el-scrollbar__wrap{
  margin-bottom: 0px !important;
}
</style>
