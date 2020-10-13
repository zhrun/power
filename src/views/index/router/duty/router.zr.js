/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:42:24 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-08-10 15:53:36
 */

export default  [
// 值班值守首页
  {
    path: "ondutymain",
    name: "ondutymain",
    component: () => import('@/views/index/components/duty/onDuty/dutymain.vue'),
  },
  //值班值守列表
  {
    path: "ondutylist",
    name: "ondutylist",
    component: () => import('@/views/index/components/duty/onDuty/dutyList.vue'),
  },
//值班值守所有
  {
    path: "ondutyall",
    name: "ondutyall",
    component: () => import('@/views/index/components/duty/onDuty/allList.vue'),
  },
  //编排值班
  {
    path: "editduty",
    name: "editDuty",
    component: () => import('@/views/index/components/duty/dutyMange/editDuty.vue'),
  },
  //浏览值班表
  {
    path: "browsedutylist",
    name: "browseDutyList",
    meta: {
      keepAlive: true,
      isBack:true
    },
    component: () => import('@/views/index/components/duty/dutyMange/browseDutyList.vue'),
  },
  //编排值班
  {
    path: "modifyduty",
    name: "modifyDuty",
    meta: {
      // keepAlive: true,
      // isBack:true,
      father: "browseDutyList"
    },
    component: () => import('@/views/index/components/duty/dutyMange/modifyDuty.vue'),
  },
  //导入编排值班 
  {
    path: "inputduty",
    name: "inputDuty",
    meta: {
      father: "browseDutyList"
    },
    component: () => import('@/views/index/components/duty/dutyMange/inputDuty.vue'),
  },
  //换班管理
  {
    path: "shiftmanage",
    name: "shiftManage",
    meta: {
      keepAlive: false,
      isBack:false
    },
    component: () => import('@/views/index/components/duty/dutyMange/shiftManage.vue'),
  },
  //替班管理
  {
    path: "substitutemanage",
    name: "substituteManage",
    meta: {
      // keepAlive: true,
      // isBack:true
    },
    component: () => import('@/views/index/components/duty/dutyMange/substituteManage.vue'),
  },
  //浏览值班表
  {
    path: "browseduty",
    name: "browseDuty",
    meta: {
      keepAlive: true,
      isBack:true
    },
    component: () => import('@/views/index/components/duty/dutyQuery/browseDuty.vue'),
  },
  //下级值班表
  {
    path: "lowerlevelduty",
    name: "lowerLevelDuty",
    meta: {
      // keepAlive: true,
      // isBack:true
    },
    component: () => import('@/views/index/components/duty/dutyQuery/lowerLevelDuty.vue'),
  },
  //   下发通知公告
  {
    path: "issueNotice",
    name: "issueNotice",
    meta: {
      keepAlive: true,
      isBack: true,
    },
    component: () =>
      import("@/views/index/components/duty/handleNotice/issueNotice.vue"),
  },
  {
    path: "addNotice",
    name: "addNotice",
    meta: {
      father:'issueNotice'
    },
    component: () =>
      import("@/views/index/components/duty/handleNotice/addNotice.vue"),
  },
  {
    path: "editNotice",
    name: "editNotice",
    meta: {
      father:'issueNotice'
    },
    component: () =>
      import("@/views/index/components/duty/handleNotice/editNotice.vue"),
  },
  //   接收通知公告
  {
    path: "receiveNotice",
    name: "receiveNotice",
    component: () =>
      import("@/views/index/components/duty/handleNotice/receiveNotice.vue"),
  },
  //   查询通知公告
  {
    path: "querryNotice",
    name: "querryNotice",
    component: () =>
      import("@/views/index/components/duty/handleNotice/querryNotice.vue"),
  },
  //   职务管理
  {
    path: "jobManagement",
    name: "jobManagement",
    component: () =>
      import("@/views/index/components/duty/systemsetting/jobManagement.vue"),
  },
  //   级别管理
  {
    path: "levelManagement",
    name: "levelManagement",
    component: () =>
      import("@/views/index/components/duty/systemsetting/levelManagement.vue"),
  },
  //   敏感日设置
  {
    path: "sensitiveSetting",
    name: "sensitiveSetting",
    component: () =>
      import("@/views/index/components/duty/systemsetting/sensitiveSetting.vue"),
  },
  //   职务管理
  {
    path: "eventExpressSetting",
    name: "eventExpressSetting",
    component: () =>
      import("@/views/index/components/duty/systemsetting/eventExpressSetting.vue"),
  },

]


