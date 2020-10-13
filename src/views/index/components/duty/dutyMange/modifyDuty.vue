/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:52:31 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-07-29 10:30:11
 */
<template>
  <div class="editduty">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="editBox">
      <div class="flex">
        <div class="fleft">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="开始时间">
              <el-date-picker
               style="width:200px;"
              v-model="formInline.dateTime1"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"  :disabled='true' :clearable='false' >
            </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
              v-model="formInline.dateTime2"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间" style="width:200px;"   :disabled='true'  :clearable='false'>
            </el-date-picker>
            </el-form-item>
            <el-form-item label="交接班时间">
              <el-time-picker style="width:180px"
                v-model="formInline.time"
                format="HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="任意时间点"  :disabled='true' >
              </el-time-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="fright">
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
        
          
      </div>
      <div class="boxFlex">
        <div class="wid_380">
          <div class="userList">
            <div class="tab">
              <ul>
                <li :class="{'active':active==1}" @click="changeSelect(1)">带班领导</li>
                <li :class="{'active':active==2}" @click="changeSelect(2)">值班员</li>
              </ul>
            </div>
            <div class="seacher">
              <el-input placeholder="搜索姓名。支持汉字，全拼，首拼" v-model="keyword" suffix-icon="el-icon-search" class="input-key" @input="seacherKey">
            </el-input>
            </div>
            <div class="users" v-if="active==1">
              <el-scrollbar class="scroll" style="height:100%;">
              <ul>
                <li class="flex"  draggable="true" v-for="(item,i) in userData"  @dragstart="drag($event,item)" :key="'key'+i" >
                  <div>{{item.name}}  {{item.telephone}}</div>
                  <div>
                    <!-- <span class="leader">带班领导、值班领导</span>  -->
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                </li>
                
              </ul>
              </el-scrollbar>
            </div>
            <div class="users" v-else>
              <el-scrollbar class="scroll" style="height:100%;">
              <ul>
                <li class="flex"  draggable="true" v-for="(item,i) in members"  @dragstart="dragMember($event,item)" :key="'member'+i">
                   <div>{{item.name}}  {{item.telephone}}</div>
                  <div>
                    <!-- <span class="leader">带班领导、值班领导</span>  -->
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                </li>
                
              </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="wid_all">
          <div class="leaderA">
            <div class="title">带班领导</div>
            <div class="box"  @drop="drop($event)"  @dragover.prevent="allowDrop($event)" >
              <ul v-if="leaderArr && leaderArr.length>0">
                <li v-for="(item,jv) in leaderArr" :key="'jv'+jv">
                  <img src="_assets/img/icons/boy.png" alt="">
                  <span class="name">{{item.name}}</span> <span class="phone">{{item.telephone}}</span>
                  <i class="el-icon-error" @click="delItem(item)"></i>
                </li>
              </ul>
            </div>
            
          </div>
          <div class="member">
            <div class="mb1" v-for="(item,i) in postionList" :key="'oi'+i">
              <div  class="flex">
                <span><i class="requerd" v-if="i==0">*</i>{{item.name}}</span>
                <i class="el-icon-edit" @click="changeName(item)"></i>
              </div>
              <ul id="box1" @drop="dropMember($event,item)"   @dragover.prevent="allowDrop($event)"  v-if="postionTabs[i].length>0">
                <el-scrollbar style="height: 100%;">
                <li v-for="(o,j) in postionTabs[item.index]" :key="'oj'+j">
                  <img src="_assets/img/icons/boy.png" alt="">
                  <span class="name">{{o.name}}</span> <span class="phone">{{o.telephone}}</span>
                  <i class="el-icon-error" @click="delMbmer(o,item.index)"></i>
                </li>
                </el-scrollbar>
              </ul>
              <p class="empty" id="box2" @drop="dropMember($event,item)"  @dragover.prevent="allowDrop($event)" v-else>
                请从左侧列表拖拽人员进行排班
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改岗位名称"
      :visible.sync="changeDialog"
      :close-on-click-modal="false"
      width="320px">
      <div>
         <el-form :model="postionForm"  :inline="true" >
          <el-form-item label="岗位名称" label-width="120">
            <el-input v-model="postionForm.name" autocomplete="off" :maxlength='8' style="width:100%;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirtPos">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import {userInfo} from "_conf/testData.js";
