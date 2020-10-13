<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 新增值班信息.
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="duty-content">
      <el-scrollbar class="scorll" style="height:100%; width:100%">
        <div class="event-type">
          <p v-for="(item, index) in eventSwitch" :key="'item' + index" class="event-type-unit" :class="eventIndex==index? 'event-type-active': ''" @click="changeType(index)">{{item}}</p>
        </div>
        <el-form :model="expressForm" ref="expressForm" :rules="expressRule"  label-width="100px" class="form-content">
          <div class="inline-form form-two" style="margin-top: 30px">
            <el-form-item label="编号">
              <el-input type="text" placeholder="可备注相关内容" v-model="expressForm.code" readonly :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="编发时间" prop="editTime" :class="eventIndex==1?'right-inline':'right-inline'" v-if="eventIndex==0">
              <el-date-picker v-model="expressForm.editTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="编发时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="编发时间" prop="ceditTime" :class="eventIndex==1?'right-inline':'right-inline'" v-if="eventIndex==1">
              <el-date-picker v-model="expressForm.ceditTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="编发时间" :disabled="allSetReady">
              </el-date-picker>
            </el-form-item>
          </div>     
          <el-form-item label="是否续报" v-if="eventIndex==0">
            <el-radio-group v-model="expressForm.whetherResubmit" @change="showME" :disabled="allSetReady">
              <el-radio :label="0" :disabled="isXubao">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="eventIndex==0">
            <el-form-item label="信息标题" prop="title">
              <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.title" style="width: 90%;" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <div v-if="eventIndex==1">
            <el-form-item label="信息标题" prop="ctitle">
              <el-input type="text" placeholder="请输入标题" maxlength="70" v-model="expressForm.ctitle" style="width: 90%;" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="事发时间" prop="happenTime" v-if="eventIndex==0" class="com-two">
            <el-date-picker v-model="expressForm.happenTime" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="事发时间" :disabled="allSetReady" :picker-options="pickerOptions1">
            </el-date-picker>
          </el-form-item>
          <div class="inline-form com-four" v-if="eventIndex==0">
            <el-form-item label="事发地点" prop="happenPrivoceCode">
              <el-select v-model="expressForm.happenPrivoceCode" placeholder="省" style="margin-right:20px" :disabled="allSetReady" @change="selectProvince">
                <el-option v-for="item in provinceOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenCityCode">
              <el-select v-model="expressForm.happenCityCode" placeholder="市" style="margin-right:20px" :disabled="allSetReady" @change="selectCity">
                <el-option v-for="item in cityOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenCountyCode">
              <el-select v-model="expressForm.happenCountyCode" placeholder="县/区" style="margin-right:20px" :disabled="allSetReady" @change="selectCounty">
                <el-option v-for="item in countyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="happenAddress">
              <el-input type="text" placeholder="请输入详情地址" maxlength="70" v-model="expressForm.happenAddress" class="address-detail" :disabled="allSetReady"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="事件类型" v-if="eventIndex==0" prop="eventType">
            <el-cascader :options="eventTypeList" style="width: 90%;" v-model="expressForm.eventType" @change="handleEventType" :disabled="allSetReady"></el-cascader>
          </el-form-item>
          <el-form-item label="事件等级" prop="eventLevel" v-if="eventIndex==0" class="com-two">
            <el-select v-model="expressForm.eventLevel" placeholder="请选择" style="margin-right:20px" :disabled="allSetReady">
              <el-option v-for="item in levelOpration" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送" v-if="eventIndex==0" class="inst-unit">
            <el-select v-model="expressForm.copyUnit" style="width:90%" :disabled="allSetReady" multiple placeholder="平级单位，可选多个">
              <el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value" :disabled="allSetReady"></el-option>
            </el-select>
          </el-form-item>
          <div class="inline-form form-two" style="margin-top: 30px">
            <el-form-item label="编辑" prop="editor" v-if="eventIndex==0">
              <el-input type="text" maxlength="10" v-model="expressForm.editor" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="签发" prop="signer" class="right-inline" v-if="eventIndex==0">
              <el-input type="text" maxlength="10" v-model="expressForm.signer" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="编辑" prop="ceditor" v-if="eventIndex==1">
              <el-input type="text" maxlength="10" v-model="expressForm.ceditor" placeholder="请输入姓名" :disabled="allSetReady"></el-input>
            </el-form-item>
            <el-form-item label="签发" prop="csigner" class="right-inline" v-if="eventIndex==1">
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
import { getGenerateNo, getDutyDetail, postReportDuty, putDutyReportDuty, querySortList, putReportDutyReport } from "@/views/index/api/onDuty/api.ps.js";
import { getOnduy } from "@/views/index/api/onDuty/api.zr.js";
import { getAreaList } from "@/views/index/api/onDuty/api.yy.js";
export default {
  components: { visBreadcrumb, selectModuleEvent },
  data() {
    return {
      breadcrumbData: [{ name: "信息处理" },{ name: "上报值班信息", routerName: "updateDutyInformation"}, { name: "新增值班信息" }],
      eventSwitch:["突发事件", "普通信息"],
      eventIndex:0,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        },
      },
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
        code:"",
        editTime:"",
        ceditTime:"",
        whetherResubmit: 0,
        title:"",
        ctitle:"",
        happenTime:"",
        happenPrivoceCode:"",
        happenCityCode:"",
        happenCountyCode:"",
        happenAddress:"",
        eventLevel:"",
        eventType:[],
        eventType1:"",
        eventType2:"",
        eventType3:"",
        copyUnit:"",
        copyName:"",
        editor:"",
        signer:"",
        ceditor:"",
        csigner:"",
        handleStatus:2,
        mattersDesc:""
      },
      uid:"",
      expressRule:{
        title:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        ctitle:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        happenTime:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        eventLevel:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenPrivoceCode:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenCityCode:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenCountyCode:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        happenAddress:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        eventType:[
          {required: true, message: '此项为必选项', trigger: 'blur'},
        ],
        editor:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        signer:[
          {required: true, message: '此项为必填项', trigger: 'blur'},
        ],
        ceditor:[
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
      isZhuanweishangbao:false,
      moduleType:"update",
      unitList:[],
      fullLoading:null,
      saveLoading:false,
      reportDutyInfoUid:null,
      isPageOffice:false,
    };
  },
  mounted() {
    this.expressForm.editTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    this.expressForm.ceditTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(/-/g, "/")
    if(localStorage.getItem("vis_user_info")){
      this.userInfo=JSON.parse(localStorage.getItem("vis_user_info"))
      this.expressForm.editor=this.userInfo.userName
      this.expressForm.ceditor=this.userInfo.userName
    }
    this.eventTypeList=JSON.parse(localStorage.getItem("event_type_list")) || []
    //获取抄送单位
    this.querySortList()
    //获取省市县
    this.getAreaList("province", 1);
    //监听pageOffice上报值班信息
    window.reportDutyInfo = ()=>{
      this.isPageOffice=true
      this.reportDutyInfos()
    }
    //监听pageOffice关闭窗口事件
    window.closePageoffice = ()=>{
      if(this.$route.query && this.$route.query.noClose){
        return
      }
      if(!this.isPageOffice){
        this.closeFullScreen()
        this.isPageOffice=false
      }
    }
    if(this.$route.query && this.$route.query.fromTouch){
      if(this.$route.query.fromTouch=="新增"){
        this.getGenerateNo()
        this.getOnduy()
        this.expressForm.happenPrivoceCode=this.userInfo.rmsUnitDto.province || ""
        this.expressForm.happenCityCode=this.userInfo.rmsUnitDto.city || ""
        this.expressForm.happenCountyCode=this.userInfo.rmsUnitDto.county || ""
        let that=this
        setTimeout(()=>{
          if(that.expressForm.happenPrivoceCode && that.provinceOption && that.provinceOption.length>0){
            that.provinceOption.map((item)=>{
              if(item.label==that.expressForm.happenPrivoceCode){
                that.cityOption=[]
                that.getAreaList('city',item.value)
              }
            })
          }
        },500)
        setTimeout(()=>{
          if(that.expressForm.happenCityCode && that.cityOption && that.cityOption.length>0){
            that.cityOption.map((item)=>{
              if(item.label==that.expressForm.happenCityCode){
                that.countyOption=[]
                that.getAreaList('county',item.value)
              }
            })
          }
        },1000)
      }else if(this.$route.query.fromTouch=="转为上报"){
        this.getGenerateNo()
        this.getDutyDetail(this.$route.query.uid)
        this.isZhuanweishangbao=true
        this.moduleType="update"
      }else if(this.$route.query.fromTouch=="续报"){
        this.expressForm.whetherResubmit=1
        this.isXubao=true
        this.getGenerateNo()
        this.getDutyDetail(this.$route.query.uid)
        this.breadcrumbData=[{ name: "信息处理" },{ name: "上报值班信息", routerName: "updateDutyInformation"}, { name: "续报值班信息" }]
      }else if(this.$route.query.fromTouch=="续办"){
        this.isXuban=true
        this.getGenerateNo()
        this.getDutyDetail(this.$route.query.uid)
      }else if(this.$route.query.fromTouch=="编辑"){
        this.getDutyDetail(this.$route.query.uid)
        this.breadcrumbData=[{ name: "信息处理" },{ name: "上报值班信息", routerName: "updateDutyInformation"}, { name: "编辑值班信息" }]
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
        this.fullLoading.close()
      }
      if(!this.isPageOffice){
        this.$router.push({ name: "updateDutyInformation", query:{refresh:true} })
      }
    },
    reportDutyInfos(){
      let that = this
      that.fullLoading.close();
      that.$alert('您确认要上报此信息吗？', '上报', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if(action==='confirm'){
            let params={
              uid:that.reportDutyInfoUid
            }
            putReportDutyReport(params).then((res)=>{
              if(res && res.code==="00000000"){
                that.$router.push({ name: "updateDutyInformation", query:{refresh:true} })
              }
            }) 
          }
          if(action==='cancel'){
            that.$router.push({ name: "updateDutyInformation", query:{refresh:true} })
          }
        }
      })
    },
    //获取编号
    getGenerateNo(){
      let that = this
      let params={
        type: 1
      }
      getGenerateNo(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.code = parseInt(res.data)
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    //获取平级机构
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
          this.expressForm.happenPrivoceCode=item.label
        }
      })
      this.expressForm.happenCityCode=""
      this.expressForm.happenCountyCode=""
      this.expressForm.happenAddress=""
    }, 
    //设置县下拉框数据
    selectCity(v){
      this.countyOption=[]
      this.getAreaList('county',v)
      this.cityOption.map((item)=>{
        if(item.value==v){
          this.expressForm.happenCityCode=item.label
        }
      })
      this.expressForm.happenCountyCode=""
      this.expressForm.happenAddress=""
    },
    //设置县数据
    selectCounty(v){
      this.countyOption.map((item)=>{
        if(item.value==v){
          this.expressForm.happenCountyCode=item.label
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
    //获取要情快报详情
    getDutyDetail(uid){
      let that = this
      let params={
        uid: uid
      }
      getDutyDetail(params).then((res)=>{
        if(res && res.code==="00000000") {
          that.expressForm.title = that.isXubao || this.seXubao? `${res.data.title}【续报${that.NTC(res.data.index)}】`: that.isXuban?`【续办】${res.data.title}`:res.data.title
          that.expressForm.ctitle = that.isXubao || this.seXubao? `${res.data.title}【续报${that.NTC(res.data.index)}】`: that.isXuban?`【续办】${res.data.title}`: res.data.title
          that.expressForm.signer = res.data.signer
          that.expressForm.csigner = res.data.signer
          that.expressForm.editor = res.data.editor
          that.expressForm.ceditor = res.data.editor
          that.expressForm.happenTime = res.data.happenTime? res.data.happenTime.replace(/-/g, "/"): ""
          that.expressForm.happenPrivoceCode = res.data.happenPrivoceCode
          that.expressForm.happenCityCode = res.data.happenCityCode
          that.expressForm.happenCountyCode = res.data.happenCountyCode
          that.expressForm.happenAddress = res.data.happenAddress
          that.expressForm.eventType1 = res.data.eventType1
          that.expressForm.eventType2 = res.data.eventType2
          that.expressForm.eventType3 = res.data.eventType3
          that.expressForm.eventLevel = res.data.eventLevel
          that.eventIndex = res.data.type?res.data.type-1:0
          that.expressForm.eventType=[res.data.eventType1, res.data.eventType2, res.data.eventType3]
          if(that.$route.query.fromTouch=="编辑" || that.$route.query.fromTouch=="续报"){
            that.uid = res.data.uid
          }
          if(that.$route.query.fromTouch=="编辑"){
            that.expressForm.code = res.data.code
            that.expressForm.editTime = res.data.editTime? res.data.editTime.replace(/-/g, "/"): ""
            that.expressForm.ceditTime = res.data.editTime? res.data.editTime.replace(/-/g, "/"): ""
          }
          that.expressForm.copyUnit = res.data.copyUnit
          setTimeout(()=>{
            if(that.expressForm.happenPrivoceCode && that.provinceOption && that.provinceOption.length>0){
              that.provinceOption.map((item)=>{
                if(item.label==that.expressForm.happenPrivoceCode){
                  that.cityOption=[]
                  that.getAreaList('city',item.value)
                }
              })
            }
          },500)
          setTimeout(()=>{
            if(that.expressForm.happenCityCode && that.cityOption && that.cityOption.length>0){
              that.cityOption.map((item)=>{
                if(item.label==that.expressForm.happenCityCode){
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
      this.getDutyDetail(v)
      this.showModule=false
    },
    //勾选简要描述
    changeBrief(){
      let that = this
      that.$refs.expressForm.validate(valid => {
        if(valid){
          if(this.eventIndex==0 && that.expressForm.title && that.expressForm.title.length>70){
            that.$message({
              message: "事件标题不能超过70个字，请修改后再操作",
              type: 'warning'
            })
            that.briefChecked=false
            return
          }
          if(this.eventIndex==1 && that.expressForm.ctitle && that.expressForm.ctitle.length>70){
            that.$message({
              message: "事件标题不能超过70个字，请修改后再操作",
              type: 'warning'
            })
            that.briefChecked=false
            return
          }
          if(this.eventIndex==0){
            if(new Date(that.expressForm.happenTime).getTime()>new Date(that.expressForm.editTime).getTime()){
              that.$message({
                message: "事发时间不能晚于编发时间",
                type: 'warning'
              })
              that.briefChecked=false
              return
            }
          }
          if(that.briefChecked){
            that.allSetReady=true
            if(this.eventIndex==0){
              that.expressForm.mattersDesc = `${that.expressForm.title}，《值班信息》第${that.expressForm.code}号，${that.userInfo.userName}已编发。`
            }else{
              that.expressForm.mattersDesc = `${that.expressForm.ctitle}，《值班信息》第${that.expressForm.code}号，${that.userInfo.userName}已编发。` 
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
          uid:that.uid? that.uid:null,
          code:that.expressForm.code,
          editTime:formatDate(that.expressForm.editTime),
          title:that.expressForm.title,
          editor:that.expressForm.editor,
          signer:that.expressForm.signer,
          type:that.eventIndex==0? 1: 2,
          dutyWorkMattersEditDto:dutyWorkMattersEditDto,
          happenTime:formatDate(that.expressForm.happenTime),
          happenPrivoceCode:that.expressForm.happenPrivoceCode,
          happenCityCode:that.expressForm.happenCityCode,
          happenCountyCode:that.expressForm.happenCountyCode,
          happenAddress:that.expressForm.happenAddress,
          eventType1:that.expressForm.eventType1,
          eventType2:that.expressForm.eventType2,
          eventType3:that.expressForm.eventType3,
          eventLevel:that.expressForm.eventLevel,
          copyUnit:that.expressForm.copyUnit || null,
        }
      }else{
        params={
          uid:that.uid? that.uid:null,
          code:that.expressForm.code,
          editTime:formatDate(that.expressForm.ceditTime),
          title:that.expressForm.ctitle,
          editor:that.expressForm.ceditor,
          signer:that.expressForm.csigner,
          type:that.eventIndex==0? 1: 2,
          dutyWorkMattersEditDto:dutyWorkMattersEditDto
        }
      }
      if(this.$route.query.fromTouch=="新增" || this.$route.query.fromTouch=="转为上报" || this.$route.query.fromTouch=="续办"){
        postReportDuty(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=2&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr, 'fullscreen=yes;frame=no;')
            this.reportDutyInfoUid=res.data
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
        postReportDuty(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=2&uid=' + res.data
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
            this.reportDutyInfoUid=this.$route.query.uid
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
        putDutyReportDuty(params).then((res)=>{
          this.saveLoading=false
          if(res && res.code==="00000000") {
            let objStr = ajaxCtx.uem + '/duty/page-office/edit?wordType=2&uid=' + this.$route.query.uid
            window.POBrowser.openWindowModeless(objStr,'fullscreen=yes;frame=no;')
            this.reportDutyInfoUid=this.$route.query.uid
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
.duty-content{
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
.duty-content{
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