
export default [
  /*-------------------- 值班值守>>信息处理 --------------------*/

  // 信息处理>接报值班信息
  {
    path: "receiveDutyInformation",
    name: "receiveDutyInformation",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/handleInfo/receiveDutyInformation.vue'),
  },
  // 信息处理>接报值班信息>批示值班信息
  {
    path: "receiveExpress",
    name: "receiveExpress",
    meta: {
      father: 'receiveDutyInformation'
    },
    component: () => import('@/views/index/components/duty/handleInfo/receiveExpress.vue'),
  },
  // 信息处理>接报值班信息>新增批示下发
  {
    path: "receiveAddExpress",
    name: "receiveAddExpress",
    meta: {
      father: 'receiveDutyInformation'
    },
    component: () => import('@/views/index/components/duty/handleInfo/receiveAddExpress.vue'),
  },
  // 信息处理>要情快报
  {
    path: "importantExpress",
    name: "importantExpress",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/handleInfo/importantExpress.vue'),
  },
  // 信息处理>要情快报>新增要情快报
  {
    path: "addExpress",
    name: "addExpress",
    meta: {
      father: 'importantExpress'
    },
    component: () => import('@/views/index/components/duty/handleInfo/addExpress.vue'),
  },
  // 信息处理>要情快报>批示要情快报
  {
    path: "instructeExpress",
    name: "instructeExpress",
    meta: {
      father: 'importantExpress'
    },
    component: () => import('@/views/index/components/duty/handleInfo/instructeExpress.vue'),
  },
  // 信息处理>要情快报>新增批示下发
  {
    path: "instructeAddExpress",
    name: "instructeAddExpress",
    meta: {
      father: 'importantExpress'
    },
    component: () => import('@/views/index/components/duty/handleInfo/instructeAddExpress.vue'),
  },
  // 信息处理>上报值班信息
  {
    path: "updateDutyInformation",
    name: "updateDutyInformation",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/handleInfo/updateDutyInformation.vue'),
  },
  // 信息处理>上报值班信息>新增值班信息
  {
    path: "addUpdateDutyInfo",
    name: "addUpdateDutyInfo",
    meta: {
      father: 'updateDutyInformation'
    },
    component: () => import('@/views/index/components/duty/handleInfo/addUpdateDutyInfo.vue'),
  },
  // 信息处理>接收抄送信息
  {
    path: "acceptCCInfo",
    name: "acceptCCInfo",
    meta: {
      
    },
    component: () => import('@/views/index/components/duty/handleInfo/acceptCCInfo.vue'),
  },
  // 信息处理>已退回信息
  {
    path: "alreadyBackInfo",
    name: "alreadyBackInfo",
    meta: {
      
    },
    component: () => import('@/views/index/components/duty/handleInfo/alreadyBackInfo.vue'),
  },

  /*-------------------- 值班值守>>领导批示办理 --------------------*/

  // 领导批示办理>接收上级批示
  {
    path: "acceptLeaderInstructions",
    name: "acceptLeaderInstructions",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/leaderInstructHandles/acceptLeaderInstructions.vue'),
  },
  // 领导批示办理>接收上级批示>新增批示反馈
  {
    path: "addInstructeFeedback",
    name: "addInstructeFeedback",
    meta: {
      father: 'acceptLeaderInstructions'
    },
    component: () => import('@/views/index/components/duty/leaderInstructHandles/addInstructeFeedback.vue'),
  },
  // 领导批示办理>查询批示反馈
  {
    path: "queryInstructFeedback",
    name: "queryInstructFeedback",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/leaderInstructHandles/queryInstructFeedback.vue'),
  },
  // 领导批示办理>查询批示下发
  {
    path: "queryInstructHairdown",
    name: "queryInstructHairdown",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/leaderInstructHandles/queryInstructHairdown.vue'),
  },
  // 领导批示办理>查询批示下发>批示反馈列表
  {
    path: "feedBackList",
    name: "feedBackList",
    meta: {
      father: 'queryInstructHairdown'
    },
    component: () => import('@/views/index/components/duty/leaderInstructHandles/feedBackList.vue'),
  },

  /*-------------------- 值班值守>>文电拟办 --------------------*/

  // 文电拟办>来文拟办
  {
    path: "proposedCommunication",
    name: "proposedCommunication",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/messageCommunication/proposedCommunication.vue'),
  },
  // 文电拟办>来文拟办>新增来文拟办
  {
    path: "newCommunication",
    name: "newCommunication",
    meta: {
      father: 'proposedCommunication'
    },
    component: () => import('@/views/index/components/duty/messageCommunication/newCommunication.vue'),
  },
  // 文电拟办>来电拟办
  {
    path: "callCommunication",
    name: "callCommunication",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/messageCommunication/callCommunication.vue'),
  },
  // 文电拟办>来电拟办>新增来电拟办
  {
    path: "calCommunication",
    name: "calCommunication",
    meta: {
      father: 'callCommunication'
    },
    component: () => import('@/views/index/components/duty/messageCommunication/calCommunication.vue'),
  },
  // 文电拟办>电话记录
  {
    path: "telephoneRecords",
    name: "telephoneRecords",
    meta: {
      keepAlive: true,
      isBack: false,
    },
    component: () => import('@/views/index/components/duty/messageCommunication/telephoneRecords.vue'),
  },
  // 文电拟办>电话记录>新增电话记录
  {
    path: "newTelephoneRecord",
    name: "newTelephoneRecord",
    meta: {
      father: 'telephoneRecords'
    },
    component: () => import('@/views/index/components/duty/messageCommunication/newTelephoneRecord.vue'),
  },
]


