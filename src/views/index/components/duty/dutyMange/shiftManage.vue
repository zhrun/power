/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:34 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-29 10:54:05
 */
<template>
  <div class="editduty">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      <el-scrollbar class="scroll" style="height:100%;">
        <div class="info">
          <h5>操作提示</h5>
          <p>1：首先，请选择需要进行换班的日期和值班时间段。</p>
          <p>2：然后，选中一个值班时间段下的目标人员，拖拽到另一个值班时间段的相应人员位置，即可完成换班。</p>
          <p>3：注意：带班领导只能和带班领导换班，值班员只能和值班员换班，不能交叉。</p>
        </div>
        <div class="boxFlex">
          <div class="wid_all">
            <el-form ref="form" :model="formOne" >
              <el-form-item label="值班日期">
                <el-date-picker type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" v-model="formOne.date" @change="getDutyData(1)" :picker-options="pickerOptionsStart"></el-date-picker>
              </el-form-item>
            </el-form>
            <div class="timeLab">
              <ul>
                <template v-for="(item,index) in listOne">
                  <li  :key="'indexs'+index" :class="[{'active':active===index}]" @click="changeSelect(index)" v-if="nowTime<item._dTimes">{{item._startTime}}-{{item._endTime}}</li>
                  <li  :key="'indexs'+index" :class="[{'lood':nowTime>item._dTimes}]"  v-else>{{item._startTime}}-{{item._endTime}}  <span class="invalid">已失效</span> </li>
                </template>

              </ul>
              <div class="leaderA" >
                <p>带班领导</p>
                <div class="classT" v-if="listOne && listOne.length>0   && nowTime<listOne[active]._dTimes">
                  <template  v-for="(obj,ld) in listOne[active].personList">
                  <div class="item" :key="'ld'+ld" :class="[{'hover':obj.checked},{'select':obj.selected}]"  :draggable="!obj.selected && nowTime<listOne[active]._dTimes"   @drop="drop($event,obj,listOne[active].uid,2)" @dragover.prevent="allowDrop($event,obj,listOne[active].uid)"   @dragleave="leaveDrop($event,obj)" @dragstart="drag($event,obj,listOne[active].uid)" v-if="obj.personRoleType == 1 && !obj.selected ">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{ obj.personName}}</span> <span class="postion">带班领导</span>
                    
                  </div>
                  <div class="item" :draggable="!obj.selected  && nowTime<listOne[active]._dTimes" :class="[{'hover':obj.checked},{'select':obj.selected}]" :key="'ld'+ld" v-else-if="obj.personRoleType == 1 && obj.selected">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.newDuty && obj.newDuty.personName || obj.personName}}</span> <span class="postion">带班领导</span>
                    <i class="el-icon-refresh" @click="resetItem(obj,1)" v-if="obj.selected"></i>
                    <div v-if="obj.selected">
                      <span class="change">换班</span>
                      <span class="postion">{{obj.personName}}</span>
                      <span class="font999">带班领导</span>
                    </div>
                    
                  </div>
                  </template>
                </div>
              </div>
              <div class="members" >
                <p>值班员</p>
                <div class="classT" v-if="listOne && listOne.length>0  && nowTime<listOne[active]._dTimes">
                  <template v-for="(obj,ber) in listOne[active].personList" >
                    <div class="item" :key="'ber'+ber" :class="[{'hover':obj.checked},{'select':obj.selected}]"  :draggable="!obj.selected  && nowTime<listOne[active]._dTimes"   @drop="drop($event,obj,listOne[active].uid,2)" @dragover.prevent="allowDrop($event,obj,listOne[active].uid)"   @dragleave="leaveDrop($event,obj)" @dragstart="drag($event,obj,listOne[active].uid)" v-if="obj.personRoleType == 2 && !obj.selected ">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.personName}}</span> <span class="postion">{{obj.personPositionName}}</span>
                    
                  </div>
                  <div class="item" :draggable="!obj.selected  && nowTime<listOne[active]._dTimes" :class="[{'hover':obj.checked},{'select':obj.selected}]"  :key="'ber'+ber" v-else-if="obj.personRoleType == 2 && obj.selected">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.newDuty && obj.newDuty.personName || obj.personName}}</span> <span class="postion">{{obj.newDuty && obj.newDuty.personPositionName || obj.personPositionName}}</span>
                    <i class="el-icon-refresh" @click="resetItem(obj,1)" v-if="obj.selected"></i>
                    <div v-if="obj.selected">
                      <span class="change">换班</span>
                      <span class="postion">{{obj.personName}}</span>
                      <span class="font999">{{obj.personPositionName}}</span>
                    </div>
                    
                  </div>
                  </template>
                  
                </div>
              </div>
            </div>
            
          </div>
          <div class="wid_all">
            <el-form ref="form" :model="formTwo" >
              <el-form-item label="换班日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="formTwo.date" @change="getDutyData(2)"  value-format="yyyy-MM-dd" :picker-options="pickerOptionsStart" ></el-date-picker>
              </el-form-item>
            </el-form>
            <div class="timeLab waring">
              <ul>
                <template  v-for="(item,index) in listTwo">
                  <li :class="[{'active':activet===index}]" @click="changeSelectT(index)" :key="'index'+index" v-if="nowTime<item._dTimes">{{item._startTime}} - {{item._endTime}}</li>
                  <li :class="[{'lood':nowTime>item._dTimes}]"  :key="'index'+index" v-else>{{item._startTime}} - {{item._endTime}} <span class="invalid">已失效</span></li>
                </template>
              </ul>
              <div class="leaderA">
                <p>带班领导</p>
                <div class="classT" v-if="listTwo && listTwo.length>0  && nowTime<listTwo[activet]._dTimes">
                  <template  v-for="(obj,dv) in listTwo[activet].personList">
                  <div class="item" :key="'dv'+dv" :class="[{'hover':obj.checked},{'select':obj.selected}]"  :draggable="!obj.selected  && nowTime<listTwo[activet]._dTimes"   @drop="drop($event,obj,listTwo[activet].uid,1)" @dragover.prevent="allowDrop($event,obj,listTwo[activet].uid)"   @dragleave="leaveDrop($event,obj)" @dragstart="drag($event,obj,listTwo[activet].uid)" v-if="obj.personRoleType == 1 && !obj.selected ">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.personName}}</span> <span class="postion">带班领导</span>
                    
                  </div>
                  <div class="item" :draggable="!obj.selected   && nowTime<listTwo[activet]._dTimes" :class="[{'hover':obj.checked},{'select':obj.selected}]" :key="'dv'+dv" v-else-if="obj.personRoleType == 1 && obj.selected">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.newDuty && obj.newDuty.personName || obj.personName}}</span> <span class="postion">带班领导</span>
                    <i class="el-icon-refresh" @click="resetItem(obj,2)" v-if="obj.selected"></i>
                    <div v-if="obj.selected">
                      <span class="change">换班</span>
                      <span class="postion">{{obj.personName}}</span>
                      <span class="font999">带班领导</span>
                    </div>
                    
                  </div>
                  </template>
                
                </div>
              </div>
              <div class="members" >
                <p>值班员</p>
                <div class="classT" v-if="listTwo && listTwo.length>0 && nowTime<listTwo[activet]._dTimes">
                  <template  v-for="(obj,tv) in listTwo[activet].personList" >
                    <div :key="'dd'+tv" class="item" :class="[{'hover':obj.checked},{'select':obj.selected}]"  :draggable="!obj.selected   && nowTime<listTwo[activet]._dTimes"   @drop="drop($event,obj,listTwo[activet].uid,1)" @dragover.prevent="allowDrop($event,obj,listTwo[activet].uid)"   @dragleave="leaveDrop($event,obj)" @dragstart="drag($event,obj,listTwo[activet].uid)" v-if="obj.personRoleType == 2 && !obj.selected ">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.personName}}</span> <span class="postion">{{obj.personPositionName}}</span>
                    
                  </div>
                  <div class="item" :draggable="!obj.selected   && nowTime<listTwo[activet]._dTimes" :class="[{'hover':obj.checked},{'select':obj.selected}]" v-else-if="obj.personRoleType == 2 && obj.selected" :key="'dd'+tv">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.newDuty && obj.newDuty.personName || obj.personName}}</span> <span class="postion">{{obj.newDuty && obj.newDuty.personPositionName || obj.personPositionName}}</span>
                    <i class="el-icon-refresh" @click="resetItem(obj,2)" v-if="obj.selected"></i>
                    <div v-if="obj.selected">
                      <span class="change">换班</span>
                      <span class="postion">{{obj.personName}}</span>
                      <span class="font999">{{obj.personPositionName}}</span>
                    </div>
                    
                  </div>
                  </template>
                  
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div class="center">
          <el-button @click="reset">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {userInfo} from "_conf/testData.js";
