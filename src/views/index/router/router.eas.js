import dutyRouter from './duty/index.js'
import supRouter from './supplies/index.js'
import sysRouter from './system/index.js'


let easRouter = [
  /*-------------------- 突发接报 --------------------*/
  // 人工录入
  {
    path: "manualUp",
    name: "manualUp",
    meta: {
      keepAlive: true,
      isBack: true
    },
    component: () => import('@/views/index/components/eas/burstReception/manualUp.vue'),
  },
  // 新增人工录入
  {
    path: "manualVerify",
    name: "manualVerify",
    meta: {
      father: 'manualUp'
    },
    component: () => import('@/views/index/components/eas/burstReception/manualVerify.vue'),
  },
  // 人工录入详情
  {
    path: "manualDetails",
    name: "manualDetails",
    meta: {
      father: 'manualUp'
    },
    component: () => import('@/views/index/components/eas/burstReception/manualDetails.vue'),
  },
  // APP接报
  {
    path: "appUp",
    name: "appUp",
    component: () => import('@/views/index/components/eas/burstReception/appUp.vue'),
  },
  // 小程序接报
  {
    path: "programUp",
    name: "programUp",
    meta: {
      keepAlive: true,
      isBack: true
    },
    component: () => import('@/views/index/components/eas/burstReception/programUp.vue'),
  },
  // 查看小程序接报
  {
    path: "programDetails",
    name: "programDetails",
    meta: {
      father: 'programUp'
    },

    component: () => import('@/views/index/components/eas/burstReception/programDetails.vue'),
  },
  // 核实小程序接报
  {
    path: "programVerify",
    name: "programVerify",
    meta: {
      father: 'programUp'
    },
    component: () => import('@/views/index/components/eas/burstReception/programVerify.vue'),
  },
  /*-------------------- 上级通知 --------------------*/
  // 审批不通过
  {
    path: "failedUp",
    name: "failedUp",
    meta: {
      keepAlive: true,
      isBack: true
    },
    component: () => import('@/views/index/components/eas/superiorNotice/failedUp.vue'),
  },
  {
    path: "failDetail",
    name: "failDetail",
    // meta: {
    //   father: 'failedUp'
    // },
    component: () => import('@/views/index/components/eas/superiorNotice/failDetail.vue'),
  },
  /*-------------------- 接报审批 --------------------*/
  // 待审批
  {
    path: "peApproval",
    name: "peApproval",
    meta: {
      keepAlive: true,
      isBack: true
    },
    component: () => import('@/views/index/components/eas/approvalReception/peApproval.vue'),
  },
  {
    path: "prOpration",
    name: "prOpration",
    // meta: {
    //   father: 'peApproval'
    // },
    component: () => import('@/views/index/components/eas/approvalReception/prOpration.vue'),
  },
  // 已审批
  {
    path: "approved",
    name: "approved",
    meta: {
      keepAlive: true,
      isBack: true
    },
    component: () => import('@/views/index/components/eas/approvalReception/approved.vue'),
  },
  {
    path: "finishPro",
    name: "finishPro",
    meta: {
      father: 'approved'
    },
    component: () => import('@/views/index/components/eas/approvalReception/finishPro.vue'),
  },
  /*-------------------- 参数设置 --------------------*/
  // 小程序参数
  {
    path: "programParams",
    name: "programParams",
    component: () => import('@/views/index/components/eas/paramsSetting/programParams.vue'),
  },
  // 其他参数
  {
    path: "otherParams",
    name: "otherParams",
    component: () => import('@/views/index/components/eas/paramsSetting/otherParams.vue'),
  },
  // 问题反馈
  {
    path: "feedbackProblems",
    name: "feedbackProblems",
    component: () => import('@/views/index/components/eas/feedbackProblems/feedbackProblems.vue'),
  },
  /*-------------------- 统计分析 --------------------*/
  // 统计分析
  {
    path: "statistics",
    name: "statistics",
    component: () => import('@/views/index/components/eas/statistics/statistics.vue'),
  },
]
easRouter = [...easRouter,...dutyRouter,...supRouter,...sysRouter] 
export default easRouter
