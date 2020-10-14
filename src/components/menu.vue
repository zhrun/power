<template>
  <div class="vlb_menu">
    <div class="main-left-menu">
      <div class="menu-logo" >
        <img :src="logoImg" alt="">
      </div>
      <!-- <div :class="mainControlNum==1?'zhiban':'jiebao'" @click="switchMainMenu(1)" :style="mainControlNum==2?'border-bottom-right-radius: 15px;':''">
        <div class="white-border" v-show="mainControlNum==1"></div>
        <img :src="mainControlNum==1? zhibanzhishou: zhibanzhishouD" alt="">
        <span :style="mainControlNum==1?'color:#ffffff':'color:#9d9ff6'">值班值守</span>
      </div>
      <div :class="mainControlNum==2?'zhiban':'jiebao'" @click="switchMainMenu(2)" :style="mainControlNum==1?'border-top-right-radius: 15px;':''">
        <div class="white-border" v-show="mainControlNum==2"></div>
        <img :src="mainControlNum==2? tufajiebao: tufajiebaoD" alt="">
        <span :style="mainControlNum==2?'color:#ffffff':'color:#9d9ff6'">突发接报</span>
      </div> -->
      
      <div
        v-for="item in menuTopList"
        :key="item.mainControlNum"
        :class="[
          mainControlFlag==item.mainControlNum?'zhiban':'jiebao',
         
        ]"
        @click="switchMainMenu(item.mainControlNum)"
      >
        <div class="white-border" v-show="mainControlFlag==item.mainControlNum"></div>
        <img :src="mainControlFlag==item.mainControlNum? imgList[item.imgName]: imgList[item.imgName + 'D']" alt="">
        <span :style="mainControlFlag==item.mainControlNum?'color:#ffffff':'color:#9d9ff6'">{{item.name}}</span>
      </div>
      <!-- <div class="menu-bottom" :class="mainControlFlag==menuTopList[menuTopList.length-1].mainControlNum?'right-top-radius':''"></div> -->
      <!-- <div class="jiebao"></div> -->
    </div>
    <div class="main-right-menu">
      <el-scrollbar class="scroll" >
        <div class="menu_content">
          <div class="top-title">
            <p class="main-title">应急信息化综合平台</p>
            <p class="pri-title">{{unitName}}</p>
          </div>
          <el-menu :default-active="activeMenuName" :unique-opened="true" v-show="mainControlFlag==0">
            <div v-for="(item, index) in powerList" :key="'powerList' + index">
              <el-submenu v-if="item.children && item.children.length > 0" :index="item.uid">
                <template slot="title">
                  <i class="iconfont" :class="item.style"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </template>
                <el-menu-item v-for="(child, index) in item.children" :key="'son_menu' + index" :index="child.routeName"
                  @click="onNavigate(child.routeName)" style="position:relative">
                  <i class="point-icon"></i>
                  <span slot="title" :val="child.routeName" class="child-title">
                    {{child.resourceName}}
                    <span class="tip-num" v-show="child.tipNum>0">{{child.tipNum}}</span>
                  </span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.routeName" @click="onNavigate(item.routeName)">
                <span slot="title">{{item.resourceName}}</span>
              </el-menu-item>
            </div>
          </el-menu>
          <el-menu :default-active="activeMenuName" :unique-opened="true" v-show="mainControlFlag==1">
            <div v-for="(item, index) in dutyMenuList" :key="'dutyMenu' + index">
              <el-submenu v-if="item.children && item.children.length > 0" :index="item.uid">
                <template slot="title">
                  <i class="iconfont" :class="item.style"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </template>
                <el-menu-item v-for="(child, index) in item.children" :key="'son_menu' + index" :index="child.routeName"
                  @click="onNavigate(child.routeName)" style="position:relative">
                  <i class="point-icon"></i>
                  <span slot="title" :val="child.routeName" class="child-title">
                    {{child.resourceName}}
                    <span class="tip-num" v-show="child.tipNum>0">{{child.tipNum}}</span>
                  </span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.routeName" @click="onNavigate(item.routeName)">
                <span slot="title">{{item.resourceName}}</span>
              </el-menu-item>
            </div>
          </el-menu>
          <el-menu :default-active="activeMenuName" :unique-opened="true" v-show="mainControlFlag==2">
            <div v-for="(item, index) in reportMenuList" :key="'reportMenuList' + index">
              <el-submenu v-if="item.children && item.children.length > 0" :index="item.uid">
                <template slot="title">
                  <i class="iconfont" :class="item.style"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </template>
                <el-menu-item v-for="(child, index) in item.children" :key="'son_menu' + index" :index="child.routeName"
                  @click="onNavigate(child.routeName)" style="position:relative">
                  <i class="point-icon"></i>
                  <span slot="title" :val="child.routeName" class="child-title">
                    {{child.resourceName}}
                    <span class="tip-num" v-show="child.tipNum>0">{{child.tipNum}}</span>
                  </span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.routeName" @click="onNavigate(item.routeName)">
                <span slot="title">{{item.resourceName}}</span>
              </el-menu-item>
            </div>
          </el-menu>
          <el-menu :default-active="activeMenuName" :unique-opened="true" v-show="mainControlFlag==3">
            <div v-for="(item, index) in reresourceMenuList" :key="'reresourceMenu' + index">
              <el-submenu v-if="item.children && item.children.length > 0" :index="item.uid">
                <template slot="title">
                  <i class="iconfont" :class="item.style"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </template>
                <el-menu-item v-for="(child, index) in item.children" :key="'son_menu' + index" :index="child.routeName"
                  @click="onNavigate(child.routeName)" style="position:relative">
                  <i class="point-icon"></i>
                  <span slot="title" :val="child.routeName" class="child-title">
                    {{child.resourceName}}
                    <span class="tip-num" v-show="child.tipNum>0">{{child.tipNum}}</span>
                  </span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="item.children && !item.children.length" :index="item.routeName" @click="onNavigate(item.routeName)">
                <template slot="title">
                  <i class="iconfont" :class="item.style"></i>
                  <span slot="title">{{item.resourceName}}</span>
                </template>
              </el-menu-item>
              <el-menu-item v-else :index="item.routeName" @click="onNavigate(item.routeName)">
                <span slot="title">{{item.resourceName}}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  getUnreadApproveCount,
  getUnreadCheckCount,
} from "@/views/index/api/eas/api.ps.js";
import _get from "lodash/get";