import {getDutyList,putScheduleChange} from "@/views/index/api/onDuty/api.zr.js";

export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData:[{name: "编排班管理"}, {name: "换班管理"}],
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 24*60*60*1000;
        }
      },
      userData:userInfo || [],
      formOne:{date:''},
      formTwo:{date:''},
      listOne:[],
      listTwo:[],
      active:0,
      activet:0,
      changeList:[],
      curItem:null, //开始拖动时保存的拖动obj
      curUid:null,
      workScheduleAUid:'',
      workScheduleBUid:'',
      changeDtoList:[],
      nowTime:null

    };
  },
  mounted() {
    let atime = new Date()
    this.nowTime  = atime.getTime()
  },
  methods: {
    //换班时单个重置
    resetItem(v,t){
      //v 点击的当前对象
      //t   1 点击的左边 2 点击的右边
      this.changeList = this.changeList.filter(el =>(!((el.workUid==v.scheduleUid && el.personUid ==v.personUid && el.personRoleType==v.personRoleType) || (el.workUid==v.newDuty.scheduleUid && el.personUid ==v.newDuty.personUid && el.personRoleType==v.newDuty.personRoleType))));
      if(t==1){
        let aa = this.changeDtoList.findIndex(el=>(el.workScheduleAUid==v.scheduleUid && el.workScheduleBUid ==v.newDuty.scheduleUid))
        let bb = this.changeDtoList[aa].changeList.findIndex(el=>{
          return (el.personRoleType == v.personRoleType && el.personCUid == v.personUid && el.personDUid == v.newDuty.personUid && el.personCPositionUid == v.personPostion && el.personDPositionUid == v.newDuty.personPostion)
        })
        this.changeDtoList[aa].changeList.splice(bb,1)
        if(this.changeDtoList[aa].changeList.length==0){
          this.changeDtoList.splice(aa,1)
        }
      }
      if(t==2){
        let aa = this.changeDtoList.findIndex(el=>(el.workScheduleBUid==v.scheduleUid && el.workScheduleAUid ==v.newDuty.scheduleUid))
        let bb = this.changeDtoList[aa].changeList.findIndex(el=>{
          return (el.personRoleType == v.personRoleType && el.personDUid == v.personUid && el.personCUid == v.newDuty.personUid && el.personDPositionUid == v.personPostion && el.personCPositionUid == v.newDuty.personPostion)
        })
        this.changeDtoList[aa].changeList.splice(bb,1)
        if(this.changeDtoList[aa].changeList.length==0){
          this.changeDtoList.splice(aa,1)
        }
      }
      v.newDuty.selected =false
      v.selected = false
      v.newDuty = null
      

      
    },
    //查询值班信息
    getDutyData(v){
      //当有交替时，没有提交直接更换日期，前端的交替数据清除效果
      if(this.changeList.length>0 || this.changeDtoList.length>0){
        this.changeList=[]
        this.changeDtoList = []
        if(v==1){
          this.getDutyData(2)
        }else{
          this.getDutyData(1)
        }
      }
      let time={}
      if(v==1){
        if(!this.formOne.date){
          this.listOne = []
          return
        }
        this.active = 0
        time={
          'where.startTime':this.formOne.date+' 00:00:00',
          'where.endTime':this.formOne.date+' 23:59:59',
          'orderBy':'start_time',
          'order':'asc'
        }
      }
      if(v==2){
        if(!this.formTwo.date){
          this.listTwo = [] 
          return
        }
        this.activet = 0
        time={
          'where.startTime':this.formTwo.date+' 00:00:00',
          'where.endTime':this.formTwo.date+' 23:59:59',
          'orderBy':'start_time',
          'order':'asc'
        }
      }
      
      getDutyList(time).then(res=>{
        if(res && res.code==="00000000" && res.data){
          
          if(v==1){
            res.data.list.map(el=>{
              el.personList && el.personList.map(j=>{
                j.checked = false
                j.selected = false
              })
              let ydm = el.startTime.split(" ")
              let end = el.endTime.split(" ")
              el._startTime = ydm[1].substr(0,5)
              if(end[0] == this.formOne.date){
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
            this.listOne = res.data.list
            
          }else if(v==2){
            res.data.list.map(el=>{
              el.personList && el.personList.map(j=>{
                  j.checked = false
                  j.selected = false
                })
              let ydm = el.startTime.split(" ")
              let end = el.endTime.split(" ")
              el._startTime = ydm[1].substr(0,5)
              if(end[0] == this.formTwo.date){
                el._endTime = end[1].substr(0,5)
              }else{
                el._endTime = '次日'+end[1].substr(0,5)
              }
              el._dTimes = new Date(el.endTime).getTime()
              if(isNaN(el._dTimes)){
                el._dTimes = new Date(el.endTime.replace("-","/")).getTime()
              }
              if(this.nowTime>el._dTimes){
                this.activet +=1 
              }
            })
            if(this.activet == res.data.list.length ){
              this.activet = 0
            }
            this.listTwo = res.data.list
          }
        }
      }).catch(e=>{
        console.error('error',e);
      })
    },
      //开始拖动时
    drag(ev,obj,uid){
      this.curItem=obj
      this.curUid=uid
      let data = JSON.stringify(obj)
      ev.dataTransfer.setData("text",data);
    },
      //经过放置区时
    allowDrop(ev,obj,uid) {
      // console.log('ev5',obj.checked);
      if(this.curItem.personRoleType == obj.personRoleType && obj.personUid != this.curItem.personUid && this.curUid!=uid){
        obj.checked = true
      }
      // ev.preventDefault();
    },
      //离开放置区时
    leaveDrop(ev,obj){
      if(this.curItem.personRoleType == obj.personRoleType && obj.personUid != this.curItem.personUid){
        obj.checked = false
      }
       
    },
      //放下时
    drop(ev,obj,uid,type){
      // console.log('ev2',type);
      // console.log('ev2',obj);
      //要判断当前拖动的元素和对换的元素是否已经在列表内
      // this.changeList 变动的人员列表
      //  workUid:uid,
      //     personUid:obj.personUid,
      let isIndex = this.changeList.findIndex(el=>(el.workUid==this.curUid && el.personUid==this.curItem.personUid && el.personRoleType==this.curItem.personRoleType))
      let dIndex = this.changeList.findIndex(el=>(el.workUid==uid && el.personUid==obj.personUid && el.personRoleType==obj.personRoleType))
      if(!(isIndex==-1 && dIndex==-1)){
        this.$message({
          type:'warning',
          message:'当前人员已经有换班记录'
        })
        obj.checked = false
        return
      }
      if(this.curUid==uid){
        this.$message({
          type:'warning',
          message:'同一个班次不支持换班'
        })
        return
      }
      //ev 放下事件
      //type 1:从左拖到右  2 从右拖到左
      //curUid是当前开发拖动时的班次的uid  ，传入的uid 是放下班次的UId 
      //this.curItem 拖动的元素   
      //obj 放下位置上的元素
      if(this.curItem.personRoleType == obj.personRoleType && obj.personUid != this.curItem.personUid && this.curUid!=uid){
        this.changeList.push({
          personRoleType:this.curItem.personRoleType,
          workUid:uid,
          personUid:obj.personUid,
        })
        this.changeList.push({
          personRoleType:this.curItem.personRoleType,
          workUid:this.curUid,
          personUid:this.curItem.personUid,
        })
        // let data=JSON.parse(ev.dataTransfer.getData("item"));
        this.curItem.selected = true
        this.curItem.checked = false
        obj.selected = true
        obj.checked = false
        this.curItem.newDuty = obj
        obj.newDuty = this.curItem
        let changeList = []
        if(type==1){
          changeList.push({
            personCUid:this.curItem.personUid,
            personDUid:obj.personUid,
            personCPositionUid:this.curItem.personPostion,
            personDPositionUid:obj.personPostion,
            personRoleType:obj.personRoleType,
          })
          if(this.changeDtoList.length>0){
            let index = this.changeDtoList.findIndex(el=>(el.workScheduleAUid == this.curUid &&  el.workScheduleBUid == uid) )
            if(index==-1){
              this.changeDtoList.push({
                changeList:changeList,
                workScheduleAUid:this.curUid,
                workScheduleBUid:uid
              })
            }else{
              this.changeDtoList[index].changeList.push.apply(this.changeDtoList[index].changeList,changeList)
            }
          }else{
            this.changeDtoList.push({
              changeList:changeList,
              workScheduleAUid:this.curUid,
              workScheduleBUid:uid
            })
          }
        }else{
          changeList.push({
            personDUid:this.curItem.personUid,
            personCUid:obj.personUid,
            personDPositionUid:this.curItem.personPostion,
            personCPositionUid:obj.personPostion,
            personRoleType:obj.personRoleType,
          })

          if(this.changeDtoList.length>0){
            let index  = this.changeDtoList.findIndex(el=>(el.workScheduleBUid == this.curUid &&  el.workScheduleAUid == uid))
            if(index==-1){
              this.changeDtoList.push({
                changeList:changeList,
                workScheduleBUid:this.curUid,
                workScheduleAUid:uid
              })
            }else{
              this.changeDtoList[index].changeList.push.apply(this.changeDtoList[index].changeList,changeList)
            }
          }else{
            this.changeDtoList.push({
              changeList:changeList,
              workScheduleBUid:this.curUid,
              workScheduleAUid:uid
            })
          }
        }
        
        // this.workScheduleAUid = this.curUid
        // this.workScheduleBUid = uid
       

      }

    },
    //切换班次
    changeSelect(v){
       this.active = v
    },
    //切换班次
    changeSelectT(v){
      this.activet = v
    },
    //提交修改
    onSubmit(){
      if(this.changeDtoList.length == 0){
        this.$message({
          type:'warning',
          message:'请先选择要换班人员及班次信息'
        })
        return
      }
      let data = {
        changeDtoList:this.changeDtoList
      }
      putScheduleChange(data).then(res=>{
        if(res && res.code === '00000000'){
          this.$message({
            type:'success',
            message:'换班成功'
          })
          this.reset()
        }
      }).catch(e=>{
        console.error('e',e);
        
      })
    },
    //全部重置交换信息
    reset(){
      this.changeList=[]
      this.changeDtoList = []
      if(this.formOne.date){
        this.getDutyData(1)
      }
      if(this.formTwo.date){
        this.getDutyData(2)
      }
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
    .info{
      padding: 0px 20px 10px;
      h5{
        font-size:14px;
        font-weight:bold;
        color:#5458FE;
        line-height:24px;
      }
      p{
        font-size: 14px;
        color: $font_333;
      }
    }
    .center{
      text-align: center;
      margin-top: 20px;
      button{
        margin: 0px 10px;
      }
    }
    .boxFlex{
      // height: calc(100% - 200px);
      margin-top: 20px;
      display: flex;
      min-height: 410px;
      justify-content: space-between;
      .wid_all{
        flex: 1;
        margin-left: 20px;
       
      }
    }
    .timeLab{
      border:1px solid rgba(215,217,225,1);
      border-radius: 6px;
      background:#F7F9FC ;
      min-height: 320px;
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
        //  padding-right: 10px;3
          font-size:12px;
          @media screen and  (min-width: 1440px) { 
            font-size:14px;
          }
          margin-left: 1%;
          margin-right: 1%;
          line-height: 30px;
          text-align: center;
          color: #ffffff;
          cursor: pointer;
          &:hover{
          background: rgba(255, 255, 255, 0.1);
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          }
          &.active{
            color: $main_color;
            background: #ffffff;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          &.lood{
            position: relative;
            color: #8183FF;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background: rgba($color: #ffffff, $alpha: 0.1);
            &:hover{
              .invalid{
                display: inline-block;
              }
            }
          }
          .invalid{
            display: none;
            color: #5357FD;
            background: #ffffff;
            border: solid 1px #5357FD;
            border-radius: 10px;
            line-height: 16px;
            font-size: 12px;
            padding: 0 6px;
            position: absolute;
            top: -20px;
            left: 10px;
          }
        }
        
      }
      &.waring{
        ul{
          background: $waring_color;
          
          li.active{
            color: $waring_color;
            background: #ffffff;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          li.lood{
            position: relative;
            color:#FFD5B8;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background: rgba($color: #ffffff, $alpha: 0.1);
            &:hover{
              .invalid{
                display: inline-block;
              }
            }
          }
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
          min-height: 80px;
          .item{
            user-select: none;
            position: relative;
            margin: 0px 8px 10px 0;
            width: 31%;
            max-width: 166px;
            height: 66px;
            padding: 1%;
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
              // margin-left: 5px;
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
            user-select: none;
            position: relative;
            margin: 0px 8px 10px 0;
            width: 31%;
            max-width: 166px;
            height: 66px;
            padding: 1%;
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
    
  }
</style>


