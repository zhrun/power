<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      
       <div class="flex">
         <div class="fleft">
           <div class="ft">
             <div class="sbox">
              <span class="btn" :class="[{'active':active == 1}]" @click="changeList(1)">设备列表</span>
              <span class="btn" :class="[{'active':active == 2}]" @click="changeList(2)">设备地图</span>
             </div>
              <el-input placeholder="请输入内容" v-model="inputKey" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input> 
           </div>
           <div class="ct" v-show="active == 1">
              <el-scrollbar style="height:100%;">
                <el-tree :data="data" node-key="uid" :props="defaultProps" @node-click="handleNodeClick" icon-class="ic">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                   <span>
                     <i class="iconfont iconwenjianjia2" v-if="!data.deviceType"></i>
                     <i class="el-icon-copy-document" v-else></i>
                     {{ node.label }}
                    </span>
                  </span>
                </el-tree>
              </el-scrollbar>
           </div>
           <div class="ct" v-show="active==2">
              <div class="map" id="map"></div>
           </div>
         </div>
         <div class="fright">
            <div class="playbox">
               <video src="../../../../..//assets/play/demo.mp4" controls="controls">
                your browser does not support the video tag
              </video>
              <!-- <video crossOrigin="anonymous" :id="flvplayerId" style="width: 100%; height: 100%;"   autoplay="autoplay" muted></video> -->
            </div>
            <div class="playbox">
               <video src="../../../../..//assets/play/demo.mp4" controls="controls">
                your browser does not support the video tag
              </video>
            </div>
            <div class="playbox">
              <video src="../../../../..//assets/play/demo.mp4" controls="controls">
                your browser does not support the video tag
              </video>
            </div>
            <div class="playbox">
              <video src="../../../../..//assets/play/demo.mp4" controls="controls">
                your browser does not support the video tag
              </video>
            </div>
         </div>
       </div>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { queryCameraList} from "@/views/index/api/supplies/api.zr.js";
