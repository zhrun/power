<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 要情快报.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="adex-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <div class="event-type">
          <p v-for="(item, index) in eventList" :key="'item'+index" class="event-type-unit" :class="eventIndex==index? 'event-type-active': ''" @click="changeType(index)">{{item}}</p>
        </div>
        <el-form :model="expressForm" ref="expressForm" :rules="expressRule"  label-width="100px" class="form-content">
          <div class="inline-form form-three" style="margin-top: 30px;">
            <el-form-item label="编号">
              <el-input type="text" placeholder="可备注相关内容" v-model="expressForm.code" :disabled="allSetReady" readonly></el-input>
            </el-form-item>
            <el-form-item label="接报时间" v-if="eventIndex==0">
              <el-date-picker v-model="expressForm.receiptTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="接报时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="接报时间" v-if="eventIndex==1">
              <el-date-picker v-model="expressForm.creceiptTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="接报时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="编发时间" prop="editTime" v-if="eventIndex==0">
              <el-date-picker v-model="expressForm.editTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="编发时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="编发时间" prop="ceditTime" v-if="eventIndex==1">
              <el-date-picker v-model="expressForm.ceditTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="编发时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
          </div>     
          <el-form-item label="是否续报" v-if="eventIndex==0">
            <el-radio-group v-model="expressForm.whetherResubmit" :disabled="allSetReady">
              <el-radio :label="0" :disabled="isXubao">否</el-radio>
              <el-radio :label="1" @change="showME">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="eventIndex==0">
            <el-form-item label="事件标题" prop="eventTitle">
              <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.eventTitle" style="width:90%" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <div v-if="eventIndex==1">
            <el-form-item label="事件标题" prop="ceventTitle">
              <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.ceventTitle" style="width:90%" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="报送单位" v-if="eventIndex==0">
            <span>{{expressForm.unitName}}</span>
          </el-form-item>
          <el-form-item label="事发时间" prop="happenTime" v-if="eventIndex==0" class="com-two">
            <el-date-picker v-model="expressForm.happenTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="事发时间" :disabled="allSetReady" :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
          <div class="inline-form com-four" v-if="eventIndex==0">
            <el-form-item label="事发地点" prop="happenPrivoce">
              <el-select v-model="expressForm.happenPrivoce" placeholder="省" style="margin-right:20px" :disabled="allSetReady" @change="selectProvince">
                <el-option v-for="item in provinceOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenCity">
              <el-select v-model="expressForm.happenCity" placeholder="市" style="margin-right:20px" :disabled="allSetReady" @change="selectCity">
                <el-option v-for="item in cityOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenCounty">
              <el-select v-model="expressForm.happenCounty" placeholder="县/区" style="margin-right:20px" :disabled="allSetReady" @change="selectCounty">
                <el-option v-for="item in countyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenAddress">
              <el-input type="text" placeholder="请输入详情地址" maxlength="70" v-model="expressForm.happenAddress" class="address-detail" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="事件类型" prop="eventType" v-if="eventIndex==0">
            <el-cascader :options="eventTypeList" style="width: 90%;" v-model="expressForm.eventType" @change="handleEventType"  :disabled="allSetReady"></el-cascader>
          </el-form-item>
          <el-form-item label="事件等级" prop="eventLevel" v-if="eventIndex==0" class="com-two">
            <el-select v-model="expressForm.eventLevel" placeholder="请选择" :disabled="allSetReady">
              <el-option v-for="item in levelOpration" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报" v-if="eventIndex==0">
            <el-input type="text" placeholder="本级单位领导，可填多个" maxlength="50" v-model="expressForm.reportToLeader" style="width:90%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="报" v-if="eventIndex==1">
            <el-input type="text" placeholder="本级单位领导，可填多个" maxlength="50" v-model="expressForm.creportToLeader" style="width:90%" :disabled="allSetReady"></el-input>
          </el-form-item>
          <el-form-item label="送" class="inst-unit" v-if="eventIndex==0">
            <el-select v-model="expressForm.copyUnit" style="width:90%" :disabled="allSetReady" multiple placeholder="平级单位，可选多个">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" :disabled="allSetReady"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送" class="inst-unit" v-if="eventIndex==1">
            <el-select v-model="expressForm.ccopyUnit" style="width:90%" :disabled="allSetReady" multiple placeholder="平级单位，可选多个">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" :disabled="allSetReady"></el-option>
            </el-select>
          </el-form-item>
          <div class="inline-form form-three" style="margin-top: 30px;" v-if="eventIndex==0">
            <el-form-item label="编辑" prop="editor">
              <el-input type="text" maxlength="10" v-model="expressForm.editor" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="校对" prop="verifier">
              <el-input type="text" maxlength="10" v-model="expressForm.verifier" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="签发" prop="signer">
              <el-input type="text" maxlength="10" v-model="expressForm.signer" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <div class="inline-form form-three" style="margin-top: 30px;" v-if="eventIndex==1">
            <el-form-item label="编辑" prop="ceditor">
              <el-input type="text" maxlength="10" v-model="expressForm.ceditor" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="校对" prop="cverifier">
              <el-input type="text" maxlength="10" v-model="expressForm.cverifier" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="签发" prop="csigner">
              <el-input type="text" maxlength="10" v-model="expressForm.csigner" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="divide-line"></div>
        <el-form label-width="100px" class="form-content">
          <el-form-item label="简要描述" style="position:relative;">
            <span style="color:#C3C9D8">请确认填写完所有内容再填写简要描述</span>
            <el-checkbox v-model="briefChecked" class="check-style" @change="changeBrief"></el-checkbox>
            <span class="tip-req">*</span>
          </el-form-item>
          <el-form-item v-if="allSetReady">
            <el-radio-group v-model="expressForm.handleStatus">
              <el-radio :label="2">已办</el-radio>
              <el-radio :label="1">待办</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="allSetReady">
            <el-input type="textarea" :rows="4" placeholder="请输入简要描述" maxlength="200" show-word-limit v-model="expressForm.mattersDesc" style="width:90%"></el-input>
          </el-form-item>
          <div style="margin:40px 0px 40px 100px">
            <el-button @click="backPre">返回</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="!allSetReady" :loading="saveLoading">保存/预览</el-button>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <select-module-event v-if="showModule" :module-type="moduleType" @closeModule="closeModule" @setNewEventInfo="setNewEventInfo"></select-module-event>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import selectModuleEvent from "_com/onDuty/select-module-event.vue";
