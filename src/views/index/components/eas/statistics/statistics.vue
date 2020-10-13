<template>
  <div class="flex">
    <div class="flexup">
      <div class="flexc nobg" style="margin-left:0px">
        <h3>今日概况
          <span class="unit">单位：件</span>
        </h3>
        <div class="tablist">
          <div class="item blue">
            <img src="_assets/img/icons/item3.png" />
            <div>
              <h2>{{dhs}}</h2>
              <p>待核实</p>
            </div>
          </div>
          <div class="item green">
            <img src="_assets/img/icons/item2.png" />
            <div>
              <h2>{{dsp}}</h2>
              <p>待审批</p>
            </div>
          </div>
          <div class="item yellow">
            <img src="_assets/img/icons/item1.png" />
            <div>
              <h2>{{ysp}}</h2>
              <p>已审批</p>
            </div>
          </div>
        </div>
        <div class="mchart"  v-if="count && count>0">
          <div class="chart3" id="chart1"></div>
        </div>
        <div class="nomess" v-else>
            <img src="_assets/img/noall.png" alt="">
            <p>暂无内容</p>
        </div>
      </div>
      <div class="flexc">
       <h3><p>近七天事件统计 <b>（截至昨日）</b></p><span>单位：件</span></h3>
        <div class="chart" v-if="sevenData && (sevenData.reportEventByPhone!=0 || sevenData.reportEventByApp!=0 || sevenData.reportEventByWxmini!=0 || sevenData.reportEventByLeader!=0 || sevenData.reportEventOtherNum!=0 || sevenData.checkSuccessNum!=0 || sevenData.approveSuccessNum!=0 )">
          <div class="tx" >
            <div class="txL"></div>
            <div class="txR"></div>
            <div class="intxL"></div>
            <div class="intxR"></div>
            <div class="intx">
              <span class="tx1" @mousemove="showTip(1,$event)" @mouseout="hideTip(1)" :style="'width:'+ ((sevenData.reportEventByPhone*60/totle)+10)+'%'">{{sevenData.reportEventByPhone}}</span>
              <!-- <span class="tx2">{{sevenData.reportEventByApp}}</span> -->
              <span class="tx2"  @mousemove="showTip(2,$event)" @mouseout="hideTip(2)" :style="'width:'+ ((sevenData.reportEventByWxmini*60/totle)+10)+'%'">{{sevenData.reportEventByWxmini}}</span>
              <span class="tx3"  @mousemove="showTip(3,$event)" @mouseout="hideTip(3)" :style="'width:'+ ((sevenData.reportEventByLeader*60/totle)+10)+'%'">{{sevenData.reportEventByLeader}}</span>
              <span class="tx4"  @mousemove="showTip(4,$event)" @mouseout="hideTip(4)" :style="'width:'+ ((sevenData.reportEventOtherNum*60/totle)+10) +'%'">{{sevenData.reportEventOtherNum}}</span>
            </div>
            <div class="tip" v-show="isTip" :style="'left:'+tipLeft+'px;top:'+tipTop+'px;'">
              <span><i :style="'background:'+tipColor"></i>{{tipValue}}</span>
            </div>
          </div>
          <div class="chartx3" id="chart2" style="width:360px;margin:auto;"></div>
          <div class="labelx">
            <ul>
              <li>
                <i class="lb1"></i> 电话接报
              </li>
              <!-- <li>
                <i class="lb2"></i> APP接报
              </li> -->
              <li>
                <i class="lb3"></i> 小程序接报
              </li>
              <li>
                <i class="lb4"></i> 上级督办
              </li>
              <li>
                <i class="lb5"></i> 其他渠道
              </li>
              <li>
                <i class="lb6"></i> 核实通过
              </li>
              <li>
                <i class="lb7"></i> 审批通过
              </li>
            </ul>
          </div>
        </div>
        <div class="nomess" v-else>
          <img src="_assets/img/noall.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
      <div class="flexc" style="margin-right:0px">
        <h3>
            <p>
              本周事件类型统计
              <span>（{{thisWeekStartDay}}-{{thisWeekEndDay}}）</span>
            </p><span class="unit">单位：件</span>
          </h3>
        <div class="chart" v-show="!hide2">
          <div class="chart3" id="chart3"></div>
        </div>
        <div class="nomess" v-show="hide2">
          <img src="_assets/img/noall.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
      
    </div>
    <div class="flexdown">
      <div class="flexc" style="margin-left:0px">
        <h3>
          <div>事件发生趋势</div>
          <div>
            <span>上报时间 </span>
            <el-date-picker
              v-model="value1"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getEventTrendOverview"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1"
            ></el-date-picker>
          </div>
        </h3>
        <div class="chart" v-if="!hide4">
          <span class="unit">（件）</span>
          <div class="chart4" id="chart4"></div>
        </div>
        <div class="nomess" v-else>
          <img src="_assets/img/noall.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
      <div class="flexc" style="margin-right:0px">
        <h3>
          <div>各接报员的工作情况</div>
          <div>
            <span>工作时间 </span>
            <el-date-picker
              v-model="value2"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="getWorkOverview"
              :picker-options="pickerOptions2"
            ></el-date-picker>
          </div>
        </h3>
        <div class="chart" v-if="!hide5">
          <span class="unit">（件）</span>
          <div class="chart4" id="chart5"></div>
        </div>
        <div class="nomess" v-else>
          <img src="_assets/img/noall.png" alt="">
          <p>暂无内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
