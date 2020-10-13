/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:37 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-28 08:59:06
 */
<template>
  <div class="editduty">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      
      <div class="boxFlex">
        <div class="wid_380">
          <div class="userList">
            <div class="tab">
              <span>可替班人员</span>
            </div>
            <div class="seacher">
              <el-input placeholder="搜索姓名。支持汉字，全拼，首拼" v-model="keyword" suffix-icon="el-icon-search" class="input-key" @input="seacherKey">
            </el-input>
            </div>
            <div class="users" >
              <el-scrollbar class="scroll" style="height:100%;">
              <ul>
                <li v-if="userData.length == 0">
                  <span>没有匹配到对应人员</span>
                </li>
                <li class="flex"  draggable="true" v-for="(item,i) in userData"  @dragstart="drag($event,item)" :key="'key'+i" >
                  <div>{{item.name}} </div>
                  <div>
                    <span class="postion">{{item.roleName}}</span> 
                  </div>
                </li>
                
              </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="wid_all">
          <el-form ref="form" :model="form" >
            <el-form-item label="值班日期">
              <el-date-picker type="date"  value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.date1" @change="getDutyData"  :picker-options="pickerOptionsStart" ></el-date-picker>
            </el-form-item>
          </el-form>
          <div class="timeLab">
            <ul>
              <template v-for="(item,index) in listDuty">
                <li   :key="'id'+index"  :class="{'active':active===index}" @click="changeSelect(index)" v-if="nowTime<item._dTimes">{{item._startTime}} - {{item._endTime}}</li>
                  <li  :key="'indexs'+index" :class="[{'lood':nowTime>item._dTimes}]"  v-else>{{item._startTime}}-{{item._endTime}}  <span class="invalid">已失效</span> </li>
                </template>
              
              <!-- <li class="lood"  >8:00-18:00 <span class="invalid">已失效</span></li>
              <li :class="{'active':active==2}" @click="changeSelect(2)">18:00 - 22:00</li>
              <li :class="{'active':active==3}" @click="changeSelect(3)">23:00 -次日8:00</li> -->
            </ul>
            <div class="leaderA" >
              <p>带班领导</p>
              <div class="classT" v-if="listDuty && listDuty.length>0 && nowTime<listDuty[active]._dTimes">
                <template  v-for="(obj,bt) in listDuty[active].personList">
                <div class="item"  :key="'bto'+bt"  :class="[{'hover':obj.checked},{'select':obj.selected}]"     @drop="drop($event,obj,listDuty[active].uid)" @dragover.prevent="allowDrop($event,obj,listDuty[active].uid)"   @dragleave="leaveDrop($event,obj)"  v-if="obj.personRoleType == 1 && !obj.selected ">
                  <img src="_assets/img/icons/boy.png" alt="">
                  <span class="name">{{ obj.personName}}</span> <span class="postion">带班领导</span>
                  
                </div>
                <div class="item" :key="'bto'+bt" :class="[{'hover':obj.checked},{'select':obj.selected}]" v-else-if="obj.personRoleType == 1 && obj.selected">
                  <img src="_assets/img/icons/boy.png" alt="">
                  <span class="name">{{obj.newDuty && obj.newDuty.name || obj.personName}}</span> <span class="postion">带班领导</span>
                  <i class="el-icon-refresh" @click="resetItem(obj,1)" v-if="obj.selected"></i>
                  <div v-if="obj.selected">
                    <span class="change">替班</span>
                    <span class="postion">{{obj.personName}}</span>
                    <span class="font999">带班领导</span>
                  </div>
                  
                </div>
                </template>
              </div>
            </div>
            <div class="members" >
              <p>值班员</p>
              <div class="classT" v-if="listDuty && listDuty.length>0  && nowTime<listDuty[active]._dTimes">
                <template v-for="(obj,bt) in listDuty[active].personList" >
                  <div class="item" :key="'bt'+bt" :class="[{'hover':obj.checked},{'select':obj.selected}]"     @drop="drop($event,obj,listDuty[active].uid)" @dragover.prevent="allowDrop($event,obj,listDuty[active].uid)"   @dragleave="leaveDrop($event,obj)"  v-if="obj.personRoleType == 2 && !obj.selected ">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.personName}}</span> <span class="postion">{{obj.personPositionName}}</span>
                    
                  </div>
                  <div class="item" :key="'bt'+bt" :draggable="!obj.selected" :class="[{'hover':obj.checked},{'select':obj.selected}]" v-else-if="obj.personRoleType == 2 && obj.selected">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.newDuty && obj.newDuty.name || obj.personName}}</span> <span class="postion">{{obj.newDuty && obj.newDuty.personPositionName || obj.personPositionName}}</span>
                    <i class="el-icon-refresh" @click="resetItem(obj,1)" v-if="obj.selected"></i>
                    <div v-if="obj.selected">
                      <span class="change">替班</span>
                      <span class="postion">{{obj.personName}}</span>
                      <span class="font999">{{obj.personPositionName}}</span>
                    </div>
                    
                  </div>
                </template>
                
              </div>
            </div>
          </div>

          <div class="sumb">
            <el-button @click="reset">取 消</el-button>
            <el-button type="primary" @click="onSubmit">保 存</el-button>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import {userInfo} from "_conf/testData.js";