import { formatDate } from "@/utils/util.js";
import { ajaxCtx } from '@/config/config.js';
import { getGenerateNo, postEventReport, putEventReport, getEventDetail, querySortList, postEventReportSendMessage } from "@/views/index/api/onDuty/api.ps.js";
import { getOnduy } from "@/views/index/api/onDuty/api.zr.js";
import { getAreaList } from "@/views/index/api/onDuty/api.yy.js";
export default {
  components: { visBreadcrumb, selectModuleEvent },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" },{ name: "要情快报", routerName: "importantExpress"}, { name: "新增要情快报" }],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        },
      },
      eventList:["突发事件", "一般事件"],
      eventIndex:0,
      provinceOption: [],
      cityOption: [],
      countyOption: [],
      levelOpration:[
        {
          value: 1,
          label: "Ⅳ级(一般)"
        },
        {
          value: 2,
          label: "Ⅲ级(较大)"
        },
        {
          value: 3,
          label: "Ⅱ级(重大)"
        },
        {
          value: 4,
          label: "Ⅰ级（特别重大）"
        },
      ],
      expressForm:{
        uid: "",
        code: 0,
        receiptTime: "",
        editTime: "",
        creceiptTime: "",
        ceditTime: "",
        whetherResubmit:0,
        eventTitle: null,
        ceventTitle: null,
        happenTime: "",
        happenPrivoce: null,
        happenCity: null,
        happenCounty: null,
        happenAddress: "",
        eventType:[],
        eventType1: null,
        eventType2: null,
        eventType3: null,
        eventLevel: null,
        unitName: "",
        copyUnit: "",
        ccopyUnit: "",
        editor: "",
        signer: "",
        verifier: "",
        ceditor: "",
        csigner: "",
        cverifier: "",
        handleStatus: 2,
        mattersDesc: "",
        reportToLeader: "",
        creportToLeader: "",
      },
      expressRule:{
        editTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        ceditTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        eventTitle:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        ceventTitle:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        happenTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        happenPrivoce:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenCity:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenCounty:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenAddress:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        eventLevel:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        eventType:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        editor:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        verifier:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        signer:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        ceditor:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        cverifier:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        csigner:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
      },
      eventTypeList:[],
      briefChecked:false,
      showModule:false,
      allSetReady:false,
      userInfo:null,
      isXubao:false,
      seXubao:false,
      isXuban:false,
      moduleType:"event",
      unitList:[],
      saveLoading:false,
      fullLoading:null,
      sendUid:null
    };
  },
  mounted() {
    this.expressForm.receiptTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.expressForm.editTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.expressForm.creceiptTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.expressForm.ceditTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    if(localStorage.getItem("vis_user_info")){
      this.userInfo=JSON.parse(localStorage.getItem("vis_user_info"))
      this.expressForm.unitName=this.userInfo.rmsUnitDto.unitName
      this.expressForm.editor=this.userInfo.userName
      this.expressForm.ceditor=this.userInfo.userName
    }
    this.eventTypeList=JSON.parse(localStorage.getItem("event_type_list")) || []
    //获取抄送单位
    this.querySortList()
    //获取省市县
    this.getAreaList("province", 1);
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      this.closeFullScreen()
    }
    window.sendMessage = ()=>{
      this.sendNewMessage()
    }
    if(this.$route.query && this.$route.query.fromTouch){
      if(this.$route.query.fromTouch=="新增"){
        this.getGenerateNo()
        this.getOnduy()
        this.expressForm.happenPrivoce=this.userInfo.rmsUnitDto.province || ""
        this.expressForm.happenCity=this.userInfo.rmsUnitDto.city || ""
        this.expressForm.happenCounty=this.userInfo.rmsUnitDto.county || ""
        let that=this
        setTimeout(()=>{
          if(that.expressForm.happenPrivoce && that.provinceOption && that.provinceOption.length>0){
            that.provinceOption.map((item)=>{
              if(item.label==that.expressForm.happenPrivoce){
                that.cityOption=[]
                that.getAreaList('city',item.value)
              }
            })
          }
        },500)
        setTimeout(()=>{
          if(that.expressForm.happenCity && that.cityOption && that.cityOption.length>0){
            that.cityOption.map((item)=>{
              if(item.label==that.expressForm.happenCity){
                that.countyOption=[]
                that.getAreaList('county',item.value)
              }
            })
          }
        },1000)
      }else if(this.$route.query.fromTouch=="续报"){
        this.getGenerateNo()
        this.getEventDetail(this.$route.query.uid)
        this.breadcrumbData=[{ name: "信息处理" },{ name: "要情快报", routerName: "importantExpress"}, { name: "续报要情快报" }]
        this.expressForm.whetherResubmit=1
        this.isXubao=true
      }else if(this.$route.query.fromTouch=="续办"){
        this.isXuban=true
        this.getGenerateNo()
        this.getEventDetail(this.$route.query.uid)
      }else if(this.$route.query.fromTouch=="编辑"){
        this.getEventDetail(this.$route.query.uid)
        this.breadcrumbData=[{ name: "信息处理" },{ name: "要情快报", routerName: "importantExpress"}, { name: "编辑要情快报" }]
      }
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
      this.$router.push({ name: "importantExpress", query:{refresh:true} });
    },
    sendNewMessage(){
      let params={
        uid:this.sendUid
      }
      postEventReportSendMessage(params).then((res)=>{
        if(res) {
          console.log("接口成功=>",res)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取编号
    getGenerateNo(){
      let that = this
      let params={
        type: 2
      }
      getGenerateNo(params).then((res)=>{
        if(res && res.data) {
          that.expressForm.code = parseInt(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取上报单位
    querySortList(){
      let params={
        parentUid:this.userInfo.rmsUnitDto.parentUid,
        unitType:1
      }
      querySortList(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.length>0){
            res.data.map((item)=>{
              let unit={}
              unit.label=item.unitName
              unit.value=item.uid
              this.unitList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取系统当前班次带班领导姓名
    getOnduy(){
      getOnduy().then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.workScheduleInfo && res.data.workScheduleInfo.personList && res.data.workScheduleInfo.personList.length>0){
            let dutyList=res.data.workScheduleInfo.personList
            dutyList.map((item)=>{
              if(item.personRoleType==1){
                this.expressForm.signer=item.personName
                this.expressForm.csigner=item.personName
              }
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //设置市下拉框数据
    selectProvince(v){
      this.cityOption=[]
      this.getAreaList('city',v)
      this.provinceOption.map((item)=>{
        if(item.value==v){
          this.expressForm.happenPrivoce=item.label
        }
      })
      this.expressForm.happenCity=""
      this.expressForm.happenCounty=""
      this.expressForm.happenAddress=""
    },
    //设置县下拉框数据
    selectCity(v){
      this.countyOption=[]
      this.getAreaList('county',v)
      this.cityOption.map((item)=>{
        if(item.value==v){
          this.expressForm.happenCity=item.label
        }
      })
      this.expressForm.happenCounty=""
      this.expressForm.happenAddress=""
    },
    //设置县数据
    selectCounty(v){
      this.countyOption.map((item)=>{
        if(item.value==v){
          this.expressForm.happenCounty=item.label
        }
      })
      this.expressForm.happenAddress=""
    },
    //获取省市县数据
    getAreaList(type, parentId){
      let params={
        parentId
      }
      getAreaList(params).then((res)=>{
        if(res && res.code==="00000000") {          
          if(res.data && res.data.length>0){
            res.data.map((item)=>{
              let unit={}
              unit.label=item.areaName
              unit.value=item.id
              if(type=="province"){
                this.provinceOption.push(unit)
              }else if(type=="city"){
                this.cityOption.push(unit)
              }else if(type=="county"){
                this.countyOption.push(unit)
              }              
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取详情
    getEventDetail(uid){
      let that = this
      let params={
        uid: uid
      }
      getEventDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.eventTitle = that.isXubao || this.seXubao? `${res.data.eventTitle}【续报${that.NTC(res.data.index)}】`: that.isXuban? `【续办】${res.data.eventTitle}`: res.data.eventTitle
          that.expressForm.ceventTitle = that.isXubao || this.seXubao? `${res.data.eventTitle}【续报${that.NTC(res.data.index)}】`:that.isXuban? `【续办】${res.data.eventTitle}`: res.data.eventTitle
          that.expressForm.signer = res.data.signer
          that.expressForm.verifier = res.data.verifier
          that.expressForm.csigner = res.data.signer
          that.expressForm.cverifier = res.data.verifier
          that.expressForm.editor = res.data.editor
          that.expressForm.ceditor = res.data.editor
          that.expressForm.happenTime = res.data.happenTime? res.data.happenTime.replace(/-/g, "/"): ""
          that.expressForm.happenPrivoce = res.data.happenPrivoce
          that.expressForm.happenCity = res.data.happenCity
          that.expressForm.happenCounty = res.data.happenCounty
          that.expressForm.happenAddress = res.data.happenAddress
          that.expressForm.reportToLeader = res.data.reportToLeader
          that.expressForm.creportToLeader = res.data.reportToLeader
          that.expressForm.eventType1 = res.data.eventType1
          that.expressForm.eventType2 = res.data.eventType2
          that.expressForm.eventType3 = res.data.eventType3
          that.expressForm.eventLevel = res.data.eventLevel
          that.eventIndex = res.data.eventType?res.data.eventType-1:0
          if(that.$route.query.fromTouch=="编辑" || that.$route.query.fromTouch=="续报"){
            that.expressForm.uid = res.data.uid
          }  
          if(that.$route.query.fromTouch=="编辑"){
            that.expressForm.code = res.data.code
            that.expressForm.editTime = res.data.editTime? res.data.editTime.replace(/-/g, "/"): ""
            that.expressForm.ceditTime = res.data.editTime? res.data.editTime.replace(/-/g, "/"): ""
            that.expressForm.receiptTime = res.data.receiptTime? res.data.receiptTime.replace(/-/g, "/"): ""
            that.expressForm.creceiptTime = res.data.receiptTime? res.data.receiptTime.replace(/-/g, "/"): "" 
          }  
          that.expressForm.eventType=[res.data.eventType1, res.data.eventType2, res.data.eventType3]
          that.expressForm.copyUnit = res.data.copyUnit
          that.expressForm.ccopyUnit = res.data.copyUnit
          setTimeout(()=>{
            if(that.expressForm.happenPrivoce && that.provinceOption && that.provinceOption.length>0){
              that.provinceOption.map((item)=>{
                if(item.label==that.expressForm.happenPrivoce){
                  that.cityOption=[]
                  that.getAreaList('city',item.value)
                }
              })
            }
          },500)
          setTimeout(()=>{
            if(that.expressForm.happenCity && that.cityOption && that.cityOption.length>0){
              that.cityOption.map((item)=>{
                if(item.label==that.expressForm.happenCity){
                  that.countyOption=[]
                  that.getAreaList('county',item.value)
                }
              })
            }
          },1000)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //阿拉伯数字换成中文数字
    NTC(num){
      let numList=num.toString().split('')
      let objStr=""
      var dw = new Array("十", "一", "二", "三", "四", "五", "六", "七", "八", "九")
      if(numList && numList.length==1){
        objStr=dw[parseInt(numList[0])]
      }else if(numList && numList.length==2){
        if(parseInt(numList[1])==0){
          objStr=parseInt(numList[0])==1?"十":dw[parseInt(numList[0])]+ "十"
        }else{
          if(parseInt(numList[0])==1){
            objStr="十" +dw[parseInt(numList[1])]
          }else{
            objStr=dw[parseInt(numList[0])]+ "十" +dw[parseInt(numList[1])]
          }
        }    
      }
      return objStr
    },
    //切换菜单
    changeType(i){
      if(this.isXubao){
        return
      }
      this.eventIndex=i
      this.allSetReady=false
      this.briefChecked=false
    },
    //是否续报
    showME(v){
      if(v==1){
        this.showModule=true
      }      
    },
    closeModule(){
      this.expressForm.whetherResubmit=0
      this.showModule=false
    },
    setNewEventInfo(v){
      this.seXubao=true
      this.getEventDetail(v)
      this.showModule=false
    },
    //设置事件类型
    handleEventType(value){
      if(value[0]){
        this.expressForm.eventType1 = value[0]
      }
      if(value[1]){
        this.expressForm.eventType2 = value[1]
      }
      if(value[2]){
        this.expressForm.eventType3 = value[2]
      }
    },
    //勾选简要描述
    changeBrief(){
      let that = this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(that.eventIndex==0 && that.expressForm.eventTitle && that.expressForm.eventTitle.length>70){
            that.$message({
              message: "事件标题不能超过70个字，请修改后再操作",
              type: 'warning'
            })
            that.briefChecked=false
            return
          }
          if(that.eventIndex==1 && that.expressForm.ctitle && that.expressForm.ceventTitle.length>70){
            that.$message({
              message: "事件标题不能超过70个字，请修改后再操作",
              type: 'warning'
            })
            that.briefChecked=false
            return
          }
          if(that.eventIndex==0){
            if(new Date(that.expressForm.happenTime).getTime()>new Date(that.expressForm.receiptTime).getTime()){
              that.$message({
                message: "事发时间不能晚于接报时间",
                type: 'warning'
              })
              that.briefChecked=false
              return
            }
          }
          if(new Date(that.expressForm.receiptTime).getTime()>new Date(that.expressForm.editTime).getTime()){
            that.$message({
              message: "接报时间不能晚于编发时间",
              type: 'warning'
            })
            that.briefChecked=false
            return
          }
          if(that.briefChecked){
            that.allSetReady=true
            if(this.eventIndex==0){
              that.expressForm.mattersDesc = `${that.expressForm.eventTitle}，《要情快报》第${that.expressForm.code}号，${this.userInfo.userName}已编发。`
            }
            if(this.eventIndex==1){
              that.expressForm.mattersDesc = `${that.expressForm.ceventTitle}，《要情快报》第${that.expressForm.code}号，${this.userInfo.userName}已编发。`
            }
          }else{
            that.allSetReady=false
          }   
        }else{
          that.allSetReady=false
          that.briefChecked=false
        }
      })
    },
    //返回
    backPre(){
      let that = this
      that.$alert('是否确定要返回？', '返回', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            that.$router.back(-1)
          }
          if(action==='cancel'){
            return
          }
        }
      })
    },
    //保存/预览
    onSubmit(){
      let that = this
      if(that.expressForm.mattersDesc==""){
        that.$message({
          message: "简要描述不能为空",
          type: 'warning'
        })
        return
      }
      this.saveLoading=true
      let params={}
      let dutyWorkMattersEditDto={}
      dutyWorkMattersEditDto.handleStatus=that.expressForm.handleStatus
      dutyWorkMattersEditDto.mattersDesc=that.expressForm.mattersDesc
      dutyWorkMattersEditDto.uid=this.$route.query.banUid || null
      if(that.eventIndex==0){        
        params={
          uid:that.expressForm.uid? that.expressForm.uid:null,
          code:that.expressForm.code,
          editTime:formatDate(that.expressForm.editTime),
          receiptTime: formatDate(that.expressForm.receiptTime),
          eventTitle:that.expressForm.eventTitle,
          editor:that.expressForm.editor,
          signer:that.expressForm.signer,
          verifier:that.expressForm.verifier,
          eventType:that.eventIndex==0? 1: 2,
          happenTime:formatDate(that.expressForm.happenTime),
          happenPrivoce:that.expressForm.happenPrivoce,
          happenCity:that.expressForm.happenCity,
          happenCounty:that.expressForm.happenCounty,
          happenAddress:that.expressForm.happenAddress,
          eventType1:that.expressForm.eventType1,
          eventType2:that.expressForm.eventType2,
          eventType3:that.expressForm.eventType3,
          eventLevel:that.expressForm.eventLevel,
          copyUnit:that.expressForm.copyUnit || null,
          reportToLeader:that.expressForm.reportToLeader || null,
          dutyWorkMattersEditDto:dutyWorkMattersEditDto,
          reportUnit:this.userInfo.rmsUnitDto.uid
        }
      }else{
        params={
          uid:that.expressForm.uid? that.expressForm.uid:null,
          code:that.expressForm.code,
          editTime:formatDate(that.expressForm.ceditTime),
          receiptTime: formatDate(that.expressForm.creceiptTime),
          eventTitle:that.expressForm.ceventTitle,
          editor:that.expressForm.ceditor,
          signer:that.expressForm.csigner,
          verifier:that.expressForm.cverifier,
          copyUnit:that.expressForm.ccopyUnit || null,
          reportToLeader:that.expressForm.creportToLeader || null,
          eventType:that.eventIndex==0? 1: 2,
          dutyWorkMattersEditDto:dutyWorkMattersEditDto,
          reportUnit:this.userInfo.rmsUnitDto.uid
        }
      }
      if(this.$route.query.fromTouch=="新增" || this.$route.query.fromTouch=="续办"){        
        postEventReport(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            this.sendUid=res.data
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=3&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.openFullScreen()
          }else if(res && res.code=="10060007"){
            this.$alert(res.viewMsg, '提示', {
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              callback: action => {
                if(action==='confirm'){
                  this.getGenerateNo()
                }
                if(action==='cancel'){
                  return
                }
              }
            })
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }else if(this.$route.query.fromTouch=="续报"){
        postEventReport(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            this.sendUid=res.data
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=3&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
            this.openFullScreen()
          }else if(res && res.code=="10060007"){
            this.$alert(res.viewMsg, '提示', {
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              callback: action => {
                if(action==='confirm'){
                  this.getGenerateNo()
                }
                if(action==='cancel'){
                  return
                }
              }
            })
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }else if(this.$route.query.fromTouch=="编辑"){
        putEventReport(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            console.log('111',res)
            this.sendUid=this.$route.query.uid
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=3&uid=' + this.$route.query.uid
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
            this.openFullScreen()
          }
        }).catch((error)=>{
          this.saveLoading=false
          console.log("接口报错=>",error)
        })
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.adex-content{
  width: 100%;
  height: calc(100% - 60px);
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px 40px;
  .event-type{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #E5EAF4;
    .event-type-unit{
      width: 130px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      color: $font_666;
      margin-right: 10px;
      border: 1px solid #E5EAF4;
      border-bottom: none;
      border-radius: 10px 10px 0px 0px;
      cursor: pointer;
    }
    .event-type-active{
      border: none;
      background-color: $Secondary4_color;
      color: #ffffff;
    }
  }
  .form-content{
    .inline-form{
      display: flex;
      flex-direction: row;
      align-items: center; 
      .right-inline{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;  
      }
    }
    .check-style{
      position: absolute;
      top: 0px;
      left: -98px;
      z-index: 5;
    }
    .tip-req{
      color: #F56C6C;
      position: absolute;
      top: 0px;
      left: -78px;
      z-index: 5;
    }
    .inst-unit{
      position: relative;
      i{
        position: absolute;
        top: 5px;
        right: 7%;
        font-size: 30px;
        color: $Secondary4_color;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.adex-content{
  .inline-form{
    .el-form-item__content{
      margin-left: 0px !important;
      width: 70%;
    }
    .el-form-item{
      display: flex;
      flex-direction: row;
      align-items: center; 
    }
    .el-form-item__label{
      width: 100px !important;
      display: inline-block;
    }
  }
  .form-three{
    width: calc(90% + 10px);
    justify-content: space-around;
    .el-form-item:nth-of-type(1){
      width: 33%;
    }
    .el-form-item:nth-of-type(2){
      width: 33%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .el-form-item:nth-of-type(3){
      width: 34%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .el-input{
      width: 100%;
    }
  } 
  .form-two{
    width: calc(90% + 10px);
    justify-content: space-between;
    .el-form-item{
      width: 50%;
      .el-date-editor.el-input{
        width: 100%;
      }
    }
  } 
  .com-two{
    width: calc(90% + 10px);
    .el-form-item__content{
      width: 50%;
      .el-date-editor.el-input{
        width: 70%;
      }
      .el-select{
        width: 70%;
      }
    }
  }   
  .com-three{
    width: calc(90% + 10px);
    .el-form-item__content{
      width: calc(100% - 100px);
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .el-select:nth-of-type(1){
        width: calc(33% - 20px);
      }
      .el-select:nth-of-type(2){
        width: calc(33% - 20px);
      }
      .el-select:nth-of-type(3){
        width: calc(34% - 0px);
        margin-right: 0px !important;
      }
    }
  }  
  .com-four{
    width: calc(90% + 10px);
    .el-form-item:nth-of-type(1){
      width: 31%;
      .el-select{
        width: calc(100% - 10px);
      }
    }
    .el-form-item:nth-of-type(2){
      width: 23%;
      .el-form-item__content{
        width: calc(100% - 20px);
        .el-select{
          width: calc(100% - 0px);
        }
      }
    }
    .el-form-item:nth-of-type(3){
      width: 23%;
      .el-form-item__content{
        width: calc(100% - 20px);
        .el-select{
          width: calc(100% - 0px);
        }
      }
    }
    .el-form-item:nth-of-type(4){
      width: 23%;
      .el-form-item__content{
        width: calc(100% - 0px);
        .address-detail{
          width: calc(100% - 0px);
        }
      }
    }
  }  
}
</style>