import { getDaysOverview, getEventTrendOverview, getTypeOverview, getWorkOverview, getTodayOverview } from "@/views/index/api/eas/api.eas.js";
import { formatDate } from "@/utils/util.js";
export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime() - 24*60*60*1000;
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6 - 24*60*60*1000);
              end.setTime(end.getTime() - 24*60*60*1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - 24*60*60*1000);
              end.setTime(end.getTime() - 24*60*60*1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90 - 24*60*60*1000);
              end.setTime(end.getTime() - 24*60*60*1000);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      isTip:false,
      tipValue:'',
      tipColor:'',
      tipLeft:0,
      tipTop:0,
      value1: [],
      value2: [],
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      hide2:false,
      hide4:false,
      hide5:false,
      count: null,
      totle:1,
      dhs: 0,
      dsp: 0,
      ysp: 0,
      sevenData: {},
      thisWeekStartDay:"",
      thisWeekEndDay:"",
    };
  },
  mounted() {
    let end = new Date();
    let start = new Date();
    let end2 = new Date();
    let start2 = new Date();
    let td = start2.getDay()-1
    if(td<0){
      td = 6
    }
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
    start2.setTime(start2.getTime() - 3600 * 1000 * 24 * td);
    end2.setTime(end2.getTime());
    this.value2 = [formatDate(start2, "yyyy-MM-dd"),formatDate(end2, "yyyy-MM-dd")];
    this.value1 = [formatDate(start, "yyyy-MM-dd"),formatDate(end, "yyyy-MM-dd")];
    if(new Date().getDay()==0){
      this.thisWeekStartDay=this.getTime(6)
      this.thisWeekEndDay=this.getTime(0)
    }else{
      let s=(new Date().getDay()-1)*-1
      this.thisWeekStartDay=this.getTime(0)
      this.thisWeekEndDay=this.getTime(s)
    }    
    this.getTodayOverview(); //1
    this.getDaysOverview(); //2
    this.getTypeOverview(); //3
    this.getEventTrendOverview(); //4
    this.getWorkOverview(); //5
  },
  methods: {
    getTime(num){
      let now=new Date();
      // let year=now.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      let month=now.getMonth()+1;
      let date=now.getDate();
      let day=now.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if(day!==0){
        num=num+(day-1);
      }else{
        num=num+day;
      }
      if(day){
        //这个判断是为了解决跨年的问题
        if(month>1){
          // month=month;
        } else{//这个判断是为了解决跨年的问题,月份是从0开始的
          // year=year-1;
          month=12;
        }
      }
      now.setDate(now.getDate()-num);
      // year=now.getFullYear();
      month=now.getMonth()+1;
      date=now.getDate();
      // s=year+"年"+(month<10?('0'+month):month)+"月"+(date<10?('0'+date):date)+"日";
      let s=(month<10?('0'+month):month)+"."+(date<10?('0'+date):date);
      return s;
    },
    //数组排序
    compare(property, desc) {
      return (a, b) => {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {          // 升序排列
          return value1 - value2;
        } else {          // 降序排列
          return value2 - value1;
        }
      };
    },
    getTodayOverview() {
      getTodayOverview().then(res => {
        if (res && res.code == "00000000") {
          let ds = [
            { item: "电话接报", count: res.data.reportEventByPhone },
            // { item: "APP接报 ", count: res.data.reportEventByApp },
            { item: "小程序接报", count: res.data.reportEventByWxmini },
            { item: "上级督办", count: res.data.reportEventByLeader },
            { item: "其他渠道", count: res.data.reportEventOtherNum }
          ];
          // this.count= res.data.reportEventByPhone+
          ds.forEach(el => [(this.count += el.count)]);
          this.dhs = res.data.uncheckNum;
          this.dsp = res.data.unapproveNum;
          this.ysp = res.data.approvedNum;
          if(this.count>0){
            setTimeout(()=>{
               this.reportChar1(ds);
            },100)
          }
        }
      }).catch(error => {
        console.log("error", error);
      });
    },
    getDaysOverview() {
      getDaysOverview().then(res => {
        if (res && res.code == "00000000") {
          this.sevenData = res.data;
          let ds = [
            // { value: res.data.reportEventByPhone, name: '电话接报' },
            // { value: res.data.reportEventByApp, name: 'APP接报' },
            // { value: res.data.reportEventByWxmini, name: '小程序接报' },
            // { value: res.data.reportEventByLeader, name: '上级督办' },
            // { value: res.data.reportEventOtherNum, name: '其他渠道' },
            { value: res.data.checkSuccessNum, name: "核实通过" },
            { value: res.data.approveSuccessNum, name: "审批通过" }
          ];
          this.totle = parseInt(res.data.reportEventByPhone+res.data.reportEventByWxmini+res.data.reportEventByLeader+res.data.reportEventOtherNum) 
          this.reportChar2(ds);
        }
      }).catch(error => {
        console.log("error", error);
      });
    },
    putDate(time,date){
       var date1 = new Date(time);
				var date2 = new Date(date1);
				date2.setDate(date1.getDate() + parseInt(date));
				// var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
				var Year = 0;
				var Month = 0;
				var Day = 0;
				var CurrentDate = "";
				Year = date2.getFullYear();
				Month = date2.getMonth() + 1;
				Day = date2.getDate();
				CurrentDate += Year + "-";
				if(Month >= 10) {
					CurrentDate += Month + "-";
				} else {
					CurrentDate += "0" + Month + "-";
				}
				if(Day >= 10) {
					CurrentDate += Day;
				} else {
					CurrentDate += "0" + Day;
        }
      // console.log('CurrentDate',CurrentDate);
        return CurrentDate
    },
    getFullDate(start,end){
      let startTime = new Date(start).getTime()
      let endTime = new Date(end).getTime()
      let count = (endTime-startTime)/(24*60*60*1000)+1
      let arr = []
      for(let i =0; i<count; i++){
        arr.push({
          date:this.putDate(start,i),
          receiveNum:0
        })
      }
      return arr
    },
    getEventTrendOverview() {
      if (!this.value1) {
        return;
      }
      let data = {
        startTime: this.value1[0],
        endTime: this.value1[1]
      };
      let newArry = this.getFullDate(this.value1[0], this.value1[1])
      // console.log('newArry',newArry);
      
      getEventTrendOverview(data).then(res => {
        if (res && res.code == "00000000") {
          if (res.data && res.data.length > 0) {
            let sourceData= res.data
            newArry.map(v=>{
              let mv = sourceData.find(el=>el.date==v.date)
              if(mv){
                v.receiveNum = mv.receiveNum
              }
              v.date=parseInt(v.date.split("-")[1]) + "月" + v.date.split("-")[2] + "日"
            })
            // res.data.map((item)=>{
            //   item.date=parseInt(item.date.split("-")[1]) + "月" + item.date.split("-")[2] + "日"
            // })
            this.hide4 = false
            setTimeout(()=>{
              this.reportChar4(newArry);
            },100)
          } else {
            console.log("数据为空");
            let data=[{},{}]
            data[0].date=parseInt(this.value1[0].split("-")[1]) + "月" + this.value1[0].split("-")[2] + "日"
            data[0].receiveNum=0
            data[1].date=parseInt(this.value1[1].split("-")[1]) + "月" + this.value1[1].split("-")[2] + "日"
            data[1].receiveNum=0
            
            this.hide4 = true
          }
        }
      }).catch(error => {
        console.log("error", error);
      });
    },
    getTypeOverview() {
      getTypeOverview().then(res => {
        if (res && res.code == "00000000") {
          if (res.data && res.data.length > 0) {
            this.reportChar3(res.data);
          } else {
            this.hide2=true
            console.log("数据为空");
          }
        }
      }).catch(error => {
        console.log("error", error);
      });
    },
    getWorkOverview() {
      if (!this.value2) {
        return;
      }
      let data = {
        startTime: this.value2[0],
        endTime: this.value2[1]
      };
      getWorkOverview(data).then(res => {
        if (res && res.code == "00000000") {
          if (res.data && res.data.length > 0) {
            let arr = [];
            res.data.forEach(el => {
              arr.push({
                company: "录入事件",
                type: el.name,
                value: el.recordNum
              });
              arr.push({
                company: "正常核实",
                type: el.name,
                value: el.checkNormalNum
              });
              arr.push({
                company: "超期核实",
                type: el.name,
                value: el.checkUnNormalNum
              });
            });
            this.hide5=false
            setTimeout(()=>{
              this.reportChar5(arr);
            },100)
            
          } else {
            console.log("数据为空");
            // let arr = [];
            this.hide5 = true
            // this.reportChar5(arr);
          }
        }
      }).catch(error => {
        console.log("error", error);
      });
    },
    reportChar1(ds) {
      const data = ds;
      let temp = document.getElementById("chart1");
      const chart = new G2.Chart({
        container: "chart1",
        forceFit: true,
        padding: [0, 20, 80, 20],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      chart.source(data);
      chart.coord("theta", {
        radius: 0.95,
        innerRadius: 0.7
      });
      chart.tooltip({
        showTitle: false,
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      chart.legend({
        // layout:'vertical',
        position: "bottom-center",
        useHtml: true,
        containerTpl:'<div class="g2-legend" >'
      + '<ul class="g2-legend-list" style="margin: auto;       display: flex;    flex-wrap: wrap;    justify-content: space-between; list-style-type:none;margin:0;padding:0;"></ul>'
      + '</div>',
      itemTpl:(value, color, checked, index)=>{
        const obj = data[index];
        let am='<li class="g2-legend-list-item item-{index} {checked} mrg" data-color="{color}" data-value="{value}" style=" width:40%;   white-space: nowrap; margin-right:0px;">' +
      '<i class="g2-legend-marker" style="background-color:{color};"></i>' +
      '<span class="g2-legend-text">{value} '+ obj.count +'件</span></li>'
         return am
        }
      });
      // 辅助文本
      chart.guide().html({
        position: ["50%", "50%"],
        html:
          '<div style="color:#333333;font-size: 14px;text-align: center;width: 10em;"><span style="color:#333333;font-size:24px"><b>' +
          this.count +
          "</b></span><br>上报事件</div>",
        alignX: "middle",
        alignY: "middle"
      }); //3AB7FF; 5289FF 2B3FFF 784FFF
      chart.intervalStack().position("count").color("item", ["#3AB7FF", "#5289FF", "#2B3FFF", "#784FFF", "#FF5955"])
        // .label('percent', {
        //   formatter: (val, item) => {
        //     return item.point.item + ': ' + val;
        //   }
        // })
        .tooltip("item*count", (item, count) => {
          // percent = percent * 100 + '%';
          return {
            name: item,
            value: count + "件"
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff"
        });
      chart.render();
      // interval.setSelected(data[0]);
      this.chart1 = chart;
    },
    showTip(e,ev){
      if(!this.isTip){
        this.isTip = true
        if(e==1){
          this.tipValue = '电话接报:'+this.sevenData.reportEventByPhone+'件'
          this.tipColor = '#3776FF'
         
        }else if(e==2){ 
          this.tipValue = '小程序接报:'+this.sevenData.reportEventByWxmini+'件'
           this.tipColor = '#4B84FF'
        }else if(e==3){
           this.tipValue = '上级督办:'+this.sevenData.reportEventByLeader+'件'
           this.tipColor = '#6394FF'
        }else if(e==4){
           this.tipValue = '其他渠道:'+this.sevenData.reportEventOtherNum+'件'
           this.tipColor = '#81A9FF'
        }
      }
       this.tipLeft = ev.layerX 
        this.tipTop = ev.offsetY - 40
    },
    hideTip(){
      this.isTip = false
      this.tipValue = ''
      this.tipColor = ''
    },
    reportChar2(ds) {
      // '#6596FF','#00F2EF','#00EA87','#FFEA00','#FF9434', '#FF7673', '#FF5955'
      let colors = ["#FF6662", "#FFB400"];
      // let num = 0
      // ds.forEach(el=>{
      //   num += el.value
      // })
      // console.log(num);
      
      // const expectData = ds;
      const dv = new View().source(ds);
      dv.transform({
        type: 'map',
        callback(row,index) {
          if(index==0){
             row.percent = 0.8
          }else{
             row.percent = 0.4
          }
          return row;
        }
      });
      const expectData = dv.rows;
      let temp = document.getElementById("chart2");
      const chart = new G2.Chart({
        container: "chart2",
        forceFit: true,
        padding: [0, 38, 90, 38],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      chart.coord("rect").transpose().scale(1, -1);
      chart.axis(false);
      chart.legend(false);
      chart.tooltip({
        showTitle: false,
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      const expectView = chart.view();
      expectView.source(expectData);
      // console.log('expectData',expectData);
      
      expectView.intervalSymmetric().position("name*percent").color("name", colors).shape("pyramid").tooltip('name*value', function (name, value) {
          return {
            name: name,
            value: value+"件",
          };
        }).opacity(0.35);
      const actualView = chart.view({
        start: {
          x: 0.1,
          y: 0
        }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
        end: {
          x: 0.9,
          y: 1
        }
      });
      actualView.source(expectData);
      actualView.intervalSymmetric().position("name*percent").color("name", colors).shape("pyramid").tooltip(false) .opacity(1);
      // .style({
      //   lineWidth: 1,
      //   stroke: '#fff'
      // });
      expectData.forEach(obj => {
        // 中间标签文本
        // console.log('obj',obj);
        
        actualView.guide().text({
          top: true,
          position: {
            name: obj.name,
            percent: "median"
          },
          content: String(obj.value), // 显示的文本内容
          style: {
            fill: "#ffffff",
            fontSize: "14",
            textAlign: "center",
            shadowBlur: 0,
            shadowColor: "rgba(0, 0, 0, .45)"
          }
        });
      });
      chart.render();
      this.chart2 = chart;
    },
    reportChar3(ds) {
      const data = ds;
      let temp = document.getElementById("chart3");
      this.chart3 = new G2.Chart({
        container: "chart3",
        forceFit: true,
        padding: [20, 20, 55, 30],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      this.chart3.source(data);
      this.chart3.scale("receiveNum", {
        tickInterval: 1
      });
      this.chart3
        .interval().shape("cylinder")
        .position("typeName*receiveNum")
        .color("#3776FF").size(20);
      this.chart3.tooltip({
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>数量: {value}件</li>'
      });
      this.chart3.render();
    },
    reportChar4(ds) {
      if (this.chart4) {
        this.chart4.destroy();
      }
      const data = ds;
      let temp = document.getElementById("chart4");
      this.chart4 = new G2.Chart({
        container: "chart4",
        forceFit: true,
        padding: [30, 35, 50, 30],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      this.chart4.source(data);
      this.chart4.scale("receiveNum", {
        min: 0
      });
      if(ds.length>30){
        this.chart4.axis('date',{
          label:{
            formatter(text, item, index) {
            let a =""
            if(index==0 || index==ds.length-1){
               a=text
            }
              return a
            },
          }
          
          // label:(text,i) => {
          //   console.log('text',i);
          //   return text+"op"
          //   //  text: 坐标轴对应字段的数值
          // }
        })
      }
      this.chart4.scale("date", {
        range: [0, 1]
      });
      this.chart4.tooltip({
        crosshairs: {
          type: "y"
        },
        itemTpl:
          '<li><span style="background-color:#26D7DF;" class="g2-tooltip-marker"></span>数量: {value}件</li>'
      });
      this.chart4.area().position("date*receiveNum").color("l(270) 0:#00D3C222 1:#00D3C2dd");
      this.chart4.line().position("date*receiveNum").color("#26D7DF").size(4).tooltip(false);
      this.chart4.point().position("date*receiveNum").color("#6696FF").size(6).shape("circle").active(false).style({
          stroke: "#fff",
          lineWidth: 2
        });
      this.chart4.render();
    },
    reportChar5(ds) {
      if (this.chart5) {
        this.chart5.destroy();
      }
      const data = ds;
      let temp = document.getElementById("chart5");
      this.chart5 = new G2.Chart({
        container: "chart5",
        forceFit: true,
        padding: [30, 20, 60, 30],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      this.chart5.source(data);
     
      this.chart5.axis("type", {
        label: {
          textStyle: {
            fill: "#000000"
          }
        },
        // tickLine: {
        //   alignWithLabel: false,
        //   length: 0
        // }
      });
      this.chart5.scale("value", {
        // tickInterval: 1
      });
      this.chart5.axis("value", {
        label: {
          textStyle: {
            fill: "#000000"
          }
        },
        title: {
          offset: 50
        }
      });
      this.chart5.legend({
        position: "bottom-center",
        marker:'circle'
      });
      this.chart5.interval().shape("cylinder").position("type*value").color("company", ["#747CE1", "#26D7DF", "#FF9434"]).opacity(1).size(20)
        .adjust([
          {
            type: "dodge",
            marginRatio: 1 / 32,

          }
        ]);
      this.chart5.tooltip({
        itemTpl:
          '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}件</li>'
      });
      this.chart5.render();
    }
  }
};
</script>
<style lang="scss">
.nomess{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90%;
}
.chart {
  .labelx {
    position: absolute;
    bottom: 20px;
    width: 80%;
    left: 50%;
    margin-left: -40%;
    ul {
      margin: auto;
      width: 88%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        white-space: nowrap;
        font-size: 12px;
        display: inline-block;
        margin: 0px 10px;
        line-height: 24px;
       width: 80px;
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
           border-radius: 50%;
        }
        .lb1 {
          background: #3AB7FF;
        }
        // .lb2 {
        //   background: #4B84FF;
        // }
        .lb3 {
          background: #5289FF;
        }
        .lb4 {
          background: #2B3FFF;
        }
        .lb5 {
          background: #784FFF;
        }
        .lb6 {
          background: #FF6662;
        }
        .lb7 {
          background: #FFBA34;
        }
      }
    }
  }
  .tx {
    height: 100px;
    margin: 0px auto;
    margin-top: 15px;
    position: relative;
    width: 424px;
    .tip{
      width: auto;
      background: #ffffff;
      line-height:  38px;
      padding: 0 10px;
      border-radius: 4px;
      box-shadow: 0px 0px 6px 1px #999999;
      position: absolute;
      left: 30%;
      top: 5%;
      z-index: 9;
      span{
        i{
         display: inline-block;
         width: 5px;
         height: 5px; 
         margin-right: 5px;
         border-radius: 50%;
        }
        font-size: 12px;
        color: #555555;
      }
    }
    .txL {
      position: absolute;
      left: -10px;
      top: 0;
      border-top: 100px solid #D0DFFF;
      border-left: 80px solid transparent;
      border-right: 80px solid transparent;
      width: 55%;
      // left: 50%;
      // margin-left: -60%;
    }
    .txR {
      position: absolute;
      top: 0;
      right: -10px;
      border-top: 100px solid #D0DFFF;
      border-left: 80px solid transparent;
      border-right: 80px solid transparent;
      width: 55%;
    }
    .intxL {
      position: absolute;
      left: calc(-8px + 9.5%);
      top: 0;
      border-top: 100px solid #3AB7FF;
      border-left: 66px solid transparent;
      border-right: 66px solid transparent;
      width: 55%;
      z-index: 1;
    }
    .intxR {
      position: absolute;
      top: 0;
      right:calc(-8px + 9.5%);
      border-top: 100px solid #784FFF;
      border-left: 80px solid transparent;
      border-right: 66px solid transparent;
      width: 55%;
      z-index: 1;
    }
    .intx {
      width: 54%;
      height: 100px;
      min-width: 224px;
      margin: auto;
      background: #81A9FF;
      overflow: hidden;
      position: relative;
      z-index: 6;
      span {
        display: inline-block;
        height: 100%;
        line-height: 100px;
        color: #ffffff;
        font-weight: bold;
        text-align: center;
      }
      .tx1 {
        min-width: 10%;
        // width: 38%;
        background: #3AB7FF; 
      }
      .tx2 {
        min-width: 10%;
        // width: 25%;
        background: #5289FF;
      }
      .tx3 {
        min-width: 10%;
        // width: 15%;
        background: #2B3FFF;
      }
      .tx4 {
        min-width: 10%;
        // width: 12%;
        background: #784FFF;
      }
      .tx5 {
        min-width: 10%;
        // width: 10%;
        background: #A1BFFF;
      }
    }
  }
  position: relative;
  height: calc(100% - 35px);
  .unit {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    color: #999999;
    background-color: #ffffff;
  }
}
.chart3 {
  height: calc(100% - 15px);
  margin-top: 10px;
}
.chartx3 {
  height: calc(100% - 90px);
  margin-top: 0px;
}
.chart4 {
  height: calc(100% - 30px);
  margin-top: 10px;
}
.flex {
  .flexx {
    display: flex;
    flex-direction: row;
    .flex1 {
      flex: 1;
      height: 100%;
    }
    .flex2 {
      flex: 2;
      height: 100%;
    }
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  .flexup {
    height: 49.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .flexc{
      h3{
        span{
          padding-top: 5px;
        }
      }
    }
    
  }
  .flexdown {
    height: 49.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .flexc {
    flex: 1;
    padding: 10px 10px;
    // border: solid 1px #dddddd;
    border-radius: 4px;
    margin: 10px 10px 0px 10px;
    background: #ffffff;
    h3 {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      b {
        font-size: 12px;
        color: #666;
        font-weight: normal;
      }
      div {
        line-height: 40px;
      }
      span {
        font-size: 12px;
        // line-height: 20px;
        color: #666;
        font-weight: normal;
        padding: 0px;
      }
    }
  }
  .nobg {
    display: flex;
    flex-direction: column;
    justify-content: initial;
    padding-top: 0px;
    padding-bottom: 0px;
    h3{
      padding-top: 10px;
      padding-bottom: 0px;
    }
    .chart3{
      margin-top: 0px;
    }
    .tablist {
      height: 25%;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      .item {
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        background: #ffffff;
        align-items: center;
        text-align: center;
        padding: 15px 5px;
        max-width: 100px;
        img {
          width: 46px;
        }
      }
      .blue {
        h2,
        p {
          color: #3776ff;
        }
        h2 {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .yellow {
        h2,
        p {
          color: #ffba34;
        }
        h2 {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .green {
        h2,
        p {
          color: #00da7e;
        }
        h2 {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .item:nth-child(2n) {
        margin: 0px 10px;
      }
    }
    .mchart {
      width: 100%;
      background: #ffffff;
      height:70%;
      padding: 10px 10px 5px 10px;
    }
  }
}
</style>
<style lang="scss">
.aleft {
  text-align: left !important;
}
.fz12 {
  font-size: 12px !important;
}
.mrg10 {
  margin-right: 20px !important;
}
.mtable {
  margin: 0px 12px !important;
}
.el-range-editor .el-range-input {
  font-weight: normal;
}
.mrg{
  margin-right: 0px !important;
}
// li:nth-child(even)
.mrg:nth-child(even){
  text-align: left;
}
.mrg:nth-child(odd){
 text-align: right;
}
</style>