import {getDutyList,getUserList,putScheduleReplace} from "@/views/index/api/onDuty/api.zr.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "编排班管理"}, {name: "替班管理"}],
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 24*60*60*1000;
        }
      },
      form:{
        date1:''
      },
      userData: [],
      active:0,
      keyword:'',
      listDuty:[],
      changeList:[],
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      replaceDtoList:[],
      nowTime:null
      // checked:false
    };
  },
  mounted() {
    let atime = new Date()
    this.nowTime  = atime.getTime()
   this.getUserList()
  },
  methods: {
    //查询人员
    seacherKey(){
      this.keyword = this.keyword.replace(/\s*/g,"")
      this.getUserList({
        queryName:this.keyword
      })
    },
    //单个信息重置
    resetItem(v){
      let a = this.replaceDtoList.findIndex(el=>el.workScheduleUid == v.scheduleUid)
      let b = this.replaceDtoList[a].personDtos.findIndex(el=>(el.personOriginUid==v.personUid && el.personRoleType==v.personRoleType && el.personReplaceUid == v.newDuty.uid))
      this.replaceDtoList[a].personDtos.splice(b,1)
      if(this.replaceDtoList[a].personDtos.length==0){
        this.replaceDtoList.splice(a,1)
      }
      v.selected = false
      v.newDuty = null
    },
    //获取可排班用户
    getUserList(d){
      getUserList(d).then(res=>{
        if(res && res.code === '00000000'){
         this.userData = res.data
        }else{
          console.log('error',res.viewMsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    //取当日值班信息
    getDutyData(){
      this.active = 0
      if(!this.form.date1){
        this.listDuty = []
        return
      }
      let time={
        'where.unitUids':this.userInfo.dutyUserInfo.unitUid,
        'where.startTime':this.form.date1+' 00:00:00',
        'where.endTime':this.form.date1+' 23:59:59',
        'orderBy':'start_time',
        'order':'asc'
      }
      
      getDutyList(time).then(res=>{
        if(res && res.code==="00000000" && res.data){
          res.data.list.map(el=>{
            el.personList.map(j=>{
              j.checked = false
              j.selected = false
            })
          let ydm = el.startTime.split(" ")
          let end = el.endTime.split(" ")
          el._startTime = ydm[1].substr(0,5)
          if(end[0] == this.form.date1){
            el._endTime = end[1].substr(0,5)
          }else{
            el._endTime = '次日'+end[1].substr(0,5)
          }
          
          el._dTimes = new Date(el.endTime).getTime()
          if(isNaN(el._dTimes)){
            el._dTimes = new Date(el.endTime.replace("-","/")).getTime()
          }
          if(this.nowTime>el._dTimes){
            this.active +=1 
          }
        })
        if(this.active == res.data.list.length ){
          this.active = 0
        }
        this.listDuty = res.data.list
         
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
      //开始拖动时
    drag(ev,obj){
      // console.log('thi',this.userData);
      this.curItem=obj
      // this.curUid=uid
      let data = JSON.stringify(obj)
      ev.dataTransfer.setData("text",data);
    },
      //经过放置区时
    allowDrop(ev,obj) {
      let a = this.curItem.roleName == '带班领导' && obj.personRoleType==1
      let b = this.curItem.roleName == '值班人员' && obj.personRoleType==2 
      let c = obj.personUid != this.curItem.uid
      if((a || b) && c){
        obj.checked = true
      }
      // if(&& obj.personUid != this.curItem.uid)
      // ev.preventDefault();
    },
      //离开放置区时
    leaveDrop(ev,obj){
      let a = this.curItem.roleName == '带班领导' && obj.personRoleType==1
      let b = this.curItem.roleName == '值班人员' && obj.personRoleType==2 
      let c = obj.personUid != this.curItem.uid
      if((a || b) && c){
        obj.checked = false
      }
       
    },
      //放下时
    drop(ev,obj,uid){
      // console.log('ev2',obj);
      let a = this.curItem.roleName == '带班领导' && obj.personRoleType==1
      let b = this.curItem.roleName == '值班人员' && obj.personRoleType==2 
      let c = obj.personUid != this.curItem.uid
      let d = ((a || b) && c)
      
      if (d){
        // let data=JSON.parse(ev.dataTransfer.getData("item"));
        // this.curItem.selected = true
        // this.curItem.checked = false
        obj.selected = true
        obj.checked = false
        // this.curItem.newDuty = obj
        obj.newDuty = this.curItem
        let changeList=[]
        changeList.push({
          "personOriginUid": obj.personUid,
          "personPositionUid": obj.personPostion,
          "personReplaceUid": this.curItem.uid,
          "personRoleType": obj.personRoleType
        })
        if(this.replaceDtoList.length>0){
          let index = this.replaceDtoList.findIndex(el=>el.workScheduleUid == uid)
          if(index == -1){
            this.replaceDtoList.push({
              personDtos:changeList,
              workScheduleUid:uid
            })
          }else{
            this.replaceDtoList[index].personDtos.push.apply(this.replaceDtoList[index].personDtos,changeList)
          }
        }else{
          this.replaceDtoList.push({
            personDtos:changeList,
            workScheduleUid:uid
          })
        }
        
        // personDtos

        // this.workScheduleUid = uid

        
      }

    },
    //切换班次信息
    changeSelect(v){
      this.active = v
    },
    //提交替班信息
    onSubmit(){
    if(this.replaceDtoList && this.replaceDtoList.length==0){
      if(document.getElementsByClassName("el-message") && document.getElementsByClassName("el-message").length==0){
        this.$message({
          type:'warning',
          message:'请先选择要替班的人员及班次信息'
        })
      }
      return
    }
     let data={
       replaceDtoList:this.replaceDtoList
     }
     putScheduleReplace(data).then(res=>{
       if(res && res.code==="00000000"){
         this.$message({
            type:'success',
            message:'替班成功'
          })
          this.replaceDtoList=[]
          this.getDutyData()
       }
     }).catch(e=>{
       console.error('e=>',e);
       
     })
     
    },
    //重置替班信息
    reset(){
      this.changeList=[]
      this.getDutyData()
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
    .sumb{
      margin-top: 20px;
      text-align: center;
    }
    .flex{
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      height: auto;
    }
    /deep/ .el-date-editor .el-range-input{
      width: 42%;
    }
    /deep/ .el-form--inline .el-form-item{
      margin-bottom: 0px;
    }
    .boxFlex{
      height: calc(100% - 30px);
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .wid_380{
        min-width: 260px;
        width: 25%;
        max-width: 380px;
        height: 100%;
      }
      .wid_all{
        flex: 1;
        margin-left: 20px;
       
      }
    }
    .timeLab{
      border:1px solid rgba(215,217,225,1);
      border-radius: 6px;
      background:#F7F9FC ;
        ul{
         background: $main_color;
         border-top-left-radius: 6px;
         border-top-right-radius: 6px;
         display: flex;
         flex-direction: row; 
         padding-top: 10px;
         padding-left: 10px;
         padding-right: 10px;
         height: 40px;
         li{
           user-select: none;
           flex: 1;
          //  padding-left:10px;
          //  padding-right: 10px;
           margin-left: 15px;
           margin-right: 15px;
           line-height: 30px;
           text-align: center;
           color: #ffffff;
           cursor: pointer;
           &:hover{
            background: rgba(255, 255, 255, 0.1);
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
           }
           &.lood{
             color: #8183FF;
           }
           .invalid{
             color: #5357FD;
             background: #ffffff;
             border-radius: 10px;
             font-size: 12px;
             padding: 0 4px;
           }
         }
         li.active{
           color: $main_color;
           background: #ffffff;
           border-top-left-radius: 6px;
            border-top-right-radius: 6px;
         }
        }
      .leaderA{
        border-bottom: solid 1px #D7D9E1;
        padding-bottom: 10px;
        margin: 20px;
        line-height: 35px;
        color: $waring_color;
        font-weight: bold;
        .classT{
          text-align: left;
          .item{
            
            position: relative;
            margin: 0px 10px 10px 0;
            width: 166px;
            height: 66px;
            padding: 10px;
            border-radius: 6px;
            float: left;
            color: $font_333;
            line-height: 24px;
            .name{
              font-size: 14px;
              font-weight: bold;
              vertical-align: middle;
              margin-right: 5px;
            }
            img{
              vertical-align: middle;
              width: 14px;
              margin-right: 5px;
            }
            .postion{
              font-size: 12px;
              color: $font_666;
              font-weight: normal;
              vertical-align: middle;
            }
            i{
              position: absolute;
              right: -3px;top: -3px;
              background: $waring_color;
              color: #ffffff;
              padding: 2px;
              border-radius: 50%;
              cursor: pointer;
              display: none;
            }
            
            div{
              display: none;
              text-align: right;
            }
            &.select{
               background: #E7E7E7;
               i{
                 display: inline-block;
               }
               div{
                 display: block;
               }
            }
            &.hover{
              border: dashed 1px  #8D8D8D;
            }
            .font999{
              color: $font_999;
              font-size: 12px;
              font-weight: normal;
              vertical-align: middle;
              margin-right: 5px;
              margin-left: 5px;
            }
            .change{
              font-size: 12px;
              font-weight: normal;
              color: $waring_color;
               vertical-align: middle;
               margin-right: 5px;
            }
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
          
        }
       
      }
      .members{
        padding-bottom: 10px;
        margin: 20px;
        line-height: 35px;
        color: $font_333;
        font-weight: bold;
        .classT{
          text-align: left;
          .item{
            
            position: relative;
            margin: 0px 10px 10px 0;
            width: 166px;
            height: 66px;
            padding: 10px;
            border-radius: 6px;
            float: left;
            color: $font_333;
            line-height: 24px;
            .name{
              font-size: 14px;
              font-weight: bold;
              vertical-align: middle;
              margin-right: 5px;
            }
            img{
              vertical-align: middle;
              width: 14px;
              margin-right: 5px;
            }
            .postion{
              font-size: 12px;
              color: $font_666;
              font-weight: normal;
              vertical-align: middle;
            }
            i{
              position: absolute;
              right: -3px;top: -3px;
              background: $waring_color;
              color: #ffffff;
              padding: 2px;
              border-radius: 50%;
              cursor: pointer;
              display: none;
            }
            
            div{
              display: none;
              text-align: right;
            }
            &.hover{
              border: dashed 1px  #8D8D8D;
            }
            &.select{
               background: #E7E7E7;
               i{
                 display: inline-block;
               }
               div{
                 display: block;
               }
            }
            .font999{
              color: $font_999;
              font-size: 12px;
              font-weight: normal;
              vertical-align: middle;
              margin-right: 5px;
              margin-left: 5px;
            }
            .change{
              font-size: 12px;
              font-weight: normal;
              color: $waring_color;
               vertical-align: middle;
               margin-right: 5px;
            }
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
          
        }
       
      }
    }
    .userList{
      height: 100%;
      background:rgba(244,246,251,1);
      .tab{
         background: $main_color;
         border-top-left-radius: 6px;
         border-top-right-radius: 6px;
         display: flex;
         flex-direction: row; 
         padding-top: 10px;
         padding-bottom: 10px;
         padding-left: 20px;
         color: #ffffff;
      
      }
      .seacher{
        padding: 10px 0px;
        margin:0px 10px;
        .input-key{
          /deep/ .el-input__inner{
            border-radius: 20px;
          }
        }
      }
      .users{
        // margin-top: 10px;
        height: calc(100% - 100px);
        li{
          padding:0px 15px;
          line-height: 40px;
          cursor: default;
          user-select: none;
          &:hover{
            background:#E2EAFF;
          }
          .postion{
            color: $font_666;
            padding-right: 5px;
          }
          .noral{
            color: $font_999;
             padding-right: 5px;
          }
        }
      }
    }
  }
</style>


