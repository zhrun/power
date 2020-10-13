/*
 * API
 * dev: 开发环境    test: 测试环境    prod: 生产环境
 * */
const oDomains = {
  base: {
    dev: 'http://apidev.aorise.org/visual-emi/api/emi',
    test: 'http://apirel.aorise.org/visual-emi/api/emi',
    prod: 'http://apirel.aorise.org/visual-emi/api/emi'
  },
  // 用户权限地址
  auth: {
    dev: 'http://10.116.65.78:8084/api/auth',
    test: 'http://apirel.aorise.org/muem-auth/api/auth',
    prod: 'http://apirel.aorise.org/muem-auth/api/auth'
  },
  // 视频数据
  vis: {
    dev: 'http://apidev.aorise.org/visual-vis/api/vis',
    test: 'http://apirel.aorise.org/visual-vis/api/vis',
    prod: 'http://apirel.aorise.org/visual-vis/api/vis'
  },
  // eas
  eas: {
    dev: '//apidev.aorise.org/visual-emi-report/api/rpt',
    test: '//apirel.aorise.org/visual-emi-report/api/rpt',
    prod: ''
  },
  // uem
  uem: {
    dev:"http://apidev.aorise.org/muem-duty/api",
    test: 'http://apirel.aorise.org/muem-duty/api',
    prod: ''
  },
  // uem
  rel: {
    // dev: "http://10.116.64.154:8081/api",
    dev: "http://apidev.aorise.org/muem-resource/api",
    test: 'http://apirel.aorise.org/muem-resource/api',
    prod: ''
  },
  // rms
  rms: {
    dev: "http://10.116.65.78:8084/api",
    test: 'http://10.116.65.78:8084/api',
    prod: ''
  },
};
let ENV_API = process.env.VUE_APP_API;
if (!ENV_API) { ENV_API = 'dev'; }
let ajaxCtx = {};
for (let _key in oDomains) {
	ajaxCtx[_key] = oDomains[_key][ENV_API]
}

export { ajaxCtx }
// cookie名
export const cookieUserId = 'as.vlink.user_id'
export const cookieUserName = 'as.vlink.user_name'
// cookie默认有效时间（小时）
export const cookieTime = 24
//项目密钥
// export const proKey = "61a2db3855abee0a5f64e48fec92e309";
export const proKey = '6929abf1a9e5e555ec5ecab8f2cdd6b8'

// 高德地图 溆浦县 adcode
export const mapXupuxian = {
	adcode: '431224',
	name: '溆浦县',
	center: [110.685133, 27.907633],
}

let _wsEnv = location.protocol
let wsEventURL = ''
if (ENV_API == 'dev' || ENV_API == 'test') {
	wsEventURL = 'ws://apidev.aorise.org/smart-city-common/news/websocket'
} else if (ENV_API == 'prod') {
	if (_wsEnv === 'https:') {
		wsEventURL = 'wss://emi.zhihuixupu.com/server-common/news/websocket'
	} else {
		wsEventURL = 'ws://10.11.2.6/server-common/news/websocket'
	}
}

export const wsApprovalConfig = {
	wsUrl: wsEventURL,
	stompHeaders: {},
	apis: {
		approvalMsg: '/user/messagePush/message',//突发接报
		dutyMsg: '/topic/message/',//值班值守
	},
}