import { getUserList,putSchedule,putPostionList,getPostionList,getDutyDetail} from "@/views/index/api/onDuty/api.zr.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      formInline:{
        dateTime1:'',
        dateTime2:'',
        time: ''
      },
      breadcrumbData:[{name: "编排班管理"}, {name: "浏览值班表",routerName:'browseDutyList'},{name:'修改排班'}],
      postionForm:{
        name:''
      },
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{},
      userData: [],
      members:[],
      active:1,
      keyword:'',
      // checked:false
      changeDialog:false,
      leaderArr:[],
      postionTabs:{
        0:[],
        1:[],
        2:[],
        3:[],
        4:[],
        5:[],
      },
      postionList:[],
      scheduleArr:[{
        "personPositionUid": "string",
        "personRoleType": 0,
        "personUid": "string"
      }],
      schedule:{
        "dutyPersons": [],
        "workScheduleUid": ""
      },
      detailData:null
    };
  },
  mounted() {

    this.getUserList({
      roleName:'带班领导'
    })
    this.getPostionList({
      'where.type':3
    })
    
  },
  methods: {
    //取值班详情
    getDutyDetail(d){
      getDutyDetail(d).then(res=>{
        if(res && res.code==="00000000"){
          this.detailData = res.data
          this.formInline.dateTime1=this.detailData.startTime
          this.formInline.dateTime2=this.detailData.endTime
          this.formInline.time=this.detailData.shiftTime
          if(this.detailData.dutyPersons && this.detailData.dutyPersons.length>0){
            this.detailData.dutyPersons.forEach(obj=>{
              if(obj.personRoleType==1){
                this.leaderArr.push({
                  name: obj.personName,
                  roleName: "带班领导",
                  sex: obj.personSex,
                  uid: obj.personUid
                })
              }else if(obj.personRoleType==2){
                let a=this.postionList.findIndex(ep=>ep.uid==obj.personPositionUid)
                
                this.postionTabs[a].push({
                  name: obj.personName,
                  roleName: "带班领导",
                  sex: obj.personSex,
                  uid: obj.personUid
                })
              }
            })
          }
          
        }
      })
    },
    //取消值班人员
    delMbmer(obj,index){
      let j = this.postionTabs[index].findIndex(el=>el.uid == obj.uid)
      this.postionTabs[index][j].checked = false
      this.postionTabs[index].splice(j,1)
    },
    //查询人员
    seacherKey(){
      let a= ''
      if(this.active==1){
        a= '带班领导'
      }
      if(this.active==2){
        a = '值班人员'
      }
      this.keyword = this.keyword.replace(/\s*/g,"")
      this.getUserList({
        roleName:a,
        queryName:this.keyword
      })
    },
    //查询岗位
    getPostionList(d){
      getPostionList(d).then(res=>{
        if(res && res.code === '00000000'){
          res.data.list.map((el,i)=>{
            el.index = i
          })
          this.postionList = res.data.list
          this.getDutyDetail({
            uid:this.$route.query.uid
          })
        }
      }).catch(er=>{
        console.error(er);
        
      })
    },
    //保存
    onSubmit(){
      if(this.postionTabs[0].length==0){
        this.$message({
          type:'warning',
          message:'第一个值班岗位必填'
        })
        return
      }
      this.schedule.workScheduleUid = this.detailData.uid
      let newArry=[]
      this.leaderArr.forEach(el=>{
        newArry.push({
          personRoleType:1,
          personUid:el.uid,
        })
      })
      
      for(let key in this.postionTabs){
        if(this.postionTabs[key].length>0){
          this.postionTabs[key].forEach(el=>{
            newArry.push({
              personPositionUid:this.postionList[key].uid,
              personRoleType:2,
              personUid:el.uid,
            })
          })
        }
      }
      this.schedule.dutyPersons = newArry
      console.log('this.schedule',this.schedule);
      // schedule
      this.putSchedule(this.schedule)
      
    },
    //修改排班
    putSchedule(d){
      putSchedule(d).then(res=>{
        if(res && res.code==="00000000"){
          this.$message({
            type:'success',
            message:'操作成功'
          })
          this.$router.back(-1)
          // this.$router.push({name:'browseDutyList'})
        }
      }).catch(e=>{
        console.error(e);
      })
    },
    //获取可排班用户
    getUserList(d){
      getUserList(d).then(res=>{
        if(res && res.code === '00000000'){
          // console.log('res',res.data);
          if(d.roleName == '带班领导'){
            this.userData = res.data
          }else if(d.roleName == '值班人员'){
            this.members = res.data
          }
        }else{
          console.log('error',res.viewMsg);
        }
      }).catch(err=>{
        console.error(err);
      })
    },
    //修改值班名称
    changeName(obj){
      this.changeDialog = true
      this.postionForm.name = obj.name
      this.postionForm.uid = obj.uid
      this.postionForm.ifShow = obj.ifShow
      this.postionForm.sortId = obj.sortId
      this.postionForm.type = obj.type
      this.postionForm.unitUid = obj.unitUid
    },
    //修改值班
    confirtPos(){
      // this.changeDialog = false
      if(!this.postionForm.name.trim()){
        this.$message({
          type:'warning',
          message:"岗位名称不能为空"
        })
        return
      }
      putPostionList(this.postionForm).then(res=>{
        if(res && res.code==="00000000"){
          this.changeDialog = false
          this.$message({
            type:'success',
            message:"操作成功"
          })
          this.postionList.map(el=>{
            if(el.uid == this.postionForm.uid){
              el.name = this.postionForm.name
            }
          })
          this.postionForm={}
        }
      }).catch(err=>{
        this.postionForm={}
        console.log('err',err);
        
      })

    },
    //开始拖动
    drag(ev,obj){
      ev.dataTransfer.setData("text",JSON.stringify(obj));
    },
    allowDrop(){
      //拖动经过时
    },
    //放下
    drop(ev){
      
      // ev.preventDefault();
      let data=JSON.parse(ev.dataTransfer.getData("text"));
      
      
      this.userData.forEach((el)=>{
        let a = this.leaderArr.findIndex(obj=>obj.uid==el.uid)
        if(el.checked && a==-1 && data.roleName == '带班领导'){
           this.leaderArr.push(el)
        }
      })
      let  newarr= this.userData.filter(el=>!el.checked)
      let index =newarr.findIndex(el=>el.uid == data.uid)
      if(index>-1 && data.roleName == '带班领导'){ 
        if(this.leaderArr.findIndex(obj=>obj.uid==data.uid) == -1){
          this.leaderArr.push(data)
        }
      }
    },
    //开始拖动
    dragMember(ev,obj){
      ev.dataTransfer.setData("text",JSON.stringify(obj));
    },
    //放下
    dropMember(ev,obj){
      //放下
      let data=JSON.parse(ev.dataTransfer.getData("text"));
      this.members.forEach((el)=>{
        let a = this.postionTabs[obj.index].findIndex(obj=>obj.uid==el.uid)
        if(el.checked && a==-1 && data.roleName == '值班人员'){
           this.postionTabs[obj.index].push(el)
        }
      })
      let  newarr= this.members.filter(el=>!el.checked)
      let index =newarr.findIndex(el=>el.uid == data.uid)
      if(index>-1 && data.roleName == '值班人员'){ 
        if(this.postionTabs[obj.index].findIndex(obj=>obj.uid==data.uid) == -1){
          this.postionTabs[obj.index].push(data)
        }
      }
    },
    //单个删除值班信息
    delItem(obj){
      let index = this.leaderArr.findIndex(el=>el.uid == obj.uid)
      this.leaderArr[index].checked = false
      this.leaderArr.splice(index,1)
    },
    //tab 切换
    changeSelect(v){
      this.active = v
      if(v == 1){
        this.getUserList({
          roleName:'带班领导'
        })
      }else {
        this.getUserList({
          roleName:'值班人员'
        })
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
      height: calc(100% - 60px);
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .wid_380{
        min-width: 260px;
        width: 25%;
        max-width: 380px;
      }
      .wid_all{
        flex: 1;
        margin-left: 20px;
        .leaderA{
          border-radius: 6px;
          overflow: hidden;
          border:solid 1px  rgba(223,223,239,1);
          .title{
            padding:10px 20px;
            color: #ffffff;
            font-weight: bold;
            background: $btn_warning_color;
          }
          .box{
            width: 100%;
            height: auto;
            min-height: 70px;
            padding: 20px;
          }
          ul{
            
            display: flex;
            flex-direction: row;
            min-height: 20px;
            flex-wrap: wrap;
            li{
              margin-right: 30px;
              user-select: none;
              line-height: 28px;
              min-width: 122px;
              img{
                vertical-align: middle;
                width: 14px;
                margin-right: 5px;
              }
              span{
                vertical-align: middle;
                &.name{
                  font-size: 14px;
                  font-weight: bold;
                  color: $font_333;
                  margin-right: 10px;
                }
                &.phone{
                  font-size: 12px;
                  color: $font_999;
                }
              }
              i{
                font-size: 18px;
                color: $btn_warning_color;
                vertical-align: middle;
                cursor: pointer;
                margin-left: 10px;
                display: none;
              }
              &:hover{
                i{
                  display: inline-block;
                }
              }
            }
          }
        }
        .member{
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          justify-content: space-between;
           height: calc(100% - 110px);
          .mb0{
            width: 32%;
            margin-top: 20px;
            border-radius: 6px;
            height: 260px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            .dash{
              cursor: pointer;
              width: 135px;
              height: 135px;
              border:1px dashed #A3AEBF;
              border-radius: 20px;
              color: #65668A;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              i{
                color: #65668A;
                font-size: 28px;
              }
            }
          }
          .mb1{
            width: 32%;
            margin-top: 20px;
            border-radius: 6px;
            height: calc(50% - 20px);
            overflow: hidden;
            border:solid 1px  rgba(223,223,239,1);
            .empty{
              height: calc(100% - 46px);
              display: flex;
              justify-content: center;
              align-items: center;
              color: #A3AEBF;
              font-size: 14px;
            }
            .el-icon-edit{
              font-size: 16px;
              cursor: pointer;
            }
            &:hover{
              border:solid 1px  $main_color;
              div.flex{
                 background:$main_color;
                 color: #ffffff;
              }
            }
            div.flex{
              padding:10px 20px;
              color: $font_666;
              font-weight: bold;
              background:#F0F2F5;
            }
            ul{
              margin: 10px;
              height: calc(100% - 60px);
              li{
                line-height: 32px;
                // margin-right: 30px;
                user-select: none;
                // &:hover{
                //   background: ;
                // }
                img{
                  vertical-align: middle;
                  width: 14px;
                  margin-right: 5px;
                }
                span{
                  vertical-align: middle;
                  &.name{
                    font-size: 14px;
                    font-weight: bold;
                    color: $font_333;
                    margin-right: 8px;
                  }
                  &.phone{
                    font-size: 12px;
                    color: $font_999;
                  }
                }
                i{
                  font-size: 18px;
                  color: $btn_warning_color;
                  vertical-align: middle;
                  cursor: pointer;
                  margin-left: 5px;
                  display: none;
                }
                &:hover{
                  i{
                    display: inline;
                  }
                }
              }
            }
          }
        }
      }
    }
    .userList{
      height: 100%;
      background:rgba(244,246,251,1);
      .tab{
        ul{
         background: $main_color;
         border-top-left-radius: 6px;
         border-top-right-radius: 6px;
         display: flex;
         flex-direction: row; 
         padding-top: 10px;
         padding-left: 20px;
         li{
           width: 80px;
           line-height: 30px;
           text-align: center;
           color: #ffffff;
           cursor: pointer;
           &:hover{
            background: rgba(255, 255, 255, 0.1);
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
           }
         }
         li:active,li.active{
           color: $main_color;
           background: #ffffff;
           border-top-left-radius: 6px;
            border-top-right-radius: 6px;
         }
        }
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
          .leader{
            color: $btn_warning_color;
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

.tables{
  .btn{
    color: $main_color;
    cursor: pointer;
  }
  margin-top: 20px;
  /deep/ .el-table__header thead tr th{
    background: rgba(240,242,245,1);
    color: $font_333;
    &:first-child{
      border-top-left-radius: 6px;
    }
    &.el-table_1_column_4 {
      border-top-right-radius: 6px;
    }
  }
}
/deep/ .member{
  .mb1 .el-scrollbar__wrap{
    overflow-x: hidden !important;
  }
}
.requerd{
  color: red;
  font-style: normal;
  vertical-align: middle;
  padding-right: 3px;
}
</style>


