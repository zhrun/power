<template>
  <div class="vlb_main">
    <!-- 左边是菜单 -->
    <div is="vlinkMenu" :permission="permission" class="vlb_left"></div>
    <!-- 右边是主体 -->
    <div class="vlb_right">
      <vlink-header :newList="newList"></vlink-header>
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </div>
    <websocket :newList="newList" @newNotice="newNotice"></websocket>
  </div>
</template>
<script>
import vlinkHeader from "_com/header.vue";
import vlinkMenu from "_com/menu.vue";
import vlinkFooter from "_com/footer.vue";
import websocket from "_com/common/websocket.vue";
import { PERMISSION } from "@/config/staticData.js";
import { getMessagePage, getEventType } from "@/views/index/api/onDuty/api.ps.js";
export default {
  components: { vlinkHeader, vlinkMenu, vlinkFooter, websocket },
  data() {
    return {
      permission:JSON.parse(localStorage.getItem("permission")) || PERMISSION,
      newList:[]
    };
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  created() {
  },
  mounted() {
    // localStorage.removeItem("event_type_list")
    if(JSON.parse(localStorage.getItem("loginType")) && JSON.parse(localStorage.getItem("loginType")).loginType==2){
      this.getMessagePage()
    }
    
    if(!localStorage.getItem("event_type_list")){
      setTimeout(()=>{
        this.getEventType()
      },1000)
    }
  },
  methods: {
    newNotice(){
      let that = this
      setTimeout(()=>{
        that.getMessagePage('bj')
      },1000)
    },
    getMessagePage(v){
      let params={
        "where.status":1,
        pageSize:10000
      }
      this.newList=[]
      getMessagePage(params).then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.list && res.data.list.length>0){
            this.dutyTip=true
            res.data.list.map((item)=>{
              let unit={}
              unit.uid=item.objUid
              unit.title=item.title
              if(item.type==1){
                unit.newType="值班信息"
                if(v && v=='bj' &&  window.location.href.indexOf("receiveDutyInformation")!=-1){
                  this.$store.dispatch("updateImmediateMessageAsync", {
                    immediateMessage: "receiveDutyInformation",
                  })
                }
              }else if(item.type==2){
                unit.newType="通知公告"
                if(v && v=='bj' &&  window.location.href.indexOf("receiveNotice")!=-1){
                  this.$store.dispatch("updateImmediateMessageAsync", {
                    immediateMessage: "receiveNotice",
                  })
                }
              }else if(item.type==3){
                unit.newType="要情快报批示"
                if(v && v=='bj' &&  window.location.href.indexOf("acceptLeaderInstructions")!=-1){
                  this.$store.dispatch("updateImmediateMessageAsync", {
                    immediateMessage: "acceptLeaderInstructions",
                  })
                }
              }else if(item.type==4){
                unit.newType="值班信息批示"
                if(v && v=='bj' &&  window.location.href.indexOf("acceptLeaderInstructions")!=-1){
                  this.$store.dispatch("updateImmediateMessageAsync", {
                    immediateMessage: "acceptLeaderInstructions",
                  })
                }
              }else if(item.type==5){
                unit.newType="抄送信息"
                if(v && v=='bj' &&  window.location.href.indexOf("acceptCCInfo")!=-1){
                  this.$store.dispatch("updateImmediateMessageAsync", {
                    immediateMessage: "acceptCCInfo",
                  })
                }
              }
              this.newList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    getEventType(){
      getEventType().then((res)=>{
        if(res && res.code==="00000000") {
          if(res.data && res.data.length>0){
            let eventTypeList=this.deepClone(res.data)
            localStorage.setItem("event_type_list", JSON.stringify(eventTypeList))
          }
        }
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
    },
    deepClone(obj){
      if(obj && obj.length>0){
        let objClone = []
        obj.map((item)=>{
          let unit={}
          unit.value = item.dictId
          unit.label = item.dictValue
          if(item.childList && item.childList.length>0){
            unit.children = this.deepClone(item.childList);
          }
          objClone.push(unit)
        })
        return objClone;
      }
    }    
  }
};
</script>
<style lang="scss" scoped>
.vlb_main {
  position: relative;
  width: 100%;
  height: calc(100% - 0px);
  min-height: 720px;
  .vlb_left {
    float: left;
    height: calc(100% - 0px);
  }
  .vlb_right {
    position: relative;
    width: calc(100% - 300px);
    height: calc(100% - 0px);
    float: left;
    background: $default_back;
    box-sizing: border-box;
    padding: 20px;
  }
}
</style>

<style lang="scss">
.vlb_right {
  > div {
    height: calc(100% - 68px);
  }
}
</style>