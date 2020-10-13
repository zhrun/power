import request from '@/config/axios';

/**
 * getApprovePageList 突发事件审批信息分页列表接口
 * @param { data }
 */
export function getApprovePageList(data) {
  return request({
    url: '/event-approve-service/approve-page-list',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * getApproveDetail 突发事件核实信息详情接口
 * @param { data }
 */
export function getApproveDetail(data) {
  return request({
    url: '/event-approve-service/approve',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * putApproveDetail 突发事件审批信息修改接口
 * @param { data }
 */
export function putApproveDetail(data) {
  return request({
    url: '/event-approve-service/approve',
    method: 'put',
    mode: 'eas',
    data,
  })
}

/**
 * getCheckPageList 突发事件核实信息分页列表接口
 * @param { data }
 */
export function getCheckPageList(data) {
  return request({
    url: '/event-check-service/check-page-list',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * getCheckDetail 突发事件核实信息详情接口
 * @param { data }
 */
export function getCheckDetail(data) {
  return request({
    url: '/event-check-service/check',
    method: 'get',
    mode: 'eas',
    params: data,
  })
}

/**
 * getHandleUnit 获取处理单位列表
 * 
 */
export function getHandleUnit() {
  return request({
    url: '/event-approve-service/handle-unit',
    method: 'get',
    mode: 'eas',
  })
}

/**
 * getDutyPerson 获取当前值班人员列表
 * 
 */
export function getDutyPerson() {
  return request({
    url: '/event-check-service/duty-person',
    method: 'get',
    mode: 'eas',
  })
}

/**
 * getUnreadApproveCount 未读的审批任务数目统计
 * 
 */
export function getUnreadApproveCount() {
  return request({
    url: '/statistics-service/unread-approve-count',
    method: 'get',
    mode: 'eas',
  })
}

/**
 * getUnreadCheckCount 未读的核实任务数目统计
 * 
 */
export function getUnreadCheckCount() {
  return request({
    url: '/statistics-service/unread-check-count',
    method: 'get',
    mode: 'eas',
  })
}

/**
 * getUsersByRole 根据角色查找用户信息
 * @param { data }
 */
export function getUsersByRole(data) {
  return request({
    url: '/authServices/users-by-role',
    method: 'get',
    mode: 'auth',
    params: data,
  })
}