export default {
  props: ["permission"],
  data() {
    return {
      activeMenuName: "",
      powerList:[{
        resourceName:'系统管理',
        uid:'power1',
        style:'',
        children:[{
          resourceName:'用户管理',
          routeName:'systemUser',
          uid:'power1-1',
          style:'',
        },{
          resourceName:'资源管理',
          routeName:'systemResource',
          uid:'power1-2',
          style:'',
        },
        {
          resourceName:'角色管理',
          routeName:'systemRole',
          uid:'power1-3',
          style:'',
        },
        {
          resourceName:'接口管理',
          routeName:'systemInterface',
          uid:'power1-4',
          style:'',
        },{
          resourceName:'用户组管理',
          routeName:'systemUsergroup',
          uid:'power1-5',
          style:'',
        },{
          resourceName:'权限组管理',
          routeName:'systempermission',
          uid:'power1-6',
          style:'',
        }]
      }],
      reportMenuList: [],
      reresourceMenuList: [],
      dutyMenuList: [],
      message: null,
      news: null,
      mainControlFlag: 0,
      logoImg: require("../assets/img/logo.png"),
      imgList: {
        tufajiebao: require("../assets/img/tufajiebao.png"),
        tufajiebaoD: require("../assets/img/tufajiebao-d.png"),
        zhibanzhishou: require("../assets/img/zhibanzhishou.png"),
        zhibanzhishouD: require("../assets/img/zhibanzhishou-d.png"),
        jiuyuanziyuan: require("../assets/img/jiuyuanziyuan.png"),
        jiuyuanziyuanD: require("../assets/img/jiuyuanziyuan-d.png"),
      },
      unitName: "",
      menuTopList: [
        {
          name: "系统管理",
          menuListName: 'dutyMenuList',
          mainControlNum: 0,
          imgName: "zhibanzhishou",
          groupId: 'duty',
          isShow:true,
        },
        {
          name: "值班值守",
          menuListName: 'dutyMenuList',
          mainControlNum: 1,
          imgName: "zhibanzhishou",
          groupId: 'duty',
          isShow:true,
        },
        {
          name: "突发接报",
          menuListName: 'reportMenuList',
          mainControlNum: 2,
          imgName: "tufajiebao",
          groupId: 'report',
          isShow:true,
        },
        {
          name: "救援资源",
          menuListName: 'reresourceMenuList',
          mainControlNum: 3,
          imgName: "jiuyuanziyuan",
          groupId: 'resource',
          isShow:true,
        },
      ]
    };
  },
  mounted() {
    this.permissionToMenu();
    this.changeActiveMenu(this.$route);
    const userInfo = JSON.parse(localStorage.getItem("vis_user_info") || "{}");
    this.unitName = _get(userInfo, "dutyUserInfo.unitName", "");
  },
  watch: {
    $route(to) {
      this.changeActiveMenu(to);
    },
    unverifyNum: function(val) {
      let that = this;
      that.reportMenuList.map((item) => {
        if (item.children && item.children.length > 0) {
          item.children.map((obj) => {
            if (obj.resourceName == "待审批") {
              obj.tipNum = val;
            }
          });
        }
      });
      that.$forceUpdate();
    },
    programNum: function(val) {
      let that = this;
      that.reportMenuList.map((item) => {
        if (item.children && item.children.length > 0) {
          item.children.map((obj) => {
            if (obj.resourceName == "小程序接报") {
              obj.tipNum = val;
            }
          });
        }
      });
      that.$forceUpdate();
    },
  },
  computed: {
    ...mapState(["unverifyNum", "programNum"]),
  },
  methods: {
    getUnreadApproveCount() {
      let that = this;
      getUnreadApproveCount().then((res) => {
        if (res && res.data >= 0) {
          that.reportMenuList.map((item) => {
            if (item.children && item.children.length > 0) {
              item.children.map((obj) => {
                if (obj.resourceName == "待审批") {
                  obj.tipNum = res.data;
                  this.$store.dispatch("updateUnverifyNumAsync", res.data);
                }
              });
            }
          });
          that.$forceUpdate();
        }
      });
    },
    getUnreadCheckCount() {
      let that = this;
      getUnreadCheckCount().then((res) => {
        if (res && res.data >= 0) {
          that.reportMenuList.map((item) => {
            if (item.children && item.children.length > 0) {
              item.children.map((obj) => {
                if (obj.resourceName == "小程序接报") {
                  obj.tipNum = res.data;
                  this.$store.dispatch("updateProgramNumAsync", res.data);
                }
              });
            }
          });
          that.$forceUpdate();
        }
      });
    },
    switchMainMenu(num) {
      this.mainControlFlag = num;
      const menuListName = this.menuTopList.find(({mainControlNum}) =>mainControlNum == num).menuListName
      if (!this[menuListName].length) {
        // 跳转到无权限页面
        this.$router.push({
          name: 'noPermission'
        })
        return
      }
      this.$router.push({
        name: this[menuListName][0].routeName
      })
    },
    openMenu(item) {
      item.open = !item.open;
    },
    onNavigate(name) {
      console.log('name',name);
      
      this.$router.push({ name: name, query: {
        t: +new Date()
      } });
      if (name == "peApproval") {
        this.getUnreadApproveCount();
      }
      if (name == "programUp") {
        this.getUnreadCheckCount();
      }
    },
    permissionToMenu() {
      let permissions =
        JSON.parse(localStorage.getItem("permission")) || this.permission;
      if (!permissions) {
        this.$router.push({ name: "login" });
        return;
      }
      // 根据权限菜单中第一个的groupId决定默认进入哪个子系统
      this.mainControlFlag = this.menuTopList.find(({groupId}) => groupId === permissions[0].groupId).mainControlNum
      
      // 值班值守menu
      const dutyPermissions = permissions.filter(({groupId}) => groupId === 'duty');
      if (dutyPermissions.length) {
        let _list = [];
        dutyPermissions.forEach((item) => {
          if (item.resourceLayer == 1) {
            _list.push(item);
          }
        });
        _list.forEach((one) => {
          one.children = [];
          dutyPermissions.forEach((two) => {
            if (two.resourceLayer == 2 && two.parentUid == one.uid) {
              one.children.push(two);
            }
          });
        });
        this.dutyMenuList = _list;
        
      }

      // 突发接报menu
      const reportPermissions = permissions.filter(({groupId}) => groupId === 'report');
      if (reportPermissions.length) {
        let _menu = [];
        reportPermissions.forEach((item) => {
          if (item.resourceLayer == 2) {
            _menu.push(item);
          }
        });
        _menu.forEach((one) => {
          one.children = [];
          reportPermissions.forEach((two) => {
            if (two.resourceLayer == 3 && two.parentUid == one.uid) {
              one.children.push(two);
            }
          });
        });
        this.reportMenuList = _menu;
      }

      // 救援资源menu
      const resourcePermissions = permissions.filter(({groupId}) => groupId === 'resource')
      if (resourcePermissions.length) {
        let resourceMenu = []
        resourcePermissions.forEach((item) => {
          if (item.resourceLayer == 3) {
            resourceMenu.push(item);
          }
        });
        resourceMenu.forEach((one) => {
          one.children = [];
          resourcePermissions.forEach((two) => {
            if (two.resourceLayer == 4 && two.parentUid == one.uid) {
              one.children.push(two);
            }
          });
        });
        this.reresourceMenuList = resourceMenu;
        let powerObj={
          uid:"4B63x7hOCXOgkVHu",
          style:"iconzuoanxia",
          resourceName:"系统管理",
          children:[
            {
              routeName:"usermanage",
              resourceName:"用户管理",
              tipNum:0,
            },
            {
              routeName:"rolemanage",
              resourceName:"角色管理",
              tipNum:0,
            },
            {
              routeName:"userground",
              resourceName:"用户组管理",
              tipNum:0,
            },
            {
              routeName:"jurismanage",
              resourceName:"权限组管理",
              tipNum:0,
            },
            {
              routeName:"unitmanage",
              resourceName:"单位管理",
              tipNum:0,
            },
          ],
        }
        this.reresourceMenuList.push(powerObj)
      }
    },
    // 处理菜单
    changeActiveMenu(oRoute) {
      if (oRoute.meta.father) {
        this.activeMenuName = oRoute.meta.father;
      } else {
        this.activeMenuName = oRoute.name;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.vlb_menu {
  width: 300px;
  background-color: #5458fe;
  display: flex;
  flex-direction: row;
  position: relative;
  z-index: 1;
  &::before{
    display: block;
    content: '';
    position: absolute;
    bottom: 100px;
    width: 300px;
    height: 168px;
    background: url("../assets/img/bg-bottom.png") left no-repeat ;
    background-size: contain;
    z-index: 0;
  }
  background-image: url("../assets/img/bg-top.png");
  background-size: 300px 110px, 300px 160px;
  background-repeat: no-repeat;
  background-position: left top, 0 620px;
  .main-left-menu {
    width: 80px;
    height: calc(100% - 0px);
     background-color: #4347dd;
    .menu-logo {
      width: 100%;
      height: 158px;
      background-color: #4347dd;
      background-image: url("../assets/img/bg-top.png");
      background-size: 300px 110px;
      background-repeat: no-repeat;
      background-position: left top;
      img {
        width: 50px;
        height: 50px;
        display: inline-block;
        margin-top: 30px;
        margin-left: 15px;
      }
    }
    .right-bottom-radius {
      border-bottom-right-radius: 15px;
    }
    .right-top-radius {
      border-top-right-radius: 15px;
    }
    .zhiban {
      width: 100%;
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
      background: #5458fe;
      z-index: 2;
      &::before{
        right: 0;
        top: -15px;
        position: absolute;
        display: block;
        content: "";
        height: 15px;
        width: 15px;
        z-index: 1;
        background: radial-gradient(30px at left top, transparent 48%, #5458fe 50%);
      }
      &::after{
        z-index: 1;
        right: 0;
        bottom: -15px;
        position: absolute;
        display: block;
        content: "";
        height: 15px;
        width: 15px;
        background: radial-gradient(30px at left bottom, transparent 48%, #5458fe 50%);
      }
      img {
        width: 32px;
        height: 32px;
        display: inline-block;
      }
      span {
        font-size: 12px;
        margin-top: 6px;
      }
    }
    .jiebao {
      width: 100%;
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #4347dd;
      cursor: pointer;
      position: relative;
      z-index: 0;
      img {
        width: 32px;
        height: 32px;
        display: inline-block;
      }
      span {
        font-size: 12px;
        margin-top: 6px;
      }
    }
    .white-border {
      width: 50px;
      height: 110px;
      background-color: #ffffff;
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: -47px;
      z-index: 3;
    }
    .menu-bottom {
      width: 100%;
      height: calc(100% - 600px);
      background-color: #4347dd;
      background-image: url("../assets/img/bg-bottom.png");
      background-size: 300px 160px;
      background-repeat: no-repeat;
      background-position: 0px 230px;
    }
  }
  .main-right-menu {
    width: 220px;
    height: calc(100% - 0px);
    overflow-y: auto;
  }
  .menu_content {
    .top-title {
      width: 100%;
      height: 148px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .main-title {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 800;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      margin-top: 20px;
    }
    .pri-title {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 16px;
      margin-left: 10px;
      text-align: center;
    }
    .icon {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin-right: 10px;
      line-height: 26px;
      font-size: 18px;
    }
    .icon_1 {
      background-position: -366px -424px;
    }
    .icon_2 {
      background-position: -432px -424px;
    }
    .icon_3 {
      background-position: -498px -422px;
    }
    .icon_4 {
      background-position: -562px -427px;
    }
    .icon_5 {
      background-position: -628px -426px;
    }
    .icon_6 {
      background-position: -696px -424px;
    }
    .point-icon {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ffffff;
      margin-left: 4px;
      margin-right: 22px;
    }
    .child-title{
      color: #bcbeff;
    }
    .message_news {
      position: absolute;
      padding: 4px;
      text-indent: 0px;
      min-width: 20px;
      color: #fff;
      text-align: center;
      background: $font_wran;
      border-radius: 50%;
      z-index: 99;
      right: 20px;
      top: 14px;
      line-height: 16px;
      text-align: center;
    }
    .tip-num {
      display: inline-block;
      padding: 10px 6px;
      border-radius: 11px;
      line-height: 0px;
      text-align: center;
      text-indent: 0px;
      background-color: #fb9400;
      font-size: 14px;
      color: #ffffff;
      margin-left: 6px;
      font-weight: 400;
    }
  }
}
.el-menu {
  .el-submenu__title {
    i {
      margin-right: 20px;
    }
  }
}
</style>

<style lang="scss">
.scroll {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
