import request from '@/config/axios';
import { ajaxCtx } from '@/config/config.js'

/**
 * 获取部门列表数据
 * @param {*} data
 */
export function getDepartmentList(data) {
  return request({
    url: 'authServices/organInfos',
    params: data,
    method: 'get',
    mode: 'auth',
    // headers: { 'modename': '123' },
  });
}

/**
 * 判断用户是否重复
 * @param {*} data
 */
export function judgeUser(data) {
  return request({
    url: 'authServices/userRename',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 用户手机查详情
 * @param {*} data
 */
export function getUserDetail(data) {
  return request({
    url: 'authServices/users/userDetailInfo',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 判断单位负责人是否重复
 * @param {*} data
 */
export function judgeUserMange(data) {
  return request({
    url: '/authServices/organCharge',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 获取用户列表数据
 * @param {*} data
 */
export function getUserList(data) {
  return request({
    url: 'authServices/users',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 删除用户
 * @param {*} data
 */
export function delUser(params) {
  return request({
    url: 'authServices/user/' + params.uid + '?proKey=' + params.proKey,
    mode: 'auth',
    method: 'delete'
  });
}

/**
 * 重置密码
 * @param {*} data
 */
export function resetPwd(data) {
  return request({
    url: 'authServices/reset',
    mode: 'auth',
    data,
    method: 'put'
  });
}

/**
 * 编辑用户
 * @param {*} data
 */
export function updateUser(data) {
  return request({
    url: 'authServices/user',
    data: data,
    mode: 'auth',
    method: 'put'
  });
}

/**
 * 创建用户
 * @param {*} data
 */
export function createUser(data) {
  return request({
    url: 'authServices/user',
    data,
    mode: 'auth',
    method: 'post'
  });
}

/**
 * 获取角色列表数据
 * @param {*} data
 */
export function getRoleList(params) {
  return request({
    url: 'authServices/userRoles',
    params,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * @description: 查询岗位
 * @param 
 * @return: [] data 
 */
export function getJob(params) {
  return request({
    url: 'positionService/positionList',
    params,
    mode: 'auth',
    method: 'get'
  });
}

/**
 * 添加岗位
 * @param {*} data
 */
export function addJob(data) {
  return request({
    url: 'positionService/position',
    data,
    mode: 'auth',
    method: 'post'
  });
}

/**
 * 删除 岗位
 * @param {*} data
 */
export function deleteJob(data) {
  return request({
    url: 'positionService/position',
    params: data,
    mode: 'auth',
    method: 'delete'
  });
}

/**
 * getLogs
 * @param {*} data
 */
export function getLogs(data) {
  return request({
    url: 'event-check-service/check-page-list',
    params: data,
    method: 'get',
    mode: 'eas'
  });
}

/**
 * getUsers
 * @param {*} data
 */
export function getUsers(data) {
  return request({
    url: 'authServices/userList',
    params: data,
    method: 'get',
    mode: 'auth'
  });
}

/**
 * 获取突发事件信息详情
 * @param {*} data
 */
export function getCheckinfo(data) {
  return request({
    url: 'event-check-service/check',
    params: data,
    method: 'get',
    mode: 'eas'
  });
}

/**
 * 突发事件核实信息新增接口
 * @param {*} data
 */
export function setCheckInfo(data) {
  return request({
    url: 'event-check-service/check',
    data,
    method: 'post',
    mode: 'eas'
  });
}

export const fileUrl = ajaxCtx['eas'] + '/file-upload-service/new'

/* ========== 手动录入 ========== */
/**
 * manualList 获取手动录入接报分页列表
 * @param { data }
 */
export function manualList(data) {
  return request({
    url: '/event-check-service/check-page-list',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * manualDetails 事件详情
 * @param { data }
 */
export function manualDetails(data) {
  return request({
    url: '/event-check-service/check',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * manualUp 获取当前值班员和领导列表
 * @param { data }
 */
export function getDutyPerson(data) {
  return request({
    url: '/authServices/users-by-role',
    method: 'get',
    mode: 'auth',
    params: data,
  })
}

/**
 * manualUp 获取历史督办单位列表
 * @param { data }
 */
export function getDepts(data) {
  return request({
    url: '/event-check-service/supervision-unit-list',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * manualList 新增手动录入
 * @param { data }
 */
export function manualAdd(data) {
  return request({
    url: '/event-check-service/check',
    method: 'post',
    mode: 'eas',
    data,
  })
}

/**
 * manualList 修改手动录入
 * @param { data }
 */
export function manualUpdate(data) {
  return request({
    url: '/event-check-service/check',
    method: 'put',
    mode: 'eas',
    data,
  })
}

/* ========== 小程序参数 ========== */
/**
 * getprogramParams 问题反馈查询
 * @param { data }
 */
export function getprogramParams(data) {
  return request({
    url: '/params-service/param-list',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

export function setprogramParams(data) {
  return request({
    url: '/params-service/param',
    method: 'post',
    mode: 'eas',
    data,
  })
}
/* ========== 其他参数 ========== */
/**
 * otherParams 问题反馈查询
 * @param { data }
 */
export function otherParams(data) {
  return request({
    url: '/params-service/param',
    method: 'post',
    mode: 'eas',
    params: data,
  })
}

/* ========== 统计分析 ========== */
/**
 * getDaysOverview 近7日概况统计接口
 * 
 */
export function getDaysOverview(data) {
  return request({
    url: '/statistics-service/7days-overview',
    method: 'get',
    params: data,
    // data,
    mode: 'eas'
  })
}

/**
 * getEventTrendOverview 事件发生趋势
 * 
 */
export function getEventTrendOverview(data) {
  return request({
    url: '/statistics-service/event-trend-overview',
    method: 'get',
    params: data,
    // data,
    mode: 'eas'
  })
}

/**
 * getTypeOverview 本周事件类型统计接口
 * 
 */
export function getTypeOverview(data) {
  return request({
    url: '/statistics-service/event-type-overview',
    method: 'get',
    params: data,
    // data,
    mode: 'eas'
  })
}

/**
 * getWorkOverview 各接报员工作情况接口
 * 
 */
export function getWorkOverview(data) {
  return request({
    url: '/statistics-service/receiver-work-overview',
    method: 'get',
    params: data,
    // data,
    mode: 'eas'
  })
}

/**
 * getTodayOverview 今日概况统计接口
 * 
 */
export function getTodayOverview(data) {
  return request({
    url: '/statistics-service/today-overview',
    method: 'get',
    params: data,
    // data,
    mode: 'eas'
  })
}

/* ========== 问题反馈 ========== */
/**
 * getFeedbackData 问题反馈查询
 * @param { data }
 */
export function getFeedbackData(data) {
  return request({
    url: '/feedback-service/feedback-info-page',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * getFeedbackExport 问题反馈导出
 * @param { data }
 */
export function getFeedbackExport(data) {
  return request({
    url: '/feedback-service/export',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * getAllDic
 * 获取全部字典值
 */
export function getAllDic() {
  return request({
    url: '/dictServices/dicts/byDictType',
    method: 'get',
    mode: 'vis'
  })
}

/**
* login
* 用户登录
* @param { data }
*/
export function login(data) {
  return request({
    url: '/authServices/users/login-with-validate-code',
    method: 'post',
    mode: "auth",
    data
  });
}

/**
* login
* 用户登录
* @param { data }
*/
export function loginNew(data) {
  return request({
    url: '/authServices/users/loginByAccount',
      data,
      mode: 'auth',
      method: 'post'
  });
}

/**
* imgValidateCode
* 验证码
*/
export function imgValidateCode(params) {
  return request({
    url: '/authServices/users/img-validate-code',
    method: 'get',
    mode: "auth",
    params
  });
}
/**
* getPublicKey
* 加密公钥
*/
export function getPublicKey(params) {
  return request({
    url: '/authServices/rsa/public-key',
    method: 'get',
    mode: "auth",
    params
  });
}

/**
* logout
* 用户退出
* @param { params }
*/
export function logout(params) {
  return request({
    url: '/duty/logout',
    method: 'post',
    mode: "uem",
    params
  });
}

/**
* 修改密码
* 
* @param { data }
*/
export function updatePass(data) {
  return request({
    url: '/authServices/password',
    method: 'put',
    mode: "auth",
    data
  });
}

/**
* getLimitLIst
* 获取用户权限列表
* @param { params }
*/
export function getLimitList(params) {
  return request({
    url: '/authServices/resource',
    method: 'get',
    mode: "auth",
    params
  });
}

/**
* getValidateCode
* 获取手机验证码
* @param { params }
*/
export function getValidateCode(params) {
  return request({
    url: '/authServices/sms/code',
    method: 'post',
    mode: "auth",
    data: params
  });
}