import {random14} from '@/utils/util.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "视频监控" },{ name: "视频监控" }],
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
        inputKey:'',
        active:1,
        data: [],
        defaultProps: {
          children: 'deviceInfoDtos',
          label: 'deviceName'
        },
        flvplayerId: 'flv_' + random14(),
        amap:null,
        mapConfig:{
        _name: "",
        zoom: 16,
        center: [110.596015, 27.907662],
        zooms: [10, 18]
      },
      allMarkers:[],
      videoLoading:false
      
    };
  },
  mounted() {
    this.queryCameraList()
    // this.initPlayerDo("")
  },
  methods: {
    // 直播播放（播放/回放）
      initPlayerDo (surl) {
        if (window.flvjs.isSupported()) {
          this.videoLoading = true;
          var videoElement = document.getElementById(this.flvplayerId);
          var flvPlayer = window.flvjs.createPlayer({
            type: 'flv',
            url: surl,
            isLive: true
          }, {
            enableWorker: true,
            enableStashBuffer: false,
            stashInitialSize: 128
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
        
          flvPlayer.play();
          // 加载失败
          let failedOut = window.setTimeout(() => {
            this.videoLoadingFailed = true;
          }, this.videoLoadingTimeout);
          // 真正处于播放的状态，这个时候我们才是真正的在观看视频。
          videoElement.onplaying = () => {
            if (failedOut) { window.clearTimeout(failedOut); }
            this.videoLoading = false;
            this.videoLoadingFailed = false;
            if (this.config.pause) {
              this.playActive = false;
              flvPlayer.pause();
            }
            this.startPlayTime = new Date().getTime();
          };
          videoElement.onerror = () => {
            this.videoLoadingFailed = true;
            console.log('player video error: ', videoElement.error);
          };
         

          this.player = flvPlayer;
          this.video = videoElement;

          if (this.oData.type === 2) {
            // 回放 的时候需要添加ended事件
            videoElement.addEventListener('ended', this.playNext, false);
          }
        }
      },
    async queryCameraList(d){
       const {code, data } = await queryCameraList(d)
       if(code ==='00000000'){
         if(data.length>0){
           data.map(el=>{
             el.deviceName=el.warehouseName
           })
         }
        this.data = data
        console.log('this',this.data);
        
      }
    },
   handleNodeClick(data) {
        console.log(data);
      },
    changeList(v) {
      this.active = v
      if(v==2){
        if(!this.amap){
          this.initMap(this.mapConfig)
        }
      }
    },
    initMap(d){
      this.amap = new window.AMap.Map('map', d);
      this.data.forEach(el=>{
        this.drawMarker(this.amap,el.deviceInfoDtos,this.allMarkers)
      })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageNum = 1;
    },
    drawMarker(map, oData, aMarkers) {

        if (oData && oData.length > 0) {
          for (let i = 0; i < oData.length; i++) {
            let obj = oData[i]
            if (obj.longitude > 0 && obj.latitude > 0) {
              let marker = new window.AMap.Marker({ // 添加自定义点标记
                map: map,
                position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                offset: new window.AMap.Pixel(-13, -30), // 相对于基点的偏移位置
                zIndex: 122,
                draggable: false, // 是否可拖动
                extData: obj,
                icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                // 自定义点标记覆盖物内容
                // content: obj.isGlint == '0' ? '<div id="s' + obj.uid + '" class="vis-map-mk gif ' + markersType[obj.iconType] + '"></div>' : '<div id="s' + obj.uid + '" class="vis-map-mk ' + markersType[obj.iconType] + '"></div>'
              });
              // let label = new AMap.Text({
              //   content: ' ',
              //   // offset: new AMap.Pixel(-10, -10),
              //   zIndex: 122,
              //   map: map
              // });
             marker.on('click', function(mEvent){
               let a = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(16, -25),
                  // offset: new AMap.Pixel(aOffSet[0], aOffSet[1]), // 相对于基点的偏移位置
                  content: `<div class="winInfo"><h3>视频信息</h3><p>地址：${obj.deviceAddress}</p></div>`,
                });
                let aCenter = mEvent.target.getPosition()
                a.open(map, aCenter);
             });

              
              aMarkers.push(marker);
            }
          }
        }
      
    },
  },
};
</script>
<style lang="scss" scoped>
  /deep/ .amap-icon img,.amap-marker-content img{
    width: 25px;
    height: 34px;
  }
  /deep/ .winInfo{
    width: 180px;
    background: #fff;
    border: solid 1px #dddddd;
    h3{
      background: #f5f5f5;
      line-height: 32px;
      padding: 0px 10px;
      font-size: 14px;
    }
    p{
      font-size: 14px;
      padding: 10px;
    }
  }
.ment_center{
  text-align: center;
}
.full_height{
  height: 100%; 
}
.flex{
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .fleft{
    height: 100%;
    width: 38%;
    
    .ft{
      height: 45px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      /deep/ .el-input-group__append{
        padding: 0px 10px;
        
      }
      /deep/ .el-input__inner{
          height: 30px;
          line-height: 30px;
        }
      .btn{
        cursor: pointer;
        display: inline-block;
        width: 65px;
        border-radius: 4px;
        text-align: center;
        line-height: 28px;
        color: #999;
        background: #fff;
        &:first-child{
        margin-right:10px;
        }
        &.active{
          background:$main_color ;
          color: #fff;
        }
      }
      .input-with-select{
        width: calc(100% - 150px);
      }
    }
    .ct{
      height: calc(100% - 45px);
      border: solid 1px #D7DAE1;
      .map{
        width: 100%;
        height: 100%;
      }
    }
  }
  .fright{
    width: 62%;
    height: 100%;
    padding-left:15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content:space-between;
    .playbox{
      width: 49%;
      // margin: 0 1%;
      height: 49%;
      video{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
