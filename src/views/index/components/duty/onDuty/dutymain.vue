<template>
  <div class="duty">
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="ddf">
      <div class="nav_top">
        <p v-if="dutyData"><span>值班日期：</span> {{dutyData.startTime}} ({{weekDay[startWeek]}}) <span>至</span>  {{dutyData.endTime}} ({{weekDay[endWeek]}})</p>
        <p v-else>当前无排班信息</p>
        <div class="wid" >
            <div class="leaderA" v-if="dutyData">
              <div class="title">带班领导</div>
              <div class="box" >
                <ul >
                  <template v-for="(item,k) in dutyData.personList" >
                    <li :key ="'per'+ k"  v-if="item.personRoleType==1">
                        <img src="_assets/img/icons/boy.png" alt="">
                        <span class="name">{{item.personName}}</span> <span class="phone">{{item.personTelephone}}</span>
                    </li>
                  </template>
                </ul>
              </div>
              
            </div>
            <div class="member" v-if="dutyData">
              <div class="mb1" v-for="item in person" :key ="item.uid">
                <div  class="flex">
                  <span>{{item.name}}</span>
                </div>
                <ul id="box1" >
                  <el-scrollbar class="scroll" style="height: 100%;">
                  <li v-for="(obj,i) in item._list" :key="'ls'+i">
                    <img src="_assets/img/icons/boy.png" alt="">
                    <span class="name">{{obj.personName}}</span> <span class="phone">{{obj.personTelephone}}</span>
                  </li>
                  <li v-if="!item._list">-</li>
                  </el-scrollbar>
                </ul>
                <!-- <p class="empty" id="box2" @drop="dropMember($event,item)"@dragover.prevent="allowDropMember($event)" v-else>
                  请从左侧列表拖拽人员进行排班
                </p> -->
              </div>
            
              
            </div>
        </div>
      </div>
      <div class="events_list">
        <el-scrollbar class="scroll" style="height: 100%;">
          <p>
            <span>已办事项</span> <i class="el-icon-circle-plus" @click="addDone(2)"></i>
          </p>
          <div>
            <el-table :data="doneData" class="eventtables"   :class="{'hidenone':doneData.length==0}"  >
              <el-table-column   label="序号"  type="index" width="100"></el-table-column>
              <el-table-column prop="mattersDesc" label="内容" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span  class="acolor" @click="goShow(scope.row)" v-if="scope.row.isContinue">{{scope.row.mattersDesc}}</span>
                  <span v-else>{{scope.row.mattersDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column  prop="createTime" label="创建日期"  width="200">
              </el-table-column>
              <el-table-column   label="操作" width="240"  >
                <template slot-scope="scope">
                  <span class="operation_btn" @click="goPre(scope,2)"  v-if="scope.$index>0">上移</span>
                  <span class="operation_btn"  @click="goNext(scope,2)"  v-if="scope.$index+1<doneData.length">下移</span>
                  <span class="operation_btn" @click="edit(scope.row)" v-if="scope.row.isCurWorkSchedule">编辑</span>
                  <span class="operation_btn" @click="preInfo(scope.row)" v-if="!scope.row.isCurWorkSchedule">查看</span>
                  <span class="operation_btn" v-if="scope.row.isCurWorkSchedule && scope.row.createPerson == userInfo.uid"  @click="secondCom(scope.row,0)" >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <p>
            <span>待办事项</span> <i class="el-icon-circle-plus" @click="addDone(1)"></i>
          </p>
          <div>
            <el-table :data="needData" class="eventtables" :class="{'hidenone':needData.length==0}" >
              <el-table-column   label="序号"  type="index" width="100"></el-table-column>
              <el-table-column prop="mattersDesc" label="内容" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span  class="acolor" @click="goShow(scope.row)" v-if="scope.row.isContinue">{{scope.row.mattersDesc}}</span>
                  <span v-else>{{scope.row.mattersDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column  prop="createTime" label="创建日期"  width="200">
              </el-table-column>
              <el-table-column  label="操作" width="240" >
                <template slot-scope="scope">
                  <span class="operation_btn"  @click="goPre(scope,1)"    v-if="scope.$index>0">上移</span>
                  <span class="operation_btn"  @click="goNext(scope,1)"   v-if="(scope.$index+1)<needData.length">下移</span>
                  <span class="operation_btn" @click="edit(scope.row)">编辑</span>
                  <span class="operation_btn" v-if="scope.row.opUserId==userInfo.uid && scope.row.mattersSourceType!=71 && scope.row.mattersSourceType!=72 && scope.row.mattersSourceType!=73" @click="hairDown(scope.row)">续办</span>
                  <span class="operation_btn" v-if="scope.row.isCurWorkSchedule && scope.row.createPerson == userInfo.uid" @click="secondCom(scope.row,0)" >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <p>
            <span>关注事项</span> <i class="el-icon-circle-plus" @click="addDone(3)"></i>
          </p>
          <div>
            <el-table :data="followData" class="eventtables"  :class="{'hidenone':followData.length==0}" >
              <el-table-column   label="序号"  type="index" width="100"></el-table-column>
              <el-table-column prop="mattersDesc" label="内容" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="acolor" @click="goShow(scope.row)" v-if="scope.row.isContinue">{{scope.row.mattersDesc}}</span>
                  <span v-else>{{scope.row.mattersDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column  prop="createTime" label="创建日期"  width="200">
              </el-table-column>
              <el-table-column  label="操作" width="240" >
                <template slot-scope="scope">
                  <span class="operation_btn"  @click="goPre(scope,3)"   v-if="scope.$index>0">上移</span>
                  <span class="operation_btn"  @click="goNext(scope,3)"   v-if="scope.$index+1<followData.length">下移</span>
                  <span class="operation_btn" @click="edit(scope.row)">编辑</span>
                  <span class="operation_btn"  @click="secondCom(scope.row,1)" >归档</span>
                  <span class="operation_btn" v-if="scope.row.isCurWorkSchedule && scope.row.createPerson == userInfo.uid"  @click="secondCom(scope.row,0)" >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <p>
            <span class="center">设备情况</span>
            <el-radio v-model="radio" :label="1"  class="center">正常</el-radio>
            <el-radio v-model="radio" :label="0"  class="center">不正常</el-radio>
          </p>
          
        </el-scrollbar>
      <div class="lastBox">
          <el-button type="primary" @click="savaWord">保存 / 预览</el-button>
          </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="addDuty"
      :close-on-click-modal="true"
      @close="cancelAdd('instructeInfo')"
      title="新增"
      width="650px"
      top="30vh"
      class="modyfi">
      <div>
       <el-form label-width="100px" class="form-content" :model="instructeInfo"  ref="instructeInfo" :rules="instructeRule">
          <el-form-item  label="状态">
            <el-radio-group v-model="instructeInfo.handleStatus">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
              <el-radio :label="3">关注</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="简要描述" prop="matterDesc">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="100" show-word-limit v-model="instructeInfo.matterDesc" style="width:95%" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('instructeInfo')">取 消</el-button>
        <el-button type="primary" @click="confirmDuty"  :loading="subBtnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="showInfo"
      :close-on-click-modal="true"
      width="650px"
      top="30vh" class="receipt-dialog"  >
      <div class="infos">
        <h5>简要描述：</h5>
        <p>
          {{showObj.mattersDesc}}
        </p>
      </div>     
    </el-dialog>
    <operation v-if="operObj" :visible.sync="showOper" title="操作" @submitOper="submitForm" @closeOper="showOper = false" :eventData='operObj'></operation>
    <el-dialog title="关联业务" :visible.sync="dialogTableVisible" width="800px">
      <el-table :data="gridData">
        <el-table-column property="title" label="标题" show-overflow-tooltip >
          <template slot-scope="scope">
            <span class="acolor" @click="goPageOffice(scope.row)" >{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" >
          <template slot-scope="scope">
            {{mattersType[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" width="200"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import operation from "_com/onDuty/dutyOperation.vue";
import { getOnduy,addOnduy,putOnduy,getPostionList,addEvent,putEvent,delEvent,putSort,getRecordList} from "@/views/index/api/onDuty/api.zr.js";
import { getIssueInstructionDetail } from "@/views/index/api/onDuty/api.ps.js";
import { ajaxCtx } from '@/config/config.js';
export default {
  components: { visBreadcrumb,operation },
  data() {
    return {
      subBtnLoading:false,
      dialogTableVisible:false,
      gridData:[],
      instructeRule:{
        matterDesc:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
       
      },
      radio:1,
      breadcrumbData:[{name: "值班记录单"}, {name: "值班记录首页"}],
      instructeInfo:{
        handleStatus:1,
        matterDesc:'',
      },
      userInfo:localStorage.getItem("vis_user_info")?JSON.parse(localStorage.getItem("vis_user_info")):{} ,
      doneData:[],//已办
      needData:[],//待办
      followData:[],//关注
      indeData:null,
      addDuty:false,
      dutyData:null,
      person:[],
      weekDay:{
        0:'星期日',
        1:'星期一',
        2:'星期二',
        3:'星期三',
        4:'星期四',
        5:'星期五',
        6:'星期六',
      },
      startWeek:null,
      endWeek:null,
      showInfo:false,
      showObj:{},
      showOper:false,
      operObj:null,
      fullLoading:null,
      formData:{
        code:null,
        deviceStatus:null,
        scheduleUid:null,
        workMattersUids:[],
        uid:null
      },
      mattersType:{
        1:'其它',
        2:'要情快报',
        3:'值班信息',
        4:'通知公告',
        5:'来文拟办',
        6:'来电拟办',
        7:'电话记录',
        8:'批示下发',
        9:'批示反馈',
      },
      mattersSourceType:{
        11:'其它',
        12:'其它',
        13:'其它',
        21:'要情快报',
        22:'要情快报',
        23:'要情快报',
        31:'值班信息',
        32:'值班信息',
        33:'值班信息',
        41:'通知公告',
        42:'通知公告',
        43:'通知公告',
        51:'来文拟办',
        52:'来文拟办',
        53:'来文拟办',
        61:'来电拟办',
        62:'来电拟办',
        63:'来电拟办',
        71:'电话记录',
        72:'电话记录',
        73:'电话记录',
        81:'批示下发',
        82:'批示下发',
        83:'批示下发',
        91:'批示反馈',
        92:'批示反馈',
        93:'批示反馈',
      },
    };
  },
  mounted() {
    this.getOnduy()
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
  },
  methods: {
    //展示续办信息列表
    goShow(obj){
      this.dialogTableVisible = true
      this.getRecordList({
        uid:obj.uid
      })
    },
    getRecordList(d){
      getRecordList(d).then(res=>{
        if(res && res.code==='00000000'){
          this.gridData = res.data
        }
      }).catch(()=>{

      })
    },
    cancelAdd(formName){
      this.$refs[formName].resetFields();
      this.addDuty = false
    },
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
    //上移
    goPre(v,type){
      let index = v.$index
      let newIndex = index-1
      let objUid ='', sourceUid = v.row.uid;
      if(type==1){
        objUid = this.needData[newIndex].uid
      }else if(type==2){
        objUid = this.doneData[newIndex].uid
      }else if(type==3){
        objUid = this.followData[newIndex].uid
      }
      let data =  {
          "objUid": objUid,
          "sourceUid": sourceUid
        }
      this.putSort(data,1)
    },
    //下移
    goNext(v,type){
      let index = v.$index
      let newIndex = index+1
      let objUid ='', sourceUid = v.row.uid;
      if(type==1){
        objUid = this.needData[newIndex].uid
      }else if(type==2){
        objUid = this.doneData[newIndex].uid
      }else if(type==3){
        objUid = this.followData[newIndex].uid
      }
      let data =  {
          "objUid": objUid,
          "sourceUid": sourceUid
        }
      this.putSort(data,2)
    },
    //上下移时修改的位置方法
    putSort(d,t){
      let msg = '上移成功！'
      if(t==2){
        msg = '下移成功！'
      }else{
        msg = '上移成功！'
      }
      putSort(d).then(res=>{
        if(res && res.code === '00000000'){
          this.$message({
            type:'success',
            message:msg
          })
          this.getOnduy()
        }
      }).catch(er=>{
        console.error(er);
      })
    },
   
    //保存 预览
    savaWord(){
      if(!this.dutyData){
        this.$message({
          type:'warning',
          message:'当前时间未安排人员值班，请在后台》编排班管理》编排值班中安排人员值班'
        })
        return 
      }
      if(!this.indeData.uid){
        this.formData.deviceStatus = this.radio
        this.formData.scheduleUid = this.dutyData.uid
        this.formData.workMattersUids = []
        this.doneData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
        this.needData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
        this.followData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
        
        this.addOnduy(this.formData)
      }else{
        this.formData={
          uid:this.indeData.uid,
          code:this.indeData.code,
          deviceStatus: this.radio,
          scheduleUid:this.dutyData.uid,
          workMattersUids : []
        }
        this.doneData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
        this.needData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
        this.followData.forEach(el=>{
          this.formData.workMattersUids.push(el.uid)
        })
          
        this.putOnduy(this.formData)
      }
      
    },
    //续办
    hairDown(val){
      let type = this.mattersSourceType[val.mattersSourceType]
      if(type=='其它'){
        this.showOper = true
        this.operObj = val
      }else if(type=='通知公告'){
        this.$router.push({name:'addNotice',query:{
          recorduid:val.uid,
          eventUid:val.mattersSourceUid
        }})
      }else if(type=='要情快报'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addExpress", query:{fromTouch:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='值班信息'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addUpdateDutyInfo", query:{fromTouch:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='来文拟办'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "newCommunication", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='来电拟办'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "calCommunication", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='电话记录'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "newTelephoneRecord", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }else if(type=='批示下发'){
        if(val.mattersSourceUid){
          let params={
            uid: val.mattersSourceUid
          }
          getIssueInstructionDetail(params).then((res)=>{
            if(res && res.code==="00000000") {
              if(res.data.eventDto){                
                if(res.data.eventDto.instructionType==1){//值班信息的批示
                  this.$router.push({ name: "receiveExpress", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
                }else if(res.data.eventDto.instructionType==2){//要情快报的批示
                  this.$router.push({ name: "instructeExpress", query:{fromTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
                }
              }
            }
          }).catch((error)=>{
            console.log("接口报错=>",error)
          })
        }
      }else if(type=='批示反馈'){
        if(val.mattersSourceUid){
          this.$router.push({ name: "addInstructeFeedback", query:{formTxt:"续办", uid:val.mattersSourceUid, banUid:val.uid} });
        }
      }
    },
    //编辑
    edit(val){
      this.showOper = true
      this.operObj = val
    },
    //提交操作
    submitForm(val){
      let params ={
        uid:val.uid,
        handleStatus:val.status,
        mattersDesc:val.mattersDesc
      }
      
      this.putEvent(params)  
    },
    //查看
    preInfo(obj){
      this.showObj = obj
      this.showInfo = true
    },
    //删除等操作前的二次确认
    secondCom(val,type){
    let  str='您确认要删除此信息吗？'
    let title = '提示'
    if(type==0){
      title = '提示'
      str='您确认要删除此信息吗？'
    }
    if(type==1){
      title = '归档'
      str='您确认要归档此关注事项吗？'
    }
    this.$confirm(str, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let params={
        uid:val.uid
      }
        if(type==0){
        this.delEvent(params)  
      }
      if(type==1){
        params.handleStatus = 4
        params.mattersDesc = val.mattersDesc
        this.putEvent(params)
      }
      
    }).catch((e) => {
      console.log('e',e);
      this.$message({
        type: 'info',
        message: '已取消'
      });          
    });
  },
    //获取岗位
    getPostionList(){
      getPostionList({
        "where.type":3
      }).then(res=>{
        if(res && res.code === '00000000'){
          let list =  res.data.list
          this.dutyData.personList.forEach(el => {
            if(el.personRoleType==2){
              let index = list.findIndex(obj=>obj.uid == el.personPostion)
              
              if(!list[index]._list){
                list[index]._list = []
              }
              list[index]._list.push(el)
            }
          });
           this.person = list
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    //新添事项方法
    addDone(v){
      if(!this.dutyData){
        this.$message({
          type:'warning',
          message:'当前无排班信息，禁止操作！'
        })
        return 
      }
      this.addDuty = true
      this.instructeInfo.handleStatus = v
    },
    //确认提交值班记录
    confirmDuty(){
      this.subBtnLoading =true
      // return
      //处理状态(1待办/2已办/3关注/4归档)
       this.$refs['instructeInfo'].validate(valid => {
        if(valid){
          
          let data ={
              "handleStatus": this.instructeInfo.handleStatus,
              "mattersDesc": this.instructeInfo.matterDesc,
              "mattersSourceType": 11,
            }
          this.addEvent(data)
        }else{
           this.subBtnLoading =false
          console.log('error submit!!');
          return false;
        }
      })   
      
    },
    //取得当前值班信息及事项信息
    getOnduy(){
      getOnduy().then(res=>{
        if(res && res.code === '00000000'){
          this.indeData = res.data
          this.needData = res.data.undoWorkMattersInfoList
          this.doneData = res.data.doneWorkMattersInfoList
          this.followData = res.data.attentionWorkMattersInfoList
          this.dutyData = res.data.workScheduleInfo
          if(this.dutyData){
            let start = new Date(this.dutyData.startTime.replace("-","/"))
            let end = new Date(this.dutyData.endTime.replace("-","/"))
             if(isNaN(start.getTime())){
               start = new Date(this.dutyData.startTime)
               end = new Date(this.dutyData.endTime)
             }
            this.startWeek = start.getDay()
            this.endWeek = end.getDay()
            this.getPostionList()
          }
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    //打开 pageOffice
    openOffice(id){
      let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=1&uid=' + id
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    goPageOffice(obj){
      let atype = obj.type
        if(obj.type==2){atype = 3 }
        if(obj.type==3){atype = 4}
        if(obj.type==4){atype = 6}
        if(obj.type==5){atype = 7}
        if(obj.type==6){atype = 7}
        if(obj.type==7){atype = 7}
        if(obj.type==8){atype = 4}
        if(obj.type==9){atype = 5}
       let objStr = ajaxCtx.uem + '/duty/page-office/view?wordType='+atype+'&uid=' + obj.uid
      window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
      this.openFullScreen()
    },
    //提交值班信息记录
    addOnduy(d){
      addOnduy(d).then(res=>{
        if(res && res.code === '00000000'){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.openOffice(res.data)
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    //修改值班信息记录
    putOnduy(d){
      putOnduy(d).then(res=>{
        if(res && res.code === '00000000'){
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.openOffice(d.uid)
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    //添加事项动作
    addEvent(d){
      addEvent(d).then(res=>{
        if(res && res.code === '00000000'){
          if(res.data){
            this.$message({
              type:'success',
              message:'新增成功'
            })
           this.getOnduy();
           this.addDuty = false
           this.instructeInfo.matterDesc = ''
          }
        }
        this.subBtnLoading =false
      }).catch(e=>{
        this.subBtnLoading =false
        console.error('e',e);
      })
    },
    //修改编辑事项动作
    putEvent(d){
      putEvent(d).then(res=>{
        if(res && res.code === '00000000'){
          this.operObj = null
          this.showOper = false
          this.$message({
            type:'success',
            message:'操作成功'
          })
          this.$nextTick(()=>{
            this.getOnduy();
          })
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    //删除事项方法
    delEvent(d){
      delEvent(d).then(res=>{
        if(res && res.code === '00000000'){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.getOnduy();
        }
      }).catch(e=>{
        console.error('e',e);
      })
    },
    
  }
};
</script>
<style lang="scss" scoped>
.duty{
  .ddf{
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
  }
  .center{
    vertical-align: middle;
    padding-right: 10px;
  }
  // overflow: auto;
  .nav_top{
    background: #ffffff;
    // overflow: hidden;
    border-radius: 15px;
        // min-height: 80px;
    .wid{
      padding: 20px;
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
          height: 50px;
          padding:10px 20px;
          overflow: hidden;
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
          width: 16%;
          margin-top: 20px;
          border-radius: 6px;
          height: 140px;
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
              line-height: 24px;
              // margin-right: 30px;
              user-select: none;
              // &:hover{
              //   background: ;
              // }
              img{
                vertical-align: middle;
                width: 12px;
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
      
      
    p{
      padding: 10px 0px;
      text-align: center;
      background: $main_color;
      color: #ffffff;
      font-size: 14px;
       border-top-left-radius: 15px;
    border-top-right-radius: 15px;
      span{
        color: #BBBDFE;
      }
    }
    .flex-box{
      display: flex;
      justify-content: space-around;
      div{
        position: relative;
        flex: 1;
        text-align: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px 0px;
        .lab{
          color: $font_999;
          font-size: 14px;
        }
        .names{
          font-size: 20px;
          font-weight: bold;
          color: $succuss_color;
        }
        .leader{
          color: $main_color;
        }
        &::after{
          position: absolute;
          content: '';
          display: block;
          height:60%;
          top: 20%;
          width: 0px;
          border-right: solid 1px #E5EAF4;
          right: 0px;
        }
        &:last-child::after{
          border: none;
        }
      }
    }
  }
  .lastBox{
    margin-top: 20px;
    button{
      width: 120px;
    }
  }
  .events_list{
    // height: calc(100% - 410px);
    background: #ffffff;
    overflow: hidden;
    border-radius: 15px;
    padding: 20px;
    margin-top: 20px;
    padding-bottom: 70px;
    flex: 1;
    p{
      padding-top: 20px;
      &:first-child{
        padding-top: 0px;
      }
      span{
        vertical-align: middle;
        font-size: 14px;
        font-weight: bold;
        color: $font_333;
      }
      i{
        font-size: 22px;
        margin-left: 10px;
        vertical-align: middle;
        color: $main_color;
        cursor: pointer;
      }
    }
  }
  /deep/ .el-radio__input.is-checked+.el-radio__label{
    color: $main_color;
  }
}
.acolor{
  color: #5458FD;
  cursor: pointer;
}
.eventtables{
  width: 100%;
  margin-top: 10px;
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
.hidenone{
  display: none;
}
/deep/ .el-dialog .el-dialog__header .el-dialog__title{
  font-weight: normal;
}
